import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";
import { IContext, Socket } from "./context";
import { Kysely } from "kysely";

import { DB } from "~/core/schema";
import { observable } from "@trpc/server/observable";

import { SubscriptionMessage } from "@api-contract/subscription";
import { contract } from "@api-contract/endpoints";
import { OnlineStudents, OnlineVolunteers } from "~/core/context";

import * as volunteerService from "~/service/volunteer";

const t = initTRPC.context<IContext>().create({
  transformer: superjson,
});

const router = t.router;
const procedure = t.procedure;

const isAuthedAsAnonymous = t.middleware(async ({ ctx, next }) => {
  if (!ctx.ctx.auth?.socket) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (ctx.ctx.auth.type !== "anonymous") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.ctx.auth,
    },
  });
});

const isAuthedAsStudent = t.middleware(async ({ ctx, next }) => {
  if (!ctx.ctx.auth?.socket) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (ctx.ctx.auth.type !== "student") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.ctx.auth,
    },
  });
});

const isAuthedAsVolunteer = t.middleware(async ({ ctx, next }) => {
  if (!ctx.ctx.auth?.socket) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (ctx.ctx.auth.type !== "volunteer") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.ctx.auth,
    },
  });
});

function initRouter(
  db: Kysely<DB>,
  {
    onlineStudents,
    onlineVolunteers,
  }: {
    onlineVolunteers: OnlineVolunteers;
    onlineStudents: OnlineStudents;
  },
  config: {
    jwtKey: string;
  }
) {
  const mainRouter = router({
    ["register_socket"]: procedure.subscription(async ({ input, ctx }) => {
      const observableCallback = (emit: Socket) => {
        ctx.ctx.setAuth({
          type: "anonymous",
          socket: emit,
        });

        const cleanup = async () => {
          if (ctx.ctx.auth !== null) {
            if (ctx.ctx.auth.type === "volunteer") {
              const removal = onlineVolunteers.delete(ctx.ctx.auth.email);
            } else if (ctx.ctx.auth.type === "student") {
              onlineStudents.delete(ctx.ctx.auth.studentId);
            }
          }
          ctx.ctx.setAuth(null);
        };

        return cleanup;
      };

      return observable<SubscriptionMessage>(observableCallback);
    }),
    ["volunteer/login"]: procedure
      .use(isAuthedAsAnonymous)
      .input(contract["volunteer/login"].input)
      .output(contract["volunteer/login"].output)
      .mutation(async ({ input, ctx }) => {
        const result = await volunteerService.login(
          { db, onlineVolunteers, jwtKey: config.jwtKey },
          {
            email: input.email,
            password: input.password,
            socket: ctx.auth.socket,
          }
        );

        if (result.isErr()) {
          throw result.error;
        }

        ctx.ctx.setAuth({
          type: "volunteer",
          socket: ctx.auth.socket,
          email: input.email,
        });

        return result.value;
      }),
  });

  return mainRouter;
}

export { initRouter };

export type IAppRouter = ReturnType<typeof initRouter>;
