import type { ServiceResult } from "@api-contract/types";
import { ok, err } from "neverthrow";
import { AppError } from "@api-contract/errors";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import { fromPromise } from "neverthrow";

export async function listVolunteers({
  db,
}: {
  db: Kysely<DB>;
}): ServiceResult<"admin/list_volunteers"> {
  const r = await fromPromise(
    db.selectFrom("volunteers").selectAll().execute(),
    (e) => e
  );
  if (r.isErr()) {
    return err(new AppError("DATABASE", { cause: r.error }));
  }
  return ok(r.value);
}
