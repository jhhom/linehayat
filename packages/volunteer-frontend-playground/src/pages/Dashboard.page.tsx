import { For } from "solid-js";
import SidebarLayout from "~/layouts/Sidebar.layout";

function VolunteerTable(props: {
  volunteers: {
    username: string;
    status: string;
  }[];
}) {
  return (
    <div>
      <div class="pt-1 text-center">Online volunteers</div>
      <div class="mt-4 flex border-b border-t border-gray-300 text-center font-semibold">
        <p class="basis-1/2 border-r border-gray-300 py-1">Username</p>
        <p class="basis-1/2 py-1">Status</p>
      </div>
      <div>
        <For each={props.volunteers}>
          {(v, i) => (
            <div class="flex cursor-pointer border-b border-gray-300 text-sm hover:bg-gray-50">
              <p class="flex-none basis-1/2 border-r border-gray-300 px-2 py-2">
                {v.username}
              </p>
              <p class="flex-none basis-1/2 px-2 py-2">{v.status}</p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

function PendingRequestTable(props: {
  pendingRequests: {
    username: string;
    waitingTime: string;
  }[];
}) {
  return (
    <div>
      <div class="pt-1 text-center">Pending student requests</div>

      <div class="mt-4 flex border-b border-t border-gray-300 text-center font-semibold">
        <p class="basis-2/5 border-r border-gray-300 py-1">Alias</p>
        <p class="basis-2/5 border-r border-gray-300 py-1">Waiting time</p>
        <p class="basis-1/5 py-1">Action</p>
      </div>
      <div>
        <For each={props.pendingRequests}>
          {(r, i) => (
            <div class="flex cursor-pointer border-b border-gray-300 text-sm hover:bg-gray-50">
              <p class="flex flex-none basis-2/5 items-center border-r border-gray-300 px-2 py-1">
                {r.username}
              </p>
              <p class="flex flex-none basis-2/5 items-center border-r border-gray-300 px-2 py-1">
                {r.waitingTime}
              </p>
              <div class="flex-0 basis-1/5 px-2 py-1">
                <button class="rounded-md bg-green-600 px-2 py-1 text-white">
                  Accept
                </button>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <SidebarLayout>
      <div class="flex h-full w-full">
        <div class="basis-1/2 border-r border-r-gray-300 pt-2">
          <VolunteerTable
            volunteers={[
              {
                username: "James Madison",
                status: "Online",
              },
              {
                username: "John Smith",
                status: "Online",
              },
              {
                username: "Veniron Max",
                status: "Online",
              },
            ]}
          />
        </div>

        <div class="basis-1/2 pt-2">
          <PendingRequestTable
            pendingRequests={[
              {
                username: "TopMoose",
                waitingTime: "10 mins",
              },
            ]}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
