import React from 'react';
import { X, Printer } from 'lucide-react';
import { FeeInvoice, SchoolSettings, FeePayment } from '../../types';
import { formatCurrency, formatDate } from '../../services/exportUtils';

interface FeeReceiptModalProps {
  invoice: FeeInvoice;
  payment?: FeePayment | null;
  payments?: FeePayment[];
  settings: SchoolSettings;
  onClose: () => void;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  invoice,
  payment,
  payments,
  settings,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const activePayment = payment || (payments && payments.length > 0 ? payments[0] : null);
  const receiptNo = activePayment?.receiptNo || `REC-${invoice.invoiceNo.replace(/\D/g, '')}`;
  const paymentDate = activePayment?.paymentDate || invoice.paidDate || new Date().toISOString().split('T')[0];
  const paymentMethod = activePayment?.paymentMethod || invoice.paymentMethod || 'Cash';
  const amountPaidNow = activePayment?.amount || invoice.paidAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="neu-raised-lg bg-[#ebf0f7] rounded-3xl max-w-xl w-full my-8 p-6">
        {/* Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 no-print">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Official Fee Receipt</h3>
            <p className="text-xs text-slate-500 font-medium">Student copy and accounts record</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="neu-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="neu-btn p-2 text-slate-500 hover:text-slate-800 rounded-xl"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="py-6 printable-area bg-[#ebf0f7] text-slate-900">
          <div className="neu-raised rounded-3xl p-6 relative border border-slate-300/60 bg-white">
            {/* Stamp if paid */}
            {invoice.status === 'Paid' && (
              <div className="absolute top-8 right-8 border-3 border-emerald-600 text-emerald-600 font-black text-xs px-3 py-1 rounded-xl rotate-12 uppercase tracking-widest opacity-80 pointer-events-none">
                PAID IN FULL
              </div>
            )}

            {/* School Header */}
            <div className="text-center pb-4 border-b-2 border-slate-800">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white font-black flex items-center justify-center text-sm shadow-md">
                  MH
                </div>
                <h2 className="text-lg font-black tracking-wider uppercase text-slate-900">
                  {settings.schoolName || 'MH ENGLISH PRIVATE HOME'}
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium">{settings.address}</p>
              <p className="text-[11px] text-slate-500 font-mono">
                Phone: {settings.phone} | EIIN: {settings.eiinCode}
              </p>
              <div className="mt-2 inline-block bg-[#0b1329] text-white text-[11px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                Money Receipt (Student Copy)
              </div>
            </div>

            {/* Receipt Info Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
              <div>
                <span className="text-slate-500 block font-semibold">Receipt No:</span>
                <span className="font-mono font-black text-slate-900 text-sm">{receiptNo}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block font-semibold">Date:</span>
                <span className="font-bold text-slate-900">{formatDate(paymentDate)}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">Student Name:</span>
                <span className="font-black text-slate-900 text-sm">{invoice.studentName}</span>
                <span className="font-mono text-blue-600 text-[11px] block font-bold">{invoice.studentId}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block font-semibold">Class & Section:</span>
                <span className="font-bold text-slate-900">
                  {invoice.classId} ({invoice.section})
                </span>
                <span className="text-slate-500 text-[11px] block font-medium">Invoice: #{invoice.invoiceNo}</span>
              </div>
            </div>

            {/* Payment Items Table */}
            <div className="py-4">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="py-2">SL</th>
                    <th className="py-2">Particulars / Description</th>
                    <th className="py-2 text-right">Amount (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 font-mono">01</td>
                    <td className="py-2.5 font-bold">{invoice.feeType}</td>
                    <td className="py-2.5 text-right font-mono font-bold">{formatCurrency(invoice.amount)}</td>
                  </tr>
                  {invoice.discount > 0 && (
                    <tr className="text-emerald-700">
                      <td className="py-2 font-mono">02</td>
                      <td className="py-2 font-medium">Special Waiver / Discount</td>
                      <td className="py-2 text-right font-mono font-bold">-{formatCurrency(invoice.discount)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals Summary */}
            <div className="border-t-2 border-slate-800 pt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 font-semibold">Net Payable:</span>
                <span className="font-mono font-bold text-slate-800">
                  {formatCurrency(invoice.amount - invoice.discount)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700">
                <span>Amount Paid Now:</span>
                <span className="font-mono text-sm">{formatCurrency(amountPaidNow)}</span>
              </div>
              <div className="flex justify-between font-bold text-rose-600">
                <span>Outstanding Balance:</span>
                <span className="font-mono text-sm">{formatCurrency(invoice.dueAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px] pt-1">
                <span>Payment Mode:</span>
                <span className="font-semibold text-slate-800 uppercase">{paymentMethod}</span>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-12 pt-4 flex justify-between items-end text-xs text-slate-600">
              <div className="text-center">
                <div className="w-32 border-t border-slate-400 mb-1"></div>
                <span className="text-[11px] font-semibold">Student / Guardian</span>
              </div>

              <div className="text-center">
                <div className="w-32 border-t border-slate-400 mb-1"></div>
                <span className="text-[11px] font-semibold">Authorized Signature</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 no-print font-medium">
          Computer generated official money receipt from MH ENGLISH PRIVATE HOME.
        </div>
      </div>
    </div>
  );
};
