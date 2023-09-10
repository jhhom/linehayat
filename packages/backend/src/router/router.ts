import { Kysely } from "kysely";

import { DB } from "@backend/core/schema";

import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerStudentPairs,
} from "@backend/core/memory";

import { makeTRPCRouterGuards } from "@backend/router/guards";
import { makeAppTRPC } from "@backend/router/context";

import { makeStudentRouter } from "@backend/router/router-student";
import { makeVolunteerRouter } from "@backend/router/router-volunteer";

const t = makeAppTRPC();
const guards = makeTRPCRouterGuards(t);

const router = t.router;
const procedure = t.procedure;

function initRouter(
  db: Kysely<DB>,
  {
    onlineStudents,
    onlineVolunteers,
    volunteerStudentPairs,
  }: {
    onlineVolunteers: OnlineVolunteers;
    onlineStudents: OnlineStudents;
    volunteerStudentPairs: VolunteerStudentPairs;
  },
  config: {
    jwtKey: string;
  }
) {
  const studentRouter = makeStudentRouter(
    {
      router,
      procedure,
      guardHasStudentSocket: guards.guardHasStudentSocket,
    },
    {
      db,
      onlineStudents,
      onlineVolunteers,
      volunteerStudentPairs,
    },
    {
      jwtKey: config.jwtKey,
    }
  );
  const volunteerRouter = makeVolunteerRouter(
    {
      router,
      procedure,
      guardIsAuthedAsVolunteer: guards.guardIsAuthedAsVolunteer,
      guardHasVolunteerSocket: guards.guardHasVolunteerSocket,
    },
    {
      db,
      onlineStudents,
      onlineVolunteers,
      volunteerStudentPairs,
    },
    {
      jwtKey: config.jwtKey,
    }
  );

  const mainRouter = t.mergeRouters(studentRouter, volunteerRouter);

  return mainRouter;
}

export { initRouter };

export type IAppRouter = ReturnType<typeof initRouter>;
