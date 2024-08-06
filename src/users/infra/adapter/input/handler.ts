import { verify, JwtPayload } from "jsonwebtoken";

import { DynamoRepository } from "../../dynamodb/DynamoRepository";
import { AppSyncEvent } from "../../../../@common/types/appsync-event";
import { UserUseCase } from "../../../application/useCases/UserUseCase";
import { validationLoginSchema, validationRegisterSchema } from "./validations";
import { ValidationRequestError } from "../../../../@common/errors/ValidationRequestError";

const userRepository = new DynamoRepository(`${process.env.DYNAMODB_TABLE}`);
const getUsersUseCase = new UserUseCase(userRepository);

export const getUsers = async () => {
  try {
    return await getUsersUseCase.list();
  } catch (error) {
    throw new Error(`Error fetching users: ${error}`);
  }
};

export const addUser = async (event: AppSyncEvent) => {
  try {
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

    return await getUsersUseCase.create({
      name: payload["name"],
      email: payload["email"],
      password: payload["password"],
    });
  } catch (error) {
    if (error instanceof ValidationRequestError) {
      throw new ValidationRequestError(`Validation error: ${error.message}`);
    } else {
      throw new Error(`${error}`);
    }
  }
};

export const login = async (event: AppSyncEvent) => {
  try {
    const payload = event["arguments"]["input"];
    const { error } = validationLoginSchema.validate(payload);

    if (error) {
      throw new ValidationRequestError(
        "Usuário ou senha inválidos. Verifique os dados e tente novamente.",
      );
    }

    const result = await getUsersUseCase.login(
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

export const authorizer = async (event: any) => {
  try {
    const token = event.authorizationToken?.split(" ")[1];
    verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;

    return {
      isAuthorized: true, // ou false se a autorização falhar
      resolverContext: {}, // Qualquer contexto adicional que você deseja passar
      deniedFields: [], // Campos específicos que podem ser negados para o usuário
      ttlOverride: 300, // Opcional: TTL em segundos para o cache da autorização
    };
  } catch (err) {
    console.error("Error: ", err);
    throw new Error("Unauthorized");
  }
};
