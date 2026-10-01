import React, { useState } from 'react';
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

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [feeTypeFilter, setFeeTypeFilter] = useState<string>('All');

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
