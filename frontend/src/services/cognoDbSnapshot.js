/**
 * CognoDB Graph Database Pre-loaded Snapshot & Fallback Engine
 * Provides seamless execution for GitHub Pages static hosting when backend localhost API is unreachable.
 */

export const companies = [
  { id: 'comp_1', name: 'Wexa AI', industry: 'Artificial Intelligence' },
  { id: 'comp_2', name: 'CognoSystems', industry: 'Graph Database Technology' },
  { id: 'comp_3', name: 'CloudScale Labs', industry: 'Cloud Infrastructure' },
  { id: 'comp_4', name: 'DevMatrix Software', industry: 'Enterprise Software' },
  { id: 'comp_5', name: 'DataPulse Tech', industry: 'Analytics & Big Data' },
  { id: 'comp_6', name: 'InnovateX Solutions', industry: 'Fintech & Security' }
];

export const skills = [
  { id: 'skill_1', name: 'Java', category: 'Backend', level: 'Expert', peopleCount: 5, projectsCount: 3 },
  { id: 'skill_2', name: 'JavaScript', category: 'Frontend', level: 'Expert', peopleCount: 7, projectsCount: 4 },
  { id: 'skill_3', name: 'TypeScript', category: 'Frontend/Backend', level: 'Advanced', peopleCount: 6, projectsCount: 4 },
  { id: 'skill_4', name: 'React', category: 'Frontend', level: 'Expert', peopleCount: 8, projectsCount: 5 },
  { id: 'skill_5', name: 'Node.js', category: 'Backend', level: 'Expert', peopleCount: 7, projectsCount: 5 },
  { id: 'skill_6', name: 'Python', category: 'Data & AI', level: 'Expert', peopleCount: 6, projectsCount: 4 },
  { id: 'skill_7', name: 'Machine Learning', category: 'AI/ML', level: 'Advanced', peopleCount: 5, projectsCount: 3 },
  { id: 'skill_8', name: 'Artificial Intelligence', category: 'AI/ML', level: 'Advanced', peopleCount: 5, projectsCount: 3 },
  { id: 'skill_9', name: 'SQL', category: 'Database', level: 'Advanced', peopleCount: 6, projectsCount: 3 },
  { id: 'skill_10', name: 'MongoDB', category: 'Database', level: 'Advanced', peopleCount: 4, projectsCount: 2 },
  { id: 'skill_11', name: 'Graph Databases', category: 'Database', level: 'Expert', peopleCount: 7, projectsCount: 5 },
  { id: 'skill_12', name: 'CognoDB', category: 'Database', level: 'Expert', peopleCount: 8, projectsCount: 6 },
  { id: 'skill_13', name: 'Docker', category: 'DevOps', level: 'Intermediate', peopleCount: 5, projectsCount: 2 },
  { id: 'skill_14', name: 'AWS', category: 'Cloud', level: 'Advanced', peopleCount: 5, projectsCount: 2 },
  { id: 'skill_15', name: 'Git', category: 'Tools', level: 'Expert', peopleCount: 6, projectsCount: 2 },
  { id: 'skill_16', name: 'GitHub', category: 'Tools', level: 'Expert', peopleCount: 5, projectsCount: 2 },
  { id: 'skill_17', name: 'Express.js', category: 'Backend', level: 'Advanced', peopleCount: 6, projectsCount: 3 },
  { id: 'skill_18', name: 'System Design', category: 'Architecture', level: 'Expert', peopleCount: 7, projectsCount: 4 },
  { id: 'skill_19', name: 'Data Structures', category: 'Computer Science', level: 'Expert', peopleCount: 6, projectsCount: 3 },
  { id: 'skill_20', name: 'GraphQL', category: 'API', level: 'Intermediate', peopleCount: 4, projectsCount: 2 }
];

export const projects = [
  { 
    id: 'proj_1', 
    name: 'SkillConnect', 
    description: 'Graph-powered skill and project discovery platform using CognoDB.', 
    category: 'Web App', 
    status: 'Active',
    company: companies[0],
    requiredSkills: [skills[1], skills[2], skills[3], skills[4], skills[10], skills[11]],
    team: []
  },
  { 
    id: 'proj_2', 
    name: 'RoadRescue', 
    description: 'Emergency roadside assistance dispatcher platform with IoT telemetry.', 
    category: 'Mobile & IoT', 
    status: 'Active',
    company: companies[3],
    requiredSkills: [skills[0], skills[3], skills[4], skills[8]],
    team: []
  },
  { 
    id: 'proj_3', 
    name: 'AI Internship Engine', 
    description: 'AI recommendation system for automated talent matching and candidate scoring.', 
    category: 'Artificial Intelligence', 
    status: 'Active',
    company: companies[0],
    requiredSkills: [skills[5], skills[6], skills[7], skills[11], skills[16]],
    team: []
  },
  { 
    id: 'proj_4', 
    name: 'GraphViz Studio', 
    description: 'Visual interactive graph database workbench for real-time Cypher visualization.', 
    category: 'Developer Tools', 
    status: 'In Development',
    company: companies[1],
    requiredSkills: [skills[2], skills[3], skills[10], skills[11]],
    team: []
  },
  { 
    id: 'proj_5', 
    name: 'CloudMetrics Engine', 
    description: 'Real-time telemetry and cloud cost optimization suite.', 
    category: 'Cloud & DevOps', 
    status: 'Active',
    company: companies[2],
    requiredSkills: [skills[12], skills[13], skills[4], skills[17]],
    team: []
  },
  { 
    id: 'proj_6', 
    name: 'FinPulse Core', 
    description: 'High-frequency transaction audit ledger and fraud detector.', 
    category: 'Fintech', 
    status: 'Active',
    company: companies[5],
    requiredSkills: [skills[0], skills[8], skills[17], skills[18]],
    team: []
  }
];

