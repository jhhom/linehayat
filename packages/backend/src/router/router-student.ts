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
import { cleanupSocket } from "@backend/service/common/socket";

import * as studentService from "@backend/service/student";

export const makeStudentRouter = (
  {
    router,
    procedure,
    guardHasStudentSocket,
    guardIsAuthedAsStudent,
  }: {
    router: AppTRPC["router"];
    procedure: AppTRPC["procedure"];
    guardHasStudentSocket: AppTRPCGuards["guardHasStudentSocket"];
    guardIsAuthedAsStudent: AppTRPCGuards["guardIsAuthedAsStudent"];
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
            cleanupSocket(ctx.ctx, {
              onlineStudents,
              onlineVolunteers,
              volunteerStudentPairs,
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
        const result = await studentService.makeRequest(
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
    ["student/send_message"]: procedure
      .use(guardIsAuthedAsStudent)
      .input(contract["student/send_message"].input)
      .output(contract["student/send_message"].output)
      .mutation(async ({ input, ctx }) => {
        const result = await studentService.sendMessage(
          {
            db,
            onlineStudents,
            onlineVolunteers,
            volunteerStudentPairs,
          },
          {
            studentId: ctx.auth.studentId,
          },
          input
        );

        if (result.isErr()) {
          throw result.error;
        }

        return result.value;
      }),
    ["student/hang_up"]: procedure
      .use(guardIsAuthedAsStudent)
      .output(contract["student/hang_up"].output)
      .mutation(async ({ input, ctx }) => {
        const result = await studentService.hangUp(
          {
            db,
            onlineStudents,
            onlineVolunteers,
            volunteerStudentPairs,
          },
          {
            studentId: ctx.auth.studentId,
          }
        );

        if (result.isErr()) {
          throw result.error;
        }

        return result.value;
      }),
    ["student/typing"]: procedure
      .use(guardIsAuthedAsStudent)
      .input(contract["student/typing"].input)
      .output(contract["student/typing"].output)
      .mutation(async ({ input, ctx }) => {
        const r = await studentService.typing(
          { db, onlineStudents, onlineVolunteers, volunteerStudentPairs },
          { studentId: ctx.auth.studentId },
          { typing: input.typing }
        );
        if (r.isErr()) {
          throw r.error;
        }

        return r.value;
      }),
  });
};

export type IAppStudentRouter = ReturnType<typeof makeStudentRouter>;
