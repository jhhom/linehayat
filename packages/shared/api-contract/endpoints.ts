import { z } from "zod";
import { zDashboardUpdateSchema } from "@api-contract/subscription";
import { zMessage, zStudentId } from "@api-contract/types";

export type Pagination = z.infer<typeof zPagination>;

export type PaginationMeta = z.infer<typeof zPaginationMeta>;

const zPagination = z.object({
  pageSize: z.number(),
  pageNumber: z.number(),
});

const zPaginationMeta = z.object({
  totalItems: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  pageNumber: z.number(),
});

const zMessageInput = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    content: z.string(),
  }),
  z.object({
    type: z.literal("voice"),
    blobBase64: z.string(),
  }),
]);

const adminContract = {
  "admin/login": {
    input: z.object({
      username: z.string(),
      password: z.string(),
    }),
    output: z.object({
      token: z.string(),
    }),
  },
  "admin/list_feedbacks": {
    input: z.object({
      filter: z
        .object({
          username: z.string().nullable(),
          from: z.date().nullable(),
          to: z.date().nullable(),
        })
        .nullable(),
      pagination: zPagination.optional(),
    }),
    output: z.object({
      results: z.array(
        z.object({
          feedbackId: z.number(),
          volunteerUsername: z.string(),
          volunteerId: z.number(),
          sessionStart: z.date(),
          sessionEnd: z.date(),
          rating: z.number().optional(),
          comment: z.string(),
        })
      ),
      pagination: zPaginationMeta,
    }),
  },
  "admin/list_volunteers": {
    output: z.array(
      z.object({
        username: z.string(),
        isApproved: z.boolean(),
      })
    ),
  },
  "admin/list_volunteers2": {
    input: z.object({
      filter: z
        .object({
          username: z.string().optional(),
          isApproved: z.boolean().optional(),
        })
        .optional(),
      pagination: zPagination.optional(),
    }),
    output: z.object({
      results: z.array(
        z.object({
          username: z.string(),
          isApproved: z.boolean(),
        })
      ),
      pagination: zPaginationMeta,
    }),
  },
  "admin/edit_volunteer_status": {
    input: z.object({
      username: z.string(),
      isApproved: z.boolean(),
    }),
    output: z.object({
      updatedApprovalStatus: z.boolean(),
    }),
  },
  "admin/delete_volunteer": {
    input: z.object({
      username: z.string(),
    }),
    output: z.object({
      message: z.string(),
    }),
  },
  "admin/delete_feedback": {
    input: z.object({
      feedbackId: z.number(),
    }),
    output: z.object({
      message: z.string(),
    }),
  },
};

const volunteerContract = {
  "volunteer/login": {
    input: z.object({
      username: z.string(),
      password: z.string(),
    }),
    output: z.object({
      token: z.string(),
      username: z.string(),
      email: z.string(),
      latestDashboard: zDashboardUpdateSchema,
    }),
  },
  "volunteer/accept_request": {
    input: z.object({
      studentId: zStudentId,
    }),
    output: z.object({
      message: z.string(),
    }),
  },
  "volunteer/send_message": {
    input: zMessageInput,
    output: zMessage,
  },
  "volunteer/hang_up": {
    output: z.object({
      message: z.string(),
    }),
  },
  "volunteer/typing": {
    input: z.object({
      typing: z.boolean(),
    }),
    output: z.object({
      message: z.string(),
    }),
  },
  "volunteer/sign_up": {
    input: z.object({
      username: z.string(),
      password: z.string(),
      email: z.string(),
    }),
    output: z.object({
      message: z.string(),
    }),
  },
};

const studentContract = {
  "student/make_request": {
    output: z.object({
      token: z.string(),
    }),
  },
  "student/send_message": {
    input: zMessageInput,
    output: zMessage,
  },
  "student/hang_up": {
    output: z.object({
      message: z.string(),
    }),
  },
  "student/typing": {
    input: z.object({
      typing: z.boolean(),
    }),
    output: z.object({
      message: z.string(),
    }),
  },
};

export const contract = {
  ...adminContract,
  ...volunteerContract,
  ...studentContract,
};

export type Contract = typeof contract;

export type StudentContract = typeof studentContract;

export type VolunteerContract = typeof volunteerContract;

export type AdminContract = typeof adminContract;

export type MessageInput = z.infer<typeof zMessageInput>;
