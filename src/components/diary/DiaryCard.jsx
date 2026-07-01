import { useNavigate } from 'react-router-dom';
import { EMOTION_IMAGE } from '../../utils/emotion';

export default function DiaryCard({ diary }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/diary/${diary.id}`)}
      className="mb-3 cursor-pointer rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 active:opacity-80"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 rounded-full bg-primary-light items-center justify-center text-sm font-bold text-primary">
          {diary.nickname?.[0]}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-950">{diary.nickname}</p>
          <p className="mt-0.5 text-xs text-gray-400">{diary.diaryDate}</p>
        </div>
        {diary.emotion != null && (
          <img src={EMOTION_IMAGE[diary.emotion]} alt="emotion" className="h-8 w-8 object-contain" />
        )}
      </div>

      {diary.title && <p className="mb-1 text-sm font-bold text-gray-950">{diary.title}</p>}
      <p className="line-clamp-2 text-sm leading-6 text-gray-600">{diary.content}</p>

      <div className="mt-4 flex gap-4 text-xs font-medium text-gray-400">
        <span>❤️ {diary.empathyCount}</span>
        <span>💬 {diary.commentCount}</span>
      </div>
    </div>
  );
}
