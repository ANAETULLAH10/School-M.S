import React from 'react';
import { Menu, LogOut, Bell, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title: string;
  subtitle: string;
  onOpenMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenMobile,
}) => {
  const { user, role, logout } = useAuth();

  return (
    <header className="h-20 lg:h-24 bg-[#ebf0f7] sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between shadow-[0_6px_16px_#cad1de] no-print">
      {/* Left: Mobile hamburger & Page Titles */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobile}
          className="neu-btn p-2.5 rounded-xl text-slate-600 hover:text-slate-900 lg:hidden focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: User Status & Logout */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Quick notification indicator */}
        <button
          className="hidden sm:flex items-center justify-center text-slate-500 hover:text-blue-600 p-2.5 rounded-xl neu-btn relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 shadow-[0_0_6px_#2563eb]"></span>
        </button>

        {/* User Pill / Badge */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3">
          <div className="neu-raised-sm px-3.5 py-1.5 rounded-2xl flex items-center gap-2.5">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover shadow-[2px_2px_5px_#cad1de,-2px_-2px_5px_#ffffff]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shadow-inner">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
            <div className="hidden md:block text-left">
              <span className="block text-xs font-bold text-slate-800 leading-tight">
                {role === 'admin' ? 'Administrator' : user?.name}
              </span>
              <span className="block text-[10px] text-slate-500 capitalize">
                {role}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="neu-btn hover:text-rose-600 flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl"
            title="Logout from session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
