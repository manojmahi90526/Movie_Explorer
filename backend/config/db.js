import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // If already connected, return existing connection immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const customUri = process.env.MONGODB_URI;

    if (customUri) {
      console.log(`Connecting to MongoDB at: ${customUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}...`);
      
      const options = {
        serverSelectionTimeoutMS: 15000, // 15 seconds to give cloud database (Atlas) time during cold starts
        socketTimeoutMS: 45000,
      };

      cached.promise = mongoose.connect(customUri, options).then((mongooseInstance) => {
        console.log('Connected to MongoDB Database successfully.');
        cached.conn = mongooseInstance;
        return mongooseInstance;
      }).catch(async (err) => {
        console.warn('Custom MongoDB URI connection failed or timed out:', err.message);
        cached.promise = null; // Reset so subsequent requests can attempt connection

        if (process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.VERCEL) {
          console.error('Cannot fallback to MongoMemoryServer in production. Exiting.');
          throw err;
        }

        console.log('Falling back to embedded in-memory MongoDB for local testing...');
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        return mongoose.connect(uri);
      });
    } else {
      if (process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.VERCEL) {
        console.error('MONGODB_URI is not set in environment variables.');
        throw new Error('MONGODB_URI is not set in production environment variables');
      }
      console.log('Initializing embedded In-Memory MongoDB engine...');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      cached.promise = mongoose.connect(uri);
      console.log(`Connected to Embedded In-Memory MongoDB (${uri})`);
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
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
