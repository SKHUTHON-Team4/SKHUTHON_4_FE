import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, toggleNotification, logout } from '../api';
import useAuthStore from '../store/authStore';
import BottomNav from '../components/common/BottomNav';

export default function Profile() {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((s) => s.logout);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then((res) => setProfile(res.data)).catch(() => {});
  }, []);

  const handleNotification = async () => {
    const res = await toggleNotification();
    setProfile((prev) => ({ ...prev, isNotification: res.data.notification }));
  };

  const handleLogout = async () => {
    await logout().catch(() => {});
    logoutStore();
    navigate('/');
  };

  if (!profile) return <div className="min-h-screen flex items-center justify-center text-gray-400">불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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

        {/* Stats */}
        <div className="flex justify-around mt-5 pt-4 border-t border-gray-100">
          {[
            { label: '작성한 일기', value: profile.diaryCount },
            { label: '받은 공감',   value: profile.receivedEmpathy },
            { label: '준 공감',     value: profile.givenEmpathy },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-lg font-bold text-primary">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="mt-3 bg-white">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm">밤 10시 알림받기</span>
          <button
            onClick={handleNotification}
            className={`w-12 h-6 rounded-full transition-colors ${profile.isNotification ? 'bg-primary' : 'bg-gray-200'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${profile.isNotification ? 'translate-x-6' : ''}`} />
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
