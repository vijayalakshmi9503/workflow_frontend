export const transformSteps = (steps) => {
    return steps.map((step, index) => ({
      position: (index + 1).toString(),
      step_user_role: step.userRole || '',
      stepDescription: step.stepDescription || '',
      requires_multiple_approvals: step.requires_multiple_approvals || 'false',
      approver_mode: step.approvalMode || '',
      execution_mode: step.executionMode || '',
      approval_count_required: step.approvalCount || '',
      actions: step.action || [],
      requires_user_id: step.requiresUserId || 'false',
      is_user_id_dynamic: step.isUserIdDynamic || 'false',
      targetStepPosition: step.targetStepPosition || '',
      resumeStepPosition: step.resumeStepPosition || (index + 1).toString(),
      nextStepPosition: index + 1 < steps.length ? (index + 2).toString() : '',
      prevStepPosition: index === 0 ? '' : index.toString()
    }));
  };
  