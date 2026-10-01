import React, { useState } from 'react';
import {
  Award,
  Plus,
  Search,
  Printer,
  Trash2,
  X,
  Save,
  CheckCircle,
  FileCheck,
  User,
  School,
  Calendar,
  Eye,
} from 'lucide-react';
import { StudentCertificate, CertificateType, Student, SchoolSettings } from '../../types';
import { formatDate } from '../../services/exportUtils';
import { useToast } from '../../context/ToastContext';

interface CertificateManagerProps {
  certificates: StudentCertificate[];
  students: Student[];
  settings: SchoolSettings;
  onSaveCertificate: (cert: Omit<StudentCertificate, 'id' | 'createdAt'> & { id?: string }) => void;
  onDeleteCertificate: (id: string) => void;
}

export const CertificateManager: React.FC<CertificateManagerProps> = ({
  certificates,
  students,
  settings,
  onSaveCertificate,
  onDeleteCertificate,
}) => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewCert, setPreviewCert] = useState<StudentCertificate | null>(null);

  // Form states
  const [certType, setCertType] = useState<CertificateType>('Testimonial');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [conduct, setConduct] = useState('Exemplary and disciplined moral character');
  const [remarks, setRemarks] = useState(
    'Demonstrated high academic merit and satisfactory conduct during the entire course of study.'
  );
  const [issuedBy, setIssuedBy] = useState(`${settings.principalName}, Principal`);

  // Selected student for auto-fill
  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const filteredCerts = certificates.filter((c) => {
    const matchesSearch =
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.certificateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.classId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || c.certificateType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    const certSerial = `MH-CRT-${new Date().getFullYear()}-${String(certificates.length + 1).padStart(3, '0')}`;

    const newCert = onSaveCertificate({
      certificateNo: certSerial,
      certificateType: certType,
      studentId: selectedStudent.id,
      studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
      fatherName: selectedStudent.fatherName || 'Guardian',
      motherName: selectedStudent.motherName || '',
      classId: selectedStudent.classId,
      section: selectedStudent.section,
      rollNo: selectedStudent.rollNo,
      session: settings.academicYear,
      gpa: '5.00 (A+)',
      conduct: conduct.trim(),
      issueDate: new Date().toISOString().split('T')[0],
      issuedBy: issuedBy.trim() || settings.principalName,
      remarks: remarks.trim(),
    });

    toast.success(`${certType} generated successfully`);
    setShowAddModal(false);
  };

  const handleDelete = (c: StudentCertificate) => {
    if (confirm(`Delete certificate "${c.certificateNo}" for ${c.studentName}?`)) {
      onDeleteCertificate(c.id);
      toast.success('Certificate deleted');
    }
  };

  const handlePrint = (c: StudentCertificate) => {
    setPreviewCert(c);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* PRINT-ONLY OFFICIAL CERTIFICATE DOCUMENT                       */}
      {/* ============================================================== */}
      {previewCert && (
        <div className="hidden print:block fixed inset-0 bg-white p-12 z-[99999] text-black font-serif">
          <div className="border-8 border-double border-slate-900 p-10 min-h-[92vh] flex flex-col justify-between relative bg-[#fffdfa]">
            {/* Watermark Logo in center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-[160px] font-black tracking-widest text-slate-900">MH</span>
            </div>

            <div>
              {/* Top Header */}
              <div className="text-center pb-6 border-b-2 border-slate-900">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-black text-2xl flex items-center justify-center mx-auto mb-2 font-sans">
                  MH
                </div>
                <h1 className="text-3xl font-black uppercase tracking-wider text-slate-900">
                  {settings.schoolName}
                </h1>
                <p className="text-sm font-semibold text-slate-700 tracking-wide font-sans">{settings.subtitle}</p>
                <p className="text-xs text-slate-600 mt-1 font-sans">
                  {settings.address} • Tel: {settings.phone} • EIIN: {settings.eiinCode}
                </p>

                <div className="mt-5 inline-block border-2 border-slate-900 px-8 py-1.5 font-bold text-lg tracking-widest uppercase bg-slate-100">
                  {previewCert.certificateType.toUpperCase()}
                </div>
              </div>

              {/* Ref Number & Date */}
              <div className="flex justify-between items-center text-xs font-sans text-slate-700 mt-4 pb-2 border-b border-slate-300">
                <div>
                  <strong>Certificate Ref No:</strong> {previewCert.certificateNo}
                </div>
                <div>
                  <strong>Date of Issue:</strong> {formatDate(previewCert.issueDate)}
                </div>
              </div>

              {/* Certificate Body Paragraph */}
              <div className="mt-10 text-base leading-loose text-justify text-slate-900 px-4">
                <p>
                  This is to certify that{' '}
                  <strong className="text-lg underline underline-offset-4 uppercase tracking-wide">
                    {previewCert.studentName}
                  </strong>
                  , son/daughter of{' '}
                  <strong className="underline underline-offset-4">{previewCert.fatherName}</strong> and{' '}
                  <strong className="underline underline-offset-4">{previewCert.motherName || 'N/A'}</strong>,
                  bearing Student ID <strong className="font-mono">{previewCert.studentId}</strong>, was a bona fide
                  student of <strong>{settings.schoolName}</strong> in{' '}
                  <strong>{previewCert.classId}</strong> (Section {previewCert.section || 'A'}, Roll #{previewCert.rollNo}),
                  academic session <strong>{previewCert.session}</strong>.
                </p>

                <p className="mt-6">
                  During his/her stay in this institution, his/her moral conduct, character, and scholastic diligence have
                  been observed to be <strong className="underline underline-offset-4">{previewCert.conduct}</strong>.
                  He/She actively engaged in academic endeavors and maintained a commendable code of conduct.
                </p>

                {previewCert.remarks && (
                  <p className="mt-4 italic text-slate-800 text-sm">"{previewCert.remarks}"</p>
                )}

                <p className="mt-6">We wish him/her every happiness, prosperity, and success in all future life.</p>
              </div>
            </div>

            {/* Official Signatures & Seal */}
            <div className="pt-16 flex items-end justify-between text-xs px-4">
              <div className="text-center">
                <div className="w-36 border-b border-slate-800 mb-1"></div>
                <p className="font-bold font-sans">Administrative Officer</p>
                <p className="text-[10px] text-slate-500 font-sans">Checked & Prepared By</p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center text-[10px] text-slate-600 uppercase font-bold mx-auto mb-1 font-sans">
                  Official Seal
                </div>
                <p className="text-[10px] text-slate-500 font-sans">Institution Seal</p>
              </div>

              <div className="text-center">
                <div className="w-44 border-b border-slate-800 mb-1"></div>
                <p className="font-bold text-sm font-sans">{settings.principalName}</p>
                <p className="text-[11px] text-slate-600 font-sans">Principal / Head of Institution</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN UI: CERTIFICATE GENERATOR (100% NEUMORPHIC)            */}
      {/* ============================================================== */}

      {/* Header Banner */}
      <div className="neu-raised rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center neu-inset-sm shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Student Certificate Generator</h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Issue Testimonials, Character Certificates, and Transfer Certificates with official seal
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="neu-btn-primary px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Generate New Certificate
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="neu-raised rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search certificate by student name, serial number, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl neu-input text-xs font-semibold placeholder-slate-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Issued:</span>
            <span className="neu-inset-sm px-3 py-1 rounded-xl text-xs font-black text-blue-600">
              {certificates.length}
            </span>
          </div>
        </div>

        {/* Certificate Type Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
          {(['All', 'Testimonial', 'Character Certificate', 'Transfer Certificate'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedType === type
                  ? 'neu-inset text-blue-600 border border-blue-400/30'
                  : 'neu-btn text-slate-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCerts.map((cert) => (
          <div
            key={cert.id}
            className="neu-raised rounded-3xl p-6 flex flex-col justify-between hover:shadow-[10px_10px_22px_#cad1de,-10px_-10px_22px_#ffffff] transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="neu-inset-sm px-2.5 py-1 rounded-xl text-[10px] font-black uppercase text-blue-700 bg-blue-100">
                  {cert.certificateType}
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-500">{cert.certificateNo}</span>
              </div>

              {/* Student Name */}
              <h3 className="font-black text-slate-800 text-lg leading-snug mb-1">{cert.studentName}</h3>

              <p className="text-xs text-slate-500 font-semibold mb-3">
                {cert.classId} (Sec {cert.section}) • Roll #{cert.rollNo} • ID: {cert.studentId}
              </p>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-200/40 p-3 rounded-2xl neu-inset-sm mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Father Name</span>
                  <strong className="text-slate-800 truncate block">{cert.fatherName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Issue Date</span>
                  <strong className="text-slate-800 block">{formatDate(cert.issueDate)}</strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-300/60">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Conduct</span>
                  <span className="text-slate-700 text-xs italic">{cert.conduct}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500">By: {cert.issuedBy}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrint(cert)}
                  className="neu-btn px-3 py-1.5 rounded-xl font-bold text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                  title="Print Official Certificate"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Certificate
                </button>
                <button
                  onClick={() => handleDelete(cert)}
                  className="p-1.5 rounded-xl neu-btn text-rose-500 hover:text-rose-700"
                  title="Delete Certificate"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCerts.length === 0 && (
        <div className="neu-inset rounded-3xl p-12 text-center text-slate-500">
          <Award className="w-12 h-12 mx-auto text-slate-400 mb-3 opacity-60" />
          <h4 className="font-bold text-base text-slate-700">No certificates generated</h4>
          <p className="text-xs text-slate-600 mt-1">Click "Generate New Certificate" to create one.</p>
        </div>
      )}

      {/* Add Certificate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl w-full max-w-lg p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 rounded-2xl neu-btn text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-[3px_3px_8px_#cad1de]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg">Generate Student Certificate</h3>
                <p className="text-xs text-slate-600 font-medium">Issue official certified document</p>
              </div>
            </div>

            <form onSubmit={handleIssueCertificate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Certificate Type *</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as CertificateType)}
                  className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="Testimonial">Testimonial (প্রশংসাপত্র)</option>
                  <option value="Character Certificate">Character Certificate (চারিত্রিক সনদপত্র)</option>
                  <option value="Transfer Certificate">Transfer Certificate (ছাড়পত্র / TC)</option>
                  <option value="Appreciation Certificate">Appreciation Certificate (কৃতিত্ব সনদপত্র)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Student *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} — {s.classId} (Roll #{s.rollNo}) [{s.id}]
                    </option>
                  ))}
                </select>
              </div>

              {selectedStudent && (
                <div className="p-3 bg-slate-200/50 rounded-2xl neu-inset-sm text-xs space-y-1">
                  <p>
                    <span className="text-slate-500 font-bold">Father:</span>{' '}
                    <strong>{selectedStudent.fatherName || 'Guardian'}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500 font-bold">Mother:</span>{' '}
                    <strong>{selectedStudent.motherName || 'N/A'}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500 font-bold">Class & Roll:</span>{' '}
                    <strong>
                      {selectedStudent.classId} (Sec {selectedStudent.section}), Roll #{selectedStudent.rollNo}
                    </strong>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Moral Conduct & Character</label>
                <input
                  type="text"
                  required
                  value={conduct}
                  onChange={(e) => setConduct(e.target.value)}
                  placeholder="e.g. Exemplary, polite, and disciplined moral character"
                  className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-semibold text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Remarks / Testimonial Text</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Additional commendations on academic proficiency or extracurricular excellence..."
                  className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-medium text-slate-800 outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Authorized Issuer / Signer</label>
                <input
                  type="text"
                  value={issuedBy}
                  onChange={(e) => setIssuedBy(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-2xl neu-btn text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl neu-btn-primary text-xs font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Issue Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
