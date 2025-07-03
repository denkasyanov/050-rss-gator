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
import { scrapeFeeds } from "../lib/rss.js";
import { formatDuration, parseDuration } from "../lib/datetime.js";
import { getPostsForUser } from "../lib/db/queries/posts.js";
import { printFeed, printPostList } from "../lib/views.js";

export async function handlerAgg(_cmdName: string, ...args: string[]) {
  const timeBetweenReqsStr = args[0];

  if (!timeBetweenReqsStr) {
    throw new Error("Usage: pnpm start agg <time_between_reqs>");
  }

  const timeBetweenRequests = parseDuration(timeBetweenReqsStr);
  if (!timeBetweenRequests) {
    throw new Error("Invalid time between requests");
  }

  const timeString = formatDuration(timeBetweenRequests);

  console.log(`Collecting feeds every ${timeString}`);

  const handleError = (error: unknown) => {
    console.error("Error in scrapeFeeds:", error);
  };

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const feedName = args[0];
  const feedUrl = args[1];

  if (!feedName || !feedUrl) {
    throw new Error(`Usage: pnpm start ${cmdName} <feed-name> <feed-url>`);
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
    throw new Error(`Usage: pnpm start ${cmdName} <feed-url>`);
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
    throw new Error(`Usage: pnpm start ${cmdName} <feed-url>`);
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

export async function handlerBrowse(
  _cmdName: string,
  user: User,
  ...args: string[]
) {
  const limitStr = args[0];
  const limit = limitStr ? parseInt(limitStr, 10) : 2;
  
  if (isNaN(limit) || limit < 1) {
    throw new Error("Limit must be a positive number");
  }

  const posts = await getPostsForUser(user.id, limit);
  printPostList(posts, user.name);
}
