import { GetUserUseCase } from "../../../../application/usecases/get-user.useCase";
import { DynamoRepository } from "../../../dynamodb/UserRepository";

export const handler = async () => {
  try {
    const userRepository = new DynamoRepository(
      `${process.env.DYNAMODB_TABLE}`,
    );

    console.debug(`Fetching users from table: ${process.env.DYNAMODB_TABLE}`);

    const getUsersUseCase = new GetUserUseCase(userRepository);

    return await getUsersUseCase.execute();
  } catch (error) {
    throw new Error(`Error fetching users: ${error}`);
  }
};
