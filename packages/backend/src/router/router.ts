import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";
import { IContext, VolunteerSocket, StudentSocket } from "./context";
import { Kysely } from "kysely";

import { DB } from "~/core/schema";
import { observable } from "@trpc/server/observable";

import { contract } from "@api-contract/endpoints";
import {
  StudentSubscriptionMessage,
  VolunteerSubscriptionMessage,
} from "@api-contract/subscription";
import { OnlineStudents, OnlineVolunteers } from "~/core/memory";

import { volunteerUsernameToId } from "~/core/memory";
import * as volunteerService from "~/service/volunteer";

const t = initTRPC.context<IContext>().create({
  transformer: superjson,
});

const router = t.router;
const procedure = t.procedure;

const guardHasStudentSocket = t.middleware(async ({ ctx, next }) => {
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

const guardHasVolunteerSocket = t.middleware(async ({ ctx, next }) => {
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

const guardIsAuthedAsVolunteer = t.middleware(async ({ ctx, next }) => {
  if (!ctx.ctx.auth?.socket) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (ctx.ctx.auth.type !== "volunteer" || ctx.ctx.auth.username === null) {
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
    ["student/register_socket"]: procedure.subscription(
      async ({ input, ctx }) => {
        const observableCallback = (emit: StudentSocket) => {
          ctx.ctx.setAuth({
            type: "student",
            socket: emit,
            studentId: null,
          });

          const cleanup = async () => {
            if (ctx.ctx.auth !== null) {
              if (
                ctx.ctx.auth.type === "volunteer" &&
                ctx.ctx.auth.username !== null
              ) {
                const removal = onlineVolunteers.delete(
                  volunteerUsernameToId(ctx.ctx.auth.username)
                );
              } else if (
                ctx.ctx.auth.type === "student" &&
                ctx.ctx.auth.studentId !== null
              ) {
                onlineStudents.delete(ctx.ctx.auth.studentId);
              }
            }
            ctx.ctx.setAuth(null);
          };

          return cleanup;
        };

        return observable<StudentSubscriptionMessage>(observableCallback);
      }
    ),
    ["volunteer/register_socket"]: procedure.subscription(
      async ({ input, ctx }) => {
        const observableCallback = (emit: VolunteerSocket) => {
          ctx.ctx.setAuth({
            type: "volunteer",
            socket: emit,
            username: null,
          });

          const cleanup = async () => {
            if (ctx.ctx.auth !== null) {
              if (
                ctx.ctx.auth.type === "volunteer" &&
                ctx.ctx.auth.username !== null
              ) {
                const removal = onlineVolunteers.delete(
                  volunteerUsernameToId(ctx.ctx.auth.username)
                );
              } else if (
                ctx.ctx.auth.type === "student" &&
                ctx.ctx.auth.studentId !== null
              ) {
                onlineStudents.delete(ctx.ctx.auth.studentId);
              }
            }
            ctx.ctx.setAuth(null);
          };

          return cleanup;
        };

        return observable<VolunteerSubscriptionMessage>(observableCallback);
      }
    ),
    ["volunteer/login"]: procedure
      .use(guardIsAuthedAsVolunteer)
      .input(contract["volunteer/login"].input)
      .output(contract["volunteer/login"].output)
      .mutation(async ({ input, ctx }) => {
        const result = await volunteerService.login(
          { db, onlineVolunteers, jwtKey: config.jwtKey },
          {
            username: input.username,
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
          username: input.username,
        });

        return result.value;
      }),
  
  });

  return mainRouter;
}

export { initRouter };

export type IAppRouter = ReturnType<typeof initRouter>;
