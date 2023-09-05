import { z } from "zod";
import { createForm, zodForm } from "@modular-forms/solid";

import { createMutation } from "@tanstack/solid-query";
import storage from "~/external/browser/local-storage";

import { client } from "~/external/api-client/client";
import { onMount } from "solid-js";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [loginForm, { Form, Field }] = createForm<z.input<typeof formSchema>>({
    validate: zodForm(formSchema),
  });

  const textInputclass =
    "focus:ring-primary block w-full rounded-md border-0 px-2 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6";

  onMount(async () => {
    const r = client["volunteer/login"]({
      email: "james@example.com",
      password: "james123",
    });
    console.log(r);
  });

  return <div></div>;
}
