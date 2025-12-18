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

export const connectStripeAccount = async (data, token) => {
  try {
    const requestOptions = getRequestOptions(
      'POST',
      token,
      JSON.stringify(data),
    );

    const res = await fetch(
      `${baseURL}${endPoints.connectAccount}`,
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
        data: result,
        status: res.status,
        success: true,
      };
    } else {
      return {
        message: result.message || 'Failed to connect account',
        status: res.status,
        success: false,
      };
    }
  } catch (error) {
    console.log('Error in connectStripeAccount service:', error);
    return {
      success: false,
      message: error.message || 'Network Error',
    };
  }
};

export const linkStripeAccount = async (data, token) => {
  try {
    const requestOptions = getRequestOptions(
      'POST',
      token,
      JSON.stringify(data),
    );

    const res = await fetch(
      `${baseURL}${endPoints.linkAccount}`,
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
        data: result,
        status: res.status,
        success: true,
      };
    } else {
      return {
        message: result.message || 'Failed to link account',
        status: res.status,
        success: false,
      };
    }
  } catch (error) {
    console.log('Error in linkStripeAccount service:', error);
    return {
      success: false,
      message: error.message || 'Network Error',
    };
  }
};

export const getParcelsByRider = async (riderId, token) => {
  try {
    console.log(riderId, 'Rider ID');
    const requestOptions = getRequestOptions('GET', token);
    const queryString = `?page=1&limit=500&populate=customer_id%20rider_id&sort=desc&rider_id=${riderId}`;

    const url = `${baseURL}${endPoints.parcel}${queryString}`;
    const res = await fetch(url, requestOptions);

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
        data: result,
        status: res.status,
        success: true,
      };
    } else {
      return {
        message: result.message || 'Failed to fetch parcels',
        status: res.status,
        success: false,
      };
    }
  } catch (error) {
    console.log('Error in getParcelsByRider service:', error);
    return {
      success: false,
      message: error.message || 'Network Error',
    };
  }
};

export const getParcelById = async (parcelId, token) => {
  try {
    const requestOptions = getRequestOptions('GET', token);

    const res = await fetch(
      `${baseURL}${endPoints.parcel}/${parcelId}`,
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
        data: result,
        status: res.status,
        success: true,
      };
    } else {
      return {
        message: result.message || 'Failed to fetch parcel',
        status: res.status,
        success: false,
      };
    }
  } catch (error) {
    console.log('Error in getParcelById service:', error);
    return {
      success: false,
      message: error.message || 'Network Error',
    };
  }
};
