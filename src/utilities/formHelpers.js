/**
 * Form Data Helper Utilities
 * Provides consistent FormData construction and image formatting
 */

/**
 * Format an image object for FormData upload
 * Ensures consistent structure across all uploads
 *
 * @param {Object} image - Image object from ImagePicker or DocumentPicker
 * @returns {Object} Formatted image object
 */
export const formatImageForUpload = (image) => {
  if (!image) return null;

  return {
    uri: image.uri || image.path,
    type: image.type || image.mime || 'image/jpeg',
    name: image.name || image.fileName || `upload_${Date.now()}.jpg`,
  };
};

/**
 * Create FormData with proper file formatting
 *
 * @param {Object} fields - Key-value pairs for form fields
 * @param {Object} files - Key-value pairs for file uploads
 * @returns {FormData} Prepared FormData object
 *
 * @example
 * const formData = createFormData(
 *   { first_name: 'John', last_name: 'Doe' },
 *   { avatar_file: avatarImage, cover_image: coverImage }
 * );
 */
export const createFormData = (fields = {}, files = {}) => {
  const formData = new FormData();

  // Append regular fields
  Object.keys(fields).forEach((key) => {
    const value = fields[key];
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  // Append files with proper formatting
  Object.keys(files).forEach((key) => {
    const file = files[key];
    if (file) {
      const formattedFile = formatImageForUpload(file);
      if (formattedFile) {
        formData.append(key, formattedFile);
      }
    }
  });

  return formData;
};

/**
 * Create FormData for profile update (Customer)
 *
 * @param {Object} profileData - Profile fields
 * @param {Object} images - Image files
 * @returns {FormData} FormData ready for profile update
 */
export const createCustomerProfileFormData = (profileData, images = {}) => {
  const { firstName, lastName, gender } = profileData;

  return createFormData(
    {
      first_name: firstName,
      last_name: lastName,
      gender: gender,
    },
    {
      avatar_file: images.avatar,
      cover_image: images.cover,
    }
  );
};

/**
 * Create FormData for profile update (Driver)
 *
 * @param {Object} profileData - Profile fields
 * @param {Object} images - Image files (avatar, ID, license, car, selfie)
 * @returns {FormData} FormData ready for driver profile update
 */
export const createDriverProfileFormData = (profileData, images = {}) => {
  const {
    firstName,
    lastName,
    email,
    gender,
    nationalCard,
    dob,
    drivingLicense,
    licenseExpiry,
    carName,
    carNumber,
  } = profileData;

  const formData = createFormData(
    {
      first_name: firstName,
      last_name: lastName,
      email: email,
      gender: gender,
      national_card: nationalCard,
      date_of_birth: dob,
      driving_liscence: drivingLicense,
      liscence_exp_date: licenseExpiry,
      car_name: carName,
      car_number: carNumber,
    },
    {
      avatar_file: images.avatar,
      cover_image: images.cover,
      front_id_image: images.idFront,
      back_id_image: images.idBack,
      driving_license_file: images.licenseFront,
      driving_license_file_back: images.licenseBack,
      selfie_image: images.selfie,
    }
  );

  // Add car pictures array
  if (images.carPictures && Array.isArray(images.carPictures)) {
    images.carPictures.forEach((carImage, index) => {
      if (carImage) {
        const formatted = formatImageForUpload(carImage);
        if (formatted) {
          formData.append('car_pictures', formatted);
        }
      }
    });
  }

  return formData;
};

/**
 * Sanitize and trim string values
 *
 * @param {string} value - Value to sanitize
 * @returns {string} Trimmed and sanitized value
 */
export const sanitize = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim();
};

/**
 * Validate required fields
 *
 * @param {Object} fields - Key-value pairs to validate
 * @param {Array<string>} requiredKeys - Keys that must have values
 * @returns {Object} { isValid: boolean, missingFields: Array<string> }
 */
export const validateRequiredFields = (fields, requiredKeys) => {
  const missingFields = [];

  requiredKeys.forEach((key) => {
    const value = fields[key];
    if (!value || (typeof value === 'string' && !value.trim())) {
      missingFields.push(key);
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

/**
 * Format field name for user-friendly error messages
 *
 * @param {string} fieldName - Camel case field name
 * @returns {string} Human-readable field name
 *
 * @example
 * formatFieldName('firstName') // 'First Name'
 * formatFieldName('nationalCard') // 'National Card'
 */
export const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};
