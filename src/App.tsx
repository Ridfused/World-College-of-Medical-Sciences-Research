import React, { useState, useEffect, useCallback, useRef } from 'react';
import { seedInitialDatabaseIfEmpty } from './services/firestoreService';
import {
  StudentProfile,
  AttendanceItem,
  ExamPerformance,
  RecentAttendance,
  HolidayItem,
  VacationItem,
  UniversityInfo,
  CollegeInfo,
  ExamScheduleItem
} from './types';
import {
  initialStudentProfile,
  defaultAttendanceItems,
  defaultExamPerformances,
  defaultRecentAttendance,
  defaultHolidays,
  defaultVacations,
  defaultUniversityInfo,
  defaultCollegeInfo,
  defaultExamSchedule
} from './data';

// Components
import Login from './components/Login';
import DashboardHome from './components/DashboardHome';
import ProfileEdit from './components/ProfileEdit';
import UniversityCollegeInfo from './components/UniversityCollegeInfo';
import HolidayCalendar from './components/HolidayCalendar';
import AttendanceReport from './components/AttendanceReport';
import ChangePassword from './components/ChangePassword';
import AdminPanel from './components/AdminPanel';
import DocumentDownload from './components/DocumentDownload';
import FeePaymentDetailsPortal from './components/FeePaymentDetailsPortal';
import { useSaveManager } from './context/SaveManagerContext';
// @ts-ignore
import collegeLogo from './assets/images/wcmsrh_logo_1782671643394.jpg';

// Extra Icons
import {
  Menu,
  ChevronDown,
  LogOut,
  Download,
  CheckCircle,
  FileText,
  Clock,
  CreditCard,
  Send,
  UserCheck,
  Calendar,
  Layers,
  BookOpen,
  Info,
  RefreshCw,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';

const STORAGE_KEYS = {
  studentProfile: 'student_profile',
  attendanceItems: 'attendance_items',
  examPerformances: 'exam_performances',
  examSchedule: 'exam_schedule',
  gatepassList: 'gatepass_list',
  pendingFeeBalance: 'pending_fee_balance',
  isAuthenticated: 'is_authenticated',
  username: 'username',
};

const getSyncEndpoint = () => {
  const configured = ((import.meta as any).env?.VITE_SYNC_API_URL || '').trim();
  if (configured) {
    return configured;
  }
  return `${window.location.origin}/api/state`;
};

const SYNC_ENDPOINT = getSyncEndpoint();

const readStoredValue = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStoredValue = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
};

