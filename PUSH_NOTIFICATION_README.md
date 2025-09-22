# Push Notification Implementation Guide

This guide explains how to use the push notification system implemented in your React Native app.

## Features Implemented

✅ **Firebase Messaging Integration**
- FCM token management
- Background and foreground message handling
- Notification permission management
- Topic subscription/unsubscription

✅ **Redux State Management**
- Notification state management
- FCM token storage
- Notification history
- Settings management

✅ **React Hooks**
- `useNotifications` hook for easy integration
- Automatic permission handling
- Token refresh management

✅ **Components**
- `NotificationHandler` component for in-app notifications
- `NotificationSettings` screen for user preferences

## Files Created/Modified

### New Files:
- `src/services/notificationService.ts` - Core notification service
- `src/hooks/useNotifications.ts` - React hook for notifications
- `src/types/notifications.ts` - TypeScript interfaces
- `src/utils/notificationUtils.ts` - Utility functions
- `src/components/NotificationHandler.tsx` - In-app notification component
- `src/screen/NotificationSettings.tsx` - Settings screen
- `src/state/slices/notificationSlice.ts` - Redux slice

### Modified Files:
- `App.tsx` - Added notification initialization
- `index.js` - Added background message handler
- `src/state/store.ts` - Added notification reducer

## How to Use

### 1. Basic Usage in Components

```tsx
import { useNotifications } from '../hooks/useNotifications';

const MyComponent = () => {
  const { 
    fcmToken, 
    isNotificationEnabled, 
    subscribeToTopic, 
    unsubscribeFromTopic 
  } = useNotifications();

  // Subscribe to a topic
  const handleSubscribe = async () => {
    await subscribeToTopic('general');
  };

  return (
    <View>
      <Text>FCM Token: {fcmToken}</Text>
      <Text>Enabled: {isNotificationEnabled ? 'Yes' : 'No'}</Text>
    </View>
  );
};
```

### 2. Using Redux State

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../state/store';
import { addNotification, markNotificationAsRead } from '../state/slices/notificationSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications);

  const handleNotificationPress = (notification) => {
    dispatch(markNotificationAsRead(notification.id));
  };

  return (
    <View>
      <Text>Unread: {unreadCount}</Text>
      {notifications.map(notification => (
        <TouchableOpacity onPress={() => handleNotificationPress(notification)}>
          <Text>{notification.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

### 3. Adding NotificationHandler to Your App

```tsx
import NotificationHandler from './src/components/NotificationHandler';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar />
      <MainNavigator />
      <NotificationHandler 
        onNotificationPress={(data) => {
          // Handle notification press
          console.log('Notification pressed:', data);
        }}
        showInAppNotifications={true}
      />
      <Toast />
    </SafeAreaProvider>
  );
};
```

## API Integration

### Sending FCM Token to Server

Update the `sendTokenToServer` method in `notificationService.ts`:

```typescript
private async sendTokenToServer(token: string): Promise<void> {
  try {
    const response = await fetch('YOUR_API_ENDPOINT/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}` // if needed
      },
      body: JSON.stringify({ 
        fcmToken: token,
        platform: Platform.OS,
        userId: currentUserId // if available
      })
    });
    
    if (response.ok) {
      console.log('Token sent to server successfully');
    }
  } catch (error) {
    console.error('Error sending token to server:', error);
  }
}
```

### Handling Notification Data

The notification service automatically handles different types of notification data:

```typescript
// Navigation to specific screen
{
  "notification": {
    "title": "New Message",
    "body": "You have a new message"
  },
  "data": {
    "screen": "Chat",
    "userId": "123"
  }
}

// Deep link to URL
{
  "notification": {
    "title": "Important Update",
    "body": "Check out this important update"
  },
  "data": {
    "url": "https://example.com/important-update"
  }
}

// Custom action
{
  "notification": {
    "title": "Action Required",
    "body": "Please complete your profile"
  },
  "data": {
    "action": "complete_profile",
    "screen": "Profile"
  }
}
```

## Testing

### 1. Test FCM Token
- Check console logs for FCM token
- Verify token is stored in AsyncStorage
- Test token refresh functionality

### 2. Test Notifications
- Send test notification from Firebase Console
- Test foreground notifications
- Test background notifications
- Test notification press handling

### 3. Test Permissions
- Test permission request flow
- Test permission denied handling
- Test settings redirect

## Troubleshooting

### Common Issues:

1. **Token not generated**
   - Check Firebase configuration
   - Verify Google Services files are properly placed
   - Check console for error messages

2. **Notifications not received**
   - Verify FCM token is sent to server
   - Check notification payload format
   - Verify app is not in Do Not Disturb mode

3. **Permission denied**
   - Check device notification settings
   - Verify permission request flow
   - Test on different devices

### Debug Commands:

```bash
# Check Firebase configuration
npx react-native info

# Clean and rebuild
cd android && ./gradlew clean && cd ..
npx react-native run-android

# For iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

## Next Steps

1. **Server Integration**: Implement API endpoints to receive and store FCM tokens
2. **Notification Scheduling**: Add local notification scheduling
3. **Rich Notifications**: Implement image and action buttons
4. **Analytics**: Add notification analytics and tracking
5. **A/B Testing**: Implement notification A/B testing

## Support

For issues or questions:
1. Check console logs for error messages
2. Verify Firebase configuration
3. Test on both Android and iOS
4. Check device notification settings
