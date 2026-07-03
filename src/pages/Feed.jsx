import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { getFeed, getHotFeed, getRecommendFeed, searchDiaries } from '../api';
import DiaryCard from '../components/diary/DiaryCard';
import BottomNav from '../components/common/BottomNav';

const TABS = ['최신', '추천', '핫'];
const RECOMMEND_REFRESH_MIN_MS = 1200;
const PULL_READY_DISTANCE = 40;

export default function Feed() {
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [emptyMessage, setEmptyMessage] = useState('');
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshingRecommend, setIsRefreshingRecommend] = useState(false);
  const pullStartY = useRef(null);
  const isMousePulling = useRef(false);
  const pullDistanceRef = useRef(0);

  const canPullToRefresh = tab === 1 && !isSearching;

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
        .then((res) => setDiaries(res.data || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, isSearching, fetchSelectedFeed]);

  useEffect(() => {
    pullDistanceRef.current = 0;
    setPullDistance(0);
    pullStartY.current = null;
  }, [tab, isSearching]);

  const closeSearch = () => {
    setKeyword('');
    setIsSearching(false);
  };

  const refreshRecommendFeed = async () => {
    if (isRefreshingRecommend) return;

    try {
      setIsRefreshingRecommend(true);
      setEmptyMessage('');

      const [res] = await Promise.all([
        getRecommendFeed(),
        new Promise((resolve) => setTimeout(resolve, RECOMMEND_REFRESH_MIN_MS)),
      ]);
      const recommendFeed = res.data || {};
      const nextDiaries = recommendFeed.diaries || [];

      setDiaries(nextDiaries.slice(0, 10));
      setEmptyMessage(recommendFeed.message || '');
    } catch {
      // Keep the current list if refresh fails.
    } finally {
      setIsRefreshingRecommend(false);
      pullDistanceRef.current = 0;
      setPullDistance(0);
    }
  };

  const startPull = (clientY) => {
    if (!canPullToRefresh || isRefreshingRecommend) return;
    pullStartY.current = clientY;
  };

  const movePull = (clientY) => {
    if (pullStartY.current == null || !canPullToRefresh) return;

    // 스크롤 관성이 아직 완전히 멈추지 않아 scrollY가 0으로 안정되기 전이면
    // 같은 터치를 유지한 채로도(별도 터치 없이) 당김을 누적하지 않고 대기한다.
    if (window.scrollY > 0) {
      pullDistanceRef.current = 0;
      setPullDistance(0);
      return;
    }

    const distance = clientY - pullStartY.current;
    const nextPullDistance = distance <= 0 ? 0 : Math.min(distance * 0.55, 82);

    pullDistanceRef.current = nextPullDistance;
    setPullDistance(nextPullDistance);
  };

  const endPull = () => {
    if (pullDistanceRef.current >= PULL_READY_DISTANCE) {
      refreshRecommendFeed();
    } else {
      setPullDistance(0);
    }

    pullDistanceRef.current = 0;
    pullStartY.current = null;
  };

  const handleTouchStart = (e) => startPull(e.touches[0].clientY);
  const handleTouchMove = (e) => movePull(e.touches[0].clientY);
  const handleTouchEnd = () => endPull();

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isMousePulling.current = true;
    startPull(e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isMousePulling.current) return;
    movePull(e.clientY);
  };

  const handleMouseUp = () => {
    if (!isMousePulling.current) return;
    isMousePulling.current = false;
    endPull();
  };

  const isReadyToRefresh = pullDistance >= PULL_READY_DISTANCE;
  const showRecommendRefresh = canPullToRefresh && (isReadyToRefresh || isRefreshingRecommend);

  return (
    <div
      className="min-h-screen overscroll-y-contain bg-gray-50 pb-24 page-enter"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <header className="z-30">
        <div className="mx-auto w-full max-w-[1180px] px-5 pt-10 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            {isSearching ? (
              <div className="flex w-full items-center gap-2">
                <div className="flex h-10 flex-1 items-center gap-2 rounded-2xl bg-white px-4 shadow-sm ring-1 ring-gray-100">
                  <Search size={18} className="shrink-0 text-gray-400" />

                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    autoFocus
                    placeholder="게시글 검색"
                    className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400"
                  />

                  {keyword && (
                    <button
                      type="button"
                      onClick={() => setKeyword('')}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 active:bg-gray-200"
                      aria-label="검색어 지우기"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={closeSearch}
                  className="h-10 shrink-0 px-2 text-sm font-bold text-gray-500 active:text-gray-700"
                >
                  취소
                </button>
              </div>
            ) : (
              <h1 className="text-xl font-bold text-gray-800">
                커뮤니티
              </h1>
            )}

            {!isSearching && (
              <button
                type="button"
                onClick={() => setIsSearching(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-700 active:bg-gray-100"
                aria-label="검색 열기"
              >
                <Search size={24} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {!isSearching && (
            <div className="mt-5 flex gap-2">
              {TABS.map((t, i) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(i)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                    tab === i
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main
        className="mx-auto w-full max-w-[1180px] px-5 pt-4 transition-transform sm:px-6"
        style={{
          transform: showRecommendRefresh && !isRefreshingRecommend
            ? `translateY(${Math.min(pullDistance * 0.25, 18)}px)`
            : 'translateY(0)',
        }}
      >
        {showRecommendRefresh && (
          <div className="mb-4 flex min-h-[360px] flex-col items-center justify-center px-5 py-8 text-center">
            <p className="text-base font-extrabold text-gray-900">
              추천 일기 가져오는 중입니다
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {isRefreshingRecommend
                ? '내 감정 흐름과 어울리는 일기를 다시 분석하고 있어요'
                : '손을 놓으면 추천 일기를 새로 가져와요'}
            </p>

            <div className="mx-auto mt-5 h-1.5 w-full max-w-[260px] overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full bg-primary ${
                  isRefreshingRecommend ? 'recommend-refresh-progress' : 'transition-all'
                }`}
                style={{
                  width: isRefreshingRecommend
                    ? undefined
                    : `${Math.min(100, (pullDistance / 120) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {!showRecommendRefresh && loading ? (
          <p className="py-10 text-center text-sm text-gray-400">불러오는 중...</p>
        ) : !showRecommendRefresh && diaries.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">
            {isSearching && keyword.trim()
              ? '검색 결과가 없어요'
              : emptyMessage || '아직 게시글이 없어요'}
          </p>
        ) : !showRecommendRefresh ? (
          diaries.map((d) => <DiaryCard key={d.id} diary={d} />)
        ) : null}
      </main>

      <button
        type="button"
        onClick={() => navigate('/write')}
        className="fixed bottom-24 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl text-white shadow-lg transition active:scale-95"
        aria-label="글쓰기"
      >
        +
      </button>

      <BottomNav />
    </div>
  );
}
