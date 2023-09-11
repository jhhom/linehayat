import { Accessor, ParentComponent, Setter, createSignal } from "solid-js";
import { MessagesProvider, useMessages } from "~/stores/messages.store";

import { ProfileProvider, useProfile } from "~/stores/profile.store";

export const AppProvider: ParentComponent = (props) => {
  return (
    <ProfileProvider>
      <MessagesProvider>{props.children}</MessagesProvider>
    </ProfileProvider>
  );
};

type AppStore = ReturnType<typeof useProfile> & ReturnType<typeof useMessages>;

export function useAppStore<T>(selector: (store: AppStore) => T): T {
  const profile = useProfile();
  const messages = useMessages();

  const appStore: AppStore = {
    ...profile,
    ...messages,
  };

  return selector(appStore);
}
