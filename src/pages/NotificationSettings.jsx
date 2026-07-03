import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProfile,
  toggleNightNotification,
  toggleMorningNotification,
  toggleNightEmailNotification,
  toggleNightPushNotification,
  toggleMorningEmailNotification,
  toggleMorningPushNotification,
  updateFcmToken,
} from '../api';
import { getFcmToken } from '../firebase';
import ToggleSwitch from '../components/common/ToggleSwitch';
import BottomNav from '../components/common/BottomNav';

export default function NotificationSettings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => {});
  }, []);

  const applyNotificationUpdate = (res) => {
    if (res?.data) setProfile((prev) => ({ ...prev, ...res.data }));
  };

  // 이메일/푸시를 켤 때, 상위 밤/아침 알림이 꺼져 있으면 함께 켜서
  // 실제로 알림이 발송되도록 보장한다 (백엔드는 상위 플래그가 꺼지면 발송하지 않음).
  const ensureMasterOn = async (isMasterOn, toggleMasterFn) => {
    if (!isMasterOn) applyNotificationUpdate(await toggleMasterFn().catch(() => null));
  };

  const handleNightEmailNotification = async () => {
    await ensureMasterOn(profile.notificationNight, toggleNightNotification);
    applyNotificationUpdate(await toggleNightEmailNotification().catch(() => null));
  };

  const handleMorningEmailNotification = async () => {
    await ensureMasterOn(profile.notificationMorning, toggleMorningNotification);
    applyNotificationUpdate(await toggleMorningEmailNotification().catch(() => null));
  };

  const handlePushNotification = async (isMasterOn, toggleMasterFn, isPushCurrentlyOn, togglePushFn) => {
    if (!isPushCurrentlyOn) {
      const token = await getFcmToken();
      if (token) await updateFcmToken(token).catch(() => {});
    }

    await ensureMasterOn(isMasterOn, toggleMasterFn);
    applyNotificationUpdate(await togglePushFn().catch(() => null));
  };

  const handleNightPushNotification = () =>
    handlePushNotification(
      profile.notificationNight,
      toggleNightNotification,
      profile.notificationNightPush,
      toggleNightPushNotification
    );

  const handleMorningPushNotification = () =>
    handlePushNotification(
      profile.notificationMorning,
      toggleMorningNotification,
      profile.notificationMorningPush,
      toggleMorningPushNotification
    );

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-400">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28 page-enter">
      <header>
        <div className="mx-auto flex w-full max-w-[1180px] items-center gap-3 px-5 pt-10 pb-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 active:bg-gray-50"
            aria-label="뒤로가기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <h1 className="text-xl font-extrabold text-gray-950">알림 설정</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] px-5 pt-4 sm:px-6">
        <section className="overflow-hidden rounded-2xl bg-white px-5 shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 py-4">
            <p className="text-sm font-bold text-gray-950">밤 10시 알림</p>
            <p className="mt-0.5 text-xs text-gray-400">
              오늘 일기를 안 쓰면 알려드려요
            </p>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <p className="text-sm text-gray-700">이메일 알림</p>
            <ToggleSwitch
              checked={!!profile.notificationNightEmail}
              onChange={handleNightEmailNotification}
              ariaLabel="밤 이메일 알림 설정"
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <p className="text-sm text-gray-700">앱 푸시 알림</p>
            <ToggleSwitch
              checked={!!profile.notificationNightPush}
              onChange={handleNightPushNotification}
              ariaLabel="밤 앱 푸시 알림 설정"
            />
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-2xl bg-white px-5 shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 py-4">
            <p className="text-sm font-bold text-gray-950">아침 8시 30분 알림</p>
            <p className="mt-0.5 text-xs text-gray-400">
              하루를 기록으로 시작해요
            </p>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <p className="text-sm text-gray-700">이메일 알림</p>
            <ToggleSwitch
              checked={!!profile.notificationMorningEmail}
              onChange={handleMorningEmailNotification}
              ariaLabel="아침 이메일 알림 설정"
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <p className="text-sm text-gray-700">앱 푸시 알림</p>
            <ToggleSwitch
              checked={!!profile.notificationMorningPush}
              onChange={handleMorningPushNotification}
              ariaLabel="아침 앱 푸시 알림 설정"
            />
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
