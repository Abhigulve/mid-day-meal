# Mid-Day Meal Mobile App

React Native mobile application for the Mid-Day Meal Management System.

## Prerequisites

- Node.js 16+
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Expo CLI

```bash
npm install -g expo-cli
```

### 3. Configure API Endpoint

Update the API URL in `src/services/ApiService.ts`:

```typescript
const BASE_URL = 'http://your-backend-url:8080/api';
```

For local development with Android emulator:
```typescript
const BASE_URL = 'http://10.0.2.2:8080/api';
```

For local development with iOS simulator:
```typescript
const BASE_URL = 'http://localhost:8080/api';
```

### 4. Run the Application

```bash
# Start the Expo development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web
npm run web
```

## Features

- **Dashboard**: Overview of meal statistics and quick actions
- **Menu Viewing**: Browse current and upcoming meal menus
- **Meal Records**: View and manage daily meal records
- **School Information**: Access school details and contact info
- **Profile Management**: User profile and logout functionality
- **Offline Support**: Basic offline functionality for viewing cached data
- **Multi-language**: Support for English and Marathi

## Building for Production

### Android APK

```bash
# Build APK
expo build:android

# Build Android App Bundle (recommended for Play Store)
expo build:android -t app-bundle
```

### iOS IPA

```bash
# Build for iOS
expo build:ios
```

## Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **React Native Paper** - Material Design components
- **Axios** - HTTP client
- **AsyncStorage** - Local data persistence

## Default Login Credentials

- **Admin**: username: `admin`, password: `admin123`
- **Principal**: username: `principal_gps001`, password: `principal123`
- **Teacher**: username: `teacher_gps001`, password: `teacher123`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/       # Main application screens
├── navigation/    # Navigation configuration
├── services/      # API services and context
├── utils/         # Helper functions and themes
└── types/         # TypeScript type definitions
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   expo start -c
   ```

2. **Android build issues**:
   - Make sure Android SDK is properly installed
   - Check that ANDROID_HOME environment variable is set

3. **Network connectivity**:
   - Ensure your device/emulator can reach the backend server
   - Check firewall settings
   - Verify API URL configuration