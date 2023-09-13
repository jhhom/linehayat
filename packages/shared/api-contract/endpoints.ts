import { z } from "zod";
import { zDashboardUpdateSchema } from "@api-contract/subscription";
import { zStudentId } from "@api-contract/types";

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
    input: z.object({
      message: z.string(),
    }),
    output: z.object({
      message: z.string(),
    }),
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
};

const studentContract = {
  "student/make_request": {
    output: z.object({
      token: z.string(),
    }),
  },
  "student/send_message": {
    input: z.object({
      message: z.string(),
    }),
    output: z.object({
      message: z.string(),
    }),
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
