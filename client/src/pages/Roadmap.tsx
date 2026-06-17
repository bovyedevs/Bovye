import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmapStore } from '@/store/useRoadmapStore';
import { BUSINESS_PATHWAYS, type PathwayId } from '@/data/roadmapTemplates';
import type { RoadmapNode } from '@/types/roadmap';
import PathwaySelector from '@/components/roadmap/PathwaySelector';
import RoadmapGraph from '@/components/roadmap/RoadmapGraph';
import NodeDetailPanel from '@/components/roadmap/NodeDetailPanel';

export default function Roadmap() {
  const selectedPathway = useRoadmapStore((s) => s.selectedPathway);
  const selectPathway = useRoadmapStore((s) => s.selectPathway);
  const loadTemplate = useRoadmapStore((s) => s.loadTemplate);

  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [graphView, setGraphView] = useState<boolean>(!!selectedPathway);

  useEffect(() => {
    if (selectedPathway) {
      setGraphView(true);
    }
  }, [selectedPathway]);

  const handleSelectPathway = useCallback((id: PathwayId) => {
    selectPathway(id);
    loadTemplate(id);
    setGraphView(true);
    setSelectedNode(null);
  }, [selectPathway, loadTemplate]);

  const handleNodeSelect = useCallback((node: RoadmapNode) => {
    setSelectedNode(node);
  }, []);

  const handleNavigateToNode = useCallback((nodeId: string) => {
    if (!selectedPathway) return;
    const pathway = BUSINESS_PATHWAYS.find((p) => p.id === selectedPathway);
    const node = pathway?.nodes.find((n) => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
    }
  }, [selectedPathway]);

  const handleBack = useCallback(() => {
    setGraphView(false);
    setSelectedNode(null);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <AnimatePresence mode="wait">
        {!graphView ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto"
          >
            <PathwaySelector
              onSelect={handleSelectPathway}
              selectedPathway={selectedPathway}
            />
          </motion.div>
        ) : (
          <motion.div
            key="graph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-hidden"
          >
            {selectedPathway ? (
              <RoadmapGraph
                pathwayId={selectedPathway}
                onNodeSelect={handleNodeSelect}
                onBack={handleBack}
                selectedNodeId={selectedNode?.id ?? null}
              />
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedNode && (
        <NodeDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onNavigate={handleNavigateToNode}
        />
      )}
    </div>
  );
}
