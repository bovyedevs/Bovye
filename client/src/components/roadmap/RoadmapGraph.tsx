import { useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUSINESS_PATHWAYS, type PathwayId } from '@/data/roadmapTemplates';
import { useRoadmapStore } from '@/store/useRoadmapStore';
import type { NodeCategory, RoadmapNode, NodeConnection } from '@/types/roadmap';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 120;
const COLUMN_GAP = 260;
const ROW_GAP = 145;
const COLUMN_HEADER_HEIGHT = 40;
const PADDING_X = 60;
const PADDING_Y = 80;

const categoryColors: Record<NodeCategory, { bg: string; border: string; bar: string; dot: string; text: string }> = {
  foundation: { bg: 'bg-amber-500/10', border: 'border-amber-500/40', bar: 'bg-amber-500', dot: 'bg-amber-500', text: 'text-amber-600' },
  operations: { bg: 'bg-sky-500/10', border: 'border-sky-500/40', bar: 'bg-sky-500', dot: 'bg-sky-500', text: 'text-sky-600' },
  product: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', bar: 'bg-emerald-500', dot: 'bg-emerald-500', text: 'text-emerald-600' },
  engineering: { bg: 'bg-blue-500/10', border: 'border-blue-500/40', bar: 'bg-blue-500', dot: 'bg-blue-500', text: 'text-blue-600' },
  growth: { bg: 'bg-violet-500/10', border: 'border-violet-500/40', bar: 'bg-violet-500', dot: 'bg-violet-500', text: 'text-violet-600' },
  scale: { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/40', bar: 'bg-fuchsia-500', dot: 'bg-fuchsia-500', text: 'text-fuchsia-600' },
  legal: { bg: 'bg-orange-500/10', border: 'border-orange-500/40', bar: 'bg-orange-500', dot: 'bg-orange-500', text: 'text-orange-600' },
  finance: { bg: 'bg-green-500/10', border: 'border-green-500/40', bar: 'bg-green-500', dot: 'bg-green-500', text: 'text-green-600' },
  hr: { bg: 'bg-pink-500/10', border: 'border-pink-500/40', bar: 'bg-pink-500', dot: 'bg-pink-500', text: 'text-pink-600' },
  marketing: { bg: 'bg-red-500/10', border: 'border-red-500/40', bar: 'bg-red-500', dot: 'bg-red-500', text: 'text-red-600' },
  technology: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/40', bar: 'bg-indigo-500', dot: 'bg-indigo-500', text: 'text-indigo-600' },
  'go-to-market': { bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', bar: 'bg-cyan-500', dot: 'bg-cyan-500', text: 'text-cyan-600' },
  production: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/40', bar: 'bg-yellow-500', dot: 'bg-yellow-500', text: 'text-yellow-600' },
  sales: { bg: 'bg-lime-500/10', border: 'border-lime-500/40', bar: 'bg-lime-500', dot: 'bg-lime-500', text: 'text-lime-600' },
  delivery: { bg: 'bg-teal-500/10', border: 'border-teal-500/40', bar: 'bg-teal-500', dot: 'bg-teal-500', text: 'text-teal-600' },
};

function getNodePosition(node: RoadmapNode): { x: number; y: number } {
  return {
    x: PADDING_X + node.column * COLUMN_GAP,
    y: PADDING_Y + COLUMN_HEADER_HEIGHT + node.row * ROW_GAP,
  };
}

function NodeCard({ node, onClick, isSelected }: {
  node: RoadmapNode;
  onClick: (node: RoadmapNode) => void;
  isSelected: boolean;
}) {
  const nodeStates = useRoadmapStore((s) => s.nodeStates);
  const state = nodeStates[node.id];
  const colors = categoryColors[node.category as NodeCategory];

  const subtaskDone = state ? Object.values(state.subtaskStates).filter(Boolean).length : 0;
  const totalSubtasks = node.subtasks.length;
  const pct = totalSubtasks > 0 ? Math.round((subtaskDone / totalSubtasks) * 100) : 0;

  const accentBarHeight = 40;
  const accentBarTop = (NODE_HEIGHT - accentBarHeight) / 2;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: node.row * 0.05 + node.column * 0.03 }}
      onClick={() => onClick(node)}
      className={cn(
        'absolute rounded-xl border-2 p-3 text-left transition-all duration-200',
        'shadow-warm-sm hover:shadow-warm-md bg-card/95 backdrop-blur-sm',
        'hover:-translate-y-0.5',
        colors.border,
        isSelected && 'ring-2 ring-primary ring-offset-2 shadow-lg scale-[1.02]',
        state?.completed && 'border-emerald-500/60 bg-emerald-500/10',
        state?.inProgress && !state?.completed && 'animate-pulse-slow'
      )}
      style={{
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      }}
    >
      {/* Left accent bar - vertically centered */}
      <div
        className={cn('absolute left-0 rounded-r-full', colors.bar, isSelected && 'w-[6px] opacity-100')}
        style={{
          top: accentBarTop,
          height: accentBarHeight,
          width: isSelected ? '6px' : '4px',
          opacity: isSelected ? 1 : 0.7,
          transition: 'width 0.2s, opacity 0.2s',
        }}
      />

      {/* Content */}
      <div className="pl-2 h-full flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-bold text-foreground leading-tight truncate">
            {node.title}
          </h4>
          <p className="text-[10px] text-foreground/70 font-medium mt-0.5">
            {node.duration}
          </p>
        </div>

        {totalSubtasks > 0 && (
          <div>
            <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-300', state?.completed ? 'bg-emerald-500' : colors.dot)}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-[10px] text-foreground/80 font-semibold mt-0.5 tabular-nums">
              {subtaskDone}/{totalSubtasks}
            </p>
          </div>
        )}
      </div>
    </motion.button>
  );
}

