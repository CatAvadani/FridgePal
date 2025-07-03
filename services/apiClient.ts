const IP_ADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS || 'localhost';
const API_BASE_URL = `http://${IP_ADDRESS}:7024`;

export const ENDPOINTS = {
  GET_ALL: '/api/Item/getAllItems',
  CREATE: '/api/Item/addNewItem',
  UPDATE: '/api/Item/updateItem',
  DELETE: '/api/Item/deleteItem',
  CLOUDINARY_UPLOAD: '/api/Cloudinary/upload',
  AI_ANALYSIS: '/api/Item/analyze-image',
};

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const isFormData = options.body instanceof FormData;

  try {
    const requestOptions: RequestInit = {
      ...options,
    };

    if (!isFormData) {
      requestOptions.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
    } else {
      requestOptions.headers = {
        ...options.headers,
      };
      if (requestOptions.headers && 'Content-Type' in requestOptions.headers) {
        delete (requestOptions.headers as any)['Content-Type'];
      }
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const responseText = await response.text();
      console.log('Response text:', responseText);
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
