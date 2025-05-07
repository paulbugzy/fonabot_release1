import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { nodeTypes } from '../components/ivr-flow/nodes/NodeTypes';
import { NodePalette } from '../components/ivr-flow/NodePalette';
import { NodeConfigSidebar } from '../components/ivr-flow/NodeConfigSidebar';
import { NodeData } from '../components/ivr-flow/nodes/types';
import { ivrFlowService } from '../services/ivrFlowService';
import { IvrFlow, IvrFlowNode, IvrFlowEdge } from '../types/ivr-flow';

const BuilderContainer = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
  background: ${theme.colors.background};
`;

const SaveButton = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #4338ca;
  }
`;

const transformToReactFlowNodes = (nodes: IvrFlowNode[]): Node[] => {
  return nodes.map(node => ({
    id: node.node_client_id,
    type: node.type,
    position: { x: node.position_x, y: node.position_y },
    data: node.properties || {},
  }));
};

const transformToReactFlowEdges = (edges: IvrFlowEdge[]): Edge[] => {
  return edges.map(edge => ({
    id: edge.edge_client_id,
    source: edge.source_node_client_id,
    target: edge.target_node_client_id,
    sourceHandle: edge.source_handle,
    targetHandle: edge.target_handle,
    data: edge.properties || {},
  }));
};

const transformFromReactFlow = (
  nodes: Node[],
  edges: Edge[],
): { nodes: IvrFlowNode[]; edges: IvrFlowEdge[] } => {
  const transformedNodes = nodes.map(node => ({
    node_client_id: node.id,
    type: node.type,
    position_x: node.position.x,
    position_y: node.position.y,
    properties: node.data,
  }));

  const transformedEdges = edges.map(edge => ({
    edge_client_id: edge.id,
    source_node_client_id: edge.source,
    target_node_client_id: edge.target,
    source_handle: edge.sourceHandle,
    target_handle: edge.targetHandle,
    properties: edge.data,
  }));

  return { nodes: transformedNodes, edges: transformedEdges };
};

export const IvrFlowBuilderPage = () => {
  const { flowId } = useParams<{ flowId: string }>();
  const [flow, setFlow] = useState<IvrFlow | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - 200,
        y: event.clientY - 100,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `New ${type}`, properties: {} },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes],
  );

  const onNodeDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, data: NodeData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data } : node
      )
    );
  }, [setNodes]);
  useEffect(() => {
    if (flowId) {
      loadFlow(flowId);
    }
  }, [flowId]);

  const loadFlow = async (id: string) => {
    try {
      const flowData = await ivrFlowService.getFlow(id);
      setFlow(flowData);
      setNodes(transformToReactFlowNodes(flowData.nodes));
      setEdges(transformToReactFlowEdges(flowData.edges));
      setError(null);
    } catch (err) {
      setError('Failed to load flow');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = useCallback(async () => {
    if (!flow || !flowId) return;

    const { nodes: transformedNodes, edges: transformedEdges } = transformFromReactFlow(
      nodes,
      edges,
    );

    try {
      await ivrFlowService.updateFlow(flowId, {
        ...flow,
        nodes: transformedNodes,
        edges: transformedEdges,
      });
    } catch (err) {
      setError('Failed to save flow');
    }
  }, [flow, flowId, nodes, edges]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!flow) return <div>Flow not found</div>;

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
          <NodePalette onDragStart={onNodeDragStart} />
        </Panel>
        <Panel position="top-right">
          <SaveButton onClick={handleSave}>Save Flow</SaveButton>
        </Panel>
      </ReactFlow>
      <NodeConfigSidebar
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
        onNodeUpdate={handleNodeUpdate}
      />
    </BuilderContainer>
  );
};