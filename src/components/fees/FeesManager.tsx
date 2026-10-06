import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  CreditCard,
  DollarSign,
  FileText,
  Trash2,
  Users,
  ChevronDown,
  ChevronUp,
  Eye,
  Receipt,
  CheckCircle,
} from 'lucide-react';
import { FeeInvoice, Student, SchoolClass, PaymentMethod, InvoiceStatus, SchoolSettings, FeePayment } from '../../types';
import { formatCurrency, formatDate, exportToCSV } from '../../services/exportUtils';
import { useToast } from '../../context/ToastContext';
import { FeeReceiptModal } from './FeeReceiptModal';

interface FeesManagerProps {
  invoices: FeeInvoice[];
  payments: FeePayment[];
  students: Student[];
  classes: SchoolClass[];
  settings: SchoolSettings;
  onSaveInvoice: (invoice: Omit<FeeInvoice, 'id' | 'invoiceNo' | 'createdAt' | 'updatedAt'>) => void;
  onRecordPayment: (payment: Omit<FeePayment, 'id' | 'receiptNo' | 'createdAt'>) => void;
  onDeleteInvoice: (id: string) => void;
}

const FEE_TYPES = [
  'Monthly Fee',
  'Admission Fee',
  'Exam Fee',
  'Transport Fee',
  'Library Fee',
  'Lab Fee',
  'Sports Fee',
  'Other Fee',
];

