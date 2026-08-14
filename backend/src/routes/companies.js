import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as companiesController from '../controllers/companiesController.js';

const router = express.Router();

router.get('/', asyncHandler(companiesController.getAllCompanies));
router.post('/', asyncHandler(companiesController.createCompany));
router.get('/:id', asyncHandler(companiesController.getCompanyById));

export default router;
