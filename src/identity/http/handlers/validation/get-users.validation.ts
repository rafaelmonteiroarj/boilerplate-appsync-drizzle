import { z } from "zod";

export const validationGetUsersSchema = z.object({
  limit: z.number(),
  page: z.number(),
});
