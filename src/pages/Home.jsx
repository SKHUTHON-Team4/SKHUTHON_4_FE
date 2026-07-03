import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X } from 'lucide-react';
import { getTodayMood } from '../api';
import { EMOTION_IMAGE } from '../utils/emotion';
import { listenToForegroundMessages } from '../firebase';
import BottomNav from '../components/common/BottomNav';

export default function Home() {
  const navigate = useNavigate();
  const [mood, setMood] = useState(null);
  const [pushToast, setPushToast] = useState(null);
  const [toastLeaving, setToastLeaving] = useState(false);

  const fetchMood = () => {
    getTodayMood().then((res) => setMood(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchMood();
    const interval = setInterval(fetchMood, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 앱이 켜져 있는 동안(포그라운드) 도착한 푸시를 상단 배너로 표시
  useEffect(() => {
    let unsubscribe = () => {};

    listenToForegroundMessages((payload) => {
      const { title, body } = payload.notification || {};
      setToastLeaving(false);
      setPushToast({ title: title || '청춘잇다', body: body || '' });
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => unsubscribe();
  }, []);

  // 자동으로 사라지지 않고 X 버튼을 눌러야 닫히도록 함. 닫힐 때만 페이드아웃 애니메이션(600ms) 후 완전히 제거.
  useEffect(() => {
    if (!toastLeaving) return;
    const removeTimer = setTimeout(() => setPushToast(null), 600);
    return () => clearTimeout(removeTimer);
  }, [toastLeaving]);

  const bearImage = mood ? EMOTION_IMAGE[mood.representativeEmotion] : '/assets/bear-normal.png';

  return (
    <div
      className="flex h-[100dvh] overflow-hidden flex-col page-enter"
      style={{
        backgroundImage: 'url(/assets/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      {pushToast && (
        <div
          className={`${toastLeaving ? '' : 'push-toast-enter'} fixed left-1/2 top-4 z-50 flex w-[92%] max-w-[420px] -translate-x-1/2 items-start gap-2 rounded-2xl bg-white/95 px-4 py-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.18)] ring-1 ring-gray-100 backdrop-blur transition-all duration-500 ease-in ${
            toastLeaving ? '-translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setToastLeaving(true);
              navigate('/notifications');
            }}
            className="flex min-w-0 flex-1 items-start gap-3 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bell size={18} className="text-primary" />
            </span>
            <span className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-950">{pushToast.title}</p>
              {pushToast.body && (
                <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{pushToast.body}</p>
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setToastLeaving(true)}
            aria-label="알림 닫기"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[1180px] min-h-0 flex-1 flex-col px-6 pb-20 pt-8 sm:pb-20 sm:pt-12">
        {/* 헤더 */}
        <header className="flex items-start justify-between">
          <div>
            <p className="text-[18px] font-extrabold text-slate-800 sm:text-[20px]">안녕하세요 👋</p>
            <h1 className="mt-1 text-[21px] font-extrabold text-slate-900 sm:text-[22px]">
              오늘의 감정을 기록해볼까요?
            </h1>
            <p className="mt-1.5 text-[14px] font-bold text-slate-500 sm:mt-2 sm:text-[15px]">
              {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short',
              })}
            </p>
          </div>

          <button
            onClick={() => navigate('/notifications')}
            className="flex h-10 w-10 items-center justify-center"
            aria-label="알림"
          >
            <Bell size={28} strokeWidth={1.8} className="text-slate-700" />
          </button>
        </header>

        {/* 곰돌이 */}
        <div className="flex min-h-0 flex-1 items-center justify-center py-2 sm:py-0">
          <img
            src={bearImage}
            alt="bear"
            className="h-[168px] w-[168px] object-contain sm:h-[200px] sm:w-[200px]"
          />
        </div>

        {/* 글라스 카드 */}
        <div
          className="mx-auto w-full max-w-[800px] rounded-[24px] px-5 py-3.5 shadow-[0_12px_35px_rgba(80,65,140,0.2)] sm:rounded-[28px] sm:px-6"
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
          }}
        >
          {mood?.ageGroup && (
            <p className="mb-1 text-center text-[13px] font-normal text-[#5F43D9]">
              {mood.ageGroup}의 오늘 분위기
            </p>
          )}

          <p className="mb-3 text-center text-[15px] font-medium leading-7 text-slate-900 sm:text-[17px] sm:leading-relaxed">
            {mood?.moodMessage || '오늘의 작은 노력이 큰 변화를 만들어요.'}
          </p>

          <div className="mb-2 flex justify-between text-[13px] font-extrabold sm:text-[14px]">
            <span className="text-[#7C5CFC]">긍정 {mood?.positiveRatio ?? 0}%</span>
            <span className="text-[#FF4B5C]">부정 {mood?.negativeRatio ?? 0}%</span>
          </div>

          <div
            className="mb-3.5 flex h-2.5 w-full overflow-hidden rounded-full sm:h-3"
            style={{ background: 'rgba(255,255,255,0.3)' }}
          >
            <div style={{ width: `${mood?.positiveRatio ?? 0}%`, background: '#7C5CFC' }} />
            <div style={{ width: `${mood?.negativeRatio ?? 0}%`, background: '#EF4444' }} />
          </div>

          {/* 일기 쓰기 버튼 */}
          <button
            onClick={() => navigate('/write')}
            className="flex w-full items-center justify-between rounded-2xl px-5 py-3"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div className="text-left">
                <p className="text-[15px] font-extrabold text-primary">일기 쓰기</p>
                <p className="text-[12px] text-slate-500">감정 기록하기</p>
              </div>
            </div>
            <span className="text-primary text-lg">›</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
