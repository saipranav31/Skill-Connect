import { runQuery } from '../config/database.js';
import * as queries from '../queries/cypherQueries.js';

export const getPersonRecommendations = async (req, res) => {
  const { personId } = req.params;

  // Verify person exists
  const personCheck = await runQuery(queries.GET_PERSON_BY_ID, { id: personId });
  if (personCheck.length === 0 || !personCheck[0].get('p')) {
    return res.status(404).json({ error: 'Person not found' });
  }

  const person = personCheck[0].get('p').properties;

  // Execute multi-hop Cypher traversal against CognoDB
  const records = await runQuery(queries.MULTI_HOP_RECOMMENDATIONS, { personId });

  const matchingProjects = records.map(record => {
    const project = record.get('prj').properties;
    const company = record.get('c')?.properties || null;
    const matchingSkills = record.get('matchingSkills').map(s => s.properties || s);
    const requiredSkills = record.get('requiredSkills').map(s => s.properties || s);
    const matchedCount = record.get('matchedCount');
    const requiredCount = record.get('requiredCount');
    const matchPercentage = record.get('matchPercentage');

    return {
      project,
      company,
      matchingSkills,
      requiredSkills,
      matchedCount,
      requiredCount,
      matchPercentage
    };
  });

  res.json({
    person,
    matchingProjects
  });
};

export const getAwkwardRelationalComparison = async (req, res) => {
  const { personId } = req.params;
  
  const records = await runQuery(queries.AWKWARD_RELATIONAL_QUERY, { personId });
  
  const recommendations = records.map(r => ({
    collaborator: r.get('collab').properties,
    company: r.get('c')?.properties || null,
    project: r.get('prj').properties,
    sharedSkills: (r.get('sharedSkills') || []).map(s => s.properties),
    sharedSkillCount: r.get('sharedSkillCount')
  }));

  res.json({
    explanation: 'In a Relational SQL database, finding 2-hop collaborator network recommendations requires 5+ INNER JOINs across Person, Person_Skills, Skills_Projects, Projects, and Person_Connections junction tables with severe performance degradation. In CognoDB, Cypher evaluates graph pointer traversals natively in a single query.',
    personId,
    recommendations
  });
};
