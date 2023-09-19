import { For, Show, onMount, createEffect } from "solid-js";

import { type Messages } from "~/stores/messages.store";
import { type Volunteer } from "~/stores/volunteer.store";

import VoiceTextInput from "~/pages/Chat.page/components/Chat/VoiceTextInput/VoiceTextInput";
import { MessageInput } from "@api-contract/endpoints";
import { Message } from "@api-contract/types";
import AudioPlayer from "~/pages/Chat.page/components/Chat/AudioPlayer/AudioPlayer";
import { match } from "ts-pattern";

export default function Chat(props: {
  volunteerStatus: Volunteer["status"];
  messages: Messages["messages"];
  onTyping: (isTyping: boolean) => void;
  onHangup: () => {};
  onSubmitMessage: (message: MessageInput) => void;
}) {
  let conversationContainerRef!: HTMLDivElement;

  return (
    <div class="h-full w-full">
      <div class="flex h-full w-full items-center justify-center">
        <Show when={props.volunteerStatus === "typing"}>
          <p>Volunteer is typing...</p>
        </Show>
        <div>
          <div class="flex justify-end pb-2">
            <button
              onClick={props.onHangup}
              class="rounded-md bg-red-500 px-4 py-2 text-white"
            >
              Hang up
            </button>
          </div>
          <Conversation
            ref={conversationContainerRef}
            messages={props.messages}
          />
          <VoiceTextInput
            onSubmit={async (m) => {
              await props.onSubmitMessage(m);
              conversationContainerRef.scrollTo(
                0,
                conversationContainerRef.scrollHeight,
              );
            }}
            onTyping={(t) => props.onTyping(t)}
          />
        </div>
      </div>
    </div>
  );
}

type ConversationProps = {
  ref: HTMLDivElement;
  messages: {
    content: Message;
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
  content: Message;
  userIsAuthor: boolean;
}) {
  return (
    <div
      class="w-fit max-w-[60%] rounded-md p-2"
      classList={{
        "bg-white": !props.userIsAuthor,
        "self-end bg-green-100": props.userIsAuthor,
      }}
    >
      {match(props.content)
        .with({ type: "text" }, (message) => (
          <p class="rounded-md px-4 py-2">{message.content}</p>
        ))
        .otherwise((message) => (
          <div class="rounded-md px-4 py-2">
            <AudioPlayer audioSrc={message.url} />
          </div>
        ))}
    </div>
  );
}
