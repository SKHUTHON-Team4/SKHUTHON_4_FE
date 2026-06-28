import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { getMe } from './api';

import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Write from './pages/Write';
import DiaryDetail from './pages/DiaryDetail';
import MyDiary from './pages/MyDiary';
import MyDiaryAll from './pages/MyDiaryAll';
import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

export default function App() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe().then((res) => setUser(res.data)).catch(() => {});
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
        <Route path="/write" element={<PrivateRoute><Write /></PrivateRoute>} />
        <Route path="/diary/:id/edit" element={<PrivateRoute><Write /></PrivateRoute>} />
        <Route path="/diary/:id" element={<PrivateRoute><DiaryDetail /></PrivateRoute>} />
        <Route path="/my" element={<PrivateRoute><MyDiary /></PrivateRoute>} />
        <Route path="/my/all" element={<PrivateRoute><MyDiaryAll /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}