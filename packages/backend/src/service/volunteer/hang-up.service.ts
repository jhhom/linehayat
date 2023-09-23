import {
  type OnlineVolunteers,
  OnlineStudents,
  VolunteerSessions,
  addFeedbackId,
  volunteerIdToUsername,
  volunteerUsernameToId,
} from "@backend/core/memory";
import type {
  ServiceResult,
  StudentId,
  VolunteerId,
} from "@api-contract/types";
import { ok, err } from "neverthrow";
import { AppError } from "@api-contract/errors";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import { latestDashboardUpdate } from "@backend/service/common/dashboard";
import { broadcastToVolunteers } from "@backend/core/memory";

export async function hangUp(
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
  input: {
    volunteerId: VolunteerId;
  }
): ServiceResult<"volunteer/hang_up"> {
  // notify student of the hang up
  const session = volunteerSessions.get(input.volunteerId);
  if (session) {
    const socket = onlineStudents.get(session.studentId);
    const feedbackId = addFeedbackId({
      volunteerUsername: volunteerIdToUsername(input.volunteerId),
      sessionStart: session.sessionStartTime,
      sessionEnd: new Date(),
    });
    if (socket) {
      socket.next({ event: "student.hanged_up", payload: { feedbackId } });
    }

    addFeedbackId({
      volunteerUsername: volunteerIdToUsername(input.volunteerId),
      sessionStart: session.sessionStartTime,
      sessionEnd: new Date(),
    });

    onlineStudents.delete(session.studentId);
  }

  volunteerSessions.delete(input.volunteerId);

  broadcastToVolunteers(onlineVolunteers, {
    event: "volunteer.dashboard_update",
    payload: latestDashboardUpdate(
      onlineStudents,
      onlineVolunteers,
      volunteerSessions
    ),
  });

  return ok({ message: "Successfully hanged-up" });
}
