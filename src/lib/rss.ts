import { XMLParser } from "fast-xml-parser";
import { getNextFeedToFetch, markFeedAsFetched } from "./db/queries/rss.js";
import { createPost } from "./db/queries/posts.js";
import { parseRSSDate } from "./datetime.js";
import { printAggregatorStart, printAggregatorSummary } from "./views.js";

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

export async function fetchFeed(feedUrl: string): Promise<ParsedRSSFeed["channel"]> {
  const res = await fetch(feedUrl, { headers: { "User-Agent": "gator" } });
  const text = await res.text();
  const parser = new XMLParser();
  const feed = parser.parse(text);
  if (!feed.rss.channel) {
    throw new Error("Invalid RSS feed");
  }
  return feed.rss.channel;
}



export async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch();
  if (!nextFeed) {
    console.log("No feeds to fetch");
    return;
  }

  await markFeedAsFetched(nextFeed.id);

  try {
    printAggregatorStart(nextFeed.name, nextFeed.url);
    
    const feedData = await fetchFeed(nextFeed.url);
    
    let savedCount = 0;
    let skippedCount = 0;
    
    const items = feedData.item 
      ? (Array.isArray(feedData.item) ? feedData.item : [feedData.item as ParsedRSSItem])
      : [];
    
    for (const item of items) {
      const publishedAt = parseRSSDate(item.pubDate);
      const post = await createPost({
        title: item.title,
        url: item.link,
        feedId: nextFeed.id,
        description: item.description,
        publishedAt
      });
      
      if (post) {
        savedCount++;
        console.log(`✓ Saved: ${item.title}`);
      } else {
        skippedCount++;
        console.log(`- Skipped (already exists): ${item.title}`);
      }
    }
    
    printAggregatorSummary(savedCount, skippedCount);
  } catch (error) {
    console.error(`Error fetching feed ${nextFeed.name}: ${(error as Error).message}`);
  }
}
