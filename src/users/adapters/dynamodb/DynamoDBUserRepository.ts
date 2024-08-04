import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/models/User";

export class DynamoDBUserRepository implements UserRepository {
  private dynamoDBClient: DynamoDBClient;
  private tableName: string;

  constructor(dynamoDBClient: DynamoDBClient, tableName: string) {
    this.dynamoDBClient = dynamoDBClient;
    this.tableName = tableName;
  }

  async getUsers(): Promise<User[]> {
    const command = new ScanCommand({ TableName: this.tableName });
    const response = await this.dynamoDBClient.send(command);
    return (
      response.Items?.map((item) => ({
        id: item.id.S!,
        name: item.name.S!,
        email: item.email.S!,
        status: item.status.BOOL!,
        createdAt: new Date(item.createdAt.S!),
        updatedAt: new Date(item.updatedAt.S!),
      })) || []
    );
  }
}
