import {
  Student,
  Admission,
  SchoolClass,
  Teacher,
  Subject,
  AttendanceRecord,
  FeeInvoice,
  FeePayment,
  Exam,
  ExamResult,
  GradingRule,
  SchoolSettings,
  User,
  Notice,
  ClassRoutineSlot,
  Language,
  Homework,
  StudentCertificate,
  SmsLog,
} from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'sms_students_v1',
  ADMISSIONS: 'sms_admissions_v1',
  CLASSES: 'sms_classes_v1',
  TEACHERS: 'sms_teachers_v1',
  SUBJECTS: 'sms_subjects_v1',
  ATTENDANCE: 'sms_attendance_v1',
  INVOICES: 'sms_invoices_v1',
  PAYMENTS: 'sms_payments_v1',
  EXAMS: 'sms_exams_v1',
  RESULTS: 'sms_results_v1',
  SETTINGS: 'sms_settings_v1',
  GRADING: 'sms_grading_v1',
  CURRENT_USER: 'sms_current_user_v1',
  NOTICES: 'sms_notices_v1',
  ROUTINE: 'sms_routine_v1',
  LANGUAGE: 'sms_language_v1',
  HOMEWORK: 'sms_homework_v1',
  CERTIFICATES: 'sms_certificates_v1',
  SMS_LOGS: 'sms_sms_logs_v1',
};

export const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: 'MH ENGLISH PRIVATE HOME',
  subtitle: 'My School Management System',
  logoText: 'SMS',
  address: 'Road #14, Sector #4, Uttara, Dhaka-1230, Bangladesh',
  phone: '+880 1712-345678',
  email: 'info@myschoolbd.edu',
  website: 'https://myschoolbd.edu',
  principalName: 'Md. Anaetullah Khokon',
  eiinCode: '134521',
  currency: '৳',
  currencyCode: 'BDT',
  academicYear: '2026',
  currentSession: '2026-2027',
};

export const DEFAULT_GRADING: GradingRule[] = [
  { grade: 'A+', minMarks: 80, maxMarks: 100, gradePoint: 5.0, remarks: 'Outstanding' },
  { grade: 'A', minMarks: 70, maxMarks: 79, gradePoint: 4.0, remarks: 'Excellent' },
  { grade: 'A-', minMarks: 60, maxMarks: 69, gradePoint: 3.5, remarks: 'Very Good' },
  { grade: 'B', minMarks: 50, maxMarks: 59, gradePoint: 3.0, remarks: 'Good' },
  { grade: 'C', minMarks: 40, maxMarks: 49, gradePoint: 2.0, remarks: 'Satisfactory' },
  { grade: 'D', minMarks: 33, maxMarks: 39, gradePoint: 1.0, remarks: 'Pass' },
  { grade: 'F', minMarks: 0, maxMarks: 32, gradePoint: 0.0, remarks: 'Failed' },
];

export const DEFAULT_CLASSES: SchoolClass[] = [
  { id: 'cls-1', name: 'Class 5', numericOrder: 5, sections: ['A', 'B'], capacity: 40, roomNumber: 'Room 101' },
  { id: 'cls-2', name: 'Class 6', numericOrder: 6, sections: ['A', 'B'], capacity: 45, roomNumber: 'Room 102' },
  { id: 'cls-3', name: 'Class 7', numericOrder: 7, sections: ['A', 'B'], capacity: 45, roomNumber: 'Room 103' },
  { id: 'cls-4', name: 'Class 8', numericOrder: 8, sections: ['A', 'B'], capacity: 50, roomNumber: 'Room 201' },
  { id: 'cls-5', name: 'Class 9', numericOrder: 9, sections: ['A', 'B'], capacity: 50, roomNumber: 'Room 202' },
  { id: 'cls-6', name: 'Class 10', numericOrder: 10, sections: ['A', 'B'], capacity: 50, roomNumber: 'Room 203' },
];

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'STU-00001',
    firstName: 'Tanvir',
    lastName: 'Rahaman',
    gender: 'Male',
    dob: '2010-04-12',
    bloodGroup: 'B+',
    religion: 'Islam',
    nationality: 'Bangladeshi',
    birthCertificateNo: '20102692518102941',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    admissionDate: '2022-01-10',
    classId: 'Class 10',
    section: 'A',
    rollNo: '01',
    phone: '+880 1711-223344',
    email: 'tanvir.rahaman@example.com',
    address: 'House #24, Road #07, Sector #3, Uttara, Dhaka',
    fatherName: 'Md. Mostafizur Rahaman',
    fatherPhone: '+880 1711-998877',
    fatherOccupation: 'Engineer',
    motherName: 'Nasrin Sultana',
    motherPhone: '+880 1711-665544',
    motherOccupation: 'Teacher',
    guardianName: 'Md. Mostafizur Rahaman',
    guardianPhone: '+880 1711-998877',
    guardianRelation: 'Father',
    emergencyContactName: 'Nasrin Sultana',
    emergencyContactPhone: '+880 1711-665544',
    emergencyContactRelation: 'Mother',
    prevSchoolName: 'Uttara High School',
    prevClass: 'Class 8',
    tcNumber: 'TC-9410',
    status: 'Active',
    createdAt: '2026-01-05T09:00:00.000Z',
    updatedAt: '2026-01-05T09:00:00.000Z',
  },
  {
    id: 'STU-00002',
    firstName: 'Tanisha',
    lastName: 'Rahaman',
    gender: 'Female',
    dob: '2011-09-18',
    bloodGroup: 'O+',
    religion: 'Islam',
    nationality: 'Bangladeshi',
    birthCertificateNo: '20112692518109923',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    admissionDate: '2023-01-12',
    classId: 'Class 9',
    section: 'A',
    rollNo: '01',
    phone: '+880 1722-334455',
    email: 'tanisha.rahaman@example.com',
    address: 'House #24, Road #07, Sector #3, Uttara, Dhaka',
    fatherName: 'Md. Mostafizur Rahaman',
    fatherPhone: '+880 1711-998877',
    fatherOccupation: 'Engineer',
    motherName: 'Nasrin Sultana',
    motherPhone: '+880 1711-665544',
    motherOccupation: 'Teacher',
    guardianName: 'Nasrin Sultana',
    guardianPhone: '+880 1711-665544',
    guardianRelation: 'Mother',
    emergencyContactName: 'Md. Mostafizur Rahaman',
    emergencyContactPhone: '+880 1711-998877',
    emergencyContactRelation: 'Father',
    prevSchoolName: 'Milestone School',
    prevClass: 'Class 7',
    tcNumber: 'TC-8821',
    status: 'Active',
    createdAt: '2026-01-08T10:15:00.000Z',
    updatedAt: '2026-01-08T10:15:00.000Z',
  },
];

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'sub-1', code: 'ENG-101', name: 'English 1st Paper', classId: 'Class 10', totalMarks: 100, passMarks: 33 },
  { id: 'sub-2', code: 'ENG-102', name: 'English 2nd Paper', classId: 'Class 10', totalMarks: 100, passMarks: 33 },
  { id: 'sub-3', code: 'MTH-101', name: 'General Mathematics', classId: 'Class 10', totalMarks: 100, passMarks: 33 },
  { id: 'sub-4', code: 'SCI-101', name: 'General Science', classId: 'Class 10', totalMarks: 100, passMarks: 33 },
  { id: 'sub-5', code: 'ENG-901', name: 'English 1st Paper', classId: 'Class 9', totalMarks: 100, passMarks: 33 },
  { id: 'sub-6', code: 'MTH-901', name: 'General Mathematics', classId: 'Class 9', totalMarks: 100, passMarks: 33 },
];

