import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useNotifications } from '../hooks/useNotifications';

interface PermissionRequestModalProps {
  visible: boolean;
  onClose: () => void;
}

const PermissionRequestModal: React.FC<PermissionRequestModalProps> = ({
  visible,
  onClose,
}) => {
  const { requestPermission, isNotificationEnabled } = useNotifications();

  const handleEnableNotifications = async () => {
    try {
      const granted = await requestPermission();
      if (granted) {
        Alert.alert(
          'Success!',
          'Notifications enabled successfully. You will now receive important updates.',
          [{ text: 'OK', onPress: onClose }]
        );
      } else {
        Alert.alert(
          'Permission Denied',
          'To receive notifications, please enable them in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Error', 'Failed to enable notifications. Please try again.');
    }
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  if (isNotificationEnabled) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔔</Text>
          </View>
          
          <Text style={styles.title}>Enable Notifications</Text>
          
          <Text style={styles.message}>
            Stay updated with important information, reminders, and personalized content.
          </Text>
          
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitText}>• Get instant updates</Text>
            <Text style={styles.benefitText}>• Never miss important alerts</Text>
            <Text style={styles.benefitText}>• Receive personalized content</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.enableButton}
              onPress={handleEnableNotifications}
            >
              <Text style={styles.enableButtonText}>Enable Notifications</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleOpenSettings}
            >
              <Text style={styles.settingsButtonText}>Open Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.laterButton}
              onPress={onClose}
            >
              <Text style={styles.laterButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  benefitsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  benefitText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  buttonContainer: {
    gap: 12,
  },
  enableButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  enableButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  settingsButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  laterButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  laterButtonText: {
    color: '#999',
    fontSize: 16,
  },
});

export default PermissionRequestModal;
