import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Today', icon: '📅' },
  { path: '/add', label: 'Add', icon: '➕' },
  { path: '/words', label: 'Words', icon: '📚' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-[380px] h-[520px] bg-white">
      <header className="flex-shrink-0 bg-indigo-500 text-white px-4 py-3">
        <h1 className="text-lg font-bold">RememberMe Vocab</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">{children}</main>

      <nav className="flex-shrink-0 flex border-t border-gray-200 bg-white">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                active
                  ? 'text-indigo-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
