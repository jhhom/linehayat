import { createEffect, createSignal, on } from "solid-js";
import { Pagination, Select } from "@kobalte/core";
import { IconExpandMore } from "~/pages/VolunteersTable/Icons";
import { match } from "ts-pattern";

const SIBLING_COUNT = 1;

const showingText = (props: {
  numberOfItemsDisplayed: number;
  pageNumber: number;
  totalItems: number;
  pageSize: number;
}) => {
  if (props.numberOfItemsDisplayed === 0) {
    return `Showing 0 of ${props.totalItems}`;
  }
  const start = (props.pageNumber - 1) * props.pageSize + 1;
  const end = start - 1 + props.numberOfItemsDisplayed;

  return `Showing ${start} - ${end} of ${props.totalItems}`;
};

const pageSizeToSelectOption = (pageSize: number) => {
  return `${pageSize} / page`;
};

export function TablePagination(props: {
  numberOfItemsDisplayed: number;
  pageNumber: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  onPageChange: (page: number) => void;
}) {
  return (
    <div class="mt-10">
      <div class="flex justify-between">
        <Pagination.Root
          class="h-8 text-sm [&>ul]:inline-flex [&>ul]:items-center [&>ul]:justify-between [&>ul]:gap-x-2"
          page={props.pageNumber}
          onPageChange={(page) => {
            props.onPageChange(page);
          }}
          count={props.totalPages}
          siblingCount={siblingCountToActualSiblingCount(
            SIBLING_COUNT,
            props.pageNumber,
            props.totalPages,
          )}
          showFirst={true}
          showLast={true}
          itemComponent={(props) => (
            <Pagination.Item
              class="inline-flex h-8 w-auto items-center justify-center rounded-md border border-gray-300 bg-white px-3 outline-none transition-colors hover:bg-blue-500 hover:text-white focus-visible:outline focus-visible:outline-offset-2 active:bg-blue-500 aria-[current=page]:bg-blue-500 aria-[current=page]:text-white"
              page={props.page}
            >
              {props.page}
            </Pagination.Item>
          )}
          ellipsisComponent={() => (
            <Pagination.Ellipsis class="inline-flex h-8 w-auto items-center justify-center rounded-md border bg-white px-3 outline-none">
              ...
            </Pagination.Ellipsis>
          )}
        >
          <Pagination.Previous
            disabled={props.pageNumber === 1}
            classList={{
              "hover:bg-blue-500 active:bg-blue-500 hover:text-white":
                props.pageNumber !== 1,
            }}
            class="inline-flex h-8 w-auto items-center justify-center rounded-md border border-gray-300 bg-white px-3 outline-none transition-colors hover:text-white focus-visible:outline focus-visible:outline-offset-2  disabled:text-gray-400 aria-[current=page]:bg-blue-500 aria-[current=page]:text-white"
          >
            Previous
          </Pagination.Previous>
          <Pagination.List />
          <Pagination.Next
            disabled={props.pageNumber === props.totalPages}
            classList={{
              "hover:bg-blue-500 active:bg-blue-500 hover:text-white":
                props.pageNumber !== props.totalPages,
            }}
            class="inline-flex h-8 w-auto items-center justify-center rounded-md border border-gray-300 bg-white px-3 outline-none transition-colors hover:text-white focus-visible:outline focus-visible:outline-offset-2 disabled:text-gray-400  aria-[current=page]:bg-blue-500 aria-[current=page]:text-white"
          >
            Next
          </Pagination.Next>
        </Pagination.Root>

        <div class="flex items-center text-sm">
          <p class="text-gray-500">
            {showingText({
              numberOfItemsDisplayed: props.numberOfItemsDisplayed,
              pageNumber: props.pageNumber,
              pageSize: props.pageSize,
              totalItems: props.totalItems,
            })}
          </p>
          <Select.Root
            class="ml-4 text-sm"
            value={pageSizeToSelectOption(props.pageSize)}
            onChange={(size) => {
              const pageSize = match(size)
                .with("10 / page", () => 10)
                .with("25 / page", () => 25)
                .otherwise(() => 50);

              props.onPageSizeChange(pageSize);

              return pageSize;
            }}
            options={["10 / page", "25 / page", "50 / page"]}
            itemComponent={(props) => (
              <Select.Item
                item={props.item}
                class="relative flex h-8 items-center justify-between rounded-md px-2 outline-none data-[highlighted]:bg-green-100 data-[highlighted]:text-green-600 data-[disabled]:opacity-50"
              >
                <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
                <Select.ItemIndicator class="inline-flex h-5 w-5 items-center justify-center"></Select.ItemIndicator>
              </Select.Item>
            )}
          >
            <Select.Trigger
              class="flex h-8 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 transition-colors hover:border-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label="Fruit"
            >
              <Select.Value<string> class="overflow-hidden overflow-ellipsis whitespace-nowrap data-[placeholder-shown]:text-gray-400">
                {(s) => s.selectedOption()}
              </Select.Value>
              <Select.Icon class="ml-1 flex h-8 w-5 items-center justify-center pt-1 text-gray-400">
                <IconExpandMore />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content class="animate-select-hide rounded-md border bg-white data-[expanded]:animate-select-show">
                <Select.Listbox class="max-h-96 overflow-y-auto p-2" />
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>
    </div>
  );
}

const siblingCountToActualSiblingCount = (
  siblingCount: number,
  pageNumber: number,
  lastPage: number,
) => {
  if (pageNumber < siblingCount + 3) {
    return 2 * siblingCount + (3 - pageNumber);
  } else if (pageNumber > lastPage - siblingCount - 2)
    return 2 * siblingCount + (pageNumber - lastPage + 2);
  else {
    return siblingCount;
  }
};
