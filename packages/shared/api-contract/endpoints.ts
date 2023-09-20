import { z } from "zod";
import { zDashboardUpdateSchema } from "@api-contract/subscription";
import { zMessage, zStudentId } from "@api-contract/types";

const zMessageInput = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    content: z.string(),
  }),
  z.object({
    type: z.literal("voice"),
    blobBase64: z.string(),
  }),
]);

const volunteerContract = {
  "volunteer/login": {
    input: z.object({
      username: z.string(),
      password: z.string(),
    }),
    output: z.object({
      token: z.string(),
      username: z.string(),
      email: z.string(),
      latestDashboard: zDashboardUpdateSchema,
    }),
  },
  "volunteer/accept_request": {
    input: z.object({
      studentId: zStudentId,
    }),
    output: z.object({
      message: z.string(),
    }),
  },
  "volunteer/send_message": {
    input: zMessageInput,
    output: zMessage,
  },
  "volunteer/hang_up": {
    output: z.object({
      message: z.string(),
    }),
  },
  "volunteer/typing": {
    input: z.object({
      typing: z.boolean(),
    }),
    output: z.object({
      message: z.string(),
    }),
  },
  "volunteer/sign_up": {
    input: z.object({
      username: z.string(),
      password: z.string(),
      email: z.string(),
    }),
    output: z.object({
      message: z.string(),
    }),
  },
};

const studentContract = {
  "student/make_request": {
    output: z.object({
      token: z.string(),
    }),
  },
  "student/send_message": {
    input: zMessageInput,
    output: zMessage,
  },
  "student/hang_up": {
    output: z.object({
      message: z.string(),
    }),
  },
  "student/typing": {
    input: z.object({
      typing: z.boolean(),
    }),
    output: z.object({
      message: z.string(),
    }),
  },
};

export const contract = {
  ...volunteerContract,
  ...studentContract,
};

export type Contract = typeof contract;

export type StudentContract = typeof studentContract;

export type VolunteerContract = typeof volunteerContract;

export type MessageInput = z.infer<typeof zMessageInput>;
