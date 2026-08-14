import { runQuery, closeDriver, verifyConnection } from '../src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  console.log('----------------------------------------------------');
  console.log('🌱 Starting SkillConnect CognoDB Idempotent Database Seeding...');
  console.log('----------------------------------------------------');

  const connection = await verifyConnection();
  if (!connection.connected) {
    console.error('❌ Cannot seed: CognoDB database is unreachable.');
    console.error(`Error: ${connection.error}`);
    console.error('Please check your COGNODB_URI, COGNODB_USERNAME, and COGNODB_PASSWORD in backend/.env');
    process.exit(1);
  }

  try {
    // 1. Seed Companies (6 Companies)
    console.log('📦 Seeding Companies (using MERGE)...');
    const companies = [
      { id: 'comp_1', name: 'Wexa AI', industry: 'Artificial Intelligence' },
      { id: 'comp_2', name: 'CognoSystems', industry: 'Graph Database Technology' },
      { id: 'comp_3', name: 'CloudScale Labs', industry: 'Cloud Infrastructure' },
      { id: 'comp_4', name: 'DevMatrix Software', industry: 'Enterprise Software' },
      { id: 'comp_5', name: 'DataPulse Tech', industry: 'Analytics & Big Data' },
      { id: 'comp_6', name: 'InnovateX Solutions', industry: 'Fintech & Security' }
    ];

    for (const comp of companies) {
      await runQuery(`
        MERGE (c:Company {id: $id})
        ON CREATE SET c.name = $name, c.industry = $industry, c.createdAt = datetime()
        ON MATCH SET c.name = $name, c.industry = $industry
      `, comp);
    }
    console.log(`  ✓ ${companies.length} Companies merged.`);

    // 2. Seed Skills (20 Skills)
    console.log('📦 Seeding Skills (using MERGE)...');
    const skills = [
      { id: 'skill_1', name: 'Java', category: 'Backend', level: 'Expert' },
      { id: 'skill_2', name: 'JavaScript', category: 'Frontend', level: 'Expert' },
      { id: 'skill_3', name: 'TypeScript', category: 'Frontend/Backend', level: 'Advanced' },
      { id: 'skill_4', name: 'React', category: 'Frontend', level: 'Expert' },
      { id: 'skill_5', name: 'Node.js', category: 'Backend', level: 'Expert' },
      { id: 'skill_6', name: 'Python', category: 'Data & AI', level: 'Expert' },
      { id: 'skill_7', name: 'Machine Learning', category: 'AI/ML', level: 'Advanced' },
      { id: 'skill_8', name: 'Artificial Intelligence', category: 'AI/ML', level: 'Advanced' },
      { id: 'skill_9', name: 'SQL', category: 'Database', level: 'Advanced' },
      { id: 'skill_10', name: 'MongoDB', category: 'Database', level: 'Advanced' },
      { id: 'skill_11', name: 'Graph Databases', category: 'Database', level: 'Expert' },
      { id: 'skill_12', name: 'CognoDB', category: 'Database', level: 'Expert' },
      { id: 'skill_13', name: 'Docker', category: 'DevOps', level: 'Intermediate' },
      { id: 'skill_14', name: 'AWS', category: 'Cloud', level: 'Advanced' },
      { id: 'skill_15', name: 'Git', category: 'Tools', level: 'Expert' },
      { id: 'skill_16', name: 'GitHub', category: 'Tools', level: 'Expert' },
      { id: 'skill_17', name: 'Express.js', category: 'Backend', level: 'Advanced' },
      { id: 'skill_18', name: 'System Design', category: 'Architecture', level: 'Expert' },
      { id: 'skill_19', name: 'Data Structures', category: 'Computer Science', level: 'Expert' },
      { id: 'skill_20', name: 'GraphQL', category: 'API', level: 'Intermediate' }
    ];

    for (const sk of skills) {
      await runQuery(`
        MERGE (s:Skill {id: $id})
        ON CREATE SET s.name = $name, s.category = $category, s.level = $level, s.createdAt = datetime()
        ON MATCH SET s.name = $name, s.category = $category, s.level = $level
      `, sk);
    }
    console.log(`  ✓ ${skills.length} Skills merged.`);

    // 3. Seed Projects (12 Projects)
    console.log('📦 Seeding Projects (using MERGE)...');
    const projects = [
      { id: 'proj_1', name: 'SkillConnect', description: 'Graph-powered skill and project discovery platform.', category: 'Web App', status: 'Active' },
      { id: 'proj_2', name: 'RoadRescue', description: 'Emergency roadside assistance dispatcher platform.', category: 'Mobile & IoT', status: 'Active' },
      { id: 'proj_3', name: 'AI Internship Engine', description: 'AI recommendation system for automated talent matching.', category: 'Artificial Intelligence', status: 'Active' },
      { id: 'proj_4', name: 'GraphViz Studio', description: 'Visual interactive graph database workbench.', category: 'Developer Tools', status: 'In Development' },
      { id: 'proj_5', name: 'CloudMetrics Engine', description: 'Real-time telemetry and cloud cost optimization suite.', category: 'Cloud & DevOps', status: 'Active' },
      { id: 'proj_6', name: 'FinPulse Core', description: 'High-frequency transaction audit ledger.', category: 'Fintech', status: 'Active' },
      { id: 'proj_7', name: 'NeuroSearch', description: 'Vector graph semantic search engine.', category: 'Search & AI', status: 'In Development' },
      { id: 'proj_8', name: 'CyberShield Guard', description: 'Zero-trust identity graph & threat detector.', category: 'Security', status: 'Active' },
      { id: 'proj_9', name: 'EduConnect Platform', description: 'Collaborative learning and peer skill verification.', category: 'EdTech', status: 'Completed' },
      { id: 'proj_10', name: 'SupplyGraph Hub', description: 'Multi-tiered logistics supply chain tracker.', category: 'Logistics', status: 'Active' },
      { id: 'proj_11', name: 'BioGen Analytics', description: 'Genomic graph network processing engine.', category: 'BioTech', status: 'In Development' },
      { id: 'proj_12', name: 'OmniChat Assistant', description: 'Multi-modal conversational agent framework.', category: 'AI Assistant', status: 'Active' }
    ];

    for (const prj of projects) {
      await runQuery(`
        MERGE (p:Project {id: $id})
        ON CREATE SET p.name = $name, p.description = $description, p.category = $category, p.status = $status, p.createdAt = datetime()
        ON MATCH SET p.name = $name, p.description = $description, p.category = $category, p.status = $status
      `, prj);
    }
    console.log(`  ✓ ${projects.length} Projects merged.`);

    // 4. Seed Persons (22 Persons)
    console.log('📦 Seeding Persons (using MERGE)...');
    const people = [
      { id: 'person_1', name: 'Sai Pranav', email: 'sai.pranav@example.com', location: 'Bengaluru, India', bio: 'Senior Full-Stack Engineer specializing in React, Node.js, and Graph Databases.' },
      { id: 'person_2', name: 'Ananya Sharma', email: 'ananya.s@example.com', location: 'Hyderabad, India', bio: 'AI/ML Researcher focused on Graph Neural Networks and LLM agents.' },
      { id: 'person_3', name: 'Rohan Mehta', email: 'rohan.m@example.com', location: 'Mumbai, India', bio: 'Cloud Architect & DevOps Engineer passionate about Docker & AWS automation.' },
      { id: 'person_4', name: 'Priya Nair', email: 'priya.nair@example.com', location: 'Kochi, India', bio: 'Frontend UI/UX Specialist obsessed with modern web design and React.' },
      { id: 'person_5', name: 'Vikramaditya Singh', email: 'vikram.singh@example.com', location: 'Delhi, India', bio: 'Backend Systems Engineer building distributed databases and Cypher engines.' },
      { id: 'person_6', name: 'Kavya Reddy', email: 'kavya.r@example.com', location: 'Bengaluru, India', bio: 'Full-Stack Developer crafting scalable Node.js microservices.' },
      { id: 'person_7', name: 'Arjun Verma', email: 'arjun.v@example.com', location: 'Pune, India', bio: 'Data Scientist specializing in Python, SQL, and predictive analytics.' },
      { id: 'person_8', name: 'Sneha Patel', email: 'sneha.p@example.com', location: 'Ahmedabad, India', bio: 'Mobile App Specialist & Java/TypeScript Developer.' },
      { id: 'person_9', name: 'Aditya Gupta', email: 'aditya.g@example.com', location: 'Noida, India', bio: 'Cybersecurity Analyst & Systems Architect.' },
      { id: 'person_10', name: 'Diya Sen', email: 'diya.sen@example.com', location: 'Kolkata, India', bio: 'Graph Database Engineer & Cypher enthusiast.' },
      { id: 'person_11', name: 'Rahul Joshi', email: 'rahul.j@example.com', location: 'Bengaluru, India', bio: 'Cloud Engineer specializing in AWS and microservice orchestration.' },
      { id: 'person_12', name: 'Isha Deshmukh', email: 'isha.d@example.com', location: 'Pune, India', bio: 'Product Engineer building real-time data visualizers.' },
      { id: 'person_13', name: 'Karan Malhotra', email: 'karan.m@example.com', location: 'Chandigarh, India', bio: 'Backend Engineer fluent in Java, Spring, and System Design.' },
      { id: 'person_14', name: 'Meera Rao', email: 'meera.r@example.com', location: 'Chennai, India', bio: 'Full-Stack Developer with strong UI design and GraphQL experience.' },
      { id: 'person_15', name: 'Siddharth Roy', email: 'siddharth.r@example.com', location: 'Gurugram, India', bio: 'Machine Learning Tech Lead building LLM pipelines in Python.' },
      { id: 'person_16', name: 'Tanvi Agarwal', email: 'tanvi.a@example.com', location: 'Jaipur, India', bio: 'Software Engineer skilled in Data Structures, React, and Express.' },
      { id: 'person_17', name: 'Varun Kulkarni', email: 'varun.k@example.com', location: 'Pune, India', bio: 'DevOps & Infrastructure Lead managing Docker & Kubernetes.' },
      { id: 'person_18', name: 'Pooja Bhatia', email: 'pooja.b@example.com', location: 'Delhi, India', bio: 'Database Administrator specializing in MongoDB, SQL, and CognoDB.' },
      { id: 'person_19', name: 'Aarav Choudhury', email: 'aarav.c@example.com', location: 'Bengaluru, India', bio: 'Front-End Architect skilled in TypeScript and Web Performance.' },
      { id: 'person_20', name: 'Ritu Kapoor', email: 'ritu.k@example.com', location: 'Mumbai, India', bio: 'Full-stack developer building enterprise fintech portals.' },
      { id: 'person_21', name: 'Devansh Saxena', email: 'devansh.s@example.com', location: 'Hyderabad, India', bio: 'AI Engineer building agentic graphs and vector databases.' },
      { id: 'person_22', name: 'Shreya Chatterjee', email: 'shreya.c@example.com', location: 'Kolkata, India', bio: 'Software Quality & Integration Architect.' }
    ];

    for (const p of people) {
      await runQuery(`
        MERGE (person:Person {id: $id})
        ON CREATE SET person.name = $name, person.email = $email, person.location = $location, person.bio = $bio, person.createdAt = datetime()
        ON MATCH SET person.name = $name, person.email = $email, person.location = $location, person.bio = $bio
      `, p);
    }
    console.log(`  ✓ ${people.length} Persons merged.`);

    // 5. Seed Relationships (Idempotent MERGEs)
    console.log('🔗 Seeding Relationships (HAS_SKILL, WORKED_ON, REQUIRES, WORKS_AT, KNOWS, OWNED_BY)...');

    // WORKS_AT (Person -> Company) (12+ relationships)
    const worksAt = [
      { p: 'person_1', c: 'comp_1' }, { p: 'person_2', c: 'comp_1' },
      { p: 'person_3', c: 'comp_3' }, { p: 'person_4', c: 'comp_4' },
      { p: 'person_5', c: 'comp_2' }, { p: 'person_6', c: 'comp_1' },
      { p: 'person_7', c: 'comp_5' }, { p: 'person_8', c: 'comp_4' },
      { p: 'person_9', c: 'comp_6' }, { p: 'person_10', c: 'comp_2' },
      { p: 'person_11', c: 'comp_3' }, { p: 'person_15', c: 'comp_1' }
    ];
    for (const rel of worksAt) {
      await runQuery(`
        MATCH (p:Person {id: $p}), (c:Company {id: $c})
        MERGE (p)-[:WORKS_AT]->(c)
      `, rel);
    }
    console.log(`  ✓ WORKS_AT relationships merged.`);

    // OWNED_BY (Project -> Company) (10+ relationships)
    const ownedBy = [
      { prj: 'proj_1', c: 'comp_1' }, { prj: 'proj_2', c: 'comp_4' },
      { prj: 'proj_3', c: 'comp_1' }, { prj: 'proj_4', c: 'comp_2' },
      { prj: 'proj_5', c: 'comp_3' }, { prj: 'proj_6', c: 'comp_6' },
      { prj: 'proj_7', c: 'comp_2' }, { prj: 'proj_8', c: 'comp_6' },
      { prj: 'proj_9', c: 'comp_4' }, { prj: 'proj_10', c: 'comp_5' }
    ];
    for (const rel of ownedBy) {
      await runQuery(`
        MATCH (prj:Project {id: $prj}), (c:Company {id: $c})
        MERGE (prj)-[:OWNED_BY]->(c)
      `, rel);
    }
    console.log(`  ✓ OWNED_BY relationships merged.`);

    // REQUIRES (Project -> Skill) (35+ relationships)
    const requiresSkills = [
      // SkillConnect
      { prj: 'proj_1', s: 'skill_2' }, { prj: 'proj_1', s: 'skill_3' }, { prj: 'proj_1', s: 'skill_4' }, { prj: 'proj_1', s: 'skill_5' }, { prj: 'proj_1', s: 'skill_11' }, { prj: 'proj_1', s: 'skill_12' },
      // RoadRescue
      { prj: 'proj_2', s: 'skill_1' }, { prj: 'proj_2', s: 'skill_4' }, { prj: 'proj_2', s: 'skill_5' }, { prj: 'proj_2', s: 'skill_9' },
      // AI Internship Engine
      { prj: 'proj_3', s: 'skill_6' }, { prj: 'proj_3', s: 'skill_7' }, { prj: 'proj_3', s: 'skill_8' }, { prj: 'proj_3', s: 'skill_12' }, { prj: 'proj_3', s: 'skill_17' },
      // GraphViz Studio
      { prj: 'proj_4', s: 'skill_3' }, { prj: 'proj_4', s: 'skill_4' }, { prj: 'proj_4', s: 'skill_11' }, { prj: 'proj_4', s: 'skill_12' },
      // CloudMetrics Engine
      { prj: 'proj_5', s: 'skill_13' }, { prj: 'proj_5', s: 'skill_14' }, { prj: 'proj_5', s: 'skill_5' }, { prj: 'proj_5', s: 'skill_18' },
      // FinPulse Core
      { prj: 'proj_6', s: 'skill_1' }, { prj: 'proj_6', s: 'skill_9' }, { prj: 'proj_6', s: 'skill_18' }, { prj: 'proj_6', s: 'skill_19' },
      // NeuroSearch
      { prj: 'proj_7', s: 'skill_6' }, { prj: 'proj_7', s: 'skill_7' }, { prj: 'proj_7', s: 'skill_11' }, { prj: 'proj_7', s: 'skill_12' },
      // CyberShield Guard
      { prj: 'proj_8', s: 'skill_1' }, { prj: 'proj_8', s: 'skill_3' }, { prj: 'proj_8', s: 'skill_18' },
      // EduConnect Platform
      { prj: 'proj_9', s: 'skill_2' }, { prj: 'proj_9', s: 'skill_4' }, { prj: 'proj_9', s: 'skill_10' }, { prj: 'proj_9', s: 'skill_17' },
      // SupplyGraph Hub
      { prj: 'proj_10', s: 'skill_11' }, { prj: 'proj_10', s: 'skill_12' }, { prj: 'proj_10', s: 'skill_5' },
      // BioGen Analytics
      { prj: 'proj_11', s: 'skill_6' }, { prj: 'proj_11', s: 'skill_7' }, { prj: 'proj_11', s: 'skill_19' },
      // OmniChat Assistant
      { prj: 'proj_12', s: 'skill_6' }, { prj: 'proj_12', s: 'skill_8' }, { prj: 'proj_12', s: 'skill_20' }
    ];
    for (const rel of requiresSkills) {
      await runQuery(`
        MATCH (prj:Project {id: $prj}), (s:Skill {id: $s})
        MERGE (prj)-[:REQUIRES]->(s)
      `, rel);
    }
    console.log(`  ✓ REQUIRES relationships merged.`);

    // HAS_SKILL (Person -> Skill) (60+ relationships)
    const hasSkills = [
      // Sai Pranav
      { p: 'person_1', s: 'skill_2' }, { p: 'person_1', s: 'skill_3' }, { p: 'person_1', s: 'skill_4' }, { p: 'person_1', s: 'skill_5' }, { p: 'person_1', s: 'skill_11' }, { p: 'person_1', s: 'skill_12' }, { p: 'person_1', s: 'skill_17' },
      // Ananya Sharma
      { p: 'person_2', s: 'skill_6' }, { p: 'person_2', s: 'skill_7' }, { p: 'person_2', s: 'skill_8' }, { p: 'person_2', s: 'skill_11' }, { p: 'person_2', s: 'skill_12' },
      // Rohan Mehta
      { p: 'person_3', s: 'skill_13' }, { p: 'person_3', s: 'skill_14' }, { p: 'person_3', s: 'skill_15' }, { p: 'person_3', s: 'skill_18' },
      // Priya Nair
      { p: 'person_4', s: 'skill_2' }, { p: 'person_4', s: 'skill_4' }, { p: 'person_4', s: 'skill_15' }, { p: 'person_4', s: 'skill_16' },
      // Vikramaditya Singh
      { p: 'person_5', s: 'skill_1' }, { p: 'person_5', s: 'skill_11' }, { p: 'person_5', s: 'skill_12' }, { p: 'person_5', s: 'skill_18' }, { p: 'person_5', s: 'skill_19' },
      // Kavya Reddy
      { p: 'person_6', s: 'skill_3' }, { p: 'person_6', s: 'skill_5' }, { p: 'person_6', s: 'skill_10' }, { p: 'person_6', s: 'skill_17' },
      // Arjun Verma
      { p: 'person_7', s: 'skill_6' }, { p: 'person_7', s: 'skill_9' }, { p: 'person_7', s: 'skill_19' },
      // Sneha Patel
      { p: 'person_8', s: 'skill_1' }, { p: 'person_8', s: 'skill_3' }, { p: 'person_8', s: 'skill_4' },
      // Aditya Gupta
      { p: 'person_9', s: 'skill_18' }, { p: 'person_9', s: 'skill_9' }, { p: 'person_9', s: 'skill_14' },
      // Diya Sen
      { p: 'person_10', s: 'skill_11' }, { p: 'person_10', s: 'skill_12' }, { p: 'person_10', s: 'skill_9' },
      // Rahul Joshi
      { p: 'person_11', s: 'skill_13' }, { p: 'person_11', s: 'skill_14' }, { p: 'person_11', s: 'skill_5' },
      // Isha Deshmukh
      { p: 'person_12', s: 'skill_4' }, { p: 'person_12', s: 'skill_3' }, { p: 'person_12', s: 'skill_20' },
      // Karan Malhotra
      { p: 'person_13', s: 'skill_1' }, { p: 'person_13', s: 'skill_9' }, { p: 'person_13', s: 'skill_18' }, { p: 'person_13', s: 'skill_19' },
      // Meera Rao
      { p: 'person_14', s: 'skill_2' }, { p: 'person_14', s: 'skill_4' }, { p: 'person_14', s: 'skill_20' },
      // Siddharth Roy
      { p: 'person_15', s: 'skill_6' }, { p: 'person_15', s: 'skill_7' }, { p: 'person_15', s: 'skill_8' },
      // Tanvi Agarwal
      { p: 'person_16', s: 'skill_4' }, { p: 'person_16', s: 'skill_5' }, { p: 'person_16', s: 'skill_17' }, { p: 'person_16', s: 'skill_19' },
      // Varun Kulkarni
      { p: 'person_17', s: 'skill_13' }, { p: 'person_17', s: 'skill_14' }, { p: 'person_17', s: 'skill_15' },
      // Pooja Bhatia
      { p: 'person_18', s: 'skill_9' }, { p: 'person_18', s: 'skill_10' }, { p: 'person_18', s: 'skill_11' }, { p: 'person_18', s: 'skill_12' },
      // Aarav Choudhury
      { p: 'person_19', s: 'skill_2' }, { p: 'person_19', s: 'skill_3' }, { p: 'person_19', s: 'skill_4' },
      // Ritu Kapoor
      { p: 'person_20', s: 'skill_1' }, { p: 'person_20', s: 'skill_3' }, { p: 'person_20', s: 'skill_5' },
      // Devansh Saxena
      { p: 'person_21', s: 'skill_6' }, { p: 'person_21', s: 'skill_8' }, { p: 'person_21', s: 'skill_12' },
      // Shreya Chatterjee
      { p: 'person_22', s: 'skill_15' }, { p: 'person_22', s: 'skill_16' }, { p: 'person_22', s: 'skill_18' }
    ];
    for (const rel of hasSkills) {
      await runQuery(`
        MATCH (p:Person {id: $p}), (s:Skill {id: $s})
        MERGE (p)-[:HAS_SKILL]->(s)
      `, rel);
    }
    console.log(`  ✓ HAS_SKILL relationships merged.`);

    // WORKED_ON (Person -> Project) (35+ relationships)
    const workedOn = [
      { p: 'person_1', prj: 'proj_1' }, { p: 'person_1', prj: 'proj_3' },
      { p: 'person_2', prj: 'proj_3' }, { p: 'person_2', prj: 'proj_7' }, { p: 'person_2', prj: 'proj_12' },
      { p: 'person_3', prj: 'proj_5' }, { p: 'person_4', prj: 'proj_1' }, { p: 'person_4', prj: 'proj_9' },
      { p: 'person_5', prj: 'proj_1' }, { p: 'person_5', prj: 'proj_4' }, { p: 'person_5', prj: 'proj_7' },
      { p: 'person_6', prj: 'proj_1' }, { p: 'person_6', prj: 'proj_9' },
      { p: 'person_7', prj: 'proj_3' }, { p: 'person_7', prj: 'proj_11' },
      { p: 'person_8', prj: 'proj_2' }, { p: 'person_8', prj: 'proj_9' },
      { p: 'person_9', prj: 'proj_8' }, { p: 'person_9', prj: 'proj_6' },
      { p: 'person_10', prj: 'proj_4' }, { p: 'person_10', prj: 'proj_10' },
      { p: 'person_11', prj: 'proj_5' }, { p: 'person_12', prj: 'proj_4' },
      { p: 'person_13', prj: 'proj_2' }, { p: 'person_13', prj: 'proj_6' },
      { p: 'person_14', prj: 'proj_1' }, { p: 'person_15', prj: 'proj_3' }, { p: 'person_15', prj: 'proj_12' },
      { p: 'person_16', prj: 'proj_1' }, { p: 'person_17', prj: 'proj_5' },
      { p: 'person_18', prj: 'proj_10' }, { p: 'person_19', prj: 'proj_4' },
      { p: 'person_20', prj: 'proj_6' }, { p: 'person_21', prj: 'proj_7' }, { p: 'person_22', prj: 'proj_8' }
    ];
    for (const rel of workedOn) {
      await runQuery(`
        MATCH (p:Person {id: $p}), (prj:Project {id: $prj})
        MERGE (p)-[:WORKED_ON]->(prj)
      `, rel);
    }
    console.log(`  ✓ WORKED_ON relationships merged.`);

    // KNOWS (Person -> Person) (20+ relationships)
    const knowsList = [
      { p1: 'person_1', p2: 'person_2' }, { p1: 'person_1', p2: 'person_4' }, { p1: 'person_1', p2: 'person_5' }, { p1: 'person_1', p2: 'person_6' },
      { p1: 'person_2', p2: 'person_7' }, { p1: 'person_2', p2: 'person_15' }, { p1: 'person_2', p2: 'person_21' },
      { p1: 'person_3', p2: 'person_11' }, { p1: 'person_3', p2: 'person_17' },
      { p1: 'person_4', p2: 'person_14' }, { p1: 'person_4', p2: 'person_19' },
      { p1: 'person_5', p2: 'person_10' }, { p1: 'person_5', p2: 'person_18' },
      { p1: 'person_6', p2: 'person_16' }, { p1: 'person_8', p2: 'person_13' },
      { p1: 'person_9', p2: 'person_22' }, { p1: 'person_10', p2: 'person_12' },
      { p1: 'person_13', p2: 'person_20' }, { p1: 'person_15', p2: 'person_21' }
    ];
    for (const rel of knowsList) {
      await runQuery(`
        MATCH (p1:Person {id: $p1}), (p2:Person {id: $p2})
        MERGE (p1)-[:KNOWS]->(p2)
      `, rel);
    }
    console.log(`  ✓ KNOWS relationships merged.`);

    console.log('----------------------------------------------------');
    console.log('🎉 Seed completed successfully! All data present in CognoDB.');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await closeDriver();
  }
};

seedData();