export const DEFAULT_EXAMS: Exam[] = [
  {
    id: 'EXAM-2026-01',
    name: 'First Term Examination 2026',
    examType: 'First Term',
    academicYear: '2026',
    startDate: '2026-04-10',
    endDate: '2026-04-25',
    status: 'Upcoming',
  },
  {
    id: 'EXAM-2026-02',
    name: 'Mid Term Examination 2026',
    examType: 'Mid Term',
    academicYear: '2026',
    startDate: '2026-08-05',
    endDate: '2026-08-20',
    status: 'Upcoming',
  },
];

export const DEFAULT_ADMISSIONS: Admission[] = [
  {
    id: 'ADM-0001',
    applicantName: 'Ariful Islam',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250',
    dob: '2012-05-14',
    age: '14 Years',
    admissionDate: '2026-09-15',
    gender: 'Male',
    applyingClass: 'Class 8',
    applyingSection: 'A',
    fatherName: 'Rafiqul Islam',
    motherName: 'Farhana Yasmin',
    guardianName: 'Rafiqul Islam',
    phone: '+880 1819-234567',
    email: 'rafiqul.islam@example.com',
    address: 'Sector 7, Uttara, Dhaka',
    previousSchool: 'Ideal School & College',
    applicationDate: '2026-09-15',
    status: 'Pending',
    notes: 'Transfer from Motijheel branch',
    createdAt: '2026-09-15T09:30:00.000Z',
    updatedAt: '2026-09-15T09:30:00.000Z',
  },
  {
    id: 'ADM-0002',
    applicantName: 'Sumaiya Akter',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    dob: '2013-02-20',
    age: '13 Years',
    admissionDate: '2026-09-20',
    gender: 'Female',
    applyingClass: 'Class 7',
    applyingSection: 'B',
    fatherName: 'Abdur Rahim',
    motherName: 'Salma Begum',
    guardianName: 'Abdur Rahim',
    phone: '+880 1912-887766',
    email: 'rahim.abdur@example.com',
    address: 'Dakshinkhan, Dhaka',
    previousSchool: 'Civil Aviation School',
    applicationDate: '2026-09-20',
    status: 'Approved',
    notes: 'Verified documents and passed interview',
    createdAt: '2026-09-20T11:00:00.000Z',
    updatedAt: '2026-09-20T11:00:00.000Z',
  },
];

export const DEFAULT_NOTICES: Notice[] = [
  {
    id: 'NOT-001',
    title: 'First Term Examination 2026 Schedule & Admit Card Issue',
    category: 'All',
    priority: 'Urgent',
    content:
      'All students of Class 5 to Class 10 are hereby informed that the First Term Examination 2026 will commence from May 10, 2026. Admit cards must be collected from the office after clearing all outstanding tuition fees.',
    publishDate: '2026-04-20',
    author: 'Principal Office',
    createdAt: '2026-04-20T09:00:00.000Z',
  },
  {
    id: 'NOT-002',
    title: 'Monthly Parent-Teacher Meeting (PTM)',
    category: 'Parents',
    priority: 'Normal',
    content:
      'The monthly Parent-Teacher Meeting for Class 9 and 10 will be held on Saturday at 10:00 AM in the school main hall. Guardians are requested to attend on time.',
    publishDate: '2026-05-02',
    author: 'Academic Council',
    createdAt: '2026-05-02T10:30:00.000Z',
  },
  {
    id: 'NOT-003',
    title: 'Summer Vacation & Official School Holiday',
    category: 'All',
    priority: 'Holiday',
    content:
      'MH English Private Home will remain closed from June 1 to June 10 for Summer Recess. Regular academic classes and coaching sessions will resume on June 11.',
    publishDate: '2026-05-28',
    author: 'Administration',
    createdAt: '2026-05-28T08:00:00.000Z',
  },
];

