import React, { useState, useEffect } from 'react';
import { AttendanceItem } from '../types';
import { 
  Calendar, 
  Filter, 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  BarChart2, 
  PieChart as PieIcon, 
  TrendingUp, 
  Plus, 
  Minus, 
  RotateCcw, 
  ChevronRight, 
  BookOpen, 
  Info,
  Award,
  Edit2
} from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AttendanceReportProps {
  attendanceItems: AttendanceItem[];
  isAdmin?: boolean;
  onUpdateAttendanceItems?: (items: AttendanceItem[]) => void;
}

export default function AttendanceReport({ 
  attendanceItems: propAttendanceItems,
  isAdmin = false,
  onUpdateAttendanceItems
}: AttendanceReportProps) {
  // Local state to support interactive modifications / resets
  const [attendanceItems, setAttendanceItems] = useState<AttendanceItem[]>(propAttendanceItems);

  useEffect(() => {
    setAttendanceItems(propAttendanceItems);
  }, [propAttendanceItems]);

  // Tabs: 'records' (original bar list), 'charts' (recharts pie analysis)
  const [activeSubTab, setActiveSubTab] = useState<'records' | 'charts'>('records');
  const [isEditingBarChart, setIsEditingBarChart] = useState(false);

  const fromDate = '2026-06-01';
  const toDate = '2026-06-28';

  // Pie chart 1 data: Clear vs Shortage Count
  const shortageCount = attendanceItems.filter(item => item.actualPercentage < item.minReqPercentage).length;
  const clearCount = attendanceItems.filter(item => item.actualPercentage >= item.minReqPercentage).length;
  const overallClearanceData = [
    { name: 'Cleared Min %', value: clearCount, color: '#22c55e' },
    { name: 'Shortage Status', value: shortageCount, color: '#ef4444' }
  ];

  // Pie chart 2 data: Categories breakdown (Lectures Attended total)
  const theoryAttended = attendanceItems
    .filter(item => item.categoryName === 'Theory')
    .reduce((acc, curr) => acc + curr.classAttended, 0);
  const practicalAttended = attendanceItems
    .filter(item => item.categoryName === 'Practical')
    .reduce((acc, curr) => acc + curr.classAttended, 0);
  const clinicalAttended = attendanceItems
    .filter(item => item.categoryName === 'Clinical')
    .reduce((acc, curr) => acc + curr.classAttended, 0);

  const categoryBreakdownData = [
    { name: 'Theory Lectures', value: theoryAttended, color: '#f97316' },
    { name: 'Practical Lectures', value: practicalAttended, color: '#10b981' },
    { name: 'Clinical Lectures', value: clinicalAttended, color: '#3b82f6' }
  ];

  const handleLocalAttendanceChange = (index: number, field: 'totalClass' | 'classAttended' | 'minReqPercentage', value: number) => {
    const updated = [...attendanceItems];
    const item = { ...updated[index] };
    
    if (field === 'totalClass') {
      item.totalClass = Math.max(1, value);
    } else if (field === 'classAttended') {
      item.classAttended = Math.max(0, Math.min(item.totalClass, value));
    } else if (field === 'minReqPercentage') {
      item.minReqPercentage = Math.max(0, Math.min(100, value));
    }
    
    item.actualPercentage = item.totalClass > 0 ? Math.round((item.classAttended / item.totalClass) * 100) : 0;
    updated[index] = item;
    setAttendanceItems(updated);
    
    if (onUpdateAttendanceItems) {
      onUpdateAttendanceItems(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg p-2 flex flex-wrap gap-2 shadow-sm">
        <button
          onClick={() => setActiveSubTab('records')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase rounded tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'records'
              ? 'bg-[#004a99] text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart2 className="w-4 h-4" /> Official Records
        </button>
        <button
          onClick={() => setActiveSubTab('charts')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase rounded tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'charts'
              ? 'bg-[#004a99] text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PieIcon className="w-4 h-4" /> Pie Chart Insights
        </button>
      </div>

      {activeSubTab === 'records' && (
        <div className="space-y-6">
              {/* Statistics summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Subjects</span>
                    <span className="text-2xl font-black text-slate-800">{attendanceItems.length}</span>
                  </div>
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-full">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Classes with Shortage</span>
                    <span className="text-2xl font-black text-red-600">
                      {attendanceItems.filter(item => item.actualPercentage < item.minReqPercentage).length}
                    </span>
                  </div>
                  <div className="p-2.5 bg-red-50 text-red-600 rounded-full">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Classes with Cleared Min</span>
                    <span className="text-2xl font-black text-green-600">
                      {attendanceItems.filter(item => item.actualPercentage >= item.minReqPercentage).length}
                    </span>
                  </div>
                  <div className="p-2.5 bg-green-50 text-green-600 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Attendance horizontal Bar Chart */}
              <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                  <span>Overall Attendance Bar Chart For Current Academic Year / Term</span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setIsEditingBarChart(!isEditingBarChart)}
                      className="text-[10px] bg-[#004a99] hover:bg-[#003366] text-white font-black py-1 px-2.5 rounded uppercase tracking-wider cursor-pointer flex items-center gap-1 transition"
                    >
                      <Edit2 className="w-3 h-3" /> {isEditingBarChart ? 'Close Edit Mode' : 'Edit Chart Data'}
                    </button>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 mb-6 font-medium">
                    <span className="font-bold text-slate-800 uppercase tracking-wider mr-1.5">Note:</span> 
                    Columns highlighted in <span className="text-green-600 font-bold bg-green-50 px-1 py-0.5 rounded border border-green-200">Green color</span> are Min % Attended, 
                    and <span className="text-red-600 font-bold bg-red-50 px-1 py-0.5 rounded border border-red-200">Red Color</span> represent Attendance Shortage.
                  </div>

                  {/* Graphical representation */}
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {attendanceItems.map((item, idx) => {
                      const isShortage = item.actualPercentage < item.minReqPercentage;
                      return (
                        <div key={idx} className="grid grid-cols-12 items-center gap-3 text-xs border-b border-slate-100 pb-2 md:pb-0 md:border-b-0">
                          {/* Subject label */}
                          <div className={`${isEditingBarChart ? 'col-span-12 md:col-span-3' : 'col-span-12 md:col-span-4'} font-semibold text-slate-700 truncate`} title={item.subjectName}>
                            {item.subjectName}
                          </div>

                          {/* Bar chart column */}
                          <div className={isEditingBarChart ? 'col-span-12 md:col-span-4' : 'col-span-10 md:col-span-7'}>
                            <div className="w-full bg-slate-100 h-5 rounded overflow-hidden border border-slate-200 relative">
                              {/* Green/Red fill */}
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.actualPercentage}%` }}
                                transition={{ duration: 0.6, delay: idx * 0.03 }}
                                className={`h-full ${isShortage ? 'bg-red-500' : 'bg-green-500'}`}
                              />
                              {/* Threshold marker */}
                              <div 
                                className="absolute top-0 bottom-0 border-l border-dashed border-slate-400" 
                                style={{ left: `${item.minReqPercentage}%` }}
                                title={`Minimum Required: ${item.minReqPercentage}%`}
                              />
                            </div>
                          </div>

                          {/* Inline Edit Inputs for Admin */}
                          {isEditingBarChart && (
                            <div className="col-span-12 md:col-span-4 flex items-center gap-1.5 justify-start md:justify-end flex-wrap">
                              <div className="flex items-center gap-1 bg-white border border-slate-200 px-1 py-0.5 rounded shadow-sm">
                                <span className="text-[9px] text-slate-400 uppercase font-bold mr-0.5">Att:</span>
                                <button
                                  type="button"
                                  onClick={() => handleLocalAttendanceChange(idx, 'classAttended', item.classAttended - 1)}
                                  className="w-4 h-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded flex items-center justify-center font-extrabold cursor-pointer"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={item.classAttended}
                                  onChange={(e) => handleLocalAttendanceChange(idx, 'classAttended', parseInt(e.target.value, 10) || 0)}
                                  className="w-8 text-center text-[10px] font-bold text-slate-800 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleLocalAttendanceChange(idx, 'classAttended', item.classAttended + 1)}
                                  className="w-4 h-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded flex items-center justify-center font-extrabold cursor-pointer"
                                >
                                  +
                                </button>
                              </div>

                              <div className="flex items-center gap-1 bg-white border border-slate-200 px-1 py-0.5 rounded shadow-sm">
                                <span className="text-[9px] text-slate-400 uppercase font-bold mr-0.5">Tot:</span>
                                <button
                                  type="button"
                                  onClick={() => handleLocalAttendanceChange(idx, 'totalClass', item.totalClass - 1)}
                                  className="w-4 h-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded flex items-center justify-center font-extrabold cursor-pointer"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={item.totalClass}
                                  onChange={(e) => handleLocalAttendanceChange(idx, 'totalClass', parseInt(e.target.value, 10) || 1)}
                                  className="w-8 text-center text-[10px] font-bold text-slate-800 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleLocalAttendanceChange(idx, 'totalClass', item.totalClass + 1)}
                                  className="w-4 h-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded flex items-center justify-center font-extrabold cursor-pointer"
                                >
                                  +
                                </button>
                              </div>

                              <div className="flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
                                <span className="text-[9px] text-slate-400 uppercase font-bold mr-0.5">Min:</span>
                                <input
                                  type="number"
                                  value={item.minReqPercentage}
                                  onChange={(e) => handleLocalAttendanceChange(idx, 'minReqPercentage', parseInt(e.target.value, 10) || 0)}
                                  className="w-8 text-center text-[10px] font-bold text-slate-800 focus:outline-none"
                                />
                                <span className="text-[9px] text-slate-400 font-bold">%</span>
                              </div>
                            </div>
                          )}

                          {/* Percentage display */}
                          <div className={`${isEditingBarChart ? 'col-span-12 md:col-span-1' : 'col-span-2 md:col-span-1'} text-right font-black text-slate-800`}>
                            <span className={isShortage ? 'text-red-600' : 'text-green-600'}>
                              {item.actualPercentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chart X-axis axis legend */}
                  <div className="max-w-4xl mx-auto grid grid-cols-12 text-[10px] font-bold text-slate-400 mt-3 border-t pt-2">
                    <div className={isEditingBarChart ? 'col-span-12 md:col-span-3 text-left' : 'col-span-12 md:col-span-4 text-left'}>Subject Name</div>
                    <div className={isEditingBarChart ? 'col-span-12 md:col-span-4 flex justify-between' : 'col-span-10 md:col-span-7 flex justify-between'}>
                      <span>0%</span>
                      <span>20%</span>
                      <span>40%</span>
                      <span>60%</span>
                      <span>80%</span>
                      <span>100%</span>
                    </div>
                    {isEditingBarChart && (
                      <div className="col-span-12 md:col-span-4 text-right pr-4 hidden md:block">Interactive Controls</div>
                    )}
                    <div className={isEditingBarChart ? 'col-span-12 md:col-span-1 text-right' : 'col-span-2 md:col-span-1 text-right'}>Actual %</div>
                  </div>

                </div>
              </section>

              {/* Complete records grid table */}
              <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                  <span>All Subject Records Table ({fromDate} to {toDate})</span>
                  {isAdmin && (
                    <span className="text-[10px] bg-[#004a99] px-2.5 py-1 rounded text-white font-extrabold uppercase animate-pulse">
                      Admin Edit Mode Active
                    </span>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#4a7c9d] text-white font-semibold uppercase tracking-wider text-[11px] border-b border-slate-300">
                        <th className="px-4 py-2.5 border border-slate-200">Subject Name</th>
                        <th className="px-4 py-2.5 border border-slate-200 text-center">Category</th>
                        <th className="px-4 py-2.5 border border-slate-200 text-center">Classes Scheduled</th>
                        <th className="px-4 py-2.5 border border-slate-200 text-center">Classes Attended</th>
                        <th className="px-4 py-2.5 border border-slate-200 text-center">Required Min %</th>
                        <th className="px-4 py-2.5 border border-slate-200 text-center">Actual Attended %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceItems.map((item, idx) => {
                        const isShortage = item.actualPercentage < item.minReqPercentage;
                        return (
                          <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100/50 transition`}>
                            <td className="px-4 py-2 border border-slate-200 font-semibold text-slate-800">{item.subjectName}</td>
                            <td className="px-4 py-2 border border-slate-200 text-center font-bold text-[10px] text-slate-500">{item.categoryName}</td>
                            <td className="px-4 py-2 border border-slate-200 text-center font-semibold text-slate-700">
                              {isAdmin ? (
                                <div className="flex items-center justify-center gap-1.5 max-w-[120px] mx-auto">
                                  <button
                                    type="button"
                                    onClick={() => handleLocalAttendanceChange(idx, 'totalClass', item.totalClass - 1)}
                                    className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded font-bold text-center text-xs flex items-center justify-center cursor-pointer text-slate-700"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.totalClass}
                                    onChange={(e) => handleLocalAttendanceChange(idx, 'totalClass', parseInt(e.target.value, 10) || 1)}
                                    className="w-12 text-center p-1 border border-slate-300 rounded text-xs font-bold text-slate-800 focus:outline-none focus:border-[#004a99]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleLocalAttendanceChange(idx, 'totalClass', item.totalClass + 1)}
                                    className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded font-bold text-center text-xs flex items-center justify-center cursor-pointer text-slate-700"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                item.totalClass
                              )}
                            </td>
                            <td className="px-4 py-2 border border-slate-200 text-center font-semibold text-slate-700">
                              {isAdmin ? (
                                <div className="flex items-center justify-center gap-1.5 max-w-[120px] mx-auto">
                                  <button
                                    type="button"
                                    onClick={() => handleLocalAttendanceChange(idx, 'classAttended', item.classAttended - 1)}
                                    className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded font-bold text-center text-xs flex items-center justify-center cursor-pointer text-slate-700"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    max={item.totalClass}
                                    value={item.classAttended}
                                    onChange={(e) => handleLocalAttendanceChange(idx, 'classAttended', parseInt(e.target.value, 10) || 0)}
                                    className="w-12 text-center p-1 border border-slate-300 rounded text-xs font-bold text-slate-800 focus:outline-none focus:border-[#004a99]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleLocalAttendanceChange(idx, 'classAttended', item.classAttended + 1)}
                                    className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded font-bold text-center text-xs flex items-center justify-center cursor-pointer text-slate-700"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                item.classAttended
                              )}
                            </td>
                            <td className="px-4 py-2 border border-slate-200 text-center font-semibold text-slate-700">
                              {isAdmin ? (
                                <div className="flex items-center justify-center gap-1 max-w-[80px] mx-auto">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={item.minReqPercentage}
                                    onChange={(e) => handleLocalAttendanceChange(idx, 'minReqPercentage', parseInt(e.target.value, 10) || 0)}
                                    className="w-12 text-center p-1 border border-slate-300 rounded text-xs font-bold text-slate-800 focus:outline-none focus:border-[#004a99]"
                                  />
                                  <span className="text-slate-500 font-bold">%</span>
                                </div>
                              ) : (
                                `${item.minReqPercentage}%`
                              )}
                            </td>
                            <td className={`px-4 py-2 border border-slate-200 text-center font-bold ${isShortage ? 'text-red-600 bg-red-50/20' : 'text-green-600 bg-green-50/10'}`}>
                              {item.actualPercentage}% {isShortage ? '(Shortage)' : '(Clear)'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
        </div>
      )}

      {/* Pie Chart Insights Tab */}
      {activeSubTab === 'charts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Attendance clearance Pie Chart */}
          <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider">
              Overall Subject Clearance Status
            </div>
            <div className="p-6 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Cleared vs. Shortage Subjects</span>
              <div className="w-full h-64 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overallClearanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {overallClearanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Subjects`, 'Count']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 w-full text-center border-t pt-4 text-xs">
                <div>
                  <span className="block text-2xl font-black text-green-500">{clearCount}</span>
                  <span className="text-slate-400 font-bold uppercase text-[9px]">Cleared Subjects</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-red-500">{shortageCount}</span>
                  <span className="text-slate-400 font-bold uppercase text-[9px]">Shortage Subjects</span>
                </div>
              </div>
            </div>
          </section>

          {/* Category breakdown Pie Chart */}
          <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider">
              Lecture Category breakdown (Attended total)
            </div>
            <div className="p-6 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Total Attended Lectures by Class Type</span>
              <div className="w-full h-64 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Lectures`, 'Attended']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center border-t pt-4 text-xs font-semibold">
                <div>
                  <span className="text-[#f97316] font-bold">{theoryAttended}</span>
                  <span className="block text-[8px] text-slate-400 uppercase">Theory</span>
                </div>
                <div>
                  <span className="text-[#10b981] font-bold">{practicalAttended}</span>
                  <span className="block text-[8px] text-slate-400 uppercase">Practical</span>
                </div>
                <div>
                  <span className="text-[#3b82f6] font-bold">{clinicalAttended}</span>
                  <span className="block text-[8px] text-slate-400 uppercase">Clinical</span>
                </div>
              </div>
            </div>
          </section>

          {/* Subject Comparison Donut */}
          <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden md:col-span-2">
            <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider">
              Detailed Subject Attendance Distribution
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceItems.map(item => ({
                        name: item.subjectName,
                        value: item.classAttended,
                        percentage: item.actualPercentage
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={90}
                      dataKey="value"
                    >
                      {attendanceItems.map((item, index) => {
                        const isShortage = item.actualPercentage < item.minReqPercentage;
                        return (
                          <Cell key={`cell-${index}`} fill={isShortage ? '#f43f5e' : '#3b82f6'} />
                        );
                      })}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} Classes Attended (${props.payload.percentage}%)`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="lg:col-span-5 text-xs space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                <h4 className="font-bold text-slate-700 mb-2 uppercase text-[10px] tracking-wider">Subject Color Guide</h4>
                <div className="flex items-center gap-1.5 text-slate-500 pb-2 border-b">
                  <span className="w-2.5 h-2.5 bg-[#f43f5e] rounded-full shrink-0"></span>
                  <span>Shortage (Below Minimum Required)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 pb-2 border-b">
                  <span className="w-2.5 h-2.5 bg-[#3b82f6] rounded-full shrink-0"></span>
                  <span>Cleared (Meets Academic Requirements)</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed pt-2">
                  The chart represents the relative volume of attended classes. Red slices highlight high-alert subjects requiring immediate presence.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

    </div>
  );
}
