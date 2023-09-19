import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerStudentPairs,
} from "@backend/core/memory";
import type { ServiceResult, VolunteerId } from "@api-contract/types";
import { ok } from "neverthrow";

export async function typing(
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
    typing: boolean;
  }
): ServiceResult<"volunteer/typing"> {
  const studentId = volunteerStudentPairs.get(volunteerCtx.volunteerId);
  if (studentId) {
    const student = onlineStudents.get(studentId);
    if (student) {
      student.next({
        event: "student.volunteer_typing",
        payload: {
          typing: arg.typing,
        },
      });
    }
  }

  return ok({ message: "Typing notified" });
}