export const DEFAULT_ROUTINE: ClassRoutineSlot[] = [
  {
    id: 'ROT-001',
    classId: 'Class 10',
    section: 'A',
    day: 'Saturday',
    periodNumber: 1,
    startTime: '09:00 AM',
    endTime: '09:45 AM',
    subjectName: 'English 1st Paper',
    teacherName: 'Farhana Yasmin',
    roomNumber: 'Room 203',
  },
  {
    id: 'ROT-002',
    classId: 'Class 10',
    section: 'A',
    day: 'Saturday',
    periodNumber: 2,
    startTime: '09:45 AM',
    endTime: '10:30 AM',
    subjectName: 'General Mathematics',
    teacherName: 'Md. Anaetullah Khokon',
    roomNumber: 'Room 203',
  },
  {
    id: 'ROT-003',
    classId: 'Class 10',
    section: 'A',
    day: 'Saturday',
    periodNumber: 3,
    startTime: '10:45 AM',
    endTime: '11:30 AM',
    subjectName: 'General Science',
    teacherName: 'Shahidul Islam',
    roomNumber: 'Room 203',
  },
  {
    id: 'ROT-004',
    classId: 'Class 10',
    section: 'A',
    day: 'Sunday',
    periodNumber: 1,
    startTime: '09:00 AM',
    endTime: '09:45 AM',
    subjectName: 'English 2nd Paper',
    teacherName: 'Farhana Yasmin',
    roomNumber: 'Room 203',
  },
  {
    id: 'ROT-005',
    classId: 'Class 10',
    section: 'A',
    day: 'Sunday',
    periodNumber: 2,
    startTime: '09:45 AM',
    endTime: '10:30 AM',
    subjectName: 'General Mathematics',
    teacherName: 'Md. Anaetullah Khokon',
    roomNumber: 'Room 203',
  },
  {
    id: 'ROT-006',
    classId: 'Class 9',
    section: 'A',
    day: 'Saturday',
    periodNumber: 1,
    startTime: '09:00 AM',
    endTime: '09:45 AM',
    subjectName: 'English 1st Paper',
    teacherName: 'Farhana Yasmin',
    roomNumber: 'Room 202',
  },
];

export const DEFAULT_HOMEWORK: Homework[] = [
  {
    id: 'HW-001',
    title: 'Formal Letter & Paragraph Writing on "Digital Bangladesh"',
    classId: 'Class 10',
    section: 'A',
    subjectName: 'English 2nd Paper',
    assignedTeacher: 'Farhana Yasmin',
    assignedDate: '2026-05-04',
    dueDate: '2026-05-08',
    description: 'Write a formal letter to the editor regarding traffic congestion and draft a 200-word paragraph on "Digital Bangladesh & Smart Education".',
    submissionCount: 18,
    status: 'Active',
    createdAt: '2026-05-04T09:00:00.000Z',
  },
  {
    id: 'HW-002',
    title: 'Algebra: Quadratic Equations Exercise 5.2',
    classId: 'Class 10',
    section: 'A',
    subjectName: 'General Mathematics',
    assignedTeacher: 'Md. Anaetullah Khokon',
    assignedDate: '2026-05-03',
    dueDate: '2026-05-07',
    description: 'Solve questions 1 through 15 from Chapter 5.2 with full step-by-step algebraic working on assignment sheets.',
    submissionCount: 22,
    status: 'Active',
    createdAt: '2026-05-03T10:00:00.000Z',
  },
  {
    id: 'HW-003',
    title: 'Physics Chapter 3: Laws of Motion & Momentum Problems',
    classId: 'Class 9',
    section: 'A',
    subjectName: 'General Science',
    assignedTeacher: 'Shahidul Islam',
    assignedDate: '2026-05-01',
    dueDate: '2026-05-05',
    description: 'Complete numerical problems on conservation of momentum and draw force vectors for inclined planes.',
    submissionCount: 25,
    status: 'Completed',
    createdAt: '2026-05-01T08:30:00.000Z',
  },
];

