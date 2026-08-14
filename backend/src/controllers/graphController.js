import { runQuery } from '../config/database.js';
import * as queries from '../queries/cypherQueries.js';

export const getGraphStats = async (req, res) => {
  const records = await runQuery(queries.GET_GRAPH_STATS);
  if (records.length === 0) {
    return res.json({ people: 0, skills: 0, projects: 0, companies: 0, relationships: 0 });
  }
  res.json(records[0].get('stats'));
};

export const getFullGraph = async (req, res) => {
  const records = await runQuery(queries.GET_FULL_GRAPH_DATA);

  const nodesMap = new Map();
  const edges = [];

  records.forEach(r => {
    const nodeA = r.get('n');
    const typeA = r.get('nodeType');
    const rel = r.get('r');
    const relType = r.get('relType');
    const nodeB = r.get('m');
    const typeB = r.get('targetType');

    if (nodeA && nodeA.properties?.id) {
      nodesMap.set(nodeA.properties.id, {
        id: nodeA.properties.id,
        label: nodeA.properties.name || nodeA.properties.id,
        type: typeA,
        properties: nodeA.properties
      });
    }

    if (nodeB && nodeB.properties?.id) {
      nodesMap.set(nodeB.properties.id, {
        id: nodeB.properties.id,
        label: nodeB.properties.name || nodeB.properties.id,
        type: typeB,
        properties: nodeB.properties
      });
    }

    if (rel && nodeA?.properties?.id && nodeB?.properties?.id) {
      edges.push({
        id: `${nodeA.properties.id}-${relType}-${nodeB.properties.id}`,
        source: nodeA.properties.id,
        target: nodeB.properties.id,
        type: relType
      });
    }
  });

  res.json({
    nodes: Array.from(nodesMap.values()),
    edges
  });
};
