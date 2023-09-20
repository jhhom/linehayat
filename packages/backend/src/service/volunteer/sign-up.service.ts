import { ServiceResult } from "@api-contract/types";
import { DB } from "@backend/core/schema";
import { Kysely } from "kysely";
import { OnlineVolunteers } from "@backend/core/memory";
import { VolunteerSocket, Context } from "@backend/router/context";
import { AppError } from "@api-contract/errors";
import { fromPromise, ok, err } from "neverthrow";

export async function signUp(
  {
    db,
  }: {
    db: Kysely<DB>;
  },
  input: {
    username: string;
    password: string;
    email: string;
  }
): ServiceResult<"volunteer/sign_up"> {
  // TODO: check if username / email is already used, if they are return specific error codes

  const insertion = await fromPromise(
    db
      .insertInto("volunteers")
      .values({
        username: input.username,
        password: input.password,
        email: input.email,
        isApproved: false,
      })
      .execute(),
    (e) => new AppError("DATABASE", { cause: e })
  );

  if (insertion.isErr()) {
    return err(insertion.error);
  }

  return ok({ message: "Volunteer signed-up" });
}
