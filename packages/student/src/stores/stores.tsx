import { Accessor, ParentComponent, Setter, createSignal } from "solid-js";
import { MessagesProvider, useMessages } from "~/stores/messages.store";

import { ProfileProvider, useProfile } from "~/stores/profile.store";
import { VolunteerProvider, useVolunteer } from "~/stores/volunteer.store";

export const AppProvider: ParentComponent = (props) => {
  return (
    <VolunteerProvider>
      <ProfileProvider>
        <MessagesProvider>{props.children}</MessagesProvider>
      </ProfileProvider>
    </VolunteerProvider>
  );
};

export type AppStore = ReturnType<typeof useProfile> &
  ReturnType<typeof useMessages> &
  ReturnType<typeof useVolunteer>;

export function useAppStore<T>(selector: (store: AppStore) => T): T {
  const profile = useProfile();
  const messages = useMessages();
  const volunteer = useVolunteer();

  const appStore: AppStore = {
    ...profile,
    ...messages,
    ...volunteer,
  };

  return selector(appStore);
}
