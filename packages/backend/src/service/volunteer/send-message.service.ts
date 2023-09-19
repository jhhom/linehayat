import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerStudentPairs,
  volunteerStudentPairs,
} from "@backend/core/memory";
import type {
  ServiceResult,
  StudentId,
  VolunteerId,
} from "@api-contract/types";
import { Context, StudentSocket } from "@backend/router/context";
import { findVolunteerPairOfStudent } from "@backend/service/common/pairs";
import { AppError } from "@api-contract/errors";
import { ok, err } from "neverthrow";
import { MessageInput } from "@api-contract/endpoints";
import { completeMediaUrl, saveMedia } from "@backend/service/common/media";
import { PROJECT_ROOT } from "@backend/config/config";

export async function sendMessage(
  {
    db,
    onlineStudents,
    onlineVolunteers,
    volunteerStudentPairs,
  }: {
    db: Kysely<DB>;
    onlineStudents: OnlineStudents;
    onlineVolunteers: OnlineVolunteers;
    volunteerStudentPairs: VolunteerStudentPairs;
  },
  volunteerCtx: {
    volunteerId: VolunteerId;
  },
  arg: MessageInput
): ServiceResult<"volunteer/send_message"> {
  const studentId = volunteerStudentPairs.get(volunteerCtx.volunteerId);

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

    if (studentId) {
      const student = onlineStudents.get(studentId);
      if (student) {
        student.next({
          event: "student.message",
          payload: {
            type: "voice",
            url,
          },
        });
      }
    }

    return ok({ type: "voice", url });
  } else {
    if (studentId) {
      const student = onlineStudents.get(studentId);
      if (student) {
        student.next({
          event: "student.message",
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
