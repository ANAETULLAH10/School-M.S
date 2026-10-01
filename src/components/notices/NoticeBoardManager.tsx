import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Printer,
  Calendar,
  User,
  Trash2,
  X,
  Save,
  AlertCircle,
  Megaphone,
  CheckCircle,
} from 'lucide-react';
import { Notice, NoticeCategory, NoticePriority, SchoolSettings } from '../../types';
import { formatDate } from '../../services/exportUtils';
import { useToast } from '../../context/ToastContext';

interface NoticeBoardManagerProps {
  notices: Notice[];
  settings: SchoolSettings;
  onSaveNotice: (notice: Omit<Notice, 'id' | 'createdAt'> & { id?: string }) => void;
  onDeleteNotice: (id: string) => void;
}

export const NoticeBoardManager: React.FC<NoticeBoardManagerProps> = ({
  notices,
  settings,
  onSaveNotice,
  onDeleteNotice,
}) => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [printingNotice, setPrintingNotice] = useState<Notice | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('All');
  const [priority, setPriority] = useState<NoticePriority>('Normal');
  const [content, setContent] = useState('');
  const [publishDate, setPublishDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [author, setAuthor] = useState('Principal Office');

  // Filter notices
  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesPri = selectedPriority === 'All' || n.priority === selectedPriority;
    return matchesSearch && matchesCat && matchesPri;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter notice title and content');
      return;
    }

    onSaveNotice({
      title: title.trim(),
      category,
      priority,
      content: content.trim(),
      publishDate,
      author: author.trim() || 'Principal Office',
    });

    toast.success('Notice published successfully');
    setShowAddModal(false);
    setTitle('');
    setContent('');
  };

  const handleDelete = (notice: Notice) => {
    if (confirm(`Are you sure you want to remove notice: "${notice.title}"?`)) {
      onDeleteNotice(notice.id);
      toast.success('Notice deleted');
    }
  };

  const handlePrint = (notice: Notice) => {
    setPrintingNotice(notice);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Metrics
  const totalCount = notices.length;
  const urgentCount = notices.filter((n) => n.priority === 'Urgent').length;
  const holidayCount = notices.filter((n) => n.priority === 'Holiday').length;

  return (
    <div className="space-y-6">
      {/* Printable Notice Paper (Visible during Print) */}
      {printingNotice && (
        <div className="hidden print:block fixed inset-0 bg-white p-10 z-[9999] text-black font-serif">
          <div className="border-4 border-double border-slate-900 p-8 min-h-[90vh] flex flex-col justify-between">
            <div>
              <div className="text-center pb-6 border-b-2 border-slate-800">
                <h1 className="text-3xl font-black tracking-wider uppercase">{settings.schoolName}</h1>
                <p className="text-sm font-semibold text-slate-700 tracking-wide">{settings.subtitle}</p>
                <p className="text-xs text-slate-600 mt-1">{settings.address} • Tel: {settings.phone}</p>
                <div className="inline-block mt-4 px-6 py-1 bg-slate-900 text-white font-bold text-sm tracking-widest uppercase">
                  OFFICIAL NOTICE BULLETIN
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-700 mt-6 pb-2 border-b border-slate-300 font-sans">
                <div><strong>Ref / ID:</strong> {printingNotice.id}</div>
                <div><strong>Audience:</strong> {printingNotice.category}</div>
                <div><strong>Date:</strong> {formatDate(printingNotice.publishDate)}</div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-slate-900 leading-snug text-center underline decoration-slate-400 underline-offset-8">
                  {printingNotice.title}
                </h2>

                <div className="mt-8 text-base leading-relaxed text-slate-800 whitespace-pre-line text-justify font-sans">
                  {printingNotice.content}
                </div>
              </div>
            </div>

            <div className="pt-12 flex justify-between items-end text-sm">
              <div className="text-center">
                <div className="w-32 border-b border-slate-800 mb-1"></div>
                <p className="text-xs text-slate-600 font-sans">Notice Issued By</p>
                <p className="font-bold">{printingNotice.author}</p>
              </div>

              <div className="text-center">
                <div className="w-40 border-b border-slate-800 mb-1"></div>
                <p className="text-xs text-slate-600 font-sans">Authorized Signature</p>
                <p className="font-bold">{settings.principalName}</p>
                <p className="text-[11px] text-slate-600">Principal / Headmaster</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner & KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="neu-raised rounded-3xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Notices</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{totalCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100/60 neu-inset-sm flex items-center justify-center text-blue-600">
            <Megaphone className="w-6 h-6" />
          </div>
        </div>

        <div className="neu-raised rounded-3xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Urgent Alerts</p>
            <p className="text-3xl font-black text-rose-600 mt-1">{urgentCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100/60 neu-inset-sm flex items-center justify-center text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="neu-raised rounded-3xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Holidays & Events</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{holidayCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100/60 neu-inset-sm flex items-center justify-center text-amber-600">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="neu-raised rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notices by title, content or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl neu-input text-xs font-semibold placeholder-slate-400 outline-none"
            />
          </div>

          {/* New Notice Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="neu-btn-primary px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Publish Notice
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            Audience:
          </div>
          {(['All', 'Students', 'Teachers', 'Parents'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'neu-inset text-blue-600 border border-blue-400/30'
                  : 'neu-btn text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-300 mx-2 hidden sm:block" />

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            Priority:
          </div>
          {(['All', 'Normal', 'Urgent', 'Holiday'] as const).map((pri) => (
            <button
              key={pri}
              onClick={() => setSelectedPriority(pri)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPriority === pri
                  ? 'neu-inset text-blue-600 border border-blue-400/30'
                  : 'neu-btn text-slate-600'
              }`}
            >
              {pri}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotices.map((notice) => {
          const isUrgent = notice.priority === 'Urgent';
          const isHoliday = notice.priority === 'Holiday';

          return (
            <div
              key={notice.id}
              className="neu-raised rounded-3xl p-6 flex flex-col justify-between hover:shadow-[10px_10px_22px_#cad1de,-10px_-10px_22px_#ffffff] transition-all"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl ${
                        isUrgent
                          ? 'bg-rose-100 text-rose-700 neu-inset-sm'
                          : isHoliday
                          ? 'bg-amber-100 text-amber-700 neu-inset-sm'
                          : 'bg-blue-100 text-blue-700 neu-inset-sm'
                      }`}
                    >
                      {notice.priority}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-lg neu-inset-sm">
                      For: {notice.category}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {formatDate(notice.publishDate)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 mb-2">
                  {notice.title}
                </h3>

                {/* Content */}
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-4 whitespace-pre-line mb-4 font-normal">
                  {notice.content}
                </p>
              </div>

              {/* Footer info & actions */}
              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  {notice.author}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrint(notice)}
                    className="neu-btn px-2.5 py-1.5 rounded-xl font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1"
                    title="Print Official Notice"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </button>
                  <button
                    onClick={() => handleDelete(notice)}
                    className="neu-btn px-2.5 py-1.5 rounded-xl font-bold text-rose-500 hover:text-rose-700"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNotices.length === 0 && (
        <div className="neu-inset rounded-3xl p-12 text-center text-slate-500">
          <Bell className="w-12 h-12 mx-auto text-slate-400 mb-3 opacity-60" />
          <h4 className="font-bold text-base text-slate-700">No notices found</h4>
          <p className="text-xs text-slate-600 mt-1">Try changing filters or publish a new notice.</p>
        </div>
      )}

      {/* Publish Notice Modal */}
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
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg">Publish Notice</h3>
                <p className="text-xs text-slate-600 font-medium">Issue official announcement for students & parents</p>
              </div>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. First Term Examination Schedule 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-semibold text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Audience</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                    className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="All">All School</option>
                    <option value="Students">Students Only</option>
                    <option value="Teachers">Teachers Only</option>
                    <option value="Parents">Parents / Guardians</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as NoticePriority)}
                    className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="Normal">Normal Notice</option>
                    <option value="Urgent">Urgent Alert</option>
                    <option value="Holiday">Holiday Announcement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Issued By / Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Principal Office"
                    className="w-full px-4 py-2 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Content *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Write complete notice details, exam instructions or holiday duration..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-medium text-slate-800 outline-none resize-none leading-relaxed"
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
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
