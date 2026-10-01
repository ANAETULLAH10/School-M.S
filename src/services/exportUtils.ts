/**
 * Export and formatting utilities for School Management System
 */

export function formatCurrency(amount: number | string | undefined | null, currency = '৳'): string {
  const num = Number(amount) || 0;
  return `${currency}${num.toLocaleString('en-US')}`;
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function calculateAgeFromDob(dobStr?: string | null): string {
  if (!dobStr) return '';
  try {
    const birthDate = new Date(dobStr);
    if (isNaN(birthDate.getTime())) return '';
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }

    if (years <= 0 && months <= 0) return 'Under 1 Month';
    if (years <= 0) return `${months} Month${months > 1 ? 's' : ''}`;
    if (months === 0) return `${years} Years`;
    return `${years} Years ${months} Mo`;
  } catch {
    return '';
  }
}

export function exportToCSV(filename: string, headers: string[], rows: (string | number | undefined | null)[][]): void {
  const sanitize = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(sanitize).join(','),
    ...rows.map((row) => row.map(sanitize).join(',')),
  ].join('\r\n');

  // Add UTF-8 BOM so Excel opens symbols like ৳ properly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printSection(title?: string): void {
  if (title) {
    document.title = title;
  }
  window.print();
}
