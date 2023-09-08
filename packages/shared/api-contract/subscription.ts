export type StudentSubscriptionMessage = {
  [k in keyof StudentSubscriptionEventPayload]: {
    event: k;
    payload: StudentSubscriptionEventPayload[k];
  };
}[keyof StudentSubscriptionEventPayload];

export type StudentSubscriptionEventPayload = {
  "student.request_accepted": {};
};

export type VolunteerSubscriptionMessage = {
  [k in keyof VolunteerSubscriptionEventPayload]: {
    event: k;
    payload: VolunteerSubscriptionEventPayload[k];
  };
}[keyof VolunteerSubscriptionEventPayload];

export type VolunteerSubscriptionEventPayload = {};
