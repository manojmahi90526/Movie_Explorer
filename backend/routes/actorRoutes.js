import express from 'express';
import {
  getActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor,
} from '../controllers/actorController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getActors)
  .post(protect, adminOnly, createActor);

router.route('/:id')
  .get(getActorById)
  .put(protect, adminOnly, updateActor)
  .delete(protect, adminOnly, deleteActor);

export default router;
