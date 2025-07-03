import { readConfig } from "../config.js";
import { getUser } from "./db/queries/users.js";

export function getCurrentUsername() {
  const config = readConfig();
  return config.currentUserName;
}

export async function requireUser() {
  const username = getCurrentUsername();
  if (!username) {
    throw new Error("You must be logged in to get the current user");
  }
  const user = await getUser(username);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
