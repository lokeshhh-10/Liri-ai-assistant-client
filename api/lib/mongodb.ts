import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'liri_blog';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI as string, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  await client.connect();
  const db = client.db(DATABASE_NAME);

  // Ensure indexes exist
  const blogs = db.collection('blogs');
  await blogs.createIndex({ slug: 1 }, { unique: true });
  await blogs.createIndex({ isPublished: 1 });
  await blogs.createIndex({ publishedAt: -1 });

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
