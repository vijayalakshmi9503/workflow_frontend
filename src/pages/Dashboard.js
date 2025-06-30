// import React, { useState } from 'react';
// import {
//   Card, Form, Input, Button, Select, Divider, Table, Space, message
// } from 'antd';
// import {
//   PlusOutlined,
//   MenuOutlined
// } from '@ant-design/icons';
// import axios from 'axios';
// import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
// import { arrayMoveImmutable as arrayMove } from 'array-move';

// const { Option } = Select;
// const DragHandle = sortableHandle(() => (
//   <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
// ));

// const SortableItem = SortableElement((props) => <tr {...props} />);
// const SortableBody = SortableContainer((props) => <tbody {...props} />);

// const Dashboard = () => {
//   const [form] = Form.useForm();
//   const [stepForm] = Form.useForm();
//   const [steps, setSteps] = useState([]);
//   const [showStepForm, setShowStepForm] = useState(false);
//   const [editingIndex, setEditingIndex] = useState(null);

//   const selectedAction = Form.useWatch('action', stepForm);
//   const selectedApprovalMode = Form.useWatch('approvalMode', stepForm);

//   const handleAddStep = (values) => {
//     const newStep = {
//       ...values,
//       key: Date.now()
//     };

//     const updatedSteps = [...steps];
//     if (editingIndex !== null) {
//       updatedSteps[editingIndex] = newStep;
//     } else {
//       updatedSteps.push(newStep);
//     }

//     setSteps(updatedSteps);
//     setShowStepForm(false);
//     stepForm.resetFields();
//     setEditingIndex(null);
//   };

//   const handleEdit = (record, index) => {
//     setShowStepForm(true);
//     stepForm.setFieldsValue(record);
//     setEditingIndex(index);
//   };

//   const handleDelete = (index) => {
//     const updatedSteps = [...steps];
//     updatedSteps.splice(index, 1);
//     setSteps(updatedSteps);
//   };

//   const onSortEnd = ({ oldIndex, newIndex }) => {
//     if (oldIndex !== newIndex) {
//       const newData = arrayMove([...steps], oldIndex, newIndex);
//       setSteps(newData);
//     }
//   };

//   const DraggableContainer = (props) => (
//     <SortableBody
//       useDragHandle
//       disableAutoscroll
//       helperClass="row-dragging"
//       onSortEnd={onSortEnd}
//       {...props}
//     />
//   );

//   const DraggableBodyRow = ({ className, style, ...restProps }) => {
//     const index = steps.findIndex(x => x.key === restProps['data-row-key']);
//     return <SortableItem index={index} {...restProps} />;
//   };
// const handleSubmitWorkflow = async () => {
//   try {
//     const values = await form.validateFields();

//     if (steps.length === 0) {
//       message.error("Please add at least one step to the workflow.");
//       return;
//     }

//     const transformedSteps = steps.map((step, index) => ({
//       position: (index + 1).toString(),
//       step_user_role: step.userRole || '',
//       stepDescription: step.stepDescription || '',
//       requires_multiple_approvals: step.requires_multiple_approvals || 'false',
//       approver_mode: step.approvalMode || '',
//       execution_mode: step.executionMode || '',
//       approval_count_required: step.approval_count_required || '',
//       actions: step.action || [],
//       requires_user_id: step.requiresUserId || 'false',
//       is_user_id_dynamic: step.isUserIdDynamic || 'false',
//       targetStepPosition: step.targetStepPosition || '',
//       resumeStepPosition: step.resumeStepPosition || (index + 1).toString(),
//       nextStepPosition: index + 1 < steps.length ? (index + 2).toString() : '',
//       prevStepPosition: index === 0 ? '' : index.toString()
//     }));

//     const workflow = {
//       user: {
//         employee_id: "345412",
//         role: "employee"
//       },
//       parentWorkflowId: "",
//       workflowName: values.workflowName,
//       workflowDescription: values.workflowDescription,
//       workflow_steps: transformedSteps
//     };

//     const response = await axios.post(
//       'http://10.180.6.66/Workflow-Manager/public/index.php/api/workflow/create',
//       workflow,
//       {
//         headers: {
//           'Authorization': 'Bearer workflow_engine_ssdg',  // ✅ Correct token format
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       }
//     );

//     message.success("Workflow submitted successfully!");
//     console.log("API Response:", response.data);
//   } catch (error) {
//     if (error.response) {
//       console.error("API Error:", error.response.data);
//       message.error(`Submission failed: ${error.response.data.message || 'Unknown error'}`);
//     } else {
//       console.error("Error:", error.message);
//       message.error("Submission failed. Check the console for details.");
//     }
//   }
// };



