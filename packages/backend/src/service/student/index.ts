import { sendMessage } from "@backend/service/student/send-message.service";
import { makeRequest } from "@backend/service/student/make-request.service";
import { hangUp } from "@backend/service/student/hang-up.service";
import { typing } from "@backend/service/student/typing.service";
import { submitFeedback } from "@backend/service/student/submit-feedback.service";

export { sendMessage, makeRequest, hangUp, typing, submitFeedback };
