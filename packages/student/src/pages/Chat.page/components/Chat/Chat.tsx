import { useNavigate } from "@solidjs/router";
import { For, Show, onMount, createEffect } from "solid-js";

import { type Messages } from "~/stores/messages.store";
import { type Volunteer } from "~/stores/volunteer.store";

import { useIsTyping } from "~/pages/Chat.page/components/Chat/use-is-typing.hook";

export default function Chat(props: {
  volunteerStatus: Volunteer["status"];
  messages: Messages["messages"];
  onTyping: (isTyping: boolean) => void;
  onHangup: () => {};
  onSubmitMessage: (message: string) => void;
}) {
  return (
    <div class="h-full w-full">
      <div class="flex h-full w-full items-center justify-center">
        <Show when={props.volunteerStatus === "typing"}>
          <p>Volunteer is typing...</p>
        </Show>
        <ChatConversation
          messages={props.messages}
          onTyping={props.onTyping}
          onHangup={props.onHangup}
          onSubmitMessage={props.onSubmitMessage}
        />
      </div>
    </div>
  );
}

function ChatConversation(props: {
  messages: ConversationProps["messages"];
  onHangup: () => void;
  onSubmitMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
}) {
  let textRef!: HTMLInputElement;
  let conversationContainerRef!: HTMLDivElement;

  const { register, isTyping } = useIsTyping({ timeout: 1500 });

  const submitMessage = async () => {
    if (textRef.value === "") {
      return;
    }
    props.onSubmitMessage(textRef.value);

    textRef.value = "";
    conversationContainerRef.scrollTo(0, conversationContainerRef.scrollHeight);
  };

  onMount(() => {
    textRef.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        submitMessage();
      }
    });
  });

  createEffect(async () => {
    props.onTyping(isTyping());
  });

  return (
    <div>
      <div class="flex justify-end pb-2">
        <button
          onClick={props.onHangup}
          class="rounded-md bg-red-500 px-4 py-2 text-white"
        >
          Hang up
        </button>
      </div>
      <Conversation ref={conversationContainerRef} messages={props.messages} />
      <div class="flex">
        <input
          ref={(r) => {
            textRef = r;
            register(r);
          }}
          class="w-full rounded-bl-md border border-gray-300 px-2 py-1"
          type="text"
          name=""
          id=""
        />
        <button
          onClick={submitMessage}
          class="rounded-br-md bg-green-600 px-4 py-1 text-white"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

type ConversationProps = {
  ref: HTMLDivElement;
  messages: {
    content: string;
    userIsAuthor: boolean;
  }[];
};

function Conversation(props: ConversationProps) {
  return (
    <div
      ref={props.ref}
      class="flex h-[480px] w-[640px] flex-col space-y-2 overflow-y-auto  rounded-t-md border bg-gray-100 px-2 py-2 text-sm"
    >
      <For each={props.messages}>
        {(m, i) => (
          <ConversationPeerMessage
            content={m.content}
            userIsAuthor={m.userIsAuthor}
          />
        )}
      </For>
    </div>
  );
}

function ConversationPeerMessage(props: {
  content: string;
  userIsAuthor: boolean;
}) {
  return (
    <p
      class="w-fit max-w-[60%] rounded-md p-2"
      classList={{
        "bg-white": !props.userIsAuthor,
        "self-end bg-green-100": props.userIsAuthor,
      }}
    >
      {props.content}
    </p>
  );
}
