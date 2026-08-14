import React, { useState, useEffect } from 'react';
import { Share2, Sparkles, Database, Info } from 'lucide-react';
import GraphViewer from '../components/GraphViewer';
import DbErrorBanner from '../components/DbErrorBanner';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getFullGraph } from '../services/api';

export default function GraphExplorerPage() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const fetchGraph = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const res = await getFullGraph();
      setGraphData(res.data);
    } catch (err) {
      setDbError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  if (dbError) return <DbErrorBanner error={dbError} onRetry={fetchGraph} />;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Graph Visualization Engine
          </div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Share2 className="w-8 h-8 text-indigo-400" /> CognoDB Graph Explorer
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visual property graph rendering real-time nodes (Person, Skill, Project, Company) and relationship edges.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          <Database className="w-4 h-4 text-indigo-400" />
          <span>{graphData.nodes?.length || 0} Nodes • {graphData.edges?.length || 0} Edges</span>
        </div>
      </div>

      {/* Interactive Visual Graph Canvas Component */}
      {loading ? (
        <LoadingSkeleton count={1} />
      ) : (
        <GraphViewer graphData={graphData} onSelectNode={setSelectedNode} />
      )}

      {/* Graph Legend & Explanation Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        <div className="glass-card p-4 rounded-xl border border-indigo-500/20">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
            <span className="w-3 h-3 rounded-full bg-[#818cf8]"></span> Person Node
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Represents developers & specialists with properties (name, location, bio).</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
            <span className="w-3 h-3 rounded-full bg-[#34d399]"></span> Skill Node
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Represents tech skills, programming languages, and frameworks.</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <span className="w-3 h-3 rounded-full bg-[#fbbf24]"></span> Project Node
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Represents software applications requiring specific skill sets.</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
            <span className="w-3 h-3 rounded-full bg-[#f43f5e]"></span> Company Node
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Represents organizations owning projects and employing talent.</p>
        </div>
      </div>
    </div>
  );
}
