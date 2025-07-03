import { getCurrentUsername } from "../config.js";
import { createFeed, getFeed } from "../lib/db/queries/rss.js";
import { getUser } from "../lib/db/queries/users.js";
import { fetchFeed } from "../lib/rss.js";

export async function handlerAgg() {
  const feedUrl = "https://www.wagslane.dev/index.xml";

  const feed = await fetchFeed(feedUrl);
  console.log(feed);
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  const currentUsername = getCurrentUsername();
  if (!currentUsername) {
    throw new Error("You must be logged in to add a feed");
  }

  const user = await getUser(currentUsername);
  if (!user) {
    throw new Error("User not found");
  }

  const feedName = args[0];
  const feedUrl = args[1];

  if (!feedName || !feedUrl) {
    throw new Error(`Usage: gator ${cmdName} <feed-name> <feed-url>`);
  }

  const existingFeed = await getFeed(feedUrl);
  if (existingFeed.length > 0) {
    throw new Error("Feed already exists");
  }

  const feed = await createFeed(feedName, feedUrl, user.id);
  if (!feed) {
    throw new Error("Failed to add feed");
  }
  console.log(`Feed ${feed.name} added`);
}
