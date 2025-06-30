// src/components/approvals/ApprovalsTable.jsx
import React from 'react';
import { Table, Tag, Button, Space } from 'antd';

import ApprovalsActions from './ApprovalsActions';

const ApprovalsTable = ({ data }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = 'default';
        if (status === 'Approved') color = 'green';
        else if (status === 'Rejected') color = 'red';
        else if (status === 'Pending') color = 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      render: (_, record) => <ApprovalsActions record={record} />,
    },
  ];

  return <Table bordered columns={columns} dataSource={data} pagination={{ pageSize: 5 }} rowKey="key" />;
};

export default ApprovalsTable;
