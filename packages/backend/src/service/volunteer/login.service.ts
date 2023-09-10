import {
  volunteerUsernameToId,
  type OnlineVolunteers,
  onlineStudents,
  volunteerStudentPairs,
} from "@backend/core/memory";
import type { ServiceResult } from "@api-contract/types";
import { ok, err } from "neverthrow";
import { AppError } from "@api-contract/errors";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import { jwt } from "@backend/lib/lib";
import { JwtPayload } from "jsonwebtoken";
import { VolunteerSocket } from "@backend/router/context";
import { fromPromise } from "neverthrow";
import { latestDashboardUpdate } from "@backend/service/common/dashboard";
import { broadcastToVolunteers } from "@backend/core/memory";

import type { Context } from "@backend/router/context";

export async function login(
  {
    db,
    onlineVolunteers,
    jwtKey,
  }: {
    db: Kysely<DB>;
    onlineVolunteers: OnlineVolunteers;
    jwtKey: string;
  },
  input: {
    username: string;
    password: string;
    socket: VolunteerSocket;
  },
  volunteerCtx: {
    socket: VolunteerSocket;
    setAuth: (args: Parameters<Context["setAuth"]>[0]) => void;
  }
): ServiceResult<"volunteer/login"> {
  const user = await fromPromise(
    db
      .selectFrom("volunteers")
      .select(["password", "username", "email"])
      .where("username", "=", input.username)
      .executeTakeFirst(),
    (e) => new AppError("DATABASE", { cause: e })
  );
  if (user.isErr()) {
    return err(user.error);
  }
  if (user.value === undefined) {
    return err(new AppError("RESOURCE_NOT_FOUND", { resource: "volunteer" }));
  }

  if (user.value.password !== input.password) {
    return err(new AppError("AUTH.INCORRECT_PASSWORD", undefined));
  }

  const token = jwt.sign({ username: input.username } as JwtPayload, jwtKey, {
    expiresIn: "10000h",
  });
  if (token.isErr()) {
    console.log("ERROR", token.error);
    return err(new AppError("UNKNOWN", { cause: token.error }));
  }

  onlineVolunteers.set(volunteerUsernameToId(input.username), input.socket);

  const dashboardUpdate = latestDashboardUpdate(
    onlineStudents,
    onlineVolunteers,
    volunteerStudentPairs
  );

  broadcastToVolunteers(onlineVolunteers, {
    event: "volunteer.dashboard_update",
    payload: dashboardUpdate,
  });

  volunteerCtx.setAuth({
    type: "volunteer",
    username: user.value.username,
    socket: volunteerCtx.socket,
  });

  return ok({
    token: token.value,
    username: user.value.username,
    email: user.value.email,
    latestDashboard: dashboardUpdate,
  });
}
