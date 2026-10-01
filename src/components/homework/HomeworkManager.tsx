import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  Trash2,
  X,
  Save,
  User,
  School,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Homework, SchoolClass, Teacher, Subject } from '../../types';
import { formatDate } from '../../services/exportUtils';
import { useToast } from '../../context/ToastContext';

interface HomeworkManagerProps {
  homeworkList: Homework[];
  classes: SchoolClass[];
  teachers: Teacher[];
  subjects: Subject[];
  onSaveHomework: (hw: Omit<Homework, 'id' | 'createdAt'> & { id?: string }) => void;
  onUpdateStatus: (id: string, status: 'Active' | 'Completed' | 'Overdue') => void;
  onDeleteHomework: (id: string) => void;
}

export const HomeworkManager: React.FC<HomeworkManagerProps> = ({
  homeworkList,
  classes,
  teachers,
  subjects,
  onSaveHomework,
  onUpdateStatus,
  onDeleteHomework,
}) => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [formClass, setFormClass] = useState(classes[0]?.name || 'Class 10');
  const [formSection, setFormSection] = useState('A');
  const [formSubject, setFormSubject] = useState(subjects[0]?.name || 'English 1st Paper');
  const [formTeacher, setFormTeacher] = useState(
    teachers[0] ? `${teachers[0].firstName} ${teachers[0].lastName}` : 'Course Teacher'
  );
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [description, setDescription] = useState('');

  // Filters
  const filteredList = homeworkList.filter((hw) => {
    const matchesSearch =
      hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hw.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hw.assignedTeacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'All' || hw.classId === selectedClass;
    const matchesStatus = selectedStatus === 'All' || hw.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please enter homework title and instructions');
      return;
    }

    onSaveHomework({
      title: title.trim(),
      classId: formClass,
      section: formSection,
      subjectName: formSubject,
      assignedTeacher: formTeacher,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      description: description.trim(),
      submissionCount: 0,
      status: 'Active',
    });

    toast.success('Homework assigned successfully');
    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  const handleDelete = (hw: Homework) => {
    if (confirm(`Delete assignment "${hw.title}"?`)) {
      onDeleteHomework(hw.id);
      toast.success('Assignment deleted');
    }
  };

  const totalCount = homeworkList.length;
  const activeCount = homeworkList.filter((h) => h.status === 'Active').length;
  const completedCount = homeworkList.filter((h) => h.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="neu-raised rounded-3xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Assignments</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{totalCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100/60 neu-inset-sm flex items-center justify-center text-blue-600">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="neu-raised rounded-3xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Homework</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{activeCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100/60 neu-inset-sm flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="neu-raised rounded-3xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Tasks</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{completedCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/60 neu-inset-sm flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action and Filter Card */}
      <div className="neu-raised rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search assignments by title, subject, or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl neu-input text-xs font-semibold placeholder-slate-400 outline-none"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="neu-btn-primary px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Assign Homework
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            Class:
          </div>
          <button
            onClick={() => setSelectedClass('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedClass === 'All'
                ? 'neu-inset text-blue-600 border border-blue-400/30'
                : 'neu-btn text-slate-600'
            }`}
          >
            All Classes
          </button>
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedClass === cls.name
                  ? 'neu-inset text-blue-600 border border-blue-400/30'
                  : 'neu-btn text-slate-600'
              }`}
            >
              {cls.name}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-300 mx-2 hidden sm:block" />

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            Status:
          </div>
          {(['All', 'Active', 'Completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatus === st
                  ? 'neu-inset text-blue-600 border border-blue-400/30'
                  : 'neu-btn text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Homework Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredList.map((hw) => {
          const isActive = hw.status === 'Active';
          return (
            <div
              key={hw.id}
              className="neu-raised rounded-3xl p-6 flex flex-col justify-between hover:shadow-[10px_10px_22px_#cad1de,-10px_-10px_22px_#ffffff] transition-all"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="neu-inset-sm px-2.5 py-1 rounded-xl text-[10px] font-black uppercase text-blue-700 bg-blue-100">
                      {hw.classId} {hw.section ? `(${hw.section})` : ''}
                    </span>
                    <span className="neu-inset-sm px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-700 bg-slate-200">
                      {hw.subjectName}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl ${
                      isActive
                        ? 'bg-amber-100 text-amber-700 neu-inset-sm'
                        : 'bg-emerald-100 text-emerald-700 neu-inset-sm'
                    }`}
                  >
                    {hw.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-slate-800 text-base leading-snug mb-2">
                  {hw.title}
                </h3>

                {/* Instructions */}
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-4 whitespace-pre-line mb-4 font-normal">
                  {hw.description}
                </p>

                {/* Dates & Submissions */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-200/40 p-2.5 rounded-2xl neu-inset-sm mb-4">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>Due: <strong>{formatDate(hw.dueDate)}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    <span className="truncate">{hw.assignedTeacher}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  onClick={() => onUpdateStatus(hw.id, isActive ? 'Completed' : 'Active')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    isActive
                      ? 'neu-btn text-emerald-600 hover:text-emerald-800'
                      : 'neu-inset text-slate-600'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {isActive ? 'Mark as Completed' : 'Completed (Click to Reopen)'}
                </button>

                <button
                  onClick={() => handleDelete(hw)}
                  className="p-1.5 rounded-xl neu-btn text-rose-500 hover:text-rose-700"
                  title="Delete Assignment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredList.length === 0 && (
        <div className="neu-inset rounded-3xl p-12 text-center text-slate-500">
          <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-3 opacity-60" />
          <h4 className="font-bold text-base text-slate-700">No assignments found</h4>
          <p className="text-xs text-slate-600 mt-1">Click "Assign Homework" to create a task for students.</p>
        </div>
      )}

      {/* Add Homework Modal */}
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
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg">Assign New Homework</h3>
                <p className="text-xs text-slate-600 font-medium">Create and publish assignment for class</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Homework Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Formal Letter Writing or Chapter 5 Math Exercise"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-semibold text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="All">All Sections</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="e.g. English 1st Paper"
                    className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Teacher</label>
                  <input
                    type="text"
                    required
                    value={formTeacher}
                    onChange={(e) => setFormTeacher(e.target.value)}
                    placeholder="e.g. Farhana Yasmin"
                    className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Submission Due Date *</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Details & Questions *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the textbook page, question numbers, or essay prompt..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Assign Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
