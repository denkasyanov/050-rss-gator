type CommandHandler = (cmdName: string, ...args: string[]) => void;

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

export function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Command ${cmdName} not found`);
  }
  handler(cmdName, ...args);
}
