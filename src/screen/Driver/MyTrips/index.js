import React from 'react';
import SharedMyTrips from '../../Shared/MyTrips';

/**
 * Driver wrapper for shared MyTrips component
 */
export default function DriverMyTrips(props) {
  return <SharedMyTrips {...props} userRole="driver" />;
}
