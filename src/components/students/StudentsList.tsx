import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Search,
  Eye,
  Edit3,
  Trash2,
  Printer,
  CreditCard,
  Download,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { Student, SchoolClass } from '../../types';
import { formatDate, exportToCSV } from '../../services/exportUtils';

interface StudentsListProps {
  students: Student[];
  classes: SchoolClass[];
  onAddStudent: () => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onPrintIDCard: (student: Student) => void;
}

export const StudentsList: React.FC<StudentsListProps> = ({
  students,
  classes,
  onAddStudent,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onPrintIDCard,
}) => {
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered students
  const filtered = useMemo(() => {
    return students.filter((stu) => {
      const q = search.toLowerCase().trim();
      const fullName = `${stu.firstName} ${stu.lastName}`.toLowerCase();
      const idMatch = stu.id.toLowerCase().includes(q);
      const nameMatch = fullName.includes(q);
      const phoneMatch = stu.phone?.toLowerCase().includes(q) || false;
      const guardianMatch =
        stu.guardianName?.toLowerCase().includes(q) ||
        stu.fatherName?.toLowerCase().includes(q) ||
        false;

      const matchesSearch = !q || idMatch || nameMatch || phoneMatch || guardianMatch;

      const matchesClass = selectedClass === 'All' || stu.classId === selectedClass;
      const matchesSection = selectedSection === 'All' || stu.section === selectedSection;
      const matchesGender = selectedGender === 'All' || stu.gender === selectedGender;
      const matchesStatus = selectedStatus === 'All' || stu.status === selectedStatus;

      return matchesSearch && matchesClass && matchesSection && matchesGender && matchesStatus;
    });
  }, [students, search, selectedClass, selectedSection, selectedGender, selectedStatus]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedClass('All');
    setSelectedSection('All');
    setSelectedGender('All');
    setSelectedStatus('All');
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      'Student ID',
      'First Name',
      'Last Name',
      'Gender',
      'Date of Birth',
      'Class',
      'Section',
      'Roll',
      'Guardian',
      'Phone',
      'Status',
    ];
    const rows = filtered.map((s) => [
      s.id,
      s.firstName,
      s.lastName,
      s.gender,
      s.dob,
      s.classId,
      s.section,
      s.rollNo,
      s.guardianName || s.fatherName || '',
      s.phone || '',
      s.status,
    ]);
    exportToCSV('Student_Directory', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Student Directory</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            View, search, register, and manage student enrollments
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="neu-btn inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="neu-btn inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print List</span>
          </button>

          <button
            onClick={onAddStudent}
            className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Student</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="neu-raised rounded-3xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, ID, phone, guardian..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="neu-input w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl"
            />
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="neu-input w-full px-3 py-2.5 text-xs sm:text-sm rounded-2xl font-semibold"
            >
              <option value="All">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setCurrentPage(1);
              }}
              className="neu-input w-full px-3 py-2.5 text-xs sm:text-sm rounded-2xl font-semibold"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="neu-input w-full px-3 py-2.5 text-xs sm:text-sm rounded-2xl font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
              <option value="Transferred">Transferred</option>
            </select>
          </div>
        </div>

        {/* Quick summary and Reset button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filtered.length}</strong> of{' '}
            <strong className="text-slate-800">{students.length}</strong> students
          </span>

          {(search || selectedClass !== 'All' || selectedSection !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={handleResetFilters}
              className="neu-btn px-3 py-1 rounded-xl text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="neu-raised rounded-3xl overflow-hidden p-2">
        <div className="overflow-x-auto">
          {paginated.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl neu-inset text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No students matched your search</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Try adjusting the filters or register a new student using the button above.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200/40 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-mono">ID</th>
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">DOB</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4">Guardian</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30">
                {paginated.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-200/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-blue-600">
                      {stu.id}
                    </td>
                    <td className="py-3.5 px-4">
                      {stu.photo ? (
                        <img
                          src={stu.photo}
                          alt={stu.firstName}
                          className="w-9 h-9 rounded-2xl object-cover shadow-[2px_2px_5px_#cad1de,-2px_-2px_5px_#ffffff]"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-2xl neu-inset-sm text-slate-700 flex items-center justify-center font-bold text-xs">
                          {stu.firstName.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onViewStudent(stu)}
                        className="font-bold text-slate-800 hover:text-blue-600 text-left block"
                      >
                        {stu.firstName} {stu.lastName}
                      </button>
                      <span className="text-[11px] text-slate-400 font-medium">Roll: {stu.rollNo}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{stu.gender}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{formatDate(stu.dob)}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{stu.classId}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{stu.section}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {stu.guardianName || stu.fatherName || '-'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600 font-medium">
                      {stu.phone || '-'}
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewStudent(stu)}
                          className="neu-btn p-2 rounded-xl text-slate-600 hover:text-blue-600"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onPrintIDCard(stu)}
                          className="neu-btn p-2 rounded-xl text-slate-600 hover:text-indigo-600"
                          title="Print Student ID Card"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200/40 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="neu-btn p-2 rounded-xl disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-xl font-bold ${
                    currentPage === i + 1
                      ? 'neu-btn-primary'
                      : 'neu-btn text-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="neu-btn p-2 rounded-xl disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
