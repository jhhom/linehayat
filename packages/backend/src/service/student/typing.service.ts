import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerSessions,
} from "@backend/core/memory";
import type { ServiceResult, StudentId } from "@api-contract/types";
import { findVolunteerPairOfStudent } from "@backend/service/common/pairs";
import { ok } from "neverthrow";

export async function typing(
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
  arg: {
    typing: boolean;
  }
): ServiceResult<"student/typing"> {
  const volunteerId = findVolunteerPairOfStudent(
    volunteerSessions,
    studentCtx.studentId
  );
  if (volunteerId) {
    const volunteer = onlineVolunteers.get(volunteerId);
    if (volunteer) {
      volunteer.next({
        event: "volunteer.student_typing",
        payload: {
          typing: arg.typing,
        },
      });
    }
  }

  return ok({ message: "Typing notified" });
}
