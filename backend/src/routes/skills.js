import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as skillsController from '../controllers/skillsController.js';

const router = express.Router();

router.get('/', asyncHandler(skillsController.getAllSkills));
router.post('/', asyncHandler(skillsController.createSkill));

router.get('/:id', asyncHandler(skillsController.getSkillById));
router.put('/:id', asyncHandler(skillsController.updateSkill));
router.delete('/:id', asyncHandler(skillsController.deleteSkill));

router.get('/:id/people', asyncHandler(skillsController.getSkillPeople));
router.get('/:id/projects', asyncHandler(skillsController.getSkillProjects));

export default router;
