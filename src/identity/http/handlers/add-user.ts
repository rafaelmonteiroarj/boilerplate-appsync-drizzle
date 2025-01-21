import z from "zod";
import { AppSyncEvent } from "../../../shared/core/types/appsync-event";
import { UserModel } from "../../core/model/user.model";
import { AddUserUseCase } from "../../core/use-cases/add-user.use-case";
import { UserRepository } from "../../persistence/repository/user.repository";
import { validationRegisterSchema } from "./validation/user.validation";

export const handler = async (event: AppSyncEvent): Promise<UserModel> => {
  try {
    const payload = validationRegisterSchema.parse(event.arguments.input);

    const userRepository = new UserRepository();
    const addUserUseCase = new AddUserUseCase(userRepository);

    return await addUserUseCase.execute(payload);
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
        : "[handler - addUser] An unexpected error occurred",
    );
  }
};
