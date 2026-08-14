import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Helper response interceptor for clean error handling
api.interceptors.response.use(
  response => response,
  error => {
    const customError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Network communication error',
      details: error.response?.data?.details || null,
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      isDatabaseError: error.response?.status === 503 || error.response?.data?.code?.includes('COGNODB')
    };
    return Promise.reject(customError);
  }
);

export const checkHealth = () => api.get('/health');
export const getGraphStats = () => api.get('/graph/stats');
export const getFullGraph = () => api.get('/graph');

export const getPeople = () => api.get('/people');
export const getPersonById = (id) => api.get(`/people/${id}`);
export const createPerson = (data) => api.post('/people', data);
export const updatePerson = (id, data) => api.put(`/people/${id}`, data);
export const deletePerson = (id) => api.delete(`/people/${id}`);
export const addPersonSkill = (personId, skillId) => api.post(`/people/${personId}/skills`, { skillId });
export const addPersonProject = (personId, projectId) => api.post(`/people/${personId}/projects`, { projectId });

export const getSkills = () => api.get('/skills');
export const getSkillById = (id) => api.get(`/skills/${id}`);
export const createSkill = (data) => api.post('/skills', data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);

export const getProjects = () => api.get('/projects');
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const getCompanies = () => api.get('/companies');
export const getCompanyById = (id) => api.get(`/companies/${id}`);
export const createCompany = (data) => api.post('/companies', data);

export const searchGlobal = (query) => api.get(`/search?q=${encodeURIComponent(query)}`);
export const getPersonRecommendations = (personId) => api.get(`/recommendations/${personId}`);
export const getAwkwardRelationalComparison = (personId) => api.get(`/recommendations/${personId}/awkward-relational`);

export default api;
