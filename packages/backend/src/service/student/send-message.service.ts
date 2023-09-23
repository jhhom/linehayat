import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerSessions,
} from "@backend/core/memory";
import type { ServiceResult, StudentId } from "@api-contract/types";
import { findVolunteerPairOfStudent } from "@backend/service/common/pairs";
import { completeMediaUrl } from "@backend/service/common/media";
import { ok, err } from "neverthrow";

import type { MessageInput } from "@api-contract/endpoints";
import { saveMedia } from "@backend/service/common/media";

import { PROJECT_ROOT } from "@backend/config/config";
import { AppError } from "@api-contract/errors";

export async function sendMessage(
  {
    db,
    onlineStudents,
    onlineVolunteers,
    volunteerSessions,
  }: {
    db: Kysely<DB>;
    onlineStudents: OnlineStudents;
    onlineVolunteers: OnlineVolunteers;
    volunteerSessions: VolunteerSessions;
  },
  studentCtx: {
    studentId: StudentId;
  },
  arg: MessageInput
): ServiceResult<"student/send_message"> {
  const volunteerId = findVolunteerPairOfStudent(
    volunteerSessions,
    studentCtx.studentId
  );

  if (arg.type === "voice") {
    const saveResult = await saveMedia(
      {
        filename: "recording.mp3",
        base64: arg.blobBase64,
        type: "message.audio",
      },
      {
        projectRoot: PROJECT_ROOT,
      }
    );
    if (saveResult.isErr()) {
      return err(
        new AppError("SAVE_MEDIA_FAILED", {
          media: "voice",
          cause: saveResult.error,
        })
      );
    }

    const url = completeMediaUrl(saveResult.value.assetPath);

    if (volunteerId) {
      const volunteer = onlineVolunteers.get(volunteerId);
      if (volunteer) {
        volunteer.next({
          event: "volunteer.message",
          payload: {
            type: "voice",
            url,
          },
        });
      }
    }

    return ok({ type: "voice", url });
  } else {
    if (volunteerId) {
      const volunteer = onlineVolunteers.get(volunteerId);
      if (volunteer) {
        volunteer.next({
          event: "volunteer.message",
          payload: {
            type: "text",
            content: arg.content,
          },
        });
      }
    }

    return ok({ type: "text", content: arg.content });
  }
}
