/**
 * Application Constants
 * Centralized constants to avoid magic strings and improve maintainability
 */

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  DRIVER: 'driver',
  RIDER: 'rider', // Legacy alias for driver
  USER: 'user',   // Legacy alias for customer
};

// Trip/Parcel Status
export const TRIP_STATUS = {
  ALL: 'all',
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  OPEN: 'open', // UI alias for in_progress
};

// Notification Types
export const NOTIFICATION_TYPES = {
  PARCEL_NOTIFY: 'parcel_notify',
  PARCEL_REBOOT: 'parcel_reboot',
  TRIP_UPDATE: 'trip_update',
  PAYMENT_SUCCESS: 'payment_success',
  GENERAL: 'general',
};

// API Response Status
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// AsyncStorage Keys
export const STORAGE_KEYS = {
  USER_DATA: 'response',
  FCM_TOKEN: 'fcmtoken',
  ACCESS_TOKEN: 'accessToken',
  LANGUAGE: 'language',
  INTRO_SHOWN: 'shownIntroductionSlider',
};

// Gender Options
export const GENDER_OPTIONS = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
};

// File Upload Types
export const FILE_TYPES = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  PDF: 'pdf',
  ALL: 'all',
};

// Image Upload Limits
export const IMAGE_LIMITS = {
  MAX_SIZE_MB: 5,
  MAX_CAR_PICTURES: 3,
  MIN_CAR_PICTURES: 1,
  AVATAR_WIDTH: 300,
  AVATAR_HEIGHT: 400,
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  POSTAL_CODE: /^[0-9]{5}(-[0-9]{4})?$/,
};

// Message Types
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Tab Names (for My Trips)
export const TRIP_TABS = {
  ALL: 'all',
  OPEN: 'open',
  COMPLETED: 'completed',
};

// Profile Tab Names
export const PROFILE_TABS = {
  PROFILE: 'profile',
  PERMISSION: 'permission',
};

// Socket Events
export const SOCKET_EVENTS = {
  BIDDING: 'bidding',
  CONNECTED_USERS: 'connectedUsers',
  TRIP_UPDATE: 'tripUpdate',
  NOTIFICATION: 'notification',
};

// Screen Names (for navigation)
export const SCREENS = {
  // Public
  SPLASH: 'PublicSplash',
  INTRO: 'PublicIntro',
  LOGIN: 'PublicLogin',
  SIGNUP: 'PublicSignUp',
  FORGOT_PASSWORD: 'PublicForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
  VERIFICATION: 'PublicVerification',
  HOME: 'PublicHome',
  ABOUT_US: 'PublicAboutUs',
  CONTACT: 'PublicContact',

  // Customer
  CUSTOMER_MY_TRIPS: 'CustomerMyTrips',
  CUSTOMER_NOTIFICATION: 'CustomerNotification',
  CUSTOMER_SETTINGS: 'CustomerSettings',
  CUSTOMER_FAQ: 'CustomerFAQ',
  CUSTOMER_PROFILE: 'CustomerManageProfile',
  CUSTOMER_BOOKING_COMPLETE: 'CustomerBookingComplete',
  CUSTOMER_SELECT_VEHICLE: 'CustomerSelectVehicle',
  CUSTOMER_PAYMENT: 'CustomerPayment',

  // Driver
  DRIVER_HOME: 'DriverHome',
  DRIVER_MY_TRIPS: 'DriverMyTrips',
  DRIVER_NOTIFICATION: 'DriverNotification',
  DRIVER_SETTINGS: 'DriverSettings',
  DRIVER_FAQ: 'DriverFAQ',
  DRIVER_PROFILE: 'DriverManageProfile',
  DRIVER_BOOKING_COMPLETE: 'DriverBookingComplete',
  DRIVER_MY_ROUTES: 'DriverAddRoutes',
  DRIVER_ROUTES: 'DriverRoutes',
  DRIVER_SETTLEMENT: 'DriverSettlement',

  // Shared
  TRACKING: 'CustomerDriverTracking',
  DRAWER: 'DrawerNav',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Vehicle Types
export const VEHICLE_TYPES = {
  CAR: 'car',
  BIKE: 'bike',
  TRUCK: 'truck',
  VAN: 'van',
};

// Booking Types
export const BOOKING_TYPES = {
  INSTANT: 'instant',
  SCHEDULED: 'scheduled',
  SHARED: 'shared',
};

// Default Values
export const DEFAULTS = {
  PAGE_SIZE: 50,
  TRIP_LIMIT: 500,
  NOTIFICATION_LIMIT: 50,
  AVATAR_PLACEHOLDER: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  VERIFY_OTP: 'auth/verify-otp',
  FORGOT_PASSWORD: 'auth/forgot-password',
  RESET_PASSWORD: 'auth/reset-password',

  // Users
  UPDATE_USER: 'users/update-user',
  USER_BY_ID: 'users/user-by-id',
  CONNECT_ACCOUNT: 'users/connect-account',
  LINK_ACCOUNT: 'users/link-account',

  // Parcels/Trips
  PARCELS: 'parcel',
  PARCEL_BY_ID: (id) => `parcel/${id}`,
  CANCEL_PARCEL: 'parcel/cancel',

  // Notifications
  NOTIFICATIONS: 'notifications',
  NOTIFICATION_BY_ID: (id) => `notifications/${id}`,

  // Complaints
  COMPLAINTS: 'complaints',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_UPLOAD_ERROR: 'Failed to upload file.',
  NO_DATA: 'No data available.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  BID_PLACED: 'You successfully bid on this parcel',
  TRIP_CANCELLED: 'Trip cancelled successfully',
  COMPLAINT_SUBMITTED: 'Complaint created successfully!',
  NOTIFICATION_READ: 'Notification marked as read',
};
