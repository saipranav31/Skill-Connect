import React from 'react';
import { Database, AlertTriangle, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';

export default function DbErrorBanner({ error, onRetry }) {
  return (
    <div className="my-8 max-w-4xl mx-auto p-6 rounded-2xl bg-rose-950/30 border border-rose-500/30 shadow-2xl backdrop-blur-md">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-rose-200 flex items-center gap-2">
              <Database className="w-5 h-5" /> CognoDB Connection Required
            </h3>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Connection
              </button>
            )}
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {error?.message || 'Unable to communicate with the CognoDB graph database backend.'}
          </p>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
            <p className="text-indigo-400 font-semibold flex items-center gap-1.5">
              <Terminal className="w-4 h-4" /> Quick Troubleshooting Guide:
            </p>
            <ol className="list-decimal list-inside text-slate-300 space-y-1">
              <li>Open <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">backend/.env</code> file</li>
              <li>Verify <code className="text-indigo-300">COGNODB_URI</code> (e.g. <code className="text-emerald-400">bolt://...</code> or <code className="text-emerald-400">bolt+s://...</code>)</li>
              <li>Verify <code className="text-indigo-300">COGNODB_USERNAME</code> and <code className="text-indigo-300">COGNODB_PASSWORD</code> credentials</li>
              <li>Run the seed script: <code className="text-amber-300">npm run seed</code> in backend directory</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
