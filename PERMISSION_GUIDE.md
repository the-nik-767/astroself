# 🔔 Notification Permission Guide

यह guide बताता है कि कैसे notification permission को properly handle करें।

## ✨ Features Added

### 1. **Automatic Permission Request**
- App start होने पर automatically permission check होता है
- अगर permission नहीं है तो modal show होता है
- User को enable करने का option मिलता है

### 2. **Permission Request Modal**
- Beautiful modal with benefits explanation
- Enable button
- Settings redirect option
- "Maybe Later" option

### 3. **Notification Banner**
- Top पर banner show होता है अगर permission नहीं है
- Tap करने पर modal open होता है
- Smooth animation के साथ

### 4. **Permission Settings Screen**
- Complete settings screen
- FCM token display
- Manual permission enable
- Help section

### 5. **Smart Permission Checker**
- Permission status tracking
- One-time permission request
- Device-specific guidance

## 🚀 How It Works

### App Start Flow:
```
1. App starts
2. Check notification permission
3. If not granted:
   - Show banner after 2 seconds
   - Show modal if first time
4. User can enable from banner or modal
5. Once enabled, banner disappears
```

### Permission States:
- ✅ **Granted**: Notifications enabled
- ❌ **Denied**: User denied permission
- ❓ **Not Determined**: First time, show request
- 🔄 **Provisional**: iOS provisional permission

## 📱 Usage Examples

### 1. Basic Usage (Already implemented in App.tsx)
```tsx
import { useNotifications } from './src/hooks/useNotifications';

const MyComponent = () => {
  const { isNotificationEnabled, requestPermission } = useNotifications();
  
  return (
    <View>
      {!isNotificationEnabled && (
        <TouchableOpacity onPress={requestPermission}>
          <Text>Enable Notifications</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
```

### 2. Using Permission Checker
```tsx
import permissionChecker from './src/utils/permissionChecker';

const checkPermission = async () => {
  const status = await permissionChecker.checkPermissionStatus();
  console.log('Permission status:', status);
  
  if (!status.granted) {
    const granted = await permissionChecker.showPermissionRequest();
    if (granted) {
      console.log('Permission granted!');
    }
  }
};
```

### 3. Custom Permission Modal
```tsx
import PermissionRequestModal from './src/components/PermissionRequestModal';

const MyScreen = () => {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <View>
      <TouchableOpacity onPress={() => setShowModal(true)}>
        <Text>Enable Notifications</Text>
      </TouchableOpacity>
      
      <PermissionRequestModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
};
```

## 🎯 Testing Scenarios

### 1. First Time User
- App install करें
- Permission modal automatically show होगा
- "Enable Notifications" press करें
- Permission grant करें
- Banner disappear हो जाएगा

### 2. Permission Denied
- Settings में जाकर permission deny करें
- App restart करें
- Banner show होगा
- "Open Settings" press करें
- Settings open हो जाएंगे

### 3. Permission Granted
- Permission enable करें
- App restart करें
- No banner या modal show होगा
- FCM token console में दिखेगा

## 🔧 Customization

### 1. Modal Timing
```tsx
// App.tsx में timing change करें
const timer = setTimeout(() => {
  setShowPermissionModal(true);
}, 3000); // 3 seconds instead of 2
```

### 2. Banner Styling
```tsx
// NotificationBanner.tsx में styles modify करें
const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FF6B6B', // Different color
    // ... other styles
  }
});
```

### 3. Permission Check Logic
```tsx
// permissionChecker.ts में logic modify करें
async shouldShowPermissionRequest(): Promise<boolean> {
  // Custom logic here
  return true; // Always show
}
```

## 📊 Permission States

| State | Description | Action |
|-------|-------------|---------|
| `granted` | Permission granted | Show success message |
| `denied` | Permission denied | Show settings redirect |
| `notDetermined` | First time | Show permission request |
| `provisional` | iOS provisional | Show info message |

## 🐛 Troubleshooting

### Common Issues:

1. **Modal not showing**
   - Check if `isLoading` is false
   - Check if `isNotificationEnabled` is false
   - Check console for errors

2. **Permission not working**
   - Check Firebase configuration
   - Check device notification settings
   - Restart app after permission grant

3. **Banner not disappearing**
   - Check permission status
   - Force refresh app state
   - Check for state update issues

### Debug Commands:
```bash
# Check logs
npx react-native log-android
npx react-native log-ios

# Reset permission check
# Add this to your code for testing
await permissionChecker.resetPermissionCheck();
```

## 🎨 UI Components

### 1. PermissionRequestModal
- Full screen modal
- Benefits explanation
- Enable button
- Settings redirect
- Maybe later option

### 2. NotificationBanner
- Top banner
- Slide animation
- Enable button
- Auto-hide when enabled

### 3. NotificationPermissionScreen
- Complete settings screen
- Status display
- FCM token viewer
- Help section

## 🔄 Permission Flow

```
App Start
    ↓
Check Permission
    ↓
Permission Granted?
    ↓ No                    ↓ Yes
Show Banner              Continue
    ↓
User Taps Banner
    ↓
Show Modal
    ↓
User Enables?
    ↓ No                    ↓ Yes
Show Settings            Hide Banner
    ↓                        ↓
User Enables              Continue
    ↓
Hide Banner
```

## 📝 Notes

- Permission request only shows once per app install
- Banner shows every time if permission not granted
- FCM token is generated only after permission granted
- All components are fully customizable
- TypeScript support included

## 🚀 Next Steps

1. **Test the implementation**
2. **Customize UI as needed**
3. **Add to your navigation**
4. **Test on different devices**
5. **Add analytics tracking**

अब आपका notification permission system complete है! 🎉
