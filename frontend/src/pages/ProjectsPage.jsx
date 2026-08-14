import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Search, Plus, ArrowRight, Code2, Users, Building2 } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import DbErrorBanner from '../components/DbErrorBanner';
import { getProjects } from '../services/api';

export default function ProjectsPage({ onOpenCreateProject }) {
  const [projects, setProjects] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      setDbError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.name?.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (dbError) return <DbErrorBanner error={dbError} onRetry={fetchProjects} />;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <FolderGit2 className="w-8 h-8 text-amber-400" /> Projects Directory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Projects, technical requirement nodes, and contributing engineers.
          </p>
        </div>

        <button
          onClick={onOpenCreateProject}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Project Node
        </button>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter by project name, category or description..."
          value={filterQuery}
          onChange={e => setFilterQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
      </div>

      {loading ? (
        <LoadingSkeleton count={6} />
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800">
          <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No Project Nodes Found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(p => (
            <div key={p.id} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {p.category || 'General'}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">{p.status}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{p.description}</p>

                {/* Required Skills Badges */}
                {p.requiredSkills && p.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {p.requiredSkills.slice(0, 4).map((s, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                        {s.name}
                      </span>
                    ))}
                    {p.requiredSkills.length > 4 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        +{p.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5" /> {p.requiredSkills?.length || 0}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {p.team?.length || 0}</span>
                </div>

                <Link
                  to={`/projects/${p.id}`}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  Project Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
