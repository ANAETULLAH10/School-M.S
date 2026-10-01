import React, { useState } from 'react';
import { X, Send, Copy, MessageSquare, Check, Phone, MessageCircle } from 'lucide-react';
import { Student, FeeInvoice, SchoolSettings, Language } from '../../types';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../services/exportUtils';

interface SMSDraftModalProps {
  students: Student[];
  invoices: FeeInvoice[];
  settings: SchoolSettings;
  lang: Language;
  onClose: () => void;
}

type SMSType = 'absent' | 'fee_due' | 'exam' | 'general';

export const SMSDraftModal: React.FC<SMSDraftModalProps> = ({
  students,
  invoices,
  settings,
  lang,
  onClose,
}) => {
  const toast = useToast();
  const [smsType, setSMSType] = useState<SMSType>('absent');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentDueInvoices = invoices.filter(
    (i) => activeStudent && i.studentId === activeStudent.id && i.dueAmount > 0
  );
  const totalStudentDue = studentDueInvoices.reduce((acc, i) => acc + i.dueAmount, 0);

  // Generate dynamic SMS draft
  const getDraftMessage = (): string => {
    if (!activeStudent) return '';
    const schoolTitle = settings.schoolName || 'MH ENGLISH PRIVATE HOME';
    const today = new Date().toLocaleDateString('en-GB');

    switch (smsType) {
      case 'absent':
        return `Dear Guardian, your ward ${activeStudent.firstName} ${activeStudent.lastName} (Roll: ${activeStudent.rollNo}, Class: ${activeStudent.classId}) was ABSENT from classes today (${today}). Please contact the office for any inquiries. - ${schoolTitle}`;

      case 'fee_due':
        return `Dear Guardian, outstanding tuition fee of ${formatCurrency(
          totalStudentDue > 0 ? totalStudentDue : 2500
        )} for ${activeStudent.firstName} ${activeStudent.lastName} (ID: ${
          activeStudent.id
        }) is currently due. Kindly clear the dues before the deadline. Thank you. - ${schoolTitle}`;

      case 'exam':
        return `Dear Guardian, the upcoming Examination for Class ${activeStudent.classId} is scheduled to commence shortly. Please ensure your child ${activeStudent.firstName} prepares well and collects their Admit Card. - ${schoolTitle}`;

      case 'general':
        return `Notice from ${schoolTitle}: Please be informed that regular academic classes will follow the revised schedule. For further queries, please call ${settings.phone}.`;
    }
  };

  const messageText = getDraftMessage();
  const targetPhone = activeStudent?.phone || activeStudent?.guardianPhone || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    toast.success('SMS template copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSMS = () => {
    if (!targetPhone) {
      toast.error('No contact phone number found for this student');
      return;
    }
    const cleanPhone = targetPhone.replace(/[^0-9+]/g, '');
    window.open(`sms:${cleanPhone}?body=${encodeURIComponent(messageText)}`, '_blank');
  };

  const handleSendWhatsApp = () => {
    if (!targetPhone) {
      toast.error('No contact phone number found for this student');
      return;
    }
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-lg w-full p-6 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
          <div className="flex items-center gap-2.5">
            <div className="neu-inset-sm p-2 rounded-xl text-blue-600">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base">
                {lang === 'bn' ? 'অভিভাবকদের SMS ড্রাফটার' : 'Automated SMS Alerts & Notices'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Generate instant alerts for absence, dues & notices</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="neu-btn p-1.5 rounded-xl text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* SMS Type Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Select Alert Type</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {[
                { id: 'absent', label: 'Absent Notice' },
                { id: 'fee_due', label: 'Fee Due Reminder' },
                { id: 'exam', label: 'Exam Announcement' },
                { id: 'general', label: 'General Circular' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSMSType(item.id as SMSType)}
                  className={`py-2 px-3 rounded-xl transition-all ${
                    smsType === item.id
                      ? 'neu-inset text-blue-700 font-black'
                      : 'neu-btn text-slate-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Student Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="neu-input w-full px-3.5 py-2 text-xs font-bold rounded-xl"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.firstName} {st.lastName} ({st.classId} - Roll {st.rollNo}) | Phone: {st.phone || st.guardianPhone || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          {/* Contact Details summary */}
          <div className="neu-inset-sm rounded-2xl p-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Recipient Guardian:</span>
              <span className="font-bold text-slate-800">
                {activeStudent?.guardianName || activeStudent?.fatherName || 'Guardian'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Phone Number:</span>
              <span className="font-bold text-blue-700 font-mono">{targetPhone || 'Not provided'}</span>
            </div>
            {smsType === 'fee_due' && (
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Current Due Balance:</span>
                <span className="font-bold text-rose-600 font-mono">
                  {formatCurrency(totalStudentDue > 0 ? totalStudentDue : 2500)}
                </span>
              </div>
            )}
          </div>

          {/* Preview Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">SMS Message Preview</label>
            <div className="neu-inset rounded-2xl p-4 bg-white/40">
              <p className="text-xs text-slate-800 font-medium leading-relaxed font-mono whitespace-pre-line">
                {messageText}
              </p>
              <div className="text-[10px] text-slate-400 font-mono text-right mt-2">
                Characters: {messageText.length} ({Math.ceil(messageText.length / 160)} SMS)
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
            <button
              onClick={handleCopy}
              className="neu-btn px-4 py-2 text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSendWhatsApp}
                className="neu-btn px-3.5 py-2 text-xs font-bold text-emerald-700 rounded-xl inline-flex items-center gap-1.5"
                title="Send via WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleSendSMS}
                className="neu-btn-primary px-4 py-2 text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send SMS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
