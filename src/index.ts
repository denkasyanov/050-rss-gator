import {
  CommandRegistry,
  registerCommand,
  runCommand,
} from "./commands/index.js";
import { handlerReset } from "./commands/reset.js";
import {
  handlerAddFeed,
  handlerAgg,
  handlerFollowFeed,
  handlerFollowing,
  handlerListFeeds,
} from "./commands/rss.js";
import {
  handlerLogin,
  handlerRegister,
  handlerUsers,
} from "./commands/users.js";

async function main() {
  const registry: CommandRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "users", handlerUsers);

  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", handlerAddFeed);
  registerCommand(registry, "feeds", handlerListFeeds);
  registerCommand(registry, "follow", handlerFollowFeed);
  registerCommand(registry, "following", handlerFollowing);

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
