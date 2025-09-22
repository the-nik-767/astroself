import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../state/store';
import { useNotifications } from '../hooks/useNotifications';
import {
  setNotificationEnabled,
  addTopic,
  removeTopic,
  clearAllNotifications,
} from '../state/slices/notificationSlice';
import { fontFamily } from '../constant/theme';

const NotificationSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { fcmToken, isNotificationEnabled, subscribeToTopic, unsubscribeFromTopic } = useNotifications();
  const { notifications, topics, unreadCount } = useSelector((state: RootState) => state.notifications);
  
  const [newTopic, setNewTopic] = useState('');

  const handleToggleNotifications = async () => {
    try {
      if (isNotificationEnabled) {
        // Disable notifications
        dispatch(setNotificationEnabled(false));
        Alert.alert('Notifications Disabled', 'You will no longer receive push notifications.');
      } else {
        // Enable notifications
        dispatch(setNotificationEnabled(true));
        Alert.alert('Notifications Enabled', 'You will now receive push notifications.');
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings.');
    }
  };

  const handleAddTopic = async () => {
    if (newTopic.trim()) {
      try {
        await subscribeToTopic(newTopic.trim());
        dispatch(addTopic(newTopic.trim()));
        setNewTopic('');
        Alert.alert('Success', `Subscribed to topic: ${newTopic.trim()}`);
      } catch (error) {
        console.error('Error subscribing to topic:', error);
        Alert.alert('Error', 'Failed to subscribe to topic.');
      }
    }
  };

  const handleRemoveTopic = async (topic: string) => {
    try {
      await unsubscribeFromTopic(topic);
      dispatch(removeTopic(topic));
      Alert.alert('Success', `Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      Alert.alert('Error', 'Failed to unsubscribe from topic.');
    }
  };

  const handleClearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            dispatch(clearAllNotifications());
            Alert.alert('Success', 'All notifications cleared.');
          },
        },
      ]
    );
  };

  const copyFCMToken = () => {
    if (fcmToken) {
      // You can implement clipboard functionality here
      Alert.alert('FCM Token', fcmToken);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={isNotificationEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isNotificationEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Unread Count</Text>
          <Text style={styles.settingValue}>{unreadCount}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={copyFCMToken}>
          <Text style={styles.buttonText}>Show FCM Token</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Topic Subscriptions</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter topic name"
            value={newTopic}
            onChangeText={setNewTopic}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTopic}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {topics.map((topic, index) => (
          <View key={index} style={styles.topicRow}>
            <Text style={styles.topicText}>{topic}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveTopic(topic)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications ({notifications.length})</Text>
        
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAllNotifications}>
          <Text style={styles.clearButtonText}>Clear All Notifications</Text>
        </TouchableOpacity>

        {notifications.map((notification, index) => (
          <View key={index} style={styles.notificationItem}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationBody}>{notification.body}</Text>
            {notification.data && (
              <Text style={styles.notificationData}>
                Data: {JSON.stringify(notification.data)}
              </Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#34C759',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  topicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  topicText: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationItem: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
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
    marginBottom: 4,
  },
  notificationData: {
    fontSize: 12,
    color: '#999',
    fontFamily: fontFamily.regular,
  },
});

export default NotificationSettings;
