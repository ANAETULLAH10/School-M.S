import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Search,
  Users,
  UserPlus,
  ClipboardCheck,
  Wallet,
  GraduationCap,
  UsersRound,
  School,
  AlertCircle,
} from 'lucide-react';
import {
  Student,
  Admission,
  AttendanceRecord,
  FeeInvoice,
  ExamResult,
  Teacher,
  SchoolClass,
  SchoolSettings,
} from '../../types';
import { formatCurrency, formatDate, exportToCSV } from '../../services/exportUtils';

interface ReportsManagerProps {
  students: Student[];
  admissions: Admission[];
  attendance: AttendanceRecord[];
  invoices: FeeInvoice[];
  results: ExamResult[];
  teachers: Teacher[];
  classes: SchoolClass[];
  settings: SchoolSettings;
}

type ReportType =
  | 'student'
  | 'admission'
  | 'attendance'
  | 'fee_collection'
  | 'fee_due'
  | 'exam_result'
  | 'teacher'
  | 'class';

export const ReportsManager: React.FC<ReportsManagerProps> = ({
  students,
  admissions,
  attendance,
  invoices,
  results,
  teachers,
  classes,
  settings,
}) => {
  const [activeReport, setActiveReport] = useState<ReportType>('student');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [search, setSearch] = useState('');

  const reportTabs: { id: ReportType; label: string; icon: React.ElementType }[] = [
    { id: 'student', label: 'Student Report', icon: Users },
    { id: 'admission', label: 'Admission Report', icon: UserPlus },
    { id: 'attendance', label: 'Attendance Report', icon: ClipboardCheck },
    { id: 'fee_collection', label: 'Fee Collection Report', icon: Wallet },
    { id: 'fee_due', label: 'Fee Due Report', icon: AlertCircle },
    { id: 'exam_result', label: 'Exam Result Report', icon: GraduationCap },
    { id: 'teacher', label: 'Teacher Report', icon: UsersRound },
    { id: 'class', label: 'Class Report', icon: School },
  ];

  const filterClass = (itemClass?: string) =>
    selectedClass === 'All' || !itemClass || itemClass === selectedClass;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    switch (activeReport) {
      case 'student': {
        const list = students.filter(
          (s) => filterClass(s.classId) && s.firstName.toLowerCase().includes(search.toLowerCase())
        );
        const headers = ['ID', 'Name', 'Class', 'Section', 'Roll', 'Phone', 'Status'];
        const rows = list.map((s) => [
          s.id,
          `${s.firstName} ${s.lastName}`,
          s.classId,
          s.section,
          s.rollNo,
          s.phone || '',
          s.status,
        ]);
        exportToCSV('Student_Report_MH_School', headers, rows);
        break;
      }
      case 'admission': {
        const headers = ['ID', 'Applicant', 'Father', 'Mother', 'Class', 'Phone', 'Date', 'Status'];
        const rows = admissions.map((a) => [
          a.id,
          a.applicantName,
          a.fatherName || '',
          a.motherName || '',
          a.applyingClass,
          a.phone,
          a.admissionDate || a.applicationDate,
          a.status,
        ]);
        exportToCSV('Admission_Report_MH_School', headers, rows);
        break;
      }
      case 'attendance': {
        const headers = ['Date', 'Student ID', 'Student Name', 'Class', 'Section', 'Status'];
        const rows = attendance.map((a) => [
          a.date,
          a.studentId,
          a.studentName,
          a.classId,
          a.section,
          a.status,
        ]);
        exportToCSV('Attendance_Report_MH_School', headers, rows);
        break;
      }
      case 'fee_collection': {
        const headers = ['Invoice #', 'Student', 'Class', 'Fee Type', 'Paid Amount', 'Status'];
        const rows = invoices.map((i) => [
          i.invoiceNo,
          i.studentName,
          i.classId,
          i.feeType,
          i.paidAmount,
          i.status,
        ]);
        exportToCSV('Fee_Collection_Report_MH_School', headers, rows);
        break;
      }
      case 'fee_due': {
        const dueList = invoices.filter((i) => i.dueAmount > 0);
        const headers = ['Invoice #', 'Student', 'Class', 'Fee Type', 'Due Amount', 'Due Date'];
        const rows = dueList.map((i) => [
          i.invoiceNo,
          i.studentName,
          i.classId,
          i.feeType,
          i.dueAmount,
          i.dueDate,
        ]);
        exportToCSV('Fee_Due_Report_MH_School', headers, rows);
        break;
      }
      case 'exam_result': {
        const headers = ['ID', 'Student Name', 'Class', 'Exam', 'GPA', 'Grade'];
        const rows = results.map((r) => [
          r.studentId,
          r.studentName,
          r.classId,
          r.examName,
          r.gpa.toFixed(2),
          r.grade,
        ]);
        exportToCSV('Exam_Results_Report_MH_School', headers, rows);
        break;
      }
      case 'teacher': {
        const headers = ['ID', 'Name', 'Department', 'Designation', 'Phone', 'Salary', 'Status'];
        const rows = teachers.map((t) => [
          t.id,
          `${t.firstName} ${t.lastName}`,
          t.department,
          t.designation,
          t.phone,
          t.salary,
          t.status,
        ]);
        exportToCSV('Teachers_Report_MH_School', headers, rows);
        break;
      }
      case 'class': {
        const headers = ['Class Name', 'Sections', 'Capacity', 'Room'];
        const rows = classes.map((c) => [
          c.name,
          c.sections.join(', '),
          c.capacity,
          c.roomNumber || '',
        ]);
        exportToCSV('Classes_Report_MH_School', headers, rows);
        break;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Institutional Reports</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate and export comprehensive reports for students, fees, attendance, admissions, and faculty
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
            onClick={handlePrint}
            className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Tactile Report Category Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-print">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveReport(tab.id);
                setSearch('');
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'neu-inset text-blue-700 font-black'
                  : 'neu-btn text-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="neu-raised rounded-3xl p-5 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search report records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="neu-input w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-2xl font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="neu-input px-3.5 py-2 text-xs font-semibold rounded-xl"
          >
            <option value="All">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="neu-raised rounded-3xl overflow-hidden p-6 printable-area bg-[#ebf0f7]">
        {/* Printable Header */}
        <div className="border-b-2 border-slate-800 pb-4 mb-5 text-center">
          <h2 className="text-xl font-black uppercase tracking-wider text-slate-900">
            {settings.schoolName || 'MH ENGLISH PRIVATE HOME'}
          </h2>
          <p className="text-xs text-slate-600 font-medium">{settings.address}</p>
          <div className="inline-block bg-[#0b1329] text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider mt-2">
            {reportTabs.find((t) => t.id === activeReport)?.label}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Generated: {formatDate(new Date().toISOString())}</p>
        </div>

        {/* Dynamic Report Content Tables */}
        {activeReport === 'student' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 font-bold uppercase">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Section</th>
                  <th className="py-2.5 px-3">Roll</th>
                  <th className="py-2.5 px-3">Gender</th>
                  <th className="py-2.5 px-3">Guardian</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students
                  .filter((s) => filterClass(s.classId) && s.firstName.toLowerCase().includes(search.toLowerCase()))
                  .map((s) => (
                    <tr key={s.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{s.id}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{s.firstName} {s.lastName}</td>
                      <td className="py-2.5 px-3 font-semibold">{s.classId}</td>
                      <td className="py-2.5 px-3">{s.section}</td>
                      <td className="py-2.5 px-3 font-mono">{s.rollNo}</td>
                      <td className="py-2.5 px-3">{s.gender}</td>
                      <td className="py-2.5 px-3">{s.guardianName || s.fatherName || '-'}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">{s.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'admission' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 font-bold uppercase">
                  <th className="py-2.5 px-3">App ID</th>
                  <th className="py-2.5 px-3">Applicant Name</th>
                  <th className="py-2.5 px-3">Age</th>
                  <th className="py-2.5 px-3">Admission Date</th>
                  <th className="py-2.5 px-3">Parents (Father/Mother)</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {admissions
                  .filter((a) => filterClass(a.applyingClass) && a.applicantName.toLowerCase().includes(search.toLowerCase()))
                  .map((a) => (
                    <tr key={a.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{a.id}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{a.applicantName}</td>
                      <td className="py-2.5 px-3 font-semibold text-blue-700">{a.age || '-'}</td>
                      <td className="py-2.5 px-3">{formatDate(a.admissionDate || a.applicationDate)}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold block">F: {a.fatherName || '-'}</span>
                        <span className="text-slate-500 text-[11px] block">M: {a.motherName || '-'}</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold">{a.applyingClass}</td>
                      <td className="py-2.5 px-3 font-mono">{a.phone}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">{a.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'fee_collection' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 font-bold uppercase">
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Fee Type</th>
                  <th className="py-2.5 px-3 font-mono">Billed</th>
                  <th className="py-2.5 px-3 font-mono text-emerald-700">Paid Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{inv.invoiceNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{inv.studentName}</td>
                    <td className="py-2.5 px-3">{inv.classId}</td>
                    <td className="py-2.5 px-3 font-medium">{inv.feeType}</td>
                    <td className="py-2.5 px-3 font-mono">{formatCurrency(inv.amount)}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{formatCurrency(inv.paidAmount)}</td>
                    <td className="py-2.5 px-3 font-bold">{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'fee_due' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 font-bold uppercase">
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Fee Type</th>
                  <th className="py-2.5 px-3 font-mono text-rose-700">Outstanding Due</th>
                  <th className="py-2.5 px-3">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoices.filter((i) => i.dueAmount > 0).map((inv) => (
                  <tr key={inv.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{inv.invoiceNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{inv.studentName}</td>
                    <td className="py-2.5 px-3">{inv.classId}</td>
                    <td className="py-2.5 px-3 font-medium">{inv.feeType}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-700">{formatCurrency(inv.dueAmount)}</td>
                    <td className="py-2.5 px-3 font-semibold">{formatDate(inv.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'attendance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 font-bold uppercase">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Class & Section</th>
                  <th className="py-2.5 px-3">Roll</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {attendance.map((att) => (
                  <tr key={att.id}>
                    <td className="py-2.5 px-3 font-bold">{formatDate(att.date)}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{att.studentName}</td>
                    <td className="py-2.5 px-3">{att.classId} ({att.section})</td>
                    <td className="py-2.5 px-3 font-mono">{att.rollNo}</td>
                    <td className="py-2.5 px-3 font-bold">
                      <span className={att.status === 'Present' ? 'text-emerald-700' : 'text-rose-700'}>
                        {att.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{att.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'exam_result' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 font-bold uppercase">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Exam</th>
                  <th className="py-2.5 px-3 text-center">Marks</th>
                  <th className="py-2.5 px-3 text-center">GPA</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {results.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{r.studentId}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{r.studentName}</td>
                    <td className="py-2.5 px-3">{r.classId}</td>
                    <td className="py-2.5 px-3 font-semibold">{r.examName}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold">{r.obtainedMarks}/{r.totalMarks}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-700">{r.gpa.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-center font-black text-emerald-700">{r.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'teacher' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 font-bold uppercase">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Faculty Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Designation</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3 font-mono">Monthly Salary</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {teachers.map((t) => (
                  <tr key={t.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{t.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{t.firstName} {t.lastName}</td>
                    <td className="py-2.5 px-3 font-semibold">{t.department}</td>
                    <td className="py-2.5 px-3">{t.designation}</td>
                    <td className="py-2.5 px-3 font-mono">{t.phone}</td>
                    <td className="py-2.5 px-3 font-mono font-bold">{formatCurrency(t.salary)}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'class' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 font-bold uppercase">
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Class Teacher</th>
                  <th className="py-2.5 px-3">Room</th>
                  <th className="py-2.5 px-3">Sections</th>
                  <th className="py-2.5 px-3 text-center">Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {classes.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{c.name}</td>
                    <td className="py-2.5 px-3 font-semibold">{c.classTeacherName || 'Not Assigned'}</td>
                    <td className="py-2.5 px-3 font-mono">{c.roomNumber || '-'}</td>
                    <td className="py-2.5 px-3 font-bold text-blue-700">{c.sections.join(', ')}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold">{c.capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
