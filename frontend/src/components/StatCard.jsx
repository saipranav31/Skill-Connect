import React from 'react';

export default function StatCard({ title, value, icon: Icon, color, description }) {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/20',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20',
    rose: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/20',
    cyan: 'from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/20'
  };

  const selectedColor = colorMap[color] || colorMap.indigo;

  return (
    <div className={`glass-card p-6 rounded-2xl border bg-gradient-to-br ${selectedColor} relative overflow-hidden group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{value !== undefined ? value : '—'}</h3>
          {description && <p className="text-xs text-slate-400 mt-2">{description}</p>}
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-700/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
