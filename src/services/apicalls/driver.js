import {baseURL, endPoints} from '../constants';

const getRequestOptions = (method, token, body = null, isMultipart = false) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = body;
  }

  return options;
};

export const updateDriverProfile = async (formData, token) => {
  try {
    const requestOptions = getRequestOptions('PATCH', token, formData, true);

    const res = await fetch(
      `${baseURL}${endPoints.updateUser}`,
      requestOptions,
    );

    const resText = await res.text();

    let result;
    try {
      result = JSON.parse(resText);
    } catch (err) {
      console.log('❌ Failed to parse JSON:', err);
      return {
        message: resText,
        status: res.status,
        success: false,
      };
    }

    if (res.status === 200) {
      return {
        ...result,
        status: 200,
        success: true,
      };
    } else {
      return {
        ...result,
        status: res.status,
        success: false,
      };
    }
  } catch (error) {
    console.log('Error in updateDriverProfile service:', error);
    return {
      success: false,
      message: error.message || 'Network Error',
    };
  }
};

export const fetchDriverById = async (userId, token) => {
  try {
    const requestOptions = getRequestOptions('GET', token);

    const res = await fetch(
      `${baseURL}users/user-by-id/${userId}`,
      requestOptions,
    );

    const resText = await res.text();
    let result;
    try {
      result = JSON.parse(resText);
    } catch (err) {
      console.log('❌ Failed to parse JSON:', err);
      return {
        message: 'Invalid server response',
        status: res.status,
        success: false,
      };
    }

    if (res.status === 200 || res.status === 201) {
      return {
        data: result.data,
        status: res.status,
        success: true,
      };
    } else {
      return {
        message: result.message || 'Failed to fetch driver data',
        status: res.status,
        success: false,
      };
    }
  } catch (error) {
    console.log('Error in fetchDriverById service:', error);
    return {
      success: false,
      message: error.message || 'Network Error',
    };
  }
};
