import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { getTodayMood } from '../api';
import { EMOTION_IMAGE } from '../utils/emotion';
import BottomNav from '../components/common/BottomNav';

export default function Home() {
  const navigate = useNavigate();
  const [mood, setMood] = useState(null);

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
