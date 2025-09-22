# iOS Notification Fixes

## Issues Fixed

### 1. FCM Token Keeps Changing
**Problem**: FCM token was being refreshed every time the app came to foreground, causing it to change frequently.

**Solution**:
- Added proper token refresh listener in `notificationService.ts`
- Modified `useNotifications.ts` to only refresh token when no token exists
- Added token persistence in AsyncStorage
- Implemented proper token refresh handling in AppDelegate

### 2. iOS Notifications Not Delivering
**Problem**: iOS notifications were not being delivered due to improper Firebase Messaging setup.

**Solution**:
- Added `MessagingDelegate` to AppDelegate
- Properly configured APNs token handling
- Added Firebase Messaging delegate methods
- Fixed notification permission handling

### 3. Incorrect Entitlements
**Problem**: Both debug and release entitlements were set to "development".

**Solution**:
- Updated `AstroselfRelease.entitlements` to use "production" environment
- Kept `AstroselfDebug.entitlements` as "development" for testing

## Files Modified

### iOS Files
1. **AppDelegate.swift**
   - Added `FirebaseMessaging` import
   - Implemented `MessagingDelegate`
   - Added proper APNs token handling
   - Added token refresh listener

2. **AstroselfRelease.entitlements**
   - Changed APS environment from "development" to "production"

### React Native Files
1. **notificationService.ts**
   - Added token refresh listener
   - Improved error handling
   - Added proper initialization method

2. **useNotifications.ts**
   - Fixed token refresh logic
   - Added token change listener
   - Prevented unnecessary token refreshes

## Testing

### Manual Testing
1. Run the app on iOS device
2. Check console logs for FCM token
3. Use the test script: `node test-ios-notifications-fixed.js`
4. Verify notifications are received

### Test Script Usage
1. Get your FCM server key from Firebase Console
2. Get FCM token from device logs
3. Update the test script with your credentials
4. Run: `node test-ios-notifications-fixed.js`

## Key Improvements

1. **Stable FCM Token**: Token only changes when necessary (app reinstall, token refresh)
2. **Proper iOS Setup**: Full Firebase Messaging integration with APNs
3. **Better Error Handling**: Improved error messages and logging
4. **Token Persistence**: FCM token is stored and retrieved from AsyncStorage
5. **Production Ready**: Correct entitlements for production builds

## Debugging

### Check FCM Token
```javascript
console.log('FCM Token:', fcmToken);
```

### Check Notification Permission
```javascript
console.log('Notification Enabled:', isNotificationEnabled);
```

### Check iOS Logs
Look for these logs in Xcode console:
- "APNs token registered"
- "Firebase registration token"
- "Notification permission granted"

## Common Issues

1. **Token Still Changing**: Make sure you're not calling `refreshToken()` unnecessarily
2. **Notifications Not Received**: Check APNs certificate and entitlements
3. **Permission Denied**: Ensure proper permission request flow

## Next Steps

1. Test on physical iOS device
2. Verify notifications work in background
3. Test notification tap handling
4. Implement server-side notification sending
