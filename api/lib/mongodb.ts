import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'liri_blog';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // Return cached connection if available (warm serverless instance)
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI as string, {
    maxPoolSize: 10,
    // Reduced from 5000 — fail fast on bad connection rather than blocking for 5s
    serverSelectionTimeoutMS: 3000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 3000,
  });

  await client.connect();
  const db = client.db(DATABASE_NAME);

  // NOTE: Indexes are NOT created here to avoid adding 3 MongoDB round-trips
  // on every cold start. Ensure these indexes exist in Atlas once:
  //   blogs.createIndex({ slug: 1 }, { unique: true })
  //   blogs.createIndex({ isPublished: 1 })
  //   blogs.createIndex({ isPinned: 1 })
  //   blogs.createIndex({ publishedAt: -1 })

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
