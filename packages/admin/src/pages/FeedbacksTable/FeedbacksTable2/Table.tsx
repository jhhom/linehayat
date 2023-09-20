import { ServiceOutput } from "@api-contract/types";
import { format, isSameDay, parse } from "date-fns";

export type Feedback = ServiceOutput<"admin/list_feedbacks">["results"][number];

export default function Table(props: {
  feedbacks: Feedback[];
  onReadFeedback: (feedback: Feedback) => void;
  onDeleteFeedback: (feedbackId: number) => void;
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
                    Session
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Rating
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
                {props.feedbacks.map((f) => (
                  <tr>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {f.volunteerUsername}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatSessionTimeDisplay(f.sessionStart, f.sessionEnd)}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {f.rating}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <button
                        onClick={() => {
                          props.onReadFeedback(f);
                        }}
                        class="rounded-md bg-indigo-500 px-3 py-1.5 text-white hover:bg-indigo-600"
                      >
                        Read more
                      </button>
                      <button
                        onClick={() => {
                          props.onDeleteFeedback(f.feedbackId);
                        }}
                        class="ml-2 rounded-md bg-red-500 px-3 py-1.5 text-white hover:bg-red-600"
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

export const formatSessionTimeDisplay = (start: Date, end: Date) => {
  if (isSameDay(start, end)) {
    return `${format(start, "yyyy-MMM-d")} (${format(
      start,
      "HH:mm",
    )} until ${format(end, "HH:mm")})`;
  } else {
    return `${format(start, "yyyy-MM-d HH:mm")} ~ ${format(
      end,
      "yyyy-MM-d HH:mm",
    )}
  `;
  }
};
