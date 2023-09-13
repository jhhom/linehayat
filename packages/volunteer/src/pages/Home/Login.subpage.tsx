import { z } from "zod";
import { createSignal } from "solid-js";
import { createForm, zodForm } from "@modular-forms/solid";

import storage from "~/external/browser/local-storage";

import { client } from "~/external/api-client/client";
import { useAppStore } from "~/stores/stores";
import { createEffect, onCleanup, onMount } from "solid-js";
import { VolunteerSubscriptionEventPayload } from "@api-contract/subscription";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const useAutoLogin = (v: { username: string; password: string }) => {
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
    onCleanup(() => {
      client.removeListener("volunteer.dashboard_update", listenerId);
      client.removeListener("volunteer.student_disconnected", listenerId2);
      client.removeListener("volunteer.message", listenerId3);
      client.removeListener("volunteer.hanged_up", listenerId4);
    });
  });
};

export default function LoginPage() {
  const [loginForm, { Form, Field }] = createForm<z.input<typeof formSchema>>({
    validate: zodForm(formSchema),
  });

  const store = useAppStore((s) => s);

  // temporary auto-login to ease debugging
  useAutoLogin({ username: "james", password: "james123" });

  const [listenersToCleanup, setListenersToCleanup] = createSignal<
    [keyof VolunteerSubscriptionEventPayload, number][]
  >([]);

  onCleanup(() => {
    for (const [k, v] of listenersToCleanup()) {
      client.removeListener(k, v);
    }
  });

  return (
    <div class="flex h-screen w-screen items-center justify-center">
      <div class="w-96 rounded-md border border-gray-300 py-4">
        <p class="text-center">Volunteer login</p>

        <div class="mt-4">
          <Form
            onSubmit={async (v) => {
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
              const listenerId = client.addListener(
                "volunteer.dashboard_update",
                (e) => {
                  store.setDashboard("dashboard", e);
                },
              );
              const listenerId2 = client.addListener(
                "volunteer.student_disconnected",
                (e) => {
                  alert("Student has disconnected");
                  store.setProfile("profile", { status: "idle" });
                },
              );
              const listenerId3 = client.addListener(
                "volunteer.message",
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
                "volunteer.hanged_up",
                (e) => {
                  alert("student has hanged-up");
                  store.setProfile("profile", { status: "idle" });
                },
              );
              setListenersToCleanup([
                ["volunteer.dashboard_update", listenerId],
                ["volunteer.student_disconnected", listenerId2],
                ["volunteer.message", listenerId3],
                ["volunteer.hanged_up", listenerId4],
              ]);
            }}
            class="px-4"
          >
            <Field name="username">
              {(field, props) => (
                <div class="">
                  <label class="block" for="email">
                    Username
                  </label>
                  <input
                    id={props.name}
                    type="text"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-2 py-2"
                    {...props}
                  />
                  {field.error !== "" && (
                    <p class="text-[0.8rem] text-red-600">{field.error}</p>
                  )}
                </div>
              )}
            </Field>

            <Field name="password">
              {(field, props) => (
                <div class="mt-4">
                  <label class="block" for={props.name}>
                    Password
                  </label>
                  <input
                    type="text"
                    id={props.name}
                    class="mt-1 block w-full rounded-md border border-gray-300 px-2 py-2"
                    {...props}
                  />
                  {field.error !== "" && (
                    <p class="text-[0.8rem] text-red-600">{field.error}</p>
                  )}
                </div>
              )}
            </Field>

            <div class="mt-8">
              <button
                type="submit"
                class="ml-auto block rounded-md bg-red-100 px-4 py-2"
              >
                Login
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
