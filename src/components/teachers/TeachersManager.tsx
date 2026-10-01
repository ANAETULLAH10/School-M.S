import React, { useState, useRef } from 'react';
import {
  UsersRound,
  UserPlus,
  Search,
  Printer,
  Download,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Eye,
  X,
  Save,
  Briefcase,
  GraduationCap,
  Upload,
  Camera,
} from 'lucide-react';
import { Teacher, SchoolClass, Subject, TeacherStatus, Gender } from '../../types';
import { formatDate, formatCurrency, exportToCSV } from '../../services/exportUtils';
import { useToast } from '../../context/ToastContext';

interface TeachersManagerProps {
  teachers: Teacher[];
  classes: SchoolClass[];
  subjects: Subject[];
  onSaveTeacher: (teacher: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onUpdateTeacher: (id: string, updates: Partial<Teacher>) => void;
  onDeleteTeacher: (id: string) => void;
}

export const TeachersManager: React.FC<TeachersManagerProps> = ({
  teachers,
  classes,
  subjects,
  onSaveTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>('Female');
  const [dob, setDob] = useState('1988-06-12');
  const [phone, setPhone] = useState('+880 1711-');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Uttara, Dhaka');
  const [qualification, setQualification] = useState('M.A. in English (DU)');
  const [designation, setDesignation] = useState('Senior Teacher');
  const [department, setDepartment] = useState('English');
  const [joiningDate, setJoiningDate] = useState('2021-01-15');
  const [salary, setSalary] = useState<number>(38000);
  const [status, setStatus] = useState<TeacherStatus>('Active');
  const [photo, setPhoto] = useState('');
  const [assignedClassesStr, setAssignedClassesStr] = useState('Class 9, Class 10');
  const [assignedSubjectsStr, setAssignedSubjectsStr] = useState('English 1st Paper, English 2nd Paper');

  const openAddModal = () => {
    setEditingTeacher(null);
    setFirstName('');
    setLastName('');
    setGender('Female');
    setDob('1988-06-12');
    setPhone('+880 1711-334455');
    setEmail('teacher@myschoolbd.edu');
    setAddress('Uttara, Dhaka');
    setQualification('M.Sc in Mathematics (DU)');
    setDesignation('Assistant Teacher');
    setDepartment('Mathematics');
    setJoiningDate(new Date().toISOString().split('T')[0]);
    setSalary(35000);
    setStatus('Active');
    setPhoto('');
    setAssignedClassesStr('Class 9, Class 10');
    setAssignedSubjectsStr('General Mathematics');
    setShowFormModal(true);
  };

  const openEditModal = (t: Teacher) => {
    setEditingTeacher(t);
    setFirstName(t.firstName);
    setLastName(t.lastName);
    setGender(t.gender);
    setDob(t.dob);
    setPhone(t.phone);
    setEmail(t.email);
    setAddress(t.address);
    setQualification(t.qualification);
    setDesignation(t.designation);
    setDepartment(t.department);
    setJoiningDate(t.joiningDate);
    setSalary(t.salary);
    setStatus(t.status);
    setPhoto(t.photo || '');
    setAssignedClassesStr(t.assignedClasses.join(', '));
    setAssignedSubjectsStr(t.assignedSubjects.join(', '));
    setShowFormModal(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhoto(event.target?.result as string);
      toast.success('Teacher photograph updated');
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First and last names are required');
      return;
    }

    const assignedClasses = assignedClassesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const assignedSubjects = assignedSubjectsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingTeacher) {
      onUpdateTeacher(editingTeacher.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
        dob,
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        qualification: qualification.trim(),
        designation: designation.trim(),
        department: department.trim(),
        joiningDate,
        salary: Number(salary) || 0,
        status,
        photo: photo.trim() || undefined,
        assignedClasses,
        assignedSubjects,
      });
      toast.success(`Teacher ${firstName} ${lastName} updated`);
    } else {
      onSaveTeacher({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
        dob,
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        qualification: qualification.trim(),
        designation: designation.trim(),
        department: department.trim(),
        joiningDate,
        salary: Number(salary) || 0,
        status,
        photo: photo.trim() || undefined,
        assignedClasses,
        assignedSubjects,
      });
      toast.success(`Teacher ${firstName} ${lastName} registered`);
    }

    setShowFormModal(false);
  };

