import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, updateNickname, updateAge } from '../api';
import useAuthStore from '../store/authStore';

export default function Onboarding() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getMe()
      .then((res) => {
        setUser(res.data);
        setNickname(res.data?.nickname || '');
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!nickname.trim() || !age) return setError('닉네임과 나이를 모두 입력해주세요.');
    if (nickname.length > 10) return setError('닉네임은 10자 이하로 입력해주세요.');
    const ageNum = Number(age);
    if (ageNum < 1 || ageNum > 100) return setError('나이는 1~100 사이로 입력해주세요.');

    try {
      await updateNickname(nickname);
      const res = await updateAge(ageNum);
      setUser(res.data);
      navigate('/home');
    } catch {
      setError('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF8FF] px-8 py-12">
      <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <p className="text-sm font-extrabold text-primary">
            청춘잇다 시작하기
          </p>

          <h2 className="mt-4 text-[34px] font-black leading-tight text-[#302658] drop-shadow-[0_6px_18px_rgba(124,92,252,0.12)]">
            프로필을 완성해주세요
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            닉네임과 나이를 알려주면
            <br />
            나에게 맞는 감정 기록을 시작할 수 있어요.
          </p>
        </div>

        <div className="mt-10 w-full max-w-[360px] space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-bold text-[#302658]">닉네임</label>
              <span className="text-xs font-medium text-gray-400">{nickname.length}/10</span>
            </div>
            <input
              className="h-14 w-full rounded-2xl border border-[#E9E0FF] bg-white px-5 text-[15px] font-medium text-[#302658] shadow-sm outline-none transition placeholder:text-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
              placeholder="닉네임을 입력하세요"
              maxLength={10}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#302658]">나이</label>
            <input
              type="number"
              className="h-14 w-full rounded-2xl border border-[#E9E0FF] bg-white px-5 text-[15px] font-medium text-[#302658] shadow-sm outline-none transition placeholder:text-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
              placeholder="나이를 입력하세요"
              min={1} max={100}
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {error && (
            <p className="rounded-2xl bg-white/80 px-4 py-3 text-center text-xs font-medium text-red-500 shadow-sm">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="h-14 w-full rounded-2xl bg-primary text-[17px] font-bold text-white shadow-[0_12px_24px_rgba(124,92,252,0.22)] transition hover:brightness-95"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
