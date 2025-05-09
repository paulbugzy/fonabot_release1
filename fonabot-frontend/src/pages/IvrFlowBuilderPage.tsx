import {
  useEffect,
  useState,
  useCallback,
  type MouseEvent as ReactMouseEvent,
  type DragEvent as ReactDragEvent
  // type DragEventHandler as ReactDragEventHandler // Remove unused import
} from "react";
import { useParams } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node, // This should be the generic Node type from React Flow
  type Edge
  // type NodeMouseHandler // Remove unused import
} from "@xyflow/react";

// Important: Ensure this path is correct for your project structure
import type { NodeData } from "../components/ivr-flow/nodes/types";

import "@xyflow/react/dist/style.css"; // React Flow styles

// Important: Ensure these paths are correct
import { nodeTypes } from "../components/ivr-flow/nodes/NodeTypes";
import { NodePalette } from "../components/ivr-flow/NodePalette";
import { NodeConfigSidebar } from "../components/ivr-flow/NodeConfigSidebar";
import { ivrFlowService } from "../services/ivrFlowService";

// Important: Ensure this path is correct
import type { IvrFlow, IvrFlowNode, IvrFlowEdge } from "../types/ivrFlow";

// Utility to convert your domain nodes to React Flow nodes
function transformToReactFlowNodes(nodes: IvrFlowNode[]): Node<NodeData>[] {
  return nodes.map((n) => ({
    id: n.node_client_id,
    type: n.type,
    position: { x: n.position_x, y: n.position_y },
    data: {
      label: (n as any).label ?? "",
      properties: n.properties ?? {}
    }
  }));
}

// Utility to convert your domain edges to React Flow edges
function transformToReactFlowEdges(edges: IvrFlowEdge[]): Edge[] {
  return edges.map((e) => {
    const edge: Edge = {
      id: e.edge_client_id,
      source: e.source_node_client_id,
      target: e.target_node_client_id
      // type: e.type // Removed because 'type' does not exist on IvrFlowEdge
    };
    // Only add label if it exists on the edge
    if ("label" in e && typeof e.label === "string") {
      (edge as any).label = e.label;
    }
    return edge;
  });
}

// Utility to convert React Flow nodes/edges back to your domain format
function transformFromReactFlow(
  nodes: Node<NodeData>[],
  edges: Edge[]
): { nodes: IvrFlowNode[]; edges: IvrFlowEdge[] } {
  return {
    nodes: nodes.map((n) => ({
      node_client_id: n.id,
      type: n.type!,
      position_x: n.position.x,
      position_y: n.position.y,
      data: n.data
    })),
    edges: edges.map((e) => ({
      edge_client_id: e.id,
      source_node_client_id: e.source,
      target_node_client_id: e.target,
      type: e.type,
      label: e.label
    }))
  };
}
// Emotion styled import - this was in your original code
import styled from "@emotion/styled";

const BuilderContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const SaveButton = styled.button`
  background: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export default function IvrFlowBuilderPage() {
  const { flowId } = useParams<{ flowId: string }>();
  const [flow, setFlow] = useState<IvrFlow | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([]); // Ensure Node<NodeData>
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Corrected loadFlow (memoized)
  const loadFlow = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const flowData = await ivrFlowService.getFlow(id);
        setFlow(flowData);
        setNodes(transformToReactFlowNodes(flowData.nodes));
        setEdges(transformToReactFlowEdges(flowData.edges));
        setError(null);
      } catch (err) {
        setError("Failed to load flow");
        setFlow(null);
        setNodes([]);
        setEdges([]);
      } finally {
        setLoading(false);
      }
    },
    [setNodes, setEdges]
  ); // Add stable dependencies

  useEffect(() => {
    if (flowId) {
      loadFlow(flowId);
    }
  }, [flowId, loadFlow]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Corrected onDragOver
  const onDragOver = useCallback((event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Corrected onDrop
  const onDrop = useCallback(
    (event: ReactDragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !event.currentTarget) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top
      };

      const newNodeData: NodeData = {
        label: `New ${type}`,
        properties: {}
      };
      const newNode: Node<NodeData> = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: newNodeData
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  // Corrected onNodeDragStart (if used by NodePalette prop)
  const onNodeDragStart = (
    _event: ReactDragEvent<Element>,
    _nodeType: string
  ) => {
    // This would be called IF NodePalette itself invoked this prop.
    // The actual setting of dataTransfer usually happens *inside* NodePalette.
    // console.log('Drag started from palette for type:', _nodeType, _event);
  };

  // Corrected handleNodeClick
  const handleNodeClick = useCallback(
    (_event: ReactMouseEvent<Element>, node: Node<NodeData>) => {
      setSelectedNode(node);
    },
    []
  );

  const handleNodeUpdate = useCallback(
    (nodeId: string, data: NodeData) => {
      setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data } : n)));
      // Also update selectedNode if it's the one being changed
      setSelectedNode((prevNode) =>
        prevNode && prevNode.id === nodeId ? { ...prevNode, data } : prevNode
      );
    },
    [setNodes]
  );

  const handleSave = useCallback(async () => {
    if (!flow || !flowId) return;
    setLoading(true); // Indicate saving process
    const { nodes: transformedNodes, edges: transformedEdges } =
      transformFromReactFlow(nodes, edges);

    try {
      await ivrFlowService.updateFlow(flowId, {
        ...flow,
        nodes: transformedNodes,
        edges: transformedEdges
      });
      setError(null); // Clear previous errors on successful save
    } catch (err) {
      setError("Failed to save flow");
    } finally {
      setLoading(false);
    }
  }, [flow, flowId, nodes, edges]); // Removed `loadFlow` if it's not called here

  if (loading && !nodes.length) return <div>Loading...</div>; // Show loading only if nodes aren't already displayed
  if (error) return <div>Error: {error}</div>;
  if (!flow && !loading) return <div>Flow not found or finished loading.</div>; // Adjusted condition

  return (
    <BuilderContainer>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-left">
          {/* Ensure NodePalette's onDragStart prop matches 'onNodeDragStart' signature if used */}
          <NodePalette onDragStart={onNodeDragStart} />
        </Panel>
        <Panel position="top-right">
          <SaveButton onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Flow"}
          </SaveButton>
        </Panel>
      </ReactFlow>
      <NodeConfigSidebar
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
        onNodeUpdate={handleNodeUpdate}
      />
    </BuilderContainer>
  );
}
