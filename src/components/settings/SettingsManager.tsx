import React, { useState } from 'react';
import {
  Settings,
  School,
  Calendar,
  Wallet,
  GraduationCap,
  Save,
  RotateCcw,
  CheckCircle,
  Shield,
} from 'lucide-react';
import { SchoolSettings, GradingRule } from '../../types';
import { useToast } from '../../context/ToastContext';

interface SettingsManagerProps {
  settings: SchoolSettings;
  gradingRules: GradingRule[];
  onSaveSettings: (settings: SchoolSettings) => void;
  onSaveGrading: (rules: GradingRule[]) => void;
  onResetDemoData: () => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  settings,
  gradingRules,
  onSaveSettings,
  onSaveGrading,
  onResetDemoData,
}) => {
  const toast = useToast();

  const [activeSection, setActiveSection] = useState<'school' | 'academic' | 'grading' | 'system'>('school');

  // School Info
  const [schoolName, setSchoolName] = useState(settings.schoolName || 'MH ENGLISH PRIVATE HOME');
  const [subtitle, setSubtitle] = useState(settings.subtitle || 'Management System');
  const [logoText, setLogoText] = useState(settings.logoText || 'MH');
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [website, setWebsite] = useState(settings.website);
  const [principalName, setPrincipalName] = useState(settings.principalName);
  const [eiinCode, setEiinCode] = useState(settings.eiinCode);

  // Academic
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [currentSession, setCurrentSession] = useState(settings.currentSession);
  const [currency, setCurrency] = useState(settings.currency);

  // Grading rules
  const [rules, setRules] = useState<GradingRule[]>(gradingRules);

  const handleSaveSchoolInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      schoolName: schoolName.trim(),
      subtitle: subtitle.trim(),
      logoText: logoText.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
      principalName: principalName.trim(),
      eiinCode: eiinCode.trim(),
      academicYear: academicYear.trim(),
      currentSession: currentSession.trim(),
      currency: currency.trim() || '৳',
    });
    toast.success('School settings updated successfully');
  };

  const handleGradeRuleChange = (index: number, field: keyof GradingRule, value: string | number) => {
    const updated = [...rules];
    updated[index] = {
      ...updated[index],
      [field]: field === 'gradePoint' || field === 'minMarks' || field === 'maxMarks' ? Number(value) : value,
    };
    setRules(updated);
  };

  const handleSaveGrading = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGrading(rules);
    toast.success('Grading rules and GPA scale updated');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset demo data? This will restore initial students, classes, and settings.')) {
      onResetDemoData();
      toast.success('Reset to demo data completed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">System Settings</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure institutional details, grading parameters, academic sessions, and data maintenance
        </p>
      </div>

      {/* Tactile Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'school', label: 'School Profile', icon: School },
          { id: 'academic', label: 'Academic & Billing', icon: Calendar },
          { id: 'grading', label: 'Grading Scale & GPA', icon: GraduationCap },
          { id: 'system', label: 'Database & Reset', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'neu-inset text-blue-700 font-black'
                  : 'neu-btn text-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: School Profile */}
      {activeSection === 'school' && (
        <div className="neu-raised rounded-3xl p-6">
          <form onSubmit={handleSaveSchoolInfo} className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200/50">
              <div className="neu-inset-sm p-3 rounded-2xl text-blue-600">
                <School className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-base">Institution Information</h3>
                <p className="text-xs text-slate-500">Official institution title, branding, and contact details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  School Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-black text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Application Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Logo Acronym / Initials
                </label>
                <input
                  type="text"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-mono font-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Principal / Headmaster Name
                </label>
                <input
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  School Website URL
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Government EIIN Number
                </label>
                <input
                  type="text"
                  value={eiinCode}
                  onChange={(e) => setEiinCode(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Campus Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="neu-btn-primary px-6 py-2.5 text-xs font-bold rounded-2xl inline-flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save School Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Academic & Billing */}
      {activeSection === 'academic' && (
        <div className="neu-raised rounded-3xl p-6">
          <form onSubmit={handleSaveSchoolInfo} className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200/50">
              <div className="neu-inset-sm p-3 rounded-2xl text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-base">Academic Session & Currency</h3>
                <p className="text-xs text-slate-500">Configure academic years, billing currency symbols, and fee terms</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Active Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Academic Session Span
                </label>
                <input
                  type="text"
                  value={currentSession}
                  onChange={(e) => setCurrentSession(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-black text-blue-700 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="neu-btn-primary px-6 py-2.5 text-xs font-bold rounded-2xl inline-flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Academic Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Grading Scale */}
      {activeSection === 'grading' && (
        <div className="neu-raised rounded-3xl p-6">
          <form onSubmit={handleSaveGrading} className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200/50">
              <div className="neu-inset-sm p-3 rounded-2xl text-blue-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-base">Grading Scale & GPA Rules</h3>
                <p className="text-xs text-slate-500">Configure letter grades, minimum marks boundaries, and grade points</p>
              </div>
            </div>

            <div className="neu-inset rounded-3xl overflow-hidden p-2">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Min Marks</th>
                    <th className="py-2.5 px-3">Max Marks</th>
                    <th className="py-2.5 px-3">Grade Point</th>
                    <th className="py-2.5 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rules.map((rule, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={rule.grade}
                          onChange={(e) => handleGradeRuleChange(idx, 'grade', e.target.value)}
                          className="neu-input w-16 px-2 py-1 text-xs rounded-lg font-black text-blue-700"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={rule.minMarks}
                          onChange={(e) => handleGradeRuleChange(idx, 'minMarks', e.target.value)}
                          className="neu-input w-16 px-2 py-1 text-xs rounded-lg font-mono font-bold"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={rule.maxMarks}
                          onChange={(e) => handleGradeRuleChange(idx, 'maxMarks', e.target.value)}
                          className="neu-input w-16 px-2 py-1 text-xs rounded-lg font-mono font-bold"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.1"
                          value={rule.gradePoint}
                          onChange={(e) => handleGradeRuleChange(idx, 'gradePoint', e.target.value)}
                          className="neu-input w-16 px-2 py-1 text-xs rounded-lg font-mono font-bold text-emerald-700"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={rule.remarks}
                          onChange={(e) => handleGradeRuleChange(idx, 'remarks', e.target.value)}
                          className="neu-input w-full px-2 py-1 text-xs rounded-lg"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="neu-btn-primary px-6 py-2.5 text-xs font-bold rounded-2xl inline-flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Grading System</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: Database & Reset */}
      {activeSection === 'system' && (
        <div className="neu-raised rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200/50">
            <div className="neu-inset-sm p-3 rounded-2xl text-rose-600">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base">Database Maintenance & Demo Data</h3>
              <p className="text-xs text-slate-500">Manage persistent browser storage or reset to initial demonstration state</p>
            </div>
          </div>

          <div className="neu-inset rounded-2xl p-5 space-y-3">
            <h4 className="font-black text-slate-800 text-sm">Storage Persistence Status</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              All students, attendance records, invoices, exams, results, admissions, and faculty data are automatically saved to persistent browser storage. Changes synchronize live across tabs and navigation views.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 pt-1">
              <CheckCircle className="w-4 h-4" />
              <span>LocalStorage Persistence Active</span>
            </div>
          </div>

          <div className="neu-inset rounded-2xl p-5 border border-rose-200/40 space-y-3">
            <h4 className="font-black text-rose-700 text-sm">Reset Demo Records</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Reset all student, teacher, class, and fee records to the default demonstration seed for MH ENGLISH PRIVATE HOME.
            </p>
            <button
              onClick={handleReset}
              className="neu-btn-danger px-4 py-2 text-xs font-bold rounded-2xl inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database to Default</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
