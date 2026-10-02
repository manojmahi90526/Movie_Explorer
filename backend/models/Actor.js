import mongoose from 'mongoose';

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Actor name is required'],
      trim: true,
      index: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
    },
    dateOfBirth: {
      type: String,
      default: 'N/A',
    },
    debutYear: {
      type: Number,
      required: [true, 'Debut year is required'],
    },
    nationality: {
      type: String,
      default: 'International',
    },
    roleType: {
      type: String,
      enum: ['Lead Actor', 'Lead Actress', 'Director & Actor', 'Supporting Actor'],
      default: 'Lead Actor',
    },
    awards: {
      type: [String],
      default: [],
    },
    highlightQuote: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Actor = mongoose.model('Actor', actorSchema);
export default Actor;
