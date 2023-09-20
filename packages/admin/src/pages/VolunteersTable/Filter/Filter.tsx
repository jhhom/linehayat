import { Accessor, Setter, createSignal } from "solid-js";
import { Collapsible, Select } from "@kobalte/core";
import {
  IconCaretDown,
  IconCloseThick,
  IconSearch,
  IconClose,
  IconExpandMore,
  IconFilter,
} from "~/pages/VolunteersTable/Icons";
import { ServiceInput } from "@api-contract/types";

export function FilterCollapsible(props: {
  apiQuery: Accessor<ServiceInput<"admin/list_volunteers2">>;
  setApiQuery: Setter<ServiceInput<"admin/list_volunteers2">>;
  onFilter: () => void;
}) {
  const [openFilter, setOpenFilter] = createSignal(true);

  return (
    <Collapsible.Root
      open={openFilter()}
      onOpenChange={setOpenFilter}
      class="mt-4 w-full"
    >
      <Collapsible.Trigger
        class="flex w-full items-center rounded-t-md border p-3 text-gray-400"
        classList={{
          "rounded-b-md": !openFilter(),
        }}
      >
        <span
          class="flex h-5 w-5 -rotate-90 items-center justify-center p-1 transition-transform"
          classList={{
            "-rotate-90": !openFilter(),
          }}
        >
          <IconCaretDown />
        </span>
        <span class="ml-2 flex h-5 w-5  items-center justify-center">
          <IconFilter />
        </span>
        <span class="ml-3 text-sm font-medium text-gray-700">Filters</span>
      </Collapsible.Trigger>
      <Collapsible.Content class="w-full animate-slide-up overflow-hidden border border-t-0 text-sm data-[expanded]:animate-slide-down">
        <div class="h-full w-full p-4">
          <UsernameFilter
            value={props.apiQuery().filter?.username ?? ""}
            onChange={(username) => {
              props.setApiQuery({
                pagination: props.apiQuery().pagination,
                filter: {
                  ...props.apiQuery().filter,
                  username: username === "" ? undefined : username,
                },
              });
            }}
          />

          <div class="mt-4">
            <StatusFilter
              value={props.apiQuery().filter?.isApproved}
              onChange={(isApproved) => {
                props.setApiQuery({
                  pagination: props.apiQuery().pagination,
                  filter: {
                    ...props.apiQuery().filter,
                    isApproved,
                  },
                });
              }}
            />
          </div>

          <div class="mt-4 flex">
            <ButtonFilter onClick={props.onFilter} />
            <ButtonClearFilter
              onClick={() => {
                props.setApiQuery({
                  pagination: props.apiQuery().pagination,
                  filter: undefined,
                });
              }}
            />
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function ButtonFilter(props: { onClick: () => void }) {
  return (
    <button
      onClick={props.onClick}
      class="ml-2 flex items-center rounded-md bg-blue-500 pl-1.5 pr-4 text-white hover:bg-blue-600"
    >
      <span class="flex h-9 w-8 items-center p-2 text-white">
        <IconSearch />
      </span>
      <span class="flex items-center">Filter</span>
    </button>
  );
}

function ButtonClearFilter(props: { onClick: () => void }) {
  return (
    <button
      onClick={props.onClick}
      class="ml-2 flex items-center rounded-md bg-gray-200 pl-1.5 pr-4 text-gray-700 hover:bg-gray-300"
    >
      <span class="flex h-9 w-8 items-center p-2 text-gray-500">
        <IconCloseThick />
      </span>
      <span class="flex items-center">Clear filters</span>
    </button>
  );
}

function UsernameFilter(props: {
  value: string;
  onChange?: (text: string) => void;
}) {
  return (
    <div>
      <p class="text-gray-500">Username</p>
      <input
        value={props.value}
        type="text"
        placeholder="Value"
        class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2"
        onInput={(e) => {
          if (props.onChange) {
            props.onChange(e.currentTarget.value);
          }
        }}
      />
    </div>
  );
}

function StatusFilter(props: {
  value: boolean | undefined;
  onChange?: (isApproved: boolean | undefined) => void;
}) {
  const isApprovedToSelectOption = (isApproved: boolean | undefined) => {
    if (isApproved === undefined) {
      return "None";
    } else if (isApproved) {
      return "Approved";
    } else {
      return "Pending";
    }
  };

  return (
    <div>
      <p class="text-gray-500">Status</p>
      <Select.Root
        value={isApprovedToSelectOption(props.value)}
        onChange={(s) => {
          if (!props.onChange) {
            return;
          }

          if (s === "None") {
            props.onChange(undefined);
          } else if (s === "Pending") {
            props.onChange(false);
          } else {
            props.onChange(true);
          }
        }}
        class="mt-2"
        options={["None", "Pending", "Approved"]}
        placeholder="None"
        defaultValue={"None"}
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
          class="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 transition-colors hover:border-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label="Fruit"
        >
          <Select.Value<string> class="overflow-hidden overflow-ellipsis whitespace-nowrap data-[placeholder-shown]:text-gray-400">
            {(s) => s.selectedOption()}
          </Select.Value>
          <Select.Icon class="h-5 w-5 text-gray-400"></Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content class="animate-select-hide rounded-md border bg-white data-[expanded]:animate-select-show">
            <Select.Listbox class="max-h-96 overflow-y-auto p-2" />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
