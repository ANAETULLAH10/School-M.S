import React, { useState } from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, User } from 'lucide-react';
import { Student, Exam, Subject, SchoolSettings } from '../../types';
import { formatDate } from '../../services/exportUtils';

interface AdmitCardModalProps {
  students: Student[];
  exams: Exam[];
  subjects: Subject[];
  settings: SchoolSettings;
  preselectedStudent?: Student | null;
  onClose: () => void;
}

export const AdmitCardModal: React.FC<AdmitCardModalProps> = ({
  students,
  exams,
  subjects,
  settings,
  preselectedStudent,
  onClose,
}) => {
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState(
    preselectedStudent?.id || students[0]?.id || ''
  );

  const activeStudent = students.find((s) => s.id === selectedStudentId) || preselectedStudent || students[0];
  const activeExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  // Subjects for the student's class
  const classSubjects = subjects.filter(
    (s) => activeStudent && s.classId.toLowerCase() === activeStudent.classId.toLowerCase()
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-2xl w-full my-8 p-6">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/50 no-print">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Student Admit Card</h3>
            <p className="text-xs text-slate-500 font-medium">Official Examination Entry Authorization Badge</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Admit Card</span>
            </button>

            <button
              onClick={onClose}
              className="neu-btn p-2 rounded-xl text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selection Pickers (no-print) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 no-print">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Examination</label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="neu-input w-full px-3 py-2 text-xs font-bold rounded-xl"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Candidate</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="neu-input w-full px-3 py-2 text-xs font-bold rounded-xl"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.firstName} {st.lastName} (Roll: {st.rollNo} - {st.classId})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Printable Admit Card Canvas */}
        {activeStudent && activeExam && (
          <div className="printable-area py-2">
            <div className="border-2 border-slate-900 rounded-3xl p-6 sm:p-8 bg-white text-slate-900 shadow-sm relative">
              {/* Watermark / Seal */}
              <div className="absolute right-6 top-6 opacity-10 pointer-events-none text-right">
                <span className="text-8xl font-black">MH</span>
              </div>

              {/* School Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white font-black flex items-center justify-center text-sm">
                    MH
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-wider text-slate-900">
                    {settings.schoolName || 'MH ENGLISH PRIVATE HOME'}
                  </h2>
                </div>
                <p className="text-xs text-slate-600 font-medium">{settings.address}</p>
                <div className="mt-2.5 inline-block bg-[#0b1329] text-white text-xs font-black px-4 py-1 rounded-xl uppercase tracking-wider">
                  ADMIT CARD — {activeExam.name}
                </div>
              </div>

              {/* Student Details Grid & Photo */}
              <div className="py-4 border-b border-slate-200 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-xs">
                <div className="space-y-1.5 flex-1">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <div>
                      <span className="text-slate-500 font-semibold block text-[11px]">Candidate Name</span>
                      <span className="font-black text-slate-900 text-sm">
                        {activeStudent.firstName} {activeStudent.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block text-[11px]">Student ID</span>
                      <span className="font-mono font-bold text-blue-700 text-sm">
                        {activeStudent.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block text-[11px]">Class & Section</span>
                      <span className="font-bold text-slate-800">
                        {activeStudent.classId} (Section {activeStudent.section})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block text-[11px]">Roll Number</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {activeStudent.rollNo}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block text-[11px]">Father's Name</span>
                      <span className="font-bold text-slate-800">
                        {activeStudent.fatherName || activeStudent.guardianName || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block text-[11px]">Session</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {settings.academicYear}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Candidate Photo */}
                <div className="shrink-0 text-center">
                  {activeStudent.photo ? (
                    <img
                      src={activeStudent.photo}
                      alt={activeStudent.firstName}
                      className="w-24 h-28 rounded-xl object-cover border-2 border-slate-900 shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-28 rounded-xl bg-slate-100 border-2 border-slate-900 flex flex-col items-center justify-center text-slate-400">
                      <User className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-bold">Photo</span>
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-emerald-700 block mt-1">VERIFIED</span>
                </div>
              </div>

              {/* Subject Exam Schedule */}
              <div className="py-4">
                <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider block mb-2">
                  Examination Schedule & Invigilator Initial
                </span>
                <table className="w-full text-xs text-left border-collapse border border-slate-300">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="border border-slate-300 py-1.5 px-2.5">SL</th>
                      <th className="border border-slate-300 py-1.5 px-2.5">Subject</th>
                      <th className="border border-slate-300 py-1.5 px-2.5">Code</th>
                      <th className="border border-slate-300 py-1.5 px-2.5 text-center">Time</th>
                      <th className="border border-slate-300 py-1.5 px-2.5 text-center">Invigilator Sign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(classSubjects.length > 0
                      ? classSubjects
                      : [
                          { id: '1', name: 'English 1st Paper', code: 'ENG-101' },
                          { id: '2', name: 'English 2nd Paper', code: 'ENG-102' },
                          { id: '3', name: 'General Mathematics', code: 'MTH-101' },
                          { id: '4', name: 'General Science', code: 'SCI-101' },
                        ]
                    ).map((sub, idx) => (
                      <tr key={sub.id}>
                        <td className="border border-slate-300 py-1.5 px-2.5 font-mono">{idx + 1}</td>
                        <td className="border border-slate-300 py-1.5 px-2.5 font-bold">{sub.name}</td>
                        <td className="border border-slate-300 py-1.5 px-2.5 font-mono">{sub.code}</td>
                        <td className="border border-slate-300 py-1.5 px-2.5 text-center font-mono text-[11px]">
                          10:00 AM - 01:00 PM
                        </td>
                        <td className="border border-slate-300 py-1.5 px-2.5 text-center"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Instructions */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] space-y-1 text-slate-700">
                <span className="font-black text-slate-900 uppercase block">Candidate Rules:</span>
                <p>1. Candidate must bring this original Admit Card to the examination hall every day.</p>
                <p>2. Electronic gadgets, mobile phones, or smartwatches are strictly forbidden in the examination hall.</p>
                <p>3. Candidates must occupy their allotted seats 15 minutes before exam commencement.</p>
              </div>

              {/* Signatures */}
              <div className="mt-12 pt-4 flex justify-between items-end text-xs text-slate-800">
                <div className="text-center">
                  <div className="w-32 border-t border-slate-900 mb-1"></div>
                  <span className="text-[11px] font-semibold">Candidate Signature</span>
                </div>

                <div className="text-center">
                  <div className="w-36 border-t border-slate-900 mb-1"></div>
                  <span className="text-[11px] font-black uppercase block">
                    {settings.principalName}
                  </span>
                  <span className="text-[10px] text-slate-500">Controller / Principal</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