  const filteredTeachers = teachers.filter((t) => {
    const q = search.toLowerCase();
    const fullName = `${t.firstName} ${t.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.phone.includes(q) ||
      t.department.toLowerCase().includes(q);
    const matchesDept = deptFilter === 'All' || t.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = [
      'Teacher ID',
      'Name',
      'Department',
      'Designation',
      'Phone',
      'Email',
      'Salary (৳)',
      'Status',
    ];
    const rows = filteredTeachers.map((t) => [
      t.id,
      `${t.firstName} ${t.lastName}`,
      t.department,
      t.designation,
      t.phone,
      t.email,
      t.salary,
      t.status,
    ]);
    exportToCSV('Teachers_Faculty_Directory_MH_School', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Faculty & Teachers</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage academic staff profiles, class assignments, qualifications, and payroll details
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
            onClick={() => window.print()}
            className="neu-btn inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-2xl"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print List</span>
          </button>

          <button
            onClick={openAddModal}
            className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Teacher</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="neu-raised rounded-3xl p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search teacher by name, ID, phone, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="neu-input w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="neu-input px-3.5 py-2 text-xs font-semibold rounded-xl"
          >
            <option value="All">All Departments</option>
            <option value="English">English</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="Social Science">Social Science</option>
            <option value="Religion">Religion</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="neu-input px-3.5 py-2 text-xs font-semibold rounded-xl"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
          </select>
        </div>
      </div>

      {/* Teachers Directory Table */}
      <div className="neu-raised rounded-3xl overflow-hidden p-2">
        <div className="overflow-x-auto">
          {filteredTeachers.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs font-semibold">
              No faculty records registered. Click "+ Add Teacher" to create faculty profiles.
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200/50">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30">
                {filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-200/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {t.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {t.photo ? (
                          <img
                            src={t.photo}
                            alt={t.firstName}
                            className="w-9 h-9 rounded-2xl object-cover shadow-[2px_2px_4px_#cad1de]"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-2xl neu-inset-sm text-slate-700 flex items-center justify-center font-bold text-xs">
                            {t.firstName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-800 block leading-tight">
                            {t.firstName} {t.lastName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {t.qualification}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {t.department}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {t.designation}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-xs">
                        <span className="flex items-center gap-1 text-slate-700 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {t.phone}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {t.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-800">
                      {formatCurrency(t.salary)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`neu-inset-sm inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black ${
                          t.status === 'Active'
                            ? 'text-emerald-700'
                            : t.status === 'On Leave'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingTeacher(t)}
                          className="neu-btn p-2 text-slate-500 hover:text-blue-600 rounded-xl"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(t)}
                          className="neu-btn p-2 text-slate-500 hover:text-amber-600 rounded-xl"
                          title="Edit Teacher"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete teacher ${t.firstName} ${t.lastName}?`)) {
                              onDeleteTeacher(t.id);
                              toast.info(`Deleted ${t.firstName} ${t.lastName}`);
                            }
                          }}
                          className="neu-btn p-2 text-slate-500 hover:text-rose-600 rounded-xl"
                          title="Delete Teacher"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal: Add/Edit Teacher */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-2xl w-full my-8 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
              <h3 className="font-black text-slate-800 text-base">
                {editingTeacher ? `Edit Teacher: ${editingTeacher.id}` : 'Register Faculty Teacher'}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="neu-btn p-1.5 rounded-xl text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto p-1">
              {/* Photo Upload */}
              <div className="neu-inset rounded-2xl p-4 flex items-center gap-4">
                <div className="relative">
                  {photo ? (
                    <img
                      src={photo}
                      alt="Teacher"
                      className="w-16 h-16 rounded-2xl object-cover shadow-[2px_2px_5px_#cad1de]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl neu-raised flex items-center justify-center text-blue-600">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}
                  {photo && (
                    <button
                      type="button"
                      onClick={() => setPhoto('')}
                      className="neu-btn-danger absolute -top-2 -right-2 p-1 rounded-full text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-800 block">Faculty Photograph</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="neu-btn-primary px-3 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload</span>
                    </button>
                    <input
                      type="url"
                      placeholder="Or photo link https://..."
                      value={photo.startsWith('data:') ? '' : photo}
                      onChange={(e) => setPhoto(e.target.value)}
                      className="neu-input px-3 py-1 text-xs rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farhana"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yasmin"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. English"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Lecturer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+880 1711-XXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="teacher@myschoolbd.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. M.A. in English (DU)"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Salary (৳)</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TeacherStatus)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Classes (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Class 9, Class 10"
                  value={assignedClassesStr}
                  onChange={(e) => setAssignedClassesStr(e.target.value)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Subjects (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. English 1st Paper, English 2nd Paper"
                  value={assignedSubjectsStr}
                  onChange={(e) => setAssignedSubjectsStr(e.target.value)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200/50 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="neu-btn px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary px-5 py-2 text-xs font-bold rounded-xl"
                >
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Teacher Profile */}
      {viewingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-lg w-full my-8 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/50">
              <h3 className="font-black text-slate-800 text-base">Teacher Profile</h3>
              <button
                onClick={() => setViewingTeacher(null)}
                className="neu-btn p-1.5 rounded-xl text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              {viewingTeacher.photo ? (
                <img
                  src={viewingTeacher.photo}
                  alt={viewingTeacher.firstName}
                  className="w-16 h-16 rounded-2xl object-cover shadow-[2px_2px_5px_#cad1de]"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl neu-inset text-blue-700 flex items-center justify-center font-black text-2xl">
                  {viewingTeacher.firstName.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="font-black text-slate-800 text-lg">
                  {viewingTeacher.firstName} {viewingTeacher.lastName}
                </h4>
                <p className="text-xs text-blue-700 font-bold">
                  {viewingTeacher.designation} • {viewingTeacher.department}
                </p>
                <span className="neu-inset-sm px-2.5 py-0.5 rounded-xl text-[10px] font-mono text-slate-600 font-bold mt-1 inline-block">
                  ID: {viewingTeacher.id}
                </span>
              </div>
            </div>

            <div className="neu-inset rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Qualification:</span>
                <span className="font-bold text-slate-800">{viewingTeacher.qualification}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Joining Date:</span>
                <span className="font-bold text-slate-800">{formatDate(viewingTeacher.joiningDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Phone:</span>
                <span className="font-bold text-slate-800 font-mono">{viewingTeacher.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Email:</span>
                <span className="font-bold text-slate-800">{viewingTeacher.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Monthly Salary:</span>
                <span className="font-bold text-emerald-700 font-mono">{formatCurrency(viewingTeacher.salary)}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">Assigned Classes</span>
              <div className="flex flex-wrap gap-1.5">
                {viewingTeacher.assignedClasses.map((c) => (
                  <span key={c} className="neu-inset-sm px-2.5 py-1 rounded-xl text-blue-700 text-xs font-bold">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">Assigned Subjects</span>
              <div className="flex flex-wrap gap-1.5">
                {viewingTeacher.assignedSubjects.map((s) => (
                  <span key={s} className="neu-inset-sm px-2.5 py-1 rounded-xl text-slate-700 text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingTeacher(null)}
                className="neu-btn px-4 py-2 text-xs font-bold rounded-xl text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
