import React, { useState } from 'react';
import {
  Card, Form, Input, Button, Select, Divider, Table, Space, Checkbox
} from 'antd';
import {
  PlusOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable as arrayMove } from 'array-move';

const { Option } = Select;
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
));

const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

const Dashboard = () => {
  const [form] = Form.useForm();
  const [stepForm] = Form.useForm();
  const [steps, setSteps] = useState([]);
  const [showStepForm, setShowStepForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddStep = (values) => {
    const newStep = { ...values, key: Date.now() };
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

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([...steps], oldIndex, newIndex);
      setSteps(newData);
    }
  };

  const DraggableContainer = (props) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = steps.findIndex(x => x.key === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  const columns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Sl. No.',
      render: (_, __, index) => index + 1,
    },
    { title: 'Step Name', dataIndex: 'stepName' },
    { title: 'User Role', dataIndex: 'userRole' },
    { title: 'Action', dataIndex: 'action' },
    { title: 'Approval Mode', dataIndex: 'approvalMode' },
    { title: 'Execution Mode', dataIndex: 'executionMode' },
    { title: 'Requires User ID', dataIndex: 'requiresUserId' },
    { title: 'Is User ID Dynamic', dataIndex: 'isUserIdDynamic' },
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
              <Select>
                <Option value="approve">Approve</Option>
                <Option value="reject">Reject</Option>
                <Option value="revoke">Revoke</Option>
              </Select>
            </Form.Item>

            {/* Show if action == revoke */}
            {stepForm.getFieldValue('action') === 'revoke' && (
              <>
                <Form.Item label="Target Step Position" name="targetStepPosition">
                  <Input type="number" />
                </Form.Item>
                <Form.Item label="Resume Step Position" name="resumeStepPosition">
                  <Input type="number" />
                </Form.Item>
              </>
            )}

            <Form.Item label="Previous Step Position" name="previousStepPosition">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Next Step Position" name="nextStepPosition">
              <Input type="number" />
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

            {stepForm.getFieldValue('approvalMode') === 'specific' && (
              <Form.Item label="Specific User IDs" name="specificUserIds" rules={[{ required: true }]}>
                <Input placeholder="Comma-separated user IDs" />
              </Form.Item>
            )}

            <Form.Item label="Execution Mode" name="executionMode" rules={[{ required: true }]}>
              <Select>
                <Option value="parallel">Parallel</Option>
                <Option value="sequence">Sequence</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Approval Count (for N of M)" name="approvalCount">
              <Input type="number" min={1} />
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
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
      )}
    </Card>
  );
};

export default Dashboard;
