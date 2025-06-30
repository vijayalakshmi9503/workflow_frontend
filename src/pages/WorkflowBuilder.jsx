import React, { useState } from 'react';
import { Card, Divider, Button, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import StepForm from '../components/workflow/StepForm';
import StepTable from '../components/workflow/StepTable';
import { transformSteps } from '../utils/workflowHelpers';
import { submitWorkflow } from '../api/workflows';

const WorkflowBuilder = () => {
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

  const handleSubmitWorkflow = async () => {
    try {
      const values = await form.validateFields();

      if (steps.length === 0) {
        message.error('Please add at least one step to the workflow.');
        return;
      }

      const payload = {
        user: { employee_id: '345412', role: 'employee' },
        parentWorkflowId: '',
        workflowName: values.workflowName,
        workflowDescription: values.workflowDescription,
        workflow_steps: transformSteps(steps),
      };

      await submitWorkflow(payload);
      message.success('Workflow submitted successfully!');
    } catch (error) {
      message.error(error.message || 'Submission failed.');
    }
  };

  return (
    <Card
      title="Workflow Builder"
      style={{ width: '90%', margin: '20px auto', background: '#f5f5f5' }}
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Workflow Name" name="workflowName" rules={[{ required: true }]}>
          <input />
        </Form.Item>
        <Form.Item label="Workflow Description" name="workflowDescription" rules={[{ required: true }]}>
          <textarea rows={3} />
        </Form.Item>
      </Form>

      <Divider />

      {!showStepForm && (
        <Button type="dashed" icon={<PlusOutlined />} onClick={() => setShowStepForm(true)} block>
          Add Step
        </Button>
      )}

      {showStepForm && (
        <StepForm
          form={stepForm}
          steps={steps}
          onFinish={handleAddStep}
          onCancel={() => {
            stepForm.resetFields();
            setShowStepForm(false);
            setEditingIndex(null);
          }}
          editingIndex={editingIndex}
        />
      )}

      <Divider />

      {steps.length > 0 && (
        <StepTable steps={steps} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <Divider />

      <Button type="primary" onClick={handleSubmitWorkflow} block>
        Submit Workflow
      </Button>
    </Card>
  );
};

export default WorkflowBuilder;
