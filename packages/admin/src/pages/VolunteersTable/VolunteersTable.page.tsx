import { Dialog } from "@kobalte/core";
import { createSignal, onMount, Show } from "solid-js";
import { client } from "~/external/api-client/client";
import { FilterCollapsible } from "~/pages/VolunteersTable/Filter/Filter";
import { TablePagination } from "~/pages/VolunteersTable/Pagination/Pagination";
import { LoadingSkeleton } from "~/pages/VolunteersTable/Table/LoadingSkeleton";

import {
  EditDialog,
  type Profile,
} from "~/pages/VolunteersTable/EditDialog/EditDialog";
import { Table } from "~/pages/VolunteersTable/Table/Table";

import { ServiceInput, ServiceOutput } from "@api-contract/types";
import { PaginationMeta } from "@api-contract/endpoints";

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

export default function VolunteersTablePage() {
  const [openDialog, setOpenDialog] = createSignal(false);
  const [editedProfile, setEditedProfile] = createSignal<Profile>({
    username: "",
    isApproved: false,
  });

  const [apiQuery, setApiQuery] = createSignal<
    ServiceInput<"admin/list_volunteers2">
  >({
    pagination: {
      pageSize: 10,
      pageNumber: 1,
    },
  });
  const [apiResults, setApiResults] =
    createSignal<ServiceOutput<"admin/list_volunteers2">>();

  onMount(async () => {
    const results = await client["admin/list_volunteers2"](apiQuery());
    if (results.isErr()) {
      return;
    }
    setApiResults(results.value);
  });

  const refreshTable = async () => {
    const results = await client["admin/list_volunteers2"](apiQuery());
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
    <div class="px-4 pb-12 sm:px-6 lg:px-8">
      <div class="pt-8">
        <p>Volunteers</p>
      </div>

      <FilterCollapsible
        onFilter={refreshTable}
        apiQuery={apiQuery}
        setApiQuery={setApiQuery}
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
        <Show when={apiResults() !== undefined} fallback={<LoadingSkeleton />}>
          <Table
            volunteers={apiResults()?.results ?? []}
            onDelete={async (username) => {
              const r = await client["admin/delete_volunteer"]({ username });
              if (r.isErr()) {
                alert(`Failed to delete volunteer: ${r.error}`);
                return;
              }
              await refreshTable();
            }}
            onEdit={(profile) => {
              setEditedProfile(profile);
              setOpenDialog(true);
            }}
          />
        </Show>

        <Dialog.Portal>
          <Dialog.Overlay />
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20">
            <Dialog.Content class="w-[500px] animate-dialog-hide rounded-md border bg-white p-4 data-[expanded]:animate-dialog-show">
              <EditDialog
                onSubmit={async (isApproved) => {
                  setOpenDialog(false);
                  const r = await client["admin/edit_volunteer_status"]({
                    username: editedProfile().username,
                    isApproved,
                  });
                  if (r.isErr()) {
                    alert(`Failed to update volunteer status: ${r.error}`);
                    return;
                  }
                  await refreshTable();
                }}
                editedProfile={editedProfile()}
              />
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
