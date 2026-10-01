import React, { useState } from 'react';
import { School, Plus, Edit2, Trash2, Users, X, Save } from 'lucide-react';
import { SchoolClass, Student, Teacher } from '../../types';
import { useToast } from '../../context/ToastContext';

interface ClassesManagerProps {
  classes: SchoolClass[];
  students: Student[];
  teachers: Teacher[];
  onSaveClass: (cls: SchoolClass) => void;
  onDeleteClass: (id: string) => void;
  onViewClassStudents: (className: string) => void;
}

export const ClassesManager: React.FC<ClassesManagerProps> = ({
  classes,
  students,
  teachers,
  onSaveClass,
  onDeleteClass,
  onViewClassStudents,
}) => {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [numericOrder, setNumericOrder] = useState<number>(10);
  const [capacity, setCapacity] = useState<number>(50);
  const [sectionsStr, setSectionsStr] = useState('A, B');
  const [classTeacherName, setClassTeacherName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  const openAddModal = () => {
    setEditingClass(null);
    setName('');
    setNumericOrder(classes.length + 1);
    setCapacity(50);
    setSectionsStr('A, B');
    setClassTeacherName('');
    setRoomNumber(`Room ${200 + classes.length}`);
    setShowModal(true);
  };

  const openEditModal = (cls: SchoolClass) => {
    setEditingClass(cls);
    setName(cls.name);
    setNumericOrder(cls.numericOrder);
    setCapacity(cls.capacity);
    setSectionsStr(cls.sections.join(', '));
    setClassTeacherName(cls.classTeacherName || '');
    setRoomNumber(cls.roomNumber || '');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Class name is required (e.g. Class 10)');
      return;
    }

    const sections = sectionsStr
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    const classData: SchoolClass = {
      id: editingClass ? editingClass.id : `cls_${Date.now()}`,
      name: name.trim(),
      numericOrder: Number(numericOrder) || 1,
      sections: sections.length > 0 ? sections : ['A'],
      capacity: Number(capacity) || 40,
      classTeacherName: classTeacherName.trim() || undefined,
      roomNumber: roomNumber.trim() || undefined,
    };

    onSaveClass(classData);
    toast.success(`Class "${classData.name}" saved successfully`);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Class Management</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure academic grade levels, class sections, capacity, and teacher assignments
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Class</span>
        </button>
      </div>

      {/* Grid of Classes in Neumorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes
          .sort((a, b) => a.numericOrder - b.numericOrder)
          .map((cls) => {
            const enrolled = students.filter(
              (s) => s.classId.toLowerCase() === cls.name.toLowerCase()
            ).length;
            const occupancyPct = Math.min(100, Math.round((enrolled / (cls.capacity || 40)) * 100));

            return (
              <div
                key={cls.id}
                className="neu-raised rounded-3xl p-5 hover:neu-raised-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="neu-inset-sm p-3 rounded-2xl text-blue-600">
                        <School className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 text-lg leading-tight">{cls.name}</h3>
                        <p className="text-xs text-slate-500 font-mono font-semibold">
                          {cls.roomNumber || 'Room N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(cls)}
                        className="neu-btn p-2 text-slate-500 hover:text-blue-600 rounded-xl"
                        title="Edit Class"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${cls.name}?`)) {
                            onDeleteClass(cls.id);
                            toast.info(`Deleted ${cls.name}`);
                          }
                        }}
                        className="neu-btn p-2 text-slate-500 hover:text-rose-600 rounded-xl"
                        title="Delete Class"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Class Teacher */}
                  <div className="neu-inset-sm rounded-2xl p-3 mb-4 text-xs">
                    <span className="text-slate-400 block mb-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Class Teacher
                    </span>
                    <span className="font-bold text-slate-800">
                      {cls.classTeacherName || 'Not Assigned'}
                    </span>
                  </div>

                  {/* Sections Badges */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">
                      Sections ({cls.sections.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cls.sections.map((sec) => (
                        <span
                          key={sec}
                          className="neu-inset-sm px-3 py-1 rounded-xl text-blue-700 text-xs font-black"
                        >
                          Section {sec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500">Students Enrolled</span>
                      <span className="text-slate-800 font-mono">
                        {enrolled} / {cls.capacity} ({occupancyPct}%)
                      </span>
                    </div>
                    <div className="neu-inset-deep w-full h-3 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all ${
                          occupancyPct > 90 ? 'bg-rose-500' : occupancyPct > 70 ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <button
                  onClick={() => onViewClassStudents(cls.name)}
                  className="neu-btn w-full py-2.5 rounded-2xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Class Students ({enrolled})</span>
                </button>
              </div>
            );
          })}
      </div>

      {/* Modal: Add/Edit Class */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-md w-full p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
              <h3 className="font-black text-slate-800 text-base">
                {editingClass ? `Edit ${editingClass.name}` : 'Add New Class'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="neu-btn p-1.5 rounded-xl text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Class Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Numeric Order
                  </label>
                  <input
                    type="number"
                    value={numericOrder}
                    onChange={(e) => setNumericOrder(Number(e.target.value))}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Capacity
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sections <span className="text-slate-400 font-normal">(Comma separated: A, B, C)</span>
                </label>
                <input
                  type="text"
                  placeholder="A, B, C"
                  value={sectionsStr}
                  onChange={(e) => setSectionsStr(e.target.value)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Class Teacher
                </label>
                <select
                  value={classTeacherName}
                  onChange={(e) => setClassTeacherName(e.target.value)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-semibold"
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={`${t.firstName} ${t.lastName}`}>
                      {t.firstName} {t.lastName} ({t.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Room Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. Room 204"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200/50 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="neu-btn px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Class</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
