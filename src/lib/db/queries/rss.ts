import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { feeds } from "../schema.js";

export async function getFeed(feedUrl: string) {
  const feed = await db.select().from(feeds).where(eq(feeds.url, feedUrl));
  return feed;
}

export async function createFeed(name: string, url: string, userId: string) {
  const newFeeds = await db
    .insert(feeds)
    .values({
      name,
      url,
      user_id: userId,
    })
    .returning();
  return newFeeds[0];
}
