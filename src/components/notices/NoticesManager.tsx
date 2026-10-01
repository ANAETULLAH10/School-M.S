import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Search,
  Printer,
  Trash2,
  Calendar,
  AlertTriangle,
  Info,
  Award,
  X,
  Save,
  CheckCircle,
} from 'lucide-react';
import { Notice, NoticeCategory, NoticePriority, SchoolSettings, Language } from '../../types';
import { formatDate } from '../../services/exportUtils';
import { useToast } from '../../context/ToastContext';
import { t } from '../../services/translations';

interface NoticesManagerProps {
  notices: Notice[];
  settings: SchoolSettings;
  lang: Language;
  onSaveNotice: (notice: Omit<Notice, 'id' | 'createdAt'> & { id?: string }) => void;
  onDeleteNotice: (id: string) => void;
}

export const NoticesManager: React.FC<NoticesManagerProps> = ({
  notices,
  settings,
  lang,
  onSaveNotice,
  onDeleteNotice,
}) => {
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  const [showAddModal, setShowAddModal] = useState(false);
  const [printingNotice, setPrintingNotice] = useState<Notice | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('All');
  const [priority, setPriority] = useState<NoticePriority>('Normal');
  const [content, setContent] = useState('');
  const [publishDate, setPublishDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [author, setAuthor] = useState('Principal Office');

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Notice title and description are required');
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

    toast.success('Notice published to school circular board');
    setShowAddModal(false);
    setTitle('');
    setContent('');
  };

  const filteredNotices = notices.filter((n) => {
    const q = search.toLowerCase();
    const matchesSearch = n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'All' || n.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || n.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {lang === 'bn' ? 'নোটিশ বোর্ড ও সার্কুলার' : 'Notice Board & Circulars'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {lang === 'bn'
              ? 'স্কুলের ছুটি, পরীক্ষা, জরুরি ঘোষণা ও নোটিশ পরিচালনা করুন'
              : 'Broadcast official announcements, holiday circulars, and exam notifications'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'bn' ? '+ নতুন নোটিশ' : '+ Publish Notice'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="neu-raised rounded-3xl p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={lang === 'bn' ? 'নোটিশ খুঁজুন...' : 'Search notices by title or keywords...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="neu-input w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="neu-input px-3.5 py-2 text-xs font-semibold rounded-xl"
          >
            <option value="All">{lang === 'bn' ? 'সকল প্রাপক' : 'All Audiences'}</option>
            <option value="Students">{lang === 'bn' ? 'শিক্ষার্থী' : 'Students'}</option>
            <option value="Teachers">{lang === 'bn' ? 'শিক্ষক' : 'Teachers'}</option>
            <option value="Parents">{lang === 'bn' ? 'অভিভাবক' : 'Parents'}</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="neu-input px-3.5 py-2 text-xs font-semibold rounded-xl"
          >
            <option value="All">{lang === 'bn' ? 'সকল অগ্রাধিকার' : 'All Priorities'}</option>
            <option value="Urgent">{lang === 'bn' ? 'জরুরি' : 'Urgent'}</option>
            <option value="Holiday">{lang === 'bn' ? 'ছুটি' : 'Holiday'}</option>
            <option value="Normal">{lang === 'bn' ? 'সাধারণ' : 'Normal'}</option>
          </select>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotices.length === 0 ? (
          <div className="col-span-full neu-raised rounded-3xl p-12 text-center text-slate-500 text-xs font-semibold">
            {lang === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি।' : 'No notices match your filter. Click "+ Publish Notice" to post a new circular.'}
          </div>
        ) : (
          filteredNotices.map((n) => {
            const isUrgent = n.priority === 'Urgent';
            const isHoliday = n.priority === 'Holiday';

            return (
              <div
                key={n.id}
                className="neu-raised rounded-3xl p-5 hover:neu-raised-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Notice Pill & Priority */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`neu-inset-sm px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        isUrgent
                          ? 'text-rose-700'
                          : isHoliday
                          ? 'text-amber-700'
                          : 'text-blue-700'
                      }`}
                    >
                      {isUrgent && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                      {isHoliday && <Calendar className="w-3 h-3 text-amber-600" />}
                      {!isUrgent && !isHoliday && <Info className="w-3 h-3 text-blue-600" />}
                      <span>{n.priority}</span>
                    </span>

                    <span className="neu-inset-sm px-2.5 py-0.5 rounded-xl text-[10px] font-bold text-slate-600">
                      For: {n.category}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-800 text-base leading-snug line-clamp-2 mb-2">
                    {n.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-4">
                    {n.content}
                  </p>
                </div>

                {/* Footer details & Action */}
                <div className="pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      {formatDate(n.publishDate)}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 block truncate max-w-[140px]">
                      By: {n.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPrintingNotice(n)}
                      className="neu-btn p-2 text-slate-600 hover:text-blue-700 rounded-xl"
                      title={lang === 'bn' ? 'প্রিন্ট সার্কুলার' : 'Print Circular'}
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete notice "${n.title}"?`)) {
                          onDeleteNotice(n.id);
                          toast.info('Notice removed');
                        }
                      }}
                      className="neu-btn p-2 text-slate-500 hover:text-rose-600 rounded-xl"
                      title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete Notice'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add New Notice */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
              <div>
                <h3 className="font-black text-slate-800 text-base">
                  {lang === 'bn' ? 'নতুন নোটিশ প্রকাশ করুন' : 'Publish School Notice'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Broadcast to students, guardians, or teachers</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="neu-btn p-1.5 rounded-xl text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notice Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. First Term Examination Schedule Announcement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-semibold"
                  >
                    <option value="All">All School</option>
                    <option value="Students">Students Only</option>
                    <option value="Parents">Parents / Guardians</option>
                    <option value="Teachers">Faculty & Teachers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as NoticePriority)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-bold"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent / Important</option>
                    <option value="Holiday">School Holiday</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Issued By</label>
                  <input
                    type="text"
                    placeholder="e.g. Principal Office"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notice Details / Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write complete notice description, guidelines, or instructions..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-xl resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="neu-btn px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary px-5 py-2 text-xs font-bold rounded-xl"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Notice Circular Modal */}
      {printingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-xl w-full p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 no-print">
              <h3 className="font-black text-slate-800 text-base">Printable Circular</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="neu-btn-primary px-4 py-2 rounded-2xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Circular</span>
                </button>
                <button
                  onClick={() => setPrintingNotice(null)}
                  className="neu-btn p-2 rounded-xl text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Sheet */}
            <div className="py-6 printable-area bg-white text-slate-900 rounded-2xl p-6 sm:p-8 border-2 border-slate-900 mt-4">
              <div className="text-center pb-4 border-b-2 border-slate-900">
                <h2 className="text-xl font-black uppercase tracking-wider text-slate-900">
                  {settings.schoolName || 'MH ENGLISH PRIVATE HOME'}
                </h2>
                <p className="text-xs text-slate-600 font-medium">{settings.address}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Phone: {settings.phone} | EIIN: {settings.eiinCode}
                </p>
                <div className="mt-3 inline-block bg-[#0b1329] text-white text-xs font-black px-4 py-1 rounded-md uppercase tracking-wider">
                  Official Notice / Circular
                </div>
              </div>

              <div className="py-4 border-b border-slate-200 flex justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-semibold">Ref No: </span>
                  <span className="font-mono font-bold text-slate-900">{printingNotice.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Date: </span>
                  <span className="font-bold text-slate-900">{formatDate(printingNotice.publishDate)}</span>
                </div>
              </div>

              <div className="py-6 space-y-4">
                <h3 className="text-base font-black text-slate-900 text-center uppercase tracking-wide">
                  Subject: {printingNotice.title}
                </h3>

                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium text-justify">
                  {printingNotice.content}
                </p>
              </div>

              <div className="pt-16 flex justify-end text-xs text-slate-800">
                <div className="text-center">
                  <div className="w-36 border-t border-slate-900 mb-1"></div>
                  <span className="font-bold text-sm block">{printingNotice.author}</span>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">Authorized Officer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
