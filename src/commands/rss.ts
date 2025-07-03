import { createFeed, getFeed, listFeeds } from "../lib/db/queries/rss.js";
import { getUser } from "../lib/db/queries/users.js";
import { fetchFeed, printFeed } from "../lib/rss.js";
import { requireUser } from "../lib/users.js";

export async function handlerAgg() {
  const feedUrl = "https://www.wagslane.dev/index.xml";

  const feed = await fetchFeed(feedUrl);
  console.log(feed);
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  const user = await requireUser();

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
  printFeed(feed, user);
}

export async function handlerListFeeds() {
  // const user = await requireUser();
  const feeds = await listFeeds(undefined);
  for (const feed of feeds) {
    console.log(feed.name);
    console.log(feed.url);

    const user = await getUser({ id: feed.userId });
    console.log(user!.name);
    console.log("--------------------------------");
  }
}
