/**
 * Parameterized Cypher Queries for SkillConnect
 * All user inputs are safely passed as parameters ($personId, $skillId, $q, etc.)
 */

// Dashboard Statistics & Counts
export const GET_GRAPH_STATS = `
  MATCH (p:Person) WITH count(p) AS totalPeople
  MATCH (s:Skill) WITH totalPeople, count(s) AS totalSkills
  MATCH (prj:Project) WITH totalPeople, totalSkills, count(prj) AS totalProjects
  MATCH (c:Company) WITH totalPeople, totalSkills, totalProjects, count(c) AS totalCompanies
  MATCH ()-[r]->() WITH totalPeople, totalSkills, totalProjects, totalCompanies, count(r) AS totalRelationships
  RETURN {
    people: totalPeople,
    skills: totalSkills,
    projects: totalProjects,
    companies: totalCompanies,
    relationships: totalRelationships
  } AS stats
`;

// Person Queries
export const GET_ALL_PEOPLE = `
  MATCH (p:Person)
  OPTIONAL MATCH (p)-[:HAS_SKILL]->(s:Skill)
  OPTIONAL MATCH (p)-[:WORKED_ON]->(prj:Project)
  RETURN p, collect(DISTINCT s) AS skills, collect(DISTINCT prj) AS projects
  ORDER BY p.name ASC
`;

export const GET_PERSON_BY_ID = `
  MATCH (p:Person {id: $id})
  OPTIONAL MATCH (p)-[:HAS_SKILL]->(s:Skill)
  OPTIONAL MATCH (p)-[:WORKED_ON]->(prj:Project)
  OPTIONAL MATCH (p)-[:WORKS_AT]->(c:Company)
  OPTIONAL MATCH (p)-[:KNOWS]-(k:Person)
  RETURN p, 
         collect(DISTINCT s) AS skills, 
         collect(DISTINCT prj) AS projects, 
         c AS company, 
         collect(DISTINCT k) AS network
`;

export const CREATE_PERSON = `
  CREATE (p:Person {
    id: $id,
    name: $name,
    email: $email,
    location: $location,
    bio: $bio,
    createdAt: datetime()
  })
  RETURN p
`;

export const UPDATE_PERSON = `
  MATCH (p:Person {id: $id})
  SET p.name = $name,
      p.email = $email,
      p.location = $location,
      p.bio = $bio
  RETURN p
`;

export const DELETE_PERSON = `
  MATCH (p:Person {id: $id})
  DETACH DELETE p
  RETURN true AS deleted
`;

// Skill Queries
export const GET_ALL_SKILLS = `
  MATCH (s:Skill)
  OPTIONAL MATCH (p:Person)-[:HAS_SKILL]->(s)
  OPTIONAL MATCH (prj:Project)-[:REQUIRES]->(s)
  RETURN s, count(DISTINCT p) AS peopleCount, count(DISTINCT prj) AS projectsCount
  ORDER BY s.name ASC
`;

export const GET_SKILL_BY_ID = `
  MATCH (s:Skill {id: $id})
  OPTIONAL MATCH (p:Person)-[:HAS_SKILL]->(s)
  OPTIONAL MATCH (prj:Project)-[:REQUIRES]->(s)
  RETURN s, collect(DISTINCT p) AS people, collect(DISTINCT prj) AS projects
`;

export const CREATE_SKILL = `
  CREATE (s:Skill {
    id: $id,
    name: $name,
    category: $category,
    level: $level,
    createdAt: datetime()
  })
  RETURN s
`;

export const UPDATE_SKILL = `
  MATCH (s:Skill {id: $id})
  SET s.name = $name,
      s.category = $category,
      s.level = $level
  RETURN s
`;

export const DELETE_SKILL = `
  MATCH (s:Skill {id: $id})
  DETACH DELETE s
  RETURN true AS deleted
`;

// Project Queries
export const GET_ALL_PROJECTS = `
  MATCH (prj:Project)
  OPTIONAL MATCH (prj)-[:REQUIRES]->(s:Skill)
  OPTIONAL MATCH (p:Person)-[:WORKED_ON]->(prj)
  OPTIONAL MATCH (prj)-[:OWNED_BY]->(c:Company)
  RETURN prj, collect(DISTINCT s) AS requiredSkills, collect(DISTINCT p) AS team, c AS company
  ORDER BY prj.name ASC
`;

