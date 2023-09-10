import { A } from "@solidjs/router";
import { ComponentProps, ParentProps } from "solid-js";
import { Profile } from "~/stores/profile.store";

type SidebarProfile = Exclude<Profile["profile"], { status: "logged-out" }>;

export default function SidebarLayout(props: ParentProps<SidebarProfile>) {
  return (
    <div>
      <div class="flex h-screen">
        <div class="flex max-w-[260px] basis-1/4 flex-col border border-r px-2">
          <Sidebar
            status={props.status}
            email={props.email}
            username={props.username}
          />
        </div>
        <div class="flex-grow basis-3/4">{props.children}</div>
      </div>
    </div>
  );
}

function Sidebar(props: SidebarProfile) {
  return (
    <div class="flex h-full w-full flex-col">
      <div>
        <div class="flex items-center pb-8 pt-4">
          <div class="h-10 w-10">
            <img
              class="h-full w-full rounded-md object-cover"
              src="bunny.jpg"
              alt=""
            />
          </div>
          <div>
            <p class="pl-3 text-sm">{props.username}</p>
            <div class="mt-0.5 flex items-center pl-3.5">
              <div class="h-2.5 w-2.5 rounded-full bg-green-400" />
              <p class="pl-1 text-xs">{props.status}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-grow space-y-2">
        <SidebarLink href="/dashboard">Dashboard</SidebarLink>
        <SidebarLink href="/chat">Chat</SidebarLink>
        <a href="#" class="block rounded-md py-2 pl-2 hover:bg-gray-100">
          Setting
        </a>
      </div>

      <div class="pb-8">
        <button class="block w-full rounded-md bg-red-100 py-2">Log out</button>
      </div>
    </div>
  );
}

function SidebarLink(props: {
  href: ComponentProps<typeof A>["href"];
  children: ComponentProps<typeof A>["children"];
}) {
  return (
    <A
      href={props.href}
      class="block rounded-md py-2  pl-2 "
      activeClass="text-green-700 bg-green-100/70"
      inactiveClass="hover:bg-gray-100"
    >
      {props.children}
    </A>
  );
}
