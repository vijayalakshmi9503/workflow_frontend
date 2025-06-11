import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Dropdown, Menu, Card } from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const initialData = [
  { key: 1, name: 'Alice', status: 'Pending' },
  { key: 2, name: 'Bob', status: 'Approved' },
  { key: 3, name: 'Charlie', status: 'Rejected' },
];

const Settings = () => {
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

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Settings');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    saveAs(new Blob([buf]), 'settings.xlsx');
  };

  const downloadCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'settings.csv');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'Status']],
      body: filteredData.map(item => [item.name, item.status]),
    });
    doc.save('settings.pdf');
  };

  const handleMenuClick = (e) => {
    if (e.key === 'excel') downloadExcel();
    else if (e.key === 'csv') downloadCSV();
    else if (e.key === 'pdf') downloadPDF();
  };

  const downloadMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="excel">Download Excel</Menu.Item>
      <Menu.Item key="csv">Download CSV</Menu.Item>
      <Menu.Item key="pdf">Download PDF</Menu.Item>
    </Menu>
  );

  const handleAction = (key, action) => {
    setData(prev =>
      prev.map(row =>
        row.key === key ? { ...row, status: action } : row
      )
    );
  };

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
      render: status => {
        let color = 'default';
        if (status === 'Approved') color = 'green';
        else if (status === 'Rejected') color = 'red';
        else if (status === 'Pending') color = 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            style={{ backgroundColor: '#52c41a', color: '#fff' }}
            onClick={() => handleAction(record.key, 'Approved')}
          >
            Approve
          </Button>
          <Button
            danger
            size="small"
            style={{ backgroundColor: 'rgb(207 19 74)', color: '#fff' }}
            onClick={() => handleAction(record.key, 'Rejected')}
          >
            Reject
          </Button>
          <Button
            size="small"
            style={{ backgroundColor: 'rgb(49 146 170)', color: '#fff' }}
            onClick={() => handleAction(record.key, 'Pending')}
          >
            Revoke
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        bordered
        style={{background: "#d2caca47",    fontSize:" 20px"}}
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
              <Button icon={<DownloadOutlined />}>
                Download
              </Button>
            </Dropdown>
          </Space>
        }
      >
        <Table
          bordered
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          rowKey="key"
        />
      </Card>
    </div>
  );
};

export default Settings;
