import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createDiary, updateEmotion, updateDiary, getDiary } from '../api';
import EmotionModal from '../components/diary/EmotionModal';
import useAuthStore from '../store/authStore';

const emotions = [
  { value: 100, label: '매우 좋음', img: '/assets/bear-very-good.png' },
  { value: 75, label: '좋음', img: '/assets/bear-good.png' },
  { value: 50, label: '보통', img: '/assets/bear-normal.png' },
  { value: 25, label: '별로', img: '/assets/bear-bad.png' },
  { value: 0, label: '매우 별로', img: '/assets/bear-very-bad.png' },
];

export default function Write() {
  const navigate = useNavigate();
  const { id } = useParams();          // id 있으면 수정 모드
  const isEdit = Boolean(id);
  const user = useAuthStore((s) => s.user);
  const contentRef = useRef(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [error, setError] = useState('');
  const [createdId, setCreatedId] = useState(null);
  const [showEmotion, setShowEmotion] = useState(false);

  // 수정 모드: 기존 일기 불러오기
  useEffect(() => {
    if (isEdit) {
      getDiary(id).then((res) => {
        const d = res.data;
        setTitle(d.title || '');
        setContent(d.content || '');
        setIsPublic(d.isPublic);
        setSelectedEmotion(d.emotion ?? null);
      }).catch(() => {});
    }
  }, [id]);

  useEffect(() => {
    if (!contentRef.current) return;

    contentRef.current.style.height = '124px';
    contentRef.current.style.height = `${Math.max(contentRef.current.scrollHeight, 124)}px`;
  }, [content]);

  const handleSubmit = async () => {
    if (!title.trim()) return setError('제목을 입력해주세요.');
    if (content.length < 100) return setError('내용은 100자 이상 입력해주세요.');
    if (selectedEmotion === null) return setError('오늘의 감정을 선택해주세요.');

    setError('');

    try {
      if (isEdit) {
        // 수정
        await updateDiary(id, { title, content, isPublic });
        await updateEmotion(id, selectedEmotion);
        navigate('/my');
      } else {
        // 신규 작성
        const res = await createDiary({ title, content, isPublic });
        const diaryId = res.data.id;
        setCreatedId(diaryId);
        await updateEmotion(diaryId, selectedEmotion);
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || '오류가 발생했습니다.');
    }
  };

  const handleSelectEmotion = async (emotion) => {
    try {
      await updateEmotion(createdId, emotion);
    } finally {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAFF] px-5 pt-9 pb-8">
      <header className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-[15px] font-medium text-gray-400"
        >
          취소
        </button>

        <h1 className="text-[17px] font-extrabold text-gray-900">
          {isEdit ? '일기 수정' : '일기 작성'}
        </h1>

        <button
          onClick={handleSubmit}
          className="text-[15px] font-extrabold text-primary"
        >
          저장
        </button>
      </header>

      <section className="mt-8">
        <h2 className="text-[24px] font-extrabold text-gray-900">
          오늘, 어떤 하루였나요?
        </h2>
        <p className="mt-2 text-[16px] font-medium text-gray-400">
          마음껏 적어보세요
        </p>
      </section>

      <section className="mt-8 space-y-4">
        <div className="flex items-center rounded-[18px] border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <input
            className="flex-1 bg-transparent text-[16px] outline-none placeholder:text-gray-400"
            placeholder="제목을 입력해주세요"
            maxLength={50}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="rounded-[18px] border border-gray-200 bg-white px-5 py-5 shadow-sm">
          <textarea
            ref={contentRef}
            className="min-h-[124px] w-full resize-none overflow-hidden bg-transparent text-[15px] leading-relaxed text-gray-700 outline-none placeholder:text-gray-400"
            placeholder="최소 100자 이상 입력해주세요.."
            maxLength={500}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <p className={`text-right text-[14px] font-medium ${content.length < 100 ? 'text-red-400' : 'text-gray-400'}`}>
            {content.length} / 500 {content.length < 100 && '(최소 100자)'}
          </p>
        </div>

        <div className="rounded-[18px] border border-gray-200 bg-white px-5 py-6 shadow-sm">
          <p className="text-[16px] font-extrabold text-gray-900">
            오늘의 감정은?
          </p>

          <div className="mt-6 grid grid-cols-5 gap-2">
            {emotions.map((emotion) => (
              <button
                key={emotion.value}
                type="button"
                onClick={() => setSelectedEmotion(emotion.value)}
                className={`flex flex-col items-center rounded-2xl py-2 transition ${
                  selectedEmotion === emotion.value
                    ? 'bg-[#F1EAFE] ring-2 ring-primary'
                    : ''
                }`}
              >
                <img
                  src={emotion.img}
                  alt={emotion.label}
                  className="h-12 w-12 object-contain"
                />
                <span className="mt-2 text-[12px] font-medium text-gray-400">
                  {emotion.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[25px]">🔒</span>
              <div>
                <p className="text-[17px] font-extrabold text-gray-900">
                  나만 보기
                </p>
                <p className="mt-1 text-[14px] font-medium text-gray-400">
                  비공개로 저장해요
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPublic(false)}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white ${
                !isPublic ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              ✓
            </button>
          </div>

          <div className="mt-5 rounded-xl bg-[#F8F2FF] px-4 py-4">
            <p className="text-[13px] leading-relaxed font-medium text-[#7C5CFC]">
              🔒 비공개 일기는 AI 분석 및 추천 시스템에 사용되지 않으며,
              <br />
              본인만 확인할 수 있어요.
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[25px]">🌐</span>
              <div>
                <p className="text-[17px] font-extrabold text-primary">
                  공유하기
                </p>
                <p className="mt-1 text-[14px] font-medium text-gray-400">
                  커뮤니티에 공유해요
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              

              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white ${
                  isPublic ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                ✓
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-[#FBF9FF] px-4 py-4">
            <p className="text-[13px] leading-relaxed font-medium text-[#7C5CFC]">
              공유한 일기는 감정 및 관심사 키워드 분석을 통해
              <br />
              커뮤니티 추천 콘텐츠 생성에 활용될 수 있어요.
            </p>
          </div>
        </div>

        {error && (
          <p className="text-center text-[13px] font-semibold text-red-500">
            {error}
          </p>
        )}
      </section>

      {showEmotion && <EmotionModal onSelect={handleSelectEmotion} />}
    </div>
  );
}