export const FeesManager: React.FC<FeesManagerProps> = ({
  invoices,
  payments,
  students,
  classes,
  settings,
  onSaveInvoice,
  onRecordPayment,
  onDeleteInvoice,
}) => {
  const toast = useToast();

  // View modes: 'studentLedger' (default) | 'invoices' | 'payments'
  const [viewMode, setViewMode] = useState<'studentLedger' | 'invoices' | 'payments'>('studentLedger');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [feeTypeFilter, setFeeTypeFilter] = useState<string>('All');

  // Student Ledger filter states
  const [ledgerClassFilter, setLedgerClassFilter] = useState<string>('All');
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState<'All' | 'Due' | 'Paid' | 'NoBill'>('All');
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<FeeInvoice | null>(null);
  const [viewingReceiptInvoice, setViewingReceiptInvoice] = useState<FeeInvoice | null>(null);

  // Create form states
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [feeType, setFeeType] = useState('Monthly Fee');
  const [amount, setAmount] = useState<number>(2500);
  const [discount, setDiscount] = useState<number>(0);
  const [paidNow, setPaidNow] = useState<number>(2500);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');

  // Payment form states
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Cash');
  const [payRef, setPayRef] = useState('');

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const q = search.toLowerCase();
    const matchesSearch =
      inv.invoiceNo.toLowerCase().includes(q) ||
      inv.studentName.toLowerCase().includes(q) ||
      inv.studentId.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchesType = feeTypeFilter === 'All' || inv.feeType === feeTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Financial calculations
  const totalCollected = invoices.reduce((acc, i) => acc + (Number(i.paidAmount) || 0), 0);
  const totalDue = invoices.reduce((acc, i) => acc + (Number(i.dueAmount) || 0), 0);
  const totalInvoiced = invoices.reduce((acc, i) => acc + (Number(i.amount) - Number(i.discount) || 0), 0);

  // Student-wise Ledger calculations (How much fee each student owes/paid)
  const studentLedgerData = useMemo(() => {
    return students.map((stu) => {
      const stuInvoices = invoices.filter((i) => i.studentId === stu.id);
      const totalBilled = stuInvoices.reduce((acc, i) => acc + (Number(i.amount) - Number(i.discount) || 0), 0);
      const totalPaid = stuInvoices.reduce((acc, i) => acc + (Number(i.paidAmount) || 0), 0);
      const totalStudentDue = stuInvoices.reduce((acc, i) => acc + (Number(i.dueAmount) || 0), 0);
      const hasDue = totalStudentDue > 0;
      const isPaid = stuInvoices.length > 0 && totalStudentDue === 0;
      const noBill = stuInvoices.length === 0;

      return {
        student: stu,
        invoices: stuInvoices,
        totalBilled,
        totalPaid,
        totalDue: totalStudentDue,
        hasDue,
        isPaid,
        noBill,
      };
    });
  }, [students, invoices]);

  // Filtered student ledger
  const filteredStudentLedger = useMemo(() => {
    return studentLedgerData.filter((item) => {
      const q = search.toLowerCase().trim();
      const stu = item.student;
      const nameMatch = `${stu.firstName} ${stu.lastName}`.toLowerCase().includes(q);
      const idMatch = stu.id.toLowerCase().includes(q);
      const rollMatch = stu.rollNo.includes(q);
      const phoneMatch = stu.phone?.toLowerCase().includes(q) || false;
      const matchesSearch = !q || nameMatch || idMatch || rollMatch || phoneMatch;

      const matchesClass = ledgerClassFilter === 'All' || stu.classId === ledgerClassFilter;

      let matchesStatus = true;
      if (ledgerStatusFilter === 'Due') matchesStatus = item.hasDue;
      else if (ledgerStatusFilter === 'Paid') matchesStatus = item.isPaid;
      else if (ledgerStatusFilter === 'NoBill') matchesStatus = item.noBill;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [studentLedgerData, search, ledgerClassFilter, ledgerStatusFilter]);

  const studentsWithDueCount = studentLedgerData.filter((s) => s.hasDue).length;
  const studentsPaidCount = studentLedgerData.filter((s) => s.isPaid).length;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find((s) => s.id === selectedStudentId);
    if (!stu) {
      toast.error('Please select a valid student');
      return;
    }

    const netPayable = Math.max(0, Number(amount) - Number(discount));
    const actualPaid = Math.min(netPayable, Math.max(0, Number(paidNow)));
    const due = Math.max(0, netPayable - actualPaid);
    const status: InvoiceStatus = due <= 0 ? 'Paid' : actualPaid > 0 ? 'Partial' : 'Due';

    onSaveInvoice({
      studentId: stu.id,
      studentName: `${stu.firstName} ${stu.lastName}`,
      classId: stu.classId,
      section: stu.section,
      feeType,
      amount: Number(amount) || 0,
      discount: Number(discount) || 0,
      paidAmount: actualPaid,
      dueAmount: due,
      status,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      paymentMethod: actualPaid > 0 ? paymentMethod : undefined,
      paidDate: actualPaid > 0 ? new Date().toISOString().split('T')[0] : undefined,
      notes: notes.trim() || undefined,
    });

    toast.success('Fee invoice created successfully');
    setShowCreateModal(false);
  };

  const handleOpenPayment = (inv: FeeInvoice) => {
    setPayingInvoice(inv);
    setPayAmount(inv.dueAmount);
    setPayMethod('Cash');
    setPayRef('');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;

    if (payAmount <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    if (payAmount > payingInvoice.dueAmount) {
      toast.error(`Payment amount cannot exceed due of ${formatCurrency(payingInvoice.dueAmount)}`);
      return;
    }

    onRecordPayment({
      invoiceId: payingInvoice.id,
      invoiceNo: payingInvoice.invoiceNo,
      studentId: payingInvoice.studentId,
      studentName: payingInvoice.studentName,
      amount: Number(payAmount),
      paymentMethod: payMethod,
      transactionRef: payRef.trim() || undefined,
      paymentDate: new Date().toISOString().split('T')[0],
      collectedBy: 'Administrator',
    });

    toast.success(`Payment of ${formatCurrency(payAmount)} processed`);
    setPayingInvoice(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'Invoice #',
      'Student ID',
      'Student Name',
      'Class',
      'Fee Type',
      'Amount',
      'Discount',
      'Paid',
      'Due',
      'Status',
      'Due Date',
    ];
    const rows = filteredInvoices.map((inv) => [
      inv.invoiceNo,
      inv.studentId,
      inv.studentName,
      inv.classId,
      inv.feeType,
      inv.amount,
      inv.discount,
      inv.paidAmount,
      inv.dueAmount,
      inv.status,
      inv.dueDate,
    ]);
    exportToCSV('Fee_Invoices_MH_School', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Fees & Collections</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate invoices, process tuition collections, track outstanding dues, and issue receipts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="neu-btn inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-2xl"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Invoices</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Fee Invoice</span>
          </button>
        </div>
      </div>

      {/* Summary Cards in Neumorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="neu-raised rounded-3xl p-5 flex items-center gap-4">
          <div className="neu-inset-sm p-3.5 rounded-2xl text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Invoiced
            </span>
            <span className="text-2xl font-black text-slate-800">
              {formatCurrency(totalInvoiced)}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5 font-semibold">
              {invoices.length} invoices generated
            </span>
          </div>
        </div>

        <div className="neu-raised rounded-3xl p-5 flex items-center gap-4">
          <div className="neu-inset-sm p-3.5 rounded-2xl text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
              Total Collected
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {formatCurrency(totalCollected)}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5 font-semibold">
              Cash, Bank & Mobile Banking
            </span>
          </div>
        </div>

        <div className="neu-raised rounded-3xl p-5 flex items-center gap-4">
          <div className="neu-inset-sm p-3.5 rounded-2xl text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
              Total Outstanding Due
            </span>
            <span className="text-2xl font-black text-rose-600">
              {formatCurrency(totalDue)}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5 font-semibold">
              Pending collections
            </span>
          </div>
        </div>
      </div>

      {/* View Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setViewMode('studentLedger')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            viewMode === 'studentLedger'
              ? 'neu-inset text-blue-600 border border-blue-400/40 font-black'
              : 'neu-btn text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Fee Ledger (শিক্ষার্থীভিত্তিক ফি খতিয়ান)</span>
          <span className="neu-inset-sm px-2 py-0.5 rounded-full text-[10px] font-black text-rose-600">
            {studentsWithDueCount} Due
          </span>
        </button>

        <button
          onClick={() => setViewMode('invoices')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            viewMode === 'invoices'
              ? 'neu-inset text-blue-600 border border-blue-400/40 font-black'
              : 'neu-btn text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>All Invoices (ইনভয়েস ভিত্তিক তালিকা)</span>
          <span className="neu-inset-sm px-2 py-0.5 rounded-full text-[10px] font-black text-slate-600">
            {invoices.length}
          </span>
        </button>

        <button
          onClick={() => setViewMode('payments')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            viewMode === 'payments'
              ? 'neu-inset text-blue-600 border border-blue-400/40 font-black'
              : 'neu-btn text-slate-700'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Payment Receipts (পরিশোধিত রসিদ ও ট্রানজ্যাকশন)</span>
          <span className="neu-inset-sm px-2 py-0.5 rounded-full text-[10px] font-black text-emerald-600">
            {payments.length}
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: STUDENT FEE LEDGER (কোন ছাত্রের কত ফি ও বকেয়া)       */}
      {/* ============================================================== */}
      {viewMode === 'studentLedger' && (
        <div className="space-y-4">
          {/* Filters & Search for Student Ledger */}
          <div className="neu-raised rounded-3xl p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search student by name, roll no, phone, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="neu-input w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={ledgerClassFilter}
                onChange={(e) => setLedgerClassFilter(e.target.value)}
                className="neu-input px-3.5 py-2 text-xs rounded-xl font-semibold"
              >
                <option value="All">All Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={ledgerStatusFilter}
                onChange={(e) => setLedgerStatusFilter(e.target.value as any)}
                className="neu-input px-3.5 py-2 text-xs rounded-xl font-semibold"
              >
                <option value="All">All Statuses (সব শিক্ষার্থী)</option>
                <option value="Due">Only Due (যাদের বকেয়া আছে)</option>
                <option value="Paid">Fully Paid (পরিশোধিত)</option>
                <option value="NoBill">No Bill (কোনো বিল নেই)</option>
              </select>
            </div>
          </div>

          {/* Quick Ledger Stats Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 text-xs text-slate-600 font-semibold">
            <span>
              Showing {filteredStudentLedger.length} of {students.length} students
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-rose-700 font-bold">
                <AlertCircle className="w-4 h-4" />
                {studentsWithDueCount} Students with Due ({formatCurrency(totalDue)})
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                {studentsPaidCount} Fully Cleared
              </span>
            </div>
          </div>

          {/* Student Ledger Table */}
          <div className="neu-raised rounded-3xl overflow-hidden p-2">
            <div className="overflow-x-auto">
              {filteredStudentLedger.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs font-semibold">
                  No students match your ledger search or filter criteria.
                </div>
              ) : (
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200/50">
                      <th className="py-3 px-4">Roll</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Bills</th>
                      <th className="py-3 px-4">Total Billed</th>
                      <th className="py-3 px-4">Total Paid</th>
                      <th className="py-3 px-4 font-black text-rose-700">Total Due (বকেয়া)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/30">
                    {filteredStudentLedger.map((item) => {
                      const stu = item.student;
                      const isExpanded = expandedStudentId === stu.id;

                      return (
                        <React.Fragment key={stu.id}>
                          <tr className="hover:bg-slate-200/20 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                              #{stu.rollNo}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                {stu.photo ? (
                                  <img
                                    src={stu.photo}
                                    alt={stu.firstName}
                                    className="w-9 h-9 rounded-2xl object-cover shadow-[2px_2px_5px_#cad1de,-2px_-2px_5px_#ffffff]"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-2xl neu-inset-sm text-blue-700 flex items-center justify-center font-bold text-xs">
                                    {stu.firstName.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <span className="font-bold text-slate-800 block leading-tight">
                                    {stu.firstName} {stu.lastName}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-mono">
                                    {stu.id} • {stu.phone || 'No phone'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-700">
                              {stu.classId} ({stu.section})
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="neu-inset-sm px-2 py-0.5 rounded-lg text-[11px] font-bold text-slate-700">
                                {item.invoices.length} bill{item.invoices.length === 1 ? '' : 's'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {formatCurrency(item.totalBilled)}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-emerald-600">
                              {formatCurrency(item.totalPaid)}
                            </td>
                            <td className="py-3.5 px-4 font-black text-sm text-rose-600">
                              {item.totalDue > 0 ? (
                                <span>{formatCurrency(item.totalDue)}</span>
                              ) : (
                                <span className="text-slate-400 text-xs font-semibold">৳0</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              {item.invoices.length === 0 ? (
                                <span className="neu-inset-sm inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium text-slate-400">
                                  No Bill
                                </span>
                              ) : item.totalDue > 0 ? (
                                <span className="neu-inset-sm inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black text-rose-700 bg-rose-50/60">
                                  {formatCurrency(item.totalDue)} Due
                                </span>
                              ) : (
                                <span className="neu-inset-sm inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50/60">
                                  All Paid
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Expand / View Breakdown Button */}
                                <button
                                  onClick={() =>
                                    setExpandedStudentId(isExpanded ? null : stu.id)
                                  }
                                  className={`neu-btn px-2.5 py-1 text-xs font-bold rounded-xl inline-flex items-center gap-1 ${
                                    isExpanded ? 'neu-inset text-blue-600' : 'text-slate-600'
                                  }`}
                                  title="View individual invoices for this student"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{isExpanded ? 'Hide' : 'Breakdown'}</span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-3 h-3" />
                                  ) : (
                                    <ChevronDown className="w-3 h-3" />
                                  )}
                                </button>

                                {/* Collect Payment button if due */}
                                {item.totalDue > 0 && (
                                  <button
                                    onClick={() => {
                                      const unpaidInv = item.invoices.find(
                                        (i) => i.dueAmount > 0
                                      );
                                      if (unpaidInv) handleOpenPayment(unpaidInv);
                                    }}
                                    className="neu-btn px-2.5 py-1 text-xs font-bold text-emerald-700 rounded-xl inline-flex items-center gap-1 hover:scale-105 transition-transform"
                                    title="Collect Due Payment"
                                  >
                                    <DollarSign className="w-3.5 h-3.5" />
                                    <span>Collect</span>
                                  </button>
                                )}

                                {/* Create Bill Button */}
                                <button
                                  onClick={() => {
                                    setSelectedStudentId(stu.id);
                                    setShowCreateModal(true);
                                  }}
                                  className="neu-btn p-1.5 text-slate-500 hover:text-blue-600 rounded-xl"
                                  title="Create New Invoice for this Student"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Accordion Row: Invoices Breakdown for This Student */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={9} className="p-4 bg-slate-200/30">
                                <div className="neu-inset rounded-2xl p-4 bg-white/70">
                                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                                    <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                                      <span>All Invoices for {stu.firstName} {stu.lastName}</span>
                                    </h4>
                                    <span className="text-[11px] font-bold text-slate-500">
                                      {item.invoices.length} Bills Total
                                    </span>
                                  </div>

                                  {item.invoices.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic py-2">
                                      No invoices have been issued for this student yet. Click '+ Create Invoice' to generate one.
                                    </p>
                                  ) : (
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-xs text-left">
                                        <thead>
                                          <tr className="text-slate-500 font-bold border-b border-slate-200">
                                            <th className="py-2 px-2">Invoice #</th>
                                            <th className="py-2 px-2">Fee Type</th>
                                            <th className="py-2 px-2">Issue Date</th>
                                            <th className="py-2 px-2">Due Date</th>
                                            <th className="py-2 px-2">Amount</th>
                                            <th className="py-2 px-2">Paid</th>
                                            <th className="py-2 px-2 text-rose-600">Due</th>
                                            <th className="py-2 px-2">Status</th>
                                            <th className="py-2 px-2 text-right">Action</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                          {item.invoices.map((inv) => (
                                            <tr key={inv.id} className="hover:bg-slate-50">
                                              <td className="py-2 px-2 font-mono font-bold text-blue-600">
                                                {inv.invoiceNo}
                                              </td>
                                              <td className="py-2 px-2 font-semibold text-slate-800">
                                                {inv.feeType}
                                              </td>
                                              <td className="py-2 px-2 text-slate-500">
                                                {formatDate(inv.issueDate)}
                                              </td>
                                              <td className="py-2 px-2 text-slate-500">
                                                {formatDate(inv.dueDate)}
                                              </td>
                                              <td className="py-2 px-2 font-bold text-slate-800">
                                                {formatCurrency(inv.amount)}
                                              </td>
                                              <td className="py-2 px-2 text-emerald-600 font-bold">
                                                {formatCurrency(inv.paidAmount)}
                                              </td>
                                              <td className="py-2 px-2 text-rose-600 font-black">
                                                {formatCurrency(inv.dueAmount)}
                                              </td>
                                              <td className="py-2 px-2">
                                                <span
                                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    inv.status === 'Paid'
                                                      ? 'bg-emerald-100 text-emerald-700'
                                                      : inv.status === 'Partial'
                                                      ? 'bg-amber-100 text-amber-700'
                                                      : 'bg-rose-100 text-rose-700'
                                                  }`}
                                                >
                                                  {inv.status}
                                                </span>
                                              </td>
                                              <td className="py-2 px-2 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                  {inv.dueAmount > 0 && (
                                                    <button
                                                      onClick={() => handleOpenPayment(inv)}
                                                      className="neu-btn px-2 py-0.5 text-[10px] font-bold text-emerald-700 rounded-lg inline-flex items-center gap-0.5"
                                                    >
                                                      <DollarSign className="w-3 h-3" />
                                                      Collect
                                                    </button>
                                                  )}
                                                  <button
                                                    onClick={() => setViewingReceiptInvoice(inv)}
                                                    className="neu-btn p-1 text-slate-600 hover:text-blue-600 rounded-lg"
                                                    title="Receipt"
                                                  >
                                                    <Printer className="w-3 h-3" />
                                                  </button>
                                                </div>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: ALL INVOICES (ইনভয়েস তালিকা)                          */}
      {/* ============================================================== */}
      {viewMode === 'invoices' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="neu-raised rounded-3xl p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search invoice #, student name, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="neu-input w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={feeTypeFilter}
                onChange={(e) => setFeeTypeFilter(e.target.value)}
                className="neu-input px-3.5 py-2 text-xs rounded-xl font-semibold"
              >
                <option value="All">All Fee Types</option>
                {FEE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="neu-input px-3.5 py-2 text-xs rounded-xl font-semibold"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Due">Due</option>
              </select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="neu-raised rounded-3xl overflow-hidden p-2">
            <div className="overflow-x-auto">
              {filteredInvoices.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs font-semibold">
                  No fee invoices match your search/filter criteria.
                </div>
              ) : (
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200/50">
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Fee Type</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Paid</th>
                      <th className="py-3 px-4">Due</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/30">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-200/20 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                          {inv.invoiceNo}
                        </td>
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-bold text-slate-800 block leading-tight">
                              {inv.studentName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {inv.studentId} • {inv.classId}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {inv.feeType}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {formatCurrency(inv.amount)}
                          {inv.discount > 0 && (
                            <span className="text-[10px] text-emerald-600 block">
                              -{formatCurrency(inv.discount)} disc
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">
                          {formatCurrency(inv.paidAmount)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-rose-600">
                          {formatCurrency(inv.dueAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {formatDate(inv.dueDate)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`neu-inset-sm inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black ${
                              inv.status === 'Paid'
                                ? 'text-emerald-700'
                                : inv.status === 'Partial'
                                ? 'text-amber-700'
                                : 'text-rose-700'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {inv.dueAmount > 0 && (
                              <button
                                onClick={() => handleOpenPayment(inv)}
                                className="neu-btn px-2.5 py-1 text-xs font-bold text-emerald-700 rounded-xl inline-flex items-center gap-1"
                                title="Collect Payment"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>Collect</span>
                              </button>
                            )}

                            <button
                              onClick={() => setViewingReceiptInvoice(inv)}
                              className="neu-btn p-1.5 text-slate-600 hover:text-blue-600 rounded-xl"
                              title="Print Receipt"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Delete invoice ${inv.invoiceNo}?`)) {
                                  onDeleteInvoice(inv.id);
                                  toast.info(`Deleted invoice ${inv.invoiceNo}`);
                                }
                              }}
                              className="neu-btn p-1.5 text-slate-500 hover:text-rose-600 rounded-xl"
                              title="Delete Invoice"
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
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 3: PAYMENT RECEIPTS (পরিশোধিত রসিদ ও ট্রানজ্যাকশন)        */}
      {/* ============================================================== */}
      {viewMode === 'payments' && (
        <div className="space-y-4">
          <div className="neu-raised rounded-3xl overflow-hidden p-2">
            <div className="overflow-x-auto">
              {payments.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs font-semibold">
                  No fee payment records recorded yet. Payments collected from invoices appear here.
                </div>
              ) : (
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200/50">
                      <th className="py-3 px-4">Receipt #</th>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Payment Date</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4 font-bold text-emerald-600">Amount Paid</th>
                      <th className="py-3 px-4">Collected By</th>
                      <th className="py-3 px-4 text-right">Receipt Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/30">
                    {payments.map((p) => {
                      const relatedInv = invoices.find(
                        (i) => i.id === p.invoiceId || i.invoiceNo === p.invoiceNo
                      );

                      return (
                        <tr key={p.id} className="hover:bg-slate-200/20 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-black text-blue-700">
                            {p.receiptNo}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            {p.invoiceNo || '-'}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {p.studentName}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {formatDate(p.paymentDate)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="neu-inset-sm px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-700">
                              {p.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-black text-emerald-600">
                            {formatCurrency(p.amount)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {p.collectedBy || p.receivedBy || 'Accounts'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {relatedInv && (
                              <button
                                onClick={() => setViewingReceiptInvoice(relatedInv)}
                                className="neu-btn px-2.5 py-1 text-xs font-bold text-blue-700 rounded-xl inline-flex items-center gap-1"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print Receipt</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Fee Invoice */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
              <div>
                <h3 className="font-black text-slate-800 text-base">Generate Fee Invoice</h3>
                <p className="text-xs text-slate-500 font-medium">Issue fee bill for an enrolled student</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="neu-btn p-1.5 rounded-xl text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Student <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="neu-input w-full px-3.5 py-2.5 text-sm rounded-2xl font-bold"
                  required
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.id}) — {s.classId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fee Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={feeType}
                    onChange={(e) => setFeeType(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-semibold"
                  >
                    {FEE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Due Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount (৳) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono font-bold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pay Now (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={Math.max(0, amount - discount)}
                    value={paidNow}
                    onChange={(e) => setPaidNow(Number(e.target.value))}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono font-bold text-blue-700"
                  />
                </div>
              </div>

              {paidNow > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-semibold"
                  >
                    <option value="Cash">Cash</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="Card">Credit/Debit Card</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Memo</label>
                <input
                  type="text"
                  placeholder="e.g. Tuition fee for October 2026"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-xl"
                />
              </div>

              {/* Net Summary */}
              <div className="neu-inset-sm rounded-2xl p-3 text-xs flex justify-between font-bold">
                <span className="text-slate-600">Net Payable: {formatCurrency(Math.max(0, amount - discount))}</span>
                <span className="text-rose-600">Remaining Due: {formatCurrency(Math.max(0, amount - discount - paidNow))}</span>
              </div>

              <div className="pt-3 border-t border-slate-200/50 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="neu-btn px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary px-5 py-2 text-xs font-bold rounded-xl"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Process / Record Payment */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-md w-full p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
              <div>
                <h3 className="font-black text-slate-800 text-base">Collect Payment</h3>
                <p className="text-xs text-slate-500 font-medium">Invoice #{payingInvoice.invoiceNo}</p>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="neu-btn p-1.5 rounded-xl text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="mt-4 space-y-4">
              <div className="neu-inset-sm rounded-2xl p-3.5 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Student:</span>
                  <span className="font-bold text-slate-800">{payingInvoice.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Fee Type:</span>
                  <span className="font-bold text-slate-800">{payingInvoice.feeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Current Due:</span>
                  <span className="font-bold text-rose-600">{formatCurrency(payingInvoice.dueAmount)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount to Collect (৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={payingInvoice.dueAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="neu-input w-full px-3.5 py-2.5 text-base rounded-2xl font-mono font-black text-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-semibold"
                >
                  <option value="Cash">Cash</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Bank">Bank Deposit</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Transaction / TrxID / Check Ref
                </label>
                <input
                  type="text"
                  placeholder="Optional reference code"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="neu-input w-full px-3.5 py-2 text-sm rounded-xl font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200/50 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="neu-btn px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-success px-5 py-2 text-xs font-bold rounded-xl"
                >
                  Confirm & Receive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {viewingReceiptInvoice && (
        <FeeReceiptModal
          invoice={viewingReceiptInvoice}
          settings={settings}
          payments={payments.filter((p) => p.invoiceId === viewingReceiptInvoice.id)}
          onClose={() => setViewingReceiptInvoice(null)}
        />
      )}
    </div>
  );
};
