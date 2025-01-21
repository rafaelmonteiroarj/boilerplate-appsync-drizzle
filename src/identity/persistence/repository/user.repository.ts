import { eq, InferSelectModel } from "drizzle-orm";
import { getDrizzleInstance } from "../../../shared/module/drizzle/db";
import { usersTable } from "../../../shared/module/drizzle/db/schema";
import { DrizzleDefaultRepository } from "../../../shared/module/drizzle/repository/drizzle.repository";
import { UserModel } from "../../core/model/user.model";
import { CreateUserDTO } from "../../http/handlers/dtos/create-user.dto";

export class UserRepository extends DrizzleDefaultRepository<
  UserModel,
  typeof usersTable
> {
  constructor() {
    super(getDrizzleInstance(), usersTable);
  }

  async create(model: CreateUserDTO): Promise<UserModel | null> {
    try {
      const result = await this.db
        .insert(this.table)
        .values({
          name: model.name,
          email: model.email,
          password: UserModel.encryptPassword(
            model.password,
            process.env.JWT_SECRET!,
          ),
        })
        .returning();

      if (!result || result.length === 0) {
        throw new Error("Não foi possível cadastrar o usuário.");
      }

      return this.mapToModel(result[0]);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  async getByEmail(email: string): Promise<UserModel | null> {
    try {
      const result = await this.db
        .select()
        .from(this.table)
        .where(eq(usersTable.email, email))
        .execute();

      if (!result || result.length === 0) {
        return null;
      }

      return this.mapToModel(result[0]);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  protected mapToModel(data: InferSelectModel<typeof usersTable>): UserModel {
    return UserModel.createFrom({
      ...data,
      avatar: data.avatar ?? "",
    });
  }
}
