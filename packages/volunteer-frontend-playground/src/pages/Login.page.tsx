import { z } from "zod";
import { createForm, zodForm } from "@modular-forms/solid";

const formSchema = z.object({
  username: z.string().min(1, "Please enter your username"),
  password: z.string().min(1, "Please enter your password"),
});

export default function LoginPage() {
  const [loginForm, { Form, Field }] = createForm<z.input<typeof formSchema>>({
    validate: zodForm(formSchema),
  });

  return (
    <div class="flex h-screen w-screen items-center justify-center">
      <div class="w-96 rounded-md border border-gray-300 py-4">
        <p class="text-center">Volunteer login</p>

        <div class="mt-4">
          <Form onSubmit={(v) => console.log(v)} class="px-4">
            <Field name="username">
              {(field, props) => (
                <div class="">
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
