import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyDiaries, deleteDiary } from '../api';
import { EMOTION_IMAGE } from '../utils/emotion';

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'public', label: '공개' },
  { key: 'private', label: '비공개' },
];

export default function MyDiaryAll() {
  const navigate = useNavigate();
  const now = new Date();
  const [diaries, setDiaries] = useState([]);
  const [tab, setTab] = useState('all');
  const [menuId, setMenuId] = useState(null);   // 점 세개 열린 일기 id

  const load = () => {
    const visibility = tab === 'private' ? 'private' : 'all';
    getMyDiaries(now.getFullYear(), now.getMonth() + 1, visibility)
      .then((res) => setDiaries(res.data))
      .catch(() => {});
  };

  useEffect(() => { load(); }, [tab]);

  // 공개 탭이면 공개 일기만 필터
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
      <header className="bg-white px-5 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 text-lg">‹</button>
        <h1 className="text-lg font-bold">전체 일기</h1>
      </header>

      {/* Tabs */}
      <div className="bg-white px-5 pb-3 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              tab === t.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 pt-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-10">일기가 없어요.</p>
        ) : (
          filtered.map((d) => (
            <div key={d.id} className="relative bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div
                onClick={() => navigate(`/diary/${d.id}`)}
                className="flex items-center gap-3 flex-1 cursor-pointer"
              >
                {d.emotion != null && (
                  <img src={EMOTION_IMAGE[d.emotion]} alt="" className="w-10 h-10 object-contain" />
                )}
                <div>
                  <p className="text-sm font-semibold">{d.title || d.content.slice(0, 20)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {d.diaryDate} · <span className={d.isPublic ? 'text-primary' : ''}>{d.isPublic ? '공개' : '비공개'}</span>
                  </p>
                </div>
              </div>

              {/* 점 세개 */}
              <button
                onClick={() => setMenuId(menuId === d.id ? null : d.id)}
                className="text-gray-400 px-2 text-lg"
              >
                ⋯
              </button>

              {/* 수정/삭제 메뉴 */}
              {menuId === d.id && (
                <div className="absolute right-4 top-12 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden">
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