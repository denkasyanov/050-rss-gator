import { and, eq } from "drizzle-orm";
import { db } from "../index.js";
import { feedFollows, feeds, users } from "../schema.js";

export async function getFeed(feedUrl: string) {
  const feed = await db.select().from(feeds).where(eq(feeds.url, feedUrl));
  return feed;
}

export async function createFeed(name: string, url: string, userId: string) {
  const newFeeds = await db
    .insert(feeds)
    .values({ name, url, userId })
    .returning();
  return newFeeds[0];
}

export async function listFeeds(userId: string | undefined) {
  const results = await db
    .select()
    .from(feeds)
    .where(userId ? eq(feeds.userId, userId) : undefined);
  return results;
}

export async function listFeedFollows(userId: string) {
  const results = await db
    .select({
      feedFollow: feedFollows,
      feed: feeds,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));
  return results;
}
export async function createFeedFollow(feedId: string, userId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ feedId, userId })
    .returning();

  if (!newFeedFollow) {
    throw new Error("Failed to create feed follow");
  }

  const [feedFollow] = await db
    .select({
      feedFollow: feedFollows,
      feed: feeds,
      user: users,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));
  return feedFollow;
}

export async function deleteFeedFollow(feedId: string, userId: string) {
  // Get the feed and user data before deleting
  const [feedFollow] = await db
    .select({
      feedFollow: feedFollows,
      feed: feeds,
      user: users,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(and(eq(feedFollows.feedId, feedId), eq(feedFollows.userId, userId)));

  if (!feedFollow) {
    throw new Error("Feed follow not found");
  }

  // Now delete the feed follow
  await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.feedId, feedId), eq(feedFollows.userId, userId)));

  return feedFollow;
}
