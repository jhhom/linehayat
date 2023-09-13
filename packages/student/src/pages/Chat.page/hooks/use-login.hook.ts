import { createEffect, createSignal, onCleanup } from "solid-js";
import { StudentSubscriptionEventPayload } from "@api-contract/subscription";
import storage from "~/external/browser/local-storage";
import { client } from "~/external/api-client/trpc";
import { AppStore, useAppStore } from "~/stores/stores";

// KIV: we cannot directly `useAppStore` inside here because the values outside will not be updated
// don't know why...
export function useLogin(props: { onMakeRequestFailed: () => void }) {
  const [listenersToCleanup, setListenersToCleanup] = createSignal<
    [keyof StudentSubscriptionEventPayload, number][]
  >([]);

  onCleanup(() => {
    for (const [k, v] of listenersToCleanup()) {
      client.removeListener(k, v);
    }
  });

  const login = async (store: AppStore) => {
    const r = await client["student/make_request"]();
    if (r.isErr()) {
      alert("Failed to make request: " + r.error);
      props.onMakeRequestFailed();
      return;
    }
    storage.setToken(r.value.token);
    store.setProfile({ status: "waiting" });
    const listenerId = client.addListener("student.request_accepted", (e) => {
      store.setProfile({ status: "chatting" });
    });
    const listenerId2 = client.addListener(
      "student.volunteer_disconnected",
      (e) => {
        alert("Volunteer has disconnected");
        store.setProfile({ status: "idle" });
        client.clearListeners();
      },
    );
    const listenerId3 = client.addListener("student.message", (e) => {
      store.setMessages("messages", [
        ...store.messages.messages,
        {
          content: e.message,
          userIsAuthor: false,
        },
      ]);
    });
    const listenerId4 = client.addListener("student.hanged_up", (e) => {
      alert("volunteer has hanged-up");
      store.setProfile({ status: "idle" });
      client.clearListeners();
    });
    const listenerId5 = client.addListener("student.volunteer_typing", (e) => {
      store.setVolunteer("status", e.typing ? "typing" : "idle");
    });
    setListenersToCleanup([
      ["student.request_accepted", listenerId],
      ["student.volunteer_disconnected", listenerId2],
      ["student.message", listenerId3],
      ["student.hanged_up", listenerId4],
      ["student.volunteer_typing", listenerId5],
    ]);
  };

  return {
    login,
    listenersToCleanup,
  };
}
