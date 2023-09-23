import { AppTRPC } from "@backend/router/context";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerSessions,
  broadcastToVolunteers,
} from "@backend/core/memory";

import { VolunteerSocket } from "@backend/router/context";
import { volunteerUsernameToId } from "@backend/core/memory";
import { observable } from "@trpc/server/observable";
import { VolunteerSubscriptionMessage } from "@api-contract/subscription";
import { AppTRPCGuards } from "@backend/router/guards";

import { contract } from "@api-contract/endpoints";

import * as volunteerService from "@backend/service/volunteer";
import { cleanupSocket } from "@backend/service/common/socket";

export const makeVolunteerRouter = (
  {
    router,
    procedure,
    guardIsAuthedAsVolunteer,
    guardHasVolunteerSocket,
  }: {
    router: AppTRPC["router"];
    procedure: AppTRPC["procedure"];
    guardIsAuthedAsVolunteer: AppTRPCGuards["guardIsAuthedAsVolunteer"];
    guardHasVolunteerSocket: AppTRPCGuards["guardHasVolunteerSocket"];
  },
  {
    db,
    onlineStudents,
    onlineVolunteers,
    volunteerSessions,
  }: {
    db: Kysely<DB>;
    onlineVolunteers: OnlineVolunteers;
    onlineStudents: OnlineStudents;
    volunteerSessions: VolunteerSessions;
  },
  config: {
    jwtKey: string;
  }
) => {
  return router({
    ["volunteer/register_socket"]: procedure.subscription(
      async ({ input, ctx }) => {
        const observableCallback = (emit: VolunteerSocket) => {
          ctx.ctx.setAuth({
            type: "volunteer",
            socket: emit,
            username: null,
          });

          const cleanup = async () => {
            cleanupSocket(ctx.ctx, {
              onlineStudents,
              onlineVolunteers,
              volunteerSessions,
            });
          };

          return cleanup;
        };

        return observable<VolunteerSubscriptionMessage>(observableCallback);
      }
    ),
    ["volunteer/sign_up"]: procedure
      .input(contract["volunteer/sign_up"].input)
      .output(contract["volunteer/sign_up"].output)
      .mutation(async ({ input, ctx }) => {
        const result = await volunteerService.signUp(
          {
            db,
          },
          {
            username: input.username,
            email: input.email,
            password: input.password,
          }
        );
        if (result.isErr()) {
          throw result.error;
        }
        return result.value;
      }),
    ["volunteer/accept_request"]: procedure
      .use(guardIsAuthedAsVolunteer)
      .input(contract["volunteer/accept_request"].input)
      .output(contract["volunteer/accept_request"].output)
      .mutation(async ({ input, ctx }) => {
        const result = await volunteerService.acceptRequest(
          {
            db,
            onlineStudents,
            onlineVolunteers,
            volunteerSessions,
            jwtKey: config.jwtKey,
          },
          {
            volunteerUsername: ctx.auth.username,
            studentId: input.studentId,
          }
        );
        if (result.isErr()) {
          throw result.error;
        }
        return result.value;
      }),
    ["volunteer/login"]: procedure
      .use(guardHasVolunteerSocket)
      .input(contract["volunteer/login"].input)
      .output(contract["volunteer/login"].output)
      .mutation(async ({ input, ctx }) => {
        const result = await volunteerService.login(
          { db, onlineVolunteers, jwtKey: config.jwtKey, volunteerSessions },
          {
            username: input.username,
            password: input.password,
            socket: ctx.auth.socket,
          },
          {
            socket: ctx.auth.socket,
            setAuth: (args) => ctx.ctx.setAuth(args),
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
    ["volunteer/send_message"]: procedure
      .use(guardIsAuthedAsVolunteer)
      .input(contract["volunteer/send_message"].input)
      .output(contract["volunteer/send_message"].output)
      .mutation(async ({ input, ctx }) => {
        const result = await volunteerService.sendMessage(
          {
            db,
            onlineStudents,
            onlineVolunteers,
            volunteerSessions,
          },
          {
            volunteerId: volunteerUsernameToId(ctx.auth.username),
          },
          input
        );
        if (result.isErr()) {
          throw result.error;
        }

        return result.value;
      }),
    ["volunteer/hang_up"]: procedure
      .use(guardIsAuthedAsVolunteer)
      .output(contract["volunteer/hang_up"].output)
      .mutation(async ({ input, ctx }) => {
        const result = await volunteerService.hangUp(
          {
            db,
            onlineStudents,
            onlineVolunteers,
            volunteerSessions,
          },
          {
            volunteerId: volunteerUsernameToId(ctx.auth.username),
          }
        );

        if (result.isErr()) {
          throw result.error;
        }

        return result.value;
      }),
    ["volunteer/typing"]: procedure
      .use(guardIsAuthedAsVolunteer)
      .input(contract["student/typing"].input)
      .output(contract["student/typing"].output)
      .mutation(async ({ input, ctx }) => {
        const r = await volunteerService.typing(
          { db, onlineStudents, onlineVolunteers, volunteerSessions },
          { volunteerId: volunteerUsernameToId(ctx.auth.username) },
          { typing: input.typing }
        );
        if (r.isErr()) {
          throw r.error;
        }

        return r.value;
      }),
  });
};

export type IAppVolunteerRouter = ReturnType<typeof makeVolunteerRouter>;
