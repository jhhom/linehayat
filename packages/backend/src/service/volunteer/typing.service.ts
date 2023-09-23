import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerSessions,
} from "@backend/core/memory";
import type { ServiceResult, VolunteerId } from "@api-contract/types";
import { ok } from "neverthrow";

export async function typing(
  {
    onlineStudents,
    volunteerSessions,
  }: {
    db: Kysely<DB>;
    onlineStudents: OnlineStudents;
    onlineVolunteers: OnlineVolunteers;
    volunteerSessions: VolunteerSessions;
  },
  volunteerCtx: {
    volunteerId: VolunteerId;
  },
  arg: {
    typing: boolean;
  }
): ServiceResult<"volunteer/typing"> {
  const session = volunteerSessions.get(volunteerCtx.volunteerId);
  if (session) {
    const student = onlineStudents.get(session.studentId);
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
