"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IvrFlowBuilderPage = void 0;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const react_2 = require("@xyflow/react");
require("@xyflow/react/dist/style.css");
const styled_1 = require("@emotion/styled");
const theme_1 = require("../styles/theme");
const NodeTypes_1 = require("../components/ivr-flow/nodes/NodeTypes");
const NodePalette_1 = require("../components/ivr-flow/NodePalette");
const NodeConfigSidebar_1 = require("../components/ivr-flow/NodeConfigSidebar");
const ivrFlowService_1 = require("../services/ivrFlowService");
const BuilderContainer = styled_1.default.div `
  width: 100%;
  height: calc(100vh - 80px);
  background: ${theme_1.theme.colors.background};
`;
const SaveButton = styled_1.default.button `
  background-color: ${theme_1.theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme_1.theme.spacing.sm} ${theme_1.theme.spacing.lg};
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #4338ca;
  }
`;
const transformToReactFlowNodes = (nodes) => {
    return nodes.map(node => ({
        id: node.node_client_id,
        type: node.type,
        position: { x: node.position_x, y: node.position_y },
        data: node.properties || {},
    }));
};
const transformToReactFlowEdges = (edges) => {
    return edges.map(edge => ({
        id: edge.edge_client_id,
        source: edge.source_node_client_id,
        target: edge.target_node_client_id,
        sourceHandle: edge.source_handle,
        targetHandle: edge.target_handle,
        data: edge.properties || {},
    }));
};
const transformFromReactFlow = (nodes, edges) => {
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
const IvrFlowBuilderPage = () => {
    const { flowId } = (0, react_router_dom_1.useParams)();
    const [flow, setFlow] = (0, react_1.useState)(null);
    const [selectedNode, setSelectedNode] = (0, react_1.useState)(null);
    const [nodes, setNodes, onNodesChange] = (0, react_2.useNodesState)([]);
    const [edges, setEdges, onEdgesChange] = (0, react_2.useEdgesState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const onConnect = (0, react_1.useCallback)((params) => setEdges((eds) => (0, react_2.addEdge)(params, eds)), [setEdges]);
    const onDragOver = (0, react_1.useCallback)((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    const onDrop = (0, react_1.useCallback)((event) => {
        event.preventDefault();
        const type = event.dataTransfer.getData('application/reactflow');
        if (!type)
            return;
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
    }, [setNodes]);
    const onNodeDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };
    const handleNodeClick = (0, react_1.useCallback)((event, node) => {
        setSelectedNode(node);
    }, []);
    const handleNodeUpdate = (0, react_1.useCallback)((nodeId, data) => {
        setNodes((nds) => nds.map((node) => node.id === nodeId ? { ...node, data } : node));
    }, [setNodes]);
    (0, react_1.useEffect)(() => {
        if (flowId) {
            loadFlow(flowId);
        }
    }, [flowId]);
    const loadFlow = async (id) => {
        try {
            const flowData = await ivrFlowService_1.ivrFlowService.getFlow(id);
            setFlow(flowData);
            setNodes(transformToReactFlowNodes(flowData.nodes));
            setEdges(transformToReactFlowEdges(flowData.edges));
            setError(null);
        }
        catch (err) {
            setError('Failed to load flow');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = (0, react_1.useCallback)(async () => {
        if (!flow || !flowId)
            return;
        const { nodes: transformedNodes, edges: transformedEdges } = transformFromReactFlow(nodes, edges);
        try {
            await ivrFlowService_1.ivrFlowService.updateFlow(flowId, {
                ...flow,
                nodes: transformedNodes,
                edges: transformedEdges,
            });
        }
        catch (err) {
            setError('Failed to save flow');
        }
    }, [flow, flowId, nodes, edges]);
    if (loading)
        return <div>Loading...</div>;
    if (error)
        return <div>{error}</div>;
    if (!flow)
        return <div>Flow not found</div>;
    return (<BuilderContainer>
      <react_2.default nodes={nodes} edges={edges} nodeTypes={NodeTypes_1.nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeClick={handleNodeClick} onDragOver={onDragOver} onDrop={onDrop} fitView>
        <react_2.Background />
        <react_2.Controls />
        <react_2.Panel position="top-left">
          <NodePalette_1.NodePalette onDragStart={onNodeDragStart}/>
        </react_2.Panel>
        <react_2.Panel position="top-right">
          <SaveButton onClick={handleSave}>Save Flow</SaveButton>
        </react_2.Panel>
      </react_2.default>
      <NodeConfigSidebar_1.NodeConfigSidebar selectedNode={selectedNode} onClose={() => setSelectedNode(null)} onNodeUpdate={handleNodeUpdate}/>
    </BuilderContainer>);
};
exports.IvrFlowBuilderPage = IvrFlowBuilderPage;
//# sourceMappingURL=IvrFlowBuilderPage.js.map