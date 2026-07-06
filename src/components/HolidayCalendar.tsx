import React, { useState } from 'react';
import { HolidayItem, VacationItem } from '../types';
import { Calendar, Sun, Palmtree, ChevronRight } from 'lucide-react';

interface HolidayCalendarProps {
  holidays: HolidayItem[];
  vacations: VacationItem[];
}

export default function HolidayCalendar({ holidays, vacations }: HolidayCalendarProps) {
  const [selectedYear, setSelectedYear] = useState('2026');

  return (
    <div className="space-y-6">
      {/* Header with year filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-6 h-6 text-[#004a99]" />
            Holiday &amp; Vacation Calendar
          </h2>
          <p className="text-xs text-slate-500 mt-1">Official college and government gazetted holidays list</p>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-1.5 border border-slate-300 rounded text-xs bg-white text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>

      {/* World College Holidays Report */}
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Sun className="w-4 h-4" /> World College of Medical Sciences &amp; Research Holidays Report ({selectedYear})
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#4a7c9d] text-white font-semibold uppercase tracking-wider text-[11px] border-b border-slate-300">
                <th className="px-4 py-2.5 border border-slate-200 text-center w-16">Sl.No.</th>
                <th className="px-4 py-2.5 border border-slate-200">Holiday Name</th>
                <th className="px-4 py-2.5 border border-slate-200 text-center">Date</th>
                <th className="px-4 py-2.5 border border-slate-200 text-center">Day</th>
                <th className="px-4 py-2.5 border border-slate-200 text-center">Applicable To</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((item, idx) => (
                <tr 
                  key={idx} 
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50/20 transition-colors duration-150`}
                >
                  <td className="px-4 py-2 border border-slate-200 text-center font-mono font-bold text-slate-400">{item.slNo}</td>
                  <td className="px-4 py-2 border border-slate-200 font-bold text-slate-800">{item.holidayName}</td>
                  <td className="px-4 py-2 border border-slate-200 text-center font-bold text-slate-600">{item.date}</td>
                  <td className="px-4 py-2 border border-slate-200 text-center text-slate-500 font-medium">{item.day}</td>
                  <td className="px-4 py-2 border border-slate-200 text-center">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded border border-indigo-200">
                      {item.applicableTo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Vacation List */}
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Palmtree className="w-4 h-4" /> Vacation List ({selectedYear})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#4a7c9d] text-white font-semibold uppercase tracking-wider text-[11px] border-b border-slate-300">
                <th className="px-4 py-2.5 border border-slate-200 text-center w-16">Sl.No.</th>
                <th className="px-4 py-2.5 border border-slate-200">Vacation Name</th>
                <th className="px-4 py-2.5 border border-slate-200 text-center">From Date</th>
                <th className="px-4 py-2.5 border border-slate-200 text-center">To Date</th>
                <th className="px-4 py-2.5 border border-slate-200 text-center">No. of Days</th>
                <th className="px-4 py-2.5 border border-slate-200 text-center">Applicable To</th>
              </tr>
            </thead>
            <tbody>
              {vacations.map((item, idx) => (
                <tr 
                  key={idx} 
                  className="bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors duration-150"
                >
                  <td className="px-4 py-3 border border-slate-200 text-center font-mono font-bold text-emerald-600">{item.slNo}</td>
                  <td className="px-4 py-3 border border-slate-200 font-bold text-emerald-900">{item.vacationName}</td>
                  <td className="px-4 py-3 border border-slate-200 text-center font-bold text-slate-600">{item.fromDate}</td>
                  <td className="px-4 py-3 border border-slate-200 text-center font-bold text-slate-600">{item.toDate}</td>
                  <td className="px-4 py-3 border border-slate-200 text-center font-bold text-emerald-700 text-sm">{item.noOfDays}</td>
                  <td className="px-4 py-3 border border-slate-200 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded border border-emerald-200">
                      {item.applicableTo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Helpful Legend / Information */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4 text-xs text-slate-600 leading-relaxed flex items-start gap-2">
        <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-blue-800">Please Note:</span> Gazetted holidays are subject to government declarations. Student clinical postings, ward attachments, and emergency training are scheduled authoritatively even during vacations. Please consult your respective department heads for specific schedule revisions.
        </div>
      </div>
    </div>
  );
}
