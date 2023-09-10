import { Accessor, ParentComponent, Setter, createSignal } from "solid-js";
import { DashboardProvider, useDashboard } from "~/stores/dashboard.store";

import { ProfileProvider, useProfile } from "~/stores/profile.store";

export const AppProvider: ParentComponent = (props) => {
  return (
    <ProfileProvider>
      <DashboardProvider>{props.children}</DashboardProvider>
    </ProfileProvider>
  );
};

type AppStore = ReturnType<typeof useProfile> & ReturnType<typeof useDashboard>;

export function useAppStore<T>(selector: (store: AppStore) => T): T {
  const profile = useProfile();
  const dashboard = useDashboard();

  const appStore: AppStore = {
    ...dashboard,
    ...profile,
  };

  return selector(appStore);
}
