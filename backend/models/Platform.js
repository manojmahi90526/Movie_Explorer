import mongoose from 'mongoose';

const platformSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Platform name is required'],
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Streaming Service', 'Critic & Video Platform', 'Both'],
      default: 'Streaming Service',
    },
    websiteUrl: {
      type: String,
      default: '#',
    },
    badgeColor: {
      type: String,
      default: '#6366f1',
    },
  },
  {
    timestamps: true,
  }
);

const Platform = mongoose.model('Platform', platformSchema);
export default Platform;
