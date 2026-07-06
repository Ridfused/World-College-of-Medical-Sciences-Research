import React, { useState, useEffect } from 'react';
import { StudentProfile, AttendanceItem, ExamPerformance } from '../types';
import { 
  User, 
  BookOpen, 
  Award, 
  DollarSign, 
  Plus, 
  Trash2, 
  Undo, 
  Check, 
  ShieldAlert, 
  RefreshCw,
  Save,
  Send,
  Clock,
  Edit2,
  X,
  Bell,
  Mail,
  Database,
  Inbox,
  Eye,
  Activity,
  UserCheck,
  Heart
} from 'lucide-react';
import { 
  statisticsService, 
  coursesService, 
  departmentsService, 
  facultyService, 
  noticesService, 
  admissionsService, 
  contactMessagesService,
  Statistic, 
  Course, 
  Department, 
  Faculty, 
  Notice, 
  Admission, 
  ContactMessage 
} from '../services/firestoreService';

interface AdminPanelProps {
  student: StudentProfile;
  setStudent: (s: StudentProfile) => void;
  attendanceItems: AttendanceItem[];
  setAttendanceItems: (items: AttendanceItem[]) => void;
  examPerformances: ExamPerformance[];
  setExamPerformances: (exams: ExamPerformance[]) => void;
  pendingFeeBalance: number;
  setPendingFeeBalance: (fee: number) => void;
  onResetToDefaults: () => void;
  gatepasses: Array<{
    id: number;
    reason: string;
    outDate: string;
    inDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    timestamp: string;
  }>;
  setGatepasses: React.Dispatch<React.SetStateAction<Array<{
    id: number;
    reason: string;
    outDate: string;
    inDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    timestamp: string;
  }>>>;
}

