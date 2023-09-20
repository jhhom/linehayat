import { createSignal } from "solid-js";
import { Dialog } from "@kobalte/core";
import { IconClose } from "~/pages/VolunteersTable/Icons";

export type Profile = {
  username: string;
  isApproved: boolean;
};

const statusEditDescription = (
  currentApprovedStatus: boolean,
  editedApprovedStatus: boolean,
  name: string,
) => {
  if (currentApprovedStatus && editedApprovedStatus) {
    return `${name} is able to login into platform`;
  } else if (currentApprovedStatus && !editedApprovedStatus) {
    return `Setting to [PENDING] status will disable ${name} from login into the platform`;
  } else if (!currentApprovedStatus && editedApprovedStatus) {
    return `A notification email will be sent to ${name} if they're approved while in a [PENDING] status. They will also be able to login into the platform.`;
  } else {
    return `In [PENDING] status, ${name} will not be able to login to platform`;
  }
};

export function EditDialog(props: {
  onSubmit: (isApprove: boolean) => void;
  editedProfile: Profile;
}) {
  const [approve, setApprove] = createSignal(false);

  return (
    <div class="h-full w-full">
      <div class="mb-3 flex items-baseline justify-between">
        <Dialog.Title class="text-lg">
          <span>{props.editedProfile.username}</span>
          <span
            classList={{
              "bg-yellow-100 text-yellow-600": !props.editedProfile.isApproved,
              "bg-green-100 text-green-600": props.editedProfile.isApproved,
            }}
            class="ml-2 rounded-md  px-2 py-1 text-base "
          >
            {props.editedProfile.isApproved ? "Approved" : "Pending"}
          </span>
        </Dialog.Title>
        <Dialog.CloseButton class="mt-auto h-6 w-6 rounded-md text-gray-500 hover:bg-gray-200">
          <IconClose />
        </Dialog.CloseButton>
      </div>
      <div class="text-sm text-gray-600">
        {props.editedProfile.isApproved
          ? `${props.editedProfile.username} has an (approved) status, they are able to login into the platform`
          : `${props.editedProfile.username} has a (pending) status, they are not able to
    login into the platform`}
      </div>
      <div class="pt-4">
        <p>Status</p>
        <div class="mt-2 flex pl-1 text-sm">
          <div>
            <input
              type="checkbox"
              checked={approve()}
              onChange={(e) => setApprove(e.currentTarget.checked)}
            />
          </div>
          <div class="pl-2.5">
            <p>{approve() ? "Approve" : "Pending"}</p>
            <p class="mt-1 text-gray-500">
              {statusEditDescription(
                props.editedProfile.isApproved,
                approve(),
                props.editedProfile.username,
              )}
            </p>
          </div>
        </div>
      </div>
      <div class="mt-12 flex justify-end">
        <button
          onClick={() => {
            if (approve() !== props.editedProfile.isApproved) {
              props.onSubmit(approve());
            }
          }}
          class="rounded-md bg-indigo-500 px-4 py-2 text-white"
        >
          Update
        </button>
      </div>
    </div>
  );
}
