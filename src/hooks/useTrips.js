import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, URL_V } from '../utilities/helper';

/**
 * Custom hook for fetching and managing trip/parcel data
 * Handles loading states, errors, and role-based filtering
 *
 * @param {string} userRole - 'customer' or 'driver'
 * @returns {Object} Trip data and utilities
 */
export const useTrips = (userRole = 'customer') => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Determine API filter based on role
  const filterField = userRole === 'customer' ? 'customer_id' : 'rider_id';

  /**
   * Fetch trips from API
   * @param {boolean} isRefreshing - Whether this is a pull-to-refresh action
   */
  const fetchTrips = useCallback(async (isRefreshing = false) => {
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
        `${BASE_URL}${URL_V}parcel?page=1&limit=500&populate=customer_id%20rider_id&sort=desc&${filterField}=${userJsonData._id}`,
        {
          headers: {
            Authorization: `Bearer ${userJsonData.access_token}`,
          },
        }
      );

      setTrips(response.data.docs || []);
    } catch (err) {
      if (__DEV__) {
        console.error('Error fetching trips:', err);
      }
      setError(err.message || 'Failed to fetch trips');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterField]);

  /**
   * Filter trips by status
   * @param {string} status - 'all', 'in_progress', 'completed', 'pending', etc.
   * @returns {Array} Filtered trips
   */
  const filterByStatus = useCallback((status) => {
    if (status === 'all') return trips;
    if (status === 'open') return trips.filter(t => t.status === 'in_progress');
    return trips.filter(t => t.status === status);
  }, [trips]);

  /**
   * Get trip by ID
   * @param {string} tripId - Trip/Parcel ID
   * @returns {Object|null} Trip object or null
   */
  const getTripById = useCallback((tripId) => {
    return trips.find(t => t._id === tripId) || null;
  }, [trips]);

  /**
   * Refresh trips (pull-to-refresh)
   */
  const refresh = useCallback(() => {
    fetchTrips(true);
  }, [fetchTrips]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return {
    trips,
    loading,
    error,
    refreshing,
    fetchTrips,
    refresh,
    filterByStatus,
    getTripById,
  };
};

export default useTrips;
