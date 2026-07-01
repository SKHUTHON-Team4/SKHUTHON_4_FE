import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  {
    path: '/home',
    label: '홈',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={active ? '#7C5CFC' : '#9CA3AF'} strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: '/my',
    label: '기록',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={active ? '#7C5CFC' : '#9CA3AF'} strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    path: '/feed',
    label: '커뮤니티',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={active ? '#7C5CFC' : '#9CA3AF'} strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: '프로필',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={active ? '#7C5CFC' : '#9CA3AF'} strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50">
      {TABS.map(({ path, label, icon }) => {
        const isActive = pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center pt-2 pb-3 relative w-1/4"
          >
            {isActive && (
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary rounded-b-full" />
            )}
            {icon(isActive)}
            <span className={`text-xs mt-1 ${isActive ? 'text-primary font-bold' : 'text-gray-400'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
