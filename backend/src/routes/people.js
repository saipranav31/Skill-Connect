import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as peopleController from '../controllers/peopleController.js';

const router = express.Router();

router.get('/', asyncHandler(peopleController.getAllPeople));
router.post('/', asyncHandler(peopleController.createPerson));

router.get('/:id', asyncHandler(peopleController.getPersonById));
router.put('/:id', asyncHandler(peopleController.updatePerson));
router.delete('/:id', asyncHandler(peopleController.deletePerson));

router.get('/:id/skills', asyncHandler(peopleController.getPersonSkills));
router.post('/:id/skills', asyncHandler(peopleController.addPersonSkill));

router.get('/:id/projects', asyncHandler(peopleController.getPersonProjects));
router.post('/:id/projects', asyncHandler(peopleController.addPersonProject));

router.post('/:id/company', asyncHandler(peopleController.connectPersonToCompany));
router.post('/:id/connect', asyncHandler(peopleController.connectPersonToPerson));

export default router;
