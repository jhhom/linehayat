import { Dialog } from "@kobalte/core";
import { createSignal } from "solid-js";
import { format, isSameDay, parse } from "date-fns";

const newDate = (date: string) => {
  // "2023-Sep-23 12:30"
  return parse(date, "yyyy-MMM-dd HH:mm", new Date());
};

type Feedback = {
  volunteerUsername: string;
  sessionTime: {
    start: Date;
    end: Date;
  };
  rating: number;
  feedback: string;
};

const formatSessionTimeDisplay = (start: Date, end: Date) => {
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

const feedbacks: Feedback[] = [
  {
    volunteerUsername: "Lindsay Whalton",
    sessionTime: {
      start: newDate("2023-Sep-23 12:30"),
      end: newDate("2023-Sep-23 12:51"),
    },
    rating: 4.5,
    feedback: "She's very rice",
  },
  {
    volunteerUsername: "Jeremy Johnson",
    sessionTime: {
      start: newDate("2023-Sep-23 23:31"),
      end: newDate("2023-Sep-24 00:21"),
    },
    rating: 4.5,
    feedback: "She's very rice",
  },
  {
    volunteerUsername: "Jeremy Johnson",
    sessionTime: {
      start: newDate("2023-Sep-23 23:31"),
      end: newDate("2023-Sep-24 00:21"),
    },
    rating: 4.5,
    feedback: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet luctus ipsum a fringilla. Nunc purus lorem, dapibus eget tincidunt eu, porttitor id est. Nullam cursus sem vitae condimentum viverra. Maecenas volutpat feugiat nisi ac sollicitudin. Aliquam sed ullamcorper ex. Morbi ac urna nec massa dignissim sodales. Sed et lectus bibendum metus consectetur tincidunt. Nullam ac nulla luctus, viverra leo et, maximus felis. Donec consequat sagittis arcu eu pharetra.

    Maecenas molestie tincidunt sagittis. Quisque malesuada, nibh ut ullamcorper pellentesque, leo ex pretium sapien, nec consequat arcu lacus a elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas id neque ac nisi bibendum consequat eu ac quam. Praesent laoreet libero et urna posuere faucibus. Phasellus ultricies bibendum lacus, et luctus ex viverra eget. Cras ac gravida quam. Vivamus maximus porta orci sit amet interdum. Nunc lectus urna, tincidunt ut pulvinar at, rutrum eu orci. Sed risus sem, dapibus eget interdum non, commodo sit amet elit. Praesent quis varius mauris. Proin eget nisl ut metus pellentesque pretium. Nulla lobortis diam eget nulla gravida, eget egestas elit facilisis.
    
    Maecenas molestie tincidunt sagittis. Quisque malesuada, nibh ut ullamcorper pellentesque, leo ex pretium sapien, nec consequat arcu lacus a elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas id neque ac nisi bibendum consequat eu ac quam. Praesent laoreet libero et urna posuere faucibus. Phasellus ultricies bibendum lacus, et luctus ex viverra eget. Cras ac gravida quam. Vivamus maximus porta orci sit amet interdum. Nunc lectus urna, tincidunt ut pulvinar at, rutrum eu orci. Sed risus sem, dapibus eget interdum non, commodo sit amet elit. Praesent quis varius mauris. Proin eget nisl ut metus pellentesque pretium. Nulla lobortis diam eget nulla gravida, eget egestas elit facilisis.
    Maecenas molestie tincidunt sagittis. Quisque malesuada, nibh ut ullamcorper pellentesque, leo ex pretium sapien, nec consequat arcu lacus a elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas id neque ac nisi bibendum consequat eu ac quam. Praesent laoreet libero et urna posuere faucibus. Phasellus ultricies bibendum lacus, et luctus ex viverra eget. Cras ac gravida quam. Vivamus maximus porta orci sit amet interdum. Nunc lectus urna, tincidunt ut pulvinar at, rutrum eu orci. Sed risus sem, dapibus eget interdum non, commodo sit amet elit. Praesent quis varius mauris. Proin eget nisl ut metus pellentesque pretium. Nulla lobortis diam eget nulla gravida, eget egestas elit facilisis.
    Maecenas molestie tincidunt sagittis. Quisque malesuada, nibh ut ullamcorper pellentesque, leo ex pretium sapien, nec consequat arcu lacus a elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas id neque ac nisi bibendum consequat eu ac quam. Praesent laoreet libero et urna posuere faucibus. Phasellus ultricies bibendum lacus, et luctus ex viverra eget. Cras ac gravida quam. Vivamus maximus porta orci sit amet interdum. Nunc lectus urna, tincidunt ut pulvinar at, rutrum eu orci. Sed risus sem, dapibus eget interdum non, commodo sit amet elit. Praesent quis varius mauris. Proin eget nisl ut metus pellentesque pretium. Nulla lobortis diam eget nulla gravida, eget egestas elit facilisis.
    
    `,
  },
];

export default function FeedbacksTablePage() {
  const [openDialog, setOpenDialog] = createSignal(false);
  const [feedback, setFeedback] = createSignal<Feedback>({
    volunteerUsername: "",
    sessionTime: {
      start: new Date(0),
      end: new Date(0),
    },
    rating: 0,
    feedback: "",
  });

  return (
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="pt-8">
        <p>Feedbacks</p>
      </div>

      <Dialog.Root open={openDialog()} onOpenChange={setOpenDialog}>
        <Table
          onReadFeedback={(feedback) => {
            setOpenDialog(true);
            setFeedback(feedback);
          }}
        />

        <Dialog.Portal>
          <Dialog.Overlay />
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20">
            <Dialog.Content class="w-[calc(95vw)] max-w-[800px] animate-dialog-hide rounded-md border bg-white p-4 data-[expanded]:animate-dialog-show sm:w-[calc(80vw)] md:w-[calc(90vw)]">
              <div class="mb-3 flex items-baseline justify-between">
                <Dialog.Title class="text-lg">
                  {`Feedback for ${feedback().volunteerUsername}`}
                </Dialog.Title>
                <Dialog.CloseButton class="mt-auto h-6 w-6 rounded-md text-gray-500 hover:bg-gray-200">
                  <IconClose />
                </Dialog.CloseButton>
              </div>
              <div class="pt-4">
                <div>
                  <p class="text-gray-600">Session</p>
                  <p class="mt-0.5">
                    🕚{" "}
                    {formatSessionTimeDisplay(
                      feedback().sessionTime.start,
                      feedback().sessionTime.end,
                    )}
                  </p>
                </div>

                <div class="mt-5">
                  <p class="text-gray-600">Rating</p>
                  <p class="mt-0.5">⭐️ {feedback().rating} / 5</p>
                </div>

                <div class="mt-5">
                  <p class="text-gray-600">Comments</p>
                  <p class="mt-1 h-[200px] overflow-y-auto rounded-md border bg-gray-50 px-4 py-2">
                    {feedback().feedback}
                  </p>
                </div>
              </div>

              <div class="mt-12 flex justify-end">
                <button
                  onClick={() => setOpenDialog(false)}
                  class="rounded-md bg-gray-100 px-4 py-2"
                >
                  Close
                </button>
              </div>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function Table(props: { onReadFeedback: (feedback: Feedback) => void }) {
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
                {feedbacks.map((f) => (
                  <tr>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {f.volunteerUsername}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatSessionTimeDisplay(
                        f.sessionTime.start,
                        f.sessionTime.end,
                      )}
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
                          props.onReadFeedback(f);
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

function IconClose(props: { class?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="currentColor"
      class={props.class}
    >
      <path d="M256-192.348 192.348-256l224-224-224-224L256-767.652l224 224 224-224L767.652-704l-224 224 224 224L704-192.348l-224-224-224 224Z" />
    </svg>
  );
}
