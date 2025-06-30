import API_CONFIG from '../config/apiConfig';

export const loginUser = async ({ employeeNo, password }) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/ldap/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeNo, password }),
  });

  return await response.json();
};