export const people = [
  {
    id: 'person_1',
    name: 'Sai Pranav',
    email: 'sai.pranav@example.com',
    location: 'Bengaluru, India',
    bio: 'Senior Full-Stack Engineer specializing in React, Node.js, and CognoDB Graph Databases.',
    company: companies[0],
    skills: [skills[1], skills[2], skills[3], skills[4], skills[10], skills[11], skills[16]],
    projects: [projects[0], projects[2]],
    network: []
  },
  {
    id: 'person_2',
    name: 'Ananya Sharma',
    email: 'ananya.s@example.com',
    location: 'Hyderabad, India',
    bio: 'AI/ML Researcher focused on Graph Neural Networks and LLM agent orchestration.',
    company: companies[0],
    skills: [skills[5], skills[6], skills[7], skills[10], skills[11]],
    projects: [projects[2]],
    network: []
  },
  {
    id: 'person_3',
    name: 'Rohan Mehta',
    email: 'rohan.m@example.com',
    location: 'Mumbai, India',
    bio: 'Cloud Architect & DevOps Engineer passionate about Docker & AWS automation.',
    company: companies[2],
    skills: [skills[12], skills[13], skills[14], skills[17]],
    projects: [projects[4]],
    network: []
  },
  {
    id: 'person_4',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    location: 'Kochi, India',
    bio: 'Frontend UI/UX Specialist obsessed with modern web design and React components.',
    company: companies[3],
    skills: [skills[1], skills[3], skills[14], skills[15]],
    projects: [projects[0]],
    network: []
  },
  {
    id: 'person_5',
    name: 'Vikramaditya Singh',
    email: 'vikram.singh@example.com',
    location: 'Delhi, India',
    bio: 'Backend Systems Engineer building distributed databases and Cypher query engines.',
    company: companies[1],
    skills: [skills[0], skills[10], skills[11], skills[17], skills[18]],
    projects: [projects[0], projects[3]],
    network: []
  },
  {
    id: 'person_6',
    name: 'Kavya Reddy',
    email: 'kavya.r@example.com',
    location: 'Bengaluru, India',
    bio: 'Full-Stack Developer crafting scalable Node.js microservices and REST APIs.',
    company: companies[0],
    skills: [skills[2], skills[4], skills[9], skills[16]],
    projects: [projects[0]],
    network: []
  }
];

// Link Teams
projects[0].team = [people[0], people[3], people[4], people[5]];
projects[1].team = [people[4]];
projects[2].team = [people[0], people[1]];
projects[3].team = [people[4]];
projects[4].team = [people[2]];

// Link Network
people[0].network = [people[1], people[3], people[4], people[5]];
people[1].network = [people[0], people[4]];

export const getGraphStatsSnapshot = () => ({
  people: 22,
  skills: 20,
  projects: 12,
  companies: 6,
  relationships: 154
});

export const calculateMultiHopRecommendations = (personId) => {
  const person = people.find(p => p.id === personId) || people[0];
  const userSkillIds = new Set(person.skills.map(s => s.id));

  const matchingProjects = projects.map(prj => {
    const matchedSkills = prj.requiredSkills.filter(s => userSkillIds.has(s.id));
    const matchedCount = matchedSkills.length;
    const requiredCount = prj.requiredSkills.length;
    const matchPercentage = requiredCount > 0 ? Math.round((matchedCount / requiredCount) * 100) : 0;

    return {
      project: prj,
      company: prj.company,
      matchingSkills: matchedSkills,
      requiredSkills: prj.requiredSkills,
      matchedCount,
      requiredCount,
      matchPercentage
    };
  }).filter(item => item.matchedCount > 0).sort((a, b) => b.matchPercentage - a.matchPercentage);

  return { person, matchingProjects };
};

export const getFullGraphSnapshot = () => {
  const nodes = [];
  const edges = [];

  people.forEach(p => nodes.push({ id: p.id, label: p.name, type: 'Person', properties: p }));
  skills.forEach(s => nodes.push({ id: s.id, label: s.name, type: 'Skill', properties: s }));
  projects.forEach(prj => nodes.push({ id: prj.id, label: prj.name, type: 'Project', properties: prj }));
  companies.forEach(c => nodes.push({ id: c.id, label: c.name, type: 'Company', properties: c }));

  people.forEach(p => {
    p.skills.forEach(s => edges.push({ id: `${p.id}-HAS_SKILL-${s.id}`, source: p.id, target: s.id, type: 'HAS_SKILL' }));
    p.projects.forEach(prj => edges.push({ id: `${p.id}-WORKED_ON-${prj.id}`, source: p.id, target: prj.id, type: 'WORKED_ON' }));
    if (p.company) edges.push({ id: `${p.id}-WORKS_AT-${p.company.id}`, source: p.id, target: p.company.id, type: 'WORKS_AT' });
  });

  projects.forEach(prj => {
    prj.requiredSkills.forEach(s => edges.push({ id: `${prj.id}-REQUIRES-${s.id}`, source: prj.id, target: s.id, type: 'REQUIRES' }));
    if (prj.company) edges.push({ id: `${prj.id}-OWNED_BY-${prj.company.id}`, source: prj.id, target: prj.company.id, type: 'OWNED_BY' });
  });

  return { nodes, edges };
};
