import { clsx as cx } from "clsx";

export function Hero(props: { class?: string }) {
  return (
    <div
      class={cx(
        "rounded-xl bg-gradient-to-b from-cyan-600/10 to-cyan-700/30 px-12 shadow-o-md",
        props.class,
      )}
    >
      <p class="text-center font-berkshire text-2xl">
        LineHayat Anonymous Chat Service - How it works?
      </p>
      <div class="mt-8 flex justify-between">
        <Step
          imgUrl="/home/carousel-live-chat-click.svg"
          caption="Click the 'live chat' button"
        />
        <Step
          imgUrl="/home/carousel-wait.svg"
          caption="Wait for your turn, you will be connected to a Listening Volunteer shortly."
        />
        <Step
          imgUrl="/home/carousel-chat-room.svg"
          caption="A chatroom will be opened when it reaches your turn."
        />
      </div>
    </div>
  );
}

function Step(props: { imgUrl: string; caption: string }) {
  return (
    <div class="basis-1/4">
      <img class="mx-auto" src={props.imgUrl} />
      <p class="text-center font-[PrintClearly] text-2xl text-yellow-900/90">
        {props.caption}
      </p>
    </div>
  );
}
