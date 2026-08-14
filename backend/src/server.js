import app from './app.js';
import { verifyConnection, closeDriver } from './config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log('----------------------------------------------------');
  console.log('🚀 Starting SkillConnect Backend Server...');
  console.log('----------------------------------------------------');

  // Verify connection to CognoDB
  const dbStatus = await verifyConnection();
  if (!dbStatus.connected) {
    console.warn('⚠️ WARNING: Could not connect to CognoDB Cloud instance.');
    console.warn(`Reason: ${dbStatus.error}`);
    console.warn('Ensure your COGNODB_URI, COGNODB_USERNAME, and COGNODB_PASSWORD in backend/.env are accurate.');
  }

  const server = app.listen(PORT, () => {
    console.log(`✅ SkillConnect API active on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log('----------------------------------------------------');
  });

  // Graceful shutdown handling
  const shutdown = async () => {
    console.log('\nShutting down server gracefully...');
    server.close(async () => {
      await closeDriver();
      console.log('Server process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
