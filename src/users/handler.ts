import { AppSyncEvent } from "../@common/types/appsync-event";
import { DynamoDBUserRepository } from "./adapters/dynamodb/DynamoDBUserRepository";
import { GetUsersUseCase } from "./application/GetUsersUseCase";
import dynamoDBClient from "./infrastructure/config/DynamoDBClient";

const userRepository = new DynamoDBUserRepository(
  dynamoDBClient,
  `${process.env.DYNAMODB_TABLE}`,
);
const getUsersUseCase = new GetUsersUseCase(userRepository);

export const getUsers = async (event: AppSyncEvent) => {
  try {
    console.debug("event -> ", event);
    return await getUsersUseCase.execute();
  } catch (error) {
    throw new Error(`Error fetching users: ${error}`);
  }
};

export const addUser = async (event: any) => {
  const payload = event["arguments"]["input"];
  console.debug("payload -> ", payload["name"]);

  return {
    id: "123",
    name: "Fulano",
    email: "test@gmail.com",
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
