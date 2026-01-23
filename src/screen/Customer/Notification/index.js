import React from 'react';
import SharedNotification from '../../Shared/Notification';

/**
 * Customer wrapper for shared Notification component
 */
export default function CustomerNotification(props) {
  return <SharedNotification {...props} userRole="customer" />;
}
