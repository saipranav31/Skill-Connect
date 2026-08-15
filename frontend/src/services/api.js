import axios from 'axios';
import * as snapshot from './cognoDbSnapshot.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 4000
});

// Resilient API Wrapper: Uses Live API if available, falls back seamlessly to CognoDB Snapshot payload on GitHub Pages
const tryApiCall = async (apiCall, fallbackFn) => {
  try {
    return await apiCall();
  } catch (error) {
    if (fallbackFn) {
      console.warn('[SkillConnect] Using CognoDB Snapshot Payload for static host execution');
      return { data: fallbackFn() };
    }
    throw error;
  }
};

export const checkHealth = () => tryApiCall(
  () => api.get('/health'),
  () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'CognoDB (Neo4j Bolt Protocol)',
      connected: true,
      address: 'db-6849b5e4.databases.cognodb.com:7687'
    }
  })
);

export const getGraphStats = () => tryApiCall(() => api.get('/graph/stats'), snapshot.getGraphStatsSnapshot);
export const getFullGraph = () => tryApiCall(() => api.get('/graph'), snapshot.getFullGraphSnapshot);

export const getPeople = () => tryApiCall(() => api.get('/people'), () => snapshot.people);
export const getPersonById = (id) => tryApiCall(
  () => api.get(`/people/${id}`),
  () => snapshot.people.find(p => p.id === id) || snapshot.people[0]
);

export const createPerson = (data) => api.post('/people', data);
export const updatePerson = (id, data) => api.put(`/people/${id}`, data);
export const deletePerson = (id) => api.delete(`/people/${id}`);

export const getSkills = () => tryApiCall(() => api.get('/skills'), () => snapshot.skills);
export const getSkillById = (id) => tryApiCall(
  () => api.get(`/skills/${id}`),
  () => {
    const s = snapshot.skills.find(sk => sk.id === id) || snapshot.skills[0];
    return {
      ...s,
      people: snapshot.people.filter(p => p.skills.some(sk => sk.id === s.id)),
      projects: snapshot.projects.filter(prj => prj.requiredSkills.some(sk => sk.id === s.id))
    };
  }
);

export const createSkill = (data) => api.post('/skills', data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);

export const getProjects = () => tryApiCall(() => api.get('/projects'), () => snapshot.projects);
export const getProjectById = (id) => tryApiCall(
  () => api.get(`/projects/${id}`),
  () => snapshot.projects.find(prj => prj.id === id) || snapshot.projects[0]
);

export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const getCompanies = () => tryApiCall(() => api.get('/companies'), () => snapshot.companies);
export const getCompanyById = (id) => tryApiCall(
  () => api.get(`/companies/${id}`),
  () => snapshot.companies.find(c => c.id === id) || snapshot.companies[0]
);

export const searchGlobal = (query) => tryApiCall(
  () => api.get(`/search?q=${encodeURIComponent(query)}`),
  () => {
    const q = (query || '').toLowerCase();
    return {
      query,
      people: snapshot.people.filter(p => p.name.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q)),
      skills: snapshot.skills.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)),
      projects: snapshot.projects.filter(prj => prj.name.toLowerCase().includes(q) || prj.description.toLowerCase().includes(q)),
      companies: snapshot.companies.filter(c => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q))
    };
  }
);

export const getPersonRecommendations = (personId) => tryApiCall(
  () => api.get(`/recommendations/${personId}`),
  () => snapshot.calculateMultiHopRecommendations(personId)
);

export const getAwkwardRelationalComparison = (personId) => tryApiCall(
  () => api.get(`/recommendations/${personId}/awkward-relational`),
  () => ({
    explanation: 'In a Relational SQL database, finding 2-hop collaborator network recommendations requires 5+ INNER JOINs across Person, Person_Skills, Skills_Projects, Projects, and Person_Connections junction tables. In CognoDB, Cypher evaluates graph pointer traversals natively in a single query.',
    personId,
    recommendations: [
      {
        collaborator: snapshot.people[1],
        company: snapshot.companies[0],
        project: snapshot.projects[2],
        sharedSkills: [snapshot.skills[5], snapshot.skills[11]],
        sharedSkillCount: 2
      }
    ]
  })
);

export default api;
