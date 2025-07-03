import { User } from "../lib/db/schema.js";
import { requireUser } from "../lib/users.js";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export function middlewareLoggedIn(
  handler: UserCommandHandler
): CommandHandler {
  return async (cmdName, ...args) => {
    const user = await requireUser();
    await handler(cmdName, user, ...args);
  };
}

export type CommandRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  if (registry[cmdName]) {
    throw new Error(`Command ${cmdName} already registered`);
  }
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Command ${cmdName} not found`);
  }
  await handler(cmdName, ...args);
}
