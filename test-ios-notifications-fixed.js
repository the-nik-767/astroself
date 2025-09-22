/**
 * Test script for iOS notifications
 * Run this with: node test-ios-notifications-fixed.js
 */

const https = require('https');

// Replace with your actual FCM server key from Firebase Console
const FCM_SERVER_KEY = 'YOUR_FCM_SERVER_KEY_HERE';

// Replace with the FCM token from your iOS device
const FCM_TOKEN = 'YOUR_FCM_TOKEN_HERE';

const sendNotification = (title, body, data = {}) => {
  const message = {
    to: FCM_TOKEN,
    notification: {
      title: title,
      body: body,
      sound: 'default',
      badge: 1
    },
    data: {
      ...data,
      click_action: 'FLUTTER_NOTIFICATION_CLICK'
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
          alert: {
            title: title,
            body: body
          }
        }
      }
    }
  };

  const options = {
    hostname: 'fcm.googleapis.com',
    path: '/fcm/send',
    method: 'POST',
    headers: {
      'Authorization': `key=${FCM_SERVER_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', responseData);
      if (res.statusCode === 200) {
        console.log('✅ Notification sent successfully!');
      } else {
        console.log('❌ Failed to send notification');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error sending notification:', error);
  });

  req.write(JSON.stringify(message));
  req.end();
};

// Test notifications
console.log('🧪 Testing iOS Notifications...\n');

// Test 1: Basic notification
console.log('Test 1: Basic notification');
sendNotification(
  'Test Notification',
  'This is a test notification from the fixed setup!',
  { test: 'basic' }
);

// Wait 2 seconds before next test
setTimeout(() => {
  console.log('\nTest 2: Notification with custom data');
  sendNotification(
    'Custom Data Test',
    'This notification has custom data attached',
    { 
      screen: 'Home',
      action: 'navigate',
      customData: 'test_value'
    }
  );
}, 2000);

// Wait 4 seconds before next test
setTimeout(() => {
  console.log('\nTest 3: Silent notification (data only)');
  const silentMessage = {
    to: FCM_TOKEN,
    data: {
      type: 'silent',
      message: 'This is a silent notification',
      timestamp: Date.now()
    },
    apns: {
      payload: {
        aps: {
          'content-available': 1
        }
      }
    }
  };

  const options = {
    hostname: 'fcm.googleapis.com',
    path: '/fcm/send',
    method: 'POST',
    headers: {
      'Authorization': `key=${FCM_SERVER_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Silent notification status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('✅ Silent notification sent successfully!');
    } else {
      console.log('❌ Failed to send silent notification');
    }
  });

  req.on('error', (error) => {
    console.error('❌ Error sending silent notification:', error);
  });

  req.write(JSON.stringify(silentMessage));
  req.end();
}, 4000);

console.log('\n📱 Instructions:');
console.log('1. Replace FCM_SERVER_KEY with your actual server key from Firebase Console');
console.log('2. Replace FCM_TOKEN with the token from your iOS device logs');
console.log('3. Run: node test-ios-notifications-fixed.js');
console.log('4. Check your iOS device for notifications');
