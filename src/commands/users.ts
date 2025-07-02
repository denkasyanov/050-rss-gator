import { setUser } from "../config.js";

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: gator ${cmdName} <username>`);
  }

  const username = args[0];
  if (!username) {
    throw new Error(`Usage: gator ${cmdName} <username>`);
  }

  setUser(username);
  console.log(`Logged in as ${username}`);
}
