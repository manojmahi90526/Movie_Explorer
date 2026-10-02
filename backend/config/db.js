import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

export const connectDB = async () => {
  try {
    const customUri = process.env.MONGODB_URI;
    
    if (customUri) {
      try {
        console.log(`Connecting to MongoDB at: ${customUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}...`);
        await mongoose.connect(customUri, {
          serverSelectionTimeoutMS: 3000,
        });
        console.log('✅ Connected to MongoDB Database successfully.');
        return;
      } catch (err) {
        console.warn('⚠️ Custom MongoDB URI connection failed or timed out:', err.message);
        console.log('🔄 Falling back to embedded in-memory MongoDB for instant execution...');
      }
    }

    // Fallback or default in-memory database
    console.log('🚀 Initializing embedded In-Memory MongoDB engine...');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`✅ Connected to Embedded In-Memory MongoDB (${uri})`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err.message);
  }
};
