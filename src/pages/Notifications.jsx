import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-5 pt-10">
      <header className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 text-sm"
        >
          ← 뒤로
        </button>

        <h1 className="text-lg font-bold">알림</h1>

        <div className="w-10" />
      </header>

      <div className="flex flex-col items-center justify-center pt-40 text-gray-400">
        <p className="text-sm">아직 받은 알림이 없어요.</p>
      </div>
    </div>
  );
}