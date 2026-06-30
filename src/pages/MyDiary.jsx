import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyDiaries } from '../api';
import { EMOTION_IMAGE } from '../utils/emotion';
import BottomNav from '../components/common/BottomNav';

function getCalendarDays(year, month) {
  const first = new Date(year, month - 1, 1).getDay();
  const last  = new Date(year, month, 0).getDate();
  return { first, last };
}

export default function MyDiary() {
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [diaries, setDiaries] = useState([]);

  // 오늘 날짜 (로컬 기준)
  const today = new Date();
  const isToday = (day) =>
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day;

  useEffect(() => {
    getMyDiaries(year, month).then((res) => setDiaries(res.data)).catch(() => {});
  }, [year, month]);

  const diaryMap = Object.fromEntries(
    diaries.map((d) => [Number(d.diaryDate.split('-')[2]), d])
  );

  const { first, last } = getCalendarDays(year, month);

  const prevMonth = () => {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
  };

  return (
    <div className="min-h-screen bg-white pb-20 page-enter">
      <header className="px-5 pt-10 pb-4">
        <h1 className="text-xl font-bold">기록</h1>
      </header>

      {/* Calendar nav */}
      <div className="flex items-center justify-between px-5 mb-4">
        <button onClick={prevMonth} className="text-gray-400 text-lg px-2">‹</button>
        <p className="font-semibold">{year}년 {month}월</p>
        <button onClick={nextMonth} className="text-gray-400 text-lg px-2">›</button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-400 px-2 mb-1">
        {['일','월','화','수','목','금','토'].map((d) => <span key={d}>{d}</span>)}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 px-2 gap-y-2">
        {Array.from({ length: first }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: last }, (_, i) => i + 1).map((day) => {
          const diary = diaryMap[day];
          return (
            <button
              key={day}
              onClick={() => diary && navigate(`/diary/${diary.id}`)}
              className="flex flex-col items-center py-1"
            >
              <span
                className={`text-sm w-8 h-8 flex items-center justify-center rounded-full ${
                  isToday(day) ? 'bg-primary text-white font-bold' : 'text-gray-600'
                }`}
              >
                {day}
              </span>
              {diary?.emotion != null && (
                <img src={EMOTION_IMAGE[diary.emotion]} alt="" className="w-6 h-6 object-contain mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Diary list below */}
            <div className="mt-6 px-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">전체 일기</p>
                <button onClick={() => navigate('/my/all')} className="text-xs text-primary font-medium">
                  전체 보기 ›
                </button>
              </div>  
        {diaries.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">이 달의 일기가 없어요</p>
        ) : (
          diaries.map((d) => (
            <div
              key={d.id}
              onClick={() => navigate(`/diary/${d.id}`)}
              className="flex items-center gap-3 py-3 border-b border-gray-100 cursor-pointer"
            >
              {d.emotion != null && (
                <img src={EMOTION_IMAGE[d.emotion]} alt="" className="w-8 h-8 object-contain" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{d.title || d.content.slice(0, 20)}</p>
                <p className="text-xs text-gray-400">{d.diaryDate} · {d.isPublic ? '공개' : '비공개'}</p>
              </div>
            </div>
          ))
        )}
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