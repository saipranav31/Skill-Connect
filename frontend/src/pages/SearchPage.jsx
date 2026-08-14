import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Users, Code2, FolderGit2, Building2, ArrowRight } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import DbErrorBanner from '../components/DbErrorBanner';
import { searchGlobal } from '../services/api';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState({ people: [], skills: [], projects: [], companies: [] });
  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState(null);

  const fetchResults = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setDbError(null);
    try {
      const res = await searchGlobal(query.trim());
      setResults(res.data);
    } catch (err) {
      setDbError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query]);

  if (dbError) return <DbErrorBanner error={dbError} onRetry={fetchResults} />;

  const totalMatches = (results.people?.length || 0) + 
                       (results.skills?.length || 0) + 
                       (results.projects?.length || 0) + 
                       (results.companies?.length || 0);

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Search className="w-8 h-8 text-indigo-400" /> Search Results
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Parameterized Cypher graph search for <strong className="text-white font-mono">"{query}"</strong> ({totalMatches} matches found)
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : totalMatches === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No Matching Graph Nodes</h3>
          <p className="text-sm text-slate-500 mt-1">Try searching for terms like "React", "Sai", "RoadRescue", or "Wexa".</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* People Matches */}
          {results.people?.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" /> Matching People ({results.people.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.people.map(p => (
                  <Link key={p.id} to={`/people/${p.id}`} className="glass-card p-4 rounded-xl border border-slate-800 block hover:border-indigo-500/40">
                    <h3 className="font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-indigo-300 font-mono">{p.location}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{p.bio}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Skill Matches */}
          {results.skills?.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" /> Matching Skills ({results.skills.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {results.skills.map(s => (
                  <Link key={s.id} to={`/skills/${s.id}`} className="glass-card p-4 rounded-xl border border-slate-800 block hover:border-emerald-500/40">
                    <h3 className="font-bold text-white">{s.name}</h3>
                    <p className="text-xs text-emerald-300 font-mono">{s.category} • {s.level}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Project Matches */}
          {results.projects?.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-amber-400" /> Matching Projects ({results.projects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.projects.map(prj => (
                  <Link key={prj.id} to={`/projects/${prj.id}`} className="glass-card p-4 rounded-xl border border-slate-800 block hover:border-amber-500/40">
                    <h3 className="font-bold text-white">{prj.name}</h3>
                    <p className="text-xs text-amber-300 font-mono">{prj.category}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{prj.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Company Matches */}
          {results.companies?.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-rose-400" /> Matching Companies ({results.companies.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.companies.map(c => (
                  <div key={c.id} className="glass-card p-4 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white">{c.name}</h3>
                    <p className="text-xs text-rose-300 font-mono">{c.industry}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
