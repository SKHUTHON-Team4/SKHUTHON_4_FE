import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodayMood } from '../api';
import { EMOTION_IMAGE } from '../utils/emotion';
import BottomNav from '../components/common/BottomNav';

export default function Home() {
  const navigate = useNavigate();
  const [mood, setMood] = useState(null);

  useEffect(() => {
    getTodayMood()
      .then((res) => setMood(res.data))
      .catch(() => {});
  }, []);

  const positive = mood ? mood.ratio100 + mood.ratio75 : 0;
  const negative = mood ? mood.ratio25 + mood.ratio0 : 0;
  const bearImage = mood
    ? EMOTION_IMAGE[mood.representativeEmotion]
    : '/assets/bear-good.png';

  return (
    <div className="min-h-screen bg-white pb-24">
      <div
        className="relative min-h-[700px] overflow-hidden px-6 pt-12"
        style={{
          backgroundImage: 'url(/assets/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <header className="flex items-start justify-between">
          <div>
            <p className="text-[20px] font-extrabold text-slate-800">
              안녕하세요, 👋
            </p>

            <h1 className="mt-2 text-[22px] font-extrabold text-slate-900">
              오늘의 감정을 기록해볼까요?
            </h1>

            <p className="mt-6 text-[15px] font-bold text-slate-500">
              {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                weekday: 'short',
              })}
            </p>
          </div>

          <button
            onClick={() => navigate('/notifications')}
            className="flex h-10 w-10 items-center justify-center"
            aria-label="알림"
          >
            <img
              src="/assets/bell.png"
              alt="알림"
              className="h-7 w-7 object-contain"
            />
          </button>
        </header>

        <img
          src={bearImage}
          alt="bear"
          className="absolute left-1/2 top-[260px] w-[220px] -translate-x-1/2 object-contain"
          style={{ mixBlendMode: 'multiply' }}
        />

        <div className="absolute left-5 right-5 bottom-9 rounded-[28px] bg-white px-6 py-8 shadow-[0_12px_35px_rgba(80,65,140,0.15)]">
          <p className="text-center text-[21px] leading-relaxed font-extrabold text-slate-900">
            오늘의 작은 노력이
            <br />
            큰 변화를 만들어요.
          </p>

          <div className="mt-7 flex justify-between text-[15px] font-extrabold">
            <span className="text-[#7C5CFC]">긍정 {positive}%</span>
            <span className="text-[#FF4B5C]">부정 {negative}%</span>
          </div>

          <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              style={{
                width: `${mood?.ratio100 || 0}%`,
                background: '#7C5CFC',
              }}
            />
            <div
              style={{
                width: `${mood?.ratio75 || 0}%`,
                background: '#9B7FFF',
              }}
            />
            <div
              style={{
                width: `${mood?.ratio50 || 0}%`,
                background: '#C4B5FD',
              }}
            />
            <div
              style={{
                width: `${mood?.ratio25 || 0}%`,
                background: '#FCA5A5',
              }}
            />
            <div
              style={{
                width: `${mood?.ratio0 || 0}%`,
                background: '#EF4444',
              }}
            />
          </div>
        </div>
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