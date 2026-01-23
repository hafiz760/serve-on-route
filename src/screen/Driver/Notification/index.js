import React from 'react';
import SharedNotification from '../../Shared/Notification';

/**
 * Driver wrapper for shared Notification component
 */
export default function DriverNotification(props) {
  return <SharedNotification {...props} userRole="driver" />;
}
