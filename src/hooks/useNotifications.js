import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, URL_V } from '../utilities/helper';

/**
 * Custom hook for fetching and managing notifications
 * Handles loading states, errors, and real-time updates
 *
 * @returns {Object} Notification data and utilities
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch notifications from API
   * @param {boolean} isRefreshing - Whether this is a pull-to-refresh action
   */
  const fetchNotifications = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const userData = await AsyncStorage.getItem('response');
      const userJsonData = JSON.parse(userData);

      const response = await axios.get(
        `${BASE_URL}${URL_V}notifications?user=${userJsonData._id}&page=1&limit=50&sort=-createdAt`,
        {
          headers: {
            Authorization: `Bearer ${userJsonData.access_token}`,
          },
        }
      );

      setNotifications(response.data.docs || []);
    } catch (err) {
      if (__DEV__) {
        console.error('Error fetching notifications:', err);
      }
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   */
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const userData = await AsyncStorage.getItem('response');
      const userJsonData = JSON.parse(userData);

      await axios.patch(
        `${BASE_URL}${URL_V}notifications/${notificationId}`,
        { read: true },
        {
          headers: {
            Authorization: `Bearer ${userJsonData.access_token}`,
          },
        }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      if (__DEV__) {
        console.error('Error marking notification as read:', err);
      }
    }
  }, []);

  /**
   * Get unread notification count
   * @returns {number} Count of unread notifications
   */
  const getUnreadCount = useCallback(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  /**
   * Filter notifications by type
   * @param {string} type - Notification type
   * @returns {Array} Filtered notifications
   */
  const filterByType = useCallback((type) => {
    return notifications.filter((n) => n.type === type);
  }, [notifications]);

  /**
   * Refresh notifications (pull-to-refresh)
   */
  const refresh = useCallback(() => {
    fetchNotifications(true);
  }, [fetchNotifications]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    refreshing,
    fetchNotifications,
    refresh,
    markAsRead,
    getUnreadCount,
    filterByType,
  };
};

export default useNotifications;
