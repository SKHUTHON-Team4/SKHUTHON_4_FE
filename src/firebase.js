import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyAKrgZEk_cwpTuwHaJM_lpFSbVQeXYU9Ko',
  authDomain: 'cheongchun-da1ec.firebaseapp.com',
  projectId: 'cheongchun-da1ec',
  storageBucket: 'cheongchun-da1ec.firebasestorage.app',
  messagingSenderId: '192880311189',
  appId: '1:192880311189:web:65ff1e6bfbfdf334fd149c',
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

let firebaseApp;

function getFirebaseApp() {
  if (!firebaseApp) firebaseApp = initializeApp(firebaseConfig);
  return firebaseApp;
}

// 알림 권한 요청 + FCM 토큰 발급. 실패하거나 미지원 환경이면 null 반환.
export async function getFcmToken() {
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    if (!(await isSupported())) return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const messaging = getMessaging(getFirebaseApp());

    return await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
  } catch (err) {
    console.error('FCM 토큰 발급 실패', err);
    return null;
  }
}

// 이미 권한이 허용된 상태에서만 조용히 토큰을 재발급 (재요청 팝업 없음).
export async function getFcmTokenSilently() {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
    return null;
  }
  return getFcmToken();
}
