import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as recommendationsController from '../controllers/recommendationsController.js';

const router = express.Router();

router.get('/:personId', asyncHandler(recommendationsController.getPersonRecommendations));
router.get('/:personId/awkward-relational', asyncHandler(recommendationsController.getAwkwardRelationalComparison));

export default router;
