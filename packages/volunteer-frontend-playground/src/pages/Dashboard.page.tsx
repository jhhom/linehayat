export default function DashboardPage() {
  return (
    <div>
      <div class="flex h-screen">
        <div class="flex max-w-[260px] basis-1/4 flex-col border border-r px-2">
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
                <p class="pl-3 text-sm">James Madison</p>
                <div class="mt-0.5 flex items-center pl-3.5">
                  <div class="h-2.5 w-2.5 rounded-full bg-green-400" />
                  <p class="pl-1 text-xs">Online</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-grow space-y-2">
            <a
              href="#"
              class="block rounded-md bg-green-100/70 py-2  pl-2 text-green-700"
            >
              Dashboard
            </a>
            <a href="#" class="block rounded-md py-2 pl-2 hover:bg-gray-100">
              Chat
            </a>
            <a href="#" class="block rounded-md py-2 pl-2 hover:bg-gray-100">
              Setting
            </a>
          </div>

          <div class="pb-8">
            <button class="block w-full rounded-md bg-red-100 py-2">
              Log out
            </button>
          </div>
        </div>
        <div class="flex basis-3/4">
          <div class="basis-1/2 pt-2">
            <div class="text-center">Online volunteers</div>
            <table class="mt-2 w-full table-auto outline outline-red-400">
              <thead>
                <tr>
                  <th class="w-1/2">Username</th>
                  <th class="w-1/2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>James Madison</td>
                  <td>Online</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="basis-1/2 pt-2">
            <div class="text-center">Pending student requests</div>
            <table class="mt-2 w-full table-auto outline outline-red-400">
              <thead>
                <tr>
                  <th class="w-2/5">Alias</th>
                  <th class="w-2/5">Waiting time</th>
                  <th class="w-1/5">Action</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr>
                  <td>Top Moose</td>
                  <td>10 mins (waiting time)</td>
                  <td>
                    <button class="rounded-md bg-green-600 px-2 py-1 text-white">
                      Accept
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
