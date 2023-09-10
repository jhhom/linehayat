import { Accessor, ParentComponent, Setter, createSignal } from "solid-js";

import { ProfileProvider, useProfile } from "~/stores/profile.store";

export const AppProvider: ParentComponent = (props) => {
  return <ProfileProvider>{props.children}</ProfileProvider>;
};

type AppStore = ReturnType<typeof useProfile>;

export function useAppStore<T>(selector: (store: AppStore) => T): T {
  const profile = useProfile();

  const appStore: AppStore = {
    ...profile,
  };

  return selector(appStore);
}
