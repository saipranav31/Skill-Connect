import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, MapPin, Briefcase, Plus, ArrowRight } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import DbErrorBanner from '../components/DbErrorBanner';
import { getPeople } from '../services/api';

export default function PeoplePage({ onOpenCreatePerson }) {
  const [people, setPeople] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const fetchPeople = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const res = await getPeople();
      setPeople(res.data);
    } catch (err) {
      setDbError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const filteredPeople = people.filter(p => 
    p.name?.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.location?.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.bio?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (dbError) {
    return <DbErrorBanner error={dbError} onRetry={fetchPeople} />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-400" /> People Directory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover engineers, specialists, and their connected graph nodes.
          </p>
        </div>

        <button
          onClick={onOpenCreatePerson}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Person Node
        </button>
      </div>

      {/* Filter Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter by name, location, or bio..."
          value={filterQuery}
          onChange={e => setFilterQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : filteredPeople.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No Person Nodes Found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your filter or add a new person node.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeople.map(p => (
            <div key={p.id} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300">{p.name}</h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{p.location || 'Remote'}</span>
                </div>

                <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">{p.bio}</p>

                {/* Skill Badges */}
                {p.skills && p.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {p.skills.slice(0, 4).map((s, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
                        {s.name}
                      </span>
                    ))}
                    {p.skills.length > 4 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        +{p.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{p.skills?.length || 0} Skills</span>
                  <span>•</span>
                  <span>{p.projects?.length || 0} Projects</span>
                </div>

                <Link
                  to={`/people/${p.id}`}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
