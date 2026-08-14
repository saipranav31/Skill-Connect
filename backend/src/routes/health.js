import express from 'express';
import { verifyConnection } from '../config/database.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  const dbStatus = await verifyConnection();
  res.status(dbStatus.connected ? 200 : 503).json({
    status: dbStatus.connected ? 'ok' : 'error',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'CognoDB (Neo4j Bolt Protocol)',
      connected: dbStatus.connected,
      address: dbStatus.address || null,
      error: dbStatus.error || null
    }
  });
});

export default router;
