import { setUser } from "../config.js";
import { createUser, getUser, listUsers } from "../lib/db/queries/users.js";
import { getCurrentUsername } from "../lib/users.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: gator ${cmdName} <username>`);
  }

  const username = args[0];
  if (!username) {
    throw new Error(`Usage: gator ${cmdName} <username>`);
  }

  const user = await getUser({ name: username });
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

  const existingUser = await getUser({ name: username });
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

export async function handlerUsers() {
  const users = await listUsers();
  // format:
  // * lane
  // * allan (current)
  // * hunter
  // * ...
  const currentUsername = getCurrentUsername();
  for (const user of users) {
    if (user.name === currentUsername) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
}
