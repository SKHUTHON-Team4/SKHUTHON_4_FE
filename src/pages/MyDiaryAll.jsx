import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyDiaries, deleteDiary } from '../api';
import { EMOTION_IMAGE } from '../utils/emotion';

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'public', label: '공개' },
  { key: 'private', label: '비공개' },
];

const FIRST_DIARY_YEAR = 2020;

function getMonthRangeUntilNow() {
  const now = new Date();
  const months = [];

  for (let year = now.getFullYear(); year >= FIRST_DIARY_YEAR; year -= 1) {
    const lastMonth = year === now.getFullYear() ? now.getMonth() + 1 : 12;

    for (let month = lastMonth; month >= 1; month -= 1) {
      months.push({ year, month });
    }
  }

  return months;
}

function normalizeDiaries(diaries) {
  return Array.from(new Map(diaries.map((diary) => [diary.id, diary])).values())
    .sort((a, b) => new Date(b.diaryDate) - new Date(a.diaryDate));
}

export default function MyDiaryAll() {
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState([]);
  const [tab, setTab] = useState('all');
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const visibility = tab === 'private' ? 'private' : 'all';

    setLoading(true);

    try {
      const results = await Promise.all(
        getMonthRangeUntilNow().map(({ year, month }) =>
          getMyDiaries(year, month, visibility)
            .then((res) => res.data || [])
            .catch(() => [])
        )
      );

      setDiaries(normalizeDiaries(results.flat()));
    } catch {
      setDiaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tab]);

  const filtered = tab === 'public' ? diaries.filter((d) => d.isPublic) : diaries;

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제할까요?')) return;
    await deleteDiary(id).catch(() => {});
    setMenuId(null);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header>
        <div className="mx-auto flex w-full max-w-[1180px] items-center gap-3 px-5 pt-10 pb-4 sm:px-6">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 active:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-xl font-extrabold text-gray-950">전체 일기</h1>
        </div>

        {/* Tabs */}
        <div className="mx-auto flex w-full max-w-[1180px] gap-2 px-5 pb-4 sm:px-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                tab === t.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* List */}
      <div className="mx-auto w-full max-w-[1180px] space-y-3 px-5 pt-5 sm:px-6">
        {loading ? (
          <p className="py-10 text-center text-sm text-gray-400">불러오는 중...</p>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">일기가 없어요</p>
        ) : (
          filtered.map((d) => (
            <div key={d.id} className="relative flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <div
                onClick={() => navigate(`/diary/${d.id}`)}
                className="flex flex-1 cursor-pointer items-center gap-3"
              >
                {d.emotion != null && (
                  <img src={EMOTION_IMAGE[d.emotion]} alt="" className="h-10 w-10 object-contain" />
                )}
                <div>
                  <p className="text-sm font-bold text-gray-950">{d.title || d.content.slice(0, 20)}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {d.diaryDate} · <span className={d.isPublic ? 'text-primary' : ''}>{d.isPublic ? '공개' : '비공개'}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMenuId(menuId === d.id ? null : d.id)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-gray-400 active:bg-gray-50"
              >
                ⋯
              </button>

              {menuId === d.id && (
                <div className="absolute right-4 top-14 z-10 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                  <button
                    onClick={() => navigate(`/diary/${d.id}/edit`)}
                    className="block w-24 px-4 py-2.5 text-sm text-left hover:bg-gray-50"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="block w-24 px-4 py-2.5 text-sm text-left text-red-500 hover:bg-gray-50"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
