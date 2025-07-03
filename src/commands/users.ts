import { setUser } from "../config.js";
import { createUser, getUser } from "../lib/db/queries/users.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: gator ${cmdName} <username>`);
  }

  const username = args[0];
  if (!username) {
    throw new Error(`Usage: gator ${cmdName} <username>`);
  }

  const user = await getUser(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }

  setUser(username);
  console.log(`Logged in as ${user.name}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: gator ${cmdName} <username>`);
  }

  const username = args[0];
  if (!username) {
    throw new Error(`Usage: gator ${cmdName} <username>`);
  }

  const existingUser = await getUser(username);
  if (existingUser) {
    throw new Error(`User ${username} already exists`);
  }

  const user = await createUser(username);
  if (!user) {
    throw new Error(`Failed to create user ${username}`);
  }

  console.log(`User ${user.name} created`);

  setUser(username);
}
