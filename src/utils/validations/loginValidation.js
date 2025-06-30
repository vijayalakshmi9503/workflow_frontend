export const validateLoginForm = (employeeNo, password) => {
    const errors = {};
  
    if (!employeeNo) {
      errors.employeeNo = 'Employee Number is required';
    } else if (!/^\d{5,}$/.test(employeeNo)) {
      errors.employeeNo = 'Invalid Employee Number format';
    }
  
    if (!password) {
      errors.password = 'Password is required';
    } else {
      const hasMinLength = password.length >= 8;
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const specialCharMatches = password.match(/[^A-Za-z0-9]/g) || [];
      const hasTwoSpecialChars = specialCharMatches.length >= 2;
  
      if (!hasMinLength) {
        errors.password = 'Password must be at least 8 characters';
      } else if (!hasUpper) {
        errors.password = 'Password must contain at least 1 uppercase letter';
      } else if (!hasLower) {
        errors.password = 'Password must contain at least 1 lowercase letter';
      } else if (!hasTwoSpecialChars) {
        errors.password = 'Password must contain at least 2 special characters';
      }
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      validationErrors: errors,
    };
  };
  