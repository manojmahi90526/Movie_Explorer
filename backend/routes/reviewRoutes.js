import express from 'express';
import { getReviews, createReview, deleteReview } from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(protect, adminOnly, createReview);

router.route('/:id')
  .delete(protect, adminOnly, deleteReview);

export default router;
