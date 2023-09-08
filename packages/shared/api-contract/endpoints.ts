import { z } from "zod";

const volunteerContract = {
  "volunteer/login": {
    input: z.object({
      username: z.string(),
      password: z.string(),
    }),
    output: z.object({
      token: z.string(),
    }),
  },
};

const studentContract = {
  "student/make_request": {
    output: z.object({
      token: z.string(),
    }),
  },
};

export const contract = {
  ...volunteerContract,
  ...studentContract,
};

export type Contract = typeof contract;
