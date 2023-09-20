import { AppTRPC } from "@backend/router/context";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import { contract } from "@api-contract/endpoints";

import * as adminService from "@backend/service/admin";
import { AppTRPCGuards } from "@backend/router/guards";

export const makeAdminRouter = (
  {
    router,
    procedure,
    guardIsAuthedAsAdmin,
  }: {
    router: AppTRPC["router"];
    procedure: AppTRPC["procedure"];
    guardIsAuthedAsAdmin: AppTRPCGuards["guardIsAuthedAsAdmin"];
  },
  {
    db,
  }: {
    db: Kysely<DB>;
  },
  config: { jwtKey: string }
) => {
  return router({
    ["admin/login"]: procedure
      .input(contract["admin/login"].input)
      .output(contract["admin/login"].output)
      .mutation(async ({ input, ctx }) => {
        const result = await adminService.login(
          {
            db,
            jwtKey: config.jwtKey,
          },
          {
            username: input.username,
            password: input.password,
          },
          {
            setAuth: (args) => ctx.ctx.setAuth(args),
          }
        );
        if (result.isErr()) {
          throw result.error;
        }
        return result.value;
      }),
    ["admin/list_volunteers"]: procedure
      .use(guardIsAuthedAsAdmin)
      .output(contract["admin/list_volunteers"].output)
      .query(async () => {
        const result = await adminService.listVolunteers({
          db,
        });
        if (result.isErr()) {
          throw result.error;
        }
        return result.value;
      }),
    ["admin/list_volunteers2"]: procedure
      .use(guardIsAuthedAsAdmin)
      .input(contract["admin/list_volunteers2"].input)
      .output(contract["admin/list_volunteers2"].output)
      .query(async ({ input, ctx }) => {
        const result = await adminService.listVolunteers2(
          {
            db,
          },
          input
        );
        if (result.isErr()) {
          throw result.error;
        }
        return result.value;
      }),
    ["admin/list_feedbacks"]: procedure
      .use(guardIsAuthedAsAdmin)
      .input(contract["admin/list_feedbacks"].input)
      .output(contract["admin/list_feedbacks"].output)
      .query(async ({ input, ctx }) => {
        const result = await adminService.listFeedbacks(
          {
            db,
          },
          input
        );
        if (result.isErr()) {
          throw result.error;
        }
        return result.value;
      }),
    ["admin/delete_volunteer"]: procedure
      .use(guardIsAuthedAsAdmin)
      .input(contract["admin/delete_volunteer"].input)
      .output(contract["admin/delete_volunteer"].output)
      .mutation(async ({ ctx, input }) => {
        const result = await adminService.deleteVolunteer(
          {
            db,
          },
          input
        );
        if (result.isErr()) {
          throw result.error;
        }
        return result.value;
      }),
    ["admin/delete_feedback"]: procedure
      .use(guardIsAuthedAsAdmin)
      .input(contract["admin/delete_feedback"].input)
      .output(contract["admin/delete_feedback"].output)
      .mutation(async ({ ctx, input }) => {
        const result = await adminService.deleteFeedback(
          {
            db,
          },
          input
        );
        if (result.isErr()) {
          throw result.error;
        }
        return result.value;
      }),
    ["admin/edit_volunteer_status"]: procedure
      .use(guardIsAuthedAsAdmin)
      .input(contract["admin/edit_volunteer_status"].input)
      .output(contract["admin/edit_volunteer_status"].output)
      .mutation(async ({ ctx, input }) => {
        const result = await adminService.editVolunteerStatus(
          {
            db,
          },
          input
        );
        if (result.isErr()) {
          throw result.error;
        }
        return result.value;
      }),
  });
};

export type IAppAdminRouter = ReturnType<typeof makeAdminRouter>;
