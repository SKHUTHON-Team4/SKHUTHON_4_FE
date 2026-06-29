import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gksruf.store',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const expiredToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
        if (!expiredToken) return Promise.reject(err);

        const res = await axios.post('https://gksruf.store/api/auth/refresh', null, {
          headers: { Authorization: `Bearer ${expiredToken}` },
        });
        const newAccessToken = res.data?.data?.accessToken;

        if (!newAccessToken) return Promise.reject(err);

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.removeItem('token');
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api.request(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;

// ── Auth ──────────────────────────────────────────
export const getMe = () => api.get('/api/auth/me');
export const logout = () => api.post('/api/auth/logout');

// ── Member ────────────────────────────────────────
export const updateNickname = (nickname) => api.patch('/api/members/me/nickname', { nickname });
export const updateAge = (age) => api.patch('/api/members/me/age', { age });
export const toggleNotification = () => api.patch('/api/members/me/notification');
export const getProfile = () => api.get('/api/members/me/profile');

// ── Diary ─────────────────────────────────────────
export const createDiary = (body) => api.post('/api/diaries', body);
export const updateEmotion = (id, emotion) => api.patch(`/api/diaries/${id}/emotion`, { emotion });
export const getDiary = (id) => api.get(`/api/diaries/${id}`);
export const updateDiary = (id, body) => api.patch(`/api/diaries/${id}`, body);
export const deleteDiary = (id) => api.delete(`/api/diaries/${id}`);
export const getFeed = (sort = 'latest') => api.get(`/api/diaries/feed?sort=${sort}`);
export const getRecommendFeed = () => api.get('/api/diaries/feed/recommend');
export const getHotFeed = () => api.get('/api/diaries/hot');
export const getMyDiaries = (year, month, visibility = 'all') =>
  api.get(`/api/diaries/me?year=${year}&month=${month}&visibility=${visibility}`);
export const searchDiaries = (keyword) => api.get(`/api/diaries/search?keyword=${keyword}`);
export const getTodayMood = () => api.get('/api/diaries/today-mood');

// ── Comment ───────────────────────────────────────
export const getComments = (diaryId) => api.get(`/api/diaries/${diaryId}/comments`);
export const createComment = (diaryId, content) =>
  api.post(`/api/diaries/${diaryId}/comments`, { content });
export const deleteComment = (commentId) => api.delete(`/api/comments/${commentId}`);

// ── Empathy ───────────────────────────────────────
export const getEmpathy = (diaryId) => api.get(`/api/diaries/${diaryId}/empathy`);
export const toggleEmpathy = (diaryId) => api.post(`/api/diaries/${diaryId}/empathy`);

// ── Report ────────────────────────────────────────
export const report = (targetId, reportType, reason) =>
  api.post('/api/reports', { targetId, reportType, reason });

// ── Notification ──────────────────────────────
export const getNotifications = () => api.get('/api/notifications');
export const getUnreadCount = () => api.get('/api/notifications/unread-count');
export const readAllNotifications = () => api.patch('/api/notifications/read-all');
export const toggleNightNotification = () => api.patch('/api/members/me/notification/night');
export const toggleMorningNotification = () => api.patch('/api/members/me/notification/morning');
