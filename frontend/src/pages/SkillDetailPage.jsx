import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Code2, Users, FolderGit2, ArrowLeft, ArrowRight } from 'lucide-react';
import DbErrorBanner from '../components/DbErrorBanner';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getSkillById } from '../services/api';

export default function SkillDetailPage() {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const fetchSkillData = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const res = await getSkillById(id);
      setSkill(res.data);
    } catch (err) {
      setDbError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillData();
  }, [id]);

  if (dbError) return <DbErrorBanner error={dbError} onRetry={fetchSkillData} />;
  if (loading) return <LoadingSkeleton count={2} />;

  if (!skill) {
    return (
      <div className="text-center py-16 glass-panel rounded-2xl">
        <h3 className="text-lg font-bold text-white">Skill Node Not Found</h3>
        <Link to="/skills" className="text-sm text-indigo-400 mt-2 inline-block">Return to catalog</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <Link to="/skills" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Skills Catalog
      </Link>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-950">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {skill.category || 'General'}
          </span>
          <span className="text-xs font-mono text-slate-400">Level: {skill.level}</span>
        </div>
        <h1 className="text-4xl font-black text-white">{skill.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* People possessing skill */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> People Possessing {skill.name} (&lt;-[:HAS_SKILL]-)
          </h3>

          {skill.people?.length === 0 ? (
            <p className="text-xs text-slate-400">No people linked to this skill node yet.</p>
          ) : (
            <div className="space-y-3">
              {skill.people.map(p => (
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

        {/* Projects requiring skill */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-amber-400" /> Projects Requiring {skill.name} (-[:REQUIRES]-&gt;)
          </h3>

          {skill.projects?.length === 0 ? (
            <p className="text-xs text-slate-400">No projects currently require this skill node.</p>
          ) : (
            <div className="space-y-3">
              {skill.projects.map(prj => (
                <Link
                  key={prj.id}
                  to={`/projects/${prj.id}`}
                  className="glass-card p-4 rounded-xl border border-slate-800/80 block hover:border-amber-500/40 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white">{prj.name}</h4>
                    <span className="text-xs text-amber-300 font-mono">{prj.status}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prj.description}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
