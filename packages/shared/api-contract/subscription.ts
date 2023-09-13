import { VolunteerId, StudentId } from "@api-contract/types";
import { zVolunteerId, zStudentId } from "@api-contract/types";
import { z } from "zod";

export type StudentSubscriptionMessage = {
  [k in keyof StudentSubscriptionEventPayload]: {
    event: k;
    payload: StudentSubscriptionEventPayload[k];
  };
}[keyof StudentSubscriptionEventPayload];

export type StudentSubscriptionEventPayload = {
  "student.hanged_up": {};
  "student.request_accepted": {};
  "student.volunteer_disconnected": {};
  "student.message": {
    message: string;
  };
  "student.volunteer_typing": {
    typing: boolean;
  };
};

export type VolunteerSubscriptionMessage = {
  [k in keyof VolunteerSubscriptionEventPayload]: {
    event: k;
    payload: VolunteerSubscriptionEventPayload[k];
  };
}[keyof VolunteerSubscriptionEventPayload];

export type VolunteerSubscriptionEventPayload = {
  "volunteer.hanged_up": {};
  "volunteer.dashboard_update": DashboardUpdate;
  "volunteer.student_disconnected": {};
  "volunteer.message": {
    message: string;
  };
  "volunteer.student_typing": {
    typing: boolean;
  };
};

export const zDashboardUpdateSchema = z.object({
  onlineVolunteers: z.array(
    z.object({
      volunteerId: zVolunteerId,
      status: z.discriminatedUnion("status", [
        z.object({
          status: z.literal("free"),
        }),
        z.object({
          status: z.literal("busy"),
          chattingWith: zStudentId,
        }),
      ]),
    })
  ),
  pendingRequests: z.array(
    z.object({
      studentId: zStudentId,
    })
  ),
});

export type DashboardUpdate = z.infer<typeof zDashboardUpdateSchema>;
