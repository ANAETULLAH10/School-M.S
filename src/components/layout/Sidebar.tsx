import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  School,
  ClipboardCheck,
  Wallet,
  GraduationCap,
  UsersRound,
  FileText,
  Settings,
  LogOut,
  X,
  Shield,
  CreditCard,
  CalendarDays,
  BookCheck,
  BellRing,
  Award,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export type NavTab =
  | 'dashboard'
  | 'students'
  | 'admission'
  | 'classes'
  | 'attendance'
  | 'fees'
  | 'exams'
  | 'admitcard'
  | 'routine'
  | 'homework'
  | 'notices'
  | 'certificates'
  | 'sms'
  | 'teachers'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  schoolName?: string;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'admission', label: 'Admission', icon: UserPlus },
  { id: 'classes', label: 'Classes', icon: School },
  { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
  { id: 'fees', label: 'Fees & Billing', icon: Wallet },
  { id: 'exams', label: 'Exams & Results', icon: GraduationCap },
  { id: 'admitcard', label: 'Admit Card', icon: CreditCard },
  { id: 'routine', label: 'Class Routine', icon: CalendarDays },
  { id: 'homework', label: 'Homework & Tasks', icon: BookCheck },
  { id: 'notices', label: 'Notice Board', icon: BellRing },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'sms', label: 'SMS Broadcast', icon: MessageSquare },
  { id: 'teachers', label: 'Teachers', icon: UsersRound },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  schoolName = 'MH ENGLISH PRIVATE HOME',
}) => {
  const { user, role, logout, switchRole, canAccess } = useAuth();

  const handleNavClick = (tabId: NavTab) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  const visibleNavItems = NAV_ITEMS.filter((item) => canAccess(item.id));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Neumorphic Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0b1329] text-slate-300 flex flex-col shadow-[8px_0_24px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } no-print`}
      >
        {/* Brand Header */}
        <div className="h-20 lg:h-24 flex items-center justify-between px-5 border-b border-slate-800/60 bg-[#080e20]">
          <div className="flex items-center gap-3 min-w-0">
            {/* Tactile Neumorphic MH Logo */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-black text-white shadow-[4px_4px_10px_#040712,-2px_-2px_6px_#15254d] text-base tracking-wider shrink-0 border border-blue-400/30">
              MH
            </div>
            <div className="min-w-0">
              <h1
                className="font-black text-white text-xs leading-tight tracking-wider uppercase truncate"
                title={schoolName}
              >
                {schoolName}
              </h1>
              <p className="text-[11px] text-blue-300 font-semibold tracking-tight">
                Management System
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-[#0e1834] shadow-[2px_2px_5px_#040712,-2px_-2px_5px_#14234c] lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2.5">
          <div className="px-3 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Main Menu
          </div>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl font-semibold text-xs transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-[#080e20] text-blue-400 shadow-[inset_3px_3px_7px_#040712,inset_-2px_-2px_6px_#142247] border border-blue-500/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-[#0e1834] shadow-[3px_3px_8px_#050814,-2px_-2px_6px_#121d38] border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Profile & Role Switcher Footer */}
        <div className="p-4 border-t border-slate-800/60 bg-[#070c1c]">
          {/* Role quick switcher */}
          <div className="mb-3 px-1 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-[11px]">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              Role:
            </span>
            <select
              value={role}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="bg-[#0b1329] shadow-[inset_2px_2px_5px_#040712,inset_-2px_-2px_5px_#14203e] text-slate-200 text-[11px] font-semibold rounded-xl px-2.5 py-1 outline-none border border-slate-800/60 cursor-pointer capitalize"
              title="Switch user role for testing"
            >
              <option value="admin">Administrator</option>
              <option value="teacher">Teacher</option>
              <option value="accountant">Accountant</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* User profile capsule */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0b1329] shadow-[inset_2px_2px_6px_#040712,inset_-2px_-2px_6px_#131f40] border border-slate-800/60">
            <div className="flex items-center gap-2.5 min-w-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-xl object-cover shadow-[2px_2px_5px_#040712]"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs shadow-inner">
                  {user?.name.charAt(0) || 'A'}
                </div>
              )}
              <div className="min-w-0">
                <span className="block text-xs font-bold text-slate-200 truncate leading-tight">
                  {user?.name || 'Administrator'}
                </span>
                <span className="block text-[10px] text-slate-400 truncate">
                  {user?.email || 'admin@myschoolbd.edu'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-[#121d3b] shadow-[2px_2px_5px_#040712,-1px_-1px_4px_#15254d] transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
