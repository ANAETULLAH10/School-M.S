import React, { useState } from 'react';
import {
  CreditCard,
  Printer,
  Search,
  Filter,
  Users,
  GraduationCap,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileCheck,
  X,
  Eye,
} from 'lucide-react';
import { Student, SchoolClass, Exam, Subject, SchoolSettings } from '../../types';
import { formatDate } from '../../services/exportUtils';
import { useToast } from '../../context/ToastContext';

interface AdmitCardManagerProps {
  students: Student[];
  classes: SchoolClass[];
  exams: Exam[];
  subjects: Subject[];
  settings: SchoolSettings;
}

export const AdmitCardManager: React.FC<AdmitCardManagerProps> = ({
  students,
  classes,
  exams,
  subjects,
  settings,
}) => {
  const toast = useToast();
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.name || 'Class 10');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);
  const [isBulkPrinting, setIsBulkPrinting] = useState(false);

  const selectedExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  // Subjects for the selected class
  const classSubjects = subjects.filter((s) => s.classId === selectedClass);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesClass = s.classId === selectedClass;
    const matchesSection = selectedSection === 'All' || s.section === selectedSection;
    const matchesSearch =
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSection && matchesSearch;
  });

  const handlePrintSingle = (stu: Student) => {
    setPreviewStudent(stu);
    setIsBulkPrinting(false);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handlePrintBatch = () => {
    if (filteredStudents.length === 0) {
      toast.error('No students in this class/section to print admit cards for');
      return;
    }
    setIsBulkPrinting(true);
    setPreviewStudent(null);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* PRINT-ONLY ADMIT CARD TEMPLATE (SINGLE OR BULK)               */}
      {/* ============================================================== */}
      <div className="hidden print:block fixed inset-0 bg-white z-[99999] text-black">
        {(isBulkPrinting ? filteredStudents : previewStudent ? [previewStudent] : []).map((stu, idx) => (
          <div
            key={stu.id}
            className="p-8 max-w-4xl mx-auto border-4 border-slate-900 my-4 bg-white relative font-sans page-break-after"
            style={{ pageBreakAfter: 'always', minHeight: '90vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-black text-2xl flex items-center justify-center border-2 border-slate-700">
                MH
              </div>
              <div className="text-center flex-1 px-4">
                <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">
                  {settings.schoolName}
                </h1>
                <p className="text-xs font-semibold text-slate-700">{settings.subtitle}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {settings.address} • Tel: {settings.phone} • EIIN: {settings.eiinCode}
                </p>
              </div>
              <div className="w-16 text-right">
                <span className="text-[10px] font-bold uppercase border border-slate-900 px-2 py-1">
                  OFFICIAL
                </span>
              </div>
            </div>

            {/* Title Banner */}
            <div className="my-4 text-center">
              <span className="inline-block bg-slate-900 text-white font-bold text-sm px-8 py-1.5 rounded uppercase tracking-widest">
                EXAMINATION ADMIT CARD
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1 uppercase">
                {selectedExam ? selectedExam.name : 'Terminal Examination 2026'} • Academic Session:{' '}
                {settings.academicYear}
              </p>
            </div>

            {/* Student Info Card */}
            <div className="border border-slate-900 p-4 rounded flex items-center justify-between gap-6 my-4 bg-slate-50">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs flex-1">
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px]">Student Full Name:</span>
                  <span className="font-bold text-sm text-slate-900 uppercase">
                    {stu.firstName} {stu.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px]">Student ID / Reg No:</span>
                  <span className="font-bold text-slate-900 font-mono">{stu.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px]">Class & Section:</span>
                  <span className="font-bold text-slate-900">
                    {stu.classId} (Section {stu.section || 'A'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px]">Class Roll No:</span>
                  <span className="font-black text-base text-slate-900 font-mono">#{stu.rollNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px]">Father Name:</span>
                  <span className="font-medium text-slate-800">{stu.fatherName || 'Guardian'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px]">Admit Issue Date:</span>
                  <span className="font-medium text-slate-800">{formatDate(new Date().toISOString())}</span>
                </div>
              </div>

              {/* Student Photo Frame */}
              <div className="w-24 h-28 border-2 border-slate-800 rounded bg-white flex flex-col items-center justify-center p-1 text-center shrink-0">
                {stu.photo ? (
                  <img src={stu.photo} alt={stu.firstName} className="w-full h-full object-cover rounded" />
                ) : (
                  <div className="text-[10px] text-slate-500 font-bold uppercase">
                    Affix Photo Here
                  </div>
                )}
              </div>
            </div>

            {/* Subject Schedule Table */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Eligible Examination Subjects & Schedule
              </h4>
              <table className="w-full text-xs border border-slate-900 border-collapse">
                <thead>
                  <tr className="bg-slate-200 text-slate-900 border-b border-slate-900 text-left">
                    <th className="p-2 border-r border-slate-900 w-12 text-center">SL</th>
                    <th className="p-2 border-r border-slate-900">Subject Name</th>
                    <th className="p-2 border-r border-slate-900 w-28">Subject Code</th>
                    <th className="p-2 border-r border-slate-900 w-24 text-center">Max Marks</th>
                    <th className="p-2 border-r border-slate-900 w-32">Room No</th>
                    <th className="p-2 w-32 text-center">Invigilator Sign</th>
                  </tr>
                </thead>
                <tbody>
                  {(classSubjects.length > 0
                    ? classSubjects
                    : [
                        { id: '1', code: '101', name: 'Bangla 1st Paper', totalMarks: 100 },
                        { id: '2', code: '107', name: 'English 1st Paper', totalMarks: 100 },
                        { id: '3', code: '109', name: 'General Mathematics', totalMarks: 100 },
                        { id: '4', code: '127', name: 'General Science', totalMarks: 100 },
                        { id: '5', code: '154', name: 'Information & Comm. Technology', totalMarks: 50 },
                      ]
                  ).map((sub, i) => (
                    <tr key={sub.id} className="border-b border-slate-400">
                      <td className="p-2 border-r border-slate-900 text-center font-mono">{i + 1}</td>
                      <td className="p-2 border-r border-slate-900 font-semibold">{sub.name}</td>
                      <td className="p-2 border-r border-slate-900 font-mono">{sub.code || '10' + (i + 1)}</td>
                      <td className="p-2 border-r border-slate-900 text-center font-mono">{sub.totalMarks}</td>
                      <td className="p-2 border-r border-slate-900 text-slate-600">Room {100 + i + 1}</td>
                      <td className="p-2 border-r border-slate-900"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Examinee Guidelines */}
            <div className="mt-4 p-2.5 border border-slate-400 rounded text-[10px] text-slate-700 bg-slate-50 space-y-0.5">
              <p className="font-bold text-slate-900 uppercase">General Instructions to Candidate:</p>
              <p>1. The examinee must carry this Admit Card to every examination session and display it on desk.</p>
              <p>2. Examinees must enter the exam hall at least 15 minutes before exam commencement.</p>
              <p>3. Electronic gadgets, mobile phones, and unauthorized notes are strictly prohibited inside.</p>
              <p>4. Any violation of exam code will result in immediate disqualification of candidate.</p>
            </div>

            {/* Official Signatures */}
            <div className="mt-12 flex items-end justify-between text-xs px-2">
              <div className="text-center">
                <div className="w-36 border-b border-slate-800 mb-1"></div>
                <p className="font-bold text-slate-900">Class Teacher</p>
                <p className="text-[10px] text-slate-600">Signature</p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-500 uppercase font-bold mx-auto mb-1">
                  School Seal
                </div>
                <p className="text-[10px] text-slate-500">Official Stamp</p>
              </div>

              <div className="text-center">
                <div className="w-40 border-b border-slate-800 mb-1"></div>
                <p className="font-bold text-slate-900">{settings.principalName}</p>
                <p className="text-[10px] text-slate-600">Controller of Examinations / Principal</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* SCREEN UI: ADMIT CARD GENERATOR (100% NEUMORPHIC)             */}
      {/* ============================================================== */}

      {/* Header Banner */}
      <div className="neu-raised rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center neu-inset-sm shrink-0">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Exam Admit Card Generator</h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Generate & print official student exam admit cards with candidate photo, roll, and schedule
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintBatch}
          disabled={filteredStudents.length === 0}
          className="neu-btn-primary px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 self-stretch md:self-auto justify-center disabled:opacity-50"
        >
          <Printer className="w-4 h-4" />
          Print Batch ({filteredStudents.length} Cards)
        </button>
      </div>

      {/* Filter and Selector Card */}
      <div className="neu-raised rounded-3xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Select Exam */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              Examination
            </label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.academicYear})
                </option>
              ))}
            </select>
          </div>

          {/* Select Class */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              Target Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
        </div>

        {/* Student Search */}
        <div className="relative pt-2 border-t border-slate-200/60">
          <Search className="w-4 h-4 absolute left-3.5 top-[23px] text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name, roll number, or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl neu-input text-xs font-semibold placeholder-slate-400 outline-none"
          />
        </div>
      </div>

      {/* Student List & Admit Card Previews */}
      <div className="neu-raised rounded-3xl p-5 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">Eligible Students</span>
            <span className="neu-inset-sm px-2.5 py-0.5 rounded-xl text-xs font-extrabold text-blue-600">
              {filteredStudents.length}
            </span>
          </div>

          <span className="text-xs text-slate-500 font-semibold">
            {selectedClass} • {selectedExam?.name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-3">Roll</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Class & Sec</th>
                <th className="py-3 px-3">Father Name</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Admit Card Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-200/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-black text-slate-800 text-sm">
                    #{stu.rollNo}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {stu.photo ? (
                        <img
                          src={stu.photo}
                          alt={stu.firstName}
                          className="w-8 h-8 rounded-xl object-cover neu-inset-sm"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center neu-inset-sm text-xs">
                          {stu.firstName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {stu.firstName} {stu.lastName}
                        </span>
                        <span className="text-[10px] text-slate-500">{stu.phone || 'No phone'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 font-semibold">{stu.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">
                    {stu.classId} - {stu.section}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{stu.fatherName || 'Guardian'}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 neu-inset-sm px-2 py-0.5 rounded-lg">
                      <CheckCircle className="w-3 h-3" />
                      Eligible
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPreviewStudent(stu)}
                        className="neu-btn px-2.5 py-1.5 rounded-xl font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1"
                        title="Preview Admit Card"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </button>
                      <button
                        onClick={() => handlePrintSingle(stu)}
                        className="neu-btn px-2.5 py-1.5 rounded-xl font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        title="Print this Admit Card"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="neu-inset rounded-2xl p-10 text-center text-slate-500 my-4">
            <Users className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-60" />
            <p className="font-bold text-sm text-slate-700">No students found</p>
            <p className="text-xs text-slate-500 mt-0.5">Check class or section filters.</p>
          </div>
        )}
      </div>

      {/* Screen Preview Modal */}
      {previewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
          <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl w-full max-w-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPreviewStudent(null)}
              className="absolute top-5 right-5 p-2 rounded-2xl neu-btn text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Admit Card Preview
              </h3>

              <button
                onClick={() => handlePrintSingle(previewStudent)}
                className="mr-10 neu-btn-primary px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Admit Card
              </button>
            </div>

            {/* Tactile Card Preview Frame */}
            <div className="neu-inset rounded-3xl p-6 bg-white border border-slate-300 space-y-4 text-slate-900">
              <div className="text-center pb-3 border-b border-slate-300">
                <h4 className="text-lg font-black uppercase text-slate-900">{settings.schoolName}</h4>
                <p className="text-xs text-slate-600">{settings.subtitle}</p>
                <span className="inline-block mt-2 bg-slate-900 text-white font-bold text-xs px-4 py-1 rounded">
                  EXAMINATION ADMIT CARD - {selectedExam?.name}
                </span>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                {previewStudent.photo ? (
                  <img
                    src={previewStudent.photo}
                    alt={previewStudent.firstName}
                    className="w-16 h-20 object-cover rounded-xl border border-slate-300"
                  />
                ) : (
                  <div className="w-16 h-20 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500 text-center p-1">
                    PHOTO
                  </div>
                )}
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs flex-1">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Student Name:</span>
                    <strong className="text-slate-900">
                      {previewStudent.firstName} {previewStudent.lastName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Roll Number:</span>
                    <strong className="text-slate-900 font-mono">#{previewStudent.rollNo}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Class & Sec:</span>
                    <strong className="text-slate-900">
                      {previewStudent.classId} ({previewStudent.section})
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Student ID:</span>
                    <strong className="text-slate-900 font-mono">{previewStudent.id}</strong>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Registered Subjects ({classSubjects.length}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(classSubjects.length > 0 ? classSubjects : [{ name: 'English 1st' }, { name: 'Mathematics' }, { name: 'Bangla' }]).map(
                    (s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-100 border border-slate-300 px-2.5 py-1 rounded font-semibold text-slate-800"
                      >
                        {s.name}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-300 flex justify-between text-xs text-slate-600">
                <span>Class Teacher Sign</span>
                <span>Controller of Exams</span>
                <span className="font-bold text-slate-800">{settings.principalName}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
