import { Dialog } from "@kobalte/core";
import { createSignal, onMount } from "solid-js";
import { parse } from "date-fns";
import { ServiceInput, ServiceOutput } from "@api-contract/types";

import Table, {
  type Feedback,
} from "~/pages/FeedbacksTable/FeedbacksTable2/Table";
import { IconClose } from "~/pages/VolunteersTable/Icons";
import { formatSessionTimeDisplay } from "~/pages/FeedbacksTable/FeedbacksTable2/Table";
import { TablePagination } from "~/pages/FeedbacksTable/FeedbacksTable2/Pagination/Pagination";
import { FilterCollapsible } from "~/pages/FeedbacksTable/FeedbacksTable2/Filter/Filter";
import { client } from "~/external/api-client/client";

const newDate = (date: string) => {
  // "2023-Sep-23 12:30"
  return parse(date, "yyyy-MMM-dd HH:mm", new Date());
};

const paginationPageNumber = (
  pageNumber: number | undefined,
  totalPages: number | undefined,
) => {
  if (pageNumber === undefined) {
    return 1;
  }
  if (totalPages && pageNumber > totalPages) {
    return totalPages;
  }
  return pageNumber;
};

export default function FeedbacksTablePage() {
  const [openDialog, setOpenDialog] = createSignal(false);

  const [readFeedback, setReadFeedback] = createSignal<Feedback>({
    comment: "",
    sessionStart: new Date(0),
    sessionEnd: new Date(0),
    volunteerUsername: "",
    volunteerId: 0,
    feedbackId: 0,
  });

  const [apiQuery, setApiQuery] = createSignal<
    ServiceInput<"admin/list_feedbacks">
  >({
    pagination: {
      pageSize: 10,
      pageNumber: 1,
    },
    filter: null,
  });
  const [apiResults, setApiResults] =
    createSignal<ServiceOutput<"admin/list_feedbacks">>();

  onMount(async () => {
    const results = await client["admin/list_feedbacks"](apiQuery());
    if (results.isErr()) {
      return;
    }
    setApiResults(results.value);
  });

  const refreshTable = async () => {
    const results = await client["admin/list_feedbacks"](apiQuery());
    if (results.isErr()) {
      return;
    }

    const resultsPagination = results.value.pagination;
    setApiQuery({
      filter: apiQuery().filter,
      pagination: {
        pageSize: resultsPagination.pageSize,
        pageNumber: resultsPagination.pageNumber,
      },
    });

    setApiResults(results.value);
  };

  return (
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="pt-8">
        <p>Feedbacks</p>
      </div>

      <FilterCollapsible
        onFilter={refreshTable}
        apiQuery={apiQuery}
        setApiQuery={(query) => {
          const q = query as ServiceInput<"admin/list_feedbacks">;
          setApiQuery(q);
        }}
      />

      <TablePagination
        numberOfItemsDisplayed={apiResults()?.results.length ?? 0}
        pageNumber={paginationPageNumber(
          apiResults()?.pagination.pageNumber,
          apiResults()?.pagination.totalPages,
        )}
        totalItems={apiResults()?.pagination.totalItems ?? 0}
        totalPages={apiResults()?.pagination.totalPages ?? 1}
        pageSize={apiQuery()?.pagination?.pageSize ?? 10_000}
        onPageChange={(page) => {
          setApiQuery({
            filter: apiQuery().filter,
            pagination: {
              pageNumber: page,
              pageSize: apiQuery().pagination?.pageSize ?? 10_000,
            },
          });
          refreshTable();
        }}
        onPageSizeChange={(pageSize) => {
          setApiQuery({
            pagination: {
              pageNumber: apiQuery().pagination?.pageNumber ?? 1,
              pageSize,
            },
            filter: apiQuery().filter,
          });
          refreshTable();
        }}
      />

      <Dialog.Root open={openDialog()} onOpenChange={setOpenDialog}>
        <Table
          feedbacks={apiResults()?.results ?? []}
          onDeleteFeedback={async (feedbackId) => {
            const r = await client["admin/delete_feedback"]({ feedbackId });
            if (r.isErr()) {
              alert(`Failed to delete feedback: ${r.error}`);
              return;
            }
            await refreshTable();
          }}
          onReadFeedback={(feedback) => {
            setOpenDialog(true);
            setReadFeedback(feedback);
          }}
        />

        <Dialog.Portal>
          <Dialog.Overlay />
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20">
            <Dialog.Content class="w-[calc(95vw)] max-w-[800px] animate-dialog-hide rounded-md border bg-white p-4 data-[expanded]:animate-dialog-show sm:w-[calc(80vw)] md:w-[calc(90vw)]">
              <div class="mb-3 flex items-baseline justify-between">
                <Dialog.Title class="text-lg">
                  {`Feedback for ${readFeedback().volunteerUsername}`}
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
                      readFeedback().sessionStart,
                      readFeedback().sessionEnd,
                    )}
                  </p>
                </div>

                <div class="mt-5">
                  <p class="text-gray-600">Rating</p>
                  <p class="mt-0.5">
                    ⭐️{" "}
                    {readFeedback().rating
                      ? `${readFeedback().rating} / 5`
                      : "-"}
                  </p>
                </div>

                <div class="mt-5">
                  <p class="text-gray-600">Comments</p>
                  <p class="mt-1 h-[200px] overflow-y-auto rounded-md border bg-gray-50 px-4 py-2">
                    {readFeedback().comment}
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
