import type { StudentSocket, VolunteerSocket } from "@backend/router/context";
import type { StudentId, VolunteerId } from "@api-contract/types";
import {
  VolunteerSubscriptionEventPayload,
  VolunteerSubscriptionMessage,
} from "@api-contract/subscription";

export const volunteerUsernameToId = (username: string): VolunteerId =>
  `vl_${username}`;

const onlineStudents = new Map<StudentId, StudentSocket>();
const onlineVolunteers = new Map<VolunteerId, VolunteerSocket>();
const volunteerStudentPairs = new Map<VolunteerId, StudentId>();

export type OnlineStudents = typeof onlineStudents;
export type OnlineVolunteers = typeof onlineVolunteers;
export type VolunteerStudentPairs = typeof volunteerStudentPairs;

export const broadcastToVolunteers = (
  onlineVolunteers: OnlineVolunteers,
  message: VolunteerSubscriptionMessage
) => {
  onlineVolunteers.forEach((v) => {
    v.next(message);
  });
};

export { onlineStudents, onlineVolunteers, volunteerStudentPairs };
