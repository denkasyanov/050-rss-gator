import { deleteAllUsers } from "../lib/db/queries/users.js";

export async function handlerReset() {
  await deleteAllUsers();
  console.log("All users deleted");
}
