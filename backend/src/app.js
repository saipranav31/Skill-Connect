import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import healthRoutes from './routes/health.js';
import peopleRoutes from './routes/people.js';
import skillsRoutes from './routes/skills.js';
import projectsRoutes from './routes/projects.js';
import companiesRoutes from './routes/companies.js';
import searchRoutes from './routes/search.js';
import recommendationsRoutes from './routes/recommendations.js';
import graphRoutes from './routes/graph.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', healthRoutes);
app.use('/api/people', peopleRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/graph', graphRoutes);

// Root endpoint info
app.get('/', (req, res) => {
  res.json({
    app: 'SkillConnect Backend API',
    tagline: 'Discover people, skills and projects through connected data',
    database: 'CognoDB (Neo4j Bolt Protocol)',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
