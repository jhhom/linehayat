import type { ServiceInput, ServiceResult } from "@api-contract/types";
import { ok, err } from "neverthrow";
import { AppError } from "@api-contract/errors";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import { fromPromise } from "neverthrow";

import { feedbacks } from "@backend/core/memory";

export async function submitFeedback(
  {
    db,
  }: {
    db: Kysely<DB>;
  },
  arg: ServiceInput<"student/submit_feedback">
): ServiceResult<"student/submit_feedback"> {
  const feedback = feedbacks.get(arg.feedbackId);
  if (!feedback) {
    return err(new AppError("UNKNOWN", { cause: "feedback id not found" }));
  }

  const volunteerId = await fromPromise(
    db
      .selectFrom("volunteers")
      .select("id")
      .where("username", "=", feedback.volunteerUsername)
      .executeTakeFirstOrThrow(),
    (e) => new AppError("DATABASE", { cause: e })
  );
  if (volunteerId.isErr()) {
    return err(volunteerId.error);
  }

  const r = await fromPromise(
    db
      .insertInto("feedbacks")
      .values({
        comment: arg.comment,
        rating: arg.rating,
        sessionEnd: feedback.sessionEnd,
        sessionStart: feedback.sessionStart,
        volunteerId: volunteerId.value.id,
      })
      .execute(),
    (e) => new AppError("DATABASE", { cause: e })
  );
  if (r.isErr()) {
    return err(r.error);
  }

  return ok({
    message: "Feedback submitted",
  });
}