function ConnectionLines({ connections, nodes }: {
  connections: NodeConnection[];
  nodes: RoadmapNode[];
}) {
  const nodeMap = useMemo(() => {
    const map = new Map<string, RoadmapNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-muted-foreground/30" />
        </marker>
      </defs>
      {connections.map((conn) => {
        const fromNode = nodeMap.get(conn.from);
        const toNode = nodeMap.get(conn.to);
        if (!fromNode || !toNode) return null;

        const fromPos = getNodePosition(fromNode);
        const toPos = getNodePosition(toNode);

        const x1 = fromPos.x + NODE_WIDTH;
        const y1 = fromPos.y + NODE_HEIGHT / 2;
        const x2 = toPos.x;
        const y2 = toPos.y + NODE_HEIGHT / 2;

        const midX = (x1 + x2) / 2;

        const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

        return (
          <path
            key={`${conn.from}-${conn.to}`}
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground/20"
            markerEnd="url(#arrowhead)"
          />
        );
      })}
    </svg>
  );
}

export default function RoadmapGraph({ pathwayId, onNodeSelect, onBack, selectedNodeId }: {
  pathwayId: PathwayId;
  onNodeSelect: (node: RoadmapNode) => void;
  onBack: () => void;
  selectedNodeId: string | null;
}) {
  const pathway = BUSINESS_PATHWAYS.find((p) => p.id === pathwayId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  if (!pathway) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Pathway not found.</p>
      </div>
    );
  }

  const numColumns = pathway.columnLabels.length;
  const maxRows = Math.max(...pathway.nodes.map((n) => n.row)) + 1;
  const graphWidth = PADDING_X * 2 + (numColumns - 1) * COLUMN_GAP + NODE_WIDTH;
  const graphHeight = PADDING_Y + COLUMN_HEADER_HEIGHT + (maxRows - 1) * ROW_GAP + NODE_HEIGHT + 40;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Pathways
          </button>
          <div className="h-4 w-px bg-border" />
          <h2 className="text-sm font-bold text-foreground">{pathway.name}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="text-xs font-bold text-muted-foreground tabular-nums w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors"
            title="Reset view"
          >
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 px-4 md:px-6 py-2 border-b border-border bg-muted/30 flex-shrink-0 overflow-x-auto">
        {Array.from(new Set(pathway.nodes.map((n) => n.category))).map((cat) => {
          const colors = categoryColors[cat as NodeCategory];
          return (
            <div key={cat} className="flex items-center gap-1.5 flex-shrink-0">
              <div className={cn('h-2 w-2 rounded-full', colors.dot)} />
              <span className="text-[10px] font-semibold text-muted-foreground capitalize">
                {cat.replace(/-/g, ' ')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Graph Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative"
          style={{
            width: graphWidth,
            height: graphHeight,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          {/* Column Headers */}
          {pathway.columnLabels.map((label, colIndex) => (
            <div
              key={colIndex}
              className="absolute text-center"
              style={{
                left: PADDING_X + colIndex * COLUMN_GAP,
                top: PADDING_Y,
                width: NODE_WIDTH,
              }}
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                {label}
              </span>
              <div className="mt-1 h-px w-full bg-border/50" />
            </div>
          ))}

          {/* Column Guides */}
          {pathway.columnLabels.map((_, colIndex) => (
            <div
              key={`guide-${colIndex}`}
              className="absolute border-l border-dashed border-border/30"
              style={{
                left: PADDING_X + colIndex * COLUMN_GAP + NODE_WIDTH / 2,
                top: PADDING_Y + COLUMN_HEADER_HEIGHT,
                height: (maxRows - 1) * ROW_GAP + NODE_HEIGHT + 40,
              }}
            />
          ))}

          {/* Connection Lines */}
          <ConnectionLines connections={pathway.connections} nodes={pathway.nodes} />

          {/* Nodes */}
          {pathway.nodes.map((node) => {
            const pos = getNodePosition(node);
            return (
              <div
                key={node.id}
                className="absolute"
                style={{ left: pos.x, top: pos.y }}
              >
                <NodeCard
                  node={node}
                  onClick={onNodeSelect}
                  isSelected={selectedNodeId === node.id}
                />
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
