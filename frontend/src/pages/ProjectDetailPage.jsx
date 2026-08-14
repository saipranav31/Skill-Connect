import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FolderGit2, Code2, Users, Building2, ArrowLeft } from 'lucide-react';
import DbErrorBanner from '../components/DbErrorBanner';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getProjectById } from '../services/api';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const fetchProjectData = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const res = await getProjectById(id);
      setProject(res.data);
    } catch (err) {
      setDbError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  if (dbError) return <DbErrorBanner error={dbError} onRetry={fetchProjectData} />;
  if (loading) return <LoadingSkeleton count={2} />;

  if (!project) {
    return (
      <div className="text-center py-16 glass-panel rounded-2xl">
        <h3 className="text-lg font-bold text-white">Project Node Not Found</h3>
        <Link to="/projects" className="text-sm text-indigo-400 mt-2 inline-block">Return to directory</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Projects Directory
      </Link>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-950">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {project.category || 'General'}
          </span>
          <span className="text-xs font-mono text-emerald-400">Status: {project.status}</span>
          {project.company && (
            <span className="text-xs font-mono text-rose-300 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Owned by {project.company.name}
            </span>
          )}
        </div>

        <h1 className="text-4xl font-black text-white">{project.name}</h1>
        <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-3xl">{project.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Required Skills */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" /> Required Skills (-[:REQUIRES]-&gt;)
          </h3>

          <div className="flex flex-wrap gap-2">
            {project.requiredSkills?.map(s => (
              <Link
                key={s.id}
                to={`/skills/${s.id}`}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{s.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({s.level})</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Team Members */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Team Members (&lt;-[:WORKED_ON]-)
          </h3>

          {project.team?.length === 0 ? (
            <p className="text-xs text-slate-400">No team members linked to this project node yet.</p>
          ) : (
            <div className="space-y-3">
              {project.team.map(p => (
                <Link
                  key={p.id}
                  to={`/people/${p.id}`}
                  className="glass-card p-4 rounded-xl border border-slate-800/80 block hover:border-indigo-500/40 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    <span className="text-xs text-indigo-300 font-mono">{p.location}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.bio}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
