import z from "zod";
import { AppSyncEvent } from "../../../shared/core/types/appsync-event";
import { UserModel } from "../../core/model/user.model";
import { GetUserUseCase } from "../../core/use-cases/get-users.use-case";
import { UserRepository } from "../../persistence/repository/user.repository";
import { validationGetUsersSchema } from "./validation/get-users.validation";

export const handler = async (event: AppSyncEvent): Promise<UserModel[]> => {
  try {
    const pagination = validationGetUsersSchema.parse(
      event.arguments.pagination,
    );

    const userRepository = new UserRepository();
    const getUsersUseCase = new GetUserUseCase(userRepository);

    return await getUsersUseCase.execute(pagination.page, pagination.limit);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new Error(
        JSON.stringify({
          message: "Validation failed",
          details: err.flatten().fieldErrors,
        }),
      );
    }

    throw new Error(
      err instanceof Error
        ? err.message
        : "[handler - getUser] An unexpected error occurred",
    );
  }
};
