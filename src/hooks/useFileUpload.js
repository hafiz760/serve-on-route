import { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';

/**
 * Custom hook for file upload operations
 * Provides utilities for picking images and documents
 *
 * @returns {Object} File upload utilities
 */
export const useFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Pick an image from camera or gallery
   * @param {Object} options - ImagePicker options
   * @returns {Promise<Object>} Selected image
   */
  const pickImage = async (options = {}) => {
    setLoading(true);
    setError(null);

    const defaultOptions = {
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: false,
      compressImageQuality: 0.8,
      ...options,
    };

    try {
      const image = await ImagePicker.openPicker(defaultOptions);
      setSelectedFile(image);
      setLoading(false);
      return image;
    } catch (err) {
      if (err.code !== 'E_PICKER_CANCELLED') {
        setError(err.message || 'Failed to pick image');
        if (__DEV__) {
          console.error('Image picker error:', err);
        }
      }
      setLoading(false);
      return null;
    }
  };

  /**
   * Take a photo with camera
   * @param {Object} options - ImagePicker camera options
   * @returns {Promise<Object>} Captured photo
   */
  const takePhoto = async (options = {}) => {
    setLoading(true);
    setError(null);

    const defaultOptions = {
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: false,
      compressImageQuality: 0.8,
      ...options,
    };

    try {
      const photo = await ImagePicker.openCamera(defaultOptions);
      setSelectedFile(photo);
      setLoading(false);
      return photo;
    } catch (err) {
      if (err.code !== 'E_PICKER_CANCELLED') {
        setError(err.message || 'Failed to take photo');
        if (__DEV__) {
          console.error('Camera error:', err);
        }
      }
      setLoading(false);
      return null;
    }
  };

  /**
   * Pick a document from device storage
   * @param {Object} options - DocumentPicker options
   * @returns {Promise<Object>} Selected document
   */
  const pickDocument = async (options = {}) => {
    setLoading(true);
    setError(null);

    const defaultOptions = {
      type: [DocumentPicker.types.allFiles],
      allowMultiSelection: false,
      ...options,
    };

    try {
      const result = await DocumentPicker.pick(defaultOptions);
      const file = Array.isArray(result) ? result[0] : result;
      setSelectedFile(file);
      setLoading(false);
      return file;
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        setError(err.message || 'Failed to pick document');
        if (__DEV__) {
          console.error('Document picker error:', err);
        }
      }
      setLoading(false);
      return null;
    }
  };

  /**
   * Pick multiple files
   * @param {Object} options - DocumentPicker options
   * @returns {Promise<Array>} Selected files
   */
  const pickMultipleFiles = async (options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
        ...options,
      });
      setSelectedFile(results);
      setLoading(false);
      return results;
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        setError(err.message || 'Failed to pick files');
        if (__DEV__) {
          console.error('Multi-file picker error:', err);
        }
      }
      setLoading(false);
      return [];
    }
  };

  /**
   * Clear selected file
   */
  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  /**
   * Create FormData for file upload
   * @param {Object} file - File object to upload
   * @param {string} fieldName - Field name for the file (default: 'file')
   * @param {Object} additionalFields - Additional fields to append to FormData
   * @returns {FormData} FormData object ready for upload
   */
  const createFormData = (file, fieldName = 'file', additionalFields = {}) => {
    const formData = new FormData();

    // Add the file
    if (file) {
      formData.append(fieldName, {
        uri: file.uri || file.path,
        type: file.type || file.mime || 'image/jpeg',
        name: file.name || file.fileName || 'upload.jpg',
      });
    }

    // Add additional fields
    Object.keys(additionalFields).forEach((key) => {
      formData.append(key, additionalFields[key]);
    });

    return formData;
  };

  return {
    selectedFile,
    loading,
    error,
    pickImage,
    takePhoto,
    pickDocument,
    pickMultipleFiles,
    clearFile,
    createFormData,
  };
};

export default useFileUpload;
