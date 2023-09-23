import { Accessor, ParentComponent, Setter, createSignal } from "solid-js";
import { MessagesProvider, useMessages } from "~/stores/messages.store";

import { ProfileProvider, useProfile } from "~/stores/profile.store";
import { VolunteerProvider, useVolunteer } from "~/stores/volunteer.store";
import { FeedbackIdProvider, useFeedbackId } from "~/stores/feedback.store";

export const AppProvider: ParentComponent = (props) => {
  return (
    <FeedbackIdProvider>
      <VolunteerProvider>
        <ProfileProvider>
          <MessagesProvider>{props.children}</MessagesProvider>
        </ProfileProvider>
      </VolunteerProvider>
    </FeedbackIdProvider>
  );
};

export type AppStore = ReturnType<typeof useProfile> &
  ReturnType<typeof useMessages> &
  ReturnType<typeof useVolunteer> &
  ReturnType<typeof useFeedbackId>;

export function useAppStore<T>(selector: (store: AppStore) => T): T {
  const profile = useProfile();
  const messages = useMessages();
  const volunteer = useVolunteer();
  const feedbackId = useFeedbackId();

  const appStore: AppStore = {
    ...profile,
    ...messages,
    ...volunteer,
    ...feedbackId,
  };

  return selector(appStore);
}
