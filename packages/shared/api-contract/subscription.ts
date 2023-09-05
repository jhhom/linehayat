export type SubscriptionMessage = {
  [k in keyof SubscriptionEventPayload]: {
    event: k;
    payload: SubscriptionEventPayload[k];
  };
}[keyof SubscriptionEventPayload];

export type SubscriptionEventPayload = {
  "student.request_accepted": {};
};
