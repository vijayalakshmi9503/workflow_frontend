import React from 'react';
import { Table, Button, Space } from 'antd';

const StepTable = ({ steps, onEdit, onDelete }) => {
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
          <Button size="small" onClick={() => onEdit(record, index)}>Edit</Button>
          <Button size="small" danger onClick={() => onDelete(index)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return <Table dataSource={steps} columns={columns} pagination={false} rowKey="key" />;
};

export default StepTable;
