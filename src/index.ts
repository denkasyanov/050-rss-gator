import {
  CommandRegistry,
  registerCommand,
  runCommand,
} from "./commands/index.js";
import { handlerReset } from "./commands/reset.js";
import { handlerLogin, handlerRegister } from "./commands/users.js";

async function main() {
  const registry: CommandRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);

  registerCommand(registry, "reset", handlerReset);

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Usage: gator <command> [args...]");
    process.exit(1);
  }
  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  try {
    await runCommand(registry, cmdName!, ...cmdArgs);
  } catch (error) {
    console.log((error as Error).message);
    process.exit(1);
  }
  process.exit(0);
}

main();
