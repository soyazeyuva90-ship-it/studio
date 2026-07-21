
# SafeGuard Android Agent Architecture (Native Kotlin)

This document outlines the native implementation for the monitoring agent.

## 1. Core Components

### Foreground Service (`SafeGuardService.kt`)
- **Purpose**: Ensure persistent background operation and real-time command listening.
- **Notification**: Sticky notification with `PRIORITY_LOW` to comply with Google Play transparency policies.
- **Capabilities**: Maintains a WebSocket/Firestore connection for "Instant Sync" commands.

### WorkManager (`SyncWorker.kt`)
- **Purpose**: Periodic batch upload of accumulated logs (SMS, Calls, Usage).
- **Strategy**: Scheduled every 15-30 minutes with `NetworkType.CONNECTED` constraints.
- **Batching**: Aggregates local SQLite logs into a single JSON payload for `POST /api/telemetry/sync`.

### Accessibility Service (`LogService.kt`)
- **Purpose**: Intercept notifications, web URLs, and app-specific social interactions (WhatsApp/Snapchat).
- **Permissions**: Requires explicit user consent via System Settings.

## 2. API Integration (Retrofit)

```kotlin
interface SafeGuardApi {
    @POST("telemetry/sync")
    suspend fun syncLogs(@Body payload: SyncPayload): Response<SyncResult>

    @POST("devices/register")
    suspend fun registerDevice(@Body info: DeviceInfo): Response<DeviceIdentity>
}
```

## 3. Critical Permissions

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.READ_CALL_LOG" />
<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" tools:ignore="ProtectedPermissions" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
```
