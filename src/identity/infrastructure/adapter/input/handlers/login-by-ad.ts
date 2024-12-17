import { ValidationRequestError } from "../../../../../@common/errors/ValidationRequestError";
import { AppSyncEvent } from "../../../../../@common/types/appsync-event";
import { validationLoginSchemaAD } from "../../validations";
import { DynamoRepository } from "../../../dynamodb/UserRepository";
import { LoginUserUseCase } from "../../../../application/usecases/login.useCase";

export const handler = async (event: AppSyncEvent) => {
  try {
    const payload = event["arguments"]["input"];
    const { error } = validationLoginSchemaAD.validate(payload);
    const userRepository = new DynamoRepository(
      `${process.env.DYNAMODB_TABLE}`,
    );
    const loginUserUseCase = new LoginUserUseCase(userRepository);

    if (error) {
      throw new ValidationRequestError(
        "E-mail inválido. Verifique os dados e tente novamente.",
      );
    }

    const result = await loginUserUseCase.executeByAD(
      payload["email"],
      payload["name"],
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
