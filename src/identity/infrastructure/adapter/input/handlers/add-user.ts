import { DynamoRepository } from "../../../dynamodb/UserRepository";
import { AppSyncEvent } from "./../../../../../@common/types/appsync-event";
import { ValidationRequestError } from "./../../../../../@common/errors/ValidationRequestError";
import { validationRegisterSchema } from "../../validations";
import { AddUserUseCase } from "../../../../application/usecases/add-user.useCase";
import { Origin } from "../../../../../@common/types/enums";

export const handler = async (event: AppSyncEvent) => {
  try {
    const userRepository = new DynamoRepository(
      `${process.env.DYNAMODB_TABLE}`,
    );
    const addUsersUseCase = new AddUserUseCase(userRepository);

    const payload = event["arguments"]["input"];
    const { error } = validationRegisterSchema.validate(payload);

    if (error) {
      const emailError = error.details.find((detail) =>
        detail.path.includes("email"),
      );
      const passwordError = error.details.find((detail) =>
        detail.path.includes("password"),
      );

      if (emailError) {
        throw new ValidationRequestError("O e-mail deve ser válido.");
      } else if (passwordError) {
        throw new ValidationRequestError(
          "A Senha não atende aos requisitos mínimos de segurança.",
        );
      } else {
        throw new ValidationRequestError(
          "Validation error: " + error.details[0].message,
        );
      }
    }

    return await addUsersUseCase.execute({
      name: payload["name"],
      email: payload["email"],
      password: payload["password"],
      origin: Origin.TRENDS,
      grantAccessGenia: new Map<string, boolean>([
        ["coe", false],
        ["trends", true],
      ]),
    });
  } catch (error) {
    if (error instanceof ValidationRequestError) {
      throw new ValidationRequestError(`Validation error: ${error.message}`);
    } else {
      throw new Error(`${error}`);
    }
  }
};
