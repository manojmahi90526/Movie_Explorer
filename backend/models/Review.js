import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
      index: true,
    },
    platformSource: {
      type: String,
      required: [true, 'Platform source is required (e.g. YouTube, IMDb, Rotten Tomatoes)'],
      default: 'YouTube Critics',
    },
    platformLogo: {
      type: String,
      default: '',
    },
    reviewerName: {
      type: String,
      required: [true, 'Reviewer or Channel name is required'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Rating (1-10) is required'],
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
    },
    sourceUrl: {
      type: String,
      default: '#',
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
