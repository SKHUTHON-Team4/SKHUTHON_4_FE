import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookmarks } from '../api';
import DiaryCard from '../components/diary/DiaryCard';
import BottomNav from '../components/common/BottomNav';

export default function Bookmarks() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookmarks()
      .then((res) => {
        const diaries = (res.data || []).map((bookmark) => ({
          ...bookmark,
          id: bookmark.diaryId,
        }));

        setBookmarks(diaries);
      })
      .catch(() => setBookmarks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-28 page-enter">
      <header>
        <div className="mx-auto flex w-full max-w-[1180px] items-center gap-3 px-5 pt-10 pb-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 active:bg-gray-50"
            aria-label="뒤로가기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <h1 className="text-xl font-extrabold text-gray-950">북마크</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] px-5 pt-4 sm:px-6">
        {loading ? (
          <p className="py-10 text-center text-sm text-gray-400">불러오는 중...</p>
        ) : bookmarks.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">북마크한 일기가 없어요</p>
        ) : (
          bookmarks.map((diary) => (
            <DiaryCard key={`${diary.id}-${diary.diaryDate}`} diary={diary} />
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
}
