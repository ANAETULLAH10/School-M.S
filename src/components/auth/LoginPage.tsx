import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('mdanaetullahkhokon3@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>('admin');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
  };

  const handleQuickLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') setEmail('mdanaetullahkhokon3@gmail.com');
    if (selectedRole === 'teacher') setEmail('farhana.teacher@myschoolbd.edu');
    if (selectedRole === 'accountant') setEmail('accounts@myschoolbd.edu');
    if (selectedRole === 'staff') setEmail('frontdesk@myschoolbd.edu');
    login(email, selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#ebf0f7] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-black text-white shadow-[6px_6px_14px_#cad1de,-6px_-6px_14px_#ffffff] text-2xl mx-auto mb-3 border border-blue-400/40">
            MH
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
            MH ENGLISH PRIVATE HOME
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-bold tracking-wide">
            Management System
          </p>
        </div>

        {/* Card */}
        <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl p-8">
          <div className="mb-6">
            <h2 className="text-lg font-black text-slate-800">Sign in to Portal</h2>
            <p className="text-xs text-slate-500 font-medium">
              Enter credentials or pick a demo role to access the administrative dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Role Persona
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-bold capitalize text-slate-800"
              >
                <option value="admin">Administrator (Full Access)</option>
                <option value="teacher">Teacher (Attendance, Students, Exams)</option>
                <option value="accountant">Accountant (Fees & Financial Reports)</option>
                <option value="staff">Staff (Admissions & Records)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neu-input w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl"
                  placeholder="admin@myschool.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="neu-input w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                className="text-blue-700 hover:text-blue-800 font-bold"
                onClick={() => alert('Default demo credentials: password is not restricted in demo mode.')}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="neu-btn-primary w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 mt-2"
            >
              <span>Login to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-200/50">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">
              Quick Role One-Click Login
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="neu-btn py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('teacher')}
                className="neu-btn py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Teacher</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('accountant')}
                className="neu-btn py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Accountant</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('staff')}
                className="neu-btn py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-slate-600" />
                <span>Staff</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
          © 2026 MH ENGLISH PRIVATE HOME. All rights reserved.
        </p>
      </div>
    </div>
  );
};
