import React from 'react';
import { Link } from 'react-router-dom';
import { Network, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="text-center py-20 glass-panel rounded-3xl border border-slate-800 max-w-xl mx-auto my-12 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
        <Network className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404 - Node Not Found</h1>
      <p className="text-sm text-slate-400">The requested page or node route does not exist in the graph navigation network.</p>
      <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Link>
    </div>
  );
}
