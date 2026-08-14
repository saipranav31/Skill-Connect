import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Search, Plus, ArrowRight, Users, FolderGit2 } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import DbErrorBanner from '../components/DbErrorBanner';
import { getSkills } from '../services/api';

export default function SkillsPage({ onOpenCreateSkill }) {
  const [skills, setSkills] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const fetchSkills = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const res = await getSkills();
      setSkills(res.data);
    } catch (err) {
      setDbError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const filteredSkills = skills.filter(s => 
    s.name?.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.category?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (dbError) {
    return <DbErrorBanner error={dbError} onRetry={fetchSkills} />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Code2 className="w-8 h-8 text-emerald-400" /> Skills Catalog
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Technical skills and proficiency nodes across the graph network.
          </p>
        </div>

        <button
          onClick={onOpenCreateSkill}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Skill Node
        </button>
      </div>

      {/* Filter Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter by skill name or category..."
          value={filterQuery}
          onChange={e => setFilterQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : filteredSkills.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800">
          <Code2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No Skill Nodes Found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSkills.map(s => (
            <div key={s.id} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {s.category || 'General'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{s.level}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{s.name}</h3>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {s.peopleCount || 0}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><FolderGit2 className="w-3.5 h-3.5" /> {s.projectsCount || 0}</span>
                </div>

                <Link
                  to={`/skills/${s.id}`}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  Inspect <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
