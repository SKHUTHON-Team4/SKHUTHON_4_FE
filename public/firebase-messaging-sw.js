importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAKrgZEk_cwpTuwHaJM_lpFSbVQeXYU9Ko',
  authDomain: 'cheongchun-da1ec.firebaseapp.com',
  projectId: 'cheongchun-da1ec',
  storageBucket: 'cheongchun-da1ec.firebasestorage.app',
  messagingSenderId: '192880311189',
  appId: '1:192880311189:web:65ff1e6bfbfdf334fd149c',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};

  self.registration.showNotification(title || '청춘잇다', {
    body: body || '',
    icon: '/assets/bear-face.png',
    badge: '/assets/bell.png',
  });
});
