import type { AppTRPC } from "@backend/router/context";
import { TRPCError } from "@trpc/server";

export const makeTRPCRouterGuards = (t: AppTRPC) => {
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

    if (ctx.ctx.auth.type !== "volunteer") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const username = ctx.ctx.auth.username;

    if (username === null) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        auth: {
          ...ctx.ctx.auth,
          username,
        },
      },
    });
  });

  return {
    guardHasStudentSocket,
    guardHasVolunteerSocket,
    guardIsAuthedAsVolunteer,
  };
};

export type AppTRPCGuards = ReturnType<typeof makeTRPCRouterGuards>;
