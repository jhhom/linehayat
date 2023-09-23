import { StudentId, VolunteerId } from "@api-contract/types";
import { VolunteerSessions } from "@backend/core/memory";

export const findVolunteerPairOfStudent = (
  volunteerStudentPairs: VolunteerSessions,
  studentId: StudentId
): VolunteerId | undefined => {
  const pair = Array.from(volunteerStudentPairs.entries()).find(
    (x) => x[1].studentId === studentId
  );
  if (pair) {
    return pair[0];
  }
  return undefined;
};
