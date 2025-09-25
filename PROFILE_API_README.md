# Profile API Integration

This document describes the profile data API integration for the Astroself app.

## API Endpoint

**URL:** `https://astrology.hcshub.in/api/astrology/birth_data`

**Method:** `GET`

**Headers:**
- `Authorization: Bearer {token}`
- `accept: application/json`

**Query Parameters:**
- `userId`: The user's unique identifier
- `skip`: Pagination offset (default: 0)

## API Response Structure

```json
{
  "status": true,
  "message": null,
  "data": {
    "data": [],
    "user_details": {
      "_id": "689b2beb5f0f29825ef8388d",
      "email": "astros99@yopmail.com",
      "first_name": "astro",
      "last_name": "sample",
      "current_plan": "cosmic_foundation",
      "complete_profile": false,
      "members_allow": 1,
      "current_members": 0,
      "age": "",
      "birth_data": {},
      "birthplace": "",
      "created_at": "",
      "gender": "",
      "user_id": ""
    }
  }
}
```

## Implementation Details

### 1. Types (`src/types/api.ts`)

The API response types are defined in the `Api` namespace:

- `Api.User.Res.Detail`: User profile details interface
- `Api.User.Res.ProfileDataResponse`: Complete API response interface
- `Api.User.Res.BirthData`: Birth data interface (expandable)

### 2. User Service (`src/services/user/user.service.ts`)

The `UserService` class includes:

- `getProfileData(userId: string, skip: number)`: Fetches profile data from the API
- `hasValidToken()`: Checks if user has a valid authentication token
- `logout()`: Clears user data and token from storage

### 3. Custom Hook (`src/hooks/useProfileData.ts`)

The `useProfileData` hook provides:

- Profile data state management
- Loading and error states
- Automatic data fetching
- Refresh functionality
- Redux integration

### 4. Profile Screen (`src/screen/Profile/index.tsx`)

The Profile screen features:

- Real-time profile data display
- Loading states
- Error handling with retry options
- Pull-to-refresh functionality
- Responsive design

## Usage Example

```tsx
import { useProfileData } from '../hooks/useProfileData';

const ProfileScreen = () => {
  const { profileData, loading, error, refreshProfileData } = useProfileData();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refreshProfileData} />;

  return (
    <View>
      <Text>{profileData?.first_name} {profileData?.last_name}</Text>
      <Text>{profileData?.email}</Text>
      <Text>Plan: {profileData?.current_plan}</Text>
    </View>
  );
};
```

## Error Handling

The service handles various error scenarios:

- **401 Unauthorized**: Authentication failed, user needs to login again
- **404 Not Found**: Profile data not found
- **5xx Server Errors**: Server issues, retry later
- **Network Errors**: Connection issues

## Authentication

The API requires a Bearer token stored in AsyncStorage as `USER_TOKEN`. The token is automatically included in all profile API requests.

## State Management

Profile data is managed through Redux using the `appSlice`:

- `setUser()`: Updates the global user state
- User data is persisted in AsyncStorage as `USER_DATA`

## Features

- ✅ Real-time profile data fetching
- ✅ Loading and error states
- ✅ Pull-to-refresh functionality
- ✅ Automatic token management
- ✅ Comprehensive error handling
- ✅ Redux state integration
- ✅ TypeScript support
- ✅ Responsive UI design

## Future Enhancements

- Profile data caching
- Offline support
- Profile data editing
- Image upload for profile pictures
- Birth chart generation
- Member management integration
