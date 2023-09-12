import {
  volunteerUsernameToId,
  type OnlineVolunteers,
  onlineStudents,
  volunteerStudentPairs,
  OnlineStudents,
  VolunteerStudentPairs,
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
    volunteerStudentPairs,
  }: {
    db: Kysely<DB>;
    onlineStudents: OnlineStudents;
    onlineVolunteers: OnlineVolunteers;
    volunteerStudentPairs: VolunteerStudentPairs;
  },
  input: {
    volunteerId: VolunteerId;
  }
): ServiceResult<"volunteer/hang_up"> {
  // notify student of the hang up
  const studentId = volunteerStudentPairs.get(input.volunteerId);
  if (studentId) {
    const socket = onlineStudents.get(studentId);
    if (socket) {
      socket.next({ event: "student.hanged_up", payload: {} });
    }

    onlineStudents.delete(studentId);
  }

  volunteerStudentPairs.delete(input.volunteerId);

  broadcastToVolunteers(onlineVolunteers, {
    event: "volunteer.dashboard_update",
    payload: latestDashboardUpdate(
      onlineStudents,
      onlineVolunteers,
      volunteerStudentPairs
    ),
  });

  return ok({ message: "Successfully hanged-up" });
}
