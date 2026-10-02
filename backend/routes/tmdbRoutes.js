import express from 'express';
import { searchTMDb, getTMDbMovie, getTMDbPopular } from '../controllers/tmdbController.js';

const router = express.Router();

// GET /api/tmdb/search?q=bahubali&page=1
router.get('/search', searchTMDb);

// GET /api/tmdb/popular?page=1
router.get('/popular', getTMDbPopular);

// GET /api/tmdb/movie/:id
router.get('/movie/:id', getTMDbMovie);

export default router;
