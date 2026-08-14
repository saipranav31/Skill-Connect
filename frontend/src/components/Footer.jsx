import React from 'react';
import { Network, ExternalLink, GitBranch } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center border border-indigo-500/30">
            <Network className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">SkillConnect</p>
            <p className="text-xs text-slate-500">Discover people, skills and projects through connected graph data.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <DatabaseIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Database: <strong className="text-slate-200">CognoDB Cloud (Cypher)</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
            <span>Assessment: <strong className="text-slate-200">Wexa AI Software Engineer</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function DatabaseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}
