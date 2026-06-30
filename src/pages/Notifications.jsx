import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, readAllNotifications } from '../api';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then((res) => setNotifications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    readAllNotifications().catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white px-5 pt-10">
      <header className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-bold">알림</h1>
        <div className="w-10" />
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center pt-40 text-gray-400">
          <p className="text-sm">불러오는 중...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-40 text-gray-400">
          <p className="text-sm">아직 받은 알림이 없어요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => n.diaryId && navigate(`/diary/${n.diaryId}`)}
              className={`bg-white rounded-2xl p-4 shadow-sm cursor-pointer flex items-start gap-3 ${
                !n.isRead ? 'border-l-4 border-primary' : ''
              }`}
            >
              <span className="text-xl">{n.type === 'EMPATHY' ? '❤️' : '💬'}</span>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleDateString('ko-KR', {
                    month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}