import type { ServiceInput, ServiceResult } from "@api-contract/types";
import { ok, err } from "neverthrow";
import { AppError } from "@api-contract/errors";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import { fromPromise } from "neverthrow";

export async function deleteVolunteer(
  {
    db,
  }: {
    db: Kysely<DB>;
  },
  arg: ServiceInput<"admin/delete_volunteer">
): ServiceResult<"admin/delete_volunteer"> {
  const r = await fromPromise(
    (async () => {
      await db
        .deleteFrom("feedbacks")
        .where(
          "feedbacks.volunteerId",
          "=",
          db
            .selectFrom("volunteers")
            .select("id")
            .where("volunteers.username", "=", arg.username)
        )
        .execute();

      return await db
        .deleteFrom("volunteers")
        .where("username", "=", arg.username)
        .execute();
    })(),
    (e) => e
  );
  if (r.isErr()) {
    return err(new AppError("DATABASE", { cause: r.error }));
  }
  return ok({
    message: "Volunteer is successfully deleted",
  });
}
