import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeed, getHotFeed } from '../api';
import DiaryCard from '../components/diary/DiaryCard';
import BottomNav from '../components/common/BottomNav';

const TABS = ['최신', '추천', '핫'];

export default function Feed() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const req =
      tab === 2 ? getHotFeed() :
      tab === 1 ? getFeed('random') :
      getFeed('latest');

    req.then((res) => setDiaries(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 page-enter">
      <header className="bg-white px-5 pt-10 pb-0 sticky top-0 z-10">
        <h1 className="text-xl font-bold mb-3">커뮤니티</h1>
        <div className="flex gap-4 border-b border-gray-100">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`pb-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === i ? 'border-primary text-primary' : 'border-transparent text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 pt-4">
        {loading ? (
          <p className="text-center text-gray-400 py-10">불러오는 중...</p>
        ) : diaries.length === 0 ? (
          <p className="text-center text-gray-400 py-10">아직 게시글이 없어요.</p>
        ) : (
          diaries.map((d) => <DiaryCard key={d.id} diary={d} />)
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