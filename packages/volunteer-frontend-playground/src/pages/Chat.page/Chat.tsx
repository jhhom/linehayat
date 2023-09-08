import { For, onMount } from "solid-js";
import { createStore } from "solid-js/store";

const initialMessages: ConversationProps["messages"] = [
  {
    content: "Hello James",
    userIsAuthor: true,
  },
  {
    content: "Hello Veronica",
    userIsAuthor: false,
  },
  {
    content:
      "Morbi sit amet eros ac neque pretium bibendum ut eget augue. Mauris fermentum, enim non faucibus ultricies, lectus odio facilisis nibh, sit amet imperdiet lorem urna ut diam. Morbi egestas, leo nec interdum interdum, erat felis pulvinar massa, sed bibendum lectus mi non mauris. In eu arcu est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin lacus nisi, vestibulum in mattis in, volutpat eu ligula. Quisque tristique urna non metus elementum tempor. In hac habitasse platea dictumst. Praesent eleifend sem massa, nec scelerisque felis sollicitudin sed. ",
    userIsAuthor: false,
  },
  {
    content:
      "Morbi sit amet eros ac neque pretium bibendum ut eget augue. Mauris fermentum, enim non faucibus ultricies, lectus odio facilisis nibh, sit amet imperdiet lorem urna ut diam. Morbi egestas, leo nec interdum interdum, erat felis pulvinar massa, sed bibendum lectus mi non mauris. In eu arcu est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin lacus nisi, vestibulum in mattis in, volutpat eu ligula. Quisque tristique urna non metus elementum tempor. In hac habitasse platea dictumst. Praesent eleifend sem massa, nec scelerisque felis sollicitudin sed. ",
    userIsAuthor: false,
  },
  {
    content:
      "Morbi sit amet eros ac neque pretium bibendum ut eget augue. Mauris fermentum, enim non faucibus ultricies, lectus odio facilisis nibh, sit amet imperdiet lorem urna ut diam. Morbi egestas, leo nec interdum interdum, erat felis pulvinar massa, sed bibendum lectus mi non mauris. In eu arcu est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin lacus nisi, vestibulum in mattis in, volutpat eu ligula. Quisque tristique urna non metus elementum tempor. In hac habitasse platea dictumst. Praesent eleifend sem massa, nec scelerisque felis sollicitudin sed. ",
    userIsAuthor: false,
  },
  {
    content:
      "Morbi sit amet eros ac neque pretium bibendum ut eget augue. Mauris fermentum, enim non faucibus ultricies, lectus odio facilisis nibh, sit amet imperdiet lorem urna ut diam. Morbi egestas, leo nec interdum interdum, erat felis pulvinar massa, sed bibendum lectus mi non mauris. In eu arcu est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin lacus nisi, vestibulum in mattis in, volutpat eu ligula. Quisque tristique urna non metus elementum tempor. In hac habitasse platea dictumst. Praesent eleifend sem massa, nec scelerisque felis sollicitudin sed. ",
    userIsAuthor: false,
  },
];

export default function Chat(props: { onHangup: () => void }) {
  const [messages, setMessages] =
    createStore<ConversationProps["messages"]>(initialMessages);

  let textRef: HTMLInputElement;
  let conversationContainerRef: HTMLDivElement;

  const submitMessage = () => {
    if (textRef.value === "") {
      return;
    }
    setMessages([...messages, { content: textRef.value, userIsAuthor: false }]);
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
      <Conversation ref={conversationContainerRef} messages={messages} />
      <div class="flex">
        <input
          ref={textRef}
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
