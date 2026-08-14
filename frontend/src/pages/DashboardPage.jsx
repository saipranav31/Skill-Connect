import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Code2, 
  FolderGit2, 
  Building2, 
  Share2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import StatCard from '../components/StatCard';
import DbErrorBanner from '../components/DbErrorBanner';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getGraphStats, getPeople, getSkills, getProjects, getPersonRecommendations } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [people, setPeople] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [featuredRecommendations, setFeaturedRecommendations] = useState(null);

  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const [statsRes, peopleRes, skillsRes, projectsRes] = await Promise.all([
        getGraphStats(),
        getPeople(),
        getSkills(),
        getProjects()
      ]);

      setStats(statsRes.data);
      setPeople(peopleRes.data.slice(0, 4));
      setSkills(skillsRes.data.slice(0, 8));
      setProjects(projectsRes.data.slice(0, 3));

      // Fetch featured multi-hop graph recommendation for first person (e.g. Sai Pranav)
      if (peopleRes.data.length > 0) {
        try {
          const recRes = await getPersonRecommendations(peopleRes.data[0].id);
          setFeaturedRecommendations(recRes.data);
        } catch (e) {
          console.warn('Failed to load featured recommendation:', e);
        }
      }
    } catch (err) {
      console.error('Dashboard Load Error:', err);
      setDbError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (dbError) {
    return <DbErrorBanner error={dbError} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by CognoDB Graph Traversal</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Discover people, skills & projects through <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">connected data</span>.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            SkillConnect models talent networks, technical skills, and project requirements as a connected property graph. Execute multi-hop Cypher queries to match developers with ideal opportunities.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/graph"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4" /> Open Graph Explorer
            </Link>
            <Link
              to="/people"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Users className="w-4 h-4" /> Explore People
            </Link>
          </div>
        </div>
      </section>

      {/* Live Graph Statistics */}
      {loading ? (
        <LoadingSkeleton count={5} />
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="People Nodes" value={stats?.people} icon={Users} color="indigo" description="Active developers & engineers" />
          <StatCard title="Skill Nodes" value={stats?.skills} icon={Code2} color="emerald" description="Tech stacks & proficiencies" />
          <StatCard title="Project Nodes" value={stats?.projects} icon={FolderGit2} color="amber" description="Active & upcoming projects" />
          <StatCard title="Company Nodes" value={stats?.companies} icon={Building2} color="rose" description="Partner organizations" />
          <StatCard title="Relationships" value={stats?.relationships} icon={Share2} color="cyan" description="Graph edge connections" />
        </section>
      )}

      {/* Featured Graph Recommendation Showcase */}
      {featuredRecommendations && (
        <section className="glass-panel p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/20 via-slate-900 to-slate-950 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Multi-Hop Graph Traversal
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">
                Featured Skill Recommendation for {featuredRecommendations.person?.name}
              </h2>
            </div>
            <Link to={`/people/${featuredRecommendations.person?.id}`} className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecommendations.matchingProjects?.slice(0, 3).map((match, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {match.matchPercentage}% Match
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{match.matchedCount}/{match.requiredCount} Skills</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{match.project.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{match.project.description}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase text-slate-400">Matching Skills in Graph:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchingSkills?.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                        {s.name || s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid: Popular Skills & Recent People */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Skills */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" /> Popular Skills
            </h3>
            <Link to="/skills" className="text-xs font-semibold text-indigo-400 hover:underline">View all</Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <Link
                key={s.id}
                to={`/skills/${s.id}`}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{s.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({s.peopleCount || 0})</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent People */}
        <section className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Recent Engineers & Specialists
            </h3>
            <Link to="/people" className="text-xs font-semibold text-indigo-400 hover:underline">View all</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {people.map(p => (
              <Link
                key={p.id}
                to={`/people/${p.id}`}
                className="glass-card p-4 rounded-xl border border-slate-800/80 hover:border-indigo-500/40 block transition-all"
              >
                <h4 className="text-sm font-bold text-white">{p.name}</h4>
                <p className="text-xs text-indigo-300 font-mono mt-0.5">{p.location}</p>
                <p className="text-xs text-slate-400 line-clamp-2 mt-2">{p.bio}</p>
                
                <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 font-mono">
                  <span>{p.skills?.length || 0} Skills</span>
                  <span>•</span>
                  <span>{p.projects?.length || 0} Projects</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
