import { Show, createSignal } from "solid-js";
import { StarRating } from "~/lib/StarRating/StarRating";
import { client } from "~/external/api-client/trpc";
import { useAppStore } from "~/stores/stores";
import { useNavigate } from "@solidjs/router";

export function FeedbackSubpage(props: { onFeedbackSubmitted: () => void }) {
  return (
    <div class="h-full w-full">
      <FeedbackForm onFeedbackSubmitted={props.onFeedbackSubmitted} />
    </div>
  );
}

function FeedbackForm(props: { onFeedbackSubmitted: () => void }) {
  let textRef!: HTMLTextAreaElement;
  const store = useAppStore((s) => s);
  const [rating, setRating] = createSignal(0);
  const navigate = useNavigate();

  // Catch Rating value
  const handleRating = (rate: number) => {
    setRating(rate);
  };

  return (
    <div class="h-full w-full rounded-md pt-4">
      <div class="pl-4">
        <p class="text-lg">Feedback</p>
        <p>
          How was the session? Kindly leave your feedbacks! We would love to
          hear it.
        </p>
      </div>

      <div class="mx-auto mt-8 h-[480px]  w-[400px] rounded-md border  px-4 pb-4 pt-2">
        <div class="mt-4">
          <p>Comment</p>
          <textarea
            ref={textRef}
            rows="6"
            class="mt-2 w-full resize-none rounded-md border px-2 py-2"
          />
        </div>

        <div class="mt-6">
          <p>Rating</p>
          <div>
            <div class="mt-0.5 flex justify-center">
              <StarRating
                allowFraction
                allowHover
                initialValue={rating()}
                onClick={handleRating}
              />
            </div>
          </div>
        </div>

        <div class="mt-16 flex justify-between">
          <button class="rounded-md bg-blue-100 px-4 py-2">Cancel</button>
          <button
            onClick={async () => {
              if (store.feedbackId.feedbackId !== null) {
                const r = await client["student/submit_feedback"]({
                  comment: textRef.value,
                  feedbackId: store.feedbackId.feedbackId,
                  rating: rating(),
                });
                if (r.isErr()) {
                  alert(`Failed to submit feedback: ${r.error}`);
                  navigate("/");
                  return;
                }
                props.onFeedbackSubmitted();
                store.setFeedbackId("feedbackId", null);
              } else {
                navigate("/");
              }
            }}
            class="rounded-md bg-green-600 px-4 py-2 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
