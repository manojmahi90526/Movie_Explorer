import express from 'express';
import { getPlatforms, createPlatform } from '../controllers/platformController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPlatforms)
  .post(protect, adminOnly, createPlatform);

export default router;
