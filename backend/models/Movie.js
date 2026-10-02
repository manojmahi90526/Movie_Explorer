import mongoose from 'mongoose';

// Helper function to count words
export const countWords = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster image URL is required'],
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Released', 'Upcoming'],
      default: 'Released',
      index: true,
    },
    genre: {
      type: [String],
      required: true,
      default: ['Action', 'Drama'],
    },
    duration: {
      type: String,
      default: '2h 15m',
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 7.5,
    },
    briefStory: {
      type: String,
      required: [true, 'Brief story is required'],
      validate: {
        validator: function (v) {
          const words = countWords(v);
          return words >= 20 && words <= 40;
        },
        message: (props) =>
          `Brief story synopsis must be between 20 and 40 words (Current word count: ${countWords(
            props.value
          )})`,
      },
    },
    boxOffice: {
      worldwideGross: {
        type: String,
        default: 'N/A',
      },
      grossInCrores: {
        type: Number,
        default: 0,
      },
      budget: {
        type: String,
        default: 'N/A',
      },
      openingDay: {
        type: String,
        default: 'N/A',
      },
      verdict: {
        type: String,
        default: 'Hit',
      },
    },
    characters: [
      {
        characterName: {
          type: String,
          required: [true, 'Character name is required'],
        },
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Actor',
          required: [true, 'Actor reference is required'],
        },
        isLead: {
          type: Boolean,
          default: false,
        },
      },
    ],
    streamingPlatforms: [
      {
        platform: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Platform',
          required: true,
        },
        watchUrl: {
          type: String,
          default: '#',
        },
        subscriptionType: {
          type: String,
          enum: ['Subscription', 'Free', 'Rent/Buy', 'Theatrical'],
          default: 'Subscription',
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field to populate reviews directly from Movie
movieSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'movie',
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
