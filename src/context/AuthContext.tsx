import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  canAccess: (module: string) => boolean;
}

const DEFAULT_USERS: Record<UserRole, User> = {
  admin: {
    id: 'usr-admin-1',
    name: 'Md. Anaetullah Khokon',
    email: 'mdanaetullahkhokon3@gmail.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    phone: '+880 1712-345678',
  },
  teacher: {
    id: 'usr-teacher-1',
    name: 'Kazi Farhana',
    email: 'farhana.teacher@myschoolbd.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    phone: '+880 1812-445566',
  },
  accountant: {
    id: 'usr-acct-1',
    name: 'Mahmudur Rahman',
    email: 'accounts@myschoolbd.edu',
    role: 'accountant',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    phone: '+880 1912-778899',
  },
  staff: {
    id: 'usr-staff-1',
    name: 'Shamim Hossain',
    email: 'frontdesk@myschoolbd.edu',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    phone: '+880 1715-112233',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('sms_auth_user');
      return saved ? JSON.parse(saved) : DEFAULT_USERS.admin;
    } catch {
      return DEFAULT_USERS.admin;
    }
  });

  const role: UserRole = user?.role || 'admin';

  useEffect(() => {
    if (user) {
      localStorage.setItem('sms_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sms_auth_user');
    }
  }, [user]);

  const login = (email: string, selectedRole: UserRole = 'admin') => {
    const baseUser = DEFAULT_USERS[selectedRole];
    const newUser = {
      ...baseUser,
      email: email || baseUser.email,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    setUser(DEFAULT_USERS[newRole]);
  };

  // RBAC Permission Checker
  const canAccess = (module: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;

    switch (module) {
      case 'dashboard':
        return true;
      case 'students':
        return ['teacher', 'staff'].includes(user.role);
      case 'admission':
        return user.role === 'staff';
      case 'classes':
        return user.role === 'teacher';
      case 'attendance':
        return user.role === 'teacher';
      case 'fees':
        return user.role === 'accountant';
      case 'exams':
        return user.role === 'teacher';
      case 'admitcard':
        return ['teacher', 'staff'].includes(user.role);
      case 'routine':
        return ['teacher', 'staff'].includes(user.role);
      case 'homework':
        return user.role === 'teacher';
      case 'notices':
        return true;
      case 'certificates':
        return user.role === 'staff';
      case 'sms':
        return ['teacher', 'staff'].includes(user.role);
      case 'teachers':
        return false;
      case 'reports':
        return user.role === 'accountant';
      case 'settings':
        return false;
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
