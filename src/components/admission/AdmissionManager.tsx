import React, { useState, useEffect, useRef } from 'react';
import {
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Download,
  Trash2,
  X,
  Save,
  Upload,
  Camera,
  Users,
} from 'lucide-react';
import { Admission, AdmissionStatus, SchoolClass, Gender } from '../../types';
import { formatDate, calculateAgeFromDob, exportToCSV } from '../../services/exportUtils';
import { useToast } from '../../context/ToastContext';

interface AdmissionManagerProps {
  admissions: Admission[];
  classes: SchoolClass[];
  onSaveAdmission: (admission: Omit<Admission, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onUpdateStatus: (id: string, status: AdmissionStatus) => void;
  onConvertToStudent: (admission: Admission) => void;
  onDeleteAdmission: (id: string) => void;
}

export const AdmissionManager: React.FC<AdmissionManagerProps> = ({
  admissions,
  classes,
  onSaveAdmission,
  onUpdateStatus,
  onConvertToStudent,
  onDeleteAdmission,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [applicantName, setApplicantName] = useState('');
  const [photo, setPhoto] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [dob, setDob] = useState('2014-04-10');
  const [age, setAge] = useState('');
  const [admissionDate, setAdmissionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [applyingClass, setApplyingClass] = useState(classes[0]?.name || 'Class 6');
  const [applyingSection, setApplyingSection] = useState('A');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [notes, setNotes] = useState('');

  // Auto-calculate age whenever DOB changes
  useEffect(() => {
    if (dob) {
      const calculated = calculateAgeFromDob(dob);
      setAge(calculated);
    }
  }, [dob]);

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPhoto(base64);
      toast.success('Student photo uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filtered = admissions.filter((adm) => {
    const q = search.toLowerCase();
    const matchesSearch =
      adm.applicantName.toLowerCase().includes(q) ||
      adm.guardianName?.toLowerCase().includes(q) ||
      adm.fatherName?.toLowerCase().includes(q) ||
      adm.motherName?.toLowerCase().includes(q) ||
      adm.phone.toLowerCase().includes(q) ||
      adm.id.toLowerCase().includes(q);
    const matchesStatus = filterStatus === 'All' || adm.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      toast.error('Applicant full name is required');
      return;
    }
    if (!phone.trim()) {
      toast.error('Contact phone number is required');
      return;
    }

    const resolvedGuardian = guardianName.trim() || fatherName.trim() || motherName.trim() || 'Guardian';

    onSaveAdmission({
      applicantName: applicantName.trim(),
      photo: photo.trim() || undefined,
      gender,
      dob,
      age: age.trim() || calculateAgeFromDob(dob),
      admissionDate,
      applyingClass,
      applyingSection,
      fatherName: fatherName.trim() || undefined,
      motherName: motherName.trim() || undefined,
      guardianName: resolvedGuardian,
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      previousSchool: previousSchool.trim() || undefined,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      notes: notes.trim() || undefined,
    });

    toast.success('New admission application saved to database');
    setShowAddModal(false);

    // Reset form
    setApplicantName('');
    setPhoto('');
    setFatherName('');
    setMotherName('');
    setGuardianName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setPreviousSchool('');
    setNotes('');
  };

  const handleExportCSV = () => {
    const headers = [
      'Application ID',
      'Applicant Name',
      'Age',
      'Admission Date',
      'Father Name',
      'Mother Name',
      'Applying Class',
      'Gender',
      'Phone',
      'Status',
    ];
    const rows = filtered.map((a) => [
      a.id,
      a.applicantName,
      a.age || '',
      a.admissionDate || '',
      a.fatherName || '',
      a.motherName || '',
      a.applyingClass,
      a.gender,
      a.phone,
      a.status,
    ]);
    exportToCSV('Admission_Applications_MH_School', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Admission Management</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Process student admission applications, photograph attachments, parent details, and enrolment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="neu-btn inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ New Admission Form</span>
          </button>
        </div>
      </div>

      {/* Stats summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setFilterStatus('All')}
          className={`p-4 rounded-3xl transition-all cursor-pointer ${
            filterStatus === 'All' ? 'neu-inset text-blue-700' : 'neu-raised'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
            Total Applications
          </span>
          <span className="text-2xl font-black text-slate-800">{admissions.length}</span>
        </div>

        <div
          onClick={() => setFilterStatus('Pending')}
          className={`p-4 rounded-3xl transition-all cursor-pointer ${
            filterStatus === 'Pending' ? 'neu-inset text-amber-700' : 'neu-raised'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-600 block flex items-center gap-1 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
          <span className="text-2xl font-black text-amber-600">
            {admissions.filter((a) => a.status === 'Pending').length}
          </span>
        </div>

        <div
          onClick={() => setFilterStatus('Approved')}
          className={`p-4 rounded-3xl transition-all cursor-pointer ${
            filterStatus === 'Approved' ? 'neu-inset text-emerald-700' : 'neu-raised'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-600 block flex items-center gap-1 uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
          <span className="text-2xl font-black text-emerald-600">
            {admissions.filter((a) => a.status === 'Approved').length}
          </span>
        </div>

        <div
          onClick={() => setFilterStatus('Rejected')}
          className={`p-4 rounded-3xl transition-all cursor-pointer ${
            filterStatus === 'Rejected' ? 'neu-inset text-rose-700' : 'neu-raised'
          }`}
        >
          <span className="text-[11px] font-bold text-rose-600 block flex items-center gap-1 uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
          <span className="text-2xl font-black text-rose-600">
            {admissions.filter((a) => a.status === 'Rejected').length}
          </span>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="neu-raised rounded-3xl p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search applicants, father, mother, phone, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="neu-input w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === status
                  ? 'neu-btn-primary'
                  : 'neu-btn text-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="neu-raised rounded-3xl overflow-hidden p-2">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No admission applications found for the selected criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200/40 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-mono">App #</th>
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Applicant Name</th>
                  <th className="py-3 px-4">Age & DOB</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Father & Mother</th>
                  <th className="py-3 px-4">Admission Date</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30">
                {filtered.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-200/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 text-xs">
                      {adm.id}
                    </td>

                    {/* Photo thumbnail */}
                    <td className="py-3.5 px-4">
                      {adm.photo ? (
                        <img
                          src={adm.photo}
                          alt={adm.applicantName}
                          className="w-10 h-10 rounded-2xl object-cover shadow-[2px_2px_5px_#cad1de,-2px_-2px_5px_#ffffff]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-2xl neu-inset-sm text-blue-700 flex items-center justify-center font-bold text-xs">
                          {adm.applicantName.charAt(0)}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block leading-tight">
                        {adm.applicantName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {adm.gender}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block text-xs">
                        {adm.age || calculateAgeFromDob(adm.dob)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        DOB: {formatDate(adm.dob)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {adm.applyingClass} {adm.applyingSection ? `(${adm.applyingSection})` : ''}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs space-y-0.5">
                        <span className="text-slate-800 font-bold block">
                          F: {adm.fatherName || adm.guardianName || '-'}
                        </span>
                        <span className="text-slate-500 font-medium block">
                          M: {adm.motherName || '-'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                      {formatDate(adm.admissionDate || adm.applicationDate)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {adm.phone}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`neu-inset-sm inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${
                          adm.status === 'Approved'
                            ? 'text-emerald-700'
                            : adm.status === 'Rejected'
                            ? 'text-rose-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {adm.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {adm.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => {
                                onUpdateStatus(adm.id, 'Approved');
                                toast.success(`Admission ${adm.id} Approved`);
                              }}
                              className="neu-btn px-2.5 py-1 text-xs font-bold text-emerald-700 rounded-xl"
                              title="Approve Application"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                onUpdateStatus(adm.id, 'Rejected');
                                toast.warning(`Admission ${adm.id} Rejected`);
                              }}
                              className="neu-btn px-2.5 py-1 text-xs font-bold text-rose-700 rounded-xl"
                              title="Reject Application"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {adm.status === 'Approved' && !adm.convertedStudentId && (
                          <button
                            onClick={() => onConvertToStudent(adm)}
                            className="neu-btn-primary inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl"
                            title="Enroll as registered student in database"
                          >
                            <span>Convert to Student</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {adm.convertedStudentId && (
                          <span className="neu-inset-sm text-[11px] font-mono text-emerald-600 px-2.5 py-1 rounded-xl font-bold">
                            Enrolled: {adm.convertedStudentId}
                          </span>
                        )}

                        <button
                          onClick={() => onDeleteAdmission(adm.id)}
                          className="neu-btn p-1.5 text-slate-500 hover:text-rose-600 rounded-xl"
                          title="Delete application"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* New Admission Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto">
          <div className="neu-raised-lg rounded-3xl max-w-3xl w-full my-8 overflow-hidden bg-[#ebf0f7]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200/40 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800">New Admission Application</h3>
                <p className="text-xs text-slate-500">
                  Register candidate details, upload student photo, calculate age, and record parent credentials
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="neu-btn p-2 rounded-xl text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Photo Upload Section */}
              <div className="neu-inset rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative">
                  {photo ? (
                    <img
                      src={photo}
                      alt="Student Preview"
                      className="w-24 h-24 rounded-2xl object-cover shadow-[4px_4px_10px_#cad1de,-4px_-4px_10px_#ffffff]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl neu-raised flex flex-col items-center justify-center text-blue-600">
                      <Camera className="w-7 h-7 mb-1" />
                      <span className="text-[10px] font-bold">No Photo</span>
                    </div>
                  )}

                  {photo && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="neu-btn-danger absolute -top-2 -right-2 p-1 rounded-full shadow-xs"
                      title="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Student Photograph</h4>
                    <p className="text-xs text-slate-500">
                      Upload candidate portrait photo (JPG, PNG, WebP max 5MB). Photo carries over to student ID card.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Student Photo</span>
                    </button>

                    <span className="text-xs text-slate-500 font-semibold">or image link:</span>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={photo.startsWith('data:') ? '' : photo}
                      onChange={(e) => setPhoto(e.target.value)}
                      className="neu-input px-3 py-1.5 text-xs rounded-xl min-w-[200px]"
                    />
                  </div>
                </div>
              </div>

              {/* Applicant & Admission Core Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Applicant Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ariful Islam"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admission Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={admissionDate}
                    onChange={(e) => setAdmissionDate(e.target.value)}
                    className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date of Birth <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Calculated Age <span className="text-slate-400 font-normal">(Auto from DOB)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12 Years"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-bold text-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Applying Class <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={applyingClass}
                    onChange={(e) => setApplyingClass(e.target.value)}
                    className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-semibold"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Parents Information: Father & Mother */}
              <div className="neu-inset rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Parents Credentials (Father & Mother)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Father's Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Father's full name"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mother's Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mother's full name"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Guardian Name <span className="text-slate-400 font-normal">(Optional, defaults to Father)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Leave empty to use Father's name"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 17XX-XXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Other Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="guardian@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Previous School & TC</label>
                  <input
                    type="text"
                    placeholder="Previous school name if any"
                    value={previousSchool}
                    onChange={(e) => setPreviousSchool(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-2xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Present Address</label>
                <textarea
                  rows={2}
                  placeholder="House, Road, Area, District"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-2xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200/40 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Data will be securely saved to the database.
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="neu-btn px-4 py-2 text-xs font-bold rounded-2xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="neu-btn-primary inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-2xl"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Application</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
