#!/bin/bash

# Test notification script
# Replace YOUR_SERVER_KEY with your Firebase Server Key
# Replace YOUR_FCM_TOKEN with the token from console logs

SERVER_KEY="YOUR_SERVER_KEY_HERE"
FCM_TOKEN="YOUR_FCM_TOKEN_HERE"

curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Authorization: key=$SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "'$FCM_TOKEN'",
    "notification": {
      "title": "Test Notification",
      "body": "This is a test notification from cURL!",
      "sound": "default"
    },
    "data": {
      "screen": "Home",
      "action": "test"
    }
  }'

echo ""
echo "Notification sent! Check your device."
