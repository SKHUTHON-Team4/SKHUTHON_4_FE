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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <h2 className="text-xl font-bold mb-1">청춘잇다에 오신 것을 환영합니다!</h2>
      <p className="text-gray-400 text-sm mb-8">간단한 정보를 입력하고 나만의 공간을 시작해보세요.</p>

      <div className="w-full max-w-xs space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">닉네임</label>
          <input
            className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="닉네임을 입력하세요"
            maxLength={10}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <span className="text-xs text-gray-400 float-right">{nickname.length}/10</span>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">나이</label>
          <input
            type="number"
            className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="나이를 입력하세요"
            min={1} max={100}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white font-semibold py-3 rounded-xl"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
