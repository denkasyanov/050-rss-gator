import {
  CommandRegistry,
  registerCommand,
  runCommand,
} from "./commands/index.js";
import { handlerLogin } from "./commands/users.js";

function main() {
  const registry: CommandRegistry = {};
  registerCommand(registry, "login", handlerLogin);

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Usage: gator <command> [args...]");
    process.exit(1);
  }
  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  try {
    runCommand(registry, cmdName!, ...cmdArgs);
  } catch (error) {
    console.log((error as Error).message);
    process.exit(1);
  }
}

main();
