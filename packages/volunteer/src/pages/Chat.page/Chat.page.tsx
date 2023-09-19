import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";

import { useAppStore } from "~/stores/stores";
import { client } from "~/external/api-client/client";

import { Chat } from "~/pages/Chat.page/components/Chat/Chat";

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
            studentStatus={store.student.status}
            messages={store.messages.messages}
            onTyping={async (isTyping) => {
              const r = await client["volunteer/typing"]({
                typing: isTyping,
              });
            }}
            onSubmitMessage={async (message) => {
              const r = await client["volunteer/send_message"](message);

              if (r.isErr()) {
                alert("Failed to send message: " + r.error);
                return;
              }

              store.setMessages("messages", [
                ...store.messages.messages,
                {
                  content: r.value,
                  userIsAuthor: true,
                },
              ]);
            }}
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
