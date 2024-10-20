import { AppSyncEvent } from "../../../../../@common/types/appsync-event";
import { CustomJwtPayload } from "../../../../../@common/types/jwt.types";
import { ActivateUserUseCase } from "../../../../application/usecases/activate-user-useCase";
import { DynamoRepository } from "../../../dynamodb/UserRepository";
import { decode } from "jsonwebtoken";
import { validationActivateUserSchema } from "../../validations";
import { ValidationRequestError } from "../../../../../@common/errors/ValidationRequestError";

const getToken = (event: AppSyncEvent) =>
  event["request"]["headers"]["authorization"].split(" ")[1];

export const handler = async (event: AppSyncEvent) => {
  try {
    const userRepository = new DynamoRepository(
      `${process.env.DYNAMODB_TABLE}`,
    );

    const payload = event["arguments"]["input"];

    console.log("TOKEN: ", event["request"]["headers"]["authorization"]);

    const token = getToken(event);

    const { error } = validationActivateUserSchema.validate(payload);

    if (error) {
      const emailError = error.details.find((detail) =>
        detail.path.includes("userEmail"),
      );

      const isActiveError = error.details.find((detail) =>
        detail.path.includes("isActive"),
      );

      if (emailError) {
        throw new ValidationRequestError("O e-mail deve ser válido.");
      }

      if (isActiveError) {
        throw new ValidationRequestError(
          "Você deve informar se deseja ativar ou não o usuário",
        );
      }
    }

    const decodedJwt = decode(token) as CustomJwtPayload;

    if (!decodedJwt) {
      throw new Error("Invalid token payload");
    }

    console.debug(`Fetching users from table: ${process.env.DYNAMODB_TABLE}`);

    const activateUserUseCase = new ActivateUserUseCase(userRepository);

    const response = await activateUserUseCase.execute({
      sessionUserEmail: decodedJwt.email,
      userEmailToUpdate: payload["userEmail"],
      isActive: payload["isActive"],
    });

    return response;
  } catch (error) {
    throw new Error(`Error fetching users: ${error}`);
  }
};
