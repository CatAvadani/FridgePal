const IP_ADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS || 'localhost';

const API_BASE_URL = `http://${IP_ADDRESS}:7024`;

export const ENDPOINTS = {
  GET_ALL: '/api/Item/getAllItems',
  CREATE: '/api/Item/addNewItem',
  UPDATE: '/api/Item/updateItem',
  DELETE: '/api/Item/deleteItem',
};

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    throw error;
  }
};
