import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Smartphone,
  Users,
  CheckCircle2,
  Clock,
  Trash2,
  Sparkles,
  Search,
  Filter,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { SmsLog, Student, SchoolClass, Teacher, SchoolSettings } from '../../types';
import { formatDate } from '../../services/exportUtils';
import { useToast } from '../../context/ToastContext';

interface SmsBroadcastManagerProps {
  smsLogs: SmsLog[];
  students: Student[];
  classes: SchoolClass[];
  teachers: Teacher[];
  settings: SchoolSettings;
  onSendSms: (log: Omit<SmsLog, 'id'> & { id?: string }) => void;
  onClearLogs: () => void;
}

export const SmsBroadcastManager: React.FC<SmsBroadcastManagerProps> = ({
  smsLogs,
  students,
  classes,
  teachers,
  settings,
  onSendSms,
  onClearLogs,
}) => {
  const toast = useToast();

  const [recipientType, setRecipientType] = useState<'All Parents' | 'Class' | 'Single Student' | 'Teachers'>('All Parents');
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.name || 'Class 10');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [message, setMessage] = useState(
    `Dear Guardian, First Term Examination 2026 of ${settings.schoolName} will commence soon. Please collect your ward's admit card. Regards, Principal.`
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Character calculation
  const charLength = message.length;
  const smsUnits = Math.ceil(charLength / 160) || 1;

  // Calculate recipient count
  let recipientCount = 0;
  let targetPhone = '+880 17XXXXXXXX (All)';
  if (recipientType === 'All Parents') {
    recipientCount = students.length;
    targetPhone = `All Registered Parents (${students.length} Guardians)`;
  } else if (recipientType === 'Class') {
    const classStudents = students.filter((s) => s.classId === selectedClass);
    recipientCount = classStudents.length;
    targetPhone = `${selectedClass} Parents (${recipientCount} Guardians)`;
  } else if (recipientType === 'Single Student') {
    recipientCount = 1;
    targetPhone = selectedStudent?.phone || selectedStudent?.fatherPhone || '+880 1711-XXXXXX';
  } else if (recipientType === 'Teachers') {
    recipientCount = teachers.length;
    targetPhone = `Faculty & Staff (${teachers.length} Teachers)`;
  }

  // Quick templates
  const loadTemplate = (tmpl: string) => {
    setMessage(tmpl);
    toast.success('Template loaded into composer');
  };

  const handleSendBroadcast = () => {
    if (!message.trim()) {
      toast.error('Please enter a message text');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      onSendSms({
        recipientType,
        targetClass: recipientType === 'Class' ? selectedClass : undefined,
        recipientName:
          recipientType === 'Single Student' && selectedStudent
            ? `${selectedStudent.firstName} ${selectedStudent.lastName} (${selectedStudent.fatherName || 'Guardian'})`
            : undefined,
        recipientPhone: targetPhone,
        message: message.trim(),
        sentAt: new Date().toISOString(),
        status: 'Delivered',
        smsCount: recipientCount,
      });

      setIsSending(false);
      toast.success(`Broadcast successfully dispatched to ${recipientCount} recipients!`);
    }, 600);
  };

  const filteredLogs = smsLogs.filter((l) => {
    return (
      l.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.recipientType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.recipientName && l.recipientName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neu-raised rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center neu-inset-sm shrink-0">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">SMS & Notification Broadcast</h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Send instant bulk SMS alerts, fee reminders, exam notifications, and attendance SMS to parents
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="neu-inset-sm px-4 py-2 rounded-2xl text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">SMS Gateway Status</span>
            <span className="text-xs font-black text-emerald-600 flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected & Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Composer & Mobile Phone Live Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: SMS Composer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="neu-raised rounded-3xl p-6 space-y-5">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              Compose SMS Broadcast
            </h3>

            {/* Recipient Audience Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Target Recipient Group *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['All Parents', 'Class', 'Single Student', 'Teachers'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRecipientType(type)}
                    className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all ${
                      recipientType === type
                        ? 'neu-inset text-blue-600 border border-blue-400/30'
                        : 'neu-btn text-slate-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Contextual Selector based on recipientType */}
            {recipientType === 'Class' && (
              <div className="p-3 bg-slate-200/40 rounded-2xl neu-inset-sm">
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Target Class:</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl neu-input text-xs font-bold text-slate-800 outline-none"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({students.filter((s) => s.classId === c.name).length} students)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {recipientType === 'Single Student' && (
              <div className="p-3 bg-slate-200/40 rounded-2xl neu-inset-sm">
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Student & Guardian:</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl neu-input text-xs font-bold text-slate-800 outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} — {s.classId} (Roll #{s.rollNo}) [{s.phone || 'No phone'}]
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quick Templates Buttons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Quick SMS Templates:
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    loadTemplate(
                      `Dear Guardian, your ward was marked ABSENT today (${new Date().toLocaleDateString()}) at ${settings.schoolName}. Kindly inform the principal office.`
                    )
                  }
                  className="neu-btn px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-700 hover:text-blue-600"
                >
                  Absent Alert
                </button>

                <button
                  type="button"
                  onClick={() =>
                    loadTemplate(
                      `Dear Guardian, tuition fees for this month are due. Please clear outstanding balance before the 10th to avoid late fee. Regards, ${settings.schoolName}.`
                    )
                  }
                  className="neu-btn px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-700 hover:text-blue-600"
                >
                  Fee Reminder
                </button>

                <button
                  type="button"
                  onClick={() =>
                    loadTemplate(
                      `Notice: Term Examination 2026 starts from May 10. Admit cards are available in office. Please ensure fees cleared. ${settings.schoolName}.`
                    )
                  }
                  className="neu-btn px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-700 hover:text-blue-600"
                >
                  Exam Schedule
                </button>

                <button
                  type="button"
                  onClick={() =>
                    loadTemplate(
                      `Dear Parents, ${settings.schoolName} will remain closed tomorrow due to official holiday. Regular classes resume day after.`
                    )
                  }
                  className="neu-btn px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-700 hover:text-blue-600"
                >
                  Holiday Alert
                </button>
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">SMS Body Text *</label>
                <span className="text-[11px] font-bold text-slate-500">
                  {charLength} characters • <strong>{smsUnits} SMS Unit{smsUnits > 1 ? 's' : ''}</strong>
                </span>
              </div>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your SMS message here..."
                className="w-full px-4 py-3 rounded-2xl neu-input text-xs font-medium text-slate-800 outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Broadcast Summary Box & Send Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                <span>Sending to: </span>
                <strong className="text-slate-800">{targetPhone}</strong>
              </div>

              <button
                type="button"
                disabled={isSending}
                onClick={handleSendBroadcast}
                className="neu-btn-primary px-6 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'Transmitting Broadcast...' : `Send SMS (${recipientCount} Recipients)`}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Mobile Handset Live Preview Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-blue-600" />
            Live Guardian Handset Preview
          </div>

          {/* Neumorphic Phone Chasis */}
          <div className="w-[300px] h-[520px] rounded-[45px] neu-raised-lg bg-[#ebf0f7] p-4 flex flex-col justify-between border-4 border-slate-300/60 shadow-[18px_18px_35px_#cad1de,-18px_-18px_35px_#ffffff] relative">
            {/* Phone Speaker & Camera Notch */}
            <div className="w-24 h-4 rounded-full bg-slate-300/80 mx-auto mb-3 neu-inset-sm flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mr-2" />
              <div className="w-10 h-1 rounded-full bg-slate-400" />
            </div>

            {/* Phone Screen Display */}
            <div className="flex-1 bg-white rounded-3xl neu-inset p-4 flex flex-col justify-between overflow-hidden border border-slate-200">
              {/* Message Header */}
              <div className="text-center pb-2 border-b border-slate-200">
                <span className="text-[10px] font-black text-slate-800 tracking-wider uppercase block truncate">
                  {settings.schoolName}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">SMS Service • Today</span>
              </div>

              {/* Message Bubble Container */}
              <div className="flex-1 py-4 flex flex-col justify-end space-y-2">
                <div className="max-w-[90%] bg-blue-600 text-white rounded-2xl rounded-bl-sm p-3 shadow-md self-start text-xs leading-relaxed font-sans animate-fade-in">
                  <p className="whitespace-pre-line text-[11px] leading-relaxed">
                    {message || 'Type message in composer to see live guardian preview...'}
                  </p>
                  <div className="text-[8px] text-blue-200 text-right mt-1 font-mono">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Delivered
                  </div>
                </div>
              </div>

              {/* Fake SMS Input bar at bottom */}
              <div className="bg-slate-100 rounded-full px-3 py-1.5 text-[9px] text-slate-400 border border-slate-200 flex justify-between items-center">
                <span>Text message</span>
                <Send className="w-3 h-3 text-blue-500" />
              </div>
            </div>

            {/* Home Pill Indicator */}
            <div className="w-20 h-1.5 rounded-full bg-slate-400 mx-auto mt-3" />
          </div>
        </div>
      </div>

      {/* Broadcast History & Logs Table */}
      <div className="neu-raised rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/60">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-800 text-base">Broadcast History & Transmission Logs</h3>
            <span className="neu-inset-sm px-2.5 py-0.5 rounded-xl text-xs font-extrabold text-blue-600">
              {smsLogs.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search SMS logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl neu-input text-xs font-semibold placeholder-slate-400 outline-none"
              />
            </div>

            {smsLogs.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear all SMS logs?')) {
                    onClearLogs();
                    toast.success('SMS transmission logs cleared');
                  }
                }}
                className="neu-btn px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Logs
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Target Audience</th>
                <th className="py-3 px-3">Recipient Details</th>
                <th className="py-3 px-3">Message Content</th>
                <th className="py-3 px-3 text-center">Recipients</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-200/30 transition-colors">
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                    {formatDate(log.sentAt)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="neu-inset-sm px-2 py-0.5 rounded-lg text-[10px] font-black uppercase text-blue-700 bg-blue-100">
                      {log.recipientType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-semibold truncate max-w-[160px]">
                    {log.recipientName ? `${log.recipientName} • ` : ''}
                    {log.recipientPhone}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-normal max-w-xs truncate" title={log.message}>
                    {log.message}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                    {log.smsCount}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 neu-inset-sm px-2 py-0.5 rounded-lg">
                      <CheckCircle2 className="w-3 h-3" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="neu-inset rounded-2xl p-8 text-center text-slate-500 text-xs">
            No SMS broadcast logs recorded yet. Send your first broadcast above!
          </div>
        )}
      </div>
    </div>
  );
};
