import z from "zod";
import { AppSyncEvent } from "../../../shared/core/types/appsync-event";
import { UserModel } from "../../core/model/user.model";
import { LoginUseCase } from "../../core/use-cases/login.use-case";
import { UserRepository } from "../../persistence/repository/user.repository";
import { validationLoginSchema } from "./validation/login.validation";

export const handler = async (
  event: AppSyncEvent,
): Promise<{ token: string; user: UserModel }> => {
  try {
    const payload = validationLoginSchema.parse(event.arguments.input);

    const userRepository = new UserRepository();
    const loginUseCase = new LoginUseCase(userRepository);

    return await loginUseCase.execute(payload);
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
        : "[handler - login] An unexpected error occurred",
    );
  }
};