export default function AdminPanel({
  student,
  setStudent,
  attendanceItems,
  setAttendanceItems,
  examPerformances,
  setExamPerformances,
  pendingFeeBalance,
  setPendingFeeBalance,
  onResetToDefaults,
  gatepasses,
  setGatepasses,
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'attendance' | 'exams' | 'financials' | 'gatepass' | 'notices' | 'admissions' | 'contact_messages' | 'college_assets'>('profile');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Dynamic Firestore Collections States
  const [notices, setNotices] = useState<Notice[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<Statistic[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);

  // Dynamic items confirmation deletes
  const [deletingNoticeId, setDeletingNoticeId] = useState<string | null>(null);
  const [deletingAdmissionId, setDeletingAdmissionId] = useState<string | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [deletingDeptId, setDeletingDeptId] = useState<string | null>(null);
  const [deletingFacultyId, setDeletingFacultyId] = useState<string | null>(null);

  // Load all DB dynamic tables
  const loadDynamicData = async () => {
    setLoadingDb(true);
    try {
      const [fetchedNotices, fetchedAdmissions, fetchedMessages, fetchedStats, fetchedCourses, fetchedDepts, fetchedFaculty] = await Promise.all([
        noticesService.getAll(),
        admissionsService.getAll(),
        contactMessagesService.getAll(),
        statisticsService.getAll(),
        coursesService.getAll(),
        departmentsService.getAll(),
        facultyService.getAll()
      ]);
      setNotices(fetchedNotices);
      setAdmissions(fetchedAdmissions);
      setContactMessages(fetchedMessages);
      setStats(fetchedStats);
      setCourses(fetchedCourses);
      setDepartments(fetchedDepts);
      setFaculty(fetchedFaculty);
    } catch (err) {
      console.error('Failed to load database collections:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    // Only load if active tab is one of our custom DB tabs
    if (['notices', 'admissions', 'contact_messages', 'college_assets'].includes(activeSubTab)) {
      loadDynamicData();
    }
  }, [activeSubTab]);

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'Academic' | 'Administrative' | 'General' | 'Event'>('Academic');
  const [noticeIsUrgent, setNoticeIsUrgent] = useState(false);

  // Statistic edit state
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [editStatValue, setEditStatValue] = useState('');

  // Course Form State
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseName, setCourseName] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseIntake, setCourseIntake] = useState(150);
  const [courseEligibility, setCourseEligibility] = useState('');
  const [courseFee, setCourseFee] = useState('');
  const [courseCategory, setCourseCategory] = useState<'UG' | 'PG' | 'Diploma'>('UG');
  const [courseDescription, setCourseDescription] = useState('');

  // Department Form State
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [deptName, setDeptName] = useState('');
  const [deptHOD, setDeptHOD] = useState('');
  const [deptEstablished, setDeptEstablished] = useState('');
  const [deptEmail, setDeptEmail] = useState('');
  const [deptPhone, setDeptPhone] = useState('');
  const [deptLocation, setDeptLocation] = useState('');
  const [deptDescription, setDeptDescription] = useState('');

  // Faculty Form State
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);
  const [facName, setFacName] = useState('');
  const [facDesignation, setFacDesignation] = useState('');
  const [facDepartment, setFacDepartment] = useState('');
  const [facQualification, setFacQualification] = useState('');
  const [facEmail, setFacEmail] = useState('');
  const [facExperience, setFacExperience] = useState('');
  const [facStatus, setFacStatus] = useState<'Active' | 'On Leave'>('Active');

  // Reset deleting state after a few seconds
  useEffect(() => {
    if (deletingId !== null) {
      const timer = setTimeout(() => {
        setDeletingId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deletingId]);

  // Form states for adding custom subject
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjCategory, setNewSubjCategory] = useState<'Theory' | 'Practical' | 'Clinical'>('Theory');
  const [newSubjTotal, setNewSubjTotal] = useState(10);
  const [newSubjAttended, setNewSubjAttended] = useState(8);

  // Form states for adding custom exam performance
  const [newExamName, setNewExamName] = useState('');
  const [newExamSecured, setNewExamSecured] = useState(80);
  const [newExamTotal, setNewExamTotal] = useState(100);

  // Form states for editing custom exam performance
  const [editingExamIdx, setEditingExamIdx] = useState<number | null>(null);
  const [editExamName, setEditExamName] = useState('');
  const [editExamSecured, setEditExamSecured] = useState(0);
  const [editExamTotal, setEditExamTotal] = useState(100);

  const triggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Profile change handlers
  const handleProfileFieldChange = (field: keyof StudentProfile, value: string) => {
    setStudent({
      ...student,
      [field]: value
    });
    triggerAlert('Student profile updated in memory.');
  };

  // Attendance handlers
  const handleAttendanceChange = (index: number, field: 'totalClass' | 'classAttended', value: number) => {
    const updated = [...attendanceItems];
    const item = { ...updated[index] };
    
    if (field === 'totalClass') {
      item.totalClass = Math.max(1, value);
    } else {
      item.classAttended = Math.max(0, Math.min(updated[index].totalClass, value));
    }
    
    item.actualPercentage = item.totalClass > 0 ? Math.round((item.classAttended / item.totalClass) * 100) : 0;
    updated[index] = item;
    setAttendanceItems(updated);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjName.trim()) return;
    
    const newItem: AttendanceItem = {
      subjectName: newSubjName.trim(),
      totalClass: Math.max(1, newSubjTotal),
      classAttended: Math.max(0, Math.min(newSubjTotal, newSubjAttended)),
      actualPercentage: newSubjTotal > 0 ? Math.round((newSubjAttended / newSubjTotal) * 100) : 0,
      minReqPercentage: newSubjCategory === 'Theory' ? 75 : 80,
      categoryName: newSubjCategory
    };

    setAttendanceItems([...attendanceItems, newItem]);
    setNewSubjName('');
    triggerAlert(`Added new subject: ${newItem.subjectName}`);
  };

  const handleDeleteSubject = (index: number) => {
    const updated = attendanceItems.filter((_, i) => i !== index);
    setAttendanceItems(updated);
    triggerAlert('Subject removed from list.');
  };

  // Exam handlers
  const handleExamChange = (index: number, field: 'secured' | 'total', value: number) => {
    const updated = [...examPerformances];
    const item = { ...updated[index] };
    
    // Parse current fraction
    const parts = item.totalMarks.split('/');
    let secured = parseInt(parts[0], 10) || 0;
    let total = parseInt(parts[1], 10) || 100;

    if (field === 'secured') {
      secured = Math.max(0, value);
    } else {
      total = Math.max(1, value);
    }

    if (secured > total) secured = total;

    item.totalMarks = `${secured}/${total}`;
    item.percentage = total > 0 ? Math.round((secured / total) * 10000) / 100 : 0;
    
    updated[index] = item;
    setExamPerformances(updated);
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamName.trim()) return;

    const secured = Math.max(0, newExamSecured);
    const total = Math.max(1, newExamTotal);
    const finalSecured = Math.min(secured, total);

    const newItem: ExamPerformance = {
      examName: newExamName.trim(),
      totalMarks: `${finalSecured}/${total}`,
      percentage: Math.round((finalSecured / total) * 10000) / 100
    };

    setExamPerformances([...examPerformances, newItem]);
    setNewExamName('');
    triggerAlert(`Added assessment: ${newItem.examName}`);
  };

  const handleDeleteExam = (index: number) => {
    const updated = examPerformances.filter((_, i) => i !== index);
    setExamPerformances(updated);
    triggerAlert('Assessment deleted.');
  };

  const handleStartEditExam = (index: number) => {
    const item = examPerformances[index];
    const parts = item.totalMarks.split('/');
    const secured = parseInt(parts[0], 10) || 0;
    const total = parseInt(parts[1], 10) || 100;
    
    setEditingExamIdx(index);
    setEditExamName(item.examName);
    setEditExamSecured(secured);
    setEditExamTotal(total);
  };

  const handleSaveEditExam = (index: number) => {
    if (!editExamName.trim()) return;

    const secured = Math.max(0, editExamSecured);
    const total = Math.max(1, editExamTotal);
    const finalSecured = Math.min(secured, total);

    const updated = [...examPerformances];
    updated[index] = {
      examName: editExamName.trim(),
      totalMarks: `${finalSecured}/${total}`,
      percentage: Math.round((finalSecured / total) * 10000) / 100
    };

    setExamPerformances(updated);
    setEditingExamIdx(null);
    triggerAlert(`Updated assessment: ${updated[index].examName}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Notice Banner */}
      <div className="bg-gradient-to-r from-red-800 to-[#004a99] text-white p-4 rounded-lg shadow border-l-4 border-yellow-400 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-400 text-slate-900 rounded-full animate-bounce">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold uppercase text-xs sm:text-sm tracking-wider flex items-center gap-1.5">
              Campus Medicine Administrator Sandbox Active
            </h3>
            <p className="text-[11px] opacity-90 mt-0.5">
              You are logged in as <span className="font-bold underline text-yellow-300">Admin</span>. Any edits you make here will instantly override the active database for student <strong>{student.name}</strong>.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            onResetToDefaults();
            triggerAlert('Restored student database to official template defaults.');
          }}
          className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-[10px] uppercase rounded tracking-wider flex items-center gap-1 transition shadow cursor-pointer shrink-0"
        >
          <Undo className="w-3 h-3" /> Reset Database to Default
        </button>
      </div>

      {/* Real-time Toast Alert */}
      {alertMessage && (
        <div className="fixed top-24 right-6 bg-slate-900 text-green-400 border border-green-500/30 px-4 py-3 rounded-md shadow-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 z-50 animate-fadeIn">
          <Check className="w-4 h-4 bg-green-500 text-slate-900 rounded-full p-0.5" />
          {alertMessage}
        </div>
      )}

      {/* Sub Tabs Navigation */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="border-b bg-slate-50 flex flex-wrap text-xs font-bold uppercase tracking-wide">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-5 py-3 border-r transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'profile' ? 'bg-white border-t-2 border-[#004a99] text-[#004a99]' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" /> Student Profile
          </button>
          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`px-5 py-3 border-r transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'attendance' ? 'bg-white border-t-2 border-[#004a99] text-[#004a99]' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Attendance Sheet
          </button>
          <button
            onClick={() => setActiveSubTab('exams')}
            className={`px-5 py-3 border-r transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'exams' ? 'bg-white border-t-2 border-[#004a99] text-[#004a99]' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" /> Exam Grades
          </button>
          <button
            onClick={() => setActiveSubTab('financials')}
            className={`px-5 py-3 border-r transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'financials' ? 'bg-white border-t-2 border-[#004a99] text-[#004a99]' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Pending Dues
          </button>
          <button
            onClick={() => setActiveSubTab('gatepass')}
            className={`px-5 py-3 border-r transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'gatepass' ? 'bg-white border-t-2 border-[#004a99] text-[#004a99]' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Send className="w-4 h-4 text-emerald-600" /> Gatepass Requests
          </button>
          <button
            onClick={() => setActiveSubTab('notices')}
            className={`px-5 py-3 border-r transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'notices' ? 'bg-white border-t-2 border-[#a03030] text-[#a03030]' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4 text-red-600 animate-pulse" /> notices board
          </button>
          <button
            onClick={() => setActiveSubTab('admissions')}
            className={`px-5 py-3 border-r transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'admissions' ? 'bg-white border-t-2 border-amber-600 text-amber-700' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Inbox className="w-4 h-4 text-amber-600" /> admissions desk
          </button>
          <button
            onClick={() => setActiveSubTab('contact_messages')}
            className={`px-5 py-3 border-r transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'contact_messages' ? 'bg-white border-t-2 border-indigo-600 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-4 h-4 text-indigo-600" /> Contact Support Inbox
          </button>
          <button
            onClick={() => setActiveSubTab('college_assets')}
            className={`px-5 py-3 transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'college_assets' ? 'bg-white border-t-2 border-purple-600 text-purple-700' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4 text-purple-600" /> College Assets
          </button>
        </div>

        {/* Tab 1: Profile Editor */}
        {activeSubTab === 'profile' && (
          <div className="p-6 space-y-6">
            <div className="border-b pb-3">
              <h4 className="font-extrabold text-slate-800 text-sm uppercase">Manage General Profile Info & Photo</h4>
              <p className="text-xs text-slate-500 mt-0.5">Edit credentials, upload/change student profile photo, personal contacts, and details</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Profile Photo Uploader Card */}
              <div className="flex flex-col items-center p-5 bg-slate-50 border border-slate-200 rounded-lg text-center w-full lg:w-64 shrink-0 space-y-4">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Student Profile Photo</span>
                
                <div className="relative w-32 h-32 bg-[#1a1a1a] border border-slate-300 rounded-lg shadow-inner overflow-hidden flex flex-col items-center justify-center group">
                  {student.photoUrl ? (
                    <>
                      <img 
                        src={student.photoUrl} 
                        alt="Student Profile" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold uppercase bg-slate-900/80 px-2 py-1 rounded">Active Photo</span>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 text-center text-white flex flex-col items-center justify-center">
                      <User className="w-8 h-8 text-slate-400 mb-1" />
                      <span className="text-[9px] font-bold italic uppercase leading-tight tracking-wide">
                        No Photo<br />Available
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    id="admin-profile-photo-file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleProfileFieldChange('photoUrl', reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="admin-profile-photo-file"
                    className="w-full px-3 py-2 bg-[#004a99] hover:bg-blue-800 text-white font-extrabold text-[10px] uppercase rounded tracking-wider text-center cursor-pointer transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Choose from Device
                  </label>
                  
                  {student.photoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to remove the student profile photo?')) {
                          handleProfileFieldChange('photoUrl', '');
                        }
                      }}
                      className="w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase rounded tracking-wider cursor-pointer transition shadow-xs flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Photo
                    </button>
                  )}
                </div>

                <p className="text-[9px] text-slate-400 leading-normal max-w-[180px] mx-auto">
                  Upload high-quality image from your local device. Standard square dimension works best.
                </p>
              </div>

              {/* Profile Details Inputs */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Student Full Name</label>
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Roll Number</label>
                    <input
                      type="text"
                      value={student.rollNo}
                      onChange={(e) => handleProfileFieldChange('rollNo', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Date of Birth</label>
                    <input
                      type="text"
                      value={student.dob}
                      onChange={(e) => handleProfileFieldChange('dob', e.target.value)}
                      placeholder="e.g. 14/05/2004"
                      className="w-full p-2 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Course Title</label>
                    <input
                      type="text"
                      value={student.course}
                      onChange={(e) => handleProfileFieldChange('course', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Enrolled Batch Year</label>
                    <input
                      type="text"
                      value={student.batch}
                      onChange={(e) => handleProfileFieldChange('batch', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Academic Session Year</label>
                    <input
                      type="text"
                      value={student.academicYear}
                      onChange={(e) => handleProfileFieldChange('academicYear', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Student Mobile No.</label>
                    <input
                      type="text"
                      value={student.studentMobile}
                      onChange={(e) => handleProfileFieldChange('studentMobile', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Student Email ID</label>
                    <input
                      type="email"
                      value={student.studentEmail}
                      onChange={(e) => handleProfileFieldChange('studentEmail', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Current Year / Term</label>
                    <input
                      type="text"
                      value={student.yearTerm}
                      onChange={(e) => handleProfileFieldChange('yearTerm', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Father's Full Name</label>
                    <input
                      type="text"
                      value={student.fatherName}
                      onChange={(e) => handleProfileFieldChange('fatherName', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Father's Mobile No.</label>
                    <input
                      type="text"
                      value={student.fatherMobile}
                      onChange={(e) => handleProfileFieldChange('fatherMobile', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Father's Email ID</label>
                    <input
                      type="email"
                      value={student.fatherEmail}
                      onChange={(e) => handleProfileFieldChange('fatherEmail', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3 space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Address of Correspondence</label>
                    <textarea
                      value={student.address}
                      onChange={(e) => handleProfileFieldChange('address', e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border p-3 rounded text-[11px] text-[#004a99] font-medium leading-relaxed">
              <strong>Info:</strong> These changes persist instantly into the simulated storage. If the student logs into their panel, they will see these updated details displayed on their homepage.
            </div>
          </div>
        )}

        {/* Tab 2: Attendance Sheet Editor */}
        {activeSubTab === 'attendance' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 gap-2">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm uppercase">Subject Attendance Statistics</h4>
                <p className="text-xs text-slate-500 mt-0.5">Modify total lectures, attended counters, or inject new subjects</p>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto max-h-96 border rounded">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b">
                    <th className="px-3 py-2.5">Subject name</th>
                    <th className="px-3 py-2.5 text-center">Category</th>
                    <th className="px-3 py-2.5 text-center w-28">Attended Classes</th>
                    <th className="px-3 py-2.5 text-center w-28">Total Classes</th>
                    <th className="px-3 py-2.5 text-center">Percentage</th>
                    <th className="px-3 py-2.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  {attendanceItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2 font-bold text-slate-800">{item.subjectName}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                          item.categoryName === 'Theory' ? 'bg-blue-100 text-blue-800' :
                          item.categoryName === 'Practical' ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800'
                        }`}>
                          {item.categoryName}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAttendanceChange(idx, 'classAttended', item.classAttended - 1)}
                            className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded font-bold text-center text-xs flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.classAttended}
                            onChange={(e) => handleAttendanceChange(idx, 'classAttended', parseInt(e.target.value, 10) || 0)}
                            className="w-12 text-center p-1 border rounded text-xs font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => handleAttendanceChange(idx, 'classAttended', item.classAttended + 1)}
                            className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded font-bold text-center text-xs flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAttendanceChange(idx, 'totalClass', item.totalClass - 1)}
                            className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded font-bold text-center text-xs flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.totalClass}
                            onChange={(e) => handleAttendanceChange(idx, 'totalClass', parseInt(e.target.value, 10) || 1)}
                            className="w-12 text-center p-1 border rounded text-xs font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => handleAttendanceChange(idx, 'totalClass', item.totalClass + 1)}
                            className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded font-bold text-center text-xs flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`font-bold text-sm ${item.actualPercentage >= item.minReqPercentage ? 'text-green-600' : 'text-red-600'}`}>
                          {item.actualPercentage}%
                        </span>
                        <span className="block text-[8px] text-slate-400 font-medium">Min: {item.minReqPercentage}%</span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition cursor-pointer"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Subject Section */}
            <form onSubmit={handleAddSubject} className="bg-slate-50 border p-4 rounded-lg space-y-4">
              <h5 className="font-extrabold text-[11px] text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <Plus className="w-4 h-4 text-[#004a99]" /> Add New Subject Course Record
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Subject Name</label>
                  <input
                    type="text"
                    required
                    value={newSubjName}
                    onChange={(e) => setNewSubjName(e.target.value)}
                    placeholder="e.g. Pathology Theory"
                    className="w-full p-2 border border-slate-300 rounded bg-white font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Category Head</label>
                  <select
                    value={newSubjCategory}
                    onChange={(e) => setNewSubjCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded bg-white font-bold text-slate-800"
                  >
                    <option value="Theory">Theory (75% min)</option>
                    <option value="Practical">Practical (80% min)</option>
                    <option value="Clinical">Clinical (80% min)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Attended Classes</label>
                  <input
                    type="number"
                    value={newSubjAttended}
                    onChange={(e) => setNewSubjAttended(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2 border border-slate-300 rounded bg-white font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Total Classes</label>
                  <input
                    type="number"
                    value={newSubjTotal}
                    onChange={(e) => setNewSubjTotal(parseInt(e.target.value, 10) || 1)}
                    className="w-full p-2 border border-slate-300 rounded bg-white font-bold text-slate-800"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004a99] hover:bg-blue-800 text-white font-extrabold text-[10px] uppercase rounded tracking-wider flex items-center gap-1 transition shadow cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Insert Course Record
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Exam Editor */}
        {activeSubTab === 'exams' && (
          <div className="p-6 space-y-6">
            <div className="border-b pb-3">
              <h4 className="font-extrabold text-slate-800 text-sm uppercase">Exam Performance Assessments</h4>
              <p className="text-xs text-slate-500 mt-0.5">Edit secured and total marks for terminal evaluations</p>
            </div>

            <div className="space-y-3">
              {examPerformances.map((item, idx) => {
                const parts = item.totalMarks.split('/');
                const secured = parseInt(parts[0], 10) || 0;
                const total = parseInt(parts[1], 10) || 100;
                const isEditing = editingExamIdx === idx;

                if (isEditing) {
                  return (
                    <div key={idx} className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-semibold">
                      <div className="space-y-1 flex-1 w-full md:w-auto">
                        <label className="block text-[10px] text-blue-500 font-bold uppercase tracking-wider">Edit Assessment Name</label>
                        <input
                          type="text"
                          value={editExamName}
                          onChange={(e) => setEditExamName(e.target.value)}
                          className="w-full p-1.5 border border-blue-300 rounded font-bold bg-white text-slate-800 text-xs"
                          placeholder="Exam Name"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] text-blue-500 font-bold uppercase">Secured</label>
                          <input
                            type="number"
                            value={editExamSecured}
                            onChange={(e) => setEditExamSecured(parseInt(e.target.value, 10) || 0)}
                            className="w-16 p-1.5 border border-blue-300 rounded font-bold text-center bg-white text-xs"
                          />
                        </div>
                        <div className="text-blue-400 self-end mb-1 text-sm">/</div>
                        <div className="space-y-1">
                          <label className="block text-[10px] text-blue-500 font-bold uppercase">Total</label>
                          <input
                            type="number"
                            value={editExamTotal}
                            onChange={(e) => setEditExamTotal(parseInt(e.target.value, 10) || 1)}
                            className="w-16 p-1.5 border border-blue-300 rounded font-bold text-center bg-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-center md:text-right">
                        <span className="text-[10px] text-blue-500 font-bold uppercase block">New Percentage</span>
                        <span className="text-sm font-extrabold text-blue-700">
                          {editExamTotal > 0 ? ((Math.min(editExamSecured, editExamTotal) / editExamTotal) * 100).toFixed(2) : '0.00'}%
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => handleSaveEditExam(idx)}
                          className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-[10px] uppercase transition cursor-pointer flex items-center gap-1 shadow-xs"
                          title="Save Changes"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingExamIdx(null)}
                          className="px-2.5 py-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded font-bold text-[10px] uppercase transition cursor-pointer flex items-center gap-1 shadow-xs"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-semibold">
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assessment Name</span>
                      <span className="text-sm font-extrabold text-slate-800">{item.examName}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="space-y-1">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Secured Marks</span>
                        <div className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded text-center min-w-[3.5rem]">
                          {secured}
                        </div>
                      </div>
                      <div className="text-slate-400 self-end mb-1 text-sm">/</div>
                      <div className="space-y-1">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Total Marks</span>
                        <div className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded text-center min-w-[3.5rem]">
                          {total}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-center md:text-right min-w-[7.5rem]">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Secured Percentage</span>
                      <span className="text-sm font-extrabold text-[#004a99]">{item.percentage.toFixed(2)}%</span>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() => handleStartEditExam(idx)}
                        className="p-2 text-[#004a99] hover:bg-blue-50 hover:text-blue-800 rounded transition cursor-pointer flex items-center gap-1"
                        title="Edit Assessment"
                      >
                        <Edit2 className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExam(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded transition cursor-pointer flex items-center gap-1"
                        title="Delete Assessment"
                      >
                        <Trash2 className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase">Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Exam form */}
            <form onSubmit={handleAddExam} className="bg-slate-50 border p-4 rounded-lg space-y-4">
              <h5 className="font-extrabold text-[11px] text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <Plus className="w-4 h-4 text-[#004a99]" /> Add Assessment Record
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Assessment Title</label>
                  <input
                    type="text"
                    required
                    value={newExamName}
                    onChange={(e) => setNewExamName(e.target.value)}
                    placeholder="e.g. 2nd Internal Assessment"
                    className="w-full p-2 border border-slate-300 rounded bg-white font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Secured Marks</label>
                  <input
                    type="number"
                    value={newExamSecured}
                    onChange={(e) => setNewExamSecured(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2 border border-slate-300 rounded bg-white font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Maximum Marks</label>
                  <input
                    type="number"
                    value={newExamTotal}
                    onChange={(e) => setNewExamTotal(parseInt(e.target.value, 10) || 100)}
                    className="w-full p-2 border border-slate-300 rounded bg-white font-bold text-slate-800"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004a99] hover:bg-blue-800 text-white font-extrabold text-[10px] uppercase rounded tracking-wider flex items-center gap-1 transition shadow cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Insert Exam Record
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Financial Dues Editor */}
        {activeSubTab === 'financials' && (
          <div className="p-6 space-y-6">
            <div className="border-b pb-3">
              <h4 className="font-extrabold text-slate-800 text-sm uppercase">Manage Outstanding Fees &amp; Balances</h4>
              <p className="text-xs text-slate-500 mt-0.5">Manually adjust or trigger the outstanding fees due</p>
            </div>

            <div className="max-w-md space-y-4">
              <div className="bg-slate-50 border p-4 rounded-lg space-y-3">
                <label className="block text-xs font-extrabold text-slate-700 uppercase">
                  Pending Balance (Books &amp; Laboratories Dues)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-bold text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    value={pendingFeeBalance}
                    onChange={(e) => setPendingFeeBalance(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded font-mono font-extrabold text-lg text-red-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase leading-tight">
                  Set this to ₹ 0 to simulate fully cleared status.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPendingFeeBalance(0);
                    triggerAlert('Pending Balance set to zero.');
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-extrabold text-[10px] uppercase rounded tracking-wider transition cursor-pointer"
                >
                  Set as Cleared (₹ 0)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPendingFeeBalance(45000);
                    triggerAlert('Pending Balance set to ₹ 45,000.');
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] uppercase rounded tracking-wider transition cursor-pointer"
                >
                  Set Large Due (₹ 45,000)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Gatepass Requests */}
        {activeSubTab === 'gatepass' && (
          <div className="p-6 space-y-6">
            <div className="border-b pb-3 flex justify-between items-center flex-wrap gap-3">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm uppercase">Manage Gatepass Requests &amp; Leave Logs</h4>
                <p className="text-xs text-slate-500 mt-0.5">Approve, reject, or delete individual gatepass requests submitted by students</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">All Gatepass Requests ({gatepasses.length})</span>
                <span className="text-[10px] font-semibold text-slate-400">Total history records loaded from system</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                      <th className="px-4 py-3 border border-slate-200">Date Sent</th>
                      <th className="px-4 py-3 border border-slate-200">Reason</th>
                      <th className="px-4 py-3 border border-slate-200">Out / In Timings</th>
                      <th className="px-4 py-3 border border-slate-200 text-center">Status</th>
                      <th className="px-4 py-3 border border-slate-200 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {gatepasses.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-slate-400 font-medium">
                          No gatepass requests found in the system.
                        </td>
                      </tr>
                    )}
                    {gatepasses.map((pass) => (
                      <tr key={pass.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-semibold text-slate-500 font-mono">{pass.timestamp}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{pass.reason}</td>
                        <td className="px-4 py-3 text-slate-600 font-medium text-[10px] space-y-0.5">
                          <div className="text-red-600 font-semibold">OUT: {new Date(pass.outDate).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</div>
                          <div className="text-green-600 font-semibold">IN: {new Date(pass.inDate).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-1 font-bold text-[10px] rounded uppercase ${
                            pass.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            pass.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {pass.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* Warden actions for pending */}
                            {pass.status === 'Pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setGatepasses(prev => prev.map(item => item.id === pass.id ? { ...item, status: 'Approved' as const } : item));
                                    triggerAlert('Gatepass approved successfully.');
                                  }}
                                  className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white font-extrabold text-[9px] rounded uppercase tracking-wider cursor-pointer transition shadow-xs"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setGatepasses(prev => prev.map(item => item.id === pass.id ? { ...item, status: 'Rejected' as const } : item));
                                    triggerAlert('Gatepass rejected successfully.');
                                  }}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[9px] rounded uppercase tracking-wider cursor-pointer transition shadow-xs"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {/* Bulletproof Click to Confirm Delete Button */}
                            {deletingId === pass.id ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setGatepasses(prev => prev.filter(p => p.id !== pass.id));
                                  setDeletingId(null);
                                  triggerAlert('Gatepass history record deleted successfully.');
                                }}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] rounded uppercase tracking-wider animate-pulse cursor-pointer flex items-center gap-1 shadow"
                              >
                                <Trash2 className="w-3 h-3" /> Confirm?
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeletingId(pass.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                                title="Delete from History"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Dynamic notices Management */}
        {activeSubTab === 'notices' && (
          <div className="p-6 space-y-6">
            <div className="border-b pb-3">
              <h4 className="font-extrabold text-slate-800 text-sm uppercase">Notices Board &amp; Urgent Announcements Desk</h4>
              <p className="text-xs text-slate-500 mt-0.5">Publish dynamic news feed alerts or notices displayed on student landing pages</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Add Notice Form */}
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!noticeTitle.trim() || !noticeContent.trim()) return;
                try {
                  await noticesService.add({
                    title: noticeTitle.trim(),
                    content: noticeContent.trim(),
                    category: noticeCategory,
                    isUrgent: noticeIsUrgent,
                    date: new Date().toISOString().split('T')[0]
                  });
                  triggerAlert('Announcement posted successfully!');
                  setNoticeTitle('');
                  setNoticeContent('');
                  setNoticeIsUrgent(false);
                  loadDynamicData();
                } catch (err) {
                  console.error(err);
                }
              }} className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Publish New Announcement</span>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Terminal exam timetable release"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-slate-300 bg-white rounded font-medium focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Administrative">Administrative</option>
                    <option value="General">General</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Content description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide full description..."
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-medium focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={noticeIsUrgent}
                    onChange={(e) => setNoticeIsUrgent(e.target.checked)}
                    className="cursor-pointer"
                  />
                  <label htmlFor="isUrgent" className="font-semibold text-slate-600 cursor-pointer select-none">
                    Flag as critical alert (Urgent status)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-red-700 hover:bg-red-800 text-white font-bold uppercase tracking-wider rounded cursor-pointer transition"
                >
                  Publish Announcement
                </button>
              </form>

              {/* Notice List */}
              <div className="lg:col-span-8 bg-white border rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Live Feed ({notices.length} items)</span>
                  <button 
                    onClick={loadDynamicData}
                    className="text-xs text-[#004a99] font-bold flex items-center gap-1 hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>

                {loadingDb ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-semibold animate-pulse">
                    Querying active Firestore notices...
                  </div>
                ) : notices.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-medium">
                    No custom announcements exist in your Firestore collection yet.
                  </div>
                ) : (
                  <div className="divide-y text-xs">
                    {notices.map((notice) => (
                      <div key={notice.id} className="p-4 flex justify-between items-start gap-4 hover:bg-slate-50 transition">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-blue-100 text-[#004a99] font-extrabold text-[9px] uppercase rounded">
                              {notice.category}
                            </span>
                            {notice.isUrgent && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 font-extrabold text-[9px] uppercase rounded animate-pulse">
                                Urgent
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-semibold">{notice.date}</span>
                          </div>
                          <h5 className="font-extrabold text-slate-800 text-xs leading-snug">{notice.title}</h5>
                          <p className="text-[11px] text-slate-500 leading-normal">{notice.content}</p>
                        </div>

                        {deletingNoticeId === notice.id ? (
                          <button
                            onClick={async () => {
                              try {
                                if (notice.id) {
                                  await noticesService.delete(notice.id);
                                  triggerAlert('Announcement deleted from collection.');
                                  setDeletingNoticeId(null);
                                  loadDynamicData();
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[9px] rounded uppercase tracking-wider animate-pulse cursor-pointer flex items-center gap-1 shadow shrink-0"
                          >
                            Confirm?
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => notice.id && setDeletingNoticeId(notice.id)}
                            className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded transition shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Dynamic Admissions Desk */}
        {activeSubTab === 'admissions' && (
          <div className="p-6 space-y-6">
            <div className="border-b pb-3">
              <h4 className="font-extrabold text-slate-800 text-sm uppercase">Admissions Registry &amp; Student Inquiries Desk</h4>
              <p className="text-xs text-slate-500 mt-0.5">Manage parent and applicant counseling records submitted via the admission portal</p>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Submitted Registrations ({admissions.length} applications)</span>
                <button 
                  onClick={loadDynamicData}
                  className="text-xs text-[#004a99] font-bold flex items-center gap-1 hover:underline"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh Lists
                </button>
              </div>

              {loadingDb ? (
                <div className="py-12 text-center text-slate-400 text-xs font-semibold animate-pulse">
                  Loading registration logs...
                </div>
              ) : admissions.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">
                  No applicant inquiries logged in system.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b">
                        <th className="px-4 py-3 border-r">Applicant Profile</th>
                        <th className="px-4 py-3 border-r">Chosen Program</th>
                        <th className="px-4 py-3 border-r">Message Details</th>
                        <th className="px-4 py-3 border-r text-center">Inquiry Status</th>
                        <th className="px-4 py-3 text-center">Process Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {admissions.map((adm) => (
                        <tr key={adm.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3 border-r font-medium">
                            <div className="font-bold text-slate-800 text-xs">{adm.studentName}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">📧 {adm.email}</div>
                            <div className="text-[10px] text-slate-400">📞 {adm.phone}</div>
                          </td>
                          <td className="px-4 py-3 border-r font-semibold text-blue-900 text-[11px]">
                            {adm.course}
                          </td>
                          <td className="px-4 py-3 border-r text-slate-600 max-w-xs leading-normal">
                            <div className="text-[10px] text-slate-400 font-mono mb-1">Received: {adm.submittedAt ? new Date(adm.submittedAt).toLocaleString() : 'N/A'}</div>
                            {adm.message || <span className="italic text-slate-300">No cover statement added</span>}
                          </td>
                          <td className="px-4 py-3 border-r text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                              adm.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              adm.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>{adm.status}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <select
                                value={adm.status}
                                onChange={async (e) => {
                                  try {
                                    if (adm.id) {
                                      await admissionsService.update(adm.id, { status: e.target.value as any });
                                      triggerAlert(`Updated application for ${adm.studentName}`);
                                      loadDynamicData();
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="px-1.5 py-1 border border-slate-300 rounded font-bold uppercase text-[9px] tracking-wide focus:outline-none"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                              </select>

                              {deletingAdmissionId === adm.id ? (
                                <button
                                  onClick={async () => {
                                    try {
                                      if (adm.id) {
                                        await admissionsService.delete(adm.id);
                                        triggerAlert('Admission record deleted.');
                                        setDeletingAdmissionId(null);
                                        loadDynamicData();
                                      }
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                  className="px-2 py-1 bg-red-600 text-white font-black text-[9px] uppercase tracking-wide rounded animate-pulse"
                                >
                                  OK?
                                </button>
                              ) : (
                                <button
                                  onClick={() => adm.id && setDeletingAdmissionId(adm.id)}
                                  className="p-1 text-slate-300 hover:text-red-600 rounded transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 8: Dynamic Contact Messages Support Mailbox */}
        {activeSubTab === 'contact_messages' && (
          <div className="p-6 space-y-6">
            <div className="border-b pb-3">
              <h4 className="font-extrabold text-slate-800 text-sm uppercase">Contact Support Mailbox &amp; Inquiries</h4>
              <p className="text-xs text-slate-500 mt-0.5">Read, delete, or flag helpdesk message submissions recorded from the support forms</p>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Support Mailbox ({contactMessages.length} inquiries)</span>
                <button 
                  onClick={loadDynamicData}
                  className="text-xs text-[#004a99] font-bold flex items-center gap-1 hover:underline"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh Inbox
                </button>
              </div>

              {loadingDb ? (
                <div className="py-12 text-center text-slate-400 text-xs font-semibold animate-pulse">
                  Connecting to support database...
                </div>
              ) : contactMessages.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">
                  Support inbox is empty. All queries addressed!
                </div>
              ) : (
                <div className="divide-y">
                  {contactMessages.map((msg) => (
                    <div key={msg.id} className="p-4 hover:bg-slate-50/50 transition text-xs flex justify-between items-start gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-800">{msg.name}</span>
                          <span className="text-slate-400 font-medium">({msg.email})</span>
                          <span className="text-[10px] text-slate-400 font-mono">{msg.submittedAt ? new Date(msg.submittedAt).toLocaleString() : 'N/A'}</span>
                          <span className={`px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded tracking-wider ${
                            msg.status === 'Unread' ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-slate-100 text-slate-500'
                          }`}>{msg.status || 'Unread'}</span>
                        </div>
                        <div className="font-extrabold text-indigo-900">{msg.subject}</div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium bg-slate-50 p-2.5 rounded border border-slate-100">{msg.message}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {msg.status === 'Unread' ? (
                          <button
                            onClick={async () => {
                              try {
                                if (msg.id) {
                                  await contactMessagesService.update(msg.id, { status: 'Read' });
                                  triggerAlert('Message marked as read.');
                                  loadDynamicData();
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="px-2 py-1 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition font-extrabold text-[9px] uppercase tracking-wide rounded cursor-pointer"
                          >
                            Mark Read
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              try {
                                if (msg.id) {
                                  await contactMessagesService.update(msg.id, { status: 'Unread' });
                                  triggerAlert('Message marked as unread.');
                                  loadDynamicData();
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 transition font-extrabold text-[9px] uppercase tracking-wide rounded cursor-pointer"
                          >
                            Mark Unread
                          </button>
                        )}

                        {deletingMessageId === msg.id ? (
                          <button
                            onClick={async () => {
                              try {
                                if (msg.id) {
                                  await contactMessagesService.delete(msg.id);
                                  triggerAlert('Support message deleted.');
                                  setDeletingMessageId(null);
                                  loadDynamicData();
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[9px] rounded uppercase tracking-wider animate-pulse cursor-pointer flex items-center gap-1 shadow"
                          >
                            Confirm?
                          </button>
                        ) : (
                          <button
                            onClick={() => msg.id && setDeletingMessageId(msg.id)}
                            className="p-1 text-slate-300 hover:text-red-600 rounded transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 9: College Assets (Statistics, Courses, Departments, Faculty CRUD) */}
        {activeSubTab === 'college_assets' && (
          <div className="p-6 space-y-8">
            <div className="border-b pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm uppercase">College Administrative Databases &amp; Assets</h4>
                <p className="text-xs text-slate-500 mt-0.5">Control dynamic lists of key stats, available degree programs, departments, and active faculty</p>
              </div>
              <button 
                onClick={loadDynamicData}
                className="px-3 py-1 bg-[#004a99] text-white text-xs font-bold uppercase rounded flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sync Databases
              </button>
            </div>

            {/* 1. Statistics Cards Value Updates */}
            <div className="space-y-4">
              <span className="text-[11px] font-black text-indigo-900 uppercase tracking-widest block border-b pb-1">1. College Key Figures (Dynamic Statistics)</span>
              {loadingDb ? (
                <div className="py-4 text-center text-slate-400 text-xs animate-pulse">Loading stats...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  {stats.map((stat) => (
                    <div key={stat.id || stat.name} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                      <div className="font-bold text-slate-700">{stat.name}</div>
                      
                      {editingStatId === stat.id ? (
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={editStatValue}
                            onChange={(e) => setEditStatValue(e.target.value)}
                            placeholder="e.g. 150+"
                            className="px-2 py-1 border border-slate-300 rounded font-bold w-full text-xs focus:outline-none bg-white"
                          />
                          <button
                            onClick={async () => {
                              try {
                                if (stat.id && editStatValue.trim()) {
                                  await statisticsService.update(stat.id, { value: editStatValue.trim(), updatedAt: new Date().toISOString() });
                                  triggerAlert(`Updated statistic: ${stat.name}`);
                                  setEditingStatId(null);
                                  setEditStatValue('');
                                  loadDynamicData();
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingStatId(null);
                              setEditStatValue('');
                            }}
                            className="p-1.5 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded">
                          <span className="text-sm font-extrabold text-[#004a99]">{stat.value}</span>
                          <button
                            onClick={() => {
                              if (stat.id) {
                                setEditingStatId(stat.id);
                                setEditStatValue(stat.value);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Degree Courses CRUD */}
            <div className="space-y-4 pt-4 border-t">
              <span className="text-[11px] font-black text-indigo-900 uppercase tracking-widest block border-b pb-1">2. College Academic Offerings (Courses Database)</span>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Course Form */}
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!courseName.trim() || !courseFee.trim()) return;
                  try {
                    const payload = {
                      name: courseName.trim(),
                      duration: courseDuration.trim(),
                      intake: Number(courseIntake),
                      eligibility: courseEligibility.trim(),
                      fee: courseFee.trim(),
                      category: courseCategory,
                      description: courseDescription.trim()
                    };

                    if (editingCourseId) {
                      await coursesService.update(editingCourseId, payload);
                      triggerAlert('Course details updated successfully!');
                    } else {
                      await coursesService.add(payload);
                      triggerAlert('New program registered!');
                    }

                    setEditingCourseId(null);
                    setCourseName('');
                    setCourseDuration('');
                    setCourseIntake(150);
                    setCourseEligibility('');
                    setCourseFee('');
                    setCourseDescription('');
                    loadDynamicData();
                  } catch (err) {
                    console.error(err);
                  }
                }} className="lg:col-span-4 bg-slate-50 border p-4 rounded-lg space-y-3 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">{editingCourseId ? 'Edit Program Details' : 'Register New Program'}</span>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Course Name</label>
                    <input
                      type="text" required placeholder="e.g. MS General Surgery"
                      value={courseName} onChange={(e) => setCourseName(e.target.value)}
                      className="w-full px-2 py-1.5 border rounded focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                      <select
                        value={courseCategory} onChange={(e) => setCourseCategory(e.target.value as any)}
                        className="w-full px-2 py-1.5 border bg-white rounded focus:outline-none"
                      >
                        <option value="UG">UG (Undergrad)</option>
                        <option value="PG">PG (Postgrad)</option>
                        <option value="Diploma">Diploma</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Duration</label>
                      <input
                        type="text" required placeholder="e.g. 3 Years"
                        value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Intake Seats</label>
                      <input
                        type="number" required placeholder="150"
                        value={courseIntake} onChange={(e) => setCourseIntake(Number(e.target.value))}
                        className="w-full px-2 py-1.5 border rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fee Description</label>
                      <input
                        type="text" required placeholder="₹12,00,000/Year"
                        value={courseFee} onChange={(e) => setCourseFee(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Eligibility Criteria</label>
                    <input
                      type="text" required placeholder="NEET PG qualified"
                      value={courseEligibility} onChange={(e) => setCourseEligibility(e.target.value)}
                      className="w-full px-2 py-1.5 border rounded focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Short Description</label>
                    <textarea
                      rows={3} placeholder="Provide academic outline details..."
                      value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)}
                      className="w-full px-2 py-1.5 border rounded focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold uppercase rounded cursor-pointer transition"
                    >
                      {editingCourseId ? 'Save Edits' : 'Register Course'}
                    </button>
                    {editingCourseId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCourseId(null);
                          setCourseName('');
                          setCourseDuration('');
                          setCourseIntake(150);
                          setCourseEligibility('');
                          setCourseFee('');
                          setCourseDescription('');
                        }}
                        className="py-2 px-3 bg-slate-300 hover:bg-slate-400 text-slate-700 font-bold uppercase rounded cursor-pointer transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Course List */}
                <div className="lg:col-span-8 bg-white border rounded-lg overflow-hidden text-xs">
                  {loadingDb ? (
                    <div className="py-8 text-center text-slate-400">Loading programs...</div>
                  ) : courses.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">No programs in database.</div>
                  ) : (
                    <div className="divide-y">
                      {courses.map((course) => (
                        <div key={course.id} className="p-3.5 flex justify-between items-start gap-4 hover:bg-slate-50 transition">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 font-black text-[8px] uppercase rounded">
                                {course.category}
                              </span>
                              <span className="font-extrabold text-slate-800 text-xs">{course.name}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal font-medium">{course.description || 'No description added'}</p>
                            <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-4">
                              <span><strong>Duration:</strong> {course.duration}</span>
                              <span><strong>Seats:</strong> {course.intake}</span>
                              <span><strong>Fee:</strong> {course.fee}</span>
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                if (course.id) {
                                  setEditingCourseId(course.id);
                                  setCourseName(course.name);
                                  setCourseDuration(course.duration);
                                  setCourseIntake(course.intake);
                                  setCourseEligibility(course.eligibility);
                                  setCourseFee(course.fee);
                                  setCourseDescription(course.description || '');
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {deletingCourseId === course.id ? (
                              <button
                                onClick={async () => {
                                  try {
                                    if (course.id) {
                                      await coursesService.delete(course.id);
                                      triggerAlert('Course program deleted.');
                                      setDeletingCourseId(null);
                                      loadDynamicData();
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="px-1.5 py-0.5 bg-red-600 text-white font-extrabold text-[8px] uppercase rounded animate-pulse"
                              >
                                OK?
                              </button>
                            ) : (
                              <button
                                onClick={() => course.id && setDeletingCourseId(course.id)}
                                className="p-1 text-slate-300 hover:text-red-600 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Departments CRUD */}
            <div className="space-y-4 pt-4 border-t">
              <span className="text-[11px] font-black text-indigo-900 uppercase tracking-widest block border-b pb-1">3. Academic Departments (Departments Database)</span>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Department Form */}
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!deptName.trim() || !deptHOD.trim()) return;
                  try {
                    const payload = {
                      name: deptName.trim(),
                      headOfDepartment: deptHOD.trim(),
                      establishedYear: deptEstablished.trim(),
                      email: deptEmail.trim(),
                      phone: deptPhone.trim(),
                      location: deptLocation.trim(),
                      description: deptDescription.trim()
                    };

                    if (editingDeptId) {
                      await departmentsService.update(editingDeptId, payload);
                      triggerAlert('Department record updated successfully!');
                    } else {
                      await departmentsService.add(payload);
                      triggerAlert('New academic department registered!');
                    }

                    setEditingDeptId(null);
                    setDeptName('');
                    setDeptHOD('');
                    setDeptEstablished('');
                    setDeptEmail('');
                    setDeptPhone('');
                    setDeptLocation('');
                    setDeptDescription('');
                    loadDynamicData();
                  } catch (err) {
                    console.error(err);
                  }
                }} className="lg:col-span-4 bg-slate-50 border p-4 rounded-lg space-y-3 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">{editingDeptId ? 'Edit Department details' : 'Register New Department'}</span>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Department Name</label>
                    <input
                      type="text" required placeholder="e.g. Department of Pediatrics"
                      value={deptName} onChange={(e) => setDeptName(e.target.value)}
                      className="w-full px-2 py-1.5 border rounded focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">HOD / Leader</label>
                      <input
                        type="text" required placeholder="e.g. Dr. Ritu Bawa"
                        value={deptHOD} onChange={(e) => setDeptHOD(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Est. Year</label>
                      <input
                        type="text" placeholder="2016"
                        value={deptEstablished} onChange={(e) => setDeptEstablished(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email</label>
                      <input
                        type="email" placeholder="medicine@wcmsrh.com"
                        value={deptEmail} onChange={(e) => setDeptEmail(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Extension Phone</label>
                      <input
                        type="text" placeholder="01251-245001"
                        value={deptPhone} onChange={(e) => setDeptPhone(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Block / Location</label>
                    <input
                      type="text" placeholder="e.g. Block A, 1st Floor"
                      value={deptLocation} onChange={(e) => setDeptLocation(e.target.value)}
                      className="w-full px-2 py-1.5 border rounded focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Outline details</label>
                    <textarea
                      rows={3} placeholder="Describe department services..."
                      value={deptDescription} onChange={(e) => setDeptDescription(e.target.value)}
                      className="w-full px-2 py-1.5 border rounded focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold uppercase rounded cursor-pointer transition"
                    >
                      {editingDeptId ? 'Save Edits' : 'Register Dept'}
                    </button>
                    {editingDeptId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDeptId(null);
                          setDeptName('');
                          setDeptHOD('');
                          setDeptEstablished('');
                          setDeptEmail('');
                          setDeptPhone('');
                          setDeptLocation('');
                          setDeptDescription('');
                        }}
                        className="py-2 px-3 bg-slate-300 hover:bg-slate-400 text-slate-700 font-bold uppercase rounded cursor-pointer transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Dept List */}
                <div className="lg:col-span-8 bg-white border rounded-lg overflow-hidden text-xs">
                  {loadingDb ? (
                    <div className="py-8 text-center text-slate-400">Loading departments...</div>
                  ) : departments.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">No departments found.</div>
                  ) : (
                    <div className="divide-y">
                      {departments.map((dept) => (
                        <div key={dept.id} className="p-3.5 flex justify-between items-start gap-4 hover:bg-slate-50 transition">
                          <div className="space-y-1">
                            <span className="font-extrabold text-slate-800 text-xs">{dept.name}</span>
                            {dept.description && <p className="text-[11px] text-slate-500 font-medium">{dept.description}</p>}
                            <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-4">
                              <span><strong>HOD:</strong> {dept.headOfDepartment}</span>
                              {dept.establishedYear && <span><strong>Established:</strong> {dept.establishedYear}</span>}
                              {dept.location && <span><strong>Location:</strong> {dept.location}</span>}
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                if (dept.id) {
                                  setEditingDeptId(dept.id);
                                  setDeptName(dept.name);
                                  setDeptHOD(dept.headOfDepartment);
                                  setDeptEstablished(dept.establishedYear || '');
                                  setDeptEmail(dept.email || '');
                                  setDeptPhone(dept.phone || '');
                                  setDeptLocation(dept.location || '');
                                  setDeptDescription(dept.description || '');
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {deletingDeptId === dept.id ? (
                              <button
                                onClick={async () => {
                                  try {
                                    if (dept.id) {
                                      await departmentsService.delete(dept.id);
                                      triggerAlert('Department record deleted.');
                                      setDeletingDeptId(null);
                                      loadDynamicData();
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="px-1.5 py-0.5 bg-red-600 text-white font-extrabold text-[8px] uppercase rounded animate-pulse"
                              >
                                OK?
                              </button>
                            ) : (
                              <button
                                onClick={() => dept.id && setDeletingDeptId(dept.id)}
                                className="p-1 text-slate-300 hover:text-red-600 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Faculty CRUD */}
            <div className="space-y-4 pt-4 border-t">
              <span className="text-[11px] font-black text-indigo-900 uppercase tracking-widest block border-b pb-1">4. Medical Faculty Directory (Faculty Database)</span>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Faculty Form */}
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!facName.trim() || !facDepartment.trim()) return;
                  try {
                    const payload = {
                      name: facName.trim(),
                      designation: facDesignation.trim(),
                      department: facDepartment.trim(),
                      qualification: facQualification.trim(),
                      email: facEmail.trim(),
                      experience: facExperience.trim(),
                      status: facStatus
                    };

                    if (editingFacultyId) {
                      await facultyService.update(editingFacultyId, payload);
                      triggerAlert('Faculty record updated!');
                    } else {
                      await facultyService.add(payload);
                      triggerAlert('New faculty registered!');
                    }

                    setEditingFacultyId(null);
                    setFacName('');
                    setFacDesignation('');
                    setFacDepartment('');
                    setFacQualification('');
                    setFacEmail('');
                    setFacExperience('');
                    setFacStatus('Active');
                    loadDynamicData();
                  } catch (err) {
                    console.error(err);
                  }
                }} className="lg:col-span-4 bg-slate-50 border p-4 rounded-lg space-y-3 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">{editingFacultyId ? 'Edit Faculty credentials' : 'Register New Faculty'}</span>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Doctor Name</label>
                    <input
                      type="text" required placeholder="e.g. Dr. Ritu Bawa"
                      value={facName} onChange={(e) => setFacName(e.target.value)}
                      className="w-full px-2 py-1.5 border rounded focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Designation</label>
                      <input
                        type="text" required placeholder="e.g. Professor & HoD"
                        value={facDesignation} onChange={(e) => setFacDesignation(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Department</label>
                      <select
                        value={facDepartment} onChange={(e) => setFacDepartment(e.target.value)}
                        className="w-full px-2 py-1.5 border bg-white rounded focus:outline-none"
                      >
                        <option value="">-- Choose Dept --</option>
                        {departments.map((dept) => (
                          <option key={dept.id || dept.name} value={dept.name}>{dept.name}</option>
                        ))}
                        <option value="General Medicine">General Medicine</option>
                        <option value="General Surgery">General Surgery</option>
                        <option value="Ophthalmology">Ophthalmology</option>
                        <option value="Paediatrics">Paediatrics</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Qualifications</label>
                      <input
                        type="text" required placeholder="e.g. MD (Medicine)"
                        value={facQualification} onChange={(e) => setFacQualification(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Experience</label>
                      <input
                        type="text" placeholder="e.g. 15 Years"
                        value={facExperience} onChange={(e) => setFacExperience(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email</label>
                      <input
                        type="email" placeholder="ritu.bawa@wcmsrh.com"
                        value={facEmail} onChange={(e) => setFacEmail(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
                      <select
                        value={facStatus} onChange={(e) => setFacStatus(e.target.value as any)}
                        className="w-full px-2 py-1.5 border bg-white rounded focus:outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold uppercase rounded cursor-pointer transition"
                    >
                      {editingFacultyId ? 'Save Edits' : 'Register Faculty'}
                    </button>
                    {editingFacultyId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingFacultyId(null);
                          setFacName('');
                          setFacDesignation('');
                          setFacDepartment('');
                          setFacQualification('');
                          setFacEmail('');
                          setFacExperience('');
                          setFacStatus('Active');
                        }}
                        className="py-2 px-3 bg-slate-300 hover:bg-slate-400 text-slate-700 font-bold uppercase rounded cursor-pointer transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Faculty List */}
                <div className="lg:col-span-8 bg-white border rounded-lg overflow-hidden text-xs">
                  {loadingDb ? (
                    <div className="py-8 text-center text-slate-400">Loading directory...</div>
                  ) : faculty.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">No faculty members found.</div>
                  ) : (
                    <div className="divide-y">
                      {faculty.map((fac) => (
                        <div key={fac.id} className="p-3.5 flex justify-between items-start gap-4 hover:bg-slate-50 transition">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-800 text-xs">{fac.name}</span>
                              <span className={`px-1.5 py-0.2 text-[8px] font-bold uppercase rounded ${
                                fac.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                              }`}>{fac.status || 'Active'}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-4">
                              <span><strong>Designation:</strong> {fac.designation}</span>
                              <span><strong>Department:</strong> {fac.department}</span>
                              <span><strong>Qualifications:</strong> {fac.qualification}</span>
                              {fac.experience && <span><strong>Exp:</strong> {fac.experience}</span>}
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                if (fac.id) {
                                  setEditingFacultyId(fac.id);
                                  setFacName(fac.name);
                                  setFacDesignation(fac.designation);
                                  setFacDepartment(fac.department);
                                  setFacQualification(fac.qualification);
                                  setFacEmail(fac.email || '');
                                  setFacExperience(fac.experience || '');
                                  setFacStatus(fac.status || 'Active');
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {deletingFacultyId === fac.id ? (
                              <button
                                onClick={async () => {
                                  try {
                                    if (fac.id) {
                                      await facultyService.delete(fac.id);
                                      triggerAlert('Faculty record deleted.');
                                      setDeletingFacultyId(null);
                                      loadDynamicData();
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="px-1.5 py-0.5 bg-red-600 text-white font-extrabold text-[8px] uppercase rounded animate-pulse"
                              >
                                OK?
                              </button>
                            ) : (
                              <button
                                onClick={() => fac.id && setDeletingFacultyId(fac.id)}
                                className="p-1 text-slate-300 hover:text-red-600 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
