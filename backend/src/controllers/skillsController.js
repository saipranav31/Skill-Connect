import { runQuery } from '../config/database.js';
import * as queries from '../queries/cypherQueries.js';
import { cryptoNativeId } from '../utils/idGenerator.js';

export const getAllSkills = async (req, res) => {
  const records = await runQuery(queries.GET_ALL_SKILLS);
  const skills = records.map(record => {
    const skill = record.get('s').properties;
    const peopleCount = record.get('peopleCount');
    const projectsCount = record.get('projectsCount');
    return { ...skill, peopleCount, projectsCount };
  });
  res.json(skills);
};

export const getSkillById = async (req, res) => {
  const { id } = req.params;
  const records = await runQuery(queries.GET_SKILL_BY_ID, { id });

  if (records.length === 0 || !records[0].get('s')) {
    return res.status(404).json({ error: 'Skill not found' });
  }

  const record = records[0];
  const skill = record.get('s').properties;
  const people = (record.get('people') || []).map(p => p.properties);
  const projects = (record.get('projects') || []).map(prj => prj.properties);

  res.json({ ...skill, people, projects });
};

export const createSkill = async (req, res) => {
  const { name, category, level } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Skill name is required' });
  }

  const id = `skill_${cryptoNativeId()}`;
  const records = await runQuery(queries.CREATE_SKILL, {
    id,
    name: name.trim(),
    category: (category || 'General').trim(),
    level: (level || 'Intermediate').trim()
  });

  res.status(201).json(records[0].get('s').properties);
};

export const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, category, level } = req.body;

  if (!name) return res.status(400).json({ error: 'Skill name is required' });

  const records = await runQuery(queries.UPDATE_SKILL, {
    id,
    name: name.trim(),
    category: (category || 'General').trim(),
    level: (level || 'Intermediate').trim()
  });

  if (records.length === 0) return res.status(404).json({ error: 'Skill not found' });

  res.json(records[0].get('s').properties);
};

export const deleteSkill = async (req, res) => {
  const { id } = req.params;
  await runQuery(queries.DELETE_SKILL, { id });
  res.json({ message: 'Skill deleted successfully' });
};

export const getSkillPeople = async (req, res) => {
  const { id } = req.params;
  const records = await runQuery(queries.GET_SKILL_PEOPLE, { skillId: id });
  const people = records.map(r => r.get('p').properties);
  res.json(people);
};

export const getSkillProjects = async (req, res) => {
  const { id } = req.params;
  const records = await runQuery(queries.GET_SKILL_PROJECTS, { skillId: id });
  const projects = records.map(r => r.get('prj').properties);
  res.json(projects);
};
