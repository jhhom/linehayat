import { volunteerUsernameToId, type OnlineVolunteers } from "~/core/memory";
import type { ServiceResult } from "@api-contract/types";
import { ok, err } from "neverthrow";
import { AppError } from "@api-contract/errors";
import { Kysely } from "kysely";
import { DB } from "~/core/schema";
import { bcrypt, jwt } from "~/lib/lib";
import { JwtPayload } from "jsonwebtoken";
import { VolunteerSocket } from "~/router/context";

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
  }
): ServiceResult<"volunteer/login"> {
  const passwordResult = await db
    .selectFrom("volunteers")
    .select(["password"])
    .where("username", "=", input.username)
    .executeTakeFirst();
  if (passwordResult === undefined) {
    return err(new AppError("RESOURCE_NOT_FOUND", { resource: "volunteer" }));
  }

  if (passwordResult.password !== input.password) {
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

  return ok({ token: token.value });
}
