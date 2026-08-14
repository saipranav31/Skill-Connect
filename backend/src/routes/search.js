import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as searchController from '../controllers/searchController.js';

const router = express.Router();

router.get('/', asyncHandler(searchController.globalSearch));

export default router;
