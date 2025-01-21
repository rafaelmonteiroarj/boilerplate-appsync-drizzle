import { eq, InferSelectModel } from "drizzle-orm";
import { NeonDatabase } from "drizzle-orm/neon-serverless";
import { AnyPgColumn, AnyPgTable } from "drizzle-orm/pg-core";
import { DefaultModel } from "../../../core/model/default.model";

export abstract class DrizzleDefaultRepository<
  M extends DefaultModel,
  T extends AnyPgTable & { id: AnyPgColumn },
> {
  constructor(
    protected readonly db: NeonDatabase,
    protected readonly table: T,
  ) {}

  /**
   * Create a new record in the database.
   * @param model - The model data to insert into the database.
   * @returns Promise with the created model or null
   */
  async create(model: M): Promise<M | null> {
    try {
      const result = await this.db
        .insert(this.table)
        .values(model as any)
        .returning()
        .execute();

      if (!Array.isArray(result) || result.length === 0) {
        throw new Error("Nenhum dado retornado após a inserção");
      }

      return this.mapToModel(result[0]);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Find all records in the database with pagination.
   * @param page - The page number (starting from 1).
   * @param limit - The number of records per page.
   * @returns An array of models mapped from the database rows.
   */
  async findAll(page: number = 1, limit: number = 10): Promise<M[]> {
    try {
      const offset = (page - 1) * limit;

      const data = await this.db
        .select()
        .from(this.table)
        .limit(limit)
        .offset(offset)
        .execute();

      return data.map((row) => this.mapToModel(row));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Find a record by its ID.
   * @param id - The ID of the record to find.
   * @returns The found record or null if not found.
   */
  async findById(id: string): Promise<M | null> {
    try {
      const data = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.id, id))
        .execute();
      return data.length > 0 ? this.mapToModel(data[0]) : null;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Maps the database row to the model instance.
   * @param data - The raw database row data.
   * @returns The mapped model instance.
   */
  protected abstract mapToModel(data: InferSelectModel<T>): M;
}
