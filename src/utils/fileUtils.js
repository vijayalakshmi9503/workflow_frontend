// src/utils/fileUtils.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const downloadExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Approvals');
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  saveAs(new Blob([buf]), 'approvals.xlsx');
};

export const downloadCSV = (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'approvals.csv');
};

export const downloadPDF = (data) => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [['Name', 'Status']],
    body: data.map(item => [item.name, item.status]),
  });
  doc.save('approvals.pdf');
};
