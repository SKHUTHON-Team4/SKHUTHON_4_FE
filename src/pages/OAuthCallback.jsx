import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../api';
import useAuthStore from '../store/authStore';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login, setUser } = useAuthStore();

  useEffect(() => {
    const accessToken = new URLSearchParams(window.location.search).get('token');
    if (!accessToken) { navigate('/'); return; }

    login(accessToken);
    getMe().then((res) => {
      setUser(res.data);
      const { nickname, age } = res.data;
      navigate(nickname && age ? '/home' : '/onboarding');
    }).catch(() => navigate('/'));
  }, []);

  return <div className="min-h-screen flex items-center justify-center text-gray-400">로그인 처리 중...</div>;
}
