## Architectural Overview

<img src="https://firebase.google.com/static/docs/cloud-messaging/images/diagram-FCM.png" />

1. The message is composed, either in the Notifications composer or a trusted environment, and a message request is sent to the FCM backend.
1. The FCM backend receives the message request, generates a message ID and other metadata, and sends it to the platform specific transport layer.
1. When the device is online, the message is sent via the platform-specific transport layer to the device.
1. On the device, the client app receives the message or notification.

## Installation
### Firebase Client SDK
Used in client components for auth, Firestore, etc.
```sh
npm install firebase
```
This installs:

- `firebase/app` – initialize Firebase
- `firebase/auth` – client-side authentication
- `firebase/firestore` – Firestore database
- `firebase/storage` – Cloud Storage
- `firebase/functions` – callable functions (optional)
- `firebase/analytics` – analytics (optional)

Used in:

- Client Components (`"use client"`)
- Browser-only code

### Firebase Admin SDK
Used in server actions, API routes, middleware, cron jobs

```sh
npm install firebase-admin
```
This provides:

- `firebase-admin/app` – initialize Admin app
- `firebase-admin/auth` – manage users, verify tokens
- `firebase-admin/firestore` – full Firestore access
- `firebase-admin/storage` – admin access to Storage

Used in:

- Server Actions
- API Routes (app/api/*)
- Middleware
- Cron jobs
- Background tasks

> Never import `firebase-admin` into client components.