import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as graphController from '../controllers/graphController.js';

const router = express.Router();

router.get('/', asyncHandler(graphController.getFullGraph));
router.get('/stats', asyncHandler(graphController.getGraphStats));

export default router;
