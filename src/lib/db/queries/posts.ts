import { desc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { feedFollows, feeds, posts, Post } from "../schema.js";

interface CreatePostInput {
  title: string;
  url: string;
  feedId: string;
  description?: string | null;
  publishedAt?: Date | null;
}

export async function createPost(input: CreatePostInput): Promise<Post | null> {
  try {
    const [post] = await db
      .insert(posts)
      .values(input)
      .returning();
    return post || null;
  } catch (error: any) {
    // Handle unique constraint violation (duplicate URL)
    if (error.code === "23505") {
      return null;
    }
    throw error;
  }
}

export async function getPostsForUser(
  userId: string,
  limit: number = 10
): Promise<(Post & { feedName: string })[]> {
  const result = await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feeds.id, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

  return result;
}