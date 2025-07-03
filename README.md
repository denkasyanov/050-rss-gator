# RSS Gator

A command-line RSS feed aggregator that allows you to follow, fetch, and read RSS feeds directly from your terminal.

## Features

- **Multi-user Support**: Create and manage multiple user accounts
- **Feed Management**: Add, follow, and unfollow RSS feeds
- **Automatic Fetching**: Continuously fetch new posts at specified intervals
- **Post Storage**: Stores posts in PostgreSQL database to avoid duplicates
- **Clean CLI Interface**: Browse posts with formatted output and full-width separators
- **Efficient Database Design**: Normalized schema with proper relationships
- **Type-safe Implementation**: Full TypeScript with Drizzle ORM

## Requirements

- Node.js 18+ (LTS recommended)
- PostgreSQL database
- pnpm (recommended) or npm

## Installation

### Using pnpm (Recommended)

```bash
# Clone the repository
git clone https://github.com/denkasyanov/050-rss-gator.git
cd 050-rss-gator

# Install dependencies
pnpm install

# Set up database configuration
# Create ~/.gatorconfig.json with your database URL:
echo '{
  "db_url": "postgresql://username:password@localhost:5432/rss_gator"
}' > ~/.gatorconfig.json

# Run database migrations
pnpm run db:migrate
```

### Using npm

```bash
# Clone the repository
git clone https://github.com/denkasyanov/050-rss-gator.git
cd 050-rss-gator

# Install dependencies
npm install

# Set up database configuration
# Create ~/.gatorconfig.json with your database URL:
echo '{
  "db_url": "postgresql://username:password@localhost:5432/rss_gator"
}' > ~/.gatorconfig.json

# Run database migrations
npm run db:migrate
```

## Usage

### User Management

```bash
# Create a new user account
pnpm start register <username>

# Login as a user (sets current user for subsequent commands)
pnpm start login <username>

# List all registered users
pnpm start users
```

### Feed Management

```bash
# Add a new feed to the system and follow it
pnpm start addfeed "Hacker News" "https://hnrss.org/newest"

# List all available feeds
pnpm start feeds

# Follow an existing feed
pnpm start follow <feed-url>

# List feeds you're following
pnpm start following

# Unfollow a feed
pnpm start unfollow <feed-url>
```

### Fetching and Reading Posts

```bash
# Start the aggregator (fetches posts continuously)
# Intervals: 1s, 30s, 5m, 1h
pnpm start agg 30s

# Browse posts from your followed feeds
pnpm start browse [limit]     # Default limit: 2
```

### Example Session

```bash
$ pnpm start register alice
User registered successfully:
* ID:            550e8400-e29b-41d4-a716-446655440000
* Created:       Thu Jan 03 2025 14:30:00 GMT-0800
* Updated:       Thu Jan 03 2025 14:30:00 GMT-0800
* name:          alice

--------------------------------------------------------------------------------

$ pnpm start login alice
Current user: alice

$ pnpm start addfeed "TechCrunch" "https://techcrunch.com/feed/"
* ID:            660e8400-e29b-41d4-a716-446655440001
* Created:       Thu Jan 03 2025 14:31:00 GMT-0800
* Updated:       Thu Jan 03 2025 14:31:00 GMT-0800
* name:          TechCrunch
* URL:           https://techcrunch.com/feed/
* User:          alice

--------------------------------------------------------------------------------

$ pnpm start browse 3

================================================================================

Showing 3 most recent posts for alice:

--------------------------------------------------------------------------------
Title:       Apple releases iOS 18.1 with AI features
Feed:        TechCrunch
Published:   1/3/2025, 2:00:00 PM
URL:         https://techcrunch.com/2025/01/03/apple-ios-18-1/
Description: Apple has released iOS 18.1, bringing the first wave of Apple Intelligence features to compatible iPhones...

--------------------------------------------------------------------------------
Title:       OpenAI announces GPT-5 preview program
Feed:        TechCrunch  
Published:   1/3/2025, 1:30:00 PM
URL:         https://techcrunch.com/2025/01/03/openai-gpt-5-preview/
Description: OpenAI has opened applications for early access to GPT-5, promising significant improvements in reasoning...

--------------------------------------------------------------------------------
Title:       Meta launches new VR headset at $299
Feed:        TechCrunch
Published:   1/3/2025, 12:45:00 PM
URL:         https://techcrunch.com/2025/01/03/meta-vr-headset-quest-3s/
Description: Meta has announced a new budget-friendly VR headset, the Quest 3S, aimed at making virtual reality more...

================================================================================
```

## Development

### Database Management

```bash
# Generate new migrations
pnpm run db:generate

# Apply migrations
pnpm run db:migrate

# Open Drizzle Studio (database GUI)
pnpm run db:studio
```

### Database Schema

- **users**: User accounts with unique usernames
- **feeds**: RSS feed sources with URLs
- **feed_follows**: Many-to-many relationship between users and feeds
- **posts**: Individual posts from feeds with deduplication by URL

## Scripts

- `pnpm start <command>` - Run CLI commands
- `pnpm run db:generate` - Generate database migrations
- `pnpm run db:migrate` - Apply database migrations
- `pnpm run db:studio` - Open database GUI
