import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Dropdown,
  Menu,
  Card,
  Modal,
  Form,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteFilled,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

const initialData = [
  { key: 1, name: 'Alice', status: 'Pending' },
  { key: 2, name: 'Bob', status: 'Approved' },
  { key: 3, name: 'Charlie', status: 'Rejected' },
];

const Users = () => {
  const [data, setData] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

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

  const handleMenuClick = e => {
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

  const handleEdit = record => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

const handleDelete = (key) => {
  console.log('handleDelete called for key:', key);

Modal.confirm({
      title: 'Test Confirm',
      onOk() {
        console.log('Modal confirmed');
      },
      onCancel() {
        console.log('Modal cancelled');
      },
    });
};


  const handleFormSubmit = () => {
    form.validateFields().then(values => {
      setData(prev =>
        prev.map(item =>
          item.key === editingRecord.key ? { ...item, ...values } : item
        )
      );
      setIsModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
    });
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
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            icon={<DeleteFilled />}
            size="small"
            onClick={() => handleDelete(record.key)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        bordered
        style={{ background: '#d2caca47' }}
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
        <Table
          bordered
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          rowKey="key"
        />
      </Card>

      <Modal
        title="Edit User"
        open={isModalVisible}
        onOk={handleFormSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText="Update"
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
