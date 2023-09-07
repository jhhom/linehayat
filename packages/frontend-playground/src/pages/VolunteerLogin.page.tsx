import { z } from "zod";
import { createForm, zodForm } from "@modular-forms/solid";

const formSchema = z.object({
  username: z.string().min(1, "Please enter your username"),
  password: z.string().min(1, "Please enter your password"),
});

export default function VolunteerLoginPage() {
  const [loginForm, { Form, Field }] = createForm<z.input<typeof formSchema>>({
    validate: zodForm(formSchema),
  });

  return (
    <div class="flex h-screen w-screen items-center justify-center">
      <div class="w-96 rounded-md border border-gray-300 py-4">
        <p class="text-center">Volunteer login</p>

        <div class="mt-4">
          <form class="px-4">
            <div class="">
              <label class="block" for="email">
                Email
              </label>
              <input
                id="email"
                type="text"
                class="mt-1 block w-full rounded-md border border-gray-300 px-2 py-2"
              />
            </div>

            <div class="mt-4">
              <label class="block" for="password">
                Password
              </label>
              <input
                type="text"
                id="password"
                class="mt-1 block w-full rounded-md border border-gray-300 px-2 py-2"
              />
            </div>

            <div class="mt-8">
              <button
                type="submit"
                class="ml-auto block rounded-md bg-red-100 px-4 py-2"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
