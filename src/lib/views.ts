import { Feed, Post, User } from "./db/schema.js";

function getTerminalWidth(): number {
  return process.stdout.columns || 80;
}

function getSeparator(char: string = "-"): string {
  return char.repeat(getTerminalWidth());
}

const MAJOR_SEPARATOR = getSeparator("=");
const MINOR_SEPARATOR = getSeparator("-");

export function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
  console.log(`\n${MINOR_SEPARATOR}\n`);
}

export function printPost(post: Post & { feedName: string }) {
  console.log(`\n${MINOR_SEPARATOR}`);
  console.log(`Title:       ${post.title}`);
  console.log(`Feed:        ${post.feedName}`);
  console.log(`Published:   ${post.publishedAt ? post.publishedAt.toLocaleString() : 'Unknown'}`);
  console.log(`URL:         ${post.url}`);
  
  if (post.description) {
    const maxLength = 200;
    const description = post.description.length > maxLength 
      ? post.description.substring(0, maxLength) + "..." 
      : post.description;
    console.log(`Description: ${description}`);
  }
}

export function printPostList(posts: (Post & { feedName: string })[], userName: string) {
  if (posts.length === 0) {
    console.log("No posts found. Make sure you're following some feeds and they have been fetched.");
    return;
  }

  console.log(`\n${MAJOR_SEPARATOR}`);
  console.log(`\nShowing ${posts.length} most recent posts for ${userName}:`);
  
  for (const post of posts) {
    printPost(post);
  }
  console.log(`\n${MAJOR_SEPARATOR}\n`);
}

export function printAggregatorStart(feedName: string, feedUrl: string) {
  console.log(`\n${MAJOR_SEPARATOR}`);
  console.log(`\nFetching feed: ${feedName}`);
  console.log(`URL: ${feedUrl}\n`);
  console.log(MAJOR_SEPARATOR);
}

export function printAggregatorSummary(savedCount: number, skippedCount: number) {
  console.log(`\nSummary: ${savedCount} new posts saved, ${skippedCount} already existed\n`);
  console.log(`${MAJOR_SEPARATOR}\n`);
}