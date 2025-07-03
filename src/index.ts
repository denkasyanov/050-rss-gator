import {
  CommandRegistry,
  middlewareLoggedIn,
  registerCommand,
  runCommand,
} from "./commands/index.js";
import { handlerReset } from "./commands/reset.js";
import {
  handlerAddFeed,
  handlerAgg,
  handlerBrowse,
  handlerFollowFeed,
  handlerFollowing,
  handlerListFeeds,
  handlerUnfollowFeed,
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
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", handlerListFeeds);
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollowFeed));
  registerCommand(
    registry,
    "unfollow",
    middlewareLoggedIn(handlerUnfollowFeed)
  );
  registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));

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
