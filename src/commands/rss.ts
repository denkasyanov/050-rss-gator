import { fetchFeed } from "../lib/rss.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  const feedUrl = "https://www.wagslane.dev/index.xml";

  const feed = await fetchFeed(feedUrl);
  console.log(feed);
}
