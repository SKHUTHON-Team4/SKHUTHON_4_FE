import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { path: '/home',    label: '홈',       icon: '🏠' },
  { path: '/my',      label: '기록',     icon: '📅' },
  { path: '/feed',    label: '커뮤니티', icon: '👥' },
  { path: '/profile', label: '마이',     icon: '👤' },
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
            className="flex flex-col items-center pt-1 pb-2 relative w-1/4"
          >
            {isActive && (
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary rounded-b-full" />
            )}
            <span className="text-xl mt-1">{icon}</span>
            <span className={`text-xs mt-0.5 ${isActive ? 'text-primary font-bold' : 'text-gray-400'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}