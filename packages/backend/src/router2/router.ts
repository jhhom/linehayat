import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";
import { IContext } from "./context";

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
