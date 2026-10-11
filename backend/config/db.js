import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Disable Mongoose command buffering so queries fail immediately if not connected,
// allowing our instant in-memory fallback to serve data with 0ms delay!
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  // If already connected, return existing connection immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If currently connecting, wait for the connection promise
  if (cached.promise) {
    try {
      const conn = await cached.promise;
      if (mongoose.connection.readyState === 1) {
        return conn;
      }
    } catch (e) {
      cached.promise = null;
    }
  }

  const customUri = process.env.MONGODB_URI;

  if (customUri) {
    console.log(`Connecting to MongoDB at: ${customUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}...`);
    
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 seconds fast timeout to prevent long buffering
      socketTimeoutMS: 15000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(customUri, options).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB Database successfully.');
      cached.conn = mongooseInstance;
      return mongooseInstance;
    }).catch(async (err) => {
      console.warn('⚠️ Custom MongoDB URI connection failed or timed out:', err.message);
      cached.promise = null;

      if (process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.VERCEL) {
        console.warn('⚡ Running in cloud environment (Render/Vercel). Resilient in-memory dataset is active.');
        return null;
      }

      try {
        console.log('Falling back to embedded in-memory MongoDB for local testing...');
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        return await mongoose.connect(uri);
      } catch (memErr) {
        console.warn('MongoMemoryServer could not start, serving via fallback dataset:', memErr.message);
        return null;
      }
    });
  } else {
    if (process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.VERCEL) {
      console.warn('ℹ️ MONGODB_URI not provided. Serving Telugu cinema via in-memory dataset.');
      return null;
    }
    try {
      console.log('Initializing embedded In-Memory MongoDB engine...');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      cached.promise = mongoose.connect(uri);
      console.log(`Connected to Embedded In-Memory MongoDB (${uri})`);
    } catch (memErr) {
      console.warn('MongoMemoryServer unavailable, serving via fallback dataset:', memErr.message);
      return null;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.warn('MongoDB connection deferred; serving requests via fallback dataset.');
  }

  return cached.conn;
};

export const disconnectDB = async () => {
  try {
    if (cached.conn) {
      await mongoose.connection.close();
      cached.conn = null;
      cached.promise = null;
    }
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err.message);
  }
};

