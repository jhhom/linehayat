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

  const guardIsAuthedAsStudent = t.middleware(async ({ ctx, next }) => {
    if (!ctx.ctx.auth?.socket) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (ctx.ctx.auth.type !== "student") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const studentId = ctx.ctx.auth.studentId;

    if (studentId === null) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        auth: {
          ...ctx.ctx.auth,
          studentId,
        },
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
    guardIsAuthedAsStudent,
  };
};

export type AppTRPCGuards = ReturnType<typeof makeTRPCRouterGuards>;
