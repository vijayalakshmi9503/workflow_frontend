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
  message,
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
import { useNavigate } from 'react-router-dom'; // 👈 Required for navigation

const Users = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate(); // 👈 Init navigation

  const fetchWorkflow = async () => {
    try {
      const response = await axios.post(
        'http://10.180.6.66/Workflow-Manager/public/index.php/api/workflow/get',
        {
          user: {
            employee_id: '345412',
            role: 'employee',
          },
          workflow_id_: 'Wf_529',
        },
        {
          headers: {
            Authorization: 'Bearer workflow_engine_ssdg',
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const wf = response?.data?.data?.workflows;
      if (!wf) {
        return message.error('No workflow data found.');
      }

      const formatted = [
        {
          key: 1,
          name: wf.workflowName,
          status: 'Pending',
          workflow_id: wf.workflow_id,
          step_count: wf.step_count,
          image: wf.image,
        },
      ];

      setData(formatted);
      setFilteredData(formatted);
    } catch (error) {
      console.error('Fetch Error:', error);
      message.error('Failed to fetch workflow data.');
    }
  };

  useEffect(() => {
    fetchWorkflow();
  }, []);

  useEffect(() => {
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  const handleRefresh = () => fetchWorkflow();

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Workflow');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    saveAs(new Blob([buf]), 'workflow.xlsx');
  };

  const downloadCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'workflow.csv');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'Status', 'Workflow ID']],
      body: filteredData.map(item => [item.name, item.status, item.workflow_id]),
    });
    doc.save('workflow.pdf');
  };

  const handleMenuClick = e => {
    if (e.key === 'excel') downloadExcel();
    else if (e.key === 'csv') downloadCSV();
    else if (e.key === 'pdf') downloadPDF();
  };

  const handleEdit = record => {
    // 👇 Redirect to canvas/editor with state
    navigate(`/edit-workflow/${record.workflow_id}`, {
      state: {
        workflowImage: record.image,
        workflowName: record.name,
        workflowId: record.workflow_id,
      },
    });
  };

  const handleDelete = key => {
    Modal.confirm({
      title: 'Confirm Delete',
      onOk() {
        setData(prev => prev.filter(item => item.key !== key));
        setFilteredData(prev => prev.filter(item => item.key !== key));
      },
    });
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: img =>
        img ? <img src={img} alt="workflow" style={{ width: 40, height: 40 }} /> : '-',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Workflow ID',
      dataIndex: 'workflow_id',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: status => {
        let color = 'orange';
        if (status === 'Approved') color = 'green';
        else if (status === 'Rejected') color = 'red';
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
        style={{ background: '#f5f5f5' }}
        title={<span style={{ fontSize: '20px', fontWeight: '500' }}>Workflow Info</span>}
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
    </div>
  );
};

export default Users;