//   const columns = [
//     {
//       title: '',
//       dataIndex: 'sort',
//       width: 30,
//       className: 'drag-visible',
//       render: () => <DragHandle />,
//     },
//     {
//       title: 'Sl. No.',
//       render: (_, __, index) => index + 1,
//     },
//     { title: 'Step Name', dataIndex: 'stepName' },
//     { title: 'User Role', dataIndex: 'userRole' },
//     {
//       title: 'Action',
//       dataIndex: 'action',
//       render: (actions) => actions?.join(', ')
//     },
//     { title: 'Approval Mode', dataIndex: 'approvalMode' },
//     { title: 'Execution Mode', dataIndex: 'executionMode' },
//     { title: 'Requires User ID', dataIndex: 'requiresUserId' },
//     { title: 'Is User ID Dynamic', dataIndex: 'isUserIdDynamic' },
//     {
//       title: 'Initial Step',
//       render: (_, record) =>
//         record.previousStepPosition === null || record.previousStepPosition === undefined
//           ? 'Yes'
//           : 'No',
//     },
//     {
//       title: 'Actions',
//       render: (_, record, index) => (
//         <Space>
//           <Button size="small" onClick={() => handleEdit(record, index)}>Edit</Button>
//           <Button size="small" danger onClick={() => handleDelete(index)}>Delete</Button>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <Card title="Workflow Builder" style={{ width: '90%', margin: '20px auto', background: '#f5f5f5' }}>
//       <Form layout="vertical" form={form}>
//         <Form.Item label="Workflow Name" name="workflowName" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>
//         <Form.Item label="Workflow Description" name="workflowDescription" rules={[{ required: true }]}>
//           <Input.TextArea rows={3} />
//         </Form.Item>
//       </Form>

//       <Divider />

//       {!showStepForm && (
//         <Button
//           type="dashed"
//           icon={<PlusOutlined />}
//           onClick={() => setShowStepForm(true)}
//           block
//         >
//           Add Step
//         </Button>
//       )}

//       {showStepForm && (
//         <Card title={editingIndex !== null ? 'Edit Step' : 'Add Step'} size="small" style={{ marginTop: 16 }}>
//           <Form layout="vertical" form={stepForm} onFinish={handleAddStep}>
//             <Form.Item label="Step Name" name="stepName" rules={[{ required: true }]}>
//               <Input />
//             </Form.Item>

//             <Form.Item label="Step Description" name="stepDescription">
//               <Input.TextArea rows={2} />
//             </Form.Item>

//             <Form.Item label="User Role" name="userRole" rules={[{ required: true }]}>
//               <Input />
//             </Form.Item>

//             <Form.Item label="Action" name="action" rules={[{ required: true }]}>
//               <Select mode="multiple" placeholder="Select actions">
//                 <Option value="approve">Approve</Option>
//                 <Option value="reject">Reject</Option>
//                 <Option value="revoke">Revoke</Option>
//               </Select>
//             </Form.Item>

//             {Array.isArray(selectedAction) && selectedAction.includes('revoke') && (
//               <>
//                 <Form.Item label="Target Step Position" name="targetStepPosition" rules={[{ required: true }]}>
//                   <Select placeholder="Select target step">
//                     {steps.map((step, idx) => (
//                       <Option key={step.key} value={idx}>
//                         {`${idx + 1}. ${step.stepName}`}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>

//                 <Form.Item label="Resume Step Position" name="resumeStepPosition" rules={[{ required: true }]}>
//                   <Select placeholder="Select resume step">
//                     {steps.map((step, idx) => (
//                       <Option key={step.key} value={idx}>
//                         {`${idx + 1}. ${step.stepName}`}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </>
//             )}

//             <Form.Item label="Previous Step Position" name="previousStepPosition">
//               <Select allowClear placeholder="Select previous step">
//                 <Option value={null}>-- Start (Initial Step) --</Option>
//                 {steps.map((step, idx) => (
//                   <Option key={step.key} value={idx}>
//                     {`${idx + 1}. ${step.stepName}`}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item label="Next Step Position" name="nextStepPosition">
//               <Select allowClear placeholder="Select next step">
//                 {steps.map((step, idx) => (
//                   <Option key={step.key} value={idx}>
//                     {`${idx + 1}. ${step.stepName}`}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item label="Requires User ID" name="requiresUserId" rules={[{ required: true }]}>
//               <Select>
//                 <Option value="yes">Yes</Option>
//                 <Option value="no">No</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item label="Is User ID Dynamic" name="isUserIdDynamic" rules={[{ required: true }]}>
//               <Select>
//                 <Option value="yes">Yes</Option>
//                 <Option value="no">No</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item label="Approval Mode" name="approvalMode" rules={[{ required: true }]}>
//               <Select>
//                 <Option value="all">All</Option>
//                 <Option value="any">Any</Option>
//                 <Option value="nofm">N of M</Option>
//                 <Option value="specific">Specific Users</Option>
//               </Select>
//             </Form.Item>