export default function App() {
  const latestSharedStateRef = useRef<Record<string, unknown>>({});
  const lastSyncedStateRef = useRef<string>('');
  const syncTimerRef = useRef<number | null>(null);

  // Session / Auth States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  // Save Manager state bindings
  const {
    isEditing,
    hasUnsavedChanges,
    isSaving,
    error: saveError,
    success: saveSuccess,
    draftData,
    liveData,
    startEditing,
    updateStudent,
    updateAttendanceItems,
    updateExamPerformances,
    updateGatepasses,
    updatePendingFeeBalance,
    saveChanges,
    cancelChanges,
    syncLiveStateFromServer,
    setError: setSaveError,
    setSuccess: setSaveSuccess,
  } = useSaveManager();

  const studentProfile = isEditing ? draftData.studentProfile : liveData.studentProfile;
  const attendanceItems = isEditing ? draftData.attendanceItems : liveData.attendanceItems;
  const examPerformances = isEditing ? draftData.examPerformances : liveData.examPerformances;
  const gatepasses = isEditing ? draftData.gatepasses : liveData.gatepasses;

  const setStudentProfile = async (studentOrUpdater: StudentProfile | ((prev: StudentProfile) => StudentProfile)) => {
    const student = typeof studentOrUpdater === 'function'
      ? studentOrUpdater(studentProfile)
      : studentOrUpdater;

    if (username === 'admin') {
      updateStudent(student);
    } else {
      syncLiveStateFromServer({ studentProfile: student });
      try {
        await fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            state: {
              ...liveData,
              studentProfile: student,
            }
          }),
        });
      } catch (err) {
        console.error('Failed to sync student profile to server:', err);
      }
    }
  };

  const setAttendanceItems = async (itemsOrUpdater: AttendanceItem[] | ((prev: AttendanceItem[]) => AttendanceItem[])) => {
    const items = typeof itemsOrUpdater === 'function'
      ? itemsOrUpdater(attendanceItems)
      : itemsOrUpdater;

    if (username === 'admin') {
      updateAttendanceItems(items);
    } else {
      syncLiveStateFromServer({ attendanceItems: items });
    }
  };

  const setExamPerformances = async (examsOrUpdater: ExamPerformance[] | ((prev: ExamPerformance[]) => ExamPerformance[])) => {
    const exams = typeof examsOrUpdater === 'function'
      ? examsOrUpdater(examPerformances)
      : examsOrUpdater;

    if (username === 'admin') {
      updateExamPerformances(exams);
    } else {
      syncLiveStateFromServer({ examPerformances: exams });
    }
  };

  const setGatepasses = async (passesOrUpdater: any[] | ((prev: any[]) => any[])) => {
    const nextPasses = typeof passesOrUpdater === 'function' 
      ? passesOrUpdater(gatepasses)
      : passesOrUpdater;

    if (username === 'admin') {
      updateGatepasses(nextPasses);
    } else {
      syncLiveStateFromServer({ gatepasses: nextPasses });
      try {
        await fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            state: {
              ...liveData,
              gatepasses: nextPasses,
            }
          }),
        });
      } catch (err) {
        console.error('Failed to sync gatepasses to server:', err);
      }
    }
  };

  const [examSchedule, setExamSchedule] = useState<ExamScheduleItem[]>(() => {
    return readStoredValue<ExamScheduleItem[]>(STORAGE_KEYS.examSchedule, defaultExamSchedule);
  });

  // Current Active View / Tab State
  const [activeTab, setActiveTab] = useState<string>('home');

  // Navigation Dropdown toggles
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // New Gatepass Input States
  const [gpReason, setGpReason] = useState('');
  const [gpOut, setGpOut] = useState('');
  const [gpIn, setGpIn] = useState('');
  const [gpSuccess, setGpSuccess] = useState('');
  const [gpDeletingId, setGpDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (gpDeletingId !== null) {
      const timer = setTimeout(() => {
        setGpDeletingId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gpDeletingId]);

  // Preserve any custom credentials entered by the user and only seed defaults once.
  useEffect(() => {
    localStorage.removeItem('is_authenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('logout_success');
  }, []);

  useEffect(() => {
    try {
      const existingUserName = localStorage.getItem('user_username');
      const existingPassword = localStorage.getItem('user_password');

      if (!existingUserName && !existingPassword) {
        localStorage.setItem('user_username', 'Khushi1427');
        localStorage.setItem('user_password', 'Khushi2748121');
      } else if (!existingUserName) {
        localStorage.setItem('user_username', 'Khushi1427');
      } else if (!existingPassword) {
        localStorage.setItem('user_password', 'Khushi2748121');
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  // ERP screenshot-matched inputs
  const [gpStudentName, setGpStudentName] = useState('Khushi');
  const [gpMobileNo, setGpMobileNo] = useState('8708992125');
  const [gpCourse, setGpCourse] = useState('MBBS');
  const [gpHostel, setGpHostel] = useState('Yamuna Girls Hostel / T15');
  const [gpApplyFor, setGpApplyFor] = useState<'day' | 'hostel'>('day');
  const [gpRequestDate, setGpRequestDate] = useState('30/06/2026');
  const [gpRequestTimeStartHour, setGpRequestTimeStartHour] = useState('4');
  const [gpRequestTimeStartMin, setGpRequestTimeStartMin] = useState('00');
  const [gpRequestTimeEndHour, setGpRequestTimeEndHour] = useState('9');
  const [gpRequestTimeEndMin, setGpRequestTimeEndMin] = useState('00');
  const [gpRequestTimeStartPeriod, setGpRequestTimeStartPeriod] = useState<'AM' | 'PM'>('PM');
  const [gpRequestTimeEndPeriod, setGpRequestTimeEndPeriod] = useState<'AM' | 'PM'>('PM');

  // Fee payment simulated list state
  const [feesHistory, setFeesHistory] = useState([
    { receiptNo: 'FEE/2026/0891', date: '10-02-2026', head: '3rd Year Tuition Fee', amount: '₹ 1,20,000', status: 'Paid', method: 'Online NetBanking' },
    { receiptNo: 'FEE/2026/0411', date: '12-02-2026', head: '3rd Year Hostel & Mess Fee', amount: '₹ 80,000', status: 'Paid', method: 'UPI Payment' },
    { receiptNo: 'FEE/2025/1192', date: '15-08-2025', head: '2nd Year Examination Fee', amount: '₹ 5,000', status: 'Paid', method: 'Debit Card' }
  ]);

  // Integrated working states for interactive elements
  const [downloadingDoc, setDownloadingDoc] = useState<{ name: string; progress: number; status: string } | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiIdInput, setUpiIdInput] = useState<string>('student@okhdfc');
  const [cardNumberInput, setCardNumberInput] = useState<string>('4321 8890 2234 1152');
  const [cardExpiryInput, setCardExpiryInput] = useState<string>('12/29');
  const [cardCvvInput, setCardCvvInput] = useState<string>('123');
  
  // Exam Schedule edit states
  const [examSchedSubject, setExamSchedSubject] = useState('');
  const [examSchedDate, setExamSchedDate] = useState('');
  const [examSchedTime, setExamSchedTime] = useState('');
  const [examSchedRoom, setExamSchedRoom] = useState('');
  const [examSchedStatus, setExamSchedStatus] = useState('Admitted');
  const [examSchedSuccess, setExamSchedSuccess] = useState('');

  // Exam Performance inline edit states for Admin on normal Exam Results tab
  const [appEditingExamIdx, setAppEditingExamIdx] = useState<number | null>(null);
  const [appEditExamName, setAppEditExamName] = useState('');
  const [appEditExamSecured, setAppEditExamSecured] = useState(0);
  const [appEditExamTotal, setAppEditExamTotal] = useState(100);

  // States for adding a new Exam Performance Assessment record on Exam Results tab
  const [appNewExamName, setAppNewExamName] = useState('');
  const [appNewExamSecured, setAppNewExamSecured] = useState(80);
  const [appNewExamTotal, setAppNewExamTotal] = useState(100);
  const [appNewExamSuccess, setAppNewExamSuccess] = useState('');

  const pendingFeeBalance = isEditing ? draftData.pendingFeeBalance : liveData.pendingFeeBalance;

  const setPendingFeeBalance = async (feeOrUpdater: number | ((prev: number) => number)) => {
    const fee = typeof feeOrUpdater === 'function'
      ? feeOrUpdater(pendingFeeBalance)
      : feeOrUpdater;

    if (username === 'admin') {
      updatePendingFeeBalance(fee);
    } else {
      syncLiveStateFromServer({ pendingFeeBalance: fee });
    }
  };

  const startSimulatedDownload = (fileName: string) => {
    setDownloadingDoc({ name: fileName, progress: 0, status: 'Contacting Academic Block Database...' });
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      let statusStr = 'Downloading file blocks...';
      if (progress >= 30 && progress < 60) statusStr = 'Applying digital SHA-256 signature...';
      if (progress >= 60 && progress < 90) statusStr = 'Verifying security hashes...';
      if (progress >= 90) statusStr = 'Finalizing download!';
      
      setDownloadingDoc(prev => prev ? { ...prev, progress, status: statusStr } : null);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDownloadingDoc(null);
          alert(`Success: "${fileName}" has been downloaded successfully!`);
        }, 800);
      }
    }, 150);
  };

  const applyServerState = (serverState: Record<string, unknown>) => {
    if (serverState?.studentProfile) {
      setStudentProfile(serverState.studentProfile as StudentProfile);
    }
    if (Array.isArray(serverState?.attendanceItems)) {
      setAttendanceItems(serverState.attendanceItems as AttendanceItem[]);
    }
    if (Array.isArray(serverState?.examPerformances)) {
      setExamPerformances(serverState.examPerformances as ExamPerformance[]);
    }
    if (Array.isArray(serverState?.examSchedule)) {
      setExamSchedule(serverState.examSchedule as ExamScheduleItem[]);
    }
    if (Array.isArray(serverState?.gatepasses)) {
      setGatepasses(serverState.gatepasses as Array<{
        id: number;
        reason: string;
        outDate: string;
        inDate: string;
        status: 'Pending' | 'Approved' | 'Rejected';
        timestamp: string;
      }>);
    }
    if (typeof serverState?.pendingFeeBalance === 'number') {
      setPendingFeeBalance(serverState.pendingFeeBalance as number);
    }
  };

  const syncSharedState = useCallback(async (nextState?: Record<string, unknown>) => {
    const currentUser = localStorage.getItem('username') || username;
    if (currentUser !== 'admin') {
      return;
    }

    const mergedState = {
      ...latestSharedStateRef.current,
      ...(nextState ?? {}),
      isAdmin: true,
      username: 'admin',
    };
    latestSharedStateRef.current = mergedState;

    const payloadString = JSON.stringify(mergedState);
    if (payloadString === lastSyncedStateRef.current) {
      return;
    }

    if (syncTimerRef.current !== null) {
      window.clearTimeout(syncTimerRef.current);
    }

    syncTimerRef.current = window.setTimeout(async () => {
      try {
        const latestPayload = latestSharedStateRef.current;
        const latestPayloadString = JSON.stringify(latestPayload);
        if (latestPayloadString === lastSyncedStateRef.current) {
          return;
        }

        lastSyncedStateRef.current = latestPayloadString;
        await fetch(SYNC_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: latestPayload }),
          cache: 'no-store',
        });
      } catch {
        // ignore sync errors
      } finally {
        syncTimerRef.current = null;
      }
    }, 700);
  }, []);

  // Seed database and poll state from server
  useEffect(() => {
    // Seed initial database collections (statistics, courses, departments, faculty, notices, admissions, contactMessages) if empty
    void seedInitialDatabaseIfEmpty();

    const hydrateFromServer = async () => {
      // Pause/skip pulling live state during active admin editing
      if (isEditing || hasUnsavedChanges) {
        return;
      }
      try {
        const response = await fetch(SYNC_ENDPOINT, { cache: 'no-store' });
        if (!response.ok) return;
        const serverState = await response.json();
        
        // Sync to SaveManager context
        syncLiveStateFromServer(serverState as any);
        
        // Update exam schedule locally if present
        if (serverState && Array.isArray((serverState as any).examSchedule)) {
          setExamSchedule((serverState as any).examSchedule);
        }
      } catch {
        // ignore sync errors
      }
    };

    const syncOnVisibility = () => {
      if (document.visibilityState === 'visible') {
        void hydrateFromServer();
      }
    };

    void hydrateFromServer();
    
    // Periodically poll for state updates every 5 seconds to synchronize changes across multiple devices dynamically
    const pollInterval = window.setInterval(() => {
      void hydrateFromServer();
    }, 5000);

    document.addEventListener('visibilitychange', syncOnVisibility);
    window.addEventListener('focus', syncOnVisibility);

    return () => {
      window.clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', syncOnVisibility);
      window.removeEventListener('focus', syncOnVisibility);
    };
  }, [isEditing, hasUnsavedChanges, syncLiveStateFromServer]);

  const handleLogin = (user: string) => {
    setIsAuthenticated(true);
    setUsername(user);
    if (user === 'admin') {
      setActiveTab('admin_panel');
    } else {
      setActiveTab('home');
    }
  };

  const handleResetToDefaults = () => {
    setStudentProfile(initialStudentProfile);
    setAttendanceItems(defaultAttendanceItems);
    setExamPerformances(defaultExamPerformances);
    setExamSchedule(defaultExamSchedule);
    setPendingFeeBalance(5000);
    localStorage.removeItem('student_profile');
    localStorage.removeItem('attendance_items');
    localStorage.removeItem('exam_performances');
    localStorage.removeItem('exam_schedule');
    localStorage.removeItem('pending_fee_balance');
  };

  const handleLogout = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsAuthenticated(false);
    setUsername('');
    setActiveTab('home');
    localStorage.removeItem('is_authenticated');
    localStorage.removeItem('username');
    localStorage.setItem('logout_success', 'true');
  };

  const handleSaveProfile = (updated: StudentProfile) => {
    setStudentProfile(updated);
  };

  const handleAddGatepass = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct out/in datetime strings to prevent crashes
    let outDateStr = '';
    let inDateStr = '';
    const parseTimeWithPeriod = (hourStr: string, minStr: string, period: 'AM' | 'PM') => {
      let hh = parseInt(hourStr, 10) || 0;
      const mm = parseInt(minStr, 10) || 0;
      // Expect hh in 1-12; convert to 24-hour
      if (hh >= 1 && hh <= 12) {
        if (period === 'PM' && hh < 12) hh += 12;
        if (period === 'AM' && hh === 12) hh = 0;
      }
      return [hh, mm];
    };

    try {
      let year = 2026;
      let month = 5; // June (0-indexed)
      let day = 30;
      
      if (gpRequestDate.includes('/')) {
        const parts = gpRequestDate.split('/');
        day = parseInt(parts[0], 10) || 30;
        month = (parseInt(parts[1], 10) || 6) - 1;
        year = parseInt(parts[2], 10) || 2026;
      } else if (gpRequestDate.includes('-')) {
        const parts = gpRequestDate.split('-');
        year = parseInt(parts[0], 10) || 2026;
        month = (parseInt(parts[1], 10) || 6) - 1;
        day = parseInt(parts[2], 10) || 30;
      }

      const [outHour, outMin] = parseTimeWithPeriod(gpRequestTimeStartHour, gpRequestTimeStartMin, gpRequestTimeStartPeriod);
      const [inHour, inMin] = parseTimeWithPeriod(gpRequestTimeEndHour, gpRequestTimeEndMin, gpRequestTimeEndPeriod);

      const dOut = new Date(year, month, day, outHour, outMin);
      outDateStr = dOut.toISOString();

      if (gpApplyFor === 'day') {
        const dIn = new Date(year, month, day, inHour, inMin);
        inDateStr = dIn.toISOString();
      } else {
        // Hostel Leave is multi-day: default to 3 days later
        const dIn = new Date(year, month, day + 3, inHour, inMin);
        inDateStr = dIn.toISOString();
      }
    } catch (err) {
      outDateStr = new Date().toISOString();
      inDateStr = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
    }

    const typeLabel = gpApplyFor === 'day' ? 'Day gate pass' : 'Hostel leave';
    const finalReason = gpReason ? gpReason : `${typeLabel} for ${gpStudentName}`;

    const newPass = {
      id: Date.now(),
      reason: finalReason,
      outDate: outDateStr,
      inDate: inDateStr,
      status: 'Pending' as const,
      timestamp: gpRequestDate
    };

    setGatepasses(prev => [newPass, ...prev]);
    setGpReason('');
    setGpSuccess('Gatepass Request submitted successfully for Warden review!');
    setTimeout(() => setGpSuccess(''), 4000);
  };

  const handleResetGatepassForm = () => {
    setGpStudentName('Khushi');
    setGpMobileNo('8708992125');
    setGpCourse('MBBS');
    setGpHostel('Yamuna Girls Hostel / T15');
    setGpApplyFor('day');
    setGpRequestDate('30/06/2026');
    setGpRequestTimeStartHour('4');
    setGpRequestTimeStartMin('00');
    setGpRequestTimeEndHour('9');
    setGpRequestTimeEndMin('00');
    setGpRequestTimeStartPeriod('PM');
    setGpRequestTimeEndPeriod('PM');
    setGpReason('');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const toggleDropdown = (e: React.MouseEvent, menuName: string) => {
    e.stopPropagation();
    setActiveDropdown(prev => (prev === menuName ? null : menuName));
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col justify-between">
      
      {username === 'admin' && (isEditing || hasUnsavedChanges) && (
        <div className="sticky top-0 z-[9999] bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 text-white shadow-lg py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="animate-pulse flex h-2.5 w-2.5 rounded-full bg-white"></span>
              <span>⚠️ Admin Draft Mode: Unsaved administrative modifications exist.</span>
            </div>
            {saveError && (
              <div className="text-xs bg-red-800/80 border border-red-500 rounded px-2.5 py-1 max-w-md">
                Error: {saveError}
              </div>
            )}
            <div className="flex items-center gap-3">
              <button
                onClick={cancelChanges}
                disabled={isSaving}
                className="bg-black/20 hover:bg-black/30 border border-white/20 active:scale-95 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded transition duration-150 disabled:opacity-50 cursor-pointer"
              >
                Cancel Changes
              </button>
              <button
                onClick={saveChanges}
                disabled={isSaving}
                className="bg-white text-orange-700 font-extrabold text-xs uppercase tracking-wider px-5 py-1.5 rounded hover:bg-slate-100 border border-white active:scale-95 shadow transition duration-150 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="fixed bottom-5 right-5 z-[9999] bg-emerald-600 text-white shadow-2xl rounded-lg py-3 px-5 border border-emerald-500 flex items-center gap-2 font-bold text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-100" />
          {saveSuccess}
        </div>
      )}
      
      {/* Top Header */}
      <header className="bg-[#004a99] text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <img 
              alt="College Logo" 
              className="h-12 w-12 rounded bg-white p-1 object-contain" 
              src={collegeLogo}
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-lg md:text-xl font-bold uppercase leading-tight tracking-wide">
                World College of Medical Sciences &amp; Research
              </h1>
              <p className="text-[10px] md:text-xs opacity-90 font-medium">
                (Approved by Ministry of Health &amp; Family Welfare &amp; Affiliated to Pt. B.D Sharma University of Health Science, Rohtak, Haryana)
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-200 mb-1">
              <button 
                onClick={() => handleLogout()}
                className="text-red-400 font-bold hover:text-red-300 transition hover:underline focus:outline-none cursor-pointer"
              >
                Logout
              </button>
            </div>
            <div className="text-sm font-bold tracking-wider flex items-center justify-end gap-1.5">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
              {username === 'admin' ? 'WELCOME ADMINISTRATOR' : 'Parent Dashboard'}
            </div>
          </div>
        </div>
      </header>

      {/* Primary Horizontal Navigation Bar */}
      <nav className="bg-[#2c8ed6] text-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <ul className="flex items-center space-x-1 sm:space-x-4 text-xs sm:text-sm font-semibold h-11">
            <li>
              <button
                onClick={() => { setActiveTab('home'); }}
                className={`px-3 py-2 rounded transition-colors duration-150 cursor-pointer ${
                  activeTab === 'home' ? 'bg-[#1a5f91] text-yellow-300' : 'hover:bg-[#1a5f91]'
                }`}
              >
                Home
              </button>
            </li>

            {username === 'admin' && (
              <li>
                <button
                  onClick={() => { setActiveTab('admin_panel'); }}
                  className={`px-3 py-2 rounded transition-colors duration-150 cursor-pointer font-bold ${
                    activeTab === 'admin_panel' ? 'bg-[#1a5f91] text-yellow-300 font-extrabold' : 'hover:bg-[#1a5f91] text-red-100'
                  }`}
                >
                  Admin Panel
                </button>
              </li>
            )}

            {/* Dropdown 1: Manage Access */}
            <li className="relative">
              <button
                onClick={(e) => toggleDropdown(e, 'manage_access')}
                className={`px-3 py-2 rounded transition-colors duration-150 flex items-center gap-1 cursor-pointer ${
                  activeDropdown === 'manage_access' || activeTab === 'change_password' ? 'bg-[#1a5f91]' : 'hover:bg-[#1a5f91]'
                }`}
              >
                Manage Access <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>
              {activeDropdown === 'manage_access' && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white text-slate-800 rounded shadow-xl border border-slate-200 py-1 font-medium z-50 animate-fadeIn">
                  {username === 'admin' ? (
                    <button
                      onClick={() => { setActiveTab('change_password'); setActiveDropdown(null); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 text-xs text-slate-700 font-semibold flex items-center gap-2"
                    >
                      Change Password
                    </button>
                  ) : (
                    <div className="w-full text-left px-4 py-2 text-xs text-slate-500 font-semibold">
                      Manage access options are restricted for users.
                    </div>
                  )}
                </div>
              )}
            </li>

            {/* Dropdown 2: Profile */}
            <li className="relative">
              <button
                onClick={(e) => toggleDropdown(e, 'profile')}
                className={`px-3 py-2 rounded transition-colors duration-150 flex items-center gap-1 cursor-pointer ${
                  activeDropdown === 'profile' || ['university_info', 'college_info'].includes(activeTab) ? 'bg-[#1a5f91]' : 'hover:bg-[#1a5f91]'
                }`}
              >
                Profile <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>
              {activeDropdown === 'profile' && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white text-slate-800 rounded shadow-xl border border-slate-200 py-1 font-medium z-50">
                  <button
                    onClick={() => { setActiveTab('university_info'); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 text-xs text-slate-700 font-semibold"
                  >
                    University Information
                  </button>
                  <button
                    onClick={() => { setActiveTab('college_info'); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 text-xs text-slate-700 font-semibold"
                  >
                    College Information
                  </button>
                </div>
              )}
            </li>

            {/* Dropdown 3: Reports */}
            <li className="relative">
              <button
                onClick={(e) => toggleDropdown(e, 'reports')}
                className={`px-3 py-2 rounded transition-colors duration-150 flex items-center gap-1 cursor-pointer ${
                  activeDropdown === 'reports' || ['attendance_report', 'holiday_calendar'].includes(activeTab) ? 'bg-[#1a5f91]' : 'hover:bg-[#1a5f91]'
                }`}
              >
                Reports <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>
              {activeDropdown === 'reports' && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white text-slate-800 rounded shadow-xl border border-slate-200 py-1 font-medium z-50">
                  <button
                    onClick={() => { setActiveTab('my_profile'); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 text-xs text-slate-700 font-semibold"
                  >
                    Student Information
                  </button>
                  <button
                    onClick={() => { setActiveTab('holiday_calendar'); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 text-xs text-slate-700 font-semibold"
                  >
                    Holiday Calendar
                  </button>
                </div>
              )}
            </li>

            <li className="ml-auto">
              <button
                onClick={() => handleLogout()}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-all duration-150 flex items-center gap-1 cursor-pointer font-bold hover:scale-105 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Container */}
      <main className="container mx-auto py-6 px-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar Nav (lg:col-span-2) */}
          <aside className="lg:col-span-2 space-y-1">
            {username === 'admin' && (
              <button
                onClick={() => setActiveTab('admin_panel')}
                className={`block w-full text-left px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all duration-150 border-l-4 cursor-pointer mb-2 animate-pulse ${
                  activeTab === 'admin_panel'
                    ? 'bg-gradient-to-r from-red-700 to-red-800 text-yellow-300 border-yellow-300 shadow-md'
                    : 'bg-[#a03030] text-white hover:bg-red-800 border-transparent'
                }`}
              >
                ★ ADMIN PANEL
              </button>
            )}
            <button
              onClick={() => setActiveTab('my_profile')}
              className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 border-l-4 cursor-pointer ${
                activeTab === 'my_profile'
                  ? 'bg-[#a03030] text-yellow-300 border-yellow-300 shadow-md'
                  : 'bg-[#c04040] text-white hover:bg-[#a03030] border-transparent'
              }`}
            >
              MY PROFILE
            </button>
            <button
              onClick={() => setActiveTab('document_download')}
              className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 border-l-4 cursor-pointer ${
                activeTab === 'document_download'
                  ? 'bg-[#a03030] text-yellow-300 border-yellow-300 shadow-md'
                  : 'bg-[#c04040] text-white hover:bg-[#a03030] border-transparent'
              }`}
            >
              DOCUMENT DOWNLOAD
            </button>
            <button
              onClick={() => setActiveTab('certificate_download')}
              className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 border-l-4 cursor-pointer ${
                activeTab === 'certificate_download'
                  ? 'bg-[#a03030] text-yellow-300 border-yellow-300 shadow-md'
                  : 'bg-[#c04040] text-white hover:bg-[#a03030] border-transparent'
              }`}
            >
              CERTIFICATE DOWNLOAD
            </button>
            <button
              onClick={() => setActiveTab('holiday_calendar')}
              className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 border-l-4 cursor-pointer ${
                activeTab === 'holiday_calendar'
                  ? 'bg-[#a03030] text-yellow-300 border-yellow-300 shadow-md'
                  : 'bg-[#c04040] text-white hover:bg-[#a03030] border-transparent'
              }`}
            >
              HOLIDAY CALENDAR
            </button>
            <button
              onClick={() => setActiveTab('attendance_report')}
              className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 border-l-4 cursor-pointer ${
                activeTab === 'attendance_report'
                  ? 'bg-[#a03030] text-yellow-300 border-yellow-300 shadow-md'
                  : 'bg-[#c04040] text-white hover:bg-[#a03030] border-transparent'
              }`}
            >
              ATTENDANCE REPORT
            </button>
            <button
              onClick={() => setActiveTab('exam_schedule')}
              className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 border-l-4 cursor-pointer ${
                activeTab === 'exam_schedule'
                  ? 'bg-[#a03030] text-yellow-300 border-yellow-300 shadow-md'
                  : 'bg-[#c04040] text-white hover:bg-[#a03030] border-transparent'
              }`}
            >
              EXAM SCHEDULE
            </button>
            <button
              onClick={() => setActiveTab('exam_results')}
              className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 border-l-4 cursor-pointer ${
                activeTab === 'exam_results'
                  ? 'bg-[#a03030] text-yellow-300 border-yellow-300 shadow-md'
                  : 'bg-[#c04040] text-white hover:bg-[#a03030] border-transparent'
              }`}
            >
              EXAM RESULTS
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 border-l-4 cursor-pointer ${
                activeTab === 'timetable'
                  ? 'bg-[#a03030] text-yellow-300 border-yellow-300 shadow-md'
                  : 'bg-[#c04040] text-white hover:bg-[#a03030] border-transparent'
              }`}
            >
              TIME TABLE
            </button>
            <button
              onClick={() => setActiveTab('fees_details')}
              className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 border-l-4 cursor-pointer ${
                activeTab === 'fees_details'
                  ? 'bg-[#a03030] text-yellow-300 border-yellow-300 shadow-md'
                  : 'bg-[#c04040] text-white hover:bg-[#a03030] border-transparent'
              }`}
            >
              FEE PAYMENT DETAILS
            </button>
            <button
              onClick={() => setActiveTab('gatepass_request')}
              className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 border-l-4 cursor-pointer ${
                activeTab === 'gatepass_request'
                  ? 'bg-[#a03030] text-yellow-300 border-yellow-300 shadow-md'
                  : 'bg-[#c04040] text-white hover:bg-[#a03030] border-transparent'
              }`}
            >
              GATEPASS REQUEST
            </button>


          </aside>

          {/* Active Tab Workspace (lg:col-span-10) */}
          <div className="lg:col-span-10">
            {activeTab === 'home' && (
              <DashboardHome
                student={studentProfile}
                attendanceItems={attendanceItems}
                examPerformances={examPerformances}
                recentAttendance={defaultRecentAttendance}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'admin_panel' && username === 'admin' && (
              <AdminPanel
                student={studentProfile}
                setStudent={setStudentProfile}
                attendanceItems={attendanceItems}
                setAttendanceItems={setAttendanceItems}
                examPerformances={examPerformances}
                setExamPerformances={setExamPerformances}
                pendingFeeBalance={pendingFeeBalance}
                setPendingFeeBalance={setPendingFeeBalance}
                onResetToDefaults={handleResetToDefaults}
                gatepasses={gatepasses}
                setGatepasses={setGatepasses}
              />
            )}

            {activeTab === 'my_profile' && (
              <ProfileEdit
                student={studentProfile}
                onSave={handleSaveProfile}
                onBack={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'change_password' && (
              <ChangePassword
                onBack={() => setActiveTab('home')}
                isAdmin={username === 'admin'}
                onPasswordChanged={(newPass: string) => {
                  // Persist user-mode password so admin changes apply to user login
                  try {
                    localStorage.setItem('user_password', newPass);
                    // provide quick feedback via a small flag
                    localStorage.setItem('user_password_updated_at', new Date().toISOString());
                  } catch (e) {
                    // ignore
                  }
                }}
              />
            )}

            {activeTab === 'university_info' && (
              <UniversityCollegeInfo
                type="university"
                universityData={defaultUniversityInfo}
                collegeData={defaultCollegeInfo}
              />
            )}

            {activeTab === 'college_info' && (
              <UniversityCollegeInfo
                type="college"
                universityData={defaultUniversityInfo}
                collegeData={defaultCollegeInfo}
              />
            )}

            {activeTab === 'holiday_calendar' && (
              <HolidayCalendar
                holidays={defaultHolidays}
                vacations={defaultVacations}
              />
            )}

            {activeTab === 'attendance_report' && (
              <AttendanceReport 
                attendanceItems={attendanceItems} 
                isAdmin={username === 'admin'}
                onUpdateAttendanceItems={setAttendanceItems}
              />
            )}

            {/* Document Download Screen */}
            {activeTab === 'document_download' && (
              <DocumentDownload />
            )}

            {/* Certificate Download Screen */}
            {activeTab === 'certificate_download' && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-6 h-6 text-[#004a99]" /> Certificate Download
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">No certificates are currently available for download.</p>
                </div>
              </div>
            )}

            {/* Exam Schedule Screen */}
            {activeTab === 'exam_schedule' && (
              <div className="space-y-6">
                <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-6 h-6 text-[#004a99]" /> Upcoming Exam Schedule
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Timings and examination centers for upcoming assessments</p>
                  </div>
                </div>

                {/* Admin Management Section */}
                {username === 'admin' && (
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <Plus className="w-4 h-4 text-[#004a99]" />
                      <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">Add Exam to Schedule</h3>
                    </div>
                    
                    {examSchedSuccess && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded text-xs font-semibold animate-fade-in">
                        {examSchedSuccess}
                      </div>
                    )}

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!examSchedSubject || !examSchedDate || !examSchedTime || !examSchedRoom) {
                          alert('Please fill in all fields before adding the exam.');
                          return;
                        }
                        const newExam: ExamScheduleItem = {
                          id: Date.now().toString(),
                          subject: examSchedSubject.trim(),
                          date: examSchedDate.trim(),
                          time: examSchedTime.trim(),
                          room: examSchedRoom.trim(),
                          status: examSchedStatus
                        };
                        setExamSchedule(prev => [...prev, newExam]);
                        
                        // Clear fields
                        setExamSchedSubject('');
                        setExamSchedDate('');
                        setExamSchedTime('');
                        setExamSchedRoom('');
                        setExamSchedStatus('Admitted');
                        
                        setExamSchedSuccess('New exam added to the schedule successfully!');
                        setTimeout(() => setExamSchedSuccess(''), 3000);
                      }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-medium"
                    >
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Exam Subject / Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ophthalmology (Theory)"
                          value={examSchedSubject}
                          onChange={(e) => setExamSchedSubject(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white text-slate-800 rounded focus:border-[#004a99] focus:outline-none font-semibold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 12-10-2026"
                          value={examSchedDate}
                          onChange={(e) => setExamSchedDate(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white text-slate-800 rounded focus:border-[#004a99] focus:outline-none font-semibold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Session Time</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 10:00 AM To 01:00 PM"
                          value={examSchedTime}
                          onChange={(e) => setExamSchedTime(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white text-slate-800 rounded focus:border-[#004a99] focus:outline-none font-semibold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Room / Center</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Lecture Hall 2"
                          value={examSchedRoom}
                          onChange={(e) => setExamSchedRoom(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white text-slate-800 rounded focus:border-[#004a99] focus:outline-none font-semibold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Admit Status</label>
                        <select
                          value={examSchedStatus}
                          onChange={(e) => setExamSchedStatus(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white text-slate-800 rounded focus:border-[#004a99] focus:outline-none font-semibold text-xs h-[34px]"
                        >
                          <option value="Admitted">Admitted</option>
                          <option value="Pending">Pending</option>
                          <option value="Not Eligible">Not Eligible</option>
                        </select>
                      </div>
                      <div className="lg:col-span-5 flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#004a99] hover:bg-[#003366] text-white rounded font-bold uppercase tracking-wider text-[11px] transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add to Schedule
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                    <span>MBBS 3rd Prof Part-2 Assessments</span>
                    {username === 'admin' && (
                      <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded text-white uppercase font-bold animate-pulse">Admin Controls Active</span>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#4a7c9d] text-white font-semibold uppercase tracking-wider text-[11px] border-b border-slate-300">
                          <th className="px-4 py-3 border border-slate-200">Exam Subject</th>
                          <th className="px-4 py-3 border border-slate-200 text-center">Date</th>
                          <th className="px-4 py-3 border border-slate-200 text-center">Session Time</th>
                          <th className="px-4 py-3 border border-slate-200 text-center">Room / Center</th>
                          <th className="px-4 py-3 border border-slate-200 text-center">Admit Status</th>
                          {username === 'admin' && (
                            <th className="px-4 py-3 border border-slate-200 text-center w-20">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {examSchedule.length === 0 ? (
                          <tr>
                            <td colSpan={username === 'admin' ? 6 : 5} className="px-4 py-8 text-center text-slate-400 font-medium">
                              No exams scheduled.
                            </td>
                          </tr>
                        ) : (
                          examSchedule.map((exam, idx) => (
                            <tr key={exam.id || idx} className="hover:bg-slate-50 transition">
                              <td className="px-4 py-3 font-bold text-slate-800">{exam.subject}</td>
                              <td className="px-4 py-3 text-center text-slate-600 font-semibold">{exam.date}</td>
                              <td className="px-4 py-3 text-center text-slate-500 font-medium">{exam.time}</td>
                              <td className="px-4 py-3 text-center text-slate-700 font-semibold">{exam.room}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-0.5 font-bold text-[10px] rounded ${
                                  exam.status === 'Admitted' ? 'bg-emerald-100 text-emerald-800' :
                                  exam.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                  'bg-rose-100 text-rose-800'
                                }`}>
                                  {exam.status}
                                </span>
                              </td>
                              {username === 'admin' && (
                                <td className="px-4 py-3 text-center">
                                  <button
                                    onClick={() => {
                                      setExamSchedule(prev => prev.filter(item => (item.id ? item.id !== exam.id : prev.indexOf(item) !== idx)));
                                    }}
                                    title="Remove Exam"
                                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded transition cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4 mx-auto" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Exam Results Screen */}
            {activeTab === 'exam_results' && (
              <div className="space-y-6">
                <div className="border-b pb-4 flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle className="w-6 h-6 text-[#004a99]" /> Student Exam Results
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Official marks records and evaluation criteria for academic terms</p>
                  </div>
                  {username === 'admin' && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-extrabold uppercase rounded border border-yellow-200 tracking-wider">
                      ★ Admin Editing Access Enabled
                    </span>
                  )}
                </div>
                
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                    <span>Full Marks Summary</span>
                    {username === 'admin' && (
                      <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded font-bold">Double-click or click Edit below</span>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#4a7c9d] text-white font-semibold uppercase tracking-wider text-[11px] border-b border-slate-300">
                          <th className="px-4 py-3 border border-slate-200">Assessment Unit</th>
                          <th className="px-4 py-3 border border-slate-200 text-center">Max Marks</th>
                          <th className="px-4 py-3 border border-slate-200 text-center">Secured Marks</th>
                          <th className="px-4 py-3 border border-slate-200 text-center">Percentage Secured</th>
                          <th className="px-4 py-3 border border-slate-200 text-center">Status</th>
                          {username === 'admin' && (
                            <th className="px-4 py-3 border border-slate-200 text-center w-36">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {examPerformances.map((exam, idx) => {
                          const parts = exam.totalMarks.split('/');
                          const secured = parseInt(parts[0], 10) || 0;
                          const max = parseInt(parts[1], 10) || 100;
                          const status = exam.percentage >= 40 ? 'PASS' : 'FAIL';
                          const isEditing = appEditingExamIdx === idx;

                          if (username === 'admin' && isEditing) {
                            return (
                              <tr key={idx} className="bg-blue-50/70 font-semibold text-slate-800">
                                <td className="px-4 py-2 border border-slate-200">
                                  <input
                                    type="text"
                                    value={appEditExamName}
                                    onChange={(e) => setAppEditExamName(e.target.value)}
                                    className="w-full p-1 border border-blue-300 rounded font-bold bg-white text-slate-800 text-xs"
                                  />
                                </td>
                                <td className="px-4 py-2 text-center border border-slate-200">
                                  <input
                                    type="number"
                                    value={appEditExamTotal}
                                    onChange={(e) => setAppEditExamTotal(parseInt(e.target.value, 10) || 1)}
                                    className="w-20 p-1 border border-blue-300 rounded font-bold text-center bg-white text-xs inline-block"
                                  />
                                </td>
                                <td className="px-4 py-2 text-center border border-slate-200">
                                  <input
                                    type="number"
                                    value={appEditExamSecured}
                                    onChange={(e) => setAppEditExamSecured(parseInt(e.target.value, 10) || 0)}
                                    className="w-20 p-1 border border-blue-300 rounded font-bold text-center bg-white text-xs inline-block"
                                  />
                                </td>
                                <td className="px-4 py-2 text-center border border-slate-200 font-extrabold text-[#004a99]">
                                  {appEditExamTotal > 0 ? ((Math.min(appEditExamSecured, appEditExamTotal) / appEditExamTotal) * 100).toFixed(2) : '0.00'}%
                                </td>
                                <td className="px-4 py-2 text-center border border-slate-200">
                                  <span className={`px-2 py-0.5 font-bold text-[10px] rounded ${
                                    (appEditExamTotal > 0 ? (Math.min(appEditExamSecured, appEditExamTotal) / appEditExamTotal) * 100 : 0) >= 40 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {(appEditExamTotal > 0 ? (Math.min(appEditExamSecured, appEditExamTotal) / appEditExamTotal) * 100 : 0) >= 40 ? 'PASS' : 'FAIL'}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-center border border-slate-200">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (!appEditExamName.trim()) return;
                                        const sec = Math.max(0, appEditExamSecured);
                                        const tot = Math.max(1, appEditExamTotal);
                                        const finalSec = Math.min(sec, tot);
                                        const updated = [...examPerformances];
                                        updated[idx] = {
                                          examName: appEditExamName.trim(),
                                          totalMarks: `${finalSec}/${tot}`,
                                          percentage: Math.round((finalSec / tot) * 10000) / 100
                                        };
                                        setExamPerformances(updated);
                                        setAppEditingExamIdx(null);
                                      }}
                                      className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-[9px] uppercase tracking-wider cursor-pointer transition shadow-xs"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setAppEditingExamIdx(null)}
                                      className="px-2 py-1 bg-slate-500 hover:bg-slate-600 text-white rounded font-bold text-[9px] uppercase tracking-wider cursor-pointer transition shadow-xs"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          }

                          return (
                            <tr key={idx} className={idx % 2 === 1 ? "bg-slate-50/55 hover:bg-slate-100/60 transition" : "hover:bg-slate-50 transition"}>
                              <td className="px-4 py-3 font-bold text-slate-800">{exam.examName}</td>
                              <td className="px-4 py-3 text-center text-slate-500 font-semibold">{max}</td>
                              <td className="px-4 py-3 text-center font-bold text-slate-700">{secured}</td>
                              <td className="px-4 py-3 text-center font-bold text-[#004a99]">{exam.percentage.toFixed(2)}%</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-0.5 font-bold text-[10px] rounded ${
                                  status === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {status}
                                </span>
                              </td>
                              {username === 'admin' && (
                                <td className="px-4 py-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAppEditingExamIdx(idx);
                                      setAppEditExamName(exam.examName);
                                      setAppEditExamSecured(secured);
                                      setAppEditExamTotal(max);
                                    }}
                                    className="px-2.5 py-1 bg-[#004a99] hover:bg-blue-800 text-white font-extrabold text-[10px] uppercase rounded tracking-wider transition cursor-pointer flex items-center gap-1 inline-flex"
                                  >
                                    <Edit2 className="w-3 h-3" /> Edit Marks
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {username === 'admin' && (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!appNewExamName.trim()) return;
                      const sec = Math.max(0, appNewExamSecured);
                      const tot = Math.max(1, appNewExamTotal);
                      const finalSec = Math.min(sec, tot);
                      
                      const newExam = {
                        examName: appNewExamName.trim(),
                        totalMarks: `${finalSec}/${tot}`,
                        percentage: Math.round((finalSec / tot) * 10000) / 100
                      };
                      
                      setExamPerformances(prev => [...prev, newExam]);
                      setAppNewExamName('');
                      setAppNewExamSecured(80);
                      setAppNewExamTotal(100);
                      setAppNewExamSuccess('Assessment unit successfully added to results!');
                      setTimeout(() => setAppNewExamSuccess(''), 4000);
                    }}
                    className="bg-slate-50 border border-slate-200 p-5 rounded-lg space-y-4 shadow-xs"
                  >
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Plus className="w-4 h-4 text-[#004a99]" /> Add Another Student Exam Result
                      </h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
                        Admin Tool
                      </span>
                    </div>

                    {appNewExamSuccess && (
                      <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-3 rounded border border-emerald-200">
                        ✓ {appNewExamSuccess}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Assessment Unit Name</label>
                        <input
                          type="text"
                          required
                          value={appNewExamName}
                          onChange={(e) => setAppNewExamName(e.target.value)}
                          placeholder="e.g. End Semester Theory Exam"
                          className="w-full p-2.5 border border-slate-300 rounded bg-white font-bold text-slate-800 focus:ring-1 focus:ring-[#004a99] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Secured Marks</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={appNewExamSecured}
                          onChange={(e) => setAppNewExamSecured(parseInt(e.target.value, 10) || 0)}
                          className="w-full p-2.5 border border-slate-300 rounded bg-white font-bold text-slate-800 focus:ring-1 focus:ring-[#004a99] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Total/Max Marks</label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={appNewExamTotal}
                          onChange={(e) => setAppNewExamTotal(parseInt(e.target.value, 10) || 100)}
                          className="w-full p-2.5 border border-slate-300 rounded bg-white font-bold text-slate-800 focus:ring-1 focus:ring-[#004a99] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Will be computed as: <strong className="text-slate-600">{(Math.round((Math.min(appNewExamSecured, appNewExamTotal) / Math.max(1, appNewExamTotal)) * 10000) / 100).toFixed(2)}%</strong> (Status: <strong className="text-slate-600">{(Math.min(appNewExamSecured, appNewExamTotal) / Math.max(1, appNewExamTotal)) >= 0.4 ? 'PASS' : 'FAIL'}</strong>)
                      </span>
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-[#004a99] hover:bg-blue-800 text-white font-extrabold text-[10px] uppercase rounded tracking-wider flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add This Assessment Record
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Time Table Screen */}
            {activeTab === 'timetable' && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-6 h-6 text-[#004a99]" /> Clinical &amp; Lecture Time Table
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Weekly schedule of clinical attachments, practical diagnostics and academic lectures</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                    <span>Regular Weekly Plan - MBBS Term II</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">Current Academic Year 2026/27</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#4a7c9d] text-white font-semibold uppercase text-[10px] border-b">
                          <th className="px-3 py-3 border border-slate-200 text-left">Day</th>
                          <th className="px-3 py-3 border border-slate-200 text-center w-40">09:00 AM - 12:00 PM</th>
                          <th className="px-3 py-3 border border-slate-200 text-center w-24">12:00 - 01:00 PM</th>
                          <th className="px-3 py-3 border border-slate-200 text-center w-40">01:00 PM - 02:30 PM</th>
                          <th className="px-3 py-3 border border-slate-200 text-center w-40">02:30 PM - 04:00 PM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                        {[
                          { day: 'Monday', slot1: 'OBG Practical Posting (Maternity Block)', lunch: 'LUNCH', slot2: 'ENT Theory (Lecture Hall 1)', slot3: 'Ophthalmology Clinical Case' },
                          { day: 'Tuesday', slot1: 'Pediatrics Practical Attachment (Ward 5)', lunch: 'LUNCH', slot2: 'Medicine SGD (Seminar Room B)', slot3: 'General Surgery Theory' },
                          { day: 'Wednesday', slot1: 'Ophthalmology Practical (Case Studies)', lunch: 'LUNCH', slot2: 'OBG Theory Lecture (LH-2)', slot3: 'ENT Ward Case Study' },
                          { day: 'Thursday', slot1: 'Surgery Clinical Posting (Theatre block)', lunch: 'LUNCH', slot2: 'Medicine SGD (LH-1)', slot3: 'Pediatrics Special Lecture' },
                          { day: 'Friday', slot1: 'OBG Practical Posting (PostNatal OPD)', lunch: 'LUNCH', slot2: 'Ophthalmology Theory (LH-1)', slot3: 'Community Med Practical' },
                          { day: 'Saturday', slot1: 'ENT Practical Posting (OPD Block A)', lunch: 'LUNCH', slot2: 'Academic Seminar (Audio Visual)', slot3: 'Weekly Assessment Check' },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition text-center">
                            <td className="px-3 py-4 font-bold text-slate-800 text-left bg-slate-50">{row.day}</td>
                            <td className="px-3 py-4 text-emerald-700 bg-emerald-50/20">{row.slot1}</td>
                            <td className="px-3 py-4 text-slate-400 font-normal bg-slate-100">{row.lunch}</td>
                            <td className="px-3 py-4 text-blue-700 bg-blue-50/10">{row.slot2}</td>
                            <td className="px-3 py-4 text-orange-700 bg-orange-50/10">{row.slot3}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Fee Payment Details Screen */}
            {activeTab === 'fees_details' && (
              <FeePaymentDetailsPortal
                student={studentProfile}
                onUpdateStudent={setStudentProfile}
                isAdmin={username === 'admin'}
                feesHistory={feesHistory}
                pendingFeeBalance={pendingFeeBalance}
                onPayNow={() => setShowPaymentModal(true)}
              />
            )}

            {/* Gatepass Request Screen */}
            {activeTab === 'gatepass_request' && (
              <div className="space-y-6">
                <div className="border-b pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                      <Send className="w-6 h-6 text-[#2E7D32]" /> Gatepass Request Panel
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Submit digital gatepass requests for leaving college or hostel campus bounds</p>
                  </div>
                </div>

                {gpSuccess && (
                  <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs font-semibold rounded">
                    {gpSuccess}
                  </div>
                )}

                {/* ERP Styled Form */}
                <div className="bg-white border border-slate-300 rounded shadow-sm max-w-4xl mx-auto overflow-hidden text-sm">
                  {/* Month Selector Section */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Month</label>
                      <input
                        type="text"
                        readOnly
                        value="June-2026"
                        className="w-40 text-center p-1.5 border border-slate-300 rounded text-xs bg-white text-slate-700 font-bold focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      className="mt-3 bg-[#2D7A29] text-white font-bold text-xs px-5 py-1.5 rounded border border-[#1B5E20] shadow-sm cursor-default"
                    >
                      Gatepass Request
                    </button>
                  </div>

                  {/* Section header banner */}
                  <div className="bg-[#2D7A29] h-2.5 w-full"></div>

                  <form onSubmit={handleAddGatepass} className="p-6 space-y-5 bg-white">
                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      {/* Name */}
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <label className="w-full md:w-32 md:text-right text-xs font-bold text-slate-600">
                          Name
                        </label>
                        <input
                          type="text"
                          value={gpStudentName}
                          onChange={(e) => setGpStudentName(e.target.value)}
                          className="flex-1 p-2 border border-slate-300 rounded text-xs text-slate-800 bg-slate-50 font-medium"
                        />
                      </div>

                      {/* Mobile No */}
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <label className="w-full md:w-32 md:text-right text-xs font-bold text-slate-600">
                          MobileNo.<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={gpMobileNo}
                          onChange={(e) => setGpMobileNo(e.target.value)}
                          className="flex-1 p-2 border border-slate-300 rounded text-xs text-slate-800 font-medium"
                        />
                      </div>

                      {/* Course/Term */}
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <label className="w-full md:w-32 md:text-right text-xs font-bold text-slate-600">
                          Course/term
                        </label>
                        <input
                          type="text"
                          value={gpCourse}
                          onChange={(e) => setGpCourse(e.target.value)}
                          className="flex-1 p-2 border border-slate-300 rounded text-xs text-slate-800 bg-slate-50 font-medium"
                        />
                      </div>

                      {/* Hostel */}
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <label className="w-full md:w-32 md:text-right text-xs font-bold text-slate-600">
                          Hostel
                        </label>
                        <input
                          type="text"
                          value={gpHostel}
                          onChange={(e) => setGpHostel(e.target.value)}
                          className="flex-1 p-2 border border-slate-300 rounded text-xs text-slate-800 bg-slate-50 font-medium"
                        />
                      </div>

                      {/* Apply For */}
                      <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row md:items-start gap-2">
                        <label className="w-full md:w-32 md:text-right text-xs font-bold text-slate-600 shrink-0 pt-1">
                          Apply for
                        </label>
                        <div className="flex flex-col md:flex-row gap-4 text-xs font-medium text-slate-700">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="radio"
                              name="applyFor"
                              checked={gpApplyFor === 'day'}
                              onChange={() => setGpApplyFor('day')}
                              className="w-4 h-4 text-[#2E7D32] focus:ring-[#2E7D32] border-slate-300"
                            />
                            <span>Day gate pass (for same-day outing)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="radio"
                              name="applyFor"
                              checked={gpApplyFor === 'hostel'}
                              onChange={() => setGpApplyFor('hostel')}
                              className="w-4 h-4 text-[#2E7D32] focus:ring-[#2E7D32] border-slate-300"
                            />
                            <span>Hostel leave (for more than 1 day)</span>
                          </label>
                        </div>
                      </div>

                      {/* Request Date */}
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <label className="w-full md:w-32 md:text-right text-xs font-bold text-slate-600">
                          Request date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={gpRequestDate}
                          onChange={(e) => setGpRequestDate(e.target.value)}
                          placeholder="DD/MM/YYYY"
                          className="flex-1 p-2 border border-slate-300 rounded text-xs text-slate-800 font-medium"
                        />
                      </div>

                      {/* Request Time (choose with clock pickers) */}
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <label className="w-full md:w-32 md:text-right text-xs font-bold text-slate-600">
                          Request time
                        </label>
                        <div className="flex items-center gap-2 w-full">
                          <select
                            value={gpRequestTimeStartHour}
                            onChange={(e) => setGpRequestTimeStartHour(e.target.value)}
                            className="p-2 border border-slate-300 rounded text-xs bg-white"
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                              <option key={h} value={String(h)}>{String(h)}</option>
                            ))}
                          </select>
                          <select
                            value={gpRequestTimeStartMin}
                            onChange={(e) => setGpRequestTimeStartMin(e.target.value)}
                            className="p-2 border border-slate-300 rounded text-xs bg-white"
                          >
                            {['00','05','10','15','20','25','30','35','40','45','50','55'].map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <select
                            value={gpRequestTimeStartPeriod}
                            onChange={(e) => setGpRequestTimeStartPeriod(e.target.value as 'AM' | 'PM')}
                            className="p-2 border border-slate-300 rounded text-xs bg-white"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                          <span className="text-xs text-slate-600">to</span>
                          <select
                            value={gpRequestTimeEndHour}
                            onChange={(e) => setGpRequestTimeEndHour(e.target.value)}
                            className="p-2 border border-slate-300 rounded text-xs bg-white"
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                              <option key={h} value={String(h)}>{String(h)}</option>
                            ))}
                          </select>
                          <select
                            value={gpRequestTimeEndMin}
                            onChange={(e) => setGpRequestTimeEndMin(e.target.value)}
                            className="p-2 border border-slate-300 rounded text-xs bg-white"
                          >
                            {['00','05','10','15','20','25','30','35','40','45','50','55'].map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <select
                            value={gpRequestTimeEndPeriod}
                            onChange={(e) => setGpRequestTimeEndPeriod(e.target.value as 'AM' | 'PM')}
                            className="p-2 border border-slate-300 rounded text-xs bg-white"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row md:items-start gap-2">
                        <label className="w-full md:w-32 md:text-right text-xs font-bold text-slate-600 shrink-0 pt-2">
                          Reason
                        </label>
                        <textarea
                          rows={4}
                          value={gpReason}
                          onChange={(e) => setGpReason(e.target.value)}
                          placeholder="Specify reason for gatepass/leave request"
                          className="flex-1 p-2.5 border border-slate-300 rounded text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                        />
                      </div>
                    </div>

                    {/* Action Buttons Centered */}
                    <div className="flex justify-center gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="submit"
                        className="bg-[#2D7A29] hover:bg-[#1B5E20] text-white font-bold text-xs px-6 py-2 rounded transition shadow-sm cursor-pointer"
                      >
                        Request for Approval
                      </button>
                      <button
                        type="button"
                        onClick={handleResetGatepassForm}
                        className="bg-[#2D7A29] hover:bg-[#1B5E20] text-white font-bold text-xs px-6 py-2 rounded transition shadow-sm cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>

                {/* Gatepass Request Status History */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col max-w-4xl mx-auto">
                  <div className="bg-[#2D7A29] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex justify-between items-center gap-2">
                    <span>Gatepass Request Status History</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded font-bold">Warden Sim Active</span>
                    </div>
                  </div>

                  {/* Warden Sim Section */}
                  {username === 'admin' && gatepasses.some(p => p.status === 'Pending') && (
                    <div className="bg-amber-50/50 border-b p-4 text-xs space-y-2">
                      <p className="font-extrabold text-[#2D7A29] uppercase text-[10px] tracking-wide flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span> 
                        Hostel Warden Quick-Decision Simulation Desk
                      </p>
                      <p className="text-[10px] text-slate-500">As Warden, you can instantly approve or reject the student's pending requests:</p>
                      <div className="space-y-1.5">
                        {gatepasses.filter(p => p.status === 'Pending').map(p => (
                          <div key={p.id} className="bg-white border rounded p-2 flex items-center justify-between text-[11px] shadow-xs">
                            <div className="truncate max-w-[60%]">
                              <span className="font-bold text-slate-800 block truncate">"{(p.reason)}"</span>
                              <span className="text-[9px] text-slate-400 block mt-0.5">Out: {new Date(p.outDate).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setGatepasses(prev => prev.map(item => item.id === p.id ? { ...item, status: 'Approved' } : item));
                                  alert('Warden action simulated: Gatepass has been APPROVED.');
                                }}
                                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white font-bold text-[9px] rounded uppercase cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setGatepasses(prev => prev.map(item => item.id === p.id ? { ...item, status: 'Rejected' } : item));
                                  alert('Warden action simulated: Gatepass has been REJECTED.');
                                }}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[9px] rounded uppercase cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#F8FAFC] text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                          <th className="px-4 py-3 border border-slate-200">Date Sent</th>
                          <th className="px-4 py-3 border border-slate-200">Reason</th>
                          <th className="px-4 py-3 border border-slate-200">Out / In Timings</th>
                          <th className="px-4 py-3 border border-slate-200 text-center">Status</th>
                          {username === 'admin' && (
                            <th className="px-4 py-3 border border-slate-200 text-center">Action</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {gatepasses.length === 0 && (
                          <tr>
                            <td colSpan={username === 'admin' ? 5 : 4} className="px-4 py-8 text-center text-slate-400 font-medium">
                              No gatepass requests found.
                            </td>
                          </tr>
                        )}
                        {gatepasses.map((pass) => (
                          <tr key={pass.id} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3 font-semibold text-slate-500">{pass.timestamp}</td>
                            <td className="px-4 py-3 font-bold text-slate-800">{pass.reason}</td>
                            <td className="px-4 py-3 text-slate-600 font-medium text-[10px]">
                              <div className="text-red-600">OUT: {new Date(pass.outDate).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</div>
                              <div className="text-green-600">IN: {new Date(pass.inDate).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className={`px-2 py-0.5 font-bold text-[10px] rounded ${
                                  pass.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                  pass.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {pass.status}
                                </span>
                                {pass.status === 'Pending' && (
                                  <button
                                    onClick={() => {
                                      setGatepasses(prev => prev.filter(p => p.id !== pass.id));
                                      alert('Request successfully cancelled.');
                                    }}
                                    className="text-[9px] text-red-500 hover:underline font-bold mt-1 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                            {username === 'admin' && (
                              <td className="px-4 py-3 text-center">
                                <div className="flex justify-center">
                                  {gpDeletingId === pass.id ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setGatepasses(prev => prev.filter(p => p.id !== pass.id));
                                        setGpDeletingId(null);
                                      }}
                                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] rounded uppercase tracking-wider animate-pulse cursor-pointer flex items-center gap-1 shadow"
                                    >
                                      <Trash2 className="w-3 h-3" /> Confirm?
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setGpDeletingId(pass.id)}
                                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors inline-flex items-center justify-center cursor-pointer"
                                      title="Delete Request"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#004a99] text-white border-t-2 border-green-500 py-3 mt-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-200">
          <div>
            © Copyright 2012 <span className="text-green-400 font-semibold">Campus Medicine</span>. All Rights Reserved. Application designed and developed by <span className="text-green-400 font-semibold">Wonesty</span>.
          </div>
          <div className="mt-2 md:mt-0">Best Viewed at 1024 x 768 Resolution</div>
        </div>
      </footer>

      {/* Interactive Download Progress Overlay */}
      {downloadingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden">
            <div className="bg-[#004a99] text-white px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> ERP Secure Downloader
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-800 line-clamp-2">{downloadingDoc.name}</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">CAMPUS SYSTEM INTEGRATED SERVICE</p>
              </div>

              {/* Progress Bar container */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span className="truncate max-w-[80%]">{downloadingDoc.status}</span>
                  <span>{downloadingDoc.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded border overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${downloadingDoc.progress}%` }}
                  />
                </div>
              </div>

              <div className="text-[9px] text-slate-400 leading-relaxed text-center">
                Please do not close this window or navigate away while the encrypted token stream is compiling.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Fee Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-[#004a99] text-white px-5 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-400" />
                <span className="text-xs font-black uppercase tracking-wider">Campus Secure Payment Gateway</span>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-white hover:text-slate-300 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {paymentStep === 'details' && (
              <div className="p-6 space-y-5 text-xs">
                <div className="bg-slate-50 border p-3 rounded text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Invoice Ref:</span>
                    <span className="font-mono text-slate-800">INV/2026/0942</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Student Name:</span>
                    <span className="font-bold text-slate-800">{studentProfile.name}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-bold text-slate-800">Total Payable Amount:</span>
                    <span className="font-black text-red-600 text-sm">₹ {pendingFeeBalance.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Choose Payment Method */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Select Gateway Option</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 border rounded font-bold flex flex-col items-center gap-1 cursor-pointer ${
                        paymentMethod === 'upi' ? 'border-[#004a99] bg-blue-50/50 text-[#004a99]' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs">UPI QR / ID</span>
                      <span className="text-[9px] text-slate-400 font-normal">GPay, PhonePe, UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 border rounded font-bold flex flex-col items-center gap-1 cursor-pointer ${
                        paymentMethod === 'card' ? 'border-[#004a99] bg-blue-50/50 text-[#004a99]' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs">Debit/Credit Card</span>
                      <span className="text-[9px] text-slate-400 font-normal">Visa, MasterCard, Rupay</span>
                    </button>
                  </div>
                </div>

                {/* Inputs based on selection */}
                {paymentMethod === 'upi' ? (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Enter Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      value={upiIdInput}
                      onChange={(e) => setUpiIdInput(e.target.value)}
                      placeholder="username@bank"
                      className="w-full p-2.5 border border-slate-300 rounded font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumberInput}
                        onChange={(e) => setCardNumberInput(e.target.value)}
                        placeholder="4321 8890 2234 1152"
                        className="w-full p-2.5 border border-slate-300 rounded font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiryInput}
                          onChange={(e) => setCardExpiryInput(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full p-2.5 border border-slate-300 rounded font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvvInput}
                          onChange={(e) => setCardCvvInput(e.target.value)}
                          placeholder="•••"
                          className="w-full p-2.5 border border-slate-300 rounded font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentStep('processing');
                    setTimeout(() => {
                      setPaymentStep('success');
                      // Add payment transaction to history list
                      const newReceiptNo = `FEE/2026/0${Math.floor(100 + Math.random() * 900)}`;
                      setFeesHistory(prev => [
                        {
                          receiptNo: newReceiptNo,
                          date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
                          head: 'Outstanding Books & Laboratory Dues',
                          amount: `₹ ${pendingFeeBalance.toLocaleString('en-IN')}`,
                          status: 'Paid',
                          method: paymentMethod === 'upi' ? `UPI ID: ${upiIdInput}` : `Debit Card (ending in ${cardNumberInput.slice(-4)})`
                        },
                        ...prev
                      ]);
                      setPendingFeeBalance(0);
                    }, 2000);
                  }}
                  className="w-full py-3 bg-[#22c55e] hover:bg-green-700 text-white font-extrabold text-xs uppercase tracking-wider rounded shadow cursor-pointer transition-colors"
                >
                  Authorize Payment of ₹ {pendingFeeBalance.toLocaleString('en-IN')}
                </button>
              </div>
            )}

            {paymentStep === 'processing' && (
              <div className="p-8 text-center space-y-5 text-xs">
                <div className="flex justify-center">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <RefreshCw className="w-12 h-12 text-[#004a99] animate-spin" />
                    <CreditCard className="w-5 h-5 text-[#2c8ed6] absolute" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">Processing Secure Payment...</h4>
                  <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wide">Connecting to Bank Host Server</p>
                  <p className="text-slate-500 max-w-xs mx-auto leading-relaxed pt-2">
                    Please do not refresh this page, close this popup, or click the back button. We are validating credentials and checking fund authorizations securely.
                  </p>
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="p-8 text-center space-y-5 text-xs">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-50 text-green-500 border border-green-200 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-10 h-10 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base text-green-600 uppercase">Payment Completed Successfully!</h4>
                  <p className="text-slate-400 uppercase text-[9px] font-bold tracking-wider">Transaction ID: TXN94281948201A</p>
                  <p className="text-slate-600 max-w-xs mx-auto leading-relaxed pt-3">
                    Your outstanding balance has been cleared, and a digital receipt has been generated under your fee history record table below.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentStep('details');
                    }}
                    className="px-6 py-2 bg-[#004a99] hover:bg-blue-800 text-white font-bold rounded uppercase tracking-wider text-[10px] cursor-pointer"
                  >
                    Close Receipt Window
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