export const GET_PROJECT_BY_ID = `
  MATCH (prj:Project {id: $id})
  OPTIONAL MATCH (prj)-[:REQUIRES]->(s:Skill)
  OPTIONAL MATCH (p:Person)-[:WORKED_ON]->(prj)
  OPTIONAL MATCH (prj)-[:OWNED_BY]->(c:Company)
  RETURN prj, collect(DISTINCT s) AS requiredSkills, collect(DISTINCT p) AS team, c AS company
`;

export const CREATE_PROJECT = `
  CREATE (prj:Project {
    id: $id,
    name: $name,
    description: $description,
    category: $category,
    status: $status,
    createdAt: datetime()
  })
  RETURN prj
`;

export const UPDATE_PROJECT = `
  MATCH (prj:Project {id: $id})
  SET prj.name = $name,
      prj.description = $description,
      prj.category = $category,
      prj.status = $status
  RETURN prj
`;

export const DELETE_PROJECT = `
  MATCH (prj:Project {id: $id})
  DETACH DELETE prj
  RETURN true AS deleted
`;

// Company Queries
export const GET_ALL_COMPANIES = `
  MATCH (c:Company)
  OPTIONAL MATCH (p:Person)-[:WORKS_AT]->(c)
  OPTIONAL MATCH (prj:Project)-[:OWNED_BY]->(c)
  RETURN c, collect(DISTINCT p) AS employees, collect(DISTINCT prj) AS projects
  ORDER BY c.name ASC
`;

export const GET_COMPANY_BY_ID = `
  MATCH (c:Company {id: $id})
  OPTIONAL MATCH (p:Person)-[:WORKS_AT]->(c)
  OPTIONAL MATCH (prj:Project)-[:OWNED_BY]->(c)
  RETURN c, collect(DISTINCT p) AS employees, collect(DISTINCT prj) AS projects
`;

export const CREATE_COMPANY = `
  CREATE (c:Company {
    id: $id,
    name: $name,
    industry: $industry,
    createdAt: datetime()
  })
  RETURN c
`;

// Specific Graph Traversal Endpoints (Query 1, 2, 3, 4)
export const GET_PERSON_SKILLS = `
  MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(s:Skill)
  RETURN p, s
`;

export const GET_PERSON_PROJECTS = `
  MATCH (p:Person {id: $personId})-[:WORKED_ON]->(prj:Project)
  RETURN prj
`;

export const GET_SKILL_PEOPLE = `
  MATCH (p:Person)-[:HAS_SKILL]->(s:Skill {id: $skillId})
  RETURN p
`;

export const GET_SKILL_PROJECTS = `
  MATCH (prj:Project)-[:REQUIRES]->(s:Skill {id: $skillId})
  RETURN prj
`;

export const GET_PROJECT_SKILLS = `
  MATCH (prj:Project {id: $projectId})-[:REQUIRES]->(s:Skill)
  RETURN s
`;

// Relationship Creation helpers
export const CONNECT_PERSON_SKILL = `
  MATCH (p:Person {id: $personId})
  MATCH (s:Skill {id: $skillId})
  MERGE (p)-[r:HAS_SKILL]->(s)
  RETURN r
`;

export const CONNECT_PERSON_PROJECT = `
  MATCH (p:Person {id: $personId})
  MATCH (prj:Project {id: $projectId})
  MERGE (p)-[r:WORKED_ON]->(prj)
  RETURN r
`;

export const CONNECT_PROJECT_SKILL = `
  MATCH (prj:Project {id: $projectId})
  MATCH (s:Skill {id: $skillId})
  MERGE (prj)-[r:REQUIRES]->(s)
  RETURN r
`;

export const CONNECT_PERSON_COMPANY = `
  MATCH (p:Person {id: $personId})
  MATCH (c:Company {id: $companyId})
  MERGE (p)-[r:WORKS_AT]->(c)
  RETURN r
`;

export const CONNECT_PERSON_KNOWS_PERSON = `
  MATCH (p1:Person {id: $personId1})
  MATCH (p2:Person {id: $personId2})
  WHERE p1.id <> p2.id
  MERGE (p1)-[r:KNOWS]->(p2)
  RETURN r
`;

