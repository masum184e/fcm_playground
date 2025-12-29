// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_FIREBASE_CONFIG') {
    const config = event.data.config;

    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
      const messaging = firebase.messaging();

      messaging.onBackgroundMessage((payload) => {
        console.log('[sw.js] Background message received', payload);
        const notificationTitle = payload.notification?.title || "New Message";
        const notificationOptions = {
          body: payload.notification?.body,
          icon: '/icon.png',
          data: payload.data
        };
        self.registration.showNotification(notificationTitle, notificationOptions);
      });
    }
  }
});