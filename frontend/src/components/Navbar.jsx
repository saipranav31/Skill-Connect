import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Network, 
  Users, 
  Code2, 
  FolderGit2, 
  Share2, 
  Search, 
  Database,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { checkHealth } from '../services/api';

export default function Navbar({ onOpenCreatePerson, onOpenCreateSkill, onOpenCreateProject }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dbStatus, setDbStatus] = useState({ loading: true, connected: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    checkHealth()
      .then(res => {
        if (mounted) setDbStatus({ loading: false, connected: res.data.database?.connected });
      })
      .catch(() => {
        if (mounted) setDbStatus({ loading: false, connected: false });
      });
    return () => { mounted = false; };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: Network },
    { label: 'People', path: '/people', icon: Users },
    { label: 'Skills', path: '/skills', icon: Code2 },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'Graph Explorer', path: '/graph', icon: Share2 }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                SkillConnect
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                CognoDB
              </span>
            </div>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search people, skills, projects, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* DB Health Badge */}
          <div 
            title={dbStatus.connected ? 'CognoDB Connected' : 'CognoDB Offline'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${
              dbStatus.connected 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="w-2 h-2 rounded-full animate-pulse bg-current"></span>
            <span>{dbStatus.connected ? 'CognoDB Online' : 'DB Disconnected'}</span>
          </div>

          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-md shadow-indigo-600/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </button>

            {createDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-2 z-50">
                <button
                  onClick={() => { setCreateDropdownOpen(false); onOpenCreatePerson(); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-300 flex items-center gap-2"
                >
                  <Users className="w-4 h-4" /> Add Person
                </button>
                <button
                  onClick={() => { setCreateDropdownOpen(false); onOpenCreateSkill(); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-300 flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4" /> Add Skill
                </button>
                <button
                  onClick={() => { setCreateDropdownOpen(false); onOpenCreateProject(); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-300 flex items-center gap-2"
                >
                  <FolderGit2 className="w-4 h-4" /> Add Project
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-900 text-base"
              >
                <Icon className="w-5 h-5 text-indigo-400" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
