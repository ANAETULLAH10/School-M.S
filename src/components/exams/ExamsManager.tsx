import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Printer,
  Download,
  Calendar,
  Award,
  BookOpen,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle,
} from 'lucide-react';
import {
  Exam,
  ExamResult,
  Subject,
  SchoolClass,
  Student,
  SchoolSettings,
  ExamType,
  SubjectMarkEntry,
} from '../../types';
import { formatDate, exportToCSV } from '../../services/exportUtils';
import { calculateGradeFromMarks } from '../../services/storage';
import { useToast } from '../../context/ToastContext';
import { MarksheetModal } from './MarksheetModal';

interface ExamsManagerProps {
  exams: Exam[];
  results: ExamResult[];
  subjects: Subject[];
  classes: SchoolClass[];
  students: Student[];
  settings: SchoolSettings;
  onSaveExam: (exam: Exam) => void;
  onSaveSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onSaveResult: (result: Omit<ExamResult, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const ExamsManager: React.FC<ExamsManagerProps> = ({
  exams,
  results,
  subjects,
  classes,
  students,
  settings,
  onSaveExam,
  onSaveSubject,
  onDeleteSubject,
  onSaveResult,
}) => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'results' | 'entry' | 'exams' | 'subjects'>('results');
  const [selectedResultForPrint, setSelectedResultForPrint] = useState<ExamResult | null>(null);

  // Modals
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

  // New Exam Form
  const [examName, setExamName] = useState('');
  const [examType, setExamType] = useState<ExamType>('First Term');
  const [examStartDate, setExamStartDate] = useState('2026-05-10');
  const [examEndDate, setExamEndDate] = useState('2026-05-25');

  // New Subject Form
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectClass, setSubjectClass] = useState(classes[0]?.name || 'Class 10');
  const [subjectTotalMarks, setSubjectTotalMarks] = useState<number>(100);
  const [subjectPassMarks, setSubjectPassMarks] = useState<number>(33);

  // Result Entry Form State
  const [entryExamId, setEntryExamId] = useState(exams[0]?.id || '');
  const [entryClass, setEntryClass] = useState(classes[0]?.name || 'Class 10');
  const [entryStudentId, setEntryStudentId] = useState('');
  const [marksInput, setMarksInput] = useState<Record<string, number>>({});
  const [resultRemarks, setResultRemarks] = useState('Good effort, keep it up.');

