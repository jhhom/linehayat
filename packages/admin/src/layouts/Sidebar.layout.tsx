import { A, Outlet, useLocation } from "@solidjs/router";
import { ComponentProps, ParentProps } from "solid-js";
import { match } from "ts-pattern";
import { useAppStore } from "~/stores/stores";
import AdminLoginPage from "~/pages/Login.page";

export default function SidebarLayout() {
  const userProfile = useAppStore((s) => s.profile);

  return (
    <div>
      {match(userProfile.profile.status)
        .with("logged-in", () => (
          <div>
            <div class="flex h-screen">
              <div class="flex max-w-[260px] basis-1/4 flex-col border border-r px-2">
                <Sidebar username={"James"} />
              </div>
              <div class="flex-grow basis-3/4 overflow-x-auto">
                <Outlet />
              </div>
            </div>
          </div>
        ))
        .with("logged-out", () => <AdminLoginPage />)
        .exhaustive()}
    </div>
  );
}

function Sidebar(props: { username: string }) {
  const location = useLocation();

  return (
    <div class="flex h-full w-full flex-col">
      <div>
        <div class="flex items-center pb-8 pt-4">
          <div class="h-10 w-10 rounded-md bg-gray-100 p-2 text-gray-500">
            <IconPerson />
          </div>
          <p class="pl-3 text-sm">{props.username}</p>
        </div>
      </div>

      <div class="flex-grow space-y-2">
        <SidebarLink active={location.pathname === "/"} href="/">
          Volunteers
        </SidebarLink>
        <SidebarLink
          active={location.pathname === "/feedbacks"}
          href="/feedbacks"
        >
          Feedbacks
        </SidebarLink>
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
  active: boolean;
}) {
  return (
    <A
      href={props.href}
      class="block rounded-md py-2 pl-2 "
      classList={{
        "text-green-700 bg-green-100/70": props.active,
        "hover:bg-gray-100": !props.active,
      }}
    >
      {props.children}
    </A>
  );
}

function IconPerson(props: { class?: string }) {
  return (
    <svg
      class={props.class}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="currentColor"
    >
      <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
    </svg>
  );
}
