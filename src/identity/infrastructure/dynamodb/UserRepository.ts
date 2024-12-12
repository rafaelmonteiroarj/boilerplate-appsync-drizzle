import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

import { IUserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user.entity";
import { UserDto } from "../../application/dtos/user.dto";
import { userMapper } from "../adapter/output/user.mapper";
import { Session } from "../../domain/entities/session.entity";
import { ValidationRequestError } from "../../../@common/errors/ValidationRequestError";
import { marshall } from "@aws-sdk/util-dynamodb";

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
        questionlimitQuota: { N: "20" },
        isAdmin: { BOOL: false },
        password: {
          S: CryptoJS.AES.encrypt(
            user.password,
            process.env.JWT_SECRET,
          ).toString(),
        },
        createdAt: { S: new Date().toISOString() },
        updatedAt: { S: new Date().toISOString() },
        origin: { S: user.origin },
        grantAccessGenia: { S: JSON.stringify(user.grantAccessGenia) },
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

    if (!user) {
      throw new ValidationRequestError("Usuário ou senha não encontrado.");
    }

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.JWT_SECRET);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (originalText !== password) {
      throw new ValidationRequestError("Usuário ou senha inválidos.");
    }

    if (!user.active) {
      throw new ValidationRequestError(
        "Usuário inativo. Entre em contato com o Administrador.",
      );
    }

    const token = sign(user, process.env.JWT_SECRET, { expiresIn: "30m" });

    return { token, user };
  }

  async updateActive(
    userEmailToUpdate: string,
    isActive: boolean,
  ): Promise<User> {
    const user = await this.getByEmail(userEmailToUpdate);

    if (!user) {
      throw new ValidationRequestError("Email nulo ou não existente.");
    }

    if (user.active === true && isActive === true) {
      throw new ValidationRequestError(`O user ${user.email} já está ativo`);
    }

    const updateCommand = new UpdateItemCommand({
      TableName: this.tableName,
      Key: marshall({
        id: user.id,
      }),
      UpdateExpression: "set active = :active",
      ExpressionAttributeValues: marshall({
        ":active": isActive,
      }),
      ReturnValues: "UPDATED_NEW",
    });

    await this.dynamoDBClient.send(updateCommand);

    const userUpdated = await this.getByEmail(user.email);
    delete userUpdated?.password;

    if (!userUpdated) throw new Error("User not updated.");

    return userUpdated;
  }

  async updateQuota(
    userEmailToUpdate: string,
    questionlimitQuota: number,
  ): Promise<User> {
    const user = await this.getByEmail(userEmailToUpdate);

    if (!user) {
      throw new ValidationRequestError("Email nulo ou não existente.");
    }

    if (user.questionlimitQuota === questionlimitQuota) {
      throw new ValidationRequestError(
        `O user ${user.email} já possui essa cota.`,
      );
    }

    const updateCommand = new UpdateItemCommand({
      TableName: this.tableName,
      Key: marshall({
        id: user.id,
      }),
      UpdateExpression: "set questionlimitQuota = :questionlimitQuota",
      ExpressionAttributeValues: marshall({
        ":questionlimitQuota": questionlimitQuota,
      }),
      ReturnValues: "UPDATED_NEW",
    });

    await this.dynamoDBClient.send(updateCommand);

    const userUpdated = await this.getByEmail(user.email);
    delete userUpdated?.password;

    if (!userUpdated) throw new Error("User not updated.");

    return userUpdated;
  }
}
