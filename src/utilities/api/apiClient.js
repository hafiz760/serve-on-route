/**
 * Generic API Client Utility
 * Provides consistent fetch wrappers with error handling
 */

import { BASE_URL, URL_V } from '../helper';

/**
 * Make a GET request
 * @param {string} endpoint - API endpoint (e.g., 'users/user-by-id/123')
 * @param {string} token - Bearer token
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Response data
 */
export const apiGet = async (endpoint, token, options = {}) => {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${URL_V}${endpoint}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || text,
        data,
      };
    }

    return data;
  } catch (error) {
    console.error('API GET Error:', error);
    throw error;
  }
};

/**
 * Make a POST request with JSON body
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @param {string} token - Bearer token
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Response data
 */
export const apiPost = async (endpoint, body, token, options = {}) => {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${URL_V}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || text,
        data,
      };
    }

    return data;
  } catch (error) {
    console.error('API POST Error:', error);
    throw error;
  }
};

/**
 * Make a PUT request with JSON body
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @param {string} token - Bearer token
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Response data
 */
export const apiPut = async (endpoint, body, token, options = {}) => {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${URL_V}${endpoint}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || text,
        data,
      };
    }

    return data;
  } catch (error) {
    console.error('API PUT Error:', error);
    throw error;
  }
};

/**
 * Make a PATCH request with JSON body
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @param {string} token - Bearer token
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Response data
 */
export const apiPatch = async (endpoint, body, token, options = {}) => {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${URL_V}${endpoint}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || text,
        data,
      };
    }

    return data;
  } catch (error) {
    console.error('API PATCH Error:', error);
    throw error;
  }
};

/**
 * Upload multipart form data (files + fields)
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data with files
 * @param {string} token - Bearer token
 * @param {string} method - HTTP method (default: 'POST')
 * @returns {Promise<Object>} Response data
 */
export const apiUpload = async (endpoint, formData, token, method = 'POST') => {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${URL_V}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }

    if (response.status === 200 || response.status === 201) {
      return { success: true, data, status: response.status };
    }

    throw {
      status: response.status,
      message: data.message || text,
      data,
      success: false,
    };
  } catch (error) {
    console.error('API Upload Error:', error);
    throw error;
  }
};

/**
 * Make a DELETE request
 * @param {string} endpoint - API endpoint
 * @param {string} token - Bearer token
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Response data
 */
export const apiDelete = async (endpoint, token, options = {}) => {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${URL_V}${endpoint}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || text,
        data,
      };
    }

    return data;
  } catch (error) {
    console.error('API DELETE Error:', error);
    throw error;
  }
};
