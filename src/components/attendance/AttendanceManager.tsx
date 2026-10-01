import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock,
  Coffee,
  Save,
  Printer,
  Download,
  CheckCheck,
  Ban,
} from 'lucide-react';
import { Student, SchoolClass, AttendanceRecord, AttendanceStatus } from '../../types';
import { formatDate, exportToCSV } from '../../services/exportUtils';
import { useToast } from '../../context/ToastContext';

interface AttendanceManagerProps {
  students: Student[];
  classes: SchoolClass[];
  attendance: AttendanceRecord[];
  onSaveAttendance: (records: AttendanceRecord[]) => void;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  students,
  classes,
  attendance,
  onSaveAttendance,
}) => {
  const toast = useToast();

  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.name || 'Class 10');
  const [selectedSection, setSelectedSection] = useState<string>('A');

  // Working state of attendance for each student in the selected class/section
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, { status: AttendanceStatus; remarks: string }>
  >({});

  // Filter students for the chosen class and section
  const targetStudents = students.filter(
    (s) => s.classId === selectedClass && (!selectedSection || s.section === selectedSection)
  );

  // Load existing records or default to 'Present'
  useEffect(() => {
    const existing = attendance.filter(
      (a) =>
        a.date === selectedDate &&
        a.classId === selectedClass &&
        (!selectedSection || a.section === selectedSection)
    );

    const map: Record<string, { status: AttendanceStatus; remarks: string }> = {};

    targetStudents.forEach((stu) => {
      const match = existing.find((e) => e.studentId === stu.id);
      if (match) {
        map[stu.id] = { status: match.status, remarks: match.remarks || '' };
      } else {
        map[stu.id] = { status: 'Present', remarks: '' };
      }
    });

    setAttendanceMap(map);
  }, [selectedDate, selectedClass, selectedSection, students, attendance]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        status,
        remarks: prev[studentId]?.remarks || '',
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'Present',
        remarks,
      },
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    targetStudents.forEach((stu) => {
      updated[stu.id] = {
        status,
        remarks: attendanceMap[stu.id]?.remarks || '',
      };
    });
    setAttendanceMap(updated);
    toast.info(`Marked all ${status.toLowerCase()}`);
  };

  const handleSave = () => {
    if (targetStudents.length === 0) {
      toast.warning('No students in this class/section to mark attendance');
      return;
    }

    const records: AttendanceRecord[] = targetStudents.map((stu) => {
      const item = attendanceMap[stu.id] || { status: 'Present', remarks: '' };
      return {
        id: `att_${stu.id}_${selectedDate}`,
        studentId: stu.id,
        studentName: `${stu.firstName} ${stu.lastName}`,
        classId: selectedClass,
        section: selectedSection,
        rollNo: stu.rollNo,
        date: selectedDate,
        status: item.status,
        remarks: item.remarks.trim() || undefined,
        markedBy: 'Administrator',
        createdAt: new Date().toISOString(),
      };
    });

    onSaveAttendance(records);
    toast.success(`Saved attendance for ${records.length} students on ${formatDate(selectedDate)}`);
  };

  // Calculations for current sheet
  const presentCount = Object.values(attendanceMap).filter((v) => v.status === 'Present').length;
  const absentCount = Object.values(attendanceMap).filter((v) => v.status === 'Absent').length;
  const lateCount = Object.values(attendanceMap).filter((v) => v.status === 'Late').length;
  const leaveCount = Object.values(attendanceMap).filter((v) => v.status === 'Leave').length;
  const totalCount = targetStudents.length;
  const presentRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Student ID',
      'Student Name',
      'Class',
      'Section',
      'Roll No',
      'Status',
      'Remarks',
    ];
    const rows = targetStudents.map((s) => [
      selectedDate,
      s.id,
      `${s.firstName} ${s.lastName}`,
      s.classId,
      s.section,
      s.rollNo,
      attendanceMap[s.id]?.status || 'Present',
      attendanceMap[s.id]?.remarks || '',
    ]);
    exportToCSV(`Attendance_${selectedClass}_${selectedSection}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Attendance Tracker</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Log daily student presence, manage tardiness/leaves, and synchronize dashboard statistics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="neu-btn inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-2xl"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="neu-btn inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-2xl"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Sheet</span>
          </button>
          <button
            onClick={handleSave}
            className="neu-btn-primary inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-2xl"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Date & Class Selectors Card */}
      <div className="neu-raised rounded-3xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="neu-input w-full px-3.5 py-2 text-sm rounded-2xl font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Academic Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="neu-input w-full px-3.5 py-2 text-sm rounded-2xl font-semibold"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="neu-input w-full px-3.5 py-2 text-sm rounded-2xl font-semibold"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>
        </div>

        {/* Quick Actions & Live Stats Banner */}
        <div className="pt-3 border-t border-slate-200/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Batch Mark:</span>
            <button
              onClick={() => markAll('Present')}
              className="neu-btn px-3 py-1.5 text-xs font-bold text-emerald-700 rounded-xl inline-flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark All Present</span>
            </button>
            <button
              onClick={() => markAll('Absent')}
              className="neu-btn px-3 py-1.5 text-xs font-bold text-rose-700 rounded-xl inline-flex items-center gap-1"
            >
              <Ban className="w-3.5 h-3.5 text-rose-600" />
              <span>Mark All Absent</span>
            </button>
          </div>

          {/* Stat Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="neu-inset-sm px-3 py-1 rounded-xl text-emerald-700 font-black">
              Present: {presentCount} ({presentRate}%)
            </span>
            <span className="neu-inset-sm px-3 py-1 rounded-xl text-rose-700 font-black">
              Absent: {absentCount}
            </span>
            <span className="neu-inset-sm px-3 py-1 rounded-xl text-amber-700 font-black">
              Late: {lateCount}
            </span>
            <span className="neu-inset-sm px-3 py-1 rounded-xl text-blue-700 font-black">
              Leave: {leaveCount}
            </span>
          </div>
        </div>
      </div>

      {/* Students Attendance Table */}
      <div className="neu-raised rounded-3xl overflow-hidden p-2">
        <div className="overflow-x-auto">
          {targetStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs font-semibold">
              No students enrolled in {selectedClass} — Section {selectedSection}.
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200/50">
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30">
                {targetStudents
                  .sort((a, b) => Number(a.rollNo || 0) - Number(b.rollNo || 0))
                  .map((stu) => {
                    const currentStatus = attendanceMap[stu.id]?.status || 'Present';
                    const remarks = attendanceMap[stu.id]?.remarks || '';

                    return (
                      <tr key={stu.id} className="hover:bg-slate-200/20 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-black text-slate-800">
                          {stu.rollNo}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-blue-600">
                          {stu.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            {stu.photo ? (
                              <img
                                src={stu.photo}
                                alt={stu.firstName}
                                className="w-8 h-8 rounded-xl object-cover shadow-[2px_2px_4px_#cad1de]"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-xl neu-inset-sm text-slate-700 flex items-center justify-center font-bold text-xs">
                                {stu.firstName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-slate-800 block leading-tight">
                                {stu.firstName} {stu.lastName}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {stu.phone || 'No phone'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status buttons */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl neu-inset-sm">
                            {(['Present', 'Late', 'Absent', 'Leave'] as AttendanceStatus[]).map((status) => {
                              const isSelected = currentStatus === status;
                              let activeClass = '';
                              let icon = <CheckCircle className="w-3.5 h-3.5" />;

                              if (status === 'Present') {
                                activeClass = 'bg-emerald-600 text-white shadow-xs';
                                icon = <CheckCircle className="w-3.5 h-3.5" />;
                              } else if (status === 'Late') {
                                activeClass = 'bg-amber-600 text-white shadow-xs';
                                icon = <Clock className="w-3.5 h-3.5" />;
                              } else if (status === 'Absent') {
                                activeClass = 'bg-rose-600 text-white shadow-xs';
                                icon = <XCircle className="w-3.5 h-3.5" />;
                              } else if (status === 'Leave') {
                                activeClass = 'bg-blue-600 text-white shadow-xs';
                                icon = <Coffee className="w-3.5 h-3.5" />;
                              }

                              return (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => handleStatusChange(stu.id, status)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                                    isSelected
                                      ? activeClass
                                      : 'text-slate-500 hover:text-slate-800'
                                  }`}
                                >
                                  {icon}
                                  <span>{status}</span>
                                </button>
                              );
                            })}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <input
                            type="text"
                            placeholder="Optional remark..."
                            value={remarks}
                            onChange={(e) => handleRemarksChange(stu.id, e.target.value)}
                            className="neu-input w-full max-w-xs px-3 py-1 text-xs rounded-xl"
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
