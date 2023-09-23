import {
  volunteerUsernameToId,
  type OnlineVolunteers,
  onlineStudents,
  volunteerSessions,
  OnlineStudents,
  VolunteerSessions,
} from "@backend/core/memory";
import type { ServiceResult, StudentId } from "@api-contract/types";
import { ok, err } from "neverthrow";
import { AppError } from "@api-contract/errors";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import { latestDashboardUpdate } from "@backend/service/common/dashboard";
import { broadcastToVolunteers } from "@backend/core/memory";

export async function acceptRequest(
  {
    db,
    onlineStudents,
    onlineVolunteers,
    volunteerSessions,
    jwtKey,
  }: {
    db: Kysely<DB>;
    onlineStudents: OnlineStudents;
    onlineVolunteers: OnlineVolunteers;
    volunteerSessions: VolunteerSessions;
    jwtKey: string;
  },
  input: {
    volunteerUsername: string;
    studentId: StudentId;
  }
): ServiceResult<"volunteer/accept_request"> {
  const volunteerId = volunteerUsernameToId(input.volunteerUsername);
  if (volunteerSessions.has(volunteerId)) {
    return err(
      new AppError("UNKNOWN", {
        cause: "Volunteer is busy, cannot accept any request",
      })
    );
  }

  const socket = onlineStudents.get(input.studentId);
  if (socket === undefined) {
    return err(new AppError("UNKNOWN", { cause: "student socket not found" }));
  }

  socket.next({ event: "student.request_accepted", payload: {} });

  volunteerSessions.set(volunteerId, {
    studentId: input.studentId,
    sessionStartTime: new Date(),
  });

  broadcastToVolunteers(onlineVolunteers, {
    event: "volunteer.dashboard_update",
    payload: latestDashboardUpdate(
      onlineStudents,
      onlineVolunteers,
      volunteerSessions
    ),
  });

  return ok({ message: "Successfully accepted request" });
}
