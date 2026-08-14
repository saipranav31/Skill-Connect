import { runQuery } from '../config/database.js';
import * as queries from '../queries/cypherQueries.js';
import { cryptoNativeId } from '../utils/idGenerator.js';

export const getAllPeople = async (req, res) => {
  const records = await runQuery(queries.GET_ALL_PEOPLE);
  const people = records.map(record => {
    const person = record.get('p').properties;
    const skills = record.get('skills').map(s => s.properties);
    const projects = record.get('projects').map(p => p.properties);
    return { ...person, skills, projects };
  });
  res.json(people);
};

export const getPersonById = async (req, res) => {
  const { id } = req.params;
  const records = await runQuery(queries.GET_PERSON_BY_ID, { id });
  
  if (records.length === 0) {
    return res.status(404).json({ error: 'Person not found' });
  }

  const record = records[0];
  const personNode = record.get('p');
  if (!personNode) {
    return res.status(404).json({ error: 'Person not found' });
  }

  const person = personNode.properties;
  const skills = (record.get('skills') || []).map(s => s.properties);
  const projects = (record.get('projects') || []).map(p => p.properties);
  const company = record.get('company')?.properties || null;
  const network = (record.get('network') || []).map(k => k.properties);

  res.json({ ...person, skills, projects, company, network });
};

export const createPerson = async (req, res) => {
  const { name, email, location, bio } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required fields.' });
  }

  const id = `person_${cryptoNativeId()}`;
  const records = await runQuery(queries.CREATE_PERSON, {
    id,
    name: name.trim(),
    email: email.trim(),
    location: (location || 'Remote').trim(),
    bio: (bio || 'Tech professional').trim()
  });

  const newPerson = records[0].get('p').properties;
  res.status(201).json(newPerson);
};

export const updatePerson = async (req, res) => {
  const { id } = req.params;
  const { name, email, location, bio } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required fields.' });
  }

  const records = await runQuery(queries.UPDATE_PERSON, {
    id,
    name: name.trim(),
    email: email.trim(),
    location: (location || 'Remote').trim(),
    bio: (bio || '').trim()
  });

  if (records.length === 0) {
    return res.status(404).json({ error: 'Person not found' });
  }

  res.json(records[0].get('p').properties);
};

export const deletePerson = async (req, res) => {
  const { id } = req.params;
  const records = await runQuery(queries.DELETE_PERSON, { id });
  res.json({ message: 'Person and associated relationships deleted successfully.' });
};

export const getPersonSkills = async (req, res) => {
  const { id } = req.params;
  const records = await runQuery(queries.GET_PERSON_SKILLS, { personId: id });
  const skills = records.map(r => r.get('s').properties);
  res.json(skills);
};

export const getPersonProjects = async (req, res) => {
  const { id } = req.params;
  const records = await runQuery(queries.GET_PERSON_PROJECTS, { personId: id });
  const projects = records.map(r => r.get('prj').properties);
  res.json(projects);
};

export const addPersonSkill = async (req, res) => {
  const { id } = req.params;
  const { skillId } = req.body;
  if (!skillId) return res.status(400).json({ error: 'skillId is required' });

  await runQuery(queries.CONNECT_PERSON_SKILL, { personId: id, skillId });
  res.json({ message: 'Skill linked to person successfully' });
};

export const addPersonProject = async (req, res) => {
  const { id } = req.params;
  const { projectId } = req.body;
  if (!projectId) return res.status(400).json({ error: 'projectId is required' });

  await runQuery(queries.CONNECT_PERSON_PROJECT, { personId: id, projectId });
  res.json({ message: 'Project linked to person successfully' });
};

export const connectPersonToCompany = async (req, res) => {
  const { id } = req.params;
  const { companyId } = req.body;
  if (!companyId) return res.status(400).json({ error: 'companyId is required' });

  await runQuery(queries.CONNECT_PERSON_COMPANY, { personId: id, companyId });
  res.json({ message: 'Person linked to company successfully' });
};

export const connectPersonToPerson = async (req, res) => {
  const { id } = req.params;
  const { targetPersonId } = req.body;
  if (!targetPersonId) return res.status(400).json({ error: 'targetPersonId is required' });

  await runQuery(queries.CONNECT_PERSON_KNOWS_PERSON, { personId1: id, personId2: targetPersonId });
  res.json({ message: 'Network connection established successfully' });
};
