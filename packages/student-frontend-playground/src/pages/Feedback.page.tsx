import { createSignal, type Component } from "solid-js";
import { StarRating } from "~/lib/StarRating/StarRating";

export function FeedbackPage() {
  return <FeedbackPageContent />;
}

function FeedbackPageContent() {
  // const FeedbackContent = FeedbackThankyou;
  const FeedbackContent = FeedbackForm;

  return (
    <div>
      <div class="h-16 w-full bg-blue-100">
        <div class="container mx-auto flex h-full items-center">
          <p>Navbar</p>
        </div>
      </div>

      <div class="container mx-auto">
        <div class="w-full">
          <div class="mt-3 flex items-center">
            <div class="h-12 w-12 p-1">
              <img class="h-12 w-12" src="chat-bubbles.svg" />
            </div>
            <p class="ml-2 h-12 pt-4 text-lg">LineHayat Live Chat</p>
          </div>

          <div class="mt-4 h-[640px] w-full">
            <FeedbackContent />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackThankyou() {
  return (
    <div class="flex h-full w-full items-center justify-center rounded-md  pt-4 text-center">
      <p>Thanks for your feedback! Have a great day!</p>
    </div>
  );
}

function FeedbackForm() {
  const [rating, setRating] = createSignal(0);

  // Catch Rating value
  const handleRating = (rate: number) => {
    setRating(rate);

    // other logic
  };
  // Optinal callback functions
  const onPointerEnter = () => console.log("Enter");
  const onPointerLeave = () => console.log("Leave");
  const onPointerMove = (value: number, index: number) => {
    // console.log(value, index);
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
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onPointerMove={onPointerMove}
              />
            </div>
          </div>
        </div>

        <div class="mt-16 flex justify-between">
          <button class="rounded-md bg-blue-100 px-4 py-2">Cancel</button>
          <button class="rounded-md bg-green-600 px-4 py-2 text-white">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
