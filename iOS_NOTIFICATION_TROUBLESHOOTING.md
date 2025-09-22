# 🔔 iOS Notification Troubleshooting Guide

iOS में notification नहीं आ रही है तो यह complete guide follow करें।

## 🚨 Common Issues और Solutions

### 1. **APNs Certificate Issue**
```
Problem: FCM token generate हो रहा है लेकिन notification नहीं आ रही
Solution: Firebase Console में APNs certificate check करें
```

**Steps:**
1. Firebase Console → Project Settings → Cloud Messaging
2. iOS app configuration check करें
3. APNs certificate upload करें (Development/Production)
4. Bundle ID match करें

### 2. **Provisioning Profile Issue**
```
Problem: App build हो रहा है लेकिन notification permission नहीं मिल रहा
Solution: Provisioning profile में Push Notifications capability enable करें
```

**Steps:**
1. Apple Developer Console → Certificates, Identifiers & Profiles
2. App ID select करें
3. Push Notifications capability enable करें
4. New provisioning profile generate करें
5. Xcode में update करें

### 3. **Code Signing Issue**
```
Problem: App crash हो रहा है या notification service नहीं चल रहा
Solution: Proper code signing setup करें
```

**Steps:**
1. Xcode → Project → Signing & Capabilities
2. Team select करें
3. Bundle Identifier check करें
4. Push Notifications capability add करें

### 4. **GoogleService-Info.plist Issue**
```
Problem: Firebase configuration error
Solution: GoogleService-Info.plist properly configure करें
```

**Steps:**
1. Firebase Console → Project Settings → iOS app
2. GoogleService-Info.plist download करें
3. Xcode project में add करें
4. Target membership check करें

## 🔧 Step-by-Step Fix

### Step 1: Check AppDelegate.swift
```swift
// Make sure these are present:
import UserNotifications
import Firebase

class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
  // ... rest of the code
}
```

### Step 2: Check Info.plist
```xml
<key>NSUserNotificationsUsageDescription</key>
<string>This app needs notification permission to send you important updates and alerts.</string>
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
    <string>background-processing</string>
</array>
```

### Step 3: Check Firebase Configuration
1. **GoogleService-Info.plist** project में है
2. **Bundle ID** Firebase Console में match कर रहा है
3. **APNs certificate** uploaded है

### Step 4: Check Xcode Project Settings
1. **Push Notifications** capability enabled है
2. **Background Modes** enabled है
3. **Code Signing** properly configured है

## 🧪 Testing Steps

### 1. **Debug Component Use करें**
App में "🐛 iOS Debug" button दिखेगा, उसे press करें:
- Permission status check करें
- FCM token verify करें
- Test notification try करें

### 2. **Console Logs Check करें**
```bash
npx react-native log-ios
```

Look for:
- "APNs token registered"
- "FCM Token: ..."
- "Notification permission granted"

### 3. **Firebase Console Test**
1. Firebase Console → Cloud Messaging
2. "Send your first message"
3. FCM token use करें
4. Test notification भेजें

### 4. **Device Settings Check करें**
1. Settings → Notifications → Astroself
2. Allow Notifications ON
3. Alert Style: Banners या Alerts
4. Sounds ON
5. Badges ON

## 🔍 Debug Commands

### 1. **Clean Build**
```bash
cd ios
rm -rf build
rm -rf Pods
rm Podfile.lock
pod install
cd ..
npx react-native run-ios
```

### 2. **Check Pods**
```bash
cd ios
pod install --repo-update
```

### 3. **Check Firebase Dependencies**
```bash
npm list @react-native-firebase/app
npm list @react-native-firebase/messaging
```

## 📱 Device-Specific Issues

### 1. **iOS Simulator**
- Simulator में push notifications काम नहीं करती
- **Real device** पर test करें

### 2. **iOS 15+**
- Focus modes check करें
- Do Not Disturb check करें
- Notification summary check करें

### 3. **iOS 16+**
- Lock Screen notifications check करें
- Notification settings verify करें

## 🚀 Quick Fix Checklist

- [ ] AppDelegate.swift में UNUserNotificationCenterDelegate add किया
- [ ] Info.plist में notification permissions add किए
- [ ] Firebase Console में APNs certificate uploaded
- [ ] Xcode में Push Notifications capability enabled
- [ ] GoogleService-Info.plist properly added
- [ ] Real device पर test किया
- [ ] Device notification settings ON किए
- [ ] FCM token generate हो रहा है
- [ ] Console logs check किए

## 🐛 Debug Information

### Console में ये logs दिखने चाहिए:
```
APNs token registered: <token>
FCM Token: <token>
Notification permission granted
Authorization status: 1
```

### अगर ये logs नहीं दिख रहे:
1. **APNs token नहीं मिल रहा** → Provisioning profile issue
2. **FCM Token नहीं मिल रहा** → Firebase configuration issue
3. **Permission denied** → Device settings issue

## 📞 Support

अगर अभी भी issue है तो:

1. **Debug component** से information collect करें
2. **Console logs** screenshot लें
3. **Firebase Console** configuration check करें
4. **Xcode project** settings verify करें

## 🎯 Final Test

1. App install करें
2. Permission grant करें
3. FCM token copy करें
4. Firebase Console से test notification भेजें
5. Notification receive करें ✅

---

**Note:** iOS में push notifications के लिए proper Apple Developer account और certificates की जरूरत होती है। Development के लिए APNs development certificate, Production के लिए APNs production certificate चाहिए।
