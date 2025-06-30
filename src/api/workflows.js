// src/api/workflows.js
import axios from 'axios';
import API_CONFIG from '../config/apiConfig';

const API_BASE_URL = API_CONFIG.BASE_URL;

export const submitWorkflow = async (workflow) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/workflow/create`,  // Adjust API endpoint as needed
    workflow,
    {
      headers: {
        'Authorization': 'Bearer workflow_engine_ssdg',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }
  );

  return response.data;
};