// Multi-Hop Recommendation Cypher Query (Query 5)
// Person -> HAS_SKILL -> Skill <- REQUIRES <- Project
export const MULTI_HOP_RECOMMENDATIONS = `
  MATCH (p:Person {id: $personId})
  MATCH (p)-[:HAS_SKILL]->(userSkill:Skill)<-[:REQUIRES]-(prj:Project)
  MATCH (prj)-[:REQUIRES]->(allReqSkill:Skill)
  OPTIONAL MATCH (prj)-[:OWNED_BY]->(c:Company)
  WITH p, prj, c,
       collect(DISTINCT userSkill) AS matchedSkillsList,
       collect(DISTINCT allReqSkill) AS requiredSkillsList
  WITH p, prj, c, matchedSkillsList, requiredSkillsList,
       size(matchedSkillsList) AS matchedCount,
       size(requiredSkillsList) AS requiredCount
  RETURN prj, c,
         matchedSkillsList AS matchingSkills,
         requiredSkillsList AS requiredSkills,
         matchedCount,
         requiredCount,
         round((toFloat(matchedCount) / toFloat(requiredCount)) * 100) AS matchPercentage
  ORDER BY matchPercentage DESC, matchedCount DESC
`;

// Awkward Relational Comparison Query (Demonstrating Graph Superiority over SQL JOINs)
// Traverses 2+ hops: Person -> KNOWS (1..2 hops) -> Collaborator -> HAS_SKILL -> Skill <- REQUIRES <- Project
export const AWKWARD_RELATIONAL_QUERY = `
  MATCH (p:Person {id: $personId})-[:KNOWS*1..2]-(collab:Person)
  WHERE p.id <> collab.id
  MATCH (collab)-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES]-(prj:Project)
  OPTIONAL MATCH (collab)-[:WORKS_AT]->(c:Company)
  RETURN DISTINCT collab, c, prj, collect(DISTINCT s) AS sharedSkills, count(DISTINCT s) AS sharedSkillCount
  ORDER BY sharedSkillCount DESC
  LIMIT 10
`;

// Parameterized Global Search Query across All Node Types
export const GLOBAL_SEARCH_PEOPLE = `
  MATCH (p:Person)
  WHERE toLower(p.name) CONTAINS toLower($q) 
     OR toLower(p.bio) CONTAINS toLower($q) 
     OR toLower(p.location) CONTAINS toLower($q)
  OPTIONAL MATCH (p)-[:HAS_SKILL]->(s:Skill)
  RETURN p, collect(DISTINCT s) AS skills
  LIMIT 20
`;

export const GLOBAL_SEARCH_SKILLS = `
  MATCH (s:Skill)
  WHERE toLower(s.name) CONTAINS toLower($q) 
     OR toLower(s.category) CONTAINS toLower($q)
  OPTIONAL MATCH (p:Person)-[:HAS_SKILL]->(s)
  RETURN s, count(DISTINCT p) AS peopleCount
  LIMIT 20
`;

export const GLOBAL_SEARCH_PROJECTS = `
  MATCH (prj:Project)
  WHERE toLower(prj.name) CONTAINS toLower($q) 
     OR toLower(prj.description) CONTAINS toLower($q) 
     OR toLower(prj.category) CONTAINS toLower($q)
  OPTIONAL MATCH (prj)-[:REQUIRES]->(s:Skill)
  RETURN prj, collect(DISTINCT s) AS requiredSkills
  LIMIT 20
`;

export const GLOBAL_SEARCH_COMPANIES = `
  MATCH (c:Company)
  WHERE toLower(c.name) CONTAINS toLower($q) 
     OR toLower(c.industry) CONTAINS toLower($q)
  RETURN c
  LIMIT 20
`;

// Visual Graph Explorer Data Fetcher
export const GET_FULL_GRAPH_DATA = `
  MATCH (n)
  OPTIONAL MATCH (n)-[r]->(m)
  RETURN n, labels(n)[0] AS nodeType, r, type(r) AS relType, m, labels(m)[0] AS targetType
  LIMIT 400
`;
