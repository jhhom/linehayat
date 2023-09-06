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
    <div class="flex justify-center items-center w-screen h-screen">
      <div class="w-96 py-4 rounded-md border border-gray-300">
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
                class="block mt-1 border border-gray-300 rounded-md py-2 px-2 w-full"
              />
            </div>

            <div class="mt-4">
              <label class="block" for="password">
                Password
              </label>
              <input
                type="text"
                id="password"
                class="block mt-1 border border-gray-300 rounded-md py-2 px-2 w-full"
              />
            </div>

            <div class="mt-8">
              <button
                type="submit"
                class="block px-4 py-2 ml-auto bg-red-100 rounded-md"
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
