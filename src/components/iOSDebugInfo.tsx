import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { fontFamily } from '../constant/theme';

const iOSDebugInfo: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      checkNotificationStatus();
    }
  }, []);

  const checkNotificationStatus = async () => {
    try {
      const authStatus = await messaging().hasPermission();
      const fcmToken = await messaging().getToken();
      
      setDebugInfo({
        platform: Platform.OS,
        authStatus,
        fcmToken,
        isAuthorized: authStatus === messaging.AuthorizationStatus.AUTHORIZED,
        isProvisional: authStatus === messaging.AuthorizationStatus.PROVISIONAL,
        isDenied: authStatus === messaging.AuthorizationStatus.DENIED,
        isNotDetermined: authStatus === messaging.AuthorizationStatus.NOT_DETERMINED,
      });
    } catch (error) {
      console.error('Error checking notification status:', error);
      setDebugInfo({ error: error.message });
    }
  };

  const requestPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission({
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      });
      
      Alert.alert('Permission Result', `Status: ${authStatus}`);
      checkNotificationStatus();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const testNotification = () => {
    Alert.alert(
      'Test Notification',
      'This is a test notification. If you see this, notifications are working!',
      [{ text: 'OK' }]
    );
  };

  if (Platform.OS !== 'ios') {
    return null;
  }

  if (!isVisible) {
    return (
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.toggleButtonText}>🐛 iOS Debug</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>iOS Notification Debug</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsVisible(false)}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permission Status</Text>
          <Text style={styles.infoText}>
            Status: {debugInfo.authStatus} ({debugInfo.authStatus === 1 ? 'Authorized' : debugInfo.authStatus === 2 ? 'Denied' : debugInfo.authStatus === 0 ? 'Not Determined' : 'Provisional'})
          </Text>
          <Text style={styles.infoText}>
            Authorized: {debugInfo.isAuthorized ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.infoText}>
            Provisional: {debugInfo.isProvisional ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.infoText}>
            Denied: {debugInfo.isDenied ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.infoText}>
            Not Determined: {debugInfo.isNotDetermined ? 'Yes' : 'No'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FCM Token</Text>
          <Text style={styles.tokenText} numberOfLines={3}>
            {debugInfo.fcmToken || 'No token available'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={requestPermission}>
            <Text style={styles.actionButtonText}>Request Permission</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={checkNotificationStatus}>
            <Text style={styles.actionButtonText}>Refresh Status</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={testNotification}>
            <Text style={styles.actionButtonText}>Test Notification</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Troubleshooting</Text>
          <Text style={styles.helpText}>
            1. Make sure APNs certificate is configured in Firebase Console
          </Text>
          <Text style={styles.helpText}>
            2. Check if app is signed with proper provisioning profile
          </Text>
          <Text style={styles.helpText}>
            3. Verify GoogleService-Info.plist is in the project
          </Text>
          <Text style={styles.helpText}>
            4. Check device notification settings
          </Text>
          <Text style={styles.helpText}>
            5. Test on physical device (not simulator)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: '80%',
  },
  toggleButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1000,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  tokenText: {
    fontSize: 12,
    color: '#333',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
    fontFamily: fontFamily.regular,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16,
  },
});

export default iOSDebugInfo;
