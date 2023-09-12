import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerStudentPairs,
} from "@backend/core/memory";
import { Context } from "@backend/router/context";
import {
  broadcastToVolunteers,
  volunteerUsernameToId,
} from "@backend/core/memory";
import {} from "@backend/core/memory";
import { latestDashboardUpdate } from "@backend/service/common/dashboard";
import { findVolunteerPairOfStudent } from "@backend/service/common/pairs";

export function cleanupSocket(
  ctx: Context,
  {
    onlineStudents,
    onlineVolunteers,
    volunteerStudentPairs,
  }: {
    onlineStudents: OnlineStudents;
    onlineVolunteers: OnlineVolunteers;
    volunteerStudentPairs: VolunteerStudentPairs;
  }
) {
  if (ctx.auth !== null) {
    if (ctx.auth.type === "volunteer" && ctx.auth.username !== null) {
      const volunteerId = volunteerUsernameToId(ctx.auth.username);

      onlineVolunteers.delete(volunteerId);

      const studentId = volunteerStudentPairs.get(volunteerId);
      if (studentId) {
        const student = onlineStudents.get(studentId);
        if (student) {
          student.next({
            event: "student.volunteer_disconnected",
            payload: {},
          });
        }
        volunteerStudentPairs.delete(volunteerUsernameToId(ctx.auth.username));
      }
    } else if (ctx.auth.type === "student" && ctx.auth.studentId !== null) {
      const studentId = ctx.auth.studentId;
      onlineStudents.delete(studentId);

      const volunteerId = findVolunteerPairOfStudent(
        volunteerStudentPairs,
        studentId
      );
      if (volunteerId) {
        volunteerStudentPairs.delete(volunteerId);

        const volunteer = onlineVolunteers.get(volunteerId);
        if (volunteer) {
          volunteer.next({
            event: "volunteer.student_disconnected",
            payload: {},
          });
        }
      }
    }
  }

  ctx.setAuth(null);
  broadcastToVolunteers(onlineVolunteers, {
    event: "volunteer.dashboard_update",
    payload: latestDashboardUpdate(
      onlineStudents,
      onlineVolunteers,
      volunteerStudentPairs
    ),
  });
}
