import { Accessor, ParentComponent, Setter, createSignal } from "solid-js";
import { DashboardProvider, useDashboard } from "~/stores/dashboard.store";
import { MessagesProvider, useMessages } from "~/stores/messages.store";

import { ProfileProvider, useProfile } from "~/stores/profile.store";

export const AppProvider: ParentComponent = (props) => {
  return (
    <MessagesProvider>
      <ProfileProvider>
        <DashboardProvider>{props.children}</DashboardProvider>
      </ProfileProvider>
    </MessagesProvider>
  );
};

type AppStore = ReturnType<typeof useProfile> &
  ReturnType<typeof useDashboard> &
  ReturnType<typeof useMessages>;

export function useAppStore<T>(selector: (store: AppStore) => T): T {
  const profile = useProfile();
  const dashboard = useDashboard();
  const messages = useMessages();

  const appStore: AppStore = {
    ...dashboard,
    ...profile,
    ...messages,
  };

  return selector(appStore);
}
