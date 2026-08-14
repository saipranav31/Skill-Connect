import React from 'react';

export default function LoadingSkeleton({ count = 3, type = 'card' }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="h-6 bg-slate-800 rounded-lg w-2/3"></div>
          <div className="h-4 bg-slate-800/60 rounded w-1/2"></div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-slate-800/40 rounded w-full"></div>
            <div className="h-3 bg-slate-800/40 rounded w-4/5"></div>
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-slate-800 rounded-full w-16"></div>
            <div className="h-6 bg-slate-800 rounded-full w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
