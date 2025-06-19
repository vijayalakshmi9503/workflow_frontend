import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
  MarkerType,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Card, Form, Input, Select, Button, Space } from 'antd';

const { Option } = Select;
const Sidebar = ({ items, onDragStart, onAddCustom }) => (
  <div style={{ width: 200, padding: 10, background: '#f4f4f4', borderRight: '1px solid #ccc' }}>
    <h4>Drag Components</h4>
    {items.map((item) => (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => onDragStart(e, item)}
        style={{
          padding: '8px 10px',
          marginBottom: 10,
          background: '#fff',
          border: '1px solid #aaa',
          borderRadius: 4,
          cursor: 'grab',
        }}
      >
        {item.label}
      </div>
    ))}
    <button onClick={onAddCustom} style={{ marginTop: 20 }}>＋ Add Custom</button>
  </div>
);

const CustomNode = ({ data, id }) => {
  const isTransition = data.isTransition;

  return (
    <div
      onDoubleClick={() => {
        const newLabel = prompt('Rename node', data.label);
        if (newLabel) {
          data.onRename(id, newLabel);
        }
      }}
      style={{
        padding: 10,
        background: '#fff',
          ...(isTransition && {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  }),
      
      
        textAlign: 'center',
        border: '1px solid #aaa',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <div>{data.label}</div>
      {data.formData && !isTransition && (
        <div style={{ fontSize: '12px', marginTop: 4, color: '#666' }}>
          {Object.entries(data.formData).map(([key, value]) => (
            <div key={key}>{key}: {value}</div>
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};


const DynamicForm = ({ nodeData, onClose, onSave }) => {
  const [formData] = useState(nodeData?.formData || {});
  const [stepForm] = Form.useForm();
  const [selectedAction, setSelectedAction] = useState(formData.action || []);
  const [selectedApprovalMode, setSelectedApprovalMode] = useState(formData.approvalMode || '');

  if (!nodeData) return null;

  const handleSave = async () => {
    const values = await stepForm.validateFields();
    onSave(values);
    onClose();
  };

  return (
    <div style={{
      position: 'absolute',
      top: 80,
      right: 30,
      width: 350,
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 20,
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000
    }}>
      <h4>{nodeData.label} - Step Form</h4>

      <Form
        layout="vertical"
        form={stepForm}
        initialValues={formData}
        onValuesChange={(changedValues) => {
          if (changedValues.action) setSelectedAction(changedValues.action);
          if (changedValues.approvalMode) setSelectedApprovalMode(changedValues.approvalMode);
        }}
      >
        <Form.Item label="Step Name" name="stepName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Step Description" name="stepDescription">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label="User Role" name="userRole" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Requires User ID" name="requiresUserId" rules={[{ required: true }]}>
          <Select>
            <Option value="yes">Yes</Option>
            <Option value="no">No</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Is User ID Dynamic" name="isUserIdDynamic" rules={[{ required: true }]}>
          <Select>
            <Option value="yes">Yes</Option>
            <Option value="no">No</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Approval Mode" name="approvalMode" rules={[{ required: true }]}>
          <Select>
            <Option value="all">All</Option>
            <Option value="any">Any</Option>
            <Option value="nofm">N of M</Option>
            <Option value="specific">Specific Users</Option>
          </Select>
        </Form.Item>

        {selectedApprovalMode === 'specific' && (
          <Form.Item label="Specific User IDs" name="specificUserIds" rules={[{ required: true }]}>
            <Input placeholder="Comma-separated user IDs" />
          </Form.Item>
        )}

        {selectedApprovalMode === 'nofm' && (
          <Form.Item
            label="Approval Count"
            name="approvalCount"
            rules={[{ required: true, message: 'Approval count is required for N of M' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        )}

        <Form.Item label="Execution Mode" name="executionMode" rules={[{ required: true }]}>
          <Select>
            <Option value="parallel">Parallel</Option>
            <Option value="sequence">Sequence</Option>
          </Select>
        </Form.Item>
      </Form>

      <div style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  data,
}) => {
  let edgePath;

  switch (data?.shape) {
    case 'step':
      [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
      break;
    case 'smoothstep':
      [edgePath] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY });
      break;
    case 'straight':
      edgePath = `M${sourceX},${sourceY} L${targetX},${targetY}`;
      break;
    default:
      [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });
  }

  const arrowColor = data?.arrowColor || data?.color || '#dc8f53';

  return (
    <>
      <defs>
        <marker
          id={`arrowhead-${id}`}
          markerWidth="20"
          markerHeight="20"
          refX="10"
          refY="5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L10,5 L0,10 Z" fill={arrowColor} />
        </marker>
      </defs>

      <path
        id={id}
        d={edgePath}
        style={{
          ...style,
          stroke: data?.color || '#4e4f7c',
          strokeWidth:1,
        }}
        className="react-flow__edge-path"
        markerEnd={`url(#arrowhead-${id})`}
      />

      {data?.label && (
        <text dy={-5}>
          <textPath
            href={`#${id}`}
            style={{ fontSize: 12, fill: '#0a7feefa' }}
            startOffset="50%"
            textAnchor="middle"
          >
            {data.label}
          </textPath>
        </text>
      )}
    </>
  );
};
function converstWorkflowToSteps(workflowName, workflowDesc, nodes, edges) {
  const incoming = {};
  const outgoing = {};

  edges.forEach(edge => {
    if (!outgoing[edge.source]) outgoing[edge.source] = [];
    if (!incoming[edge.target]) incoming[edge.target] = [];

    outgoing[edge.source].push({ target: edge.target, label: edge.data?.label });
    incoming[edge.target].push({ source: edge.source });
  });

  const workflow_steps = nodes
    .filter(node => node.data?.label && !node.data?.isTransition)
    .map(node => {
      const formData = node.data.formData || {};
      const outgoingEdges = outgoing[node.id] || [];
      const incomingEdges = incoming[node.id] || [];

      return {
        position: node.id,
        step_user_role: node.data.label.toLowerCase(),
        stepDescription: formData.stepDescription || '',
        requires_multiple_approvals: formData.approvalMode ? 'true' : 'false',
        approver_mode: formData.approvalMode || '',
        execution_mode: formData.executionMode || '',
        approval_count_required: formData.approvalMode === 'any' ? '1' : '',
        actions: outgoingEdges.map(e => e.label?.toLowerCase() || 'submit'),
        requires_user_id: formData.requiresUserId === 'yes' ? 'true' : 'false',
        is_user_id_dynamic: formData.isUserIdDynamic === 'yes' ? 'true' : 'false',
        targetStepPosition: '',
        resumeStepPosition: node.id,
        nextStepPosition: outgoingEdges[0]?.target || '',
        prevStepPosition: incomingEdges[0]?.source || ''
      };
    });

  return {
    user: {
      employee_id: "345412",
      role: "employee"
    },
    parentWorkflowId: "",
    workflowName,
    workflowDescription: workflowDesc,
    workflow_steps
  };
}

function convertWorkflowToSteps(workflowName, workflowDesc, nodes, edges) {
  const incoming = {};
  const outgoing = {};

  edges.forEach(edge => {
    if (!outgoing[edge.source]) outgoing[edge.source] = [];
    if (!incoming[edge.target]) incoming[edge.target] = [];

    outgoing[edge.source].push(edge);
    incoming[edge.target].push(edge);
  });
const stripNodePrefix = (nodeId) => nodeId.replace('node-', '');
  const workflow_steps = nodes
    .filter(node => node.data?.label && !node.data?.isTransition)
    .map(node => {
      const formData = node.data.formData || {};
      const outgoingEdges = outgoing[node.id] || [];
      const incomingEdges = incoming[node.id] || [];

      // Find revoke transition node connected to this node
      const transitions = outgoing[node.id] || [];
      const revokeTransition = transitions.find(e => {
        const transitionNode = nodes.find(n => n.id === e.target && n.data?.isTransition);
        return transitionNode?.data?.label?.toLowerCase() === 'revoke';
      });

      let targetStepPosition = '';
      let resumeStepPosition = '';

      if (revokeTransition) {
        const revokeNodeId = revokeTransition.target;

        // Find 2 outgoing edges from the "Revoke" node
        const revokeEdges = outgoing[revokeNodeId] || [];

       if (revokeEdges.length >= 2) {
        targetStepPosition = stripNodePrefix(revokeEdges[0].target);
        resumeStepPosition = stripNodePrefix(revokeEdges[1].target);
      }
      }

      return {
        position: node.id,
        step_user_role: node.data.label.toLowerCase(),
        stepDescription: formData.stepDescription || '',
        requires_multiple_approvals: formData.approvalMode ? 'true' : 'false',
        approver_mode: formData.approvalMode || '',
        execution_mode: formData.executionMode || '',
        approval_count_required: formData.approvalMode === 'any' ? '1' : '',
        actions: outgoingEdges.map(e => e.data?.label?.toLowerCase() || 'submit'),
        requires_user_id: formData.requiresUserId === 'yes' ? 'true' : 'false',
        is_user_id_dynamic: formData.isUserIdDynamic === 'yes' ? 'true' : 'false',
        targetStepPosition,
        resumeStepPosition,
        nextStepPosition: outgoingEdges[0]?.target || '',
        prevStepPosition: incomingEdges[0]?.source || ''
      };
    });

  return {
    user: {
      employee_id: "345412",
      role: "employee"
    },
    parentWorkflowId: "",
    workflowName,
    workflowDescription: workflowDesc,
    workflow_steps
  };
}

function convertWaorkflowToSteps(workflowName, workflowDesc, nodes, edges) {
  const incoming = {};
  const outgoing = {};

  edges.forEach(edge => {
    if (!outgoing[edge.source]) outgoing[edge.source] = [];
    if (!incoming[edge.target]) incoming[edge.target] = [];

    outgoing[edge.source].push({
      target: edge.target,
      label: edge.data?.label,
      targetStepPosition: edge.data?.targetStepPosition || '',
      resumeStepPosition: edge.data?.resumeStepPosition || ''
    });

    incoming[edge.target].push({ source: edge.source });
  });

  const workflow_steps = nodes
    .filter(node => node.data?.label && !node.data?.isTransition)
    .map(node => {
      const formData = node.data.formData || {};
      const outgoingEdges = outgoing[node.id] || [];
      const incomingEdges = incoming[node.id] || [];

      // Find the revoke edge (if exists)
      const revokeEdge = outgoingEdges.find(e => e.label?.toLowerCase() === 'revoke');

      return {
        position: node.id,
        step_user_role: node.data.label.toLowerCase(),
        stepDescription: formData.stepDescription || '',
        requires_multiple_approvals: formData.approvalMode ? 'true' : 'false',
        approver_mode: formData.approvalMode || '',
        execution_mode: formData.executionMode || '',
        approval_count_required: formData.approvalMode === 'any' ? '1' : '',
        actions: outgoingEdges.map(e => e.label?.toLowerCase() || 'submit'),
        requires_user_id: formData.requiresUserId === 'yes' ? 'true' : 'false',
        is_user_id_dynamic: formData.isUserIdDynamic === 'yes' ? 'true' : 'false',
        targetStepPosition: revokeEdge?.targetStepPosition || '',
        resumeStepPosition: revokeEdge?.resumeStepPosition || node.id,
        nextStepPosition: outgoingEdges[0]?.target || '',
        prevStepPosition: incomingEdges[0]?.source || ''
      };
    });

  return {
    user: {
      employee_id: "345412",
      role: "employee"
    },
    parentWorkflowId: "",
    workflowName,
    workflowDescription: workflowDesc,
    workflow_steps
  };
}

const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeId, setNodeId] = useState(1);
  const [showSaveModal, setShowSaveModal] = useState(false);
const [workflowName, setWorkflowName] = useState('');
const [workflowDesc, setWorkflowDesc] = useState('');

  const [customCount, setCustomCount] = useState(1);
  const [menuItems, setMenuItems] = useState([
    { id: 'EMPLOYEE', label: 'Employee' },
    { id: 'fla', label: 'FLA' },
    { id: 'sla', label: 'SLA' },
    { id: 'cla', label: 'CLA' },
    { id: 'xyz', label: 'XYZ' },
  ]);

  const [activeNode, setActiveNode] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [showForm, setShowForm] = useState(false);

const deleteNode = (id) => {
  setNodes((nds) => {
    // Find all edges connected to the node
    const connectedEdges = edges.filter(e => e.source === id || e.target === id);

    // Get all transition node IDs connected to this node via outgoing edge
    const transitionNodeIds = connectedEdges
      .filter(e => e.source === id) // only outgoing transitions
      .map(e => e.target);

    // Filter out the node itself and its connected transition nodes
    const remainingNodes = nds.filter(
      n => n.id !== id && !transitionNodeIds.includes(n.id)
    );

    return remainingNodes;
  });

  setEdges((eds) => {
    return eds.filter(
      e =>
        e.source !== id &&
        e.target !== id &&
        !edges.some(edge => edge.source === id && edge.target === e.source) && // transition edges
        !edges.some(edge => edge.source === id && edge.target === e.target)
    );
  });
};


  const renameNode = (id, newLabel) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: newLabel } } : n
      )
    );
  };

  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      id: `${params.source}-${params.target}-${Date.now()}`,
      type: 'customEdge',
      data: { label: 'Approve' },
      markerEnd: { type: MarkerType.Arrow },
      style: { stroke: '#000' },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, []);

  const onDragStart = (event, item) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(item));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const bounds = event.currentTarget.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;
      const item = JSON.parse(data);
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      const newNode = {
        id: `node-${nodeId}`,
        type: 'customNode',
        position,
        data: {
          label: item.label,
          onDelete: deleteNode,
          onRename: renameNode,
          isTransition: false,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setNodeId((prev) => prev + 1);
    },
    [nodeId]
  );

  const onNodseClick = (event, node) => {
    event.stopPropagation();
    setMenuPosition({
      x: node.position.x + 120,
      y: node.position.y + 50,
      nodeId: node.id,
    });
    setActiveNode(node);
  };
const onNodeClick = (event, node) => {
  event.stopPropagation();
  const clickX = event.clientX;
  const clickY = event.clientY;

  setMenuPosition({
    x: clickX,
    y: clickY,
    nodeId: node.id,
  });
  setActiveNode(node);
};

  const onAddCustom = () => {
    const newId = `custom-${customCount}`;
    setMenuItems((prev) => [
      ...prev,
      { id: newId, label: `Custom ${customCount}` },
    ]);
    setCustomCount((prev) => prev + 1);
  };

const onEdgeClick = (event, edge) => {
  event.stopPropagation();
  const label = prompt(
    'Enter transition: Approve / Reject / Revoke',
    edge.data?.label || 'Approve'
  );

  if (label) {
    const newData = { ...edge.data, label };

    if (label.toLowerCase() === 'revoke') {
      const targetStepPosition = prompt('Enter targetStepPosition', edge.data?.targetStepPosition || '');
      const resumeStepPosition = prompt('Enter resumeStepPosition', edge.data?.resumeStepPosition || '');
      newData.targetStepPosition = targetStepPosition;
      newData.resumeStepPosition = resumeStepPosition;
    }

    setEdges((eds) =>
      eds.map((e) => (e.id === edge.id ? { ...e, data: newData } : e))
    );
  }
};

  const saveFlowToJSON = () => {
    const flowData = {
      nodes,
      edges,
    };

    const blob = new Blob([JSON.stringify(flowData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flow-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const nodeTypes = { customNode: CustomNode };
  const edgeTypes = { customEdge: CustomEdge };

  return (
    <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
      <Sidebar items={menuItems} onDragStart={onDragStart} onAddCustom={onAddCustom} />

      <div style={{ flexGrow: 1 }} onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
        {/* 💾 Save Button */}
      
<button  style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1000,
            background: '#28a745',
            color: 'white',
            padding: '8px 14px',
            borderRadius: 4,
            border: 'none',
            cursor: 'pointer',
          }} onClick={() => setShowSaveModal(true)}>💾 Save</button>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeUpdate={(oldEdge, newConnection) => {
            setEdges((eds) =>
              eds.map((e) =>
                e.id === oldEdge.id ? { ...e, ...newConnection } : e
              )
            );
          }}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          edgeUpdaterRadius={20}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>

        {menuPosition && (
          <div
            style={{
              position: 'absolute',
              top: menuPosition.y,
              left: menuPosition.x,
              zIndex: 1000,
              background: '#fff',
              border: '1px solid #aaa',
              borderRadius: 5,
              padding: '5px 10px',
              display: 'flex',
              gap: 10,
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            <button onClick={() => setShowForm(true)}>📝 Form</button>
            <button
              onClick={() => {
                const node = nodes.find((n) => n.id === menuPosition.nodeId);
                if (!node) return;
                const action = prompt('Enter transition action', 'Approve');
                if (!action) return;

                const transitionNodeId = `node-${nodeId}`;
                const offsetX = Math.floor(Math.random() * 120) - 60;

                const transitionNode = {
                  id: transitionNodeId,
                  type: 'customNode',
                  position: {
                    x: node.position.x + offsetX,
                    y: node.position.y + 120,
                  },
                  data: {
                    label: action,
                    onDelete: deleteNode,
                    onRename: renameNode,
                    isTransition: true,
                  },
                };

                const transitionEdge = {
                  id: `edge-${node.id}-${transitionNodeId}`,
                  source: node.id,
                  target: transitionNodeId,
                  type: 'customEdge',
                  data: { label: action, shape: 'step' },
                  markerEnd: { type: MarkerType.Arrow },
                  style: { stroke: '#000' },
                };

                setNodes((nds) => [...nds, transitionNode]);
                setEdges((eds) => [...eds, transitionEdge]);
                setNodeId((id) => id + 1);
                setMenuPosition(null);
              }}
            >
              🔁 Transition
            </button>
             <button
      onClick={() => {
        deleteNode(menuPosition.nodeId);
        setMenuPosition(null);
      }}
    >
      🗑 Delete
    </button>
            <button onClick={() => setMenuPosition(null)}>❌</button>
          </div>
        )}

        {activeNode && showForm && (
          <DynamicForm
            nodeData={activeNode.data}
            onClose={() => {
              setShowForm(false);
              setMenuPosition(null);
            }}
            onSave={(data) => {
              setNodes((nds) =>
                nds.map((n) =>
                  n.id === activeNode.id
                    ? {
                        ...n,
                        data: {
                          ...n.data,
                          formData: data,
                          label: n.data.label,
                        },
                      }
                    : n
                )
              );
                setShowForm(false);      // close modal
  setActiveNode(null);     // clear active node
  setMenuPosition(null);   // reset menu
            }}
          />
        )}
      </div>
      {showSaveModal && (
  <div style={{
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{
      background: 'white',
      padding: 20,
      borderRadius: 8,
      width: 400,
      boxShadow: '0 0 10px rgba(0,0,0,0.3)'
    }}>
      <h3>Save Workflow</h3>
      <div style={{ marginBottom: 10 }}>
        <label>Workflow Name:</label>
        <input
          type="text"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Description:</label>
        <textarea
          value={workflowDesc}
          onChange={(e) => setWorkflowDesc(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button onClick={() => setShowSaveModal(false)}>Cancel</button>
    <button
  onClick={async () => {
    const flowData = convertWorkflowToSteps(workflowName, workflowDesc, nodes, edges);

    // 🔽 1. Hit the API
    try {
      const response = await fetch('http://10.180.6.66/Workflow-Manager/public/index.php/api/workflow/create', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer workflow_engine_ssdg',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(flowData)
      });

      const result = await response.json();
      console.log('API response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'API call failed');
      }
    } catch (error) {
      console.error('Error while saving to API:', error);
    }

    // 🔽 2. Download the file
    const blob = new Blob([JSON.stringify(flowData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName || 'flow-data'}.json`;
    a.click();
    URL.revokeObjectURL(url);

    // 🔽 3. Reset modal and form
    setShowSaveModal(false);
    setWorkflowName('');
    setWorkflowDesc('');
  }}
  style={{
    background: '#28a745',
    color: '#fff',
    padding: '6px 14px',
    border: 'none',
    borderRadius: 4
  }}
>
  Save
</button>

      </div>
    </div>
  </div>
)}

    </div>
    
  );
};

export default function DragDropBuilder() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
