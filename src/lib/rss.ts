import { XMLParser } from "fast-xml-parser";
import { Feed, User } from "./db/schema.js";

type ParsedRSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: ParsedRSSItem[];
  };
};

type ParsedRSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

// Example RSS feed:
// <rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
// <channel>
//   <title>RSS Feed Example</title>
//   <link>https://www.example.com</link>
//   <description>This is an example RSS feed</description>
//   <item>
//     <title>First Article</title>
//     <link>https://www.example.com/article1</link>
//     <description>This is the content of the first article.</description>
//     <pubDate>Mon, 06 Sep 2021 12:00:00 GMT</pubDate>
//   </item>
//   <item>
//     <title>Second Article</title>
//     <link>https://www.example.com/article2</link>
//     <description>Here's the content of the second article.</description>
//     <pubDate>Tue, 07 Sep 2021 14:30:00 GMT</pubDate>
//   </item>
// </channel>
// </rss>

export async function fetchFeed(feedUrl: string): Promise<ParsedRSSFeed> {
  const res = await fetch(feedUrl, { headers: { "User-Agent": "gator" } });
  const text = await res.text();
  const parser = new XMLParser();
  const feed = parser.parse(text);
  if (!feed.rss.channel) {
    throw new Error("Invalid RSS feed");
  }
  return feed.rss.channel;
}

export function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}
