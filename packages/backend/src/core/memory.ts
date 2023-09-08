import type { StudentSocket, VolunteerSocket } from "~/router/context";

export type StudentId = `st_${string}`;

// VolunteerId should be `vl_` followed by volunteer's username in the database
// e.g `vl_pineapple`
export type VolunteerId = `vl_${string}`;

export const volunteerUsernameToId = (username: string): VolunteerId =>
  `vl_${username}`;

const onlineStudents = new Map<StudentId, StudentSocket>();
const onlineVolunteers = new Map<VolunteerId, VolunteerSocket>();
const volunteerStudentPairs = new Map<VolunteerId, StudentId>();

export type OnlineStudents = typeof onlineStudents;
export type OnlineVolunteers = typeof onlineVolunteers;
export type VolunteerStudentPairs = typeof volunteerStudentPairs;

export { onlineStudents, onlineVolunteers, volunteerStudentPairs };