export const DEFAULT_CERTIFICATES: StudentCertificate[] = [
  {
    id: 'CRT-001',
    certificateNo: 'MH-CRT-2026-001',
    certificateType: 'Testimonial',
    studentId: 'STU-00001',
    studentName: 'Tanvir Rahaman',
    fatherName: 'Md. Mostafizur Rahaman',
    motherName: 'Nasrin Sultana',
    classId: 'Class 10',
    section: 'A',
    rollNo: '01',
    session: '2025-2026',
    gpa: '5.00 (A+)',
    conduct: 'Exemplary & Courteous',
    issueDate: '2026-05-01',
    issuedBy: 'Md. Anaetullah Khokon, Principal',
    remarks: 'Demonstrated outstanding academic proficiency in English and disciplined extracurricular participation.',
    createdAt: '2026-05-01T10:00:00.000Z',
  },
  {
    id: 'CRT-002',
    certificateNo: 'MH-CRT-2026-002',
    certificateType: 'Character Certificate',
    studentId: 'STU-00002',
    studentName: 'Sumaiya Akter',
    fatherName: 'Abdur Rahim',
    motherName: 'Salma Begum',
    classId: 'Class 7',
    section: 'B',
    rollNo: '05',
    session: '2025-2026',
    gpa: '4.85 (A)',
    conduct: 'Good & Polite',
    issueDate: '2026-05-03',
    issuedBy: 'Md. Anaetullah Khokon, Principal',
    remarks: 'Very regular, well-behaved student with strong interest in reading and language arts.',
    createdAt: '2026-05-03T11:30:00.000Z',
  },
];

export const DEFAULT_SMS_LOGS: SmsLog[] = [
  {
    id: 'SMS-001',
    recipientType: 'All Parents',
    recipientPhone: '+880 1711-XXXXXX (All)',
    message: 'Dear Guardian, First Term Examination 2026 of MH English Private Home starts May 10. Please collect admit card by May 7. Regards, Principal.',
    sentAt: '2026-04-25T10:15:00.000Z',
    status: 'Delivered',
    smsCount: 142,
  },
  {
    id: 'SMS-002',
    recipientType: 'Single Student',
    recipientName: 'Tanvir Rahaman (Father)',
    recipientPhone: '+880 1711-998877',
    message: 'Dear Guardian, Tanvir was present today on time. Monthly tuition invoice for May is ready. Amount: BDT 2,500. MH English Private Home.',
    sentAt: '2026-05-02T11:45:00.000Z',
    status: 'Delivered',
    smsCount: 1,
  },
  {
    id: 'SMS-003',
    recipientType: 'Class',
    targetClass: 'Class 10',
    recipientPhone: '+880 1912-XXXXXX (Class 10)',
    message: 'Notice: Class 10 Special English Mock Test will be held tomorrow at 9:00 AM sharp in Room 203. Attendance compulsory. MH English Private Home.',
    sentAt: '2026-05-03T14:20:00.000Z',
    status: 'Delivered',
    smsCount: 38,
  },
];

export const DEFAULT_INVOICES: FeeInvoice[] = [
  {
    id: 'inv-1001',
    invoiceNo: 'INV-1001',
    studentId: 'STU-00001',
    studentName: 'Tanvir Rahaman',
    classId: 'Class 10',
    section: 'A',
    feeType: 'Monthly Fee',
    amount: 2500,
    discount: 0,
    paidAmount: 2500,
    dueAmount: 0,
    issueDate: '2026-04-01',
    dueDate: '2026-04-15',
    paidDate: '2026-04-10',
    paymentMethod: 'Cash',
    status: 'Paid',
    notes: 'April tuition fee cleared',
    createdAt: '2026-04-01T09:00:00.000Z',
    updatedAt: '2026-04-10T10:00:00.000Z',
  },
  {
    id: 'inv-1002',
    invoiceNo: 'INV-1002',
    studentId: 'STU-00001',
    studentName: 'Tanvir Rahaman',
    classId: 'Class 10',
    section: 'A',
    feeType: 'First Term Exam Fee',
    amount: 1500,
    discount: 0,
    paidAmount: 500,
    dueAmount: 1000,
    issueDate: '2026-04-20',
    dueDate: '2026-05-05',
    paidDate: '2026-04-25',
    paymentMethod: 'Cash',
    status: 'Partial',
    notes: 'Partial payment made, balance due ৳1,000',
    createdAt: '2026-04-20T10:00:00.000Z',
    updatedAt: '2026-04-25T11:00:00.000Z',
  },
  {
    id: 'inv-1003',
    invoiceNo: 'INV-1003',
    studentId: 'STU-00002',
    studentName: 'Tanisha Rahaman',
    classId: 'Class 9',
    section: 'A',
    feeType: 'Monthly Fee',
    amount: 2500,
    discount: 0,
    paidAmount: 0,
    dueAmount: 2500,
    issueDate: '2026-05-01',
    dueDate: '2026-05-15',
    status: 'Due',
    notes: 'May tuition bill pending',
    createdAt: '2026-05-01T09:00:00.000Z',
    updatedAt: '2026-05-01T09:00:00.000Z',
  },
  {
    id: 'inv-1004',
    invoiceNo: 'INV-1004',
    studentId: 'STU-00002',
    studentName: 'Tanisha Rahaman',
    classId: 'Class 9',
    section: 'A',
    feeType: 'Admission & Session Fee',
    amount: 5000,
    discount: 500,
    paidAmount: 4500,
    dueAmount: 0,
    issueDate: '2026-01-10',
    dueDate: '2026-01-20',
    paidDate: '2026-01-12',
    paymentMethod: 'Mobile Banking',
    status: 'Paid',
    notes: 'Paid via bKash, sibling discount applied ৳500',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-12T11:30:00.000Z',
  },
];

