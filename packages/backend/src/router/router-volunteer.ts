import { AppTRPC } from "@backend/router/context";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerStudentPairs,
  broadcastToVolunteers,
} from "@backend/core/memory";

import { VolunteerSocket } from "@backend/router/context";
import { volunteerUsernameToId } from "@backend/core/memory";
import { observable } from "@trpc/server/observable";
import { VolunteerSubscriptionMessage } from "@api-contract/subscription";
import { AppTRPCGuards } from "@backend/router/guards";

import { contract } from "@api-contract/endpoints";

import * as volunteerService from "@backend/service/volunteer";
import { latestDashboardUpdate } from "@backend/service/common/dashboard";

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
    volunteerStudentPairs,
  }: {
    db: Kysely<DB>;
    onlineVolunteers: OnlineVolunteers;
    onlineStudents: OnlineStudents;
    volunteerStudentPairs: VolunteerStudentPairs;
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
            broadcastToVolunteers(onlineVolunteers, {
              event: "volunteer.dashboard_update",
              payload: latestDashboardUpdate(
                onlineStudents,
                onlineVolunteers,
                volunteerStudentPairs
              ),
            });
          };

          return cleanup;
        };

        return observable<VolunteerSubscriptionMessage>(observableCallback);
      }
    ),
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
            volunteerStudentPairs,
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
          { db, onlineVolunteers, jwtKey: config.jwtKey },
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
  });
};

export type IAppVolunteerRouter = ReturnType<typeof makeVolunteerRouter>;
