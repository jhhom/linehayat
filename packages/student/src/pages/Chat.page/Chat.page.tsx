import {
  onMount,
  type Component,
  createSignal,
  Show,
  onCleanup,
  createEffect,
} from "solid-js";
import { match } from "ts-pattern";
import { client } from "~/external/api-client/trpc";
import storage from "~/external/browser/local-storage";
import { useAppStore } from "~/stores/stores";
import Chat from "~/pages/Chat.page/Chat";
import { StudentSubscriptionEventPayload } from "@api-contract/subscription";
import { useIsTyping } from "~/pages/Chat.page/use-is-typing.hook";

function ChatPage() {
  const [card, setCard] = createSignal(0);
  const [agreeToTNC, setAgreeToTNC] = createSignal(false);
  const [listenersToCleanup, setListenersToCleanup] = createSignal<
    [keyof StudentSubscriptionEventPayload, number][]
  >([]);

  const store = useAppStore((s) => s);




  onCleanup(() => {
    for (const [k, v] of listenersToCleanup()) {
      client.removeListener(k, v);
    }
  });

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
            <div class="h-full w-full">
              {match(store.profile.status)
                .with("chatting", () => (
                  <div>
                    <Chat />
                  </div>
                ))
                .with("idle", () => (
                  <div class="h-full w-full rounded-lg bg-blue-100">
                    <div class="h-[85%] w-full">
                      {match(card())
                        .with(0, () => <Content1 />)
                        .with(1, () => <Content2 />)
                        .with(2, () => (
                          <Content3
                            agreeToTNC={agreeToTNC()}
                            onSetAgreeToTNC={setAgreeToTNC}
                          />
                        ))
                        .otherwise(() => (
                          <Content1 />
                        ))}
                    </div>
                    <div class="flex h-[15%] items-center justify-between px-6">
                      <div>
                        <button
                          onClick={async () => {
                            setCard((c) => c - 1);
                          }}
                          class="rounded-full bg-white px-6 py-2 text-lg"
                          classList={{ hidden: card() === 0 }}
                        >
                          Previous
                        </button>
                      </div>

                      <button
                        onClick={async () => {
                          if (card() === 2) {
                            const r = await client["student/make_request"]();
                            if (r.isErr()) {
                              alert("Failed to make request: " + r.error);
                              setCard(0);
                              return;
                            }
                            storage.setToken(r.value.token);
                            store.setProfile({ status: "waiting" });
                            const listenerId = client.addListener(
                              "student.request_accepted",
                              (e) => {
                                store.setProfile({ status: "chatting" });
                              },
                            );
                            const listenerId2 = client.addListener(
                              "student.volunteer_disconnected",
                              (e) => {
                                alert("Volunteer has disconnected");
                                store.setProfile({ status: "idle" });
                                client.clearListeners();
                              },
                            );
                            const listenerId3 = client.addListener(
                              "student.message",
                              (e) => {
                                store.setMessages("messages", [
                                  ...store.messages.messages,
                                  {
                                    content: e.message,
                                    userIsAuthor: false,
                                  },
                                ]);
                              },
                            );
                            const listenerId4 = client.addListener(
                              "student.hanged_up",
                              (e) => {
                                alert("volunteer has hanged-up");
                                store.setProfile({ status: "idle" });
                                client.clearListeners();
                              },
                            );
                            const listenerId5 = client.addListener(
                              "student.volunteer_typing",
                              (e) => {
                                store.setVolunteer(
                                  "status",
                                  e.typing ? "typing" : "idle",
                                );
                              },
                            );
                            setListenersToCleanup([
                              ["student.request_accepted", listenerId],
                              ["student.volunteer_disconnected", listenerId2],
                              ["student.message", listenerId3],
                              ["student.hanged_up", listenerId4],
                              ["student.volunteer_typing", listenerId5],
                            ]);
                            setCard(0);
                          } else {
                            setCard((c) => c + 1);
                          }
                        }}
                        class="rounded-full px-6 py-2"
                        classList={{
                          hidden: card() === 3,
                          "text-lg bg-white": !(card() === 2 && !agreeToTNC()),
                          "bg-white/40 text-gray-400":
                            card() === 2 && !agreeToTNC(),
                        }}
                        disabled={card() === 2 && !agreeToTNC()}
                      >
                        <Show when={card() === 2} fallback="Next">
                          Chat
                        </Show>
                      </button>
                    </div>
                  </div>
                ))
                .with("waiting", () => (
                  <div class="h-full w-full rounded-lg bg-blue-100">
                    <p>Please wait</p>
                  </div>
                ))
                .exhaustive()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div class="flex h-full w-full items-center justify-center">
      <div class="text-center text-lg">
        <p>Hi, how are you today?</p>

        <p class="mt-4">Would you like to talk to someone?</p>
      </div>
    </div>
  );
}

