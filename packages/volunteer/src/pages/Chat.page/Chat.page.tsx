import { useNavigate } from "@solidjs/router";
import { For, Show, createEffect, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppStore } from "~/stores/stores";
import { client } from "~/external/api-client/client";
import { useIsTyping } from "~/pages/Chat.page/use-is-typing.hook";

export default function ChatPage() {
  const navigate = useNavigate();
  const store = useAppStore((s) => s);

  return (
    <div class="h-full w-full">
      <div class="flex h-full w-full items-center justify-center">
        <Show
          when={store.profile.profile.status === "busy-chatting"}
          fallback={
            <div>
              <p>You are not chatting with anyone</p>
            </div>
          }
        >
          <Chat
            messages={store.messages.messages}
            onHangup={async () => {
              await client["volunteer/hang_up"]();

              store.setProfile("profile", { status: "idle" });

              navigate("/");
            }}
          />
        </Show>
      </div>
    </div>
  );
}

function Chat(props: {
  messages: ConversationProps["messages"];
  onHangup: () => void;
}) {
  let textRef!: HTMLInputElement;
  let conversationContainerRef!: HTMLDivElement;

  const store = useAppStore((s) => ({
    setMessages: s.setMessages,
    messages: s.messages,
    student: s.student,
  }));

  const { register, isTyping } = useIsTyping({ timeout: 1500 });

  createEffect(async () => {
    const r = await client["volunteer/typing"]({
      typing: isTyping(),
    });
  });

  const submitMessage = async () => {
    if (textRef.value === "") {
      return;
    }
    const r = await client["volunteer/send_message"]({
      message: textRef.value,
    });

    if (r.isErr()) {
      alert("Failed to send message: " + r.error);
      return;
    }

    store.setMessages("messages", [
      ...store.messages.messages,
      {
        content: textRef.value,
        userIsAuthor: true,
      },
    ]);

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
      <Show when={store.student.status === "typing"}>
        <p>Student is typing...</p>
      </Show>
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
