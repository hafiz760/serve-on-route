import React from 'react';
import SharedMyTrips from '../../Shared/MyTrips';

/**
 * Customer wrapper for shared MyTrips component
 */
export default function CustomerMyTrips(props) {
  return <SharedMyTrips {...props} userRole="customer" />;
}
