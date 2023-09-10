import { AppTRPC } from "@backend/router/context";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerStudentPairs,
} from "@backend/core/memory";

import { StudentSocket } from "@backend/router/context";
import { volunteerUsernameToId } from "@backend/core/memory";
import { observable } from "@trpc/server/observable";
import { StudentSubscriptionMessage } from "@api-contract/subscription";
import { AppTRPCGuards } from "@backend/router/guards";

import { broadcastToVolunteers } from "@backend/core/memory";
import { latestDashboardUpdate } from "@backend/service/common/dashboard";

import { contract } from "@api-contract/endpoints";
import { makeRequest } from "@backend/service/student/make-request.service";

export const makeStudentRouter = (
  {
    router,
    procedure,
    guardHasStudentSocket,
  }: {
    router: AppTRPC["router"];
    procedure: AppTRPC["procedure"];
    guardHasStudentSocket: AppTRPCGuards["guardHasStudentSocket"];
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
    ["student/register_socket"]: procedure.subscription(
      async ({ input, ctx }) => {
        const observableCallback = (emit: StudentSocket) => {
          ctx.ctx.setAuth({
            type: "student",
            socket: emit,
            studentId: null,
          });

          const cleanup = async () => {
            console.log("CLEANING UP!!!");
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
                console.log("IS CLEAN STUDENT", ctx.ctx.auth.studentId);
                onlineStudents.delete(ctx.ctx.auth.studentId);
              }
            }
            ctx.ctx.setAuth(null);
            console.log("BROADCAST!!");
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

        return observable<StudentSubscriptionMessage>(observableCallback);
      }
    ),
    ["student/make_request"]: procedure
      .use(guardHasStudentSocket)
      .output(contract["student/make_request"].output)
      .mutation(async ({ input, ctx }) => {
        const result = await makeRequest(
          {
            db,
            onlineStudents,
            onlineVolunteers,
            volunteerStudentPairs,
            jwtKey: config.jwtKey,
          },
          {
            socket: ctx.auth.socket,
            setAuth: (args) => {
              ctx.ctx.setAuth(args);
            },
          }
        );

        if (result.isErr()) {
          throw result.error;
        }

        return result.value;
      }),
  });
};

export type IAppStudentRouter = ReturnType<typeof makeStudentRouter>;
