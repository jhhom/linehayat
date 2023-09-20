import { Profile } from "~/pages/VolunteersTable/EditDialog/EditDialog";

export function Table(props: {
  volunteers: Profile[];
  onEdit: (profile: Profile) => void;
  onDelete: (username: string) => void;
}) {
  return (
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {props.volunteers.map((v) => (
                  <tr>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {v.username}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span
                        class="rounded-md px-2 py-1 text-sm "
                        classList={{
                          "bg-green-100 text-green-600": v.isApproved,
                          "bg-yellow-100 text-yellow-600": !v.isApproved,
                        }}
                      >
                        {v.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <button
                        onClick={() => {
                          props.onEdit({
                            username: v.username,
                            isApproved: v.isApproved,
                          });
                        }}
                        class="rounded-md bg-indigo-500 px-3 py-1.5 text-white hover:bg-indigo-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          props.onDelete(v.username);
                        }}
                        class="ml-2 rounded-md bg-red-500 px-3 py-1.5 text-white hover:bg-indigo-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
