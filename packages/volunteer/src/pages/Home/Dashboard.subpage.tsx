import { DashboardUpdate } from "@api-contract/subscription";
import { StudentId } from "@api-contract/types";
import { useNavigate } from "@solidjs/router";
import { For } from "solid-js";
import { client } from "~/external/api-client/client";
import SidebarLayout from "~/layouts/Sidebar.layout";
import { useAppStore } from "~/stores/stores";

export default function DashboardPage() {
  const navigate = useNavigate();
  const store = useAppStore((s) => s);

  if (store.profile.profile.status === "logged-out") {
    throw new Error("User is not authenticated");
  }

  return (
    <div class="flex h-full w-full">
      <div class="basis-1/2 border-r border-r-gray-300 pt-2">
        <VolunteerTable
          volunteers={store.dashboard.dashboard.onlineVolunteers}
        />
      </div>

      <div class="basis-1/2 pt-2">
        <PendingRequestTable
          pendingRequests={store.dashboard.dashboard.pendingRequests}
          canAcceptRequest={store.profile.profile.status === "idle"}
          onAcceptRequest={async (studentId) => {
            if (store.profile.profile.status !== "idle") {
              alert("Cannot accept request, user is busy");
              return;
            }
            const r = await client["volunteer/accept_request"]({ studentId });
            if (r.isErr()) {
              alert("Failed to accept request: " + r.error);
              return;
            }

            store.setProfile("profile", { status: "busy-chatting" });
            navigate("/chat");
          }}
        />
      </div>
    </div>
  );
}

function VolunteerTable(props: {
  volunteers: DashboardUpdate["onlineVolunteers"];
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
                {v.volunteerId}
              </p>
              <p class="flex-none basis-1/2 px-2 py-2">{v.status.status}</p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

function PendingRequestTable(props: {
  pendingRequests: {
    studentId: StudentId;
  }[];
  canAcceptRequest: boolean;
  onAcceptRequest: (studentId: StudentId) => void;
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
              <p class="flex flex-none basis-2/5 items-center overflow-x-hidden overflow-ellipsis break-all border-r border-gray-300 px-2 py-1">
                {r.studentId}
              </p>
              <p class="flex flex-none basis-2/5 items-center border-r border-gray-300 px-2 py-1">
                10 mins
              </p>
              <div class="flex-0 basis-1/5 px-2 py-1">
                <button
                  disabled={!props.canAcceptRequest}
                  onClick={() => props.onAcceptRequest(r.studentId)}
                  class="rounded-md bg-green-600 px-2 py-1 text-white"
                >
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
