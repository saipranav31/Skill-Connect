import { runQuery } from '../config/database.js';
import * as queries from '../queries/cypherQueries.js';

export const globalSearch = async (req, res) => {
  const queryParam = req.query.q || '';
  const q = queryParam.trim();

  if (!q) {
    return res.json({ people: [], skills: [], projects: [], companies: [] });
  }

  // Execute parameterized queries safely
  const [peopleRes, skillsRes, projectsRes, companiesRes] = await Promise.all([
    runQuery(queries.GLOBAL_SEARCH_PEOPLE, { q }),
    runQuery(queries.GLOBAL_SEARCH_SKILLS, { q }),
    runQuery(queries.GLOBAL_SEARCH_PROJECTS, { q }),
    runQuery(queries.GLOBAL_SEARCH_COMPANIES, { q })
  ]);

  const people = peopleRes.map(r => ({
    ...r.get('p').properties,
    skills: (r.get('skills') || []).map(s => s.properties)
  }));

  const skills = skillsRes.map(r => ({
    ...r.get('s').properties,
    peopleCount: r.get('peopleCount')
  }));

  const projects = projectsRes.map(r => ({
    ...r.get('prj').properties,
    requiredSkills: (r.get('requiredSkills') || []).map(s => s.properties)
  }));

  const companies = companiesRes.map(r => r.get('c').properties);

  res.json({
    query: q,
    people,
    skills,
    projects,
    companies
  });
};
