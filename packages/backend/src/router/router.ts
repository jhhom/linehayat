import { Kysely } from "kysely";

import { DB } from "@backend/core/schema";

import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerSessions,
} from "@backend/core/memory";

import { makeTRPCRouterGuards } from "@backend/router/guards";
import { makeAppTRPC } from "@backend/router/context";

import { makeStudentRouter } from "@backend/router/router-student";
import { makeVolunteerRouter } from "@backend/router/router-volunteer";
import { makeAdminRouter } from "@backend/router/router-admin";

const t = makeAppTRPC();
const guards = makeTRPCRouterGuards(t);

const router = t.router;
const procedure = t.procedure;

function initRouter(
  db: Kysely<DB>,
  {
    onlineStudents,
    onlineVolunteers,
    volunteerSessions,
  }: {
    onlineVolunteers: OnlineVolunteers;
    onlineStudents: OnlineStudents;
    volunteerSessions: VolunteerSessions;
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
      guardIsAuthedAsStudent: guards.guardIsAuthedAsStudent,
    },
    {
      db,
      onlineStudents,
      onlineVolunteers,
      volunteerSessions,
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
      volunteerSessions,
    },
    {
      jwtKey: config.jwtKey,
    }
  );
  const adminRouter = makeAdminRouter(
    { router, procedure, guardIsAuthedAsAdmin: guards.guardIsAuthedAsAdmin },
    { db },
    { jwtKey: config.jwtKey }
  );

  const mainRouter = t.mergeRouters(
    studentRouter,
    volunteerRouter,
    adminRouter
  );

  return mainRouter;
}

export { initRouter };

export type IAppRouter = ReturnType<typeof initRouter>;
