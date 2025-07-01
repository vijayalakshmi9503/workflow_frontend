import React from 'react';
import { Form, Input, Select, Button, Space } from 'antd';

const { Option } = Select;

const StepForm = ({ form, steps, onFinish, onCancel, editingIndex }) => {
  const selectedAction = Form.useWatch('action', form);
  const selectedApprovalMode = Form.useWatch('approvalMode', form);
    // ✅ Watch target/resume step positions
    const targetStepPosition = Form.useWatch('targetStepPosition', form);
    const resumeStepPosition = Form.useWatch('resumeStepPosition', form);
  
    // ✅ Debug logs
    console.log('--- DEBUG StepForm ---');
    console.log('targetStepPosition:', targetStepPosition);
    console.log('resumeStepPosition:', resumeStepPosition);
  
  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
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
                <Option key={step.key} value={idx}>{`${idx + 1}. ${step.stepName}`}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Resume Step Position" name="resumeStepPosition" rules={[{ required: true }]}>
            <Select placeholder="Select resume step">
              {steps.map((step, idx) => (
                <Option key={step.key} value={idx}>{`${idx + 1}. ${step.stepName}`}</Option>
              ))}
            </Select>
          </Form.Item>
        </>
      )}

      {/* <Form.Item label="Previous Step Position" name="previousStepPosition">
        <Select allowClear placeholder="Select previous step">
          <Option value={null}>-- Start (Initial Step) --</Option>
          {steps.map((step, idx) => (
            <Option key={step.key} value={idx}>{`${idx + 1}. ${step.stepName}`}</Option>
          ))}
        </Select>
      </Form.Item> */}
      <Form.Item label="Previous Step Position" name="previousStepPosition">
        <Select allowClear placeholder="Select previous step">
          <Option value="start">-- Start (Initial Step) --</Option>
          {steps.map((step, idx) => (
            <Option key={step.key} value={idx}>{`${idx + 1}. ${step.stepName}`}</Option>
          ))}
        </Select>
      </Form.Item>
     

      <Form.Item label="Next Step Position" name="nextStepPosition">
        <Select allowClear placeholder="Select next step">
          {steps.map((step, idx) => (
            <Option key={step.key} value={idx}>{`${idx + 1}. ${step.stepName}`}</Option>
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
        <Form.Item label="Approval Count" name="approvalCount" rules={[{ required: true }]}>
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
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default StepForm;
