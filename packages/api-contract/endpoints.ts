import { z } from "zod";

export const contract = {
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


