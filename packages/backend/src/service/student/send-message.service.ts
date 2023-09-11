import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerStudentPairs,
  volunteerStudentPairs,
} from "@backend/core/memory";
import type { ServiceResult, StudentId } from "@api-contract/types";
import { Context, StudentSocket } from "@backend/router/context";
import { findVolunteerPairOfStudent } from "@backend/service/common/pairs";
import { ok } from "neverthrow";

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
  studentCtx: {
    studentId: StudentId;
  },
  arg: {
    message: string;
  }
): ServiceResult<"student/send_message"> {
  const volunteerId = findVolunteerPairOfStudent(
    volunteerStudentPairs,
    studentCtx.studentId
  );
  if (volunteerId) {
    const volunteer = onlineVolunteers.get(volunteerId);
    if (volunteer) {
      volunteer.next({
        event: "volunteer.message",
        payload: {
          message: arg.message,
        },
      });
    }
  }

  return ok({ message: "Message successfully sent" });
}
