// API configuration - uses environment variable or defaults to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to call ${endpoint}:`, error);
    throw error;
  }
};

export { API_URL };