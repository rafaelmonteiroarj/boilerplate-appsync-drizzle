import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserDto } from "../../application/dtos/UserDto";
import { userMapper } from "../adapter/output/UserMapper";

export class DynamoRepository implements IUserRepository {
  private dynamoDBClient: DynamoDBClient;
  private tableName: string;

  constructor(tableName: string) {
    this.dynamoDBClient = new DynamoDBClient({ region: "us-east-1" });
    this.tableName = tableName;
  }

  async list(): Promise<User[]> {
    const command = new ScanCommand({ TableName: this.tableName });
    const response = await this.dynamoDBClient.send(command);
    return response.Items?.map(userMapper) || [];
  }

  async getByEmail(email: string): Promise<User | null> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
    });

    const response = await this.dynamoDBClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      return null;
    }

    const item = response.Items[0];
    return userMapper(item);
  }

  async create(user: UserDto): Promise<User> {
    const id = uuidv4();

    const putCommand = new PutItemCommand({
      TableName: this.tableName,
      Item: {
        id: { S: id },
        name: { S: user.name },
        email: { S: user.email },
        active: { BOOL: false },
        isAdmin: { BOOL: false },
        createdAt: { S: new Date().toISOString() },
        updatedAt: { S: new Date().toISOString() },
      },
    });

    await this.dynamoDBClient.send(putCommand);

    const userCreated = await this.getByEmail(user.email);

    if (!userCreated) {
      throw new Error("User not created.");
    }

    return userCreated;
  }
}
