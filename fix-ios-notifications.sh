#!/bin/bash

echo "🔔 iOS Notification Fix Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📱 Checking iOS setup..."

# 1. Clean iOS build
echo "🧹 Cleaning iOS build..."
cd ios
rm -rf build
rm -rf Pods
rm -f Podfile.lock

# 2. Reinstall pods
echo "📦 Reinstalling pods..."
pod install --repo-update

# 3. Go back to root
cd ..

# 4. Clean React Native cache
echo "🧹 Cleaning React Native cache..."
npx react-native start --reset-cache &

# 5. Wait a bit
sleep 3

# 6. Kill the metro bundler
pkill -f "react-native start"

echo "✅ iOS setup cleaned and ready!"
echo ""
echo "🚀 Next steps:"
echo "1. Run: npx react-native run-ios"
echo "2. Check console logs for FCM token"
echo "3. Use the debug component (🐛 iOS Debug button)"
echo "4. Test notification from Firebase Console"
echo ""
echo "📋 Make sure you have:"
echo "- APNs certificate in Firebase Console"
echo "- Push Notifications capability in Xcode"
echo "- Real device for testing (not simulator)"
echo "- Proper provisioning profile"

# 7. Check if GoogleService-Info.plist exists
if [ -f "ios/GoogleService-Info.plist" ]; then
    echo "✅ GoogleService-Info.plist found"
else
    echo "❌ GoogleService-Info.plist not found!"
    echo "   Please add it to ios/ directory"
fi

# 8. Check if APNs is configured
echo ""
echo "🔍 To check APNs configuration:"
echo "1. Go to Firebase Console"
echo "2. Project Settings → Cloud Messaging"
echo "3. Check iOS app configuration"
echo "4. Upload APNs certificate if needed"

echo ""
echo "🎯 Debug tips:"
echo "- Use the debug component in the app"
echo "- Check device notification settings"
echo "- Test on physical device, not simulator"
echo "- Check Xcode console for errors"

echo ""
echo "✨ Fix script completed!"
