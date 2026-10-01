import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  CalendarDays,
  BookCheck,
  BellRing,
  Award,
  MessageSquare,
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginPage } from './components/auth/LoginPage';

// Dashboard components
import { SummaryCards } from './components/dashboard/SummaryCards';
import { RecentStudentsTable } from './components/dashboard/RecentStudentsTable';
import { DashboardCharts } from './components/dashboard/DashboardCharts';

// Module components
import { StudentsList } from './components/students/StudentsList';
import { StudentFormModal } from './components/students/StudentFormModal';
import { StudentProfileModal } from './components/students/StudentProfileModal';
import { StudentIDCardModal } from './components/students/StudentIDCardModal';
import { AdmissionManager } from './components/admission/AdmissionManager';
import { ClassesManager } from './components/classes/ClassesManager';
import { AttendanceManager } from './components/attendance/AttendanceManager';
import { FeesManager } from './components/fees/FeesManager';
import { ExamsManager } from './components/exams/ExamsManager';
import { TeachersManager } from './components/teachers/TeachersManager';
import { ReportsManager } from './components/reports/ReportsManager';
import { SettingsManager } from './components/settings/SettingsManager';
import { NoticeBoardManager } from './components/notices/NoticeBoardManager';
import { AdmitCardManager } from './components/admitcard/AdmitCardManager';
import { RoutineManager } from './components/routine/RoutineManager';
import { HomeworkManager } from './components/homework/HomeworkManager';
import { CertificateManager } from './components/certificates/CertificateManager';
import { SmsBroadcastManager } from './components/sms/SmsBroadcastManager';

// Storage services
import {
  getStudents,
  saveStudent,
  updateStudent,
  deleteStudent,
  getClasses,
  saveClass,
  deleteClass,
  getTeachers,
  saveTeacher,
  updateTeacher,
  deleteTeacher,
  getAdmissions,
  saveAdmission,
  updateAdmission,
  deleteAdmission,
  getAttendance,
  saveAttendanceRecords,
  getInvoices,
  saveInvoice,
  deleteInvoice,
  getPayments,
  savePayment,
  getExams,
  saveExam,
  getSubjects,
  saveSubject,
  deleteSubject,
  getResults,
  saveResult,
  getSettings,
  saveSettings,
  getGradingRules,
  saveGradingRules,
  resetToDemoData,
  getDashboardMetrics,
  subscribeToStorage,
  getNotices,
  saveNotice,
  deleteNotice,
  getRoutine,
  saveRoutineSlot,
  deleteRoutineSlot,
  getHomework,
  saveHomework,
  updateHomeworkStatus,
  deleteHomework,
  getCertificates,
  saveCertificate,
  deleteCertificate,
  getSmsLogs,
  saveSmsLog,
  clearSmsLogs,
} from './services/storage';

import {
  Student,
  SchoolClass,
  Teacher,
  Admission,
  AttendanceRecord,
  FeeInvoice,
  FeePayment,
  Exam,
  Subject,
  ExamResult,
  SchoolSettings,
  GradingRule,
  AdmissionStatus,
  Notice,
  ClassRoutineSlot,
  Homework,
  StudentCertificate,
  SmsLog,
} from './types';

