// src/components/ExportCalendar.jsx
import React, { useState } from 'react';
import { Download, Printer, FileText, Grid } from 'lucide-react';
import * as XLSX from 'xlsx';

export const ExportCalendar = ({ plan, notes, completed }) => {
  const [showExportOptions, setShowExportOptions] = useState(false);

  const generatePDF = () => {
    window.print();
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Format data for Excel
    const excelData = plan.map(day => ({
      Date: new Date(day.date).toLocaleDateString(),
      'Practice Minutes': day.minutes,
      Focus: day.focus,
      Notes: notes[day.date] || '',
      Completed: completed[day.date] ? 'Yes' : 'No'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Practice Calendar');
    XLSX.writeFile(workbook, 'practice_calendar.xlsx');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowExportOptions(!showExportOptions)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export Calendar
      </button>

      {showExportOptions && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-48">
          <button
            onClick={generatePDF}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print View
          </button>
          <button
            onClick={exportToExcel}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
          >
            <Grid className="w-4 h-4" />
            Export to Excel
          </button>
        </div>
      )}
    </div>
  );
};