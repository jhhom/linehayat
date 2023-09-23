import {
  type OnlineVolunteers,
  OnlineStudents,
  VolunteerSessions,
  addFeedbackId,
  volunteerIdToUsername,
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
import { findVolunteerPairOfStudent } from "@backend/service/common/pairs";

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
    studentId: StudentId;
  }
): ServiceResult<"student/hang_up"> {
  const volunteerId = findVolunteerPairOfStudent(
    volunteerSessions,
    input.studentId
  );
  let feedbackId = "";
  if (volunteerId) {
    const session = volunteerSessions.get(volunteerId);

    if (session) {
      feedbackId = addFeedbackId({
        volunteerUsername: volunteerIdToUsername(volunteerId),
        sessionStart: session.sessionStartTime,
        sessionEnd: new Date(),
      });
    }

    volunteerSessions.delete(volunteerId);

    // notify volunteer of the hang up
    const socket = onlineVolunteers.get(volunteerId);
    if (socket) {
      socket.next({ event: "volunteer.hanged_up", payload: {} });
    }
  }

  onlineStudents.delete(input.studentId);

  broadcastToVolunteers(onlineVolunteers, {
    event: "volunteer.dashboard_update",
    payload: latestDashboardUpdate(
      onlineStudents,
      onlineVolunteers,
      volunteerSessions
    ),
  });

  return ok({ message: "Successfully hanged-up", feedbackId });
}
