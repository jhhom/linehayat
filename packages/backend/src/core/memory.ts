import type { StudentSocket, VolunteerSocket } from "@backend/router/context";
import type { StudentId, VolunteerId } from "@api-contract/types";
import {
  VolunteerSubscriptionEventPayload,
  VolunteerSubscriptionMessage,
} from "@api-contract/subscription";
import { faker } from "@faker-js/faker";
import { hoursToMilliseconds, Interval, isBefore, subMinutes } from "date-fns";

export const volunteerUsernameToId = (username: string): VolunteerId =>
  `vl_${username}`;

export const volunteerIdToUsername = (volunteerId: VolunteerId): string => {
  return volunteerId.substring(3);
};

type Session = {
  studentId: StudentId;
  sessionStartTime: Date;
};

const onlineStudents = new Map<StudentId, StudentSocket>();
const onlineVolunteers = new Map<VolunteerId, VolunteerSocket>();
const volunteerSessions = new Map<VolunteerId, Session>();

export type OnlineStudents = typeof onlineStudents;
export type OnlineVolunteers = typeof onlineVolunteers;
export type VolunteerSessions = typeof volunteerSessions;

export const broadcastToVolunteers = (
  onlineVolunteers: OnlineVolunteers,
  message: VolunteerSubscriptionMessage
) => {
  onlineVolunteers.forEach((v) => {
    v.next(message);
  });
};

type FeedbackInfo = {
  volunteerUsername: string;
  sessionStart: Date;
  sessionEnd: Date;
};

export const feedbacks: Map<string, FeedbackInfo> = new Map();

function addFeedbackId(info: FeedbackInfo) {
  let feedbackId = faker.string.alphanumeric(20);
  while (feedbacks.has(feedbackId)) {
    feedbackId = faker.string.alphanumeric(20);
  }
  feedbacks.set(feedbackId, info);

  setTimeout(() => {
    const feedbackInfo = feedbacks.get(feedbackId);
    if (
      feedbackInfo &&
      moreThan45MinutesAgo(feedbackInfo.sessionEnd, new Date())
    ) {
      feedbacks.delete(feedbackId);
    }
  }, hoursToMilliseconds(1));

  return feedbackId;
}

export const moreThan45MinutesAgo = (date: Date, now: Date) => {
  const fortyFiveMinutesAgo = subMinutes(now, 45);
  return isBefore(date, fortyFiveMinutesAgo);
};

export { onlineStudents, onlineVolunteers, volunteerSessions, addFeedbackId };
