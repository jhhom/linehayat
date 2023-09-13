import { Accessor, ParentComponent, Setter, createSignal } from "solid-js";
import { DashboardProvider, useDashboard } from "~/stores/dashboard.store";
import { MessagesProvider, useMessages } from "~/stores/messages.store";

import { ProfileProvider, useProfile } from "~/stores/profile.store";
import { StudentProvider, useStudent } from "~/stores/student.store";

export const AppProvider: ParentComponent = (props) => {
  return (
    <StudentProvider>
      <MessagesProvider>
        <ProfileProvider>
          <DashboardProvider>{props.children}</DashboardProvider>
        </ProfileProvider>
      </MessagesProvider>
    </StudentProvider>
  );
};

type AppStore = ReturnType<typeof useProfile> &
  ReturnType<typeof useDashboard> &
  ReturnType<typeof useMessages> &
  ReturnType<typeof useStudent>;

export function useAppStore<T>(selector: (store: AppStore) => T): T {
  const profile = useProfile();
  const dashboard = useDashboard();
  const messages = useMessages();
  const student = useStudent();

  const appStore: AppStore = {
    ...dashboard,
    ...profile,
    ...messages,
    ...student,
  };

  return selector(appStore);
}
