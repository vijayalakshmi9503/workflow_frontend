// src/pages/Approvals.jsx
import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Dropdown, Menu } from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';

import ApprovalsTable from '../components/approvals/ApprovalsTable';
import ApprovalsActions from '../components/approvals/ApprovalsActions';
import { downloadExcel, downloadCSV, downloadPDF } from '../utils/fileUtils';

const initialData = [
  { key: 1, name: 'Alice', status: 'Pending' },
  { key: 2, name: 'Bob', status: 'Approved' },
  { key: 3, name: 'Charlie', status: 'Rejected' },
];

const Approvals = () => {
  const [data, setData] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(initialData);

  useEffect(() => {
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  const handleRefresh = () => {
    setData([...initialData]);
  };

  const handleMenuClick = (e) => {
    if (e.key === 'excel') downloadExcel(filteredData);
    else if (e.key === 'csv') downloadCSV(filteredData);
    else if (e.key === 'pdf') downloadPDF(filteredData);
  };

  const downloadMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="excel">Download Excel</Menu.Item>
      <Menu.Item key="csv">Download CSV</Menu.Item>
      <Menu.Item key="pdf">Download PDF</Menu.Item>
    </Menu>
  );

  return (
    <div style={{ padding: 20 }}>
      <Card
        bordered
        style={{ background: '#d2caca47', fontSize: '20px' }}
        title={<span style={{ fontSize: '20px', fontWeight: '500' }}>Admin Approvals</span>}
        extra={
          <Space wrap>
            <Input
              placeholder="Search by name"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              size="middle"
            />
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Refresh
            </Button>
            <Dropdown overlay={downloadMenu}>
              <Button icon={<DownloadOutlined />}>Download</Button>
            </Dropdown>
          </Space>
        }
      >
        <ApprovalsTable data={filteredData} />
      </Card>
    </div>
  );
};

export default Approvals;
