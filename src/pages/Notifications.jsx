import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, readAllNotifications } from '../api';

const NOTIFICATION_META = {
  EMPATHY: {
    dotClassName: 'bg-red-400',
  },
  COMMENT: {
    dotClassName: 'bg-primary',
  },
};

function cleanNotificationMessage(message = '') {
  return message
    .replace(/[❤️💬]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

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
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1180px] px-5 pt-10">
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
            {notifications.map((n) => {
              const meta = NOTIFICATION_META[n.type] || NOTIFICATION_META.COMMENT;

              return (
                <div
                  key={n.id}
                  onClick={() => n.diaryId && navigate(`/diary/${n.diaryId}`)}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ${
                    !n.isRead ? 'border-l-4 border-primary' : ''
                  }`}
                >
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${meta.dotClassName}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {cleanNotificationMessage(n.message)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleDateString('ko-KR', {
                        month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
