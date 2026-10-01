export type UserRole = 'admin' | 'teacher' | 'accountant' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export type Gender = 'Male' | 'Female' | 'Other';
export type StudentStatus = 'Active' | 'Inactive' | 'Graduated' | 'Transferred';

export interface Student {
  id: string; // e.g. "STU-00001"
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string; // YYYY-MM-DD
  bloodGroup?: string;
  religion?: string;
  nationality?: string;
  birthCertificateNo?: string;
  photo?: string;
  admissionDate: string;
  classId: string; // e.g. "Class 10"
  section: string; // e.g. "A"
  rollNo: string;
  phone?: string;
  email?: string;
  address?: string;

  // Guardian info
  fatherName?: string;
  fatherPhone?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherPhone?: string;
  motherOccupation?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;

  // Emergency contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;

  // Previous school
  prevSchoolName?: string;
  prevClass?: string;
  tcNumber?: string;

  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export type AdmissionStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Admission {
  id: string; // e.g. "ADM-0001"
  applicantName: string;
  photo?: string;
  dob: string;
  age?: string;
  admissionDate: string;
  gender: Gender;
  applyingClass: string;
  applyingSection?: string;
  fatherName?: string;
  motherName?: string;
  guardianName: string;
  phone: string;
  email?: string;
  address?: string;
  previousSchool?: string;
  applicationDate: string;
  status: AdmissionStatus;
  notes?: string;
  convertedStudentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g. "Class 10"
  numericOrder: number;
  sections: string[]; // ["A", "B"]
  capacity: number;
  classTeacherId?: string;
  classTeacherName?: string;
  roomNumber?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  section: string;
  rollNo: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  markedBy?: string;
  createdAt: string;
}

export type TeacherStatus = 'Active' | 'On Leave' | 'Resigned';

export interface Teacher {
  id: string; // e.g. "TCH-001"
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string;
  phone: string;
  email: string;
  address: string;
  qualification: string;
  joiningDate: string;
  designation: string;
  department: string;
  salary: number;
  status: TeacherStatus;
  assignedSubjects: string[];
  assignedClasses: string[];
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  classId: string;
  teacherName?: string;
  totalMarks: number;
  passMarks: number;
}

export interface FeeCategory {
  id: string;
  name: string;
  defaultAmount: number;
  description?: string;
}

export type PaymentMethod = 'Cash' | 'Bank' | 'Mobile Banking' | 'Other';
export type InvoiceStatus = 'Paid' | 'Partial' | 'Due';

export interface FeeInvoice {
  id: string; // e.g. "INV-1001"
  invoiceNo: string;
  studentId: string;
  studentName: string;
  classId: string;
  section: string;
  feeType: string;
  amount: number;
  discount: number;
  paidAmount: number;
  dueAmount: number;
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  invoiceId: string;
  invoiceNo?: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionRef?: string;
  receivedBy?: string;
  collectedBy?: string;
  notes?: string;
  createdAt: string;
}

export type ExamType = 'First Term' | 'Mid Term' | 'Final' | 'Model Test' | 'Other';

export interface Exam {
  id: string;
  name: string;
  examType: ExamType;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface SubjectMarkEntry {
  subjectId: string;
  subjectName: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
  gradePoint: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  classId: string;
  section: string;
  rollNo: string;
  subjectMarks: SubjectMarkEntry[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  gpa: number;
  grade: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GradingRule {
  grade: string;
  minMarks: number;
  maxMarks: number;
  gradePoint: number;
  remarks: string;
}

export interface SchoolSettings {
  schoolName: string;
  subtitle: string;
  logoText: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  eiinCode: string;
  currency: string;
  currencyCode: string;
  academicYear: string;
  currentSession: string;
}

export type NoticeCategory = 'All' | 'Students' | 'Teachers' | 'Parents';
export type NoticePriority = 'Normal' | 'Urgent' | 'Holiday';

export interface Notice {
  id: string;
  title: string;
  category: NoticeCategory;
  priority: NoticePriority;
  content: string;
  publishDate: string;
  author: string;
  createdAt: string;
}

export type DayOfWeek = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';

export interface ClassRoutineSlot {
  id: string;
  classId: string;
  section: string;
  day: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  roomNumber: string;
}

export type Language = 'en' | 'bn';

export interface Homework {
  id: string;
  title: string;
  classId: string;
  section?: string;
  subjectName: string;
  assignedTeacher: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  submissionCount?: number;
  status: 'Active' | 'Completed' | 'Overdue';
  createdAt: string;
}

export type CertificateType =
  | 'Testimonial'
  | 'Character Certificate'
  | 'Transfer Certificate'
  | 'Appreciation Certificate';

export interface StudentCertificate {
  id: string;
  certificateNo: string;
  certificateType: CertificateType;
  studentId: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  classId: string;
  section: string;
  rollNo: string;
  session: string;
  gpa?: string;
  conduct: string;
  issueDate: string;
  issuedBy: string;
  remarks?: string;
  createdAt: string;
}

export interface SmsLog {
  id: string;
  recipientType: 'All Parents' | 'Class' | 'Single Student' | 'Teachers';
  targetClass?: string;
  recipientName?: string;
  recipientPhone: string;
  message: string;
  sentAt: string;
  status: 'Delivered' | 'Pending' | 'Failed';
  smsCount: number;
}
