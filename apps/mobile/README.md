# DailyPlanner Mobile

Expo React Native Mobile MVP.

## Setup

```bash
cd apps/mobile
npm install
npx expo start
```

Android emulator:

```bash
npx expo start --android
```

## Backend URL

Default development URL:

```txt
http://localhost:8000
```

The app can also read `EXPO_PUBLIC_API_URL` at startup:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000 npx expo start --android
```

Android Emulator usually reaches the host machine with:

```txt
http://10.0.2.2:8000
```

For a real phone, use your computer's local network IP:

```txt
http://192.168.x.x:8000
```

This value can also be changed from the mobile Settings screen.

## WhatsApp Intake Flow

1. Share or copy a WhatsApp message.
2. DailyPlanner opens the Inbox Intake screen, or you paste manually in Expo Go/web.
3. Review or edit the raw message.
4. Tap `Analyze with AI`.
5. The backend returns task suggestions: title, description, dueDate, priority and tags.
6. Tap `Create task(s)` to confirm task creation.

Analyze never creates tasks automatically. Task creation only happens after user confirmation.

## Offline Queue

If the backend cannot be reached, manual capture content is kept in AsyncStorage and can be retried later from the Inbox screen.

## Android Share Intent

`app.json` includes an Android `ACTION_SEND` intent filter for `text/plain` and `text/*`, so DailyPlanner can appear in Android's share sheet for shared text.

Expo Go cannot fully test native Android share target behavior. Use a development build, prebuild, or APK to test the real share sheet flow. Expo Go and web testing should use the paste-message fallback.

## Auth Flow

The mobile app uses the backend auth endpoints:

1. Register.
2. Verify the 6-digit email code.
3. Login.
4. Refresh the session when the access token expires.
5. Logout from Settings to clear stored tokens.

Password reset is available from the mobile auth screen:

1. Forgot password.
2. Enter email.
3. Enter the 6-digit code.
4. Set a new password.

See `docs/play-store-release.md` for the Play Store preparation checklist.

## Security

- Gemini API key is never stored in the mobile app.
- Mobile calls only backend endpoints.
- WhatsApp messages are read only when the user explicitly shares or pastes them.
- Local pending captures are stored in AsyncStorage.
- Auth tokens are stored in AsyncStorage for MVP; production should evaluate native secure storage.