  // Students in entry class
  const classStudents = students.filter((s) => s.classId === entryClass);
  // Subjects for entry class
  const classSubjects = subjects.filter((s) => s.classId === entryClass);

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim()) {
      toast.error('Exam name is required');
      return;
    }

    const newExam: Exam = {
      id: `EXAM-${Date.now()}`,
      name: examName.trim(),
      examType,
      academicYear: settings.academicYear,
      startDate: examStartDate,
      endDate: examEndDate,
      status: 'Upcoming',
    };

    onSaveExam(newExam);
    toast.success('Exam created successfully');
    setShowAddExamModal(false);
    setExamName('');
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim() || !subjectCode.trim()) {
      toast.error('Subject name and code are required');
      return;
    }

    const newSub: Subject = {
      id: `SUB-${Date.now()}`,
      code: subjectCode.trim().toUpperCase(),
      name: subjectName.trim(),
      classId: subjectClass,
      totalMarks: Number(subjectTotalMarks) || 100,
      passMarks: Number(subjectPassMarks) || 33,
    };

    onSaveSubject(newSub);
    toast.success(`Subject ${newSub.name} added`);
    setShowAddSubjectModal(false);
    setSubjectName('');
    setSubjectCode('');
  };

  const handlePublishResult = (e: React.FormEvent) => {
    e.preventDefault();
    const targetExam = exams.find((x) => x.id === entryExamId);
    const targetStudent = students.find((s) => s.id === entryStudentId);

    if (!targetExam || !targetStudent) {
      toast.error('Please select both an Exam and a Student');
      return;
    }

    if (classSubjects.length === 0) {
      toast.error(`No subjects defined for ${entryClass}. Add subjects first.`);
      return;
    }

    const subjectMarks: SubjectMarkEntry[] = classSubjects.map((sub) => {
      const marks = marksInput[sub.id] ?? 80;
      const { grade, gradePoint } = calculateGradeFromMarks(marks, sub.totalMarks);
      return {
        subjectId: sub.id,
        subjectName: sub.name,
        totalMarks: sub.totalMarks,
        obtainedMarks: marks,
        grade,
        gradePoint,
      };
    });

    const grandTotalMarks = subjectMarks.reduce((acc, m) => acc + m.totalMarks, 0);
    const grandObtainedMarks = subjectMarks.reduce((acc, m) => acc + m.obtainedMarks, 0);
    const percentage = grandTotalMarks > 0 ? (grandObtainedMarks / grandTotalMarks) * 100 : 0;
    const avgGPA =
      subjectMarks.length > 0
        ? subjectMarks.reduce((acc, m) => acc + m.gradePoint, 0) / subjectMarks.length
        : 0;
    const gpa = Math.min(5.0, Math.round(avgGPA * 100) / 100);
    const { grade: finalGrade } = calculateGradeFromMarks(percentage, 100);

    onSaveResult({
      examId: targetExam.id,
      examName: targetExam.name,
      studentId: targetStudent.id,
      studentName: `${targetStudent.firstName} ${targetStudent.lastName}`,
      classId: targetStudent.classId,
      section: targetStudent.section,
      rollNo: targetStudent.rollNo,
      subjectMarks,
      totalMarks: grandTotalMarks,
      obtainedMarks: grandObtainedMarks,
      percentage,
      gpa,
      grade: finalGrade,
      remarks: resultRemarks,
    });

    toast.success(`Result published for ${targetStudent.firstName} (GPA: ${gpa.toFixed(2)})`);
    setActiveTab('results');
  };

  const handleExportCSV = () => {
    const headers = [
      'Student ID',
      'Student Name',
      'Class',
      'Section',
      'Roll',
      'Exam',
      'Total Marks',
      'Obtained Marks',
      'Percentage',
      'GPA',
      'Grade',
    ];
    const rows = results.map((r) => [
      r.studentId,
      r.studentName,
      r.classId,
      r.section,
      r.rollNo,
      r.examName,
      r.totalMarks,
      r.obtainedMarks,
      `${r.percentage.toFixed(1)}%`,
      r.gpa.toFixed(2),
      r.grade,
    ]);
    exportToCSV('Exam_Results_Directory_MH_School', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Exams & Results</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Schedule academic exams, record subject-wise marks, compute GPAs, and generate official marksheets
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="neu-btn inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-2xl"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Results</span>
          </button>

          <button
            onClick={() => setShowAddExamModal(true)}
            className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Exam</span>
          </button>
        </div>
      </div>

      {/* Tactile Navigation Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'results', label: `Published Results (${results.length})` },
          { id: 'entry', label: 'Marks Entry Form' },
          { id: 'exams', label: `Exam Schedules (${exams.length})` },
          { id: 'subjects', label: `Subjects (${subjects.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap text-xs font-bold ${
              activeTab === tab.id
                ? 'neu-inset text-blue-700 font-black'
                : 'neu-btn text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Results Directory */}
      {activeTab === 'results' && (
        <div className="neu-raised rounded-3xl overflow-hidden p-2">
          <div className="overflow-x-auto">
            {results.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs font-semibold">
                No exam results published yet. Click "Marks Entry Form" to enter student marks.
              </div>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200/50">
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Exam</th>
                    <th className="py-3 px-4">Total Marks</th>
                    <th className="py-3 px-4">Obtained</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">GPA</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4 text-right">Marksheet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/30">
                  {results.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-200/20 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {res.studentId}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {res.studentName}
                        <span className="text-[11px] text-slate-400 block font-normal">Roll: {res.rollNo}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {res.classId} ({res.section})
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {res.examName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {res.totalMarks}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                        {res.obtainedMarks}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                        {res.percentage.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="neu-inset-sm px-2.5 py-1 rounded-xl font-black text-blue-700 font-mono text-xs">
                          {res.gpa.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`neu-inset-sm px-3 py-1 rounded-full font-black text-xs ${
                            res.grade.startsWith('A')
                              ? 'text-emerald-700'
                              : res.grade === 'B' || res.grade === 'C'
                              ? 'text-blue-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {res.grade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedResultForPrint(res)}
                          className="neu-btn px-3 py-1.5 text-xs font-bold text-blue-700 rounded-xl inline-flex items-center gap-1.5"
                          title="Generate Marksheet"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Marksheet</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Result Entry Form */}
      {activeTab === 'entry' && (
        <div className="neu-raised rounded-3xl p-6">
          <div className="mb-5">
            <h3 className="font-black text-slate-800 text-base">Enter Student Marks</h3>
            <p className="text-xs text-slate-500">Record individual subject scores for instant GPA and grade calculation</p>
          </div>

          <form onSubmit={handlePublishResult} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Exam</label>
                <select
                  value={entryExamId}
                  onChange={(e) => setEntryExamId(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-bold"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
                <select
                  value={entryClass}
                  onChange={(e) => {
                    setEntryClass(e.target.value);
                    setEntryStudentId('');
                  }}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-semibold"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.name}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student</label>
                <select
                  value={entryStudentId}
                  onChange={(e) => setEntryStudentId(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-bold"
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {classStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} (Roll: {st.rollNo} - {st.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subjects Marks Entry Grid */}
            <div className="pt-2">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
                Subject Marks Entry ({classSubjects.length} subjects found for {entryClass})
              </h4>

              {classSubjects.length === 0 ? (
                <div className="neu-inset rounded-2xl p-6 text-center text-xs text-slate-500 font-semibold">
                  No subjects registered for {entryClass}. Please add subjects in the "Subjects" tab first.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {classSubjects.map((sub) => {
                    const currentVal = marksInput[sub.id] ?? 80;
                    const { grade, gradePoint } = calculateGradeFromMarks(currentVal, sub.totalMarks);

                    return (
                      <div key={sub.id} className="neu-inset rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">{sub.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Code: {sub.code}</span>
                          </div>
                          <span className="neu-raised-sm px-2 py-0.5 rounded-lg text-[10px] font-mono text-slate-600">
                            Max: {sub.totalMarks}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={sub.totalMarks}
                            value={currentVal}
                            onChange={(e) =>
                              setMarksInput({
                                ...marksInput,
                                [sub.id]: Number(e.target.value),
                              })
                            }
                            className="neu-input w-24 px-3 py-1.5 text-sm font-mono font-black text-blue-700 rounded-xl"
                          />
                          <div className="text-[11px] font-bold text-slate-600">
                            Grade: <span className="text-emerald-700 font-black">{grade}</span> ({gradePoint.toFixed(1)})
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teacher's Remarks / Appraisal
              </label>
              <input
                type="text"
                value={resultRemarks}
                onChange={(e) => setResultRemarks(e.target.value)}
                className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={classSubjects.length === 0}
                className="neu-btn-primary px-6 py-2.5 text-xs font-bold rounded-2xl inline-flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Calculate & Publish Result</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Exams Schedule */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((ex) => (
            <div key={ex.id} className="neu-raised rounded-3xl p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-slate-800 text-base leading-tight">{ex.name}</h4>
                  <span className="text-xs text-blue-700 font-semibold">{ex.examType}</span>
                </div>
                <span className="neu-inset-sm text-xs font-bold px-2.5 py-0.5 rounded-xl text-slate-600 font-mono">
                  {ex.academicYear}
                </span>
              </div>

              <div className="neu-inset-sm rounded-2xl p-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Start Date:</span>
                  <span className="font-bold text-slate-800">{formatDate(ex.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">End Date:</span>
                  <span className="font-bold text-slate-800">{formatDate(ex.endDate)}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span className="neu-inset-sm px-3 py-1 rounded-xl text-[11px] font-bold text-emerald-700">
                  {ex.status}
                </span>
                <button
                  onClick={() => {
                    setEntryExamId(ex.id);
                    setActiveTab('entry');
                  }}
                  className="neu-btn px-3 py-1 text-xs font-bold text-blue-700 rounded-xl"
                >
                  Enter Marks
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Subjects Directory */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500">
              Total {subjects.length} academic courses configured
            </span>
            <button
              onClick={() => setShowAddSubjectModal(true)}
              className="neu-btn-primary px-3.5 py-1.5 text-xs font-bold rounded-2xl inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Subject</span>
            </button>
          </div>

          <div className="neu-raised rounded-3xl overflow-hidden p-2">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-slate-500 font-bold border-b border-slate-200/50 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Full Marks</th>
                  <th className="py-3 px-4">Pass Marks</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30">
                {subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-200/20">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{sub.code}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{sub.name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{sub.classId}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{sub.totalMarks}</td>
                    <td className="py-3 px-4 font-mono text-emerald-700 font-bold">{sub.passMarks}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteSubject(sub.id)}
                        className="neu-btn p-1.5 text-slate-500 hover:text-rose-600 rounded-xl"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: New Exam */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-md w-full p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
              <h3 className="font-black text-slate-800 text-base">Schedule New Examination</h3>
              <button
                onClick={() => setShowAddExamModal(false)}
                className="neu-btn p-1.5 rounded-xl text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Exam Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid Term Examination 2026"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Exam Type
                </label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as ExamType)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-semibold"
                >
                  <option value="First Term">First Term</option>
                  <option value="Mid Term">Mid Term</option>
                  <option value="Final Exam">Final Exam</option>
                  <option value="Model Test">Model Test</option>
                  <option value="Class Test">Class Test</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={examStartDate}
                    onChange={(e) => setExamStartDate(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={examEndDate}
                    onChange={(e) => setExamEndDate(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="neu-btn px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary px-5 py-2 text-xs font-bold rounded-xl"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Subject */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-md w-full p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
              <h3 className="font-black text-slate-800 text-base">Add Academic Subject</h3>
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="neu-btn p-1.5 rounded-xl text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Higher Mathematics"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HM-101"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={subjectClass}
                    onChange={(e) => setSubjectClass(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-semibold"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Marks</label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={subjectTotalMarks}
                    onChange={(e) => setSubjectTotalMarks(Number(e.target.value))}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pass Marks</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={subjectPassMarks}
                    onChange={(e) => setSubjectPassMarks(Number(e.target.value))}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="neu-btn px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary px-5 py-2 text-xs font-bold rounded-xl"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Marksheet Modal */}
      {selectedResultForPrint && (
        <MarksheetModal
          result={selectedResultForPrint}
          settings={settings}
          onClose={() => setSelectedResultForPrint(null)}
        />
      )}
    </div>
  );
};
