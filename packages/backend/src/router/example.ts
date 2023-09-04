import { z } from "zod";
import { router, publicProcedure } from "../trpc";

const ExampleRouter = router({
  exampleWithArgs: publicProcedure
    .input(
      z.object({
        message: z.string(),
      })
    )
    .mutation((req) => {
      return { info: req.input.message };
    }),

  example: publicProcedure.query(async ({ ctx }) => {
    return { info: 42 };
  }),

  registerSocket: publicProcedure.subscription(({ ctx }) => {
    
  }) 
});

export default ExampleRouter;
