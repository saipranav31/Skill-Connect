import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  MapPin, 
  Mail, 
  Code2, 
  FolderGit2, 
  Building2, 
  Sparkles, 
  TrendingUp, 
  Share2, 
  ArrowLeft,
  Info,
  CheckCircle2
} from 'lucide-react';
import DbErrorBanner from '../components/DbErrorBanner';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getPersonById, getPersonRecommendations, getAwkwardRelationalComparison } from '../services/api';

export default function PersonDetailPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [relationalComparison, setRelationalComparison] = useState(null);

  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const fetchPersonData = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const [personRes, recRes, awkwardRes] = await Promise.all([
        getPersonById(id),
        getPersonRecommendations(id),
        getAwkwardRelationalComparison(id)
      ]);

      setPerson(personRes.data);
      setRecommendations(recRes.data);
      setRelationalComparison(awkwardRes.data);
    } catch (err) {
      setDbError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonData();
  }, [id]);

  if (dbError) {
    return <DbErrorBanner error={dbError} onRetry={fetchPersonData} />;
  }

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (!person) {
    return (
      <div className="text-center py-16 glass-panel rounded-2xl">
        <h3 className="text-lg font-bold text-white">Person Node Not Found</h3>
        <Link to="/people" className="text-sm text-indigo-400 mt-2 inline-block">Return to directory</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Back Button */}
      <Link to="/people" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to People Directory
      </Link>

      {/* Person Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-950">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-extrabold text-2xl">
                {person.name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">{person.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-300 font-mono mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {person.location}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {person.email}</span>
                  {person.company && (
                    <span className="flex items-center gap-1 text-rose-300"><Building2 className="w-3.5 h-3.5" /> Works at {person.company.name}</span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl pt-2">{person.bio}</p>
          </div>

          <Link
            to="/graph"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0"
          >
            <Share2 className="w-4 h-4" /> Inspect in Graph Explorer
          </Link>
        </div>
      </div>

      {/* Graph Multi-Hop Recommendations Section (Crucial Feature) */}
      <section className="glass-panel p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Multi-Hop Cypher Recommendation Query
            </div>
            <h2 className="text-2xl font-black text-white">Recommended Projects for {person.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluated via graph path: <code className="text-indigo-300 font-mono">(Person)-[:HAS_SKILL]-&gt;(Skill)&lt;-[:REQUIRES]-(Project)</code>
            </p>
          </div>
        </div>

        {recommendations?.matchingProjects?.length === 0 ? (
          <p className="text-sm text-slate-400">No project skill matches found for this person yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations?.matchingProjects?.map((rec, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> {rec.matchPercentage}% Match
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{rec.matchedCount} / {rec.requiredCount} Skills</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{rec.project.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{rec.project.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <p className="text-[11px] font-semibold uppercase text-slate-400">Matched Skills in Graph:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.matchingSkills.map((s, i) => (
                      <span key={i} className="text-xs px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                        {s.name || s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Relational vs Graph Awkwardness Demo Section */}
      {relationalComparison && relationalComparison.recommendations?.length > 0 && (
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
            <Info className="w-4 h-4" /> Graph Database Advantage Showcase
          </div>
          <h3 className="text-lg font-bold text-white">Collaborator Network Recommendations (2-Hop Traversal)</h3>
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
            {relationalComparison.explanation}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relationalComparison.recommendations.map((item, idx) => (
              <div key={idx} className="glass-card p-4 rounded-xl border border-slate-800/80 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200">{item.collaborator.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {item.sharedSkillCount} Shared Skills
                  </span>
                </div>
                <p className="text-slate-400">Project: <strong className="text-white">{item.project.name}</strong></p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Direct Graph Relationships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Person's Skills */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" /> Possessed Skills (-[:HAS_SKILL]-&gt;)
          </h3>

          <div className="flex flex-wrap gap-2">
            {person.skills?.map(s => (
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

        {/* Person's Worked-On Projects */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-amber-400" /> Worked-On Projects (-[:WORKED_ON]-&gt;)
          </h3>

          <div className="space-y-3">
            {person.projects?.map(prj => (
              <Link
                key={prj.id}
                to={`/projects/${prj.id}`}
                className="glass-card p-4 rounded-xl border border-slate-800/80 block hover:border-amber-500/40 transition-all"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white">{prj.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">
                    {prj.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prj.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
