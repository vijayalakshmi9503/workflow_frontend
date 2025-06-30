// src/components/approvals/ApprovalsActions.jsx
import React from 'react';
import { Button, Space } from 'antd';

const ApprovalsActions = ({ record }) => {
  const handleAction = (action) => {
    console.log(`Action on ${record.name}: ${action}`);
  };

  return (
    <Space>
      <Button type="primary" size="small" style={{ backgroundColor: '#52c41a', color: '#fff' }} onClick={() => handleAction('Approved')}>
        Approve
      </Button>
      <Button danger size="small" style={{ backgroundColor: 'rgb(207 19 74)', color: '#fff' }} onClick={() => handleAction('Rejected')}>
        Reject
      </Button>
      <Button size="small" style={{ backgroundColor: 'rgb(49 146 170)', color: '#fff' }} onClick={() => handleAction('Pending')}>
        Revoke
      </Button>
    </Space>
  );
};

export default ApprovalsActions;
