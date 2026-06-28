import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, toggleNightNotification, toggleMorningNotification, logout } from '../api';
import useAuthStore from '../store/authStore';
import BottomNav from '../components/common/BottomNav';

export default function Profile() {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((s) => s.logout);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then((res) => setProfile(res.data)).catch(() => {});
  }, []);

  const handleNightNotification = async () => {
    await toggleNightNotification().catch(() => {});
    setProfile((prev) => ({ ...prev, notificationNight: !prev.notificationNight }));
  };

  const handleMorningNotification = async () => {
    await toggleMorningNotification().catch(() => {});
    setProfile((prev) => ({ ...prev, notificationMorning: !prev.notificationMorning }));
  };

  const handleLogout = async () => {
    await logout().catch(() => {});
    logoutStore();
    navigate('/');
  };

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">불러오는 중...</div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 page-enter">
      <header className="bg-white px-5 pt-10 pb-6">
        <h1 className="text-xl font-bold mb-4">마이</h1>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-2xl font-bold text-primary">
            {profile.nickname?.[0]}
          </div>
          <div>
            <p className="font-bold">{profile.nickname}</p>
            <p className="text-xs text-gray-400">{profile.email}</p>
          </div>
        </div>

        <div className="flex justify-around mt-5 pt-4 border-t border-gray-100">
          {[
            { label: '작성한 일기', value: profile.diaryCount },
            { label: '받은 공감', value: profile.receivedEmpathy },
            { label: '준 공감', value: profile.givenEmpathy },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-lg font-bold text-primary">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="mt-3 bg-white">
        {/* 밤 10시 알림 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium">밤 10시 알림</p>
            <p className="text-xs text-gray-400">오늘 일기를 안 쓰면 알려드려요</p>
          </div>
          <button
            onClick={handleNightNotification}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              profile.notificationNight ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              profile.notificationNight ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {/* 아침 8시 30분 알림 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium">아침 8시 30분 알림</p>
            <p className="text-xs text-gray-400">하루를 기록으로 시작해요</p>
          </div>
          <button
            onClick={handleMorningNotification}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              profile.notificationMorning ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              profile.notificationMorning ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-400">이메일 주소</p>
          <p className="text-sm mt-1">{profile.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full px-5 py-4 text-left text-sm text-red-400"
        >
          로그아웃
        </button>
      </div>

      <button
        onClick={() => navigate('/write')}
        className="fixed right-6 bottom-24 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-3xl text-white shadow-xl"
      >
        +
      </button>

      <BottomNav />
    </div>
  );
}