import express from 'express';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  reseedData,
} from '../controllers/movieController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/reseed', reseedData);

router.route('/')
  .get(getMovies)
  .post(protect, adminOnly, createMovie);


router.route('/:id')
  .get(getMovieById)
  .put(protect, adminOnly, updateMovie)
  .delete(protect, adminOnly, deleteMovie);

export default router;
