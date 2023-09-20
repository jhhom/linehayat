import * as Ark from "@ark-ui/solid/date-picker";
import {
  Accessor,
  Setter,
  createSignal,
  Show,
  For,
  createEffect,
} from "solid-js";
import { Portal } from "solid-js/web";
import { Collapsible, Select } from "@kobalte/core";
import {
  IconCaretDown,
  IconCloseThick,
  IconSearch,
  IconClose,
  IconExpandMore,
  IconFilter,
} from "~/pages/VolunteersTable/Icons";
import DatePicker, { PickerValue } from "@rnwonder/solid-date-picker";
import { ServiceInput } from "@api-contract/types";
import { format, parse } from "date-fns";

export function FilterCollapsible(props: {
  apiQuery: Accessor<ServiceInput<"admin/list_feedbacks">>;
  setApiQuery: Setter<ServiceInput<"admin/list_feedbacks">>;
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
                  username: username === "" ? null : username,
                  from: props.apiQuery().filter?.from ?? null,
                  to: props.apiQuery().filter?.to ?? null,
                },
              });
            }}
          />

          <div class="mt-4">
            <CalendarFilter2
              startDate={props.apiQuery().filter?.from ?? undefined}
              endDate={props.apiQuery().filter?.to ?? undefined}
              onStartDateChange={(date) => {
                props.setApiQuery({
                  pagination: props.apiQuery().pagination,
                  filter: {
                    username: props.apiQuery().filter?.username ?? null,
                    from: date ?? null,
                    to: props.apiQuery().filter?.to ?? null,
                  },
                });
              }}
              onEndDateChange={(date) => {
                props.setApiQuery({
                  pagination: props.apiQuery().pagination,
                  filter: {
                    username: props.apiQuery().filter?.username ?? null,
                    ...props.apiQuery().filter,
                    from: props.apiQuery().filter?.from ?? null,
                    to: date ?? null,
                  },
                });
              }}
            />
          </div>

          <div class="mt-6 flex">
            <ButtonFilter onClick={props.onFilter} />
            <ButtonClearFilter
              onClick={() => {
                props.setApiQuery({
                  pagination: props.apiQuery().pagination,
                  filter: null,
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

function CalendarFilter2(props: {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}) {
  return (
    <div class="flex">
      <div class="basis-1/2">
        <p>From</p>
        <div class="mt-0.5 pr-2">
          <input
            class="w-full rounded-md border px-3 py-2"
            type="date"
            name=""
            id=""
            value={
              props.startDate
                ? format(props.startDate, "yyyy-MM-dd")
                : undefined
            }
            onChange={(e) => {
              props.onStartDateChange(e.target.valueAsDate);
            }}
          />
        </div>
      </div>
      <div class="basis-1/2">
        <p>To</p>
        <div class="mt-0.5">
          <input
            class="w-full rounded-md border px-3 py-2"
            type="date"
            name=""
            id=""
            value={
              props.endDate ? format(props.endDate, "yyyy-MM-dd") : undefined
            }
            onChange={(e) => {
              props.onEndDateChange(e.target.valueAsDate);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function CalendarFilter(props: {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onChange: (start: Date | undefined, end: Date | undefined) => void;
}) {
  /*
  {
    "value": {
      "selected": "2023-09-05T16:00:00.000Z",
      "selectedDateObject": {
        "year": 2023,
        "month": 8,
        "day": 6
      }
    },
    "label": "Sep 6, 2023"
  }
  */

  const [start, setStart] = createSignal<PickerValue>({
    label: "",
    value: {},
  });
  const [end, setEnd] = createSignal<PickerValue>({
    label: "",
    value: {},
  });

  createEffect(() => {
    props.onChange(
      pickerValueToDate(start().value.selectedDateObject),
      undefined,
    );
  });

  const dateToPickerValue = (date: Date | undefined): PickerValue => {
    return {
      value: {
        selected: date?.toISOString(),
        selectedDateObject: date
          ? {
              year: date.getFullYear(),
              month: date.getMonth(),
              day: date.getDay(),
            }
          : undefined,
      },
      label: dateToDisplay(date),
    };
  };

  const pickerValueToDate = (
    value: PickerValue["value"]["selectedDateObject"],
  ) => {
    if (value === undefined) {
      return undefined;
    }
    if (
      value.year === undefined ||
      value.month === undefined ||
      value.day === undefined
    ) {
      return undefined;
    }
    console.log("PICKER VALUE TO DATE");
    const formatted = `${value.year} - ${value.month - 1} - ${value.day}`;
    return parse(formatted, `yyyy - L - d`, new Date());
  };

  const dateToDisplay = (date: Date | undefined) => {
    if (date === undefined) {
      return "";
    }
    return format(date, "d, MMM yyyy");
  };

  return (
    <div>
      <DatePicker
        placeholder="Date"
        value={() => dateToPickerValue(props.startDate)}
        setValue={(value) => {
          const v = value as PickerValue;
          setStart(v);
        }}
      />
      <button
        class="mt-4 rounded-md bg-gray-200 px-4 py-2"
        onClick={() => {
          console.log(props.startDate);
        }}
      >
        Print date
      </button>
    </div>
  );
}
