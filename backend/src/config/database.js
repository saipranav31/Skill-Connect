import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

let driver = null;

export const getDriver = () => {
  if (driver) return driver;

  const uri = process.env.COGNODB_URI || 'bolt://localhost:7687';
  const username = process.env.COGNODB_USERNAME || 'cognodb';
  const password = process.env.COGNODB_PASSWORD || '';

  try {
    // Official Neo4j/CognoDB driver options
    // Note: bolt+s:// automatically configures encryption, so we don't pass encrypted setting in config
    driver = neo4j.driver(
      uri,
      neo4j.auth.basic(username, password),
      {
        maxConnectionLifetime: 3 * 60 * 60 * 1000,
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 30000, // 30 seconds
        disableLosslessIntegers: true
      }
    );
    return driver;
  } catch (error) {
    console.error('[CognoDB Driver Initialization Failed]:', error.message);
    throw error;
  }
};

export const verifyConnection = async () => {
  try {
    const drv = getDriver();
    const serverInfo = await drv.verifyConnectivity();
    console.log(`[CognoDB] Connected successfully to ${serverInfo.address} (${serverInfo.agent})`);
    return { connected: true, address: serverInfo.address, agent: serverInfo.agent };
  } catch (error) {
    console.error('[CognoDB Connection Check Failed]:', error.message);
    return { connected: false, error: error.message };
  }
};

export const runQuery = async (cypher, params = {}) => {
  const drv = getDriver();
  const session = drv.session();
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } catch (error) {
    console.error('[Cypher Execution Error]:', error.message);
    throw error;
  } finally {
    await session.close();
  }
};

export const closeDriver = async () => {
  if (driver) {
    await driver.close();
    driver = null;
    console.log('[CognoDB] Driver closed.');
  }
};
