import React, { useState } from 'react';
import {
  X,
  Edit3,
  Printer,
  CreditCard,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  FileCheck,
  Award,
  Wallet,
  ClipboardList,
} from 'lucide-react';
import { Student, SchoolSettings, AttendanceRecord, FeeInvoice, ExamResult } from '../../types';
import { formatDate, formatCurrency } from '../../services/exportUtils';

interface StudentProfileModalProps {
  student: Student;
  settings: SchoolSettings;
  attendance: AttendanceRecord[];
  invoices: FeeInvoice[];
  results: ExamResult[];
  initialTab?: 'overview' | 'personal' | 'guardian' | 'attendance' | 'fees' | 'exams' | 'documents';
  onClose: () => void;
  onEdit: (student: Student) => void;
  onPrintIDCard: (student: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  settings,
  attendance,
  invoices,
  results,
  initialTab = 'overview',
  onClose,
  onEdit,
  onPrintIDCard,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'personal' | 'guardian' | 'attendance' | 'fees' | 'exams' | 'documents'
  >(initialTab);

  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const studentInvoices = invoices.filter((i) => i.studentId === student.id);
  const studentResults = results.filter((r) => r.studentId === student.id);

  const presentCount = studentAttendance.filter((a) => a.status === 'Present').length;
  const attendanceRate =
    studentAttendance.length > 0 ? Math.round((presentCount / studentAttendance.length) * 100) : 100;

  const totalFeeBilled = studentInvoices.reduce((acc, i) => acc + i.amount - i.discount, 0);
  const totalFeePaid = studentInvoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalFeeDue = studentInvoices.reduce((acc, i) => acc + i.dueAmount, 0);

  const handlePrintProfile = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-4xl w-full my-6 overflow-hidden printable-area">
        {/* Profile Header Banner */}
        <div className="bg-[#0b1329] text-white p-6 relative border-b border-slate-800 shadow-[inset_0_-2px_10px_#040712]">
          {/* Close button (hidden on print) */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-[#0e1834] text-slate-400 hover:text-white shadow-[2px_2px_5px_#040712,-2px_-2px_5px_#142247] transition-colors no-print"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Student Avatar */}
            {student.photo ? (
              <img
                src={student.photo}
                alt={student.firstName}
                className="w-24 h-24 rounded-2xl object-cover shadow-[4px_4px_10px_#040712,-2px_-2px_6px_#15254d] border-2 border-blue-400/40"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-3xl font-black shadow-[4px_4px_10px_#040712,-2px_-2px_6px_#15254d] border-2 border-blue-400/40 text-white">
                {student.firstName.charAt(0)}
              </div>
            )}

            {/* Quick Details */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-2xl font-black tracking-tight text-white">
                  {student.firstName} {student.lastName}
                </h2>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                    student.status === 'Active'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {student.status}
                </span>
              </div>

              <p className="font-mono text-xs text-blue-300 font-bold mb-2">
                ID: {student.id} | Roll No: {student.rollNo}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
                <span className="bg-[#0e1834] px-3 py-1 rounded-xl shadow-[inset_2px_2px_4px_#040712] font-semibold text-blue-300">
                  {student.classId} — Section {student.section}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  DOB: {formatDate(student.dob)}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Blood: {student.bloodGroup || 'N/A'}
                </span>
              </div>
            </div>

            {/* Top Action Buttons (no-print) */}
            <div className="flex sm:flex-col gap-2 shrink-0 no-print">
              <button
                onClick={() => onPrintIDCard(student)}
                className="neu-btn px-3 py-1.5 text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>ID Card</span>
              </button>
              <button
                onClick={handlePrintProfile}
                className="neu-btn px-3 py-1.5 text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Profile</span>
              </button>
              <button
                onClick={() => onEdit(student)}
                className="neu-btn-primary px-3 py-1.5 text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tactile Tab Navigation (no-print) */}
        <div className="flex px-6 pt-3 gap-2 overflow-x-auto text-xs font-bold border-b border-slate-200/50 pb-3 no-print">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'personal', label: 'Personal Info' },
            { id: 'guardian', label: 'Guardian & Parents' },
            { id: 'attendance', label: `Attendance (${studentAttendance.length})` },
            { id: 'fees', label: `Fees (${studentInvoices.length})` },
            { id: 'exams', label: `Exams & Results (${studentResults.length})` },
            { id: 'documents', label: 'Documents' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-2 rounded-2xl transition-all whitespace-nowrap text-xs ${
                activeTab === tab.id
                  ? 'neu-inset text-blue-700 font-extrabold'
                  : 'neu-btn text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* TAB: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="neu-inset rounded-2xl p-4 flex items-center gap-3">
                  <div className="neu-raised-sm p-2.5 rounded-xl text-blue-600">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Attendance Rate</span>
                    <h4 className="text-xl font-black text-slate-800">{attendanceRate}%</h4>
                  </div>
                </div>

                <div className="neu-inset rounded-2xl p-4 flex items-center gap-3">
                  <div className="neu-raised-sm p-2.5 rounded-xl text-emerald-600">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Fee Paid</span>
                    <h4 className="text-xl font-black text-emerald-600">{formatCurrency(totalFeePaid)}</h4>
                  </div>
                </div>

                <div className="neu-inset rounded-2xl p-4 flex items-center gap-3">
                  <div className="neu-raised-sm p-2.5 rounded-xl text-rose-600">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Outstanding Due</span>
                    <h4 className="text-xl font-black text-rose-600">{formatCurrency(totalFeeDue)}</h4>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="neu-raised rounded-2xl p-5 space-y-2.5 text-xs">
                  <h4 className="font-black text-slate-800 text-sm mb-3">Academic Summary</h4>
                  <div className="neu-inset-sm p-2.5 rounded-xl flex justify-between">
                    <span className="text-slate-500 font-semibold">Academic Year:</span>
                    <span className="font-bold text-slate-800">{settings.academicYear}</span>
                  </div>
                  <div className="neu-inset-sm p-2.5 rounded-xl flex justify-between">
                    <span className="text-slate-500 font-semibold">Class & Section:</span>
                    <span className="font-bold text-slate-800">{student.classId} ({student.section})</span>
                  </div>
                  <div className="neu-inset-sm p-2.5 rounded-xl flex justify-between">
                    <span className="text-slate-500 font-semibold">Roll Number:</span>
                    <span className="font-bold text-slate-800">{student.rollNo}</span>
                  </div>
                  <div className="neu-inset-sm p-2.5 rounded-xl flex justify-between">
                    <span className="text-slate-500 font-semibold">Admission Date:</span>
                    <span className="font-bold text-slate-800">{formatDate(student.admissionDate)}</span>
                  </div>
                </div>

                <div className="neu-raised rounded-2xl p-5 space-y-2.5 text-xs">
                  <h4 className="font-black text-slate-800 text-sm mb-3">Primary Contact & Parents</h4>
                  <div className="neu-inset-sm p-2.5 rounded-xl flex justify-between">
                    <span className="text-slate-500 font-semibold">Father's Name:</span>
                    <span className="font-bold text-slate-800">{student.fatherName || '-'}</span>
                  </div>
                  <div className="neu-inset-sm p-2.5 rounded-xl flex justify-between">
                    <span className="text-slate-500 font-semibold">Mother's Name:</span>
                    <span className="font-bold text-slate-800">{student.motherName || '-'}</span>
                  </div>
                  <div className="neu-inset-sm p-2.5 rounded-xl flex justify-between">
                    <span className="text-slate-500 font-semibold">Guardian Phone:</span>
                    <span className="font-bold text-slate-800 font-mono">{student.guardianPhone || student.fatherPhone || '-'}</span>
                  </div>
                  <div className="neu-inset-sm p-2.5 rounded-xl flex justify-between">
                    <span className="text-slate-500 font-semibold">Address:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[200px]">{student.address || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Personal Info */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="neu-inset rounded-2xl p-5 space-y-3">
                <span className="text-blue-700 uppercase font-black tracking-wider text-[11px] block">Basic Details</span>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Full Name:</span>
                  <span className="font-bold text-slate-800">{student.firstName} {student.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Gender:</span>
                  <span className="font-bold text-slate-800">{student.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Date of Birth:</span>
                  <span className="font-bold text-slate-800">{formatDate(student.dob)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Blood Group:</span>
                  <span className="font-bold text-rose-600">{student.bloodGroup || 'N/A'}</span>
                </div>
              </div>

              <div className="neu-inset rounded-2xl p-5 space-y-3">
                <span className="text-blue-700 uppercase font-black tracking-wider text-[11px] block">Legal & Social</span>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Religion:</span>
                  <span className="font-bold text-slate-800">{student.religion || 'Islam'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Nationality:</span>
                  <span className="font-bold text-slate-800">{student.nationality || 'Bangladeshi'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Birth Certificate No:</span>
                  <span className="font-mono font-bold text-slate-800">{student.birthCertificateNo || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Phone:</span>
                  <span className="font-bold text-slate-800 font-mono">{student.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Guardian */}
          {activeTab === 'guardian' && (
            <div className="space-y-4 text-xs">
              <div className="neu-inset rounded-2xl p-5">
                <h5 className="font-black text-slate-800 mb-3 text-sm">Father Information</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="neu-raised-sm p-3 rounded-xl">
                    <span className="text-slate-500 block text-[11px] font-semibold">Name</span>
                    <span className="font-bold text-slate-800">{student.fatherName || '-'}</span>
                  </div>
                  <div className="neu-raised-sm p-3 rounded-xl">
                    <span className="text-slate-500 block text-[11px] font-semibold">Phone</span>
                    <span className="font-bold text-slate-800 font-mono">{student.fatherPhone || '-'}</span>
                  </div>
                  <div className="neu-raised-sm p-3 rounded-xl">
                    <span className="text-slate-500 block text-[11px] font-semibold">Occupation</span>
                    <span className="font-bold text-slate-800">{student.fatherOccupation || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="neu-inset rounded-2xl p-5">
                <h5 className="font-black text-slate-800 mb-3 text-sm">Mother Information</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="neu-raised-sm p-3 rounded-xl">
                    <span className="text-slate-500 block text-[11px] font-semibold">Name</span>
                    <span className="font-bold text-slate-800">{student.motherName || '-'}</span>
                  </div>
                  <div className="neu-raised-sm p-3 rounded-xl">
                    <span className="text-slate-500 block text-[11px] font-semibold">Phone</span>
                    <span className="font-bold text-slate-800 font-mono">{student.motherPhone || '-'}</span>
                  </div>
                  <div className="neu-raised-sm p-3 rounded-xl">
                    <span className="text-slate-500 block text-[11px] font-semibold">Occupation</span>
                    <span className="font-bold text-slate-800">{student.motherOccupation || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="neu-inset rounded-2xl p-5">
                <h5 className="font-black text-slate-800 mb-3 text-sm">Emergency Contact</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="neu-raised-sm p-3 rounded-xl">
                    <span className="text-slate-500 block text-[11px] font-semibold">Contact Person</span>
                    <span className="font-bold text-slate-800">{student.emergencyContactName || '-'}</span>
                  </div>
                  <div className="neu-raised-sm p-3 rounded-xl">
                    <span className="text-slate-500 block text-[11px] font-semibold">Phone</span>
                    <span className="font-bold text-slate-800 font-mono">{student.emergencyContactPhone || '-'}</span>
                  </div>
                  <div className="neu-raised-sm p-3 rounded-xl">
                    <span className="text-slate-500 block text-[11px] font-semibold">Relation</span>
                    <span className="font-bold text-slate-800">{student.emergencyContactRelation || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Attendance */}
          {activeTab === 'attendance' && (
            <div>
              {studentAttendance.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-semibold">
                  No attendance records recorded for this student yet.
                </div>
              ) : (
                <div className="neu-raised rounded-2xl overflow-hidden p-2">
                  <table className="w-full text-xs text-left">
                    <thead className="text-slate-500 font-bold border-b border-slate-200/50">
                      <tr>
                        <th className="py-2.5 px-4">Date</th>
                        <th className="py-2.5 px-4">Class</th>
                        <th className="py-2.5 px-4">Section</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/40">
                      {studentAttendance.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-200/20">
                          <td className="py-2.5 px-4 font-bold">{formatDate(att.date)}</td>
                          <td className="py-2.5 px-4">{att.classId}</td>
                          <td className="py-2.5 px-4">{att.section}</td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`neu-inset-sm px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                                att.status === 'Present'
                                  ? 'text-emerald-700'
                                  : att.status === 'Absent'
                                  ? 'text-rose-700'
                                  : 'text-amber-700'
                              }`}
                            >
                              {att.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-500">{att.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: Fees */}
          {activeTab === 'fees' && (
            <div>
              {studentInvoices.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-semibold">
                  No fee invoices generated for this student yet.
                </div>
              ) : (
                <div className="neu-raised rounded-2xl overflow-hidden p-2">
                  <table className="w-full text-xs text-left">
                    <thead className="text-slate-500 font-bold border-b border-slate-200/50">
                      <tr>
                        <th className="py-2.5 px-4">Invoice #</th>
                        <th className="py-2.5 px-4">Fee Type</th>
                        <th className="py-2.5 px-4">Amount</th>
                        <th className="py-2.5 px-4">Paid</th>
                        <th className="py-2.5 px-4">Due</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/40">
                      {studentInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-200/20">
                          <td className="py-2.5 px-4 font-mono font-bold text-blue-600">{inv.invoiceNo}</td>
                          <td className="py-2.5 px-4 font-semibold">{inv.feeType}</td>
                          <td className="py-2.5 px-4 font-bold">{formatCurrency(inv.amount)}</td>
                          <td className="py-2.5 px-4 text-emerald-600 font-bold">{formatCurrency(inv.paidAmount)}</td>
                          <td className="py-2.5 px-4 text-rose-600 font-bold">{formatCurrency(inv.dueAmount)}</td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`neu-inset-sm px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                                inv.status === 'Paid'
                                  ? 'text-emerald-700'
                                  : inv.status === 'Partial'
                                  ? 'text-amber-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: Exams & Results */}
          {activeTab === 'exams' && (
            <div>
              {studentResults.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-semibold">
                  No exam results published for this student yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {studentResults.map((res) => (
                    <div key={res.id} className="neu-raised rounded-2xl p-5">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-black text-slate-800 text-sm">{res.examName}</h5>
                        <div className="flex items-center gap-2">
                          <span className="neu-inset-sm px-3 py-1 rounded-xl text-blue-700 font-bold text-xs">
                            GPA: {res.gpa.toFixed(2)}
                          </span>
                          <span className="neu-inset-sm px-3 py-1 rounded-xl text-emerald-700 font-bold text-xs">
                            Grade: {res.grade}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        {res.subjectMarks.map((sm, sIdx) => (
                          <div key={sIdx} className="neu-inset-sm p-3 rounded-xl">
                            <span className="text-[11px] text-slate-500 font-semibold block truncate">{sm.subjectName}</span>
                            <span className="font-extrabold text-slate-800">
                              {sm.obtainedMarks}/{sm.totalMarks} ({sm.grade})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-3 text-xs">
              <div className="neu-inset rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <div>
                    <h5 className="font-bold text-slate-800">Birth Certificate Registration</h5>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {student.birthCertificateNo ? `Verified #${student.birthCertificateNo}` : 'Not provided'}
                    </p>
                  </div>
                </div>
                <span className="neu-inset-sm px-3 py-1 text-emerald-700 rounded-xl font-bold text-[11px]">
                  Verified
                </span>
              </div>

              {student.tcNumber && (
                <div className="neu-inset rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h5 className="font-bold text-slate-800">Transfer Certificate (TC)</h5>
                      <p className="text-[11px] text-slate-500">Ref: {student.tcNumber} from {student.prevSchoolName}</p>
                    </div>
                  </div>
                  <span className="neu-inset-sm px-3 py-1 text-blue-700 rounded-xl font-bold text-[11px]">
                    Archived
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200/50 flex justify-end no-print">
          <button
            onClick={onClose}
            className="neu-btn px-5 py-2 text-xs font-bold text-slate-700 rounded-2xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
