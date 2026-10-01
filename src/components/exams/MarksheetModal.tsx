import React from 'react';
import { X, Printer } from 'lucide-react';
import { ExamResult, SchoolSettings } from '../../types';

interface MarksheetModalProps {
  result: ExamResult;
  settings: SchoolSettings;
  onClose: () => void;
}

export const MarksheetModal: React.FC<MarksheetModalProps> = ({
  result,
  settings,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-2xl w-full my-8 p-6">
        {/* Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 no-print">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Academic Result Sheet</h3>
            <p className="text-xs text-slate-500 font-medium">Official Student Progress Report Card</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Marksheet</span>
            </button>
            <button
              onClick={onClose}
              className="neu-btn p-2 text-slate-500 hover:text-slate-800 rounded-xl"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Marksheet Area */}
        <div className="py-6 printable-area bg-[#ebf0f7] text-slate-900">
          <div className="neu-raised rounded-3xl p-6 sm:p-8 bg-white border border-slate-300">
            {/* School Header */}
            <div className="text-center pb-5 border-b-2 border-slate-900">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white font-black flex items-center justify-center text-sm shadow-md">
                  MH
                </div>
                <h2 className="text-xl font-black tracking-wider uppercase text-slate-900">
                  {settings.schoolName || 'MH ENGLISH PRIVATE HOME'}
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium">{settings.address}</p>
              <p className="text-[11px] text-slate-500 font-mono">
                EIIN: {settings.eiinCode} | Academic Session: {settings.academicYear}
              </p>
              <div className="mt-2.5 inline-block bg-[#0b1329] text-white text-xs font-black px-4 py-1 rounded-xl uppercase tracking-wider">
                {result.examName} — Official Marksheet
              </div>
            </div>

            {/* Student Info Box */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-300">
              <div className="space-y-1">
                <div>
                  <span className="text-slate-500 font-semibold">Student Name: </span>
                  <span className="font-black text-slate-900 text-sm">{result.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Student ID: </span>
                  <span className="font-mono font-bold text-blue-700">{result.studentId}</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div>
                  <span className="text-slate-500 font-semibold">Class & Section: </span>
                  <span className="font-bold text-slate-900">{result.classId} ({result.section})</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Roll Number: </span>
                  <span className="font-bold text-slate-900 font-mono">{result.rollNo}</span>
                </div>
              </div>
            </div>

            {/* Subject-wise Marks Table */}
            <div className="py-4">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-900 font-bold uppercase">
                    <th className="py-2.5 px-3">SL</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3 text-center">Total Marks</th>
                    <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                    <th className="py-2.5 px-3 text-center">Grade Point</th>
                    <th className="py-2.5 px-3 text-center">Letter Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {result.subjectMarks.map((sm, index) => (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-mono">{String(index + 1).padStart(2, '0')}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{sm.subjectName}</td>
                      <td className="py-2 px-3 text-center font-mono">{sm.totalMarks}</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">
                        {sm.obtainedMarks}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-semibold">
                        {sm.gradePoint.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-slate-800">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100">{sm.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Result Aggregate Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-100 rounded-2xl p-4 text-center my-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Marks</span>
                <span className="font-mono font-black text-slate-800 text-base">{result.totalMarks}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Obtained Marks</span>
                <span className="font-mono font-black text-slate-900 text-base">{result.obtainedMarks}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Grade Point (GPA)</span>
                <span className="font-mono font-black text-blue-700 text-base">{result.gpa.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Final Grade</span>
                <span className="font-black text-emerald-700 text-base">{result.grade}</span>
              </div>
            </div>

            {/* Teacher remarks */}
            {result.remarks && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs my-3">
                <span className="font-bold text-slate-700">Remarks: </span>
                <span className="text-slate-600 italic">{result.remarks}</span>
              </div>
            )}

            {/* Signatures */}
            <div className="mt-14 pt-4 flex justify-between items-end text-xs text-slate-600">
              <div className="text-center">
                <div className="w-32 border-t border-slate-400 mb-1"></div>
                <span className="text-[11px] font-semibold">Class Teacher</span>
              </div>

              <div className="text-center">
                <div className="w-32 border-t border-slate-400 mb-1"></div>
                <span className="text-[11px] font-semibold">Controller of Exams</span>
              </div>

              <div className="text-center">
                <div className="w-32 border-t border-slate-400 mb-1"></div>
                <span className="text-[11px] font-semibold">Principal / Headmaster</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 no-print font-medium">
          Official academic transcript published by MH ENGLISH PRIVATE HOME.
        </div>
      </div>
    </div>
  );
};
