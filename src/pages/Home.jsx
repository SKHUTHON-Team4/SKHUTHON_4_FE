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

  const bearImage = mood ? EMOTION_IMAGE[mood.representativeEmotion] : '/assets/bear-normal.png';

  return (
    <div
      className="h-screen overflow-hidden flex flex-col page-enter"
      style={{
        backgroundImage: 'url(/assets/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      <div className="w-full max-w-[1300px] mx-auto flex flex-col flex-1 px-6 pt-12 pb-20">
        {/* 헤더 */}
        <header className="flex items-start justify-between">
          <div>
            <p className="text-[20px] font-extrabold text-slate-800">안녕하세요 👋</p>
            <h1 className="mt-1 text-[22px] font-extrabold text-slate-900">
              오늘의 감정을 기록해볼까요?
            </h1>
            <p className="mt-2 text-[14px] font-semibold text-slate-500">
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
            <Bell size={28} strokeWidth={2.5} className="text-slate-700" />
          </button>
        </header>

        {/* 곰돌이 */}
        <div className="flex justify-center flex-1 items-center">
          <img
            src={bearImage}
            alt="bear"
            className="w-[200px] h-[200px] object-contain"
          />
        </div>

        {/* 글라스 카드 */}
        <div
          className="rounded-[28px] px-6 py-5 shadow-[0_12px_35px_rgba(80,65,140,0.2)]"
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
          }}
        >
          {mood?.ageGroup && (
            <p className="text-center text-[12px] font-semibold text-primary mb-1">
              {mood.ageGroup}의 오늘 분위기
            </p>
          )}

          <p className="text-center text-[17px] leading-relaxed font-extrabold text-slate-900 mb-4">
            {mood?.moodMessage || '오늘의 작은 노력이 큰 변화를 만들어요.'}
          </p>

          <div className="flex justify-between text-[14px] font-extrabold mb-2">
            <span className="text-[#7C5CFC]">긍정 {mood?.positiveRatio ?? 0}%</span>
            <span className="text-[#FF4B5C]">부정 {mood?.negativeRatio ?? 0}%</span>
          </div>

          <div
            className="flex h-3 w-full overflow-hidden rounded-full mb-5"
            style={{ background: 'rgba(255,255,255,0.3)' }}
          >
            <div style={{ width: `${mood?.positiveRatio ?? 0}%`, background: '#7C5CFC' }} />
            <div style={{ width: `${mood?.negativeRatio ?? 0}%`, background: '#EF4444' }} />
          </div>

          {/* 일기 쓰기 버튼 */}
          <button
            onClick={() => navigate('/write')}
            className="w-full flex items-center justify-between rounded-2xl px-5 py-4"
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
