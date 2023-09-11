import { StudentId, VolunteerId } from "@api-contract/types";
import { VolunteerStudentPairs } from "@backend/core/memory";

export const findVolunteerPairOfStudent = (
  volunteerStudentPairs: VolunteerStudentPairs,
  studentId: StudentId
): VolunteerId | undefined => {
  const pair = Array.from(volunteerStudentPairs.entries()).find(
    (x) => x[1] === studentId
  );
  if (pair) {
    return pair[0];
  }
  return undefined;
};
