import React from 'react';
import { Eye, Edit3, Trash2, ArrowRight, UserPlus } from 'lucide-react';
import { Student } from '../../types';

interface RecentStudentsTableProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onViewAll: () => void;
  onAddStudent: () => void;
}

export const RecentStudentsTable: React.FC<RecentStudentsTableProps> = ({
  students,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onViewAll,
  onAddStudent,
}) => {
  // Sort latest first and take top 5
  const recentList = [...students]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="neu-raised rounded-3xl overflow-hidden">
      {/* Header bar */}
      <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/50">
        <div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            Recent Students
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Latest student admissions and academic profiles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddStudent}
            className="neu-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-slate-700 text-xs font-bold"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-600" />
            <span>+ Add Student</span>
          </button>

          <button
            onClick={onViewAll}
            className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold"
          >
            <span>View All Students</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-2">
        {recentList.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No students found. Click "+ Add Student" to register a student.
          </div>
        ) : (
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200/40">
                <th className="py-3 px-5">ID</th>
                <th className="py-3 px-5">Student</th>
                <th className="py-3 px-5">Class</th>
                <th className="py-3 px-5">Section</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/30">
              {recentList.map((stu) => (
                <tr
                  key={stu.id}
                  className="hover:bg-slate-200/20 transition-colors group"
                >
                  <td className="py-3.5 px-5 font-mono text-xs font-bold text-blue-600">
                    {stu.id}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      {stu.photo ? (
                        <img
                          src={stu.photo}
                          alt={`${stu.firstName} ${stu.lastName}`}
                          className="w-9 h-9 rounded-2xl object-cover shadow-[2px_2px_5px_#cad1de,-2px_-2px_5px_#ffffff]"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-2xl neu-inset-sm text-slate-700 flex items-center justify-center font-bold text-xs">
                          {stu.firstName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-800 block leading-tight">
                          {stu.firstName} {stu.lastName}
                        </span>
                        {stu.phone && (
                          <span className="text-[11px] text-slate-400 block font-normal">
                            {stu.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-slate-700">
                    {stu.classId}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-slate-700">
                    {stu.section}
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`neu-inset-sm inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${
                        stu.status === 'Active'
                          ? 'text-emerald-700'
                          : stu.status === 'Inactive'
                          ? 'text-rose-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {stu.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewStudent(stu)}
                        className="neu-btn p-2 rounded-xl text-slate-600 hover:text-blue-600"
                        title="View Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditStudent(stu)}
                        className="neu-btn p-2 rounded-xl text-slate-600 hover:text-amber-600"
                        title="Edit Student"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteStudent(stu)}
                        className="neu-btn p-2 rounded-xl text-slate-600 hover:text-rose-600"
                        title="Delete Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
