import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerSessions,
} from "@backend/core/memory";
import { DashboardUpdate } from "@api-contract/subscription";

export const latestDashboardUpdate = (
  students: OnlineStudents,
  volunteers: OnlineVolunteers,
  volunteerStudentPairs: VolunteerSessions
): DashboardUpdate => {
  // get all volunteers
  // get all volunteers not in pairs -> not busy
  // get all volunteers in pairs -> busy

  // pending requests -> students that are not in pairs
  const freeVolunteers = Array.from(volunteers.keys())
    .filter((vId) => !volunteerStudentPairs.has(vId))
    .map<DashboardUpdate["onlineVolunteers"][number]>((v) => ({
      volunteerId: v,
      status: { status: "free" },
    }));
  const busyVolunteers = Array.from(volunteerStudentPairs.keys());

  const onlineVolunteers = freeVolunteers;
  for (const v of busyVolunteers) {
    const chattingWith = volunteerStudentPairs.get(v);
    if (!chattingWith) {
      continue;
    }
    onlineVolunteers.push({
      volunteerId: v,
      status: {
        status: "busy",
        chattingWith: chattingWith.studentId,
      },
    });
  }

  const pairedStudents = new Set(
    Array.from(volunteerStudentPairs.values()).map((s) => s.studentId)
  );
  const pendingRequests = Array.from(students.keys())
    .filter((sId) => !pairedStudents.has(sId))
    .map<DashboardUpdate["pendingRequests"][number]>((r) => ({
      studentId: r,
    }));

  return {
    onlineVolunteers,
    pendingRequests,
  };
};