function HowItWorksDescription(props: { imgSrc: string; description: string }) {
  return (
    <div class="w-64">
      <div class="flex w-full justify-center">
        <div class="h-36 w-36">
          <img src={props.imgSrc} />
        </div>
      </div>

      <p class="text-center">{props.description}</p>
    </div>
  );
}

function Content2() {
  return (
    <div class="px-6 pt-6">
      <p class="text-xl">
        How does LineHayat's anonymous chat support service work?
      </p>

      <div class="mt-32 flex w-full justify-between">
        <HowItWorksDescription
          imgSrc="how-it-works-1.svg"
          description="Read the terms and conditions, before clicking 'Next'."
        />
        <HowItWorksDescription
          imgSrc="how-it-works-2.svg"
          description="Please wait patiently for our Listening Volunteer to reach you."
        />
        <HowItWorksDescription
          imgSrc="how-it-works-3.svg"
          description="Proceed to have a one-on-one chat with our Listening Volunteer."
        />
      </div>

      <div class="mt-12 text-center text-xl">
        <p>
          Note: Every chat is appointed at an approximate time of 20 minutes.
        </p>
      </div>
    </div>
  );
}

function Content3(props: {
  agreeToTNC: boolean;
  onSetAgreeToTNC: (agree: boolean) => void;
}) {
  return (
    <div class="px-6 pt-6">
      <div>
        <p class="text-center text-xl">Terms of use</p>
      </div>

      <div class="mt-4">
        <p class="text-lg">
          By using LineHayat Support Services, you agree to the Terms and
          Conditions stated below. LineHayat is a Listening Service delivered by
          a team of well-trained Listening Volunteers and it is provided for USM
          students only.
        </p>

        <div class="mt-4">
          <ol class="list-inside list-decimal space-y-2">
            <li>
              We provide immediate and accessible emotional support to students.
            </li>
            <li>
              We listen with an empathic, collaborative, and non-judgmental
              stance.
            </li>
            <li>
              We provide a safe space for you to talk or share feelings and
              thoughts.
            </li>
            <li>
              We do not provide professional counselling, medical advice, or
              treatment of any conditions.
            </li>
            <li>
              We are not and will not be treated as an emergency service or
              substitute or alternative to professional health care.
            </li>
            <li>
              We have taken three significant steps to ensure a high level of
              security:
              <ol class="list-inside list-[upper-roman] space-y-2 pl-5">
                <li class="mt-2">
                  Both you and the Listening Volunteer will remain anonymous.
                </li>
                <li>We will never track your IP address.</li>
                <li>
                  We will never save session transcripts. All chats will be
                  automatically deleted when the conversation ends.
                </li>
              </ol>
            </li>
          </ol>

          <div class="mt-4 flex items-center px-2">
            <input
              class="block h-4 w-4 cursor-pointer"
              type="checkbox"
              name=""
              id=""
              checked={props.agreeToTNC}
              onChange={() => {
                props.onSetAgreeToTNC(!props.agreeToTNC);
              }}
            />
            <p class="ml-3">
              I agree with all the terms and conditions listed above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;