import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

import { IUserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user.entity";
import { UserDto } from "../../application/dtos/user.dto";
import { userMapper } from "../adapter/output/user.mapper";
import { Session } from "../../domain/entities/session.entity";
import { ValidationRequestError } from "../../../@common/errors/ValidationRequestError";

const CryptoJS = require("crypto-js");
const { sign } = require("jsonwebtoken");

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
        password: {
          S: CryptoJS.AES.encrypt(
            user.password,
            process.env.JWT_SECRET,
          ).toString(),
        },
        createdAt: { S: new Date().toISOString() },
        updatedAt: { S: new Date().toISOString() },
      },
    });

    await this.dynamoDBClient.send(putCommand);

    const userCreated = await this.getByEmail(user.email);
    delete userCreated?.password;

    if (!userCreated) throw new Error("User not created.");

    return userCreated;
  }

  async login(email: string, password: string): Promise<Session> {
    const user = await this.getByEmail(email);

    if (user) {
      const bytes = CryptoJS.AES.decrypt(user.password, process.env.JWT_SECRET);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);

      if (originalText === password) {
        const token = sign(user, process.env.JWT_SECRET, { expiresIn: "30m" });

        if (user.active === false) {
          throw new ValidationRequestError(
            "Usuário inativo. Entre em contato com o Administrador.",
          );
        }

        return { token, user };
      } else {
        throw new ValidationRequestError("Usuário ou senha inválidos.");
      }
    } else {
      throw new ValidationRequestError("Usuário ou senha não encontrado.");
    }
  }
}
