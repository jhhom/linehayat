import { useNavigate } from "@solidjs/router";
import { createSignal, Show, onCleanup, createEffect } from "solid-js";
import { match } from "ts-pattern";

import { client } from "~/external/api-client/trpc";
import { useAppStore } from "~/stores/stores";
import { useLogin } from "~/pages/Chat.page/hooks/use-login.hook";

import { ChatSubpage } from "~/pages/Chat.page/subpages/Chat.subpage";
import { FeedbackSubpage } from "~/pages/Chat.page/subpages/Feedback.subpage";

function ChatPage() {
  const store = useAppStore((s) => s);
  const [feedbackSubmitted, setFeedbackSubmitted] = createSignal(false);

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
            <Show
              when={store.feedbackId.feedbackId === null}
              fallback={
                <FeedbackSubpage
                  onFeedbackSubmitted={() => setFeedbackSubmitted(true)}
                />
              }
            >
              <ChatSubpage feedbackSubmitted={feedbackSubmitted()} />
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
