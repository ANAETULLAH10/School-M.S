import React from 'react';
import { Users, UsersRound, School, ClipboardCheck, Wallet, AlertCircle } from 'lucide-react';
import { DashboardMetrics } from '../../services/storage';
import { formatCurrency } from '../../services/exportUtils';

interface SummaryCardsProps {
  metrics: DashboardMetrics;
  onNavigate?: (tab: string) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics, onNavigate }) => {
  const cards = [
    {
      title: 'Total Students',
      value: metrics.totalStudents.toString(),
      subtext: 'Enrolled pupils',
      icon: Users,
      iconColor: 'text-blue-600',
      tab: 'students',
    },
    {
      title: 'Total Teachers',
      value: metrics.totalTeachers.toString(),
      subtext: 'Teaching faculty',
      icon: UsersRound,
      iconColor: 'text-indigo-600',
      tab: 'teachers',
    },
    {
      title: 'Total Classes',
      value: metrics.totalClasses.toString(),
      subtext: 'Active academic grades',
      icon: School,
      iconColor: 'text-violet-600',
      tab: 'classes',
    },
    {
      title: "Today's Attendance",
      value: `${metrics.todayAttendanceRate}%`,
      subtext:
        metrics.todayTotalMarked > 0
          ? `${metrics.todayPresentCount}/${metrics.todayTotalMarked} present`
          : 'No logs today',
      icon: ClipboardCheck,
      iconColor: 'text-emerald-600',
      tab: 'attendance',
    },
    {
      title: 'Total Collected',
      value: formatCurrency(metrics.totalCollected),
      subtext: 'Payments received',
      icon: Wallet,
      iconColor: 'text-teal-600',
      tab: 'fees',
    },
    {
      title: 'Total Due',
      value: formatCurrency(metrics.totalDue),
      subtext: 'Pending invoices',
      icon: AlertCircle,
      iconColor: 'text-rose-600',
      tab: 'fees',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={() => onNavigate && onNavigate(card.tab)}
            className="neu-raised rounded-3xl p-5 hover:neu-raised-sm active:neu-inset-sm transition-all duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div className="neu-inset-sm p-2.5 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
