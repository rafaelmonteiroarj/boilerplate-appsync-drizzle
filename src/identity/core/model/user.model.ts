import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import {
  DefaultModel,
  WithOptional,
} from "../../../shared/core/model/default.model";

export class UserModel extends DefaultModel {
  name!: string;
  email!: string;
  isActive: boolean = false;
  avatar?: string;
  password!: string;
  isAdmin: boolean = false;

  private constructor(data: UserModel) {
    super();
    Object.assign(this, data);
  }

  static create(
    data: WithOptional<UserModel, "id" | "createdAt" | "updatedAt">,
  ): UserModel {
    return new UserModel({
      ...data,
      id: data.id ? data.id : uuidv4(),
      createdAt: data.createdAt ? data.createdAt : new Date(),
      updatedAt: data.updatedAt ? data.updatedAt : new Date(),
    });
  }

  static createFrom(data: UserModel): UserModel {
    return new UserModel({
      ...data,
    });
  }

  static encryptPassword(password: string, secret: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const key = crypto.createHash("sha256").update(secret).digest();
      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

      let encrypted = cipher.update(password, "utf8", "hex");
      encrypted += cipher.final("hex");

      return `${iv.toString("hex")}:${encrypted}`;
    } catch (error) {
      console.error("Erro na criptografia:", error);
      throw new Error("Falha ao criptografar senha");
    }
  }

  static decryptPassword(encryptedData: string, secret: string): string {
    try {
      if (!encryptedData || !encryptedData.includes(":")) {
        throw new Error("Formato inválido de dados criptografados");
      }

      const [ivHex, encryptedHex] = encryptedData.split(":");

      if (
        !/^[0-9a-fA-F]+$/.test(ivHex) ||
        !/^[0-9a-fA-F]+$/.test(encryptedHex)
      ) {
        throw new Error("Formato hexadecimal inválido");
      }

      const iv = Buffer.from(ivHex, "hex");
      if (iv.length !== 16) {
        console.error("Tamanho do IV inválido:", iv.length);
        throw new Error("Tamanho do IV inválido");
      }

      const key = crypto.createHash("sha256").update(secret).digest();
      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      let decrypted = decipher.update(encryptedHex, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }
}
