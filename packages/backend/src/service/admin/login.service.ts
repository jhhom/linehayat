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
    jwtKey,
  }: {
    db: Kysely<DB>;
    jwtKey: string;
  },
  input: {
    username: string;
    password: string;
  },
  adminCtx: {
    setAuth: (args: Parameters<Context["setAuth"]>[0]) => void;
  }
): ServiceResult<"admin/login"> {
  const user = await fromPromise(
    db
      .selectFrom("admins")
      .select(["password", "username"])
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
    return err(new AppError("UNKNOWN", { cause: token.error }));
  }

  adminCtx.setAuth({ type: "admin", username: user.value.username });

  return ok({
    token: token.value,
  });
}
