import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { users } from "../schema.js";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser({ id, name }: { id?: string; name?: string }) {
  if (!id && !name) {
    throw new Error("Either id or name must be provided");
  }
  const results = await db
    .select()
    .from(users)
    .where(id ? eq(users.id, id) : name ? eq(users.name, name) : undefined);
  return results[0];
}

export async function listUsers() {
  const results = await db.select().from(users);
  return results;
}

export async function deleteAllUsers() {
  await db.delete(users);
}
