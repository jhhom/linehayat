import {
  volunteerUsernameToId,
  type OnlineVolunteers,
  onlineStudents,
  volunteerStudentPairs,
  OnlineStudents,
  VolunteerStudentPairs,
} from "@backend/core/memory";
import type { ServiceResult, StudentId } from "@api-contract/types";
import { ok, err } from "neverthrow";
import { AppError } from "@api-contract/errors";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import { jwt } from "@backend/lib/lib";
import { JwtPayload } from "jsonwebtoken";
import { VolunteerSocket } from "@backend/router/context";
import { fromPromise } from "neverthrow";
import { latestDashboardUpdate } from "@backend/service/common/dashboard";
import { broadcastToVolunteers } from "@backend/core/memory";

export async function acceptRequest(
  {
    db,
    onlineStudents,
    onlineVolunteers,
    volunteerStudentPairs,
    jwtKey,
  }: {
    db: Kysely<DB>;
    onlineStudents: OnlineStudents;
    onlineVolunteers: OnlineVolunteers;
    volunteerStudentPairs: VolunteerStudentPairs;
    jwtKey: string;
  },
  input: {
    volunteerUsername: string;
    studentId: StudentId;
  }
): ServiceResult<"volunteer/accept_request"> {
  const volunteerId = volunteerUsernameToId(input.volunteerUsername);
  if (volunteerStudentPairs.has(volunteerId)) {
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

  volunteerStudentPairs.set(volunteerId, input.studentId);

  broadcastToVolunteers(onlineVolunteers, {
    event: "volunteer.dashboard_update",
    payload: latestDashboardUpdate(
      onlineStudents,
      onlineVolunteers,
      volunteerStudentPairs
    ),
  });

  return ok({ message: "Successfully accepted request" });
}
