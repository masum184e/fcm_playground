importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

let messaging;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_FIREBASE_CONFIG') {
    const config = event.data.config;
    
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
      messaging = firebase.messaging();
      
      // Set up background handler only after initialization
      messaging.onBackgroundMessage((payload) => {
        console.log('[sw.js] Background message received ', payload);
        const notificationTitle = payload.notification?.title || "New Message";
        const notificationOptions = {
          body: payload.notification?.body,
          icon: '/next.svg'
        };
        self.registration.showNotification(notificationTitle, notificationOptions);
      });
      
      console.log("Service Worker: Firebase initialized via message.");
    }
  }
});