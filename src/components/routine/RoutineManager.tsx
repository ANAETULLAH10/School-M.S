import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Printer,
  Trash2,
  Edit2,
  BookOpen,
  User,
  MapPin,
  X,
  Save,
  Filter,
  School,
} from 'lucide-react';
import { ClassRoutineSlot, DayOfWeek, SchoolClass, Teacher, Subject, SchoolSettings } from '../../types';
import { useToast } from '../../context/ToastContext';

interface RoutineManagerProps {
  routine: ClassRoutineSlot[];
  classes: SchoolClass[];
  teachers: Teacher[];
  subjects: Subject[];
  settings: SchoolSettings;
  onSaveSlot: (slot: Omit<ClassRoutineSlot, 'id'> & { id?: string }) => void;
  onDeleteSlot: (id: string) => void;
}

const DAYS: DayOfWeek[] = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

export const RoutineManager: React.FC<RoutineManagerProps> = ({
  routine,
  classes,
  teachers,
  subjects,
  settings,
  onSaveSlot,
  onDeleteSlot,
}) => {
  const toast = useToast();
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.name || 'Class 10');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [activeDay, setActiveDay] = useState<DayOfWeek | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ClassRoutineSlot | null>(null);

  // Form states
  const [formDay, setFormDay] = useState<DayOfWeek>('Saturday');
  const [formPeriod, setFormPeriod] = useState<number>(1);
  const [formStartTime, setFormStartTime] = useState('09:00 AM');
  const [formEndTime, setFormEndTime] = useState('09:45 AM');
  const [formSubject, setFormSubject] = useState('');
  const [formTeacher, setFormTeacher] = useState('');
  const [formRoom, setFormRoom] = useState('Room 203');

  // Filter slots for active view
  const currentSlots = routine.filter((s) => {
    const matchesClass = s.classId === selectedClass;
    const matchesSection = !s.section || s.section === selectedSection;
    const matchesDay = activeDay === 'All' || s.day === activeDay;
    return matchesClass && matchesSection && matchesDay;
  });

  const handleOpenAddModal = (slotToEdit?: ClassRoutineSlot) => {
    if (slotToEdit) {
      setEditingSlot(slotToEdit);
      setFormDay(slotToEdit.day);
      setFormPeriod(slotToEdit.periodNumber);
      setFormStartTime(slotToEdit.startTime);
      setFormEndTime(slotToEdit.endTime);
      setFormSubject(slotToEdit.subjectName);
      setFormTeacher(slotToEdit.teacherName);
      setFormRoom(slotToEdit.roomNumber);
    } else {
      setEditingSlot(null);
      setFormDay(activeDay === 'All' ? 'Saturday' : activeDay);
      setFormPeriod(1);
      setFormStartTime('09:00 AM');
      setFormEndTime('09:45 AM');
      setFormSubject(subjects[0]?.name || 'English');
      setFormTeacher(teachers[0] ? `${teachers[0].firstName} ${teachers[0].lastName}` : 'Class Teacher');
      setFormRoom('Room 203');
    }
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formTeacher.trim()) {
      toast.error('Please enter subject and teacher name');
      return;
    }

    onSaveSlot({
      id: editingSlot?.id,
      classId: selectedClass,
      section: selectedSection,
      day: formDay,
      periodNumber: Number(formPeriod),
      startTime: formStartTime,
      endTime: formEndTime,
      subjectName: formSubject.trim(),
      teacherName: formTeacher.trim(),
      roomNumber: formRoom.trim() || 'Room 101',
    });

    toast.success(editingSlot ? 'Routine slot updated' : 'New period added to routine');
    setShowAddModal(false);
    setEditingSlot(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete period slot "${name}"?`)) {
      onDeleteSlot(id);
      toast.success('Period removed from routine');
    }
  };

  const handlePrintRoutine = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* PRINT-ONLY WEEKLY TIMETABLE                                    */}
      {/* ============================================================== */}
      <div className="hidden print:block fixed inset-0 bg-white p-8 z-[9999] text-black font-sans">
        <div className="text-center pb-4 border-b-2 border-slate-900">
          <h1 className="text-2xl font-black uppercase tracking-wider">{settings.schoolName}</h1>
          <p className="text-xs font-semibold text-slate-700">{settings.subtitle}</p>
          <p className="text-[11px] text-slate-600 mt-0.5">{settings.address} • Tel: {settings.phone}</p>
          <div className="mt-3 inline-block bg-slate-900 text-white font-bold text-xs px-6 py-1 rounded uppercase">
            WEEKLY CLASS ROUTINE • {selectedClass} (Section {selectedSection})
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Academic Session: {settings.academicYear}</p>
        </div>

        <div className="mt-6 space-y-4">
          {DAYS.map((day) => {
            const daySlots = routine
              .filter((s) => s.classId === selectedClass && (!s.section || s.section === selectedSection) && s.day === day)
              .sort((a, b) => a.periodNumber - b.periodNumber);

            return (
              <div key={day} className="border border-slate-800 rounded">
                <div className="bg-slate-200 px-3 py-1 font-bold text-xs text-slate-900 border-b border-slate-800 flex justify-between">
                  <span>{day}</span>
                  <span>{daySlots.length} Periods</span>
                </div>
                {daySlots.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 divide-x divide-slate-400 text-xs">
                    {daySlots.map((slot) => (
                      <div key={slot.id} className="p-2">
                        <span className="text-[10px] text-slate-500 font-bold block">
                          Period {slot.periodNumber} ({slot.startTime})
                        </span>
                        <strong className="block text-slate-900 font-bold mt-0.5">{slot.subjectName}</strong>
                        <span className="text-[10px] text-slate-600 block">{slot.teacherName}</span>
                        <span className="text-[9px] text-slate-500 font-mono block">{slot.roomNumber}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-2 text-xs text-slate-500 italic">No classes scheduled</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-between text-xs pt-8 border-t border-slate-300">
          <div>
            <div className="w-32 border-b border-slate-800 mb-1"></div>
            <p>Class Teacher Sign</p>
          </div>
          <div className="text-right">
            <div className="w-40 border-b border-slate-800 mb-1 ml-auto"></div>
            <p className="font-bold">{settings.principalName}</p>
            <p className="text-[11px] text-slate-600">Principal Signature</p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SCREEN UI (100% NEUMORPHIC)                                    */}
      {/* ============================================================== */}

      {/* Header Banner */}
      <div className="neu-raised rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center neu-inset-sm shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Class Routine & Timetable</h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Weekly class timetable, teacher lecture schedule, and period management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <button
            onClick={handlePrintRoutine}
            className="neu-btn px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 text-slate-700 hover:text-blue-600"
          >
            <Printer className="w-4 h-4" />
            Print Timetable
          </button>

          <button
            onClick={() => handleOpenAddModal()}
            className="neu-btn-primary px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Period Slot
          </button>
        </div>
      </div>

      {/* Selector Controls */}
      <div className="neu-raised rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Select Class */}
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-700">Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 rounded-xl neu-input text-xs font-bold text-slate-800 outline-none"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Section */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Section:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-3 py-1.5 rounded-xl neu-input text-xs font-bold text-slate-800 outline-none"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-500">
            {currentSlots.length} Scheduled Periods
          </span>
        </div>

        {/* Day Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/60">
          <button
            onClick={() => setActiveDay('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeDay === 'All'
                ? 'neu-inset text-blue-600 border border-blue-400/30'
                : 'neu-btn text-slate-600'
            }`}
          >
            All Days (Weekly)
          </button>
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDay === d
                  ? 'neu-inset text-blue-600 border border-blue-400/30'
                  : 'neu-btn text-slate-600'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Grid by Day */}
      <div className="space-y-6">
        {(activeDay === 'All' ? DAYS : [activeDay]).map((day) => {
          const daySlots = currentSlots
            .filter((s) => s.day === day)
            .sort((a, b) => a.periodNumber - b.periodNumber);

          return (
            <div key={day} className="neu-raised rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <h3 className="font-extrabold text-slate-800 text-sm">{day}</h3>
                  <span className="text-xs text-slate-500 font-semibold">({daySlots.length} periods)</span>
                </div>

                <button
                  onClick={() => {
                    setFormDay(day);
                    handleOpenAddModal();
                  }}
                  className="neu-btn px-2.5 py-1 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to {day}
                </button>
              </div>

              {daySlots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="neu-flat rounded-2xl p-4 flex flex-col justify-between border border-white/60 hover:shadow-[6px_6px_14px_#cad1de,-6px_-6px_14px_#ffffff] transition-all"
                    >
                      <div>
                        {/* Period badge and time */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="neu-inset-sm px-2 py-0.5 rounded-lg text-[10px] font-black uppercase text-blue-600">
                            Period {slot.periodNumber}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>

                        {/* Subject */}
                        <h4 className="font-black text-slate-800 text-sm mb-2 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="truncate">{slot.subjectName}</span>
                        </h4>

                        {/* Teacher & Room */}
                        <div className="space-y-1 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium truncate">{slot.teacherName}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono text-slate-500">{slot.roomNumber}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenAddModal(slot)}
                          className="p-1.5 rounded-lg neu-btn text-slate-600 hover:text-blue-600"
                          title="Edit slot"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(slot.id, slot.subjectName)}
                          className="p-1.5 rounded-lg neu-btn text-rose-500 hover:text-rose-700"
                          title="Delete slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="neu-inset rounded-2xl p-6 text-center text-slate-500 text-xs">
                  No classes scheduled for {day}. Click "Add to {day}" to schedule a period.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Period Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl w-full max-w-md p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingSlot(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-2xl neu-btn text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-[3px_3px_8px_#cad1de]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg">
                  {editingSlot ? 'Edit Period Slot' : 'Add Period Slot'}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {selectedClass} • Section {selectedSection}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Day of Week</label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value as DayOfWeek)}
                    className="w-full px-3 py-2 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Period Number</label>
                  <select
                    value={formPeriod}
                    onChange={(e) => setFormPeriod(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                      <option key={p} value={p}>
                        Period {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    className="w-full px-3 py-2 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    placeholder="e.g. 09:45 AM"
                    className="w-full px-3 py-2 rounded-2xl neu-input text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. English 1st Paper, Mathematics..."
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-semibold text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teacher In-Charge *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Farhana Yasmin or Md. Anaetullah Khokon"
                  value={formTeacher}
                  onChange={(e) => setFormTeacher(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-semibold text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Room Number</label>
                <input
                  type="text"
                  placeholder="e.g. Room 203"
                  value={formRoom}
                  onChange={(e) => setFormRoom(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl neu-input text-xs font-semibold text-slate-800 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSlot(null);
                  }}
                  className="px-5 py-2.5 rounded-2xl neu-btn text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl neu-btn-primary text-xs font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
