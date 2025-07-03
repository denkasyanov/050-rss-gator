import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
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

export async function fetchFeed(feedUrl: string): Promise<RSSFeed> {
  const res = await fetch(feedUrl, { headers: { "User-Agent": "gator" } });
  const text = await res.text();
  const parser = new XMLParser();
  const feed = parser.parse(text);
  console.log({ feed });
  if (!feed.rss.channel) {
    throw new Error("Invalid RSS feed");
  }
  return feed.rss.channel;
}
