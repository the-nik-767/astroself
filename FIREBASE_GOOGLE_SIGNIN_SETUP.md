# Firebase Google Sign-In Setup Guide

## 🚨 Current Issue: DEVELOPER_ERROR

The `DEVELOPER_ERROR` occurs because your Firebase project doesn't have the Google Sign-In OAuth client properly configured.

## ✅ Your Current Configuration

### SHA-1 Fingerprint (Debug)
```
FC:01:81:17:7B:65:CF:A8:6F:B3:92:8B:4F:55:F3:CB:44:09:79:E9
```

### Package Name
```
com.astroself
```

### Project ID
```
astroself-b6835
```

## 🔧 Step-by-Step Fix

### Step 1: Firebase Console Configuration

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `astroself-b6835`

2. **Enable Google Sign-In**
   - Go to **Authentication** → **Sign-in method**
   - Click on **Google** provider
   - Toggle **Enable**
   - Click **Save**

3. **Add Android App SHA-1 Fingerprint**
   - Go to **Project Settings** (gear icon)
   - Scroll down to **Your apps** section
   - Find your Android app: `com.astroself`
   - Click **Add fingerprint**
   - Add this SHA-1: `FC:01:81:17:7B:65:CF:A8:6F:B3:92:8B:4F:55:F3:CB:44:09:79:E9`
   - Click **Save**

4. **Download Updated google-services.json**
   - After adding SHA-1, download the new `google-services.json`
   - Replace the existing file in `android/app/google-services.json`

### Step 2: OAuth Consent Screen

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select project: `astroself-b6835`

2. **Configure OAuth Consent Screen**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Choose **External** user type
   - Fill in required fields:
     - App name: `Astroself`
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (your email)

3. **Create OAuth 2.0 Client ID**
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Android**
   - Name: `Astroself Android`
   - Package name: `com.astroself`
   - SHA-1: `FC:01:81:17:7B:65:CF:A8:6F:B3:92:8B:4F:55:F3:CB:44:09:79:E9`
   - Click **Create**

### Step 3: Update google-services.json

After completing the above steps, your `google-services.json` should look like this:

```json
{
  "project_info": {
    "project_number": "1061722426474",
    "project_id": "astroself-b6835",
    "storage_bucket": "astroself-b6835.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:1061722426474:android:2fd65a19b917d558b54e13",
        "android_client_info": {
          "package_name": "com.astroself"
        }
      },
      "oauth_client": [
        {
          "client_id": "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
          "client_type": 1,
          "android_info": {
            "package_name": "com.astroself",
            "certificate_hash": "fc0181177b65cfa86fb3928b4f55f3cb440979e9"
          }
        },
        {
          "client_id": "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
          "client_type": 3
        }
      ],
      "api_key": [
        {
          "current_key": "AIzaSyCnjQB8ll3mWB91RYxmbkXo2riwnY6MnFM"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
  ],
  "configuration_version": "1"
}
```

### Step 4: Update GoogleAuthService

Once you have the new `google-services.json`, update the `webClientId` in your `GoogleAuthService.ts`:

```typescript
private configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // From google-services.json
    offlineAccess: true,
    hostedDomain: '',
    forceCodeForRefreshToken: true,
  });
}
```

## 🧪 Testing Steps

1. **Clean and Rebuild**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

2. **Test on Physical Device**
   - Google Sign-In doesn't work on emulator
   - Test on real Android device

3. **Check Console Logs**
   - Look for any error messages
   - Verify SHA-1 fingerprint matches

## 🔍 Troubleshooting

### If still getting DEVELOPER_ERROR:

1. **Verify SHA-1 Fingerprint**
   - Make sure it matches exactly in Firebase Console
   - Check both debug and release fingerprints

2. **Check Package Name**
   - Must match exactly: `com.astroself`

3. **Verify OAuth Client**
   - Check if `oauth_client` array is populated in `google-services.json`

4. **Test with Different Account**
   - Try with a different Google account
   - Make sure the account is added as test user

### Common Issues:

- **SHA-1 mismatch**: Double-check fingerprint in Firebase Console
- **Package name mismatch**: Verify in `android/app/build.gradle`
- **OAuth not enabled**: Check Firebase Console → Authentication
- **Wrong client ID**: Use the web client ID, not Android client ID

## 📱 Release Build

For production, you'll also need to add your release SHA-1 fingerprint:

```bash
# Generate release keystore SHA-1
keytool -list -v -keystore android/app/release.keystore -alias your-key-alias
```

Add the release SHA-1 to Firebase Console as well.

## ✅ Success Indicators

- Google Sign-In popup appears
- No DEVELOPER_ERROR in console
- User data is stored in Redux
- Navigation to HomeScreen works

The key issue is that your Firebase project needs the OAuth client properly configured with the correct SHA-1 fingerprint!
