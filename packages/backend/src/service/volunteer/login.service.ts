import { OnlineVolunteers } from "~/core/context";
import type { ServiceResult } from "@api-contract/types";
import { ok, err } from "neverthrow";
import { AppError } from "../../../../shared/api-contract/errors";
import { Kysely } from "kysely";
import { DB } from "~/core/schema";
import { bcrypt, jwt } from "~/lib/lib";
import { JwtPayload } from "jsonwebtoken";
import { Socket } from "~/router/context";

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
    email: string;
    password: string;
    socket: Socket;
  }
): ServiceResult<"volunteer/login"> {
  const passwordResult = await db
    .selectFrom("volunteers")
    .select(["password"])
    .where("email", "=", input.email)
    .executeTakeFirst();
  if (passwordResult === undefined) {
    return err(new AppError("RESOURCE_NOT_FOUND", { resource: "volunteer" }));
  }

  if (passwordResult.password !== input.password) {
    return err(new AppError("AUTH.INCORRECT_PASSWORD", undefined));
  }

  const token = jwt.sign({ email: input.email } as JwtPayload, jwtKey, {
    expiresIn: "10000h",
  });
  if (token.isErr()) {
    console.log("ERROR", token.error);
    return err(new AppError("UNKNOWN", { cause: token.error }));
  }

  onlineVolunteers.set(input.email, input.socket);

  return ok({ token: token.value });
}
