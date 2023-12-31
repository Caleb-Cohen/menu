import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI as string, opts).then(mongoose => {
      return mongoose;
    }).catch(err => {
      cached.promise = null;
      throw new Error('MongoDB Connection Error');
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.log('MongoDB Connection Error: ', e);
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

export default dbConnect;
