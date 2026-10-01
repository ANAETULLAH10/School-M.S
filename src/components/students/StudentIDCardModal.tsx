import React from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';
import { Student, SchoolSettings } from '../../types';
import { formatDate } from '../../services/exportUtils';

interface StudentIDCardModalProps {
  student: Student;
  settings: SchoolSettings;
  onClose: () => void;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({
  student,
  settings,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-lg w-full p-6 my-8">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 no-print">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Student ID Card</h3>
            <p className="text-xs text-slate-500 font-medium">Official printable identification badge</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print ID Card</span>
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

        {/* Printable Card Area */}
        <div className="py-6 flex flex-col items-center printable-area">
          {/* Card Front */}
          <div className="w-[320px] rounded-3xl overflow-hidden neu-raised bg-[#ebf0f7] text-slate-900 relative border border-white">
            {/* Header */}
            <div className="bg-[#0b1329] text-white p-4 text-center relative border-b-2 border-blue-500">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-black text-xs text-white shadow-md">
                  MH
                </div>
                <h4 className="font-black text-xs tracking-wider uppercase truncate max-w-[220px]">
                  {settings.schoolName || 'MH ENGLISH PRIVATE HOME'}
                </h4>
              </div>
              <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold">
                Student Identity Card
              </p>
            </div>

            {/* Photo & Basic Details */}
            <div className="p-5 flex flex-col items-center text-center">
              <div className="relative mb-3">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.firstName}
                    className="w-24 h-24 rounded-2xl object-cover shadow-[4px_4px_10px_#cad1de,-4px_-4px_10px_#ffffff] border-2 border-blue-500/50"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl neu-inset text-blue-700 flex items-center justify-center text-3xl font-black border-2 border-blue-500/40">
                    {student.firstName.charAt(0)}
                  </div>
                )}
                <span className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white shadow-xs">
                  {student.status}
                </span>
              </div>

              <h3 className="font-black text-base text-slate-900 leading-tight">
                {student.firstName} {student.lastName}
              </h3>
              <p className="font-mono text-xs font-bold text-blue-700 mb-3">
                {student.id}
              </p>

              {/* Grid table */}
              <div className="w-full text-left neu-inset rounded-2xl p-3 text-[11px] space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Class:</span>
                  <span className="font-bold text-slate-800">{student.classId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Section:</span>
                  <span className="font-bold text-slate-800">{student.section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Roll No:</span>
                  <span className="font-bold text-slate-800 font-mono">{student.rollNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Blood Group:</span>
                  <span className="font-bold text-rose-600">{student.bloodGroup || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">DOB:</span>
                  <span className="font-bold text-slate-800">{formatDate(student.dob)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Contact:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {student.phone || student.guardianPhone || '-'}
                  </span>
                </div>
              </div>

              {/* Signature stamp */}
              <div className="mt-4 pt-3 border-t border-slate-300/50 w-full flex items-center justify-between text-[9px] text-slate-500">
                <div className="flex items-center gap-1 font-bold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>VERIFIED</span>
                </div>
                <div className="text-right">
                  <span className="font-cursive font-bold text-slate-700 block text-xs">
                    {settings.principalName}
                  </span>
                  <span className="text-[8px] uppercase tracking-wider block font-semibold">
                    Headmaster / Principal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-2 text-xs text-slate-500 no-print font-medium">
          Ready to print standard CR-80 PVC badge format.
        </div>
      </div>
    </div>
  );
};
