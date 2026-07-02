import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyDiaries, deleteDiary } from '../api';
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
  const [menuId, setMenuId] = useState(null);

  const today = new Date();
  const isToday = (day) =>
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day;

  const load = () => {
    getMyDiaries(year, month).then((res) => setDiaries(res.data)).catch(() => {});
  };

  useEffect(() => {
    load();
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

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제할까요?')) return;
    await deleteDiary(id).catch(() => {});
    setMenuId(null);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 page-enter">
      <main className="mx-auto w-full max-w-[1180px] px-5 pt-10 sm:px-6">
        <h1 className="mb-5 text-xl font-bold text-gray-800">기록</h1>

        <section className="rounded-2xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-100">
          {/* Calendar nav */}
          <div className="mb-4 flex items-center justify-between">
            <button onClick={prevMonth} className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-400 active:bg-gray-50">‹</button>
            <p className="text-base font-bold text-gray-950">{year}년 {month}월</p>
            <button onClick={nextMonth} className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-400 active:bg-gray-50">›</button>
          </div>

          {/* Weekday headers */}
          <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-gray-400">
            {['일','월','화','수','목','금','토'].map((d) => <span key={d}>{d}</span>)}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-y-2">
            {Array.from({ length: first }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: last }, (_, i) => i + 1).map((day) => {
              const diary = diaryMap[day];
              return (
                <button
                  key={day}
                  onClick={() => diary && navigate(`/diary/${diary.id}`)}
                  className="flex min-h-[54px] flex-col items-center py-1"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                      isToday(day) ? 'bg-primary font-bold text-white' : 'text-gray-600'
                    }`}
                  >
                    {day}
                  </span>
                  {diary?.emotion != null && (
                    <img src={EMOTION_IMAGE[diary.emotion]} alt="" className="mt-0.5 h-6 w-6 object-contain" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Diary list below */}
        <section className="mt-5 rounded-2xl bg-white px-5 py-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-base font-bold text-gray-950">이 달의 기록</p>
            <button onClick={() => navigate('/my/all')} className="text-sm font-semibold text-primary">
              전체 일기 ›
            </button>
          </div>
          {diaries.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">이 달의 일기가 없어요</p>
          ) : (
            diaries.map((d) => (
              <div key={d.id} className="relative flex items-center gap-3 border-b border-gray-100 py-3 last:border-b-0">
                <div
                  onClick={() => navigate(`/diary/${d.id}`)}
                  className="flex flex-1 cursor-pointer items-center gap-3"
                >
                  {d.emotion != null && (
                    <img src={EMOTION_IMAGE[d.emotion]} alt="" className="h-9 w-9 object-contain" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-950">{d.title || d.content.slice(0, 20)}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{d.diaryDate} · {d.isPublic ? '공개' : '비공개'}</p>
                  </div>
                </div>

                {/* 점 세개 버튼 */}
                <button
                  onClick={() => setMenuId(menuId === d.id ? null : d.id)}
                  className="shrink-0 px-2 text-lg text-gray-400"
                >
                  ⋯
                </button>

                {/* 수정/삭제 메뉴 */}
                {menuId === d.id && (
                  <div className="absolute right-4 top-12 z-10 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                    <button
                      onClick={() => navigate(`/diary/${d.id}/edit`)}
                      className="block w-24 px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="block w-24 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-gray-50"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>

      <button
        onClick={() => navigate('/write')}
        className="fixed right-5 bottom-24 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl text-white shadow-lg"
      >
        +
      </button>

      <BottomNav />
    </div>
  );
}