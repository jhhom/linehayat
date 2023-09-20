import type { ServiceInput, ServiceResult } from "@api-contract/types";
import { ok, err } from "neverthrow";
import { AppError } from "@api-contract/errors";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import { fromPromise } from "neverthrow";

export async function editVolunteerStatus(
  {
    db,
  }: {
    db: Kysely<DB>;
  },
  arg: ServiceInput<"admin/edit_volunteer_status">
): ServiceResult<"admin/edit_volunteer_status"> {
  const r = await fromPromise(
    db
      .updateTable("volunteers")
      .set({
        isApproved: arg.isApproved,
      })
      .where("username", "=", arg.username)
      .returning("isApproved")
      .executeTakeFirstOrThrow(),
    (e) => e
  );
  if (r.isErr()) {
    return err(new AppError("DATABASE", { cause: r.error }));
  }
  return ok({
    updatedApprovalStatus: r.value.isApproved,
  });
}
