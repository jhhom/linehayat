import { createSignal, onMount, onCleanup } from "solid-js";
import { ok, err } from "neverthrow";

import { VolunteerSubscriptionEventPayload } from "@api-contract/subscription";

import storage from "~/external/browser/local-storage";
import { useAppStore } from "~/stores/stores";
import { client } from "~/external/api-client/client";

export const useLogin = () => {
  const store = useAppStore((s) => s);

  const [listenersToCleanup, setListenersToCleanup] = createSignal<
    [keyof VolunteerSubscriptionEventPayload, number][]
  >([]);

  const login = async (v: { username: string; password: string }) => {
    const r = await client["volunteer/login"]({
      username: v.username,
      password: v.password,
    });
    if (r.isErr()) {
      return err(r.error);
    }
    storage.setToken(r.value.token);
    store.setProfile("profile", {
      status: "idle",
      username: r.value.username,
      email: r.value.email,
    });
    store.setDashboard("dashboard", r.value.latestDashboard);
    const listenerId = client.addListener("volunteer.dashboard_update", (e) => {
      store.setDashboard("dashboard", e);
    });
    const listenerId2 = client.addListener(
      "volunteer.student_disconnected",
      (e) => {
        alert("Student has disconnected");
        store.setProfile("profile", { status: "idle" });
      },
    );
    const listenerId3 = client.addListener("volunteer.message", (e) => {
      store.setMessages("messages", [
        ...store.messages.messages,
        {
          content: e.message,
          userIsAuthor: false,
        },
      ]);
    });
    const listenerId4 = client.addListener("volunteer.hanged_up", (e) => {
      alert("student has hanged-up");
      store.setProfile("profile", { status: "idle" });
    });
    const listenerId5 = client.addListener("volunteer.student_typing", (e) => {
      store.setStudent("status", e.typing ? "typing" : "idle");
    });
    setListenersToCleanup([
      ["volunteer.dashboard_update", listenerId],
      ["volunteer.student_disconnected", listenerId2],
      ["volunteer.message", listenerId3],
      ["volunteer.hanged_up", listenerId4],
      ["volunteer.student_typing", listenerId5],
    ]);

    return ok(r.value);
  };

  return {
    login,
    listenersToCleanup,
  };
};

export const useAutoLogin = (v: { username: string; password: string }) => {
  const store = useAppStore((s) => s);

  onMount(async () => {
    const r = await client["volunteer/login"]({
      username: v.username,
      password: v.password,
    });
    if (r.isErr()) {
      alert("Failed to login: " + r.error);
      return;
    }
    storage.setToken(r.value.token);
    store.setProfile("profile", {
      status: "idle",
      username: r.value.username,
      email: r.value.email,
    });
    store.setDashboard("dashboard", r.value.latestDashboard);
    const listenerId = client.addListener("volunteer.dashboard_update", (e) => {
      store.setDashboard("dashboard", e);
    });
    const listenerId2 = client.addListener(
      "volunteer.student_disconnected",
      (e) => {
        alert("Student has disconnected");
        store.setProfile("profile", { status: "idle" });
      },
    );
    const listenerId3 = client.addListener("volunteer.message", (e) => {
      store.setMessages("messages", [
        ...store.messages.messages,
        {
          content: e.message,
          userIsAuthor: false,
        },
      ]);
    });
    const listenerId4 = client.addListener("volunteer.hanged_up", (e) => {
      alert("student has hanged-up");
      store.setProfile("profile", { status: "idle" });
    });
    const listenerId5 = client.addListener("volunteer.student_typing", (e) => {
      store.setStudent("status", e.typing ? "typing" : "idle");
    });
    onCleanup(() => {
      client.removeListener("volunteer.dashboard_update", listenerId);
      client.removeListener("volunteer.student_disconnected", listenerId2);
      client.removeListener("volunteer.message", listenerId3);
      client.removeListener("volunteer.hanged_up", listenerId4);
      client.removeListener("volunteer.student_typing", listenerId5);
    });
  });
};
