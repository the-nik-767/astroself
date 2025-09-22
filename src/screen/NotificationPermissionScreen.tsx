import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNotifications } from '../hooks/useNotifications';

const NotificationPermissionScreen: React.FC = () => {
  const { 
    fcmToken, 
    isNotificationEnabled, 
    isLoading, 
    requestPermission,
    error 
  } = useNotifications();
  
  const [isRequesting, setIsRequesting] = useState(false);

  const handleEnableNotifications = async () => {
    try {
      setIsRequesting(true);
      const granted = await requestPermission();
      
      if (granted) {
        Alert.alert(
          'Success! 🎉',
          'Notifications have been enabled successfully. You will now receive important updates and alerts.',
          [{ text: 'Great!', style: 'default' }]
        );
      } else {
        Alert.alert(
          'Permission Required',
          'To receive notifications, please enable them in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => Linking.openSettings() 
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert(
        'Error',
        'Failed to enable notifications. Please try again or check your device settings.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const copyFCMToken = () => {
    if (fcmToken) {
      Alert.alert(
        'FCM Token',
        fcmToken,
        [
          { text: 'OK' },
          { 
            text: 'Copy', 
            onPress: () => {
              // You can implement clipboard functionality here
              console.log('FCM Token copied:', fcmToken);
            }
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.icon}>🔔</Text>
          <Text style={styles.title}>Notification Settings</Text>
          <Text style={styles.subtitle}>
            Manage your notification preferences
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: isNotificationEnabled ? '#34C759' : '#FF3B30' }
            ]}>
              <Text style={styles.statusText}>
                {isNotificationEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
          
          {fcmToken && (
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>FCM Token</Text>
              <TouchableOpacity onPress={copyFCMToken}>
                <Text style={styles.tokenText}>Tap to view</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!isNotificationEnabled && (
          <View style={styles.permissionCard}>
            <Text style={styles.permissionTitle}>Enable Notifications</Text>
            <Text style={styles.permissionText}>
              Get instant updates, important alerts, and personalized content.
            </Text>
            
            <View style={styles.benefitsList}>
              <Text style={styles.benefitItem}>✓ Instant updates</Text>
              <Text style={styles.benefitItem}>✓ Important alerts</Text>
              <Text style={styles.benefitItem}>✓ Personalized content</Text>
              <Text style={styles.benefitItem}>✓ Never miss anything</Text>
            </View>

            <TouchableOpacity
              style={[styles.enableButton, isRequesting && styles.disabledButton]}
              onPress={handleEnableNotifications}
              disabled={isRequesting || isLoading}
            >
              <Text style={styles.enableButtonText}>
                {isRequesting ? 'Enabling...' : 'Enable Notifications'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isNotificationEnabled && (
          <View style={styles.successCard}>
            <Text style={styles.successTitle}>✅ Notifications Enabled</Text>
            <Text style={styles.successText}>
              You're all set! You'll receive notifications for important updates.
            </Text>
          </View>
        )}

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            If notifications aren't working:
          </Text>
          <Text style={styles.helpStep}>1. Check device notification settings</Text>
          <Text style={styles.helpStep}>2. Make sure app has notification permission</Text>
          <Text style={styles.helpStep}>3. Restart the app if needed</Text>
          
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleOpenSettings}
          >
            <Text style={styles.settingsButtonText}>Open Device Settings</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tokenText: {
    color: '#007AFF',
    fontSize: 14,
  },
  permissionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  benefitsList: {
    marginBottom: 24,
  },
  benefitItem: {
    fontSize: 16,
    color: '#34C759',
    marginBottom: 8,
  },
  enableButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  enableButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  successCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5A2D',
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: '#2D5A2D',
  },
  helpCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  helpStep: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    marginLeft: 8,
  },
  settingsButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  settingsButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#C62828',
  },
});

export default NotificationPermissionScreen;
