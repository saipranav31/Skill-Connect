import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as projectsController from '../controllers/projectsController.js';

const router = express.Router();

router.get('/', asyncHandler(projectsController.getAllProjects));
router.post('/', asyncHandler(projectsController.createProject));

router.get('/:id', asyncHandler(projectsController.getProjectById));
router.put('/:id', asyncHandler(projectsController.updateProject));
router.delete('/:id', asyncHandler(projectsController.deleteProject));

router.get('/:id/skills', asyncHandler(projectsController.getProjectSkills));
router.post('/:id/skills', asyncHandler(projectsController.addProjectRequiredSkill));

export default router;
