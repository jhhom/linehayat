import { createForm, zodForm } from "@modular-forms/solid";
import { z } from "zod";
import storage from "~/external/browser/local-storage";
import { client } from "~/external/api-client/client";
import { useAppStore } from "~/stores/stores";
import { useAutoLogin } from "~/hooks/use-auto-login";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function AdminLoginPage() {
  const store = useAppStore((s) => s);

  const [form, { Form, Field }] = createForm<z.input<typeof formSchema>>({
    validate: zodForm(formSchema),
  });

  return (
    <div class="flex h-screen w-screen items-center justify-center">
      <div class="w-96 rounded-md border border-gray-300 py-4">
        <div>
          <p class="text-center">Admin login</p>

          <div class="mt-4">
            <Form
              onSubmit={async (v) => {
                const result = await client["admin/login"]({
                  username: v.username,
                  password: v.password,
                });
                if (result.isErr()) {
                  alert("Error failed to login: " + result.error);
                  return;
                }
                storage.setToken(result.value.token);
                store.setProfile("profile", { status: "logged-in" });
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
    </div>
  );
}
