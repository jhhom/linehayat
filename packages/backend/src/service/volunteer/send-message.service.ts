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
  volunteerCtx: {
    volunteerId: VolunteerId;
  },
  arg: {
    message: string;
  }
): ServiceResult<"volunteer/send_message"> {
  const studentId = volunteerStudentPairs.get(volunteerCtx.volunteerId);
  if (studentId) {
    const student = onlineStudents.get(studentId);
    if (student) {
      student.next({
        event: "student.message",
        payload: {
          message: arg.message,
        },
      });
    }
  }

  return ok({ message: "Message successfully sent" });
}
