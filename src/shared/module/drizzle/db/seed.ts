import { getDrizzleInstance } from ".";
import { usersTable } from "./schema";

async function seed() {
  const drizzle = getDrizzleInstance();

  const [userAdmin] = await drizzle
    .insert(usersTable)
    .values({
      name: "Rafael Arjonas",
      email: "rafael.arjonas@claro.com.br",
      password: "F@zer250",
      isActive: true,
      isAdmin: true,
    })
    .returning();

  const [userMember] = await drizzle
    .insert(usersTable)
    .values({
      name: "Rafael Arjonas",
      email: "rafaelmonteiroarj@gmail.com",
      password: "F@zer250",
      isActive: true,
      isAdmin: false,
    })
    .returning();

  console.debug("Users seeded:", { userAdmin, userMember });
  console.debug("Seeding completed successfully!");
}

seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
