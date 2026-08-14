import { runQuery } from '../config/database.js';
import * as queries from '../queries/cypherQueries.js';
import { cryptoNativeId } from '../utils/idGenerator.js';

export const getAllCompanies = async (req, res) => {
  const records = await runQuery(queries.GET_ALL_COMPANIES);
  const companies = records.map(record => {
    const c = record.get('c').properties;
    const employees = (record.get('employees') || []).map(p => p.properties);
    const projects = (record.get('projects') || []).map(prj => prj.properties);
    return { ...c, employees, projects };
  });
  res.json(companies);
};

export const getCompanyById = async (req, res) => {
  const { id } = req.params;
  const records = await runQuery(queries.GET_COMPANY_BY_ID, { id });

  if (records.length === 0 || !records[0].get('c')) {
    return res.status(404).json({ error: 'Company not found' });
  }

  const record = records[0];
  const c = record.get('c').properties;
  const employees = (record.get('employees') || []).map(p => p.properties);
  const projects = (record.get('projects') || []).map(prj => prj.properties);

  res.json({ ...c, employees, projects });
};

export const createCompany = async (req, res) => {
  const { name, industry } = req.body;
  if (!name) return res.status(400).json({ error: 'Company name is required' });

  const id = `comp_${cryptoNativeId()}`;
  const records = await runQuery(queries.CREATE_COMPANY, {
    id,
    name: name.trim(),
    industry: (industry || 'Technology').trim()
  });

  res.status(201).json(records[0].get('c').properties);
};
