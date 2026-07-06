import React, { useState, useEffect } from 'react';
import { StudentProfile, AttendanceItem, ExamPerformance, RecentAttendance } from '../types';
import { Award, Calendar, Bell, ShieldAlert, GraduationCap, Phone, Mail, MapPin, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { noticesService, Notice } from '../services/firestoreService';
// @ts-ignore
import studentProfilePhoto from '../assets/images/student_profile_photo.jpeg';

interface DashboardHomeProps {
  student: StudentProfile;
  attendanceItems: AttendanceItem[];
  examPerformances: ExamPerformance[];
  recentAttendance: RecentAttendance[];
  onNavigateToTab: (tabId: string) => void;
}

export default function DashboardHome({
  student,
  attendanceItems,
  examPerformances,
  recentAttendance,
  onNavigateToTab,
}: DashboardHomeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loadingNotices, setLoadingNotices] = useState(true);

  useEffect(() => {
    let active = true;
    const loadNotices = async () => {
      try {
        const fetched = await noticesService.getAll();
        if (active) {
          setNotices(fetched);
        }
      } catch (err) {
        console.error('Failed to load notices: ', err);
      } finally {
        if (active) {
          setLoadingNotices(false);
        }
      }
    };
    loadNotices();
    return () => {
      active = false;
    };
  }, []);

  // Calculate totals
  const totalClasses = attendanceItems.reduce((acc, curr) => acc + curr.totalClass, 0);
  const totalAttended = attendanceItems.reduce((acc, curr) => acc + curr.classAttended, 0);
  const overallPercentage = Math.round((totalAttended / totalClasses) * 100);

  // Filtered attendance table items
  const filteredAttendance = attendanceItems.filter(item =>
    item.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Student Profile Information Section */}
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-[#79a6c1] text-white px-4 py-2 text-sm font-semibold tracking-wider flex justify-between items-center">
          <span>Student Information Report</span>
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded uppercase">Active Student</span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-3 flex flex-col items-center">
            <div className="relative group">
              <img 
                alt={student.name} 
                className="w-40 h-48 object-cover border border-slate-300 rounded shadow-md group-hover:scale-105 transition-transform duration-200" 
                src={student.photoUrl || studentProfilePhoto}
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
          </div>
          
          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 text-xs md:text-sm">
            <div className="border-b pb-2">
              <span className="block text-slate-400 font-medium uppercase text-[10px] tracking-wide">Student Name</span>
              <span className="font-bold text-slate-800 text-sm">{student.name}</span>
            </div>
            <div className="border-b pb-2">
              <span className="block text-slate-400 font-medium uppercase text-[10px] tracking-wide">Roll No</span>
              <span className="font-bold text-slate-800 text-sm">{student.rollNo}</span>
            </div>
            <div className="border-b pb-2">
              <span className="block text-slate-400 font-medium uppercase text-[10px] tracking-wide">Date of Birth</span>
              <span className="font-bold text-slate-800 text-sm">{student.dob}</span>
            </div>
            <div className="border-b pb-2">
              <span className="block text-slate-400 font-medium uppercase text-[10px] tracking-wide">Course &amp; Batch</span>
              <span className="font-bold text-slate-800">{student.course} ({student.batch})</span>
            </div>
            <div className="border-b pb-2">
              <span className="block text-slate-400 font-medium uppercase text-[10px] tracking-wide">Academic Year</span>
              <span className="font-bold text-slate-800">{student.academicYear}</span>
            </div>
            <div className="border-b pb-2">
              <span className="block text-slate-400 font-medium uppercase text-[10px] tracking-wide">Year / Term</span>
              <span className="font-bold text-slate-800 text-blue-800">{student.yearTerm}</span>
            </div>
            <div className="border-b pb-2">
              <span className="block text-slate-400 font-medium uppercase text-[10px] tracking-wide">Student Contact</span>
              <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {student.studentMobile}
              </span>
              <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5 truncate max-w-xs">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {student.studentEmail}
              </span>
            </div>
            <div className="border-b pb-2">
              <span className="block text-slate-400 font-medium uppercase text-[10px] tracking-wide">Father Name</span>
              <span className="font-bold text-slate-800">{student.fatherName}</span>
              <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {student.fatherMobile}
              </span>
            </div>
            <div className="border-b pb-2">
              <span className="block text-slate-400 font-medium uppercase text-[10px] tracking-wide">Father Email</span>
              <span className="font-medium text-slate-800 flex items-center gap-1 mt-1 truncate max-w-xs">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {student.fatherEmail || 'N/A'}
              </span>
            </div>

            <div className="md:col-span-3 pt-2">
              <span className="block text-slate-400 font-medium uppercase text-[10px] tracking-wide flex items-center gap-0.5">
                <MapPin className="w-3 h-3" /> Address for Correspondence
              </span>
              <p className="font-medium text-slate-700 leading-relaxed mt-1 text-xs">
                {student.address}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Attendance Visuals (Pie Charts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Attendance Analysis */}
        <section className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="bg-[#79a6c1] text-white px-4 py-2 text-sm font-semibold tracking-wider">
            OVERALL ATTENDANCE ANALYSIS
          </div>
          <div className="p-6 flex flex-col md:flex-row items-center justify-around gap-6">
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Attendance Percentage</span>
              <div 
                className="relative w-44 h-44 rounded-full flex items-center justify-center shadow-inner overflow-hidden transition-all duration-300" 
                style={{ background: `conic-gradient(#22c55e 0% ${overallPercentage}%, #ef4444 ${overallPercentage}% 100%)` }}
              >
                {/* Center circle cut-out */}
                <div className="absolute w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-md">
                  <span className="text-3xl font-extrabold text-slate-800">{overallPercentage}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Attendance</span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100 flex items-center justify-between w-52">
                <div className="flex items-center">
                  <span className="w-3.5 h-3.5 bg-green-500 rounded mr-2.5 inline-block"></span>
                  <span className="font-semibold text-slate-600">Present Classes</span>
                </div>
                <span className="font-extrabold text-green-600 text-sm">{totalAttended}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100 flex items-center justify-between w-52">
                <div className="flex items-center">
                  <span className="w-3.5 h-3.5 bg-red-500 rounded mr-2.5 inline-block"></span>
                  <span className="font-semibold text-slate-600">Absent Classes</span>
                </div>
                <span className="font-extrabold text-red-600 text-sm">{totalClasses - totalAttended}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100 flex items-center justify-between w-52 font-bold border-t-2">
                <div className="flex items-center">
                  <span className="w-3.5 h-3.5 bg-slate-400 rounded mr-2.5 inline-block"></span>
                  <span className="font-bold text-slate-700">Total Lectures</span>
                </div>
                <span className="font-extrabold text-slate-800 text-sm">{totalClasses}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Class Analysis (Theory vs Practical vs Clinical) */}
        <section className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="bg-[#79a6c1] text-white px-4 py-2 text-sm font-semibold tracking-wider">
            CLASS ANALYSIS (ATTENDED BREAKDOWN)
          </div>
          <div className="p-6 flex flex-col md:flex-row items-center justify-around gap-6">
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Lectures Attended</span>
              <div 
                className="relative w-44 h-44 rounded-full flex items-center justify-center shadow-inner overflow-hidden" 
                style={{ background: `conic-gradient(#f97316 0% 46%, #22c55e 46% 69%, #3b82f6 69% 100%)` }}
              >
                {/* Center circle cut-out */}
                <div className="absolute w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-md">
                  <span className="text-3xl font-extrabold text-slate-800">{totalAttended}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total Attended</span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100 flex items-center justify-between w-52">
                <div className="flex items-center">
                  <span className="w-3.5 h-3.5 bg-orange-500 rounded mr-2.5 inline-block"></span>
                  <span className="font-semibold text-slate-600 font-medium">Theory Classes</span>
                </div>
                <span className="font-extrabold text-orange-600 text-sm">55</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100 flex items-center justify-between w-52">
                <div className="flex items-center">
                  <span className="w-3.5 h-3.5 bg-green-500 rounded mr-2.5 inline-block"></span>
                  <span className="font-semibold text-slate-600 font-medium">Practical Classes</span>
                </div>
                <span className="font-extrabold text-green-600 text-sm">27</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100 flex items-center justify-between w-52">
                <div className="flex items-center">
                  <span className="w-3.5 h-3.5 bg-blue-500 rounded mr-2.5 inline-block"></span>
                  <span className="font-semibold text-slate-600 font-medium">Clinical Classes</span>
                </div>
                <span className="font-extrabold text-blue-600 text-sm">36</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Detailed Attendance Table Area */}
      <section className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-sm font-semibold tracking-wider flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Overall Attendance For Current Academic Year / Term</span>
          
          <div className="relative text-slate-800">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Search subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-2.5 py-1 text-xs bg-white rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-48 placeholder-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#4a7c9d] text-white font-semibold uppercase tracking-wider text-[11px] border-b border-slate-300">
                <th className="px-4 py-2.5 border border-slate-200">Subject Name</th>
                <th className="px-4 py-2.5 border border-slate-200 text-center">Category</th>
                <th className="px-4 py-2.5 border border-slate-200 text-center">Total Class</th>
                <th className="px-4 py-2.5 border border-slate-200 text-center">Class Attended</th>
                <th className="px-4 py-2.5 border border-slate-200 text-center">Actual %</th>
                <th className="px-4 py-2.5 border border-slate-200 text-center">Min % Req.</th>
                <th className="px-4 py-2.5 border border-slate-200 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400 font-medium">No subjects matched your search filter.</td>
                </tr>
              ) : (
                filteredAttendance.map((item, idx) => {
                  const isShortage = item.actualPercentage < item.minReqPercentage;
                  return (
                    <tr 
                      key={idx} 
                      className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'} hover:bg-blue-50/30 transition-colors duration-150`}
                    >
                      <td className="px-4 py-2 border border-slate-200 font-medium text-slate-800">{item.subjectName}</td>
                      <td className="px-4 py-2 border border-slate-200 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.categoryName === 'Theory' ? 'bg-orange-100 text-orange-800' :
                          item.categoryName === 'Practical' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.categoryName}
                        </span>
                      </td>
                      <td className="px-4 py-2 border border-slate-200 text-center font-semibold text-slate-700">{item.totalClass}</td>
                      <td className="px-4 py-2 border border-slate-200 text-center font-semibold text-slate-700">{item.classAttended}</td>
                      <td className={`px-4 py-2 border border-slate-200 text-center font-bold text-sm ${
                        isShortage ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {item.actualPercentage}%
                      </td>
                      <td className="px-4 py-2 border border-slate-200 text-center text-slate-500 font-medium">{item.minReqPercentage}%</td>
                      <td className="px-4 py-2 border border-slate-200 text-center">
                        {isShortage ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 rounded">
                            Shortage
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 rounded">
                            Clear
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="bg-[#004a99] text-white font-bold text-sm">
                <td className="px-4 py-2.5 border border-slate-300 text-right" colSpan={2}>Grand Total</td>
                <td className="px-4 py-2.5 border border-slate-300 text-center">{totalClasses}</td>
                <td className="px-4 py-2.5 border border-slate-300 text-center">{totalAttended}</td>
                <td className="px-4 py-2.5 border border-slate-300 text-center text-yellow-300 text-base">{overallPercentage}%</td>
                <td className="px-4 py-2.5 border border-slate-300 text-center" colSpan={2}>-</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {searchTerm && (
          <div className="p-2 bg-slate-50 border-t border-slate-200 text-right">
            <button 
              onClick={() => setSearchTerm('')} 
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </section>

      {/* Grid of Exam Performance & Last 3 Days Attendance List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exam Performance */}
        <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-[#79a6c1] text-white px-4 py-2 text-sm font-semibold tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> EXAM PERFORMANCE
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#4a7c9d] text-white font-medium border-b border-slate-300">
                  <th className="px-4 py-2.5 border border-slate-200">Exams</th>
                  <th className="px-4 py-2.5 border border-slate-200 text-center">Total Marks</th>
                  <th className="px-4 py-2.5 border border-slate-200 text-center">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {examPerformances.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 border border-slate-200 font-bold text-slate-700">{item.examName}</td>
                    <td className="px-4 py-3 border border-slate-200 text-center font-semibold text-slate-600">{item.totalMarks}</td>
                    <td className="px-4 py-3 border border-slate-200 text-center">
                      <span className="px-2 py-1 bg-blue-50 text-[#004a99] font-bold rounded">
                        {item.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <button 
              onClick={() => onNavigateToTab('exam_results')}
              className="text-xs font-semibold text-[#004a99] hover:underline"
            >
              View Full Marks details
            </button>
          </div>
        </section>

        {/* Last 3 Days Attendance List */}
        <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-[#79a6c1] text-white px-4 py-2 text-sm font-semibold tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> LAST 3 DAYS ATTENDANCE LIST
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#4a7c9d] text-white font-medium border-b border-slate-300">
                    <th className="px-4 py-2.5 border border-slate-200">Subject Name</th>
                    <th className="px-4 py-2.5 border border-slate-200 text-center">Status</th>
                    <th className="px-4 py-2.5 border border-slate-200 text-center">Date</th>
                    <th className="px-4 py-2.5 border border-slate-200">Session / Faculty</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-2.5 border border-slate-200 font-medium text-slate-700">{item.subjectName}</td>
                      <td className="px-4 py-2.5 border border-slate-200 text-center">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold rounded text-[10px]">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 border border-slate-200 text-center text-slate-600 font-semibold">{item.date}</td>
                      <td className="px-4 py-2.5 border border-slate-200 text-[10px] text-slate-500 font-medium">
                        <div className="font-semibold text-slate-700">{item.session}</div>
                        <div>{item.facultyName}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <button 
              onClick={() => onNavigateToTab('attendance_report')}
              className="text-xs font-semibold text-[#004a99] hover:underline"
            >
              Filter Attendance Reports &amp; Charts
            </button>
          </div>
        </section>
      </div>

      {/* Notices and Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-[#79a6c1] text-white px-4 py-2 text-sm font-semibold tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4" /> NOTICE BOARD / ANNOUNCEMENTS
            </div>
            <div className="p-4 max-h-[350px] overflow-y-auto space-y-3">
              {loadingNotices ? (
                <div className="py-12 text-center text-slate-400 font-medium text-xs animate-pulse">
                  Loading latest announcements...
                </div>
              ) : notices.filter(n => !n.isUrgent).length === 0 ? (
                <div className="p-6 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                    <Bell className="w-5 h-5 animate-pulse" />
                  </div>
                  <p className="font-semibold text-slate-600">No new academic notifications.</p>
                  <p className="text-[10px] text-slate-400 text-center">Announcements posted by administrative staff will appear here.</p>
                </div>
              ) : (
                notices.filter(n => !n.isUrgent).map((notice) => (
                  <div key={notice.id} className="p-3 bg-blue-50/40 border border-blue-100 rounded-lg hover:bg-blue-50 transition text-xs">
                    <div className="flex justify-between items-center text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">
                      <span>{notice.category}</span>
                      <span>{notice.date}</span>
                    </div>
                    <h5 className="font-bold text-slate-800 text-xs leading-snug">{notice.title}</h5>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">{notice.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-[#79a6c1] text-white px-4 py-2 text-sm font-semibold tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> URGENT ALERTS &amp; EVENTS
            </div>
            <div className="p-4 max-h-[350px] overflow-y-auto space-y-3">
              {loadingNotices ? (
                <div className="py-12 text-center text-slate-400 font-medium text-xs animate-pulse">
                  Loading latest alerts...
                </div>
              ) : notices.filter(n => n.isUrgent).length === 0 ? (
                <div className="p-6 flex flex-col items-center justify-center text-red-500 bg-red-50/40 space-y-2 text-xs">
                  <div className="p-2 bg-red-100 text-red-600 rounded-full">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-red-800">No active alerts or events exist</p>
                  <p className="text-[10px] text-red-500 text-center font-medium">Urgent attendance, fee notices or exam warnings will trigger alerts.</p>
                </div>
              ) : (
                notices.filter(n => n.isUrgent).map((notice) => (
                  <div key={notice.id} className="p-3 bg-red-50 border border-red-100 rounded-lg relative hover:bg-red-100/30 transition text-xs">
                    <div className="flex justify-between items-center text-[10px] text-red-600 font-extrabold uppercase tracking-wider mb-1">
                      <span>{notice.category} • CRITICAL</span>
                      <span>{notice.date}</span>
                    </div>
                    <h5 className="font-extrabold text-red-950 text-xs leading-snug">{notice.title}</h5>
                    <p className="text-[11px] text-red-800 mt-1.5 leading-relaxed font-medium">{notice.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
