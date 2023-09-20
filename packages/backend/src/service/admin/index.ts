import { login } from "@backend/service/admin/login.service";
import { listVolunteers } from "@backend/service/admin/list-volunteers.service";
import { listVolunteers2 } from "@backend/service/admin/list-volunteers-2.service";
import { listFeedbacks } from "@backend/service/admin/list-feedbacks.service";
import { deleteVolunteer } from "@backend/service/admin/delete-volunteer.service";
import { editVolunteerStatus } from "@backend/service/admin/edit-volunteer-status.service";
import { deleteFeedback } from "@backend/service/admin/delete-feedback";

export {
  login,
  listVolunteers,
  listVolunteers2,
  listFeedbacks,
  deleteVolunteer,
  deleteFeedback,
  editVolunteerStatus,
};
