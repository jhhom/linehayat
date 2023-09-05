import { z } from "zod";

const volunteerContract = {
  "volunteer/login": {
    input: z.object({
      email: z.string(),
      password: z.string(),
    }),
    output: z.object({
      token: z.string(),
    }),
  },
};

export const contract = {
  ...volunteerContract,
};

export type Contract = typeof contract
