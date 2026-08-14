import React, { useRef, useEffect, useState, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Filter, 
  Eye, 
  User, 
  Code2, 
  FolderGit2, 
  Building2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const NODE_COLORS = {
  Person: '#818cf8',  // Indigo
  Skill: '#34d399',   // Emerald
  Project: '#fbbf24', // Amber
  Company: '#f43f5e'  // Rose
};

export default function GraphViewer({ graphData, onSelectNode }) {
  const canvasRef = useRef(null);

  // Filters state
  const [activeFilters, setActiveFilters] = useState({
    Person: true,
    Skill: true,
    Project: true,
    Company: true
  });

  // Canvas Viewport transform (zoom / pan)
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Node selection & hover state
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [nodePositions, setNodePositions] = useState({});

  // Filtered nodes and edges calculation
  const filteredData = useMemo(() => {
    if (!graphData || !graphData.nodes) return { nodes: [], edges: [] };
    const allowedNodeIds = new Set(
      graphData.nodes
        .filter(n => activeFilters[n.type])
        .map(n => n.id)
    );

    const nodes = graphData.nodes.filter(n => allowedNodeIds.has(n.id));
    const edges = (graphData.edges || []).filter(
      e => allowedNodeIds.has(e.source) && allowedNodeIds.has(e.target)
    );

    return { nodes, edges };
  }, [graphData, activeFilters]);

  // Simple Physics Force Simulation Layout Initialization
  useEffect(() => {
    if (!filteredData.nodes.length) return;

    const width = 1000;
    const height = 650;
    const pos = {};

    // Position nodes in radial or physics spread
    filteredData.nodes.forEach((node, i) => {
      const angle = (i / filteredData.nodes.length) * Math.PI * 2;
      const radius = 180 + Math.random() * 200;
      pos[node.id] = {
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      };
    });

    // Run simple force iterations (repulsion + spring relaxation)
    for (let iter = 0; iter < 60; iter++) {
      // Repulsion between nodes
      const nodeKeys = Object.keys(pos);
      for (let i = 0; i < nodeKeys.length; i++) {
        for (let j = i + 1; j < nodeKeys.length; j++) {
          const idA = nodeKeys[i];
          const idB = nodeKeys[j];
          const dx = pos[idB].x - pos[idA].x;
          const dy = pos[idB].y - pos[idA].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 150) {
            const force = (150 - dist) / dist * 1.5;
            pos[idA].x -= (dx / dist) * force;
            pos[idA].y -= (dy / dist) * force;
            pos[idB].x += (dx / dist) * force;
            pos[idB].y += (dy / dist) * force;
          }
        }
      }

      // Spring force along edges
      filteredData.edges.forEach(edge => {
        const p1 = pos[edge.source];
        const p2 = pos[edge.target];
        if (p1 && p2) {
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 100;
          const force = (dist - targetDist) * 0.05;
          p1.x += (dx / dist) * force;
          p1.y += (dy / dist) * force;
          p2.x -= (dx / dist) * force;
          p2.y -= (dy / dist) * force;
        }
      });
    }

    setNodePositions(pos);
  }, [filteredData]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Apply Zoom & Pan Transform
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // Connected Nodes Set for Hover/Selection Highlighting
      const activeHighlightId = selectedNodeId || hoveredNodeId;
      const connectedNodeIds = new Set();
      if (activeHighlightId) {
        connectedNodeIds.add(activeHighlightId);
        filteredData.edges.forEach(e => {
          if (e.source === activeHighlightId) connectedNodeIds.add(e.target);
          if (e.target === activeHighlightId) connectedNodeIds.add(e.source);
        });
      }

      // Draw Edges (Relationships)
      filteredData.edges.forEach(edge => {
        const p1 = nodePositions[edge.source];
        const p2 = nodePositions[edge.target];
        if (!p1 || !p2) return;

        const isHighlighted = activeHighlightId && 
          (edge.source === activeHighlightId || edge.target === activeHighlightId);
        const isDimmed = activeHighlightId && !isHighlighted;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = isHighlighted 
          ? '#6366f1' 
          : isDimmed 
            ? 'rgba(51, 65, 85, 0.2)' 
            : 'rgba(71, 85, 105, 0.5)';
        ctx.lineWidth = isHighlighted ? 2.5 : 1;
        ctx.stroke();

        // Relationship label on edge
        if (transform.k > 0.7) {
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          ctx.font = '9px JetBrains Mono';
          ctx.fillStyle = isHighlighted ? '#a5b4fc' : 'rgba(148, 163, 184, 0.6)';
          ctx.textAlign = 'center';
          ctx.fillText(edge.type, midX, midY - 3);
        }
      });

      // Draw Nodes
      filteredData.nodes.forEach(node => {
        const pos = nodePositions[node.id];
        if (!pos) return;

        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;
        const isConnected = connectedNodeIds.has(node.id);
        const isDimmed = activeHighlightId && !isConnected;

        const baseColor = NODE_COLORS[node.type] || '#94a3b8';

        // Outer Glow for Selected/Hovered Node
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.2)';
          ctx.fill();
        }

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = isDimmed ? 'rgba(30, 41, 59, 0.6)' : baseColor;
        ctx.fill();
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(15, 23, 42, 0.9)';
        ctx.stroke();

        // Node Label
        ctx.font = isSelected ? 'bold 12px Plus Jakarta Sans' : '11px Plus Jakarta Sans';
        ctx.fillStyle = isDimmed ? 'rgba(100, 116, 139, 0.5)' : '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(node.label || node.id, pos.x, pos.y + 26);
      });

      ctx.restore();
    };

    render();
  }, [filteredData, nodePositions, transform, selectedNodeId, hoveredNodeId]);

  // Handle Mouse Canvas Interactions (Pan, Drag, Click)
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - transform.x) / transform.k;
    const clickY = (e.clientY - rect.top - transform.y) / transform.k;

    // Check if clicked on a node
    const clickedNode = filteredData.nodes.find(node => {
      const pos = nodePositions[node.id];
      if (!pos) return false;
      const dist = Math.sqrt((clickX - pos.x) ** 2 + (clickY - pos.y) ** 2);
      return dist <= 16;
    });

    if (clickedNode) {
      setSelectedNodeId(clickedNode.id);
      if (onSelectNode) onSelectNode(clickedNode);
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    } else {
      // Hover detection
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - transform.x) / transform.k;
      const mouseY = (e.clientY - rect.top - transform.y) / transform.k;

      const hovered = filteredData.nodes.find(node => {
        const pos = nodePositions[node.id];
        if (!pos) return false;
        const dist = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
        return dist <= 16;
      });

      setHoveredNodeId(hovered ? hovered.id : null);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setTransform(prev => ({
      ...prev,
      k: Math.max(0.3, Math.min(3, prev.k * zoomFactor))
    }));
  };

  const resetView = () => setTransform({ x: 0, y: 0, k: 1 });

  const selectedNodeObj = filteredData.nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="relative w-full h-[650px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Control Bar & Filter Toggles */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-400">
          <Filter className="w-3.5 h-3.5" /> Nodes:
        </div>
        {Object.keys(NODE_COLORS).map(type => (
          <button
            key={type}
            onClick={() => setActiveFilters(f => ({ ...f, [type]: !f[type] }))}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              activeFilters[type] 
                ? 'bg-slate-800 text-white border-slate-700 shadow-sm'
                : 'bg-slate-950/60 text-slate-500 border-slate-900 line-through'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: NODE_COLORS[type] }}></span>
            {type}
          </button>
        ))}
      </div>

      {/* Viewport Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl backdrop-blur-md text-slate-300">
        <button 
          onClick={() => setTransform(t => ({ ...t, k: Math.min(3, t.k * 1.2) }))}
          className="p-1.5 hover:bg-slate-800 rounded-lg" title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setTransform(t => ({ ...t, k: Math.max(0.3, t.k / 1.2) }))}
          className="p-1.5 hover:bg-slate-800 rounded-lg" title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button 
          onClick={resetView}
          className="p-1.5 hover:bg-slate-800 rounded-lg" title="Reset Camera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* HTML5 Canvas Element */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={650}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Node Details Inspection Drawer */}
      {selectedNodeObj && (
        <div className="absolute bottom-4 right-4 z-20 w-80 glass-panel border border-slate-700/80 p-4 rounded-xl shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${NODE_COLORS[selectedNodeObj.type]}20`, color: NODE_COLORS[selectedNodeObj.type] }}>
              {selectedNodeObj.type} Node
            </span>
            <button onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-white text-xs">Close</button>
          </div>

          <h4 className="text-base font-bold text-white">{selectedNodeObj.label}</h4>

          <div className="space-y-1 text-xs text-slate-300">
            {Object.entries(selectedNodeObj.properties || {}).map(([key, val]) => {
              if (key === 'id' || key === 'name') return null;
              return (
                <div key={key} className="flex justify-between border-b border-slate-800 py-1">
                  <span className="text-slate-400 capitalize">{key}:</span>
                  <span className="font-medium text-slate-200 truncate max-w-[160px]">{String(val)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
