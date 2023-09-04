import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";

const t = initTRPC.context().create({
  transformer: superjson,
});

const router = t.router;
const procedure = t.procedure;

const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!(ctx.ctx.socket && ctx.ctx.auth)) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ctx: {
        config: ctx.config,
        setAuth: (
          userId: UserId,
          username: string,
          email: string,
          socketId: string
        ) => ctx.ctx.setAuth(userId, username, email, socketId),
        resetAuth: () => ctx.ctx.resetAuth(),
        setSocket: (s: Socket | undefined) => ctx.ctx.setSocket(s),
        socket: ctx.ctx.socket,
        auth: ctx.ctx.auth,
        session: ctx.ctx.session,
        db: ctx.ctx.db,
      },
      opts: ctx.opts,
    },
  });
});
