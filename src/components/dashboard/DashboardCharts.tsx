import React from 'react';
import { Student, SchoolClass, FeeInvoice, AttendanceRecord } from '../../types';
import { formatCurrency } from '../../services/exportUtils';
import { BarChart3, PieChart as PieIcon, TrendingUp, Users, CheckCircle } from 'lucide-react';

interface DashboardChartsProps {
  students: Student[];
  classes: SchoolClass[];
  invoices: FeeInvoice[];
  attendance: AttendanceRecord[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  students,
  classes,
  invoices,
  attendance,
}) => {
  // 1. Enrollment by class
  const classCounts = classes.map((c) => {
    const count = students.filter((s) => s.classId.toLowerCase() === c.name.toLowerCase()).length;
    return { name: c.name, count };
  });
  const maxClassCount = Math.max(...classCounts.map((c) => c.count), 1);

  // 2. Gender distribution
  const maleCount = students.filter((s) => s.gender === 'Male').length;
  const femaleCount = students.filter((s) => s.gender === 'Female').length;
  const otherCount = students.filter((s) => s.gender === 'Other').length;
  const totalGender = students.length || 1;
  const malePct = Math.round((maleCount / totalGender) * 100);
  const femalePct = Math.round((femaleCount / totalGender) * 100);

  // 3. Active vs Inactive
  const activeCount = students.filter((s) => s.status === 'Active').length;
  const inactiveCount = students.filter((s) => s.status !== 'Active').length;

  // 4. Financial totals
  const totalPaid = invoices.reduce((acc, inv) => acc + (Number(inv.paidAmount) || 0), 0);
  const totalDue = invoices.reduce((acc, inv) => acc + (Number(inv.dueAmount) || 0), 0);
  const totalBilled = totalPaid + totalDue;
  const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  // 5. Attendance distribution (last 30 days or available records)
  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const lateCount = attendance.filter((a) => a.status === 'Late').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;
  const leaveCount = attendance.filter((a) => a.status === 'Leave').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Chart 1: Enrollment by Class */}
      <div className="neu-raised rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="neu-inset-sm p-2.5 rounded-2xl text-blue-600">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Enrollment by Class
              </h3>
              <p className="text-xs text-slate-500">Student count per academic grade</p>
            </div>
          </div>
          <span className="neu-inset-sm text-xs font-bold text-slate-700 px-3 py-1 rounded-xl">
            {students.length} Total
          </span>
        </div>

        <div className="space-y-4 pt-1">
          {classCounts.map((cls) => {
            const barWidth = Math.round((cls.count / maxClassCount) * 100);
            return (
              <div key={cls.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{cls.name}</span>
                  <span className="font-mono font-semibold text-slate-500">{cls.count} students</span>
                </div>
                <div className="neu-inset-deep w-full h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full transition-all duration-500 shadow-[2px_0_6px_rgba(37,99,235,0.4)]"
                    style={{ width: `${Math.max(barWidth, cls.count > 0 ? 8 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart 2: Fee Collection & Financial Overview */}
      <div className="neu-raised rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="neu-inset-sm p-2.5 rounded-2xl text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Fee Collection Overview
              </h3>
              <p className="text-xs text-slate-500">Collected vs outstanding dues</p>
            </div>
          </div>
          <span className="neu-inset-sm text-xs font-bold text-emerald-700 px-3 py-1 rounded-xl">
            {collectionRate}% Collected
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="neu-inset-sm p-4 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1 font-semibold">Total Collected</span>
            <span className="text-lg sm:text-xl font-black text-emerald-600 block">
              {formatCurrency(totalPaid)}
            </span>
          </div>
          <div className="neu-inset-sm p-4 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1 font-semibold">Outstanding Due</span>
            <span className="text-lg sm:text-xl font-black text-rose-600 block">
              {formatCurrency(totalDue)}
            </span>
          </div>
        </div>

        {/* Progress ratio */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-slate-600 font-bold">
            <span>Collected ({collectionRate}%)</span>
            <span>Due ({100 - collectionRate}%)</span>
          </div>
          <div className="neu-inset-deep w-full h-3.5 rounded-full overflow-hidden flex p-0.5">
            <div
              className="bg-emerald-500 h-full rounded-l-full transition-all duration-500 shadow-[1px_0_4px_rgba(16,185,129,0.5)]"
              style={{ width: `${collectionRate}%` }}
            />
            <div
              className="bg-rose-500 h-full rounded-r-full transition-all duration-500"
              style={{ width: `${100 - collectionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chart 3: Gender Distribution */}
      <div className="neu-raised rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="neu-inset-sm p-2.5 rounded-2xl text-violet-600">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Gender Demographics
              </h3>
              <p className="text-xs text-slate-500">Student body ratio</p>
            </div>
          </div>
          <span className="neu-inset-sm text-xs font-bold text-slate-600 px-3 py-1 rounded-xl">
            {students.length} Pupils
          </span>
        </div>

        <div className="flex items-center justify-around py-3">
          <div className="neu-inset p-4 rounded-3xl text-center w-32">
            <div className="w-12 h-12 rounded-2xl neu-raised-sm text-blue-700 flex items-center justify-center text-lg font-black mx-auto mb-2">
              {malePct}%
            </div>
            <span className="text-xs font-bold text-slate-800 block">Male</span>
            <span className="text-[11px] text-slate-400 font-semibold">{maleCount} Pupils</span>
          </div>

          <div className="neu-inset p-4 rounded-3xl text-center w-32">
            <div className="w-12 h-12 rounded-2xl neu-raised-sm text-pink-600 flex items-center justify-center text-lg font-black mx-auto mb-2">
              {femalePct}%
            </div>
            <span className="text-xs font-bold text-slate-800 block">Female</span>
            <span className="text-[11px] text-slate-400 font-semibold">{femaleCount} Pupils</span>
          </div>

          {otherCount > 0 && (
            <div className="neu-inset p-4 rounded-3xl text-center w-32">
              <div className="w-12 h-12 rounded-2xl neu-raised-sm text-purple-600 flex items-center justify-center text-lg font-black mx-auto mb-2">
                {Math.round((otherCount / totalGender) * 100)}%
              </div>
              <span className="text-xs font-bold text-slate-800 block">Other</span>
              <span className="text-[11px] text-slate-400 font-semibold">{otherCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart 4: Overall Status & Attendance Summary */}
      <div className="neu-raised rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="neu-inset-sm p-2.5 rounded-2xl text-amber-600">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Attendance & Enrollment Status
              </h3>
              <p className="text-xs text-slate-500">Activity & retention metrics</p>
            </div>
          </div>
          <span className="neu-inset-sm text-xs font-bold text-emerald-700 px-3 py-1 rounded-xl">
            {activeCount} Active
          </span>
        </div>

        <div className="space-y-4 pt-1">
          <div className="neu-inset-sm flex items-center justify-between p-3.5 rounded-2xl">
            <span className="text-xs font-bold text-slate-600">Active vs Inactive Ratio</span>
            <span className="text-xs font-extrabold text-slate-900">
              {activeCount} Active / {inactiveCount} Inactive
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 text-center text-xs">
            <div className="neu-inset-sm p-3 rounded-2xl">
              <span className="block font-black text-emerald-700 text-base">{presentCount}</span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Present</span>
            </div>
            <div className="neu-inset-sm p-3 rounded-2xl">
              <span className="block font-black text-amber-700 text-base">{lateCount}</span>
              <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Late</span>
            </div>
            <div className="neu-inset-sm p-3 rounded-2xl">
              <span className="block font-black text-rose-700 text-base">{absentCount}</span>
              <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Absent</span>
            </div>
            <div className="neu-inset-sm p-3 rounded-2xl">
              <span className="block font-black text-blue-700 text-base">{leaveCount}</span>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Leave</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