export const DEFAULT_PAYMENTS: FeePayment[] = [
  {
    id: 'pay-1',
    receiptNo: 'REC-5001',
    invoiceId: 'inv-1001',
    invoiceNo: 'INV-1001',
    studentId: 'STU-00001',
    studentName: 'Tanvir Rahaman',
    amount: 2500,
    paymentDate: '2026-04-10',
    paymentMethod: 'Cash',
    receivedBy: 'Principal Office',
    collectedBy: 'Administrator',
    notes: 'Cash received at desk',
    createdAt: '2026-04-10T10:00:00.000Z',
  },
  {
    id: 'pay-2',
    receiptNo: 'REC-5002',
    invoiceId: 'inv-1004',
    invoiceNo: 'INV-1004',
    studentId: 'STU-00002',
    studentName: 'Tanisha Rahaman',
    amount: 4500,
    paymentDate: '2026-01-12',
    paymentMethod: 'Mobile Banking',
    transactionRef: 'TRX-9481237',
    receivedBy: 'Accounts Dept',
    collectedBy: 'Accountant',
    notes: 'bKash payment verified',
    createdAt: '2026-01-12T11:30:00.000Z',
  },
  {
    id: 'pay-3',
    receiptNo: 'REC-5003',
    invoiceId: 'inv-1002',
    invoiceNo: 'INV-1002',
    studentId: 'STU-00001',
    studentName: 'Tanvir Rahaman',
    amount: 500,
    paymentDate: '2026-04-25',
    paymentMethod: 'Cash',
    receivedBy: 'Accounts Dept',
    collectedBy: 'Administrator',
    notes: 'Exam fee installment 1',
    createdAt: '2026-04-25T11:00:00.000Z',
  },
];


// Event listener for cross-component storage changes
type StorageListener = () => void;
const listeners = new Set<StorageListener>();

export function subscribeToStorage(listener: StorageListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error('Storage listener error:', err);
    }
  });
}

// Storage helpers
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (err) {
    console.error(`Error saving localStorage key "${key}":`, err);
  }
}

