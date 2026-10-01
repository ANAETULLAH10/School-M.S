import React, { useState, useRef } from 'react';
import { X, Save, Upload, Camera } from 'lucide-react';
import { Student, SchoolClass, Gender, StudentStatus } from '../../types';
import { useToast } from '../../context/ToastContext';

interface StudentFormModalProps {
  initialData?: Student | null;
  classes: SchoolClass[];
  onClose: () => void;
  onSave: (student: Student) => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  initialData,
  classes,
  onClose,
  onSave,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'academic' | 'guardian' | 'previous'>('basic');

  // Form states
  const [id, setId] = useState(initialData?.id || '');
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [gender, setGender] = useState<Gender>(initialData?.gender || 'Male');
  const [dob, setDob] = useState(initialData?.dob || '2012-01-01');
  const [bloodGroup, setBloodGroup] = useState(initialData?.bloodGroup || 'A+');
  const [religion, setReligion] = useState(initialData?.religion || 'Islam');
  const [nationality, setNationality] = useState(initialData?.nationality || 'Bangladeshi');
  const [birthCertificateNo, setBirthCertificateNo] = useState(initialData?.birthCertificateNo || '');
  const [photo, setPhoto] = useState(initialData?.photo || '');

  // Academic
  const [classId, setClassId] = useState(initialData?.classId || (classes[0]?.name || 'Class 10'));
  const [section, setSection] = useState(initialData?.section || 'A');
  const [rollNo, setRollNo] = useState(initialData?.rollNo || '01');
  const [admissionDate, setAdmissionDate] = useState(initialData?.admissionDate || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<StudentStatus>(initialData?.status || 'Active');

  // Contact
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [address, setAddress] = useState(initialData?.address || '');

  // Guardian
  const [fatherName, setFatherName] = useState(initialData?.fatherName || '');
  const [fatherPhone, setFatherPhone] = useState(initialData?.fatherPhone || '');
  const [fatherOccupation, setFatherOccupation] = useState(initialData?.fatherOccupation || '');
  const [motherName, setMotherName] = useState(initialData?.motherName || '');
  const [motherPhone, setMotherPhone] = useState(initialData?.motherPhone || '');
  const [motherOccupation, setMotherOccupation] = useState(initialData?.motherOccupation || '');
  const [guardianName, setGuardianName] = useState(initialData?.guardianName || '');
  const [guardianPhone, setGuardianPhone] = useState(initialData?.guardianPhone || '');
  const [guardianRelation, setGuardianRelation] = useState(initialData?.guardianRelation || 'Father');

  // Emergency
  const [emergencyContactName, setEmergencyContactName] = useState(initialData?.emergencyContactName || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(initialData?.emergencyContactPhone || '');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState(initialData?.emergencyContactRelation || '');

  // Previous school
  const [prevSchoolName, setPrevSchoolName] = useState(initialData?.prevSchoolName || '');
  const [prevClass, setPrevClass] = useState(initialData?.prevClass || '');
  const [tcNumber, setTcNumber] = useState(initialData?.tcNumber || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo size should be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhoto(event.target?.result as string);
      toast.success('Photo uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!dob) errs.dob = 'Date of birth is required';
    if (!classId) errs.classId = 'Class is required';
    if (!section) errs.section = 'Section is required';
    if (!rollNo.trim()) errs.rollNo = 'Roll number is required';

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const studentRecord: Student = {
      id: id.trim() || (initialData?.id || ''),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      dob,
      bloodGroup,
      religion,
      nationality,
      birthCertificateNo,
      photo: photo.trim() || undefined,
      admissionDate,
      classId,
      section,
      rollNo: rollNo.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      fatherName: fatherName.trim() || undefined,
      fatherPhone: fatherPhone.trim() || undefined,
      fatherOccupation: fatherOccupation.trim() || undefined,
      motherName: motherName.trim() || undefined,
      motherPhone: motherPhone.trim() || undefined,
      motherOccupation: motherOccupation.trim() || undefined,
      guardianName: guardianName.trim() || fatherName.trim() || undefined,
      guardianPhone: guardianPhone.trim() || fatherPhone.trim() || undefined,
      guardianRelation: guardianRelation.trim() || undefined,
      emergencyContactName: emergencyContactName.trim() || fatherName.trim() || undefined,
      emergencyContactPhone: emergencyContactPhone.trim() || fatherPhone.trim() || undefined,
      emergencyContactRelation: emergencyContactRelation.trim() || undefined,
      prevSchoolName: prevSchoolName.trim() || undefined,
      prevClass: prevClass.trim() || undefined,
      tcNumber: tcNumber.trim() || undefined,
      status,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(studentRecord);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-3xl w-full my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-800">
              {initialData ? 'Edit Student Profile' : 'Register New Student'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {initialData ? `Updating ${initialData.id}` : 'Complete the registration form to add a student to the school register'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="neu-btn p-2 text-slate-500 hover:text-slate-800 rounded-xl"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tactile Tab Navigation */}
        <div className="flex px-6 pt-3 gap-2 overflow-x-auto text-xs font-bold border-b border-slate-200/40 pb-3">
          {[
            { id: 'basic', label: '1. Personal Info' },
            { id: 'academic', label: '2. Academic & Contact' },
            { id: 'guardian', label: '3. Guardian & Emergency' },
            { id: 'previous', label: '4. Previous School & Status' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-2xl transition-all whitespace-nowrap text-xs ${
                activeTab === tab.id
                  ? 'neu-inset text-blue-700 font-extrabold'
                  : 'neu-btn text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
            {/* Tab 1: Personal Info */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                {/* Photo Upload Capsule */}
                <div className="neu-inset rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative">
                    {photo ? (
                      <img
                        src={photo}
                        alt="Preview"
                        className="w-20 h-20 rounded-2xl object-cover shadow-[3px_3px_8px_#cad1de,-3px_-3px_8px_#ffffff]"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl neu-raised flex flex-col items-center justify-center text-blue-600">
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">No Photo</span>
                      </div>
                    )}
                    {photo && (
                      <button
                        type="button"
                        onClick={() => setPhoto('')}
                        className="neu-btn-danger absolute -top-2 -right-2 p-1 rounded-full shadow-xs"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <span className="text-xs font-bold text-slate-800 block">Student Photograph</span>
                    <p className="text-[11px] text-slate-500">
                      Upload student photo from device or provide web image link.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
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
                        className="neu-btn-primary px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload File</span>
                      </button>
                      <input
                        type="url"
                        placeholder="Or paste URL https://..."
                        value={photo.startsWith('data:') ? '' : photo}
                        onChange={(e) => setPhoto(e.target.value)}
                        className="neu-input px-3 py-1 text-xs rounded-xl flex-1 min-w-[180px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student ID <span className="text-slate-400 font-normal">(Auto-generated if empty)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. STU-00003"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-mono font-bold"
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
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tanvir"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl"
                    />
                    {errors.firstName && <p className="text-[11px] text-rose-500 mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahaman"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl"
                    />
                    {errors.lastName && <p className="text-[11px] text-rose-500 mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date of Birth <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-semibold"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Religion</label>
                    <input
                      type="text"
                      placeholder="e.g. Islam"
                      value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nationality</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangladeshi"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Birth Certificate Number
                    </label>
                    <input
                      type="text"
                      placeholder="17-digit birth certificate number"
                      value={birthCertificateNo}
                      onChange={(e) => setBirthCertificateNo(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Academic & Contact */}
            {activeTab === 'academic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Class <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={classId}
                      onChange={(e) => setClassId(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-semibold"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Section <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-semibold"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Roll Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 01"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admission Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={admissionDate}
                      onChange={(e) => setAdmissionDate(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Student Phone</label>
                    <input
                      type="tel"
                      placeholder="+880 17XX-XXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Student Email</label>
                    <input
                      type="email"
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                    <textarea
                      rows={2}
                      placeholder="Full residential address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Guardian & Emergency */}
            {activeTab === 'guardian' && (
              <div className="space-y-4">
                <div className="neu-inset rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                    Parents Details (Father & Mother)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Father's Name</label>
                      <input
                        type="text"
                        placeholder="Father's full name"
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Father's Phone</label>
                      <input
                        type="tel"
                        placeholder="+880 17XX-XXXXXX"
                        value={fatherPhone}
                        onChange={(e) => setFatherPhone(e.target.value)}
                        className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Father's Occupation</label>
                      <input
                        type="text"
                        placeholder="e.g. Businessman, Engineer"
                        value={fatherOccupation}
                        onChange={(e) => setFatherOccupation(e.target.value)}
                        className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Name</label>
                      <input
                        type="text"
                        placeholder="Mother's full name"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Phone</label>
                      <input
                        type="tel"
                        placeholder="+880 17XX-XXXXXX"
                        value={motherPhone}
                        onChange={(e) => setMotherPhone(e.target.value)}
                        className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Occupation</label>
                      <input
                        type="text"
                        placeholder="e.g. Teacher, Homemaker"
                        value={motherOccupation}
                        onChange={(e) => setMotherOccupation(e.target.value)}
                        className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary Guardian Name</label>
                    <input
                      type="text"
                      placeholder="Leave blank to use Father"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Guardian Phone</label>
                    <input
                      type="tel"
                      placeholder="+880 17XX-XXXXXX"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Previous School & Status */}
            {activeTab === 'previous' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Previous School Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Uttara High School"
                      value={prevSchoolName}
                      onChange={(e) => setPrevSchoolName(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Previous Class Passed
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Class 8"
                      value={prevClass}
                      onChange={(e) => setPrevClass(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Transfer Certificate (TC) Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TC-9410"
                      value={tcNumber}
                      onChange={(e) => setTcNumber(e.target.value)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enrollment Status <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as StudentStatus)}
                      className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-bold"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Graduated">Graduated</option>
                      <option value="Transferred">Transferred</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-200/50 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-semibold">
              Fields marked with <span className="text-rose-500 font-bold">*</span> are mandatory
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="neu-btn px-4 py-2 text-xs font-bold rounded-2xl text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="neu-btn-primary inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-2xl"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{initialData ? 'Update Student' : 'Save Student'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
