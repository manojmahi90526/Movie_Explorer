import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Movie from '../models/Movie.js';
import { getFallbackReviews } from '../services/fallbackService.js';

// @desc    Get reviews for a movie or all reviews
// @route   GET /api/reviews
export const getReviews = async (req, res) => {
  const { movieId, platformSource } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      let query = {};

      if (movieId) query.movie = movieId;
      if (platformSource) query.platformSource = new RegExp(platformSource, 'i');

      const reviews = await Review.find(query)
        .maxTimeMS(4000)
        .populate('movie', 'title posterUrl releaseYear')
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
      console.warn('⚠️ MongoDB getReviews failed, falling back:', error.message);
    }
  }

  const fallbackReviews = getFallbackReviews(movieId);
  return res.json({ success: true, count: fallbackReviews.length, data: fallbackReviews, fallback: true });
};


// @desc    Create a new review for a movie
// @route   POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { movie, platformSource, platformLogo, reviewerName, rating, reviewText, sourceUrl } = req.body;

    const movieExists = await Movie.findById(movie);
    if (!movieExists) {
      return res.status(404).json({ success: false, message: 'Referenced movie not found' });
    }

    const review = await Review.create({
      movie,
      platformSource: platformSource || 'YouTube Critics',
      platformLogo,
      reviewerName,
      rating: Number(rating),
      reviewText,
      sourceUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Review published successfully',
      data: review,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a review (Admin Only)
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
