import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationData } from '../types/notifications';

interface NotificationHandlerProps {
  onNotificationPress?: (data: NotificationData) => void;
  showInAppNotifications?: boolean;
}

const NotificationHandler: React.FC<NotificationHandlerProps> = ({
  onNotificationPress,
  showInAppNotifications = true,
}) => {
  const { isNotificationEnabled, requestPermission } = useNotifications();
  const [inAppNotifications, setInAppNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    // Request permission if not enabled
    if (!isNotificationEnabled) {
      requestPermission();
    }
  }, [isNotificationEnabled, requestPermission]);

  // Handle notification press
  const handleNotificationPress = (notification: NotificationData) => {
    if (onNotificationPress) {
      onNotificationPress(notification);
    }
    
    // Remove from in-app notifications
    setInAppNotifications(prev => 
      prev.filter(n => n !== notification)
    );
  };

  // Dismiss notification
  const dismissNotification = (notification: NotificationData) => {
    setInAppNotifications(prev => 
      prev.filter(n => n !== notification)
    );
  };

  // Add notification to in-app list (for future use)
  // const addInAppNotification = (notification: NotificationData) => {
  //   if (showInAppNotifications) {
  //     setInAppNotifications(prev => [...prev, notification]);
      
  //     // Auto dismiss after 5 seconds
  //     setTimeout(() => {
  //       dismissNotification(notification);
  //     }, 5000);
  //   }
  // };

  // Show permission request if needed
  if (!isNotificationEnabled) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Enable notifications to receive important updates
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Enable Notifications</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* In-app notifications */}
      {inAppNotifications.map((notification, index) => (
        <View key={index} style={styles.notificationContainer}>
          <TouchableOpacity
            style={styles.notification}
            onPress={() => handleNotificationPress(notification)}
          >
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationBody}>{notification.body}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => dismissNotification(notification)}
          >
            <Text style={styles.dismissButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  permissionContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notification: {
    flex: 1,
    padding: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: '#666',
  },
  dismissButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissButtonText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
});

export default NotificationHandler;
