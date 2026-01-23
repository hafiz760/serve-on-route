import { useSelector } from 'react-redux';

/**
 * Custom hook to get user role information
 * Provides consistent role checking across the app
 *
 * @returns {Object} User role information and helper functions
 */
export const useUserRole = () => {
  const { user, bool: isDriver } = useSelector((state) => state.session);

  // Determine user role from multiple sources for backward compatibility
  const getUserRole = () => {
    // Check if user has roles array (new format)
    if (user?.roles) {
      if (user.roles.includes('rider') || user.roles.includes('driver')) {
        return 'driver';
      }
      if (user.roles.includes('user') || user.roles.includes('customer')) {
        return 'customer';
      }
    }

    // Check direct role property
    if (user?.role) {
      return user.role === 'rider' || user.role === 'driver' ? 'driver' : 'customer';
    }

    // Fallback to bool flag
    return isDriver ? 'driver' : 'customer';
  };

  const role = getUserRole();

  return {
    // User data
    user,

    // Role information
    role,
    isDriver: role === 'driver',
    isCustomer: role === 'customer',

    // Boolean flag (legacy)
    bool: isDriver,

    // Helper functions
    hasRole: (roleName) => {
      if (user?.roles) {
        return user.roles.includes(roleName);
      }
      return user?.role === roleName;
    },

    isAuthenticated: !!user,

    // User type checks
    canBidOnParcels: role === 'driver',
    canBookRides: role === 'customer',
  };
};

export default useUserRole;
