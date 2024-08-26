import { ValidationRequestError } from "../../../../../@common/errors/ValidationRequestError";
import { AppSyncEvent } from "../../../../../@common/types/appsync-event";
import { validationLoginSchema } from "../../validations";
import { DynamoRepository } from "../../../dynamodb/UserRepository";
import { LoginUserUseCase } from "../../../../application/usecases/login.useCase";

export const handler = async (event: AppSyncEvent) => {
  try {
    const payload = event["arguments"]["input"];
    const { error } = validationLoginSchema.validate(payload);
    const userRepository = new DynamoRepository(
      `${process.env.DYNAMODB_TABLE}`,
    );
    const loginUserUseCase = new LoginUserUseCase(userRepository);

    if (error) {
      throw new ValidationRequestError(
        "Usuário ou senha inválidos. Verifique os dados e tente novamente.",
      );
    }

    const result = await loginUserUseCase.execute(
      payload["email"],
      payload["password"],
    );
    return result;
  } catch (error) {
    if (error instanceof ValidationRequestError) {
      throw new ValidationRequestError(`Validation error: ${error.message}`);
    } else {
      throw new Error(`${error}`);
    }
  }
};
