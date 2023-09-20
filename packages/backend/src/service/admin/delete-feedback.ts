import type { ServiceInput, ServiceResult } from "@api-contract/types";
import { ok, err } from "neverthrow";
import { AppError } from "@api-contract/errors";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import { fromPromise } from "neverthrow";

export async function deleteFeedback(
  {
    db,
  }: {
    db: Kysely<DB>;
  },
  arg: ServiceInput<"admin/delete_feedback">
): ServiceResult<"admin/delete_feedback"> {
  const r = await fromPromise(
    db.deleteFrom("feedbacks").where("id", "=", arg.feedbackId).execute(),
    (e) => e
  );
  if (r.isErr()) {
    return err(new AppError("DATABASE", { cause: r.error }));
  }
  return ok({
    message: "Volunteer is successfully deleted",
  });
}