//             {selectedApprovalMode === 'specific' && (
//               <Form.Item label="Specific User IDs" name="specificUserIds" rules={[{ required: true }]}>
//                 <Input placeholder="Comma-separated user IDs" />
//               </Form.Item>
//             )}

//             {selectedApprovalMode === 'nofm' && (
//               <Form.Item
//                 label="Approval Count (for N of M)"
//                 name="approvalCount"
//                 rules={[{ required: true, message: 'Approval count is required for N of M mode' }]}
//               >
//                 <Input type="number" min={1} />
//               </Form.Item>
//             )}

//             <Form.Item label="Execution Mode" name="executionMode" rules={[{ required: true }]}>
//               <Select>
//                 <Option value="parallel">Parallel</Option>
//                 <Option value="sequence">Sequence</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item>
//               <Space>
//                 <Button htmlType="submit" type="primary">
//                   {editingIndex !== null ? 'Update Step' : 'Save Step'}
//                 </Button>
//                 <Button onClick={() => {
//                   stepForm.resetFields();
//                   setShowStepForm(false);
//                   setEditingIndex(null);
//                 }}>
//                   Cancel
//                 </Button>
//               </Space>
//             </Form.Item>
//           </Form>
//         </Card>
//       )}

//       <Divider />

//       {steps.length > 0 && (
//         <Table
//           dataSource={steps}
//           columns={columns}
//           pagination={false}
//           rowKey="key"
//           components={{
//             body: {
//               wrapper: DraggableContainer,
//               row: DraggableBodyRow,
//             },
//           }}
//         />
//       )}

//       <Divider />

//       <Button type="primary" onClick={handleSubmitWorkflow} block>
//         Submit Workflow
//       </Button>
//     </Card>
//   );
// };

// export default Dashboard;
import React, { useState } from 'react';
import {
  Card, Form, Input, Button, Select, Divider, Table, Space, message
} from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';
import axios from 'axios';
import API_CONFIG from '../config/apiConfig';  // Adjust path if needed

const { Option } = Select;