// ----------------- STUDENTS -----------------
export function getStudents(): Student[] {
  return getItem<Student[]>(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
}

export function saveStudent(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Student {
  const current = getStudents();
  const now = new Date().toISOString();

  let id = student.id?.trim();
  if (!id) {
    const nextNum = current.length + 1;
    id = `STU-${String(nextNum).padStart(5, '0')}`;
  }

  const newStudent: Student = {
    ...student,
    id,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [newStudent, ...current];
  setItem(STORAGE_KEYS.STUDENTS, updated);
  return newStudent;
}

export function updateStudent(id: string, updates: Partial<Student>): Student | null {
  const current = getStudents();
  const index = current.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const updatedStudent: Student = {
    ...current[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  current[index] = updatedStudent;
  setItem(STORAGE_KEYS.STUDENTS, [...current]);
  return updatedStudent;
}

export function deleteStudent(id: string): boolean {
  const current = getStudents();
  const filtered = current.filter((s) => s.id !== id);
  if (filtered.length === current.length) return false;
  setItem(STORAGE_KEYS.STUDENTS, filtered);
  return true;
}

export function getStudentById(id: string): Student | undefined {
  return getStudents().find((s) => s.id === id);
}

// ----------------- CLASSES -----------------
export function getClasses(): SchoolClass[] {
  return getItem<SchoolClass[]>(STORAGE_KEYS.CLASSES, DEFAULT_CLASSES);
}

export function saveClass(cls: SchoolClass): void {
  const current = getClasses();
  const index = current.findIndex((c) => c.id === cls.id || c.name.toLowerCase() === cls.name.toLowerCase());
  if (index >= 0) {
    current[index] = cls;
    setItem(STORAGE_KEYS.CLASSES, [...current]);
  } else {
    setItem(STORAGE_KEYS.CLASSES, [...current, cls]);
  }
}

export function deleteClass(id: string): void {
  const current = getClasses();
  setItem(STORAGE_KEYS.CLASSES, current.filter((c) => c.id !== id));
}

// ----------------- TEACHERS -----------------
export function getTeachers(): Teacher[] {
  return getItem<Teacher[]>(STORAGE_KEYS.TEACHERS, []);
}

export function saveTeacher(teacher: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Teacher {
  const current = getTeachers();
  const now = new Date().toISOString();
  let id = teacher.id?.trim();
  if (!id) {
    const nextNum = current.length + 1;
    id = `TCH-${String(nextNum).padStart(3, '0')}`;
  }

  const newTeacher: Teacher = {
    ...teacher,
    id,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [newTeacher, ...current];
  setItem(STORAGE_KEYS.TEACHERS, updated);
  return newTeacher;
}

export function updateTeacher(id: string, updates: Partial<Teacher>): Teacher | null {
  const current = getTeachers();
  const index = current.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const updatedTeacher: Teacher = {
    ...current[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  current[index] = updatedTeacher;
  setItem(STORAGE_KEYS.TEACHERS, [...current]);
  return updatedTeacher;
}

export function deleteTeacher(id: string): boolean {
  const current = getTeachers();
  const filtered = current.filter((t) => t.id !== id);
  if (filtered.length === current.length) return false;
  setItem(STORAGE_KEYS.TEACHERS, filtered);
  return true;
}

// ----------------- ADMISSIONS -----------------
export function getAdmissions(): Admission[] {
  return getItem<Admission[]>(STORAGE_KEYS.ADMISSIONS, DEFAULT_ADMISSIONS);
}

export function saveAdmission(admission: Omit<Admission, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Admission {
  const current = getAdmissions();
  const now = new Date().toISOString();
  let id = admission.id?.trim();
  if (!id) {
    const nextNum = current.length + 1;
    id = `ADM-${String(nextNum).padStart(4, '0')}`;
  }

  const newAdmission: Admission = {
    ...admission,
    id,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [newAdmission, ...current];
  setItem(STORAGE_KEYS.ADMISSIONS, updated);
  return newAdmission;
}

export function updateAdmission(id: string, updates: Partial<Admission>): Admission | null {
  const current = getAdmissions();
  const index = current.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const updatedAdmission: Admission = {
    ...current[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  current[index] = updatedAdmission;
  setItem(STORAGE_KEYS.ADMISSIONS, [...current]);
  return updatedAdmission;
}

export function deleteAdmission(id: string): boolean {
  const current = getAdmissions();
  const filtered = current.filter((a) => a.id !== id);
  if (filtered.length === current.length) return false;
  setItem(STORAGE_KEYS.ADMISSIONS, filtered);
  return true;
}

// ----------------- ATTENDANCE -----------------
export function getAttendance(): AttendanceRecord[] {
  return getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
}

export function saveAttendanceRecords(records: AttendanceRecord[]): void {
  const current = getAttendance();
  // Filter out existing records for the same student on the same date
  const keysToUpdate = new Set(records.map((r) => `${r.studentId}_${r.date}`));
  const remaining = current.filter((r) => !keysToUpdate.has(`${r.studentId}_${r.date}`));
  setItem(STORAGE_KEYS.ATTENDANCE, [...records, ...remaining]);
}

export function getAttendanceByDateAndClass(date: string, classId: string, section?: string): AttendanceRecord[] {
  const all = getAttendance();
  return all.filter((r) => r.date === date && r.classId === classId && (!section || r.section === section));
}

// ----------------- FEES & INVOICES -----------------
export function getInvoices(): FeeInvoice[] {
  return getItem<FeeInvoice[]>(STORAGE_KEYS.INVOICES, DEFAULT_INVOICES);
}

export function saveInvoice(invoice: Omit<FeeInvoice, 'id' | 'invoiceNo' | 'createdAt' | 'updatedAt'> & { id?: string; invoiceNo?: string }): FeeInvoice {
  const current = getInvoices();
  const now = new Date().toISOString();
  let invoiceNo = invoice.invoiceNo?.trim();
  if (!invoiceNo) {
    const nextNum = current.length + 1001;
    invoiceNo = `INV-${nextNum}`;
  }

  const id = invoice.id || `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newInvoice: FeeInvoice = {
    ...invoice,
    id,
    invoiceNo,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [newInvoice, ...current];
  setItem(STORAGE_KEYS.INVOICES, updated);
  return newInvoice;
}

export function updateInvoice(id: string, updates: Partial<FeeInvoice>): FeeInvoice | null {
  const current = getInvoices();
  const index = current.findIndex((inv) => inv.id === id);
  if (index === -1) return null;

  const updatedInvoice: FeeInvoice = {
    ...current[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  current[index] = updatedInvoice;
  setItem(STORAGE_KEYS.INVOICES, [...current]);
  return updatedInvoice;
}

export function deleteInvoice(id: string): boolean {
  const current = getInvoices();
  const filtered = current.filter((inv) => inv.id !== id);
  if (filtered.length === current.length) return false;
  setItem(STORAGE_KEYS.INVOICES, filtered);
  return true;
}

// ----------------- PAYMENTS -----------------
export function getPayments(): FeePayment[] {
  return getItem<FeePayment[]>(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
}

export function savePayment(payment: Omit<FeePayment, 'id' | 'receiptNo' | 'createdAt'> & { id?: string; receiptNo?: string }): FeePayment {
  const current = getPayments();
  const now = new Date().toISOString();
  let receiptNo = payment.receiptNo?.trim();
  if (!receiptNo) {
    const nextNum = current.length + 5001;
    receiptNo = `REC-${nextNum}`;
  }

  const id = payment.id || `pay_${Date.now()}`;
  const newPayment: FeePayment = {
    ...payment,
    id,
    receiptNo,
    createdAt: now,
  };

  setItem(STORAGE_KEYS.PAYMENTS, [newPayment, ...current]);

  // Automatically update the parent invoice if available
  if (payment.invoiceId) {
    const invoice = getInvoices().find((i) => i.id === payment.invoiceId);
    if (invoice) {
      const newPaid = Number(invoice.paidAmount) + Number(payment.amount);
      const newDue = Math.max(0, Number(invoice.amount) - Number(invoice.discount) - newPaid);
      const newStatus = newDue <= 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Due';
      updateInvoice(invoice.id, {
        paidAmount: newPaid,
        dueAmount: newDue,
        status: newStatus,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
      });
    }
  }

  return newPayment;
}

// ----------------- EXAMS & RESULTS -----------------
export function getExams(): Exam[] {
  return getItem<Exam[]>(STORAGE_KEYS.EXAMS, DEFAULT_EXAMS);
}

export function saveExam(exam: Exam): void {
  const current = getExams();
  const index = current.findIndex((e) => e.id === exam.id);
  if (index >= 0) {
    current[index] = exam;
    setItem(STORAGE_KEYS.EXAMS, [...current]);
  } else {
    setItem(STORAGE_KEYS.EXAMS, [exam, ...current]);
  }
}

export function getSubjects(): Subject[] {
  return getItem<Subject[]>(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
}

export function saveSubject(subject: Subject): void {
  const current = getSubjects();
  const index = current.findIndex((s) => s.id === subject.id);
  if (index >= 0) {
    current[index] = subject;
    setItem(STORAGE_KEYS.SUBJECTS, [...current]);
  } else {
    setItem(STORAGE_KEYS.SUBJECTS, [...current, subject]);
  }
}

export function deleteSubject(id: string): void {
  const current = getSubjects();
  setItem(STORAGE_KEYS.SUBJECTS, current.filter((s) => s.id !== id));
}

export function getResults(): ExamResult[] {
  return getItem<ExamResult[]>(STORAGE_KEYS.RESULTS, []);
}

export function saveResult(result: Omit<ExamResult, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): ExamResult {
  const current = getResults();
  const now = new Date().toISOString();
  const id = result.id || `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const existingIndex = current.findIndex((r) => r.examId === result.examId && r.studentId === result.studentId);
  const newRecord: ExamResult = {
    ...result,
    id,
    createdAt: existingIndex >= 0 ? current[existingIndex].createdAt : now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    current[existingIndex] = newRecord;
    setItem(STORAGE_KEYS.RESULTS, [...current]);
  } else {
    setItem(STORAGE_KEYS.RESULTS, [newRecord, ...current]);
  }

  return newRecord;
}

// ----------------- SETTINGS & GRADING -----------------
export function getSettings(): SchoolSettings {
  const current = getItem<SchoolSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  if (!current.schoolName || current.schoolName === 'My School') {
    current.schoolName = 'MH ENGLISH PRIVATE HOME';
  }
  return current;
}

export function saveSettings(settings: SchoolSettings): void {
  setItem(STORAGE_KEYS.SETTINGS, settings);
}

export function getGradingRules(): GradingRule[] {
  return getItem<GradingRule[]>(STORAGE_KEYS.GRADING, DEFAULT_GRADING);
}

export function saveGradingRules(rules: GradingRule[]): void {
  setItem(STORAGE_KEYS.GRADING, rules);
}

// Helper to calculate grade & GPA from marks based on current rules
export function calculateGradeFromMarks(marks: number, totalMarks = 100): { grade: string; gradePoint: number } {
  const percentage = (marks / totalMarks) * 100;
  const rules = getGradingRules();

  for (const rule of rules) {
    if (percentage >= rule.minMarks && percentage <= rule.maxMarks) {
      return { grade: rule.grade, gradePoint: rule.gradePoint };
    }
  }

  return { grade: 'F', gradePoint: 0.0 };
}

// Reset all to pristine demo state matching screenshot
export function resetToDemoData(): void {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
  localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(DEFAULT_CLASSES));
  localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.ADMISSIONS, JSON.stringify(DEFAULT_ADMISSIONS));
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(DEFAULT_SUBJECTS));
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(DEFAULT_EXAMS));
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(DEFAULT_INVOICES));
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(DEFAULT_PAYMENTS));
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.GRADING, JSON.stringify(DEFAULT_GRADING));
  localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(DEFAULT_NOTICES));
  localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(DEFAULT_ROUTINE));
  localStorage.setItem(STORAGE_KEYS.HOMEWORK, JSON.stringify(DEFAULT_HOMEWORK));
  localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(DEFAULT_CERTIFICATES));
  localStorage.setItem(STORAGE_KEYS.SMS_LOGS, JSON.stringify(DEFAULT_SMS_LOGS));
  notifyListeners();
}

// ----------------- NOTICES -----------------
export function getNotices(): Notice[] {
  return getItem<Notice[]>(STORAGE_KEYS.NOTICES, DEFAULT_NOTICES);
}

export function saveNotice(notice: Omit<Notice, 'id' | 'createdAt'> & { id?: string }): Notice {
  const current = getNotices();
  const now = new Date().toISOString();
  const id = notice.id || `NOT-${String(current.length + 1).padStart(3, '0')}`;

  const newNotice: Notice = {
    ...notice,
    id,
    createdAt: now,
  };

  const updated = [newNotice, ...current.filter((n) => n.id !== id)];
  setItem(STORAGE_KEYS.NOTICES, updated);
  return newNotice;
}

export function deleteNotice(id: string): boolean {
  const current = getNotices();
  const filtered = current.filter((n) => n.id !== id);
  if (filtered.length === current.length) return false;
  setItem(STORAGE_KEYS.NOTICES, filtered);
  return true;
}

// ----------------- CLASS ROUTINE -----------------
export function getRoutine(): ClassRoutineSlot[] {
  return getItem<ClassRoutineSlot[]>(STORAGE_KEYS.ROUTINE, DEFAULT_ROUTINE);
}

export function saveRoutineSlot(slot: Omit<ClassRoutineSlot, 'id'> & { id?: string }): ClassRoutineSlot {
  const current = getRoutine();
  const id = slot.id || `ROT-${Date.now()}`;
  const newSlot: ClassRoutineSlot = { ...slot, id };
  const updated = [...current.filter((s) => s.id !== id), newSlot];
  setItem(STORAGE_KEYS.ROUTINE, updated);
  return newSlot;
}

export function deleteRoutineSlot(id: string): boolean {
  const current = getRoutine();
  const filtered = current.filter((s) => s.id !== id);
  if (filtered.length === current.length) return false;
  setItem(STORAGE_KEYS.ROUTINE, filtered);
  return true;
}

// ----------------- LANGUAGE PREFERENCE -----------------
export function getStoredLanguage(): Language {
  return getItem<Language>(STORAGE_KEYS.LANGUAGE, 'en');
}

export function saveStoredLanguage(lang: Language): void {
  setItem(STORAGE_KEYS.LANGUAGE, lang);
}

// ----------------- BULK IMPORT STUDENTS -----------------
export function bulkImportStudents(
  importedStudents: (Omit<Student, 'id' | 'createdAt' | 'updatedAt'> & { id?: string })[]
): Student[] {
  const current = getStudents();
  const now = new Date().toISOString();
  let nextNum = current.length + 1;

  const newStudents: Student[] = importedStudents.map((item) => {
    const id = item.id?.trim() || `STU-${String(nextNum++).padStart(5, '0')}`;
    return {
      ...item,
      id,
      createdAt: now,
      updatedAt: now,
    };
  });

  const updated = [...newStudents, ...current];
  setItem(STORAGE_KEYS.STUDENTS, updated);
  return newStudents;
}

// ----------------- DYNAMIC DASHBOARD METRICS -----------------
export interface DashboardMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendanceRate: number; // percentage
  todayPresentCount: number;
  todayTotalMarked: number;
  totalCollected: number; // in ৳
  totalDue: number; // in ৳
}

export function getDashboardMetrics(): DashboardMetrics {
  const students = getStudents();
  const teachers = getTeachers();
  const classes = getClasses();
  const invoices = getInvoices();
  const attendance = getAttendance();

  // Today's date YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendance.filter((r) => r.date === today);

  let todayAttendanceRate = 0;
  let todayPresentCount = 0;
  if (todayRecords.length > 0) {
    todayPresentCount = todayRecords.filter((r) => r.status === 'Present' || r.status === 'Late').length;
    todayAttendanceRate = Math.round((todayPresentCount / todayRecords.length) * 100);
  }

  // Fees calculations
  const totalCollected = invoices.reduce((acc, inv) => acc + (Number(inv.paidAmount) || 0), 0);
  const totalDue = invoices.reduce((acc, inv) => acc + (Number(inv.dueAmount) || 0), 0);

  return {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    totalClasses: classes.length,
    todayAttendanceRate,
    todayPresentCount,
    todayTotalMarked: todayRecords.length,
    totalCollected,
    totalDue,
  };
}

// ----------------- HOMEWORK -----------------
export function getHomework(): Homework[] {
  return getItem<Homework[]>(STORAGE_KEYS.HOMEWORK, DEFAULT_HOMEWORK);
}

export function saveHomework(hw: Omit<Homework, 'id' | 'createdAt'> & { id?: string }): Homework {
  const current = getHomework();
  const now = new Date().toISOString();
  const id = hw.id || `HW-${Date.now()}`;

  const newHw: Homework = {
    ...hw,
    id,
    createdAt: now,
  };

  const updated = [newHw, ...current.filter((h) => h.id !== id)];
  setItem(STORAGE_KEYS.HOMEWORK, updated);
  return newHw;
}

export function updateHomeworkStatus(id: string, status: 'Active' | 'Completed' | 'Overdue'): boolean {
  const current = getHomework();
  const updated = current.map((h) => (h.id === id ? { ...h, status } : h));
  setItem(STORAGE_KEYS.HOMEWORK, updated);
  return true;
}

export function deleteHomework(id: string): boolean {
  const current = getHomework();
  const filtered = current.filter((h) => h.id !== id);
  if (filtered.length === current.length) return false;
  setItem(STORAGE_KEYS.HOMEWORK, filtered);
  return true;
}

// ----------------- CERTIFICATES -----------------
export function getCertificates(): StudentCertificate[] {
  return getItem<StudentCertificate[]>(STORAGE_KEYS.CERTIFICATES, DEFAULT_CERTIFICATES);
}

export function saveCertificate(
  cert: Omit<StudentCertificate, 'id' | 'createdAt'> & { id?: string }
): StudentCertificate {
  const current = getCertificates();
  const now = new Date().toISOString();
  const id = cert.id || `CRT-${Date.now()}`;

  const newCert: StudentCertificate = {
    ...cert,
    id,
    createdAt: now,
  };

  const updated = [newCert, ...current.filter((c) => c.id !== id)];
  setItem(STORAGE_KEYS.CERTIFICATES, updated);
  return newCert;
}

export function deleteCertificate(id: string): boolean {
  const current = getCertificates();
  const filtered = current.filter((c) => c.id !== id);
  if (filtered.length === current.length) return false;
  setItem(STORAGE_KEYS.CERTIFICATES, filtered);
  return true;
}

// ----------------- SMS LOGS & BROADCAST -----------------
export function getSmsLogs(): SmsLog[] {
  return getItem<SmsLog[]>(STORAGE_KEYS.SMS_LOGS, DEFAULT_SMS_LOGS);
}

export function saveSmsLog(log: Omit<SmsLog, 'id'> & { id?: string }): SmsLog {
  const current = getSmsLogs();
  const id = log.id || `SMS-${Date.now()}`;
  const newLog: SmsLog = { ...log, id };
  const updated = [newLog, ...current];
  setItem(STORAGE_KEYS.SMS_LOGS, updated);
  return newLog;
}

export function clearSmsLogs(): void {
  setItem(STORAGE_KEYS.SMS_LOGS, []);
}
