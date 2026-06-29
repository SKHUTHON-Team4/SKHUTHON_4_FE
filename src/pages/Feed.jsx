import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { getFeed, getHotFeed, getRecommendFeed, searchDiaries } from '../api';
import DiaryCard from '../components/diary/DiaryCard';
import BottomNav from '../components/common/BottomNav';

const TABS = ['최신', '추천', '핫'];

export default function Feed() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [emptyMessage, setEmptyMessage] = useState('');

  const fetchSelectedFeed = useCallback(async () => {
    setEmptyMessage('');

    if (tab === 1) {
      const res = await getRecommendFeed();
      const recommendFeed = res.data || {};
      const diaries = recommendFeed.diaries || [];
      setDiaries(diaries.slice(0, 10));
      setEmptyMessage(recommendFeed.message || '');
      return;
    }

    if (tab === 2) {
      const res = await getHotFeed();
      setDiaries((res.data || []).slice(0, 10));
      return;
    }

    const res = await getFeed('latest');
    setDiaries(res.data || []);
  }, [tab]);

  useEffect(() => {
    if (isSearching) return;
    setLoading(true);
    fetchSelectedFeed()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fetchSelectedFeed, isSearching]);

  useEffect(() => {
    if (!isSearching) return;

    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      setLoading(true);
      fetchSelectedFeed()
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      setEmptyMessage('');
      searchDiaries(trimmedKeyword)
        .then((res) => setDiaries(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, isSearching, fetchSelectedFeed]);

  const closeSearch = () => {
    setKeyword('');
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 page-enter">
      <header className={`bg-white px-5 pt-10 sticky top-0 z-10 ${
        isSearching ? 'pb-4 border-b border-gray-100' : 'pb-0'
      }`}>
        <div className={`flex items-center justify-between gap-3 ${
          isSearching ? 'mb-0' : 'mb-3'
        }`}>
          {isSearching ? (
            <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-gray-50 px-4">
              <Search size={18} className="shrink-0 text-gray-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                autoFocus
                placeholder="게시글 검색"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
                  aria-label="검색어 지우기"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ) : (
            <h1 className="text-xl font-bold">커뮤니티</h1>
          )}
          <button
            type="button"
            onClick={() => (isSearching ? closeSearch() : setIsSearching(true))}
            className={`flex shrink-0 items-center justify-center rounded-full text-gray-500 active:bg-gray-100 ${
              isSearching ? 'h-11 w-11' : 'h-9 w-9'
            }`}
            aria-label={isSearching ? '검색 닫기' : '검색 열기'}
          >
            {isSearching ? <X size={21} /> : <Search size={21} />}
          </button>
        </div>
        {!isSearching && (
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
        )}
      </header>

      <div className="px-4 pt-4">
        {loading ? (
          <p className="text-center text-gray-400 py-10">불러오는 중...</p>
        ) : diaries.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            {isSearching && keyword.trim()
              ? '검색 결과가 없어요.'
              : emptyMessage || '아직 게시글이 없어요.'}
          </p>
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