const Dashboard = () => {
  const [form] = Form.useForm();
  const [stepForm] = Form.useForm();
  const [steps, setSteps] = useState([]);
  const [showStepForm, setShowStepForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const selectedAction = Form.useWatch('action', stepForm);
  const selectedApprovalMode = Form.useWatch('approvalMode', stepForm);

  const handleAddStep = (values) => {
    const newStep = {
      ...values,
      key: Date.now()
    };

    const updatedSteps = [...steps];
    if (editingIndex !== null) {
      updatedSteps[editingIndex] = newStep;
    } else {
      updatedSteps.push(newStep);
    }

    setSteps(updatedSteps);
    setShowStepForm(false);
    stepForm.resetFields();
    setEditingIndex(null);
  };

  const handleEdit = (record, index) => {
    setShowStepForm(true);
    stepForm.setFieldsValue(record);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    setSteps(updatedSteps);
  };

  const handleSubmitWorkflow = async () => {
    try {
      const values = await form.validateFields();

      if (steps.length === 0) {
        message.error("Please add at least one step to the workflow.");
        return;
      }

      const transformedSteps = steps.map((step, index) => ({
        position: (index + 1).toString(),
        step_user_role: step.userRole || '',
        stepDescription: step.stepDescription || '',
        requires_multiple_approvals: step.requires_multiple_approvals || 'false',
        approver_mode: step.approvalMode || '',
        execution_mode: step.executionMode || '',
        approval_count_required: step.approval_count_required || '',
        actions: step.action || [],
        requires_user_id: step.requiresUserId || 'false',
        is_user_id_dynamic: step.isUserIdDynamic || 'false',
        targetStepPosition: step.targetStepPosition || '',
        resumeStepPosition: step.resumeStepPosition || (index + 1).toString(),
        nextStepPosition: index + 1 < steps.length ? (index + 2).toString() : '',
        prevStepPosition: index === 0 ? '' : index.toString()
      }));

      const workflow = {
        user: {
          employee_id: "345412",
          role: "employee"
        },
        parentWorkflowId: "",
        workflowName: values.workflowName,
        workflowDescription: values.workflowDescription,
        workflow_steps: transformedSteps
      };

      const response = await axios.post(
        `${API_CONFIG.BASE_URL
        }api/workflow/create`,
        workflow,
        {
          headers: {
            'Authorization': 'Bearer workflow_engine_ssdg',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      message.success("Workflow submitted successfully!");
      console.log("API Response:", response.data);
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
        message.error(`Submission failed: ${error.response.data.message || 'Unknown error'}`);
      } else {
        console.error("Error:", error.message);
        message.error("Submission failed. Check the console for details.");
      }
    }
  };

  const columns = [
    {
      title: 'Sl. No.',
      render: (_, __, index) => index + 1,
    },
    { title: 'Step Name', dataIndex: 'stepName' },
    { title: 'User Role', dataIndex: 'userRole' },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (actions) => actions?.join(', ')
    },
    { title: 'Approval Mode', dataIndex: 'approvalMode' },
    { title: 'Execution Mode', dataIndex: 'executionMode' },
    { title: 'Requires User ID', dataIndex: 'requiresUserId' },
    { title: 'Is User ID Dynamic', dataIndex: 'isUserIdDynamic' },
    {
      title: 'Initial Step',
      render: (_, record) =>
        record.previousStepPosition === null || record.previousStepPosition === undefined
          ? 'Yes'
          : 'No',
    },
    {
      title: 'Actions',
      render: (_, record, index) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record, index)}>Edit</Button>
          <Button size="small" danger onClick={() => handleDelete(index)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Workflow Builder" style={{ width: '90%', margin: '20px auto', background: '#f5f5f5' }}>
      <Form layout="vertical" form={form}>
        <Form.Item label="Workflow Name" name="workflowName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Workflow Description" name="workflowDescription" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>

      <Divider />

      {!showStepForm && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setShowStepForm(true)}
          block
        >
          Add Step
        </Button>
      )}

      {showStepForm && (
        <Card title={editingIndex !== null ? 'Edit Step' : 'Add Step'} size="small" style={{ marginTop: 16 }}>
          <Form layout="vertical" form={stepForm} onFinish={handleAddStep}>
            <Form.Item label="Step Name" name="stepName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Step Description" name="stepDescription">
              <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item label="User Role" name="userRole" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Action" name="action" rules={[{ required: true }]}>
              <Select mode="multiple" placeholder="Select actions">
                <Option value="approve">Approve</Option>
                <Option value="reject">Reject</Option>
                <Option value="revoke">Revoke</Option>
              </Select>
            </Form.Item>

            {Array.isArray(selectedAction) && selectedAction.includes('revoke') && (
              <>
                <Form.Item label="Target Step Position" name="targetStepPosition" rules={[{ required: true }]}>
                  <Select placeholder="Select target step">
                    {steps.map((step, idx) => (
                      <Option key={step.key} value={idx}>
                        {`${idx + 1}. ${step.stepName}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Resume Step Position" name="resumeStepPosition" rules={[{ required: true }]}>
                  <Select placeholder="Select resume step">
                    {steps.map((step, idx) => (
                      <Option key={step.key} value={idx}>
                        {`${idx + 1}. ${step.stepName}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )}

            <Form.Item label="Previous Step Position" name="previousStepPosition">
              <Select allowClear placeholder="Select previous step">
                <Option value={null}>-- Start (Initial Step) --</Option>
                {steps.map((step, idx) => (
                  <Option key={step.key} value={idx}>
                    {`${idx + 1}. ${step.stepName}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Next Step Position" name="nextStepPosition">
              <Select allowClear placeholder="Select next step">
                {steps.map((step, idx) => (
                  <Option key={step.key} value={idx}>
                    {`${idx + 1}. ${step.stepName}`}
                  </Option>
                ))}
              </Select>
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
                label="Approval Count (for N of M)"
                name="approvalCount"
                rules={[{ required: true, message: 'Approval count is required for N of M mode' }]}
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

            <Form.Item>
              <Space>
                <Button htmlType="submit" type="primary">
                  {editingIndex !== null ? 'Update Step' : 'Save Step'}
                </Button>
                <Button onClick={() => {
                  stepForm.resetFields();
                  setShowStepForm(false);
                  setEditingIndex(null);
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      <Divider />

      {steps.length > 0 && (
        <Table
          dataSource={steps}
          columns={columns}
          pagination={false}
          rowKey="key"
        />
      )}

      <Divider />

      <Button type="primary" onClick={handleSubmitWorkflow} block>
        Submit Workflow
      </Button>
    </Card>
  );
};

export default Dashboard;