function MainApp() {
  const { isAuthenticated, canAccess } = useAuth();
  const toast = useToast();

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Persistent App State
  const [students, setStudents] = useState<Student[]>(() => getStudents());
  const [classes, setClasses] = useState<SchoolClass[]>(() => getClasses());
  const [teachers, setTeachers] = useState<Teacher[]>(() => getTeachers());
  const [admissions, setAdmissions] = useState<Admission[]>(() => getAdmissions());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => getAttendance());
  const [invoices, setInvoices] = useState<FeeInvoice[]>(() => getInvoices());
  const [payments, setPayments] = useState<FeePayment[]>(() => getPayments());
  const [exams, setExams] = useState<Exam[]>(() => getExams());
  const [subjects, setSubjects] = useState<Subject[]>(() => getSubjects());
  const [results, setResults] = useState<ExamResult[]>(() => getResults());
  const [settings, setSettings] = useState<SchoolSettings>(() => getSettings());
  const [gradingRules, setGradingRules] = useState<GradingRule[]>(() => getGradingRules());
  const [notices, setNotices] = useState<Notice[]>(() => getNotices());
  const [routine, setRoutine] = useState<ClassRoutineSlot[]>(() => getRoutine());
  const [homework, setHomework] = useState<Homework[]>(() => getHomework());
  const [certificates, setCertificates] = useState<StudentCertificate[]>(() => getCertificates());
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>(() => getSmsLogs());

  // Reload data from local repository
  const reloadData = useCallback(() => {
    setStudents(getStudents());
    setClasses(getClasses());
    setTeachers(getTeachers());
    setAdmissions(getAdmissions());
    setAttendance(getAttendance());
    setInvoices(getInvoices());
    setPayments(getPayments());
    setExams(getExams());
    setSubjects(getSubjects());
    setResults(getResults());
    setSettings(getSettings());
    setGradingRules(getGradingRules());
    setNotices(getNotices());
    setRoutine(getRoutine());
    setHomework(getHomework());
    setCertificates(getCertificates());
    setSmsLogs(getSmsLogs());
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToStorage(reloadData);
    return () => unsubscribe();
  }, [reloadData]);

  // Modals state for Students
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [printingIDCardStudent, setPrintingIDCardStudent] = useState<Student | null>(null);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Dashboard Metrics
  const metrics = getDashboardMetrics();

  // Tab Titles
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Overview' };
      case 'students':
        return { title: 'Students', subtitle: 'Manage all students in your school' };
      case 'admission':
        return { title: 'Admission', subtitle: 'Manage admission applications and enrolments' };
      case 'classes':
        return { title: 'Classes', subtitle: 'Manage classes, sections, and room capacity' };
      case 'attendance':
        return { title: 'Attendance', subtitle: 'Track and record student daily attendance' };
      case 'fees':
        return { title: 'Fees & Billing', subtitle: 'Billing invoices, collections, and money receipts' };
      case 'exams':
        return { title: 'Exams & Results', subtitle: 'Examinations schedule, marks entry, and marksheet' };
      case 'admitcard':
        return { title: 'Admit Card Generator', subtitle: 'Official candidate exam admit cards with photo & schedule' };
      case 'routine':
        return { title: 'Class Routine', subtitle: 'Weekly class schedule and teacher lecture timetable' };
      case 'homework':
        return { title: 'Homework & Tasks', subtitle: 'Assign student tasks, exercises, and submission deadlines' };
      case 'notices':
        return { title: 'Notice Board', subtitle: 'Official announcements and institutional bulletins' };
      case 'certificates':
        return { title: 'Student Certificates', subtitle: 'Testimonials, Character Certificates, and Transfer Certificates' };
      case 'sms':
        return { title: 'SMS Broadcast', subtitle: 'Instant parent notification alerts and communication logs' };
      case 'teachers':
        return { title: 'Teachers', subtitle: 'Faculty directory and subject assignments' };
      case 'reports':
        return { title: 'Reports', subtitle: 'Comprehensive institutional reports and data exports' };
      case 'settings':
        return { title: 'Settings', subtitle: 'School information, academic session, and grading scale' };
    }
  };

  const { title, subtitle } = getTabTitle(currentTab);

  // Student CRUD
  const handleSaveStudent = (studentData: Student) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, studentData);
      toast.success(`Student ${studentData.firstName} ${studentData.lastName} updated`);
    } else {
      saveStudent(studentData);
      toast.success(`Student ${studentData.firstName} ${studentData.lastName} registered`);
    }
    setShowAddStudentModal(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (stu: Student) => {
    if (confirm(`Are you sure you want to delete ${stu.firstName} ${stu.lastName} (${stu.id})?`)) {
      deleteStudent(stu.id);
      toast.success(`Deleted ${stu.firstName} ${stu.lastName}`);
    }
  };

  // Convert approved admission application to registered student
  const handleConvertAdmissionToStudent = (adm: Admission) => {
    const names = adm.applicantName.split(' ');
    const firstName = names[0] || 'Student';
    const lastName = names.slice(1).join(' ') || 'Candidate';

    const newStu = saveStudent({
      firstName,
      lastName,
      photo: adm.photo,
      gender: adm.gender,
      dob: adm.dob,
      classId: adm.applyingClass,
      section: adm.applyingSection || 'A',
      rollNo: String(students.filter((s) => s.classId === adm.applyingClass).length + 1).padStart(2, '0'),
      admissionDate: adm.admissionDate || new Date().toISOString().split('T')[0],
      fatherName: adm.fatherName,
      motherName: adm.motherName,
      fatherPhone: adm.phone,
      guardianName: adm.guardianName || adm.fatherName || 'Guardian',
      guardianPhone: adm.phone,
      phone: adm.phone,
      email: adm.email,
      address: adm.address,
      prevSchoolName: adm.previousSchool,
      status: 'Active',
    });

    updateAdmission(adm.id, {
      status: 'Approved',
      convertedStudentId: newStu.id,
    });

    toast.success(`Converted ${adm.applicantName} to Student ${newStu.id}`);
  };

  return (
    <div className="min-h-screen bg-[#ebf0f7] flex text-slate-900">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        schoolName={settings.schoolName}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <Header
          title={title}
          subtitle={subtitle}
          onOpenMobile={() => setMobileSidebarOpen(true)}
        />

        {/* Content Body */}
        <main className="flex-1 p-5 sm:p-7 max-w-7xl w-full mx-auto">
          {/* TAB: Dashboard */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Six summary cards */}
              <SummaryCards
                metrics={metrics}
                onNavigate={(tab) => setCurrentTab(tab as NavTab)}
              />

              {/* Institutional Quick Hub & Operations Bar */}
              <div className="neu-raised rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                    Institutional Quick Hub & Tools
                  </h3>
                  <span className="text-[11px] font-bold text-blue-600">Soft UI Shortcuts</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <button
                    onClick={() => setCurrentTab('admitcard')}
                    className="neu-flat hover:neu-raised active:neu-inset-sm p-3.5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer group"
                  >
                    <div className="neu-inset-sm p-2 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Admit Cards</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('routine')}
                    className="neu-flat hover:neu-raised active:neu-inset-sm p-3.5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer group"
                  >
                    <div className="neu-inset-sm p-2 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Class Routine</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('homework')}
                    className="neu-flat hover:neu-raised active:neu-inset-sm p-3.5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer group"
                  >
                    <div className="neu-inset-sm p-2 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
                      <BookCheck className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Homework</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('notices')}
                    className="neu-flat hover:neu-raised active:neu-inset-sm p-3.5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer group"
                  >
                    <div className="neu-inset-sm p-2 rounded-xl text-rose-600 group-hover:scale-110 transition-transform">
                      <BellRing className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Notice Board</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('certificates')}
                    className="neu-flat hover:neu-raised active:neu-inset-sm p-3.5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer group"
                  >
                    <div className="neu-inset-sm p-2 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Certificates</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('sms')}
                    className="neu-flat hover:neu-raised active:neu-inset-sm p-3.5 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer group"
                  >
                    <div className="neu-inset-sm p-2 rounded-xl text-teal-600 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">SMS Broadcast</span>
                  </button>
                </div>
              </div>

              {/* Recent Students Table */}
              <RecentStudentsTable
                students={students}
                onViewStudent={(stu) => setViewingStudent(stu)}
                onEditStudent={(stu) => {
                  setEditingStudent(stu);
                  setShowAddStudentModal(true);
                }}
                onDeleteStudent={handleDeleteStudent}
                onViewAll={() => setCurrentTab('students')}
                onAddStudent={() => {
                  setEditingStudent(null);
                  setShowAddStudentModal(true);
                }}
              />

              {/* Dashboard Analytics Charts */}
              <DashboardCharts
                students={students}
                classes={classes}
                invoices={invoices}
                attendance={attendance}
              />
            </div>
          )}

          {/* TAB: Students */}
          {currentTab === 'students' && (
            <StudentsList
              students={students}
              classes={classes}
              onAddStudent={() => {
                setEditingStudent(null);
                setShowAddStudentModal(true);
              }}
              onViewStudent={(stu) => setViewingStudent(stu)}
              onEditStudent={(stu) => {
                setEditingStudent(stu);
                setShowAddStudentModal(true);
              }}
              onDeleteStudent={handleDeleteStudent}
              onPrintIDCard={(stu) => setPrintingIDCardStudent(stu)}
            />
          )}

          {/* TAB: Admission */}
          {currentTab === 'admission' && (
            <AdmissionManager
              admissions={admissions}
              classes={classes}
              onSaveAdmission={saveAdmission}
              onUpdateStatus={(id, status) => updateAdmission(id, { status })}
              onConvertToStudent={handleConvertAdmissionToStudent}
              onDeleteAdmission={deleteAdmission}
            />
          )}

          {/* TAB: Classes */}
          {currentTab === 'classes' && (
            <ClassesManager
              classes={classes}
              students={students}
              teachers={teachers}
              onSaveClass={saveClass}
              onDeleteClass={deleteClass}
              onViewClassStudents={(className) => {
                setCurrentTab('students');
              }}
            />
          )}

          {/* TAB: Attendance */}
          {currentTab === 'attendance' && (
            <AttendanceManager
              students={students}
              classes={classes}
              attendance={attendance}
              onSaveAttendance={saveAttendanceRecords}
            />
          )}

          {/* TAB: Fees */}
          {currentTab === 'fees' && (
            <FeesManager
              invoices={invoices}
              payments={payments}
              students={students}
              classes={classes}
              settings={settings}
              onSaveInvoice={saveInvoice}
              onRecordPayment={savePayment}
              onDeleteInvoice={deleteInvoice}
            />
          )}

          {/* TAB: Exams & Results */}
          {currentTab === 'exams' && (
            <ExamsManager
              exams={exams}
              results={results}
              subjects={subjects}
              classes={classes}
              students={students}
              settings={settings}
              onSaveExam={saveExam}
              onSaveSubject={saveSubject}
              onDeleteSubject={deleteSubject}
              onSaveResult={saveResult}
            />
          )}

          {/* TAB: Admit Card Generator */}
          {currentTab === 'admitcard' && (
            <AdmitCardManager
              students={students}
              classes={classes}
              exams={exams}
              subjects={subjects}
              settings={settings}
            />
          )}

          {/* TAB: Class Routine */}
          {currentTab === 'routine' && (
            <RoutineManager
              routine={routine}
              classes={classes}
              teachers={teachers}
              subjects={subjects}
              settings={settings}
              onSaveSlot={saveRoutineSlot}
              onDeleteSlot={deleteRoutineSlot}
            />
          )}

          {/* TAB: Homework & Assignments */}
          {currentTab === 'homework' && (
            <HomeworkManager
              homeworkList={homework}
              classes={classes}
              teachers={teachers}
              subjects={subjects}
              onSaveHomework={saveHomework}
              onUpdateStatus={updateHomeworkStatus}
              onDeleteHomework={deleteHomework}
            />
          )}

          {/* TAB: Notice Board */}
          {currentTab === 'notices' && (
            <NoticeBoardManager
              notices={notices}
              settings={settings}
              onSaveNotice={saveNotice}
              onDeleteNotice={deleteNotice}
            />
          )}

          {/* TAB: Student Certificates */}
          {currentTab === 'certificates' && (
            <CertificateManager
              certificates={certificates}
              students={students}
              settings={settings}
              onSaveCertificate={saveCertificate}
              onDeleteCertificate={deleteCertificate}
            />
          )}

          {/* TAB: SMS Broadcast */}
          {currentTab === 'sms' && (
            <SmsBroadcastManager
              smsLogs={smsLogs}
              students={students}
              classes={classes}
              teachers={teachers}
              settings={settings}
              onSendSms={saveSmsLog}
              onClearLogs={clearSmsLogs}
            />
          )}

          {/* TAB: Teachers */}
          {currentTab === 'teachers' && (
            <TeachersManager
              teachers={teachers}
              classes={classes}
              subjects={subjects}
              onSaveTeacher={saveTeacher}
              onUpdateTeacher={updateTeacher}
              onDeleteTeacher={deleteTeacher}
            />
          )}

          {/* TAB: Reports */}
          {currentTab === 'reports' && (
            <ReportsManager
              students={students}
              admissions={admissions}
              attendance={attendance}
              invoices={invoices}
              results={results}
              teachers={teachers}
              classes={classes}
              settings={settings}
            />
          )}

          {/* TAB: Settings */}
          {currentTab === 'settings' && (
            <SettingsManager
              settings={settings}
              gradingRules={gradingRules}
              onSaveSettings={saveSettings}
              onSaveGrading={saveGradingRules}
              onResetDemoData={resetToDemoData}
            />
          )}
        </main>
      </div>

      {/* Student Form Modal (Add / Edit) */}
      {showAddStudentModal && (
        <StudentFormModal
          initialData={editingStudent}
          classes={classes}
          onClose={() => {
            setShowAddStudentModal(false);
            setEditingStudent(null);
          }}
          onSave={handleSaveStudent}
        />
      )}

      {/* Student Profile Modal */}
      {viewingStudent && (
        <StudentProfileModal
          student={viewingStudent}
          settings={settings}
          attendance={attendance}
          invoices={invoices}
          results={results}
          onClose={() => setViewingStudent(null)}
          onEdit={(stu) => {
            setViewingStudent(null);
            setEditingStudent(stu);
            setShowAddStudentModal(true);
          }}
          onPrintIDCard={(stu) => {
            setViewingStudent(null);
            setPrintingIDCardStudent(stu);
          }}
        />
      )}

      {/* Student ID Card Modal */}
      {printingIDCardStudent && (
        <StudentIDCardModal
          student={printingIDCardStudent}
          settings={settings}
          onClose={() => setPrintingIDCardStudent(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
