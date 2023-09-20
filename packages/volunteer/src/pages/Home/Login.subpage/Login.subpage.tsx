import { z } from "zod";
import { createSignal } from "solid-js";
import { createForm, zodForm } from "@modular-forms/solid";

import storage from "~/external/browser/local-storage";

import { client } from "~/external/api-client/client";
import { useAppStore } from "~/stores/stores";
import { createEffect, onCleanup, onMount } from "solid-js";
import { VolunteerSubscriptionEventPayload } from "@api-contract/subscription";

import { useAutoLogin, useLogin } from "~/pages/Home/Login.subpage/use-login";

import { match } from "ts-pattern";

const loginFormSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const signupFormSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function LoginPage() {
  const [tab, setTab] = createSignal<"login" | "sign-up">("login");
  const [loginForm, { Form: LoginForm, Field: LoginField }] = createForm<
    z.input<typeof loginFormSchema>
  >({
    validate: zodForm(loginFormSchema),
  });
  const [signupForm, { Form: SignupForm, Field: SignupField }] = createForm<
    z.input<typeof signupFormSchema>
  >({
    validate: zodForm(signupFormSchema),
  });

  const store = useAppStore((s) => s);

  // temporary auto-login to ease debugging
  // useAutoLogin({ username: "james", password: "james123" });

  const { login, listenersToCleanup } = useLogin();

  onCleanup(() => {
    for (const [k, v] of listenersToCleanup()) {
      client.removeListener(k, v);
    }
  });

  return (
    <div class="flex h-screen w-screen items-center justify-center">
      <div class="w-96 rounded-md border border-gray-300 py-4">
        {match(tab())
          .with("login", () => (
            <div>
              <p class="text-center">Volunteer login</p>

              <div class="mt-4">
                <LoginForm
                  onSubmit={async (v) => {
                    const result = await login({
                      username: v.username,
                      password: v.password,
                    });
                    if (result.isErr()) {
                      alert("Error failed to login: " + result.error);
                    }
                  }}
                  class="px-4"
                >
                  <LoginField name="username">
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
                          <p class="text-[0.8rem] text-red-600">
                            {field.error}
                          </p>
                        )}
                      </div>
                    )}
                  </LoginField>

                  <LoginField name="password">
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
                          <p class="text-[0.8rem] text-red-600">
                            {field.error}
                          </p>
                        )}
                      </div>
                    )}
                  </LoginField>

                  <div class="mt-8">
                    <button
                      type="submit"
                      class="ml-auto block rounded-md bg-red-100 px-4 py-2"
                    >
                      Login
                    </button>
                  </div>
                </LoginForm>

                <div class="ml-4 text-sm">
                  Don't have an account?{" "}
                  <span
                    class="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => setTab("sign-up")}
                  >
                    Sign up here
                  </span>
                </div>
              </div>
            </div>
          ))
          .with("sign-up", () => (
            <div>
              <p class="text-center">Volunteer sign up</p>

              <div class="mt-4">
                <SignupForm
                  onSubmit={async (v) => {
                    const result = await client["volunteer/sign_up"]({
                      username: v.username,
                      email: v.email,
                      password: v.password,
                    });
                    if (result.isErr()) {
                      alert("Error failed to sign up: " + result.error);
                      return;
                    }
                    alert(result.value.message);
                  }}
                  class="px-4"
                >
                  <SignupField name="username">
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
                          <p class="text-[0.8rem] text-red-600">
                            {field.error}
                          </p>
                        )}
                      </div>
                    )}
                  </SignupField>

                  <SignupField name="email">
                    {(field, props) => (
                      <div class="mt-4">
                        <label class="block" for="email">
                          Email
                        </label>
                        <input
                          id={props.name}
                          type="text"
                          class="mt-1 block w-full rounded-md border border-gray-300 px-2 py-2"
                          {...props}
                        />
                        {field.error !== "" && (
                          <p class="text-[0.8rem] text-red-600">
                            {field.error}
                          </p>
                        )}
                      </div>
                    )}
                  </SignupField>

                  <SignupField name="password">
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
                          <p class="text-[0.8rem] text-red-600">
                            {field.error}
                          </p>
                        )}
                      </div>
                    )}
                  </SignupField>

                  <div class="mt-8">
                    <button
                      type="submit"
                      class="ml-auto block rounded-md bg-red-100 px-4 py-2"
                    >
                      Sign up
                    </button>
                  </div>
                </SignupForm>

                <div class="ml-4 text-sm">
                  Already have an account?{" "}
                  <span
                    class="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => setTab("login")}
                  >
                    Login here
                  </span>
                </div>
              </div>
            </div>
          ))
          .exhaustive()}
      </div>
    </div>
  );
}
