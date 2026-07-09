/**
 * One-time script to create MongoDB indexes for the blogs collection.
 * Run this once: node --env-file=.env scripts/setup-indexes.mjs
 *
 * These indexes were removed from the connectToDatabase() hot path
 * to eliminate 3 unnecessary MongoDB round-trips on every cold start.
 */

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || 'liri_blog';

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not set.');
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);

try {
  await client.connect();
  console.log('✓ Connected to MongoDB');

  const db = client.db(DATABASE_NAME);
  const blogs = db.collection('blogs');

  await blogs.createIndex({ slug: 1 }, { unique: true });
  console.log('✓ Index created: slug (unique)');

  await blogs.createIndex({ isPublished: 1 });
  console.log('✓ Index created: isPublished');

  await blogs.createIndex({ isPinned: 1 });
  console.log('✓ Index created: isPinned');

  await blogs.createIndex({ publishedAt: -1 });
  console.log('✓ Index created: publishedAt (descending)');

  console.log('\n✅ All indexes ensured. You can deploy now.');
} catch (err) {
  console.error('Failed to create indexes:', err);
  process.exit(1);
} finally {
  await client.close();
}
