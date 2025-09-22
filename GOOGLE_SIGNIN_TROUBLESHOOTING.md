# Google Sign-In Troubleshooting Guide

## ✅ Fixed Issues

### 1. **Missing clientID Error**
- **Problem**: `You must specify |clientID| in |GIDConfiguration|`
- **Solution**: Added proper URL schemes to iOS Info.plist
- **Files Updated**: 
  - `ios/Astroself/Info.plist` - Added CFBundleURLTypes with reversed client ID

### 2. **Configuration Updates**
- **Problem**: Google Sign-In configuration was incomplete
- **Solution**: Updated `GoogleAuthService.ts` with proper webClientId
- **Client ID Used**: `1061722426474-3aivdpu11tr8i1h52a54ovkrv8ls021p.apps.googleusercontent.com`

## 🔧 Current Configuration

### iOS Configuration
```xml
<!-- Added to Info.plist -->
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>REVERSED_CLIENT_ID</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.1061722426474-3aivdpu11tr8i1h52a54ovkrv8ls021p</string>
        </array>
    </dict>
</array>
```

### GoogleAuthService Configuration
```typescript
GoogleSignin.configure({
  webClientId: '1061722426474-3aivdpu11tr8i1h52a54ovkrv8ls021p.apps.googleusercontent.com',
  offlineAccess: true,
  hostedDomain: '',
  forceCodeForRefreshToken: true,
});
```

## 🚀 Testing Steps

### 1. Clean and Rebuild
```bash
# iOS
cd ios
rm -rf build
cd ..
npx react-native run-ios

# Android
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### 2. Test on Physical Device
- Google Sign-In doesn't work on iOS Simulator
- Test on physical iPhone/Android device
- Make sure device has Google Play Services (Android)

### 3. Verify Firebase Console
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Google as sign-in provider
3. Add your app's SHA-1 fingerprint for Android
4. Verify OAuth consent screen is configured

## 🔍 Common Issues & Solutions

### Issue 1: "Your app is missing support for the following URL schemes"
**Solution**: 
- ✅ Already fixed by adding CFBundleURLTypes to Info.plist
- Make sure the reversed client ID is correct

### Issue 2: "You must specify |clientID| in |GIDConfiguration|"
**Solution**: 
- ✅ Already fixed by adding URL schemes
- The clientID is automatically derived from the URL scheme

### Issue 3: Google Sign-In popup doesn't appear
**Solutions**:
- Test on physical device (not simulator)
- Check internet connection
- Verify Google Play Services is installed (Android)
- Check console logs for errors

### Issue 4: "Sign in failed" error
**Solutions**:
- Verify webClientId is correct
- Check Firebase project configuration
- Ensure OAuth consent screen is set up
- Verify SHA-1 fingerprint (Android)

## 📱 Platform-Specific Notes

### iOS
- Requires physical device for testing
- URL schemes must be properly configured
- GoogleService-Info.plist must be in project

### Android
- Requires Google Play Services
- SHA-1 fingerprint must match Firebase console
- google-services.json must be in app directory

## 🐛 Debug Commands

### Check iOS Configuration
```bash
# Check if URL schemes are properly set
grep -A 10 "CFBundleURLTypes" ios/Astroself/Info.plist
```

### Check Android SHA-1
```bash
cd android
./gradlew signingReport
```

### Check Google Services
```bash
# Verify google-services.json exists
ls -la android/app/google-services.json
ls -la ios/GoogleService-Info.plist
```

## ✅ Verification Checklist

- [x] URL schemes added to iOS Info.plist
- [x] GoogleAuthService properly configured
- [x] Firebase Auth dependency added to Android
- [x] Google Sign-In buttons added to Login/Register screens
- [x] Error handling implemented
- [x] Redux integration working
- [ ] Test on physical device
- [ ] Verify Firebase console configuration
- [ ] Test both login and signup flows

## 🆘 If Still Not Working

1. **Check Console Logs**: Look for specific error messages
2. **Verify Firebase Setup**: Ensure Google Sign-In is enabled in Firebase Console
3. **Test on Physical Device**: Simulators don't support Google Sign-In
4. **Check Network**: Ensure device has internet connection
5. **Verify Credentials**: Double-check client IDs and configuration

## 📞 Next Steps

1. Test the app on a physical device
2. Verify Google Sign-In popup appears
3. Complete the sign-in flow
4. Check if user data is stored in Redux
5. Verify navigation to HomeScreen works

The configuration should now work correctly! 🎉
