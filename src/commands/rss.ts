import {
  createFeed,
  createFeedFollow,
  deleteFeedFollow,
  getFeed,
  listFeedFollows,
  listFeeds,
} from "../lib/db/queries/rss.js";
import { getUser } from "../lib/db/queries/users.js";
import { User } from "../lib/db/schema.js";
import { fetchFeed, printFeed } from "../lib/rss.js";

export async function handlerAgg() {
  const feedUrl = "https://www.wagslane.dev/index.xml";

  const feed = await fetchFeed(feedUrl);
  console.log(feed);
}

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
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

  const feedFollow = await createFeedFollow(feed.id, user.id);
  if (!feedFollow) {
    throw new Error("Failed to follow feed");
  }

  printFeed(feedFollow.feed, user);
}

export async function handlerListFeeds() {
  // const user = await requireUser();
  const feeds = await listFeeds(undefined);
  for (const feed of feeds) {
    const user = await getUser({ id: feed.userId });
    printFeed(feed, user!);
  }
}

export async function handlerFollowing(_cmdName: string, user: User) {
  const feedFollows = await listFeedFollows(user.id);
  if (feedFollows.length === 0) {
    console.log(`No feed follows for ${user.name}`);
    return;
  }

  for (const feedFollow of feedFollows) {
    printFeed(feedFollow.feed, user);
  }
}

export async function handlerFollowFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const feedUrl = args[0];

  if (!feedUrl) {
    throw new Error(`Usage: gator ${cmdName} <feed-url>`);
  }

  const feed = await getFeed(feedUrl);
  if (feed.length === 0 || !feed[0]) {
    throw new Error("Feed not found");
  }

  const feedFollow = await createFeedFollow(feed[0].id, user.id);
  if (!feedFollow) {
    throw new Error("Failed to follow feed");
  }

  printFeed(feedFollow.feed, user);
}

export async function handlerUnfollowFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const feedUrl = args[0];

  if (!feedUrl) {
    throw new Error(`Usage: gator ${cmdName} <feed-url>`);
  }

  const feed = await getFeed(feedUrl);
  if (feed.length === 0 || !feed[0]) {
    throw new Error("Feed not found");
  }

  const feedFollow = await deleteFeedFollow(feed[0].id, user.id);
  if (!feedFollow) {
    throw new Error("Failed to unfollow feed");
  }

  printFeed(feedFollow.feed, feedFollow.user);
}
