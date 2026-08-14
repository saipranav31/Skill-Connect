import { runQuery } from '../config/database.js';
import * as queries from '../queries/cypherQueries.js';
import { cryptoNativeId } from '../utils/idGenerator.js';

export const getAllProjects = async (req, res) => {
  const records = await runQuery(queries.GET_ALL_PROJECTS);
  const projects = records.map(record => {
    const prj = record.get('prj').properties;
    const requiredSkills = (record.get('requiredSkills') || []).map(s => s.properties);
    const team = (record.get('team') || []).map(p => p.properties);
    const company = record.get('company')?.properties || null;
    return { ...prj, requiredSkills, team, company };
  });
  res.json(projects);
};

export const getProjectById = async (req, res) => {
  const { id } = req.params;
  const records = await runQuery(queries.GET_PROJECT_BY_ID, { id });

  if (records.length === 0 || !records[0].get('prj')) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const record = records[0];
  const prj = record.get('prj').properties;
  const requiredSkills = (record.get('requiredSkills') || []).map(s => s.properties);
  const team = (record.get('team') || []).map(p => p.properties);
  const company = record.get('company')?.properties || null;

  res.json({ ...prj, requiredSkills, team, company });
};

export const createProject = async (req, res) => {
  const { name, description, category, status } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  const id = `proj_${cryptoNativeId()}`;
  const records = await runQuery(queries.CREATE_PROJECT, {
    id,
    name: name.trim(),
    description: description.trim(),
    category: (category || 'General').trim(),
    status: (status || 'Active').trim()
  });

  res.status(201).json(records[0].get('prj').properties);
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, category, status } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  const records = await runQuery(queries.UPDATE_PROJECT, {
    id,
    name: name.trim(),
    description: description.trim(),
    category: (category || 'General').trim(),
    status: (status || 'Active').trim()
  });

  if (records.length === 0) return res.status(404).json({ error: 'Project not found' });

  res.json(records[0].get('prj').properties);
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  await runQuery(queries.DELETE_PROJECT, { id });
  res.json({ message: 'Project deleted successfully' });
};

export const getProjectSkills = async (req, res) => {
  const { id } = req.params;
  const records = await runQuery(queries.GET_PROJECT_SKILLS, { projectId: id });
  const skills = records.map(r => r.get('s').properties);
  res.json(skills);
};

export const addProjectRequiredSkill = async (req, res) => {
  const { id } = req.params;
  const { skillId } = req.body;
  if (!skillId) return res.status(400).json({ error: 'skillId is required' });

  await runQuery(queries.CONNECT_PROJECT_SKILL, { projectId: id, skillId });
  res.json({ message: 'Required skill added to project' });
};
