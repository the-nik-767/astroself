// iOS Notification Test Script
// Run this in your React Native app console or as a test

const testiOSNotifications = async () => {
  console.log('🧪 Testing iOS Notifications...');
  console.log('================================');
  
  try {
    // Import Firebase messaging
    const messaging = require('@react-native-firebase/messaging').default;
    
    // 1. Check permission status
    console.log('1️⃣ Checking permission status...');
    const authStatus = await messaging().hasPermission();
    console.log('Permission Status:', authStatus);
    console.log('Status Meaning:', 
      authStatus === 1 ? 'Authorized' : 
      authStatus === 2 ? 'Denied' : 
      authStatus === 0 ? 'Not Determined' : 'Provisional'
    );
    
    // 2. Request permission if needed
    if (authStatus !== 1) {
      console.log('2️⃣ Requesting permission...');
      const newAuthStatus = await messaging().requestPermission({
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      });
      console.log('New Permission Status:', newAuthStatus);
    }
    
    // 3. Get FCM token
    console.log('3️⃣ Getting FCM token...');
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
    console.log('Token Length:', fcmToken.length);
    
    // 4. Check if token is valid
    if (fcmToken && fcmToken.length > 0) {
      console.log('✅ FCM Token generated successfully!');
      console.log('📋 Copy this token to Firebase Console for testing:');
      console.log('=====================================');
      console.log(fcmToken);
      console.log('=====================================');
    } else {
      console.log('❌ FCM Token generation failed!');
    }
    
    // 5. Test message handlers
    console.log('4️⃣ Setting up message handlers...');
    
    // Foreground message handler
    messaging().onMessage(async remoteMessage => {
      console.log('📨 Foreground message received:', remoteMessage);
    });
    
    // Background message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📨 Background message received:', remoteMessage);
    });
    
    // Notification opened app handler
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('📨 Notification opened app:', remoteMessage);
    });
    
    // Initial notification handler
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      console.log('📨 Initial notification:', initialNotification);
    }
    
    console.log('✅ All tests completed!');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Copy the FCM token above');
    console.log('2. Go to Firebase Console → Cloud Messaging');
    console.log('3. Send a test notification using the token');
    console.log('4. Check if notification appears on device');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
  }
};

// Export for use
module.exports = { testiOSNotifications };

// Auto-run if called directly
if (require.main === module) {
  testiOSNotifications();
}
