import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { StudentProfile, AttendanceItem, ExamPerformance } from '../types';
import { initialStudentProfile, defaultAttendanceItems, defaultExamPerformances } from '../data';

export interface SaveManagerData {
  studentProfile: StudentProfile;
  attendanceItems: AttendanceItem[];
  examPerformances: ExamPerformance[];
  gatepasses: any[];
  pendingFeeBalance: number;
}

interface SaveManagerContextType {
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  error: string | null;
  success: string | null;
  draftData: SaveManagerData;
  liveData: SaveManagerData;
  startEditing: () => void;
  updateStudent: (student: StudentProfile) => void;
  updateAttendanceItems: (items: AttendanceItem[]) => void;
  updateExamPerformances: (exams: ExamPerformance[]) => void;
  updateGatepasses: (passes: any[] | ((prev: any[]) => any[])) => void;
  updatePendingFeeBalance: (fee: number) => void;
  saveChanges: () => Promise<boolean>;
  cancelChanges: () => void;
  syncLiveStateFromServer: (serverData: Partial<SaveManagerData>) => void;
  setSuccess: (msg: string | null) => void;
  setError: (msg: string | null) => void;
}

const SaveManagerContext = createContext<SaveManagerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  studentProfile: 'student_profile',
  attendanceItems: 'attendance_items',
  examPerformances: 'exam_performances',
  gatepassList: 'gatepass_list',
  pendingFeeBalance: 'pending_fee_balance',
};

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
    // ignore
  }
};

const initialLiveData: SaveManagerData = {
  studentProfile: readStoredValue<StudentProfile>(STORAGE_KEYS.studentProfile, initialStudentProfile),
  attendanceItems: readStoredValue<AttendanceItem[]>(STORAGE_KEYS.attendanceItems, defaultAttendanceItems),
  examPerformances: readStoredValue<ExamPerformance[]>(STORAGE_KEYS.examPerformances, defaultExamPerformances),
  gatepasses: readStoredValue<any[]>(STORAGE_KEYS.gatepassList, [
    { id: 1, reason: 'Weekend Outing to Home', outDate: '2026-06-30T16:00', inDate: '2026-07-02T18:00', status: 'Approved', timestamp: '26/06/2026' },
    { id: 2, reason: 'Medical Checkup in Rohtak', outDate: '2026-06-25T10:00', inDate: '2026-06-25T14:00', status: 'Approved', timestamp: '24/06/2026' }
  ]),
  pendingFeeBalance: (() => {
    const saved = localStorage.getItem(STORAGE_KEYS.pendingFeeBalance);
    return saved ? parseInt(saved, 10) : 5000;
  })(),
};

export const SaveManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [liveData, setLiveData] = useState<SaveManagerData>(initialLiveData);
  const [draftData, setDraftData] = useState<SaveManagerData>(initialLiveData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Helper deep-cloning function to ensure no reference leaks
  const cloneData = (data: SaveManagerData): SaveManagerData => {
    return JSON.parse(JSON.stringify(data));
  };

  // Check if draft has any differences with liveData
  const hasUnsavedChanges = isEditing && JSON.stringify(draftData) !== JSON.stringify(liveData);

  const startEditing = useCallback(() => {
    setDraftData(cloneData(liveData));
    setIsEditing(true);
    setError(null);
  }, [liveData]);

  const updateStudent = useCallback((student: StudentProfile) => {
    if (!isEditing) setIsEditing(true);
    setDraftData(prev => ({ ...prev, studentProfile: JSON.parse(JSON.stringify(student)) }));
  }, [isEditing]);

  const updateAttendanceItems = useCallback((items: AttendanceItem[]) => {
    if (!isEditing) setIsEditing(true);
    setDraftData(prev => ({ ...prev, attendanceItems: JSON.parse(JSON.stringify(items)) }));
  }, [isEditing]);

  const updateExamPerformances = useCallback((exams: ExamPerformance[]) => {
    if (!isEditing) setIsEditing(true);
    setDraftData(prev => ({ ...prev, examPerformances: JSON.parse(JSON.stringify(exams)) }));
  }, [isEditing]);

  const updateGatepasses = useCallback((passesOrUpdater: any[] | ((prev: any[]) => any[])) => {
    if (!isEditing) setIsEditing(true);
    setDraftData(prev => {
      const nextPasses = typeof passesOrUpdater === 'function' 
        ? passesOrUpdater(prev.gatepasses)
        : passesOrUpdater;
      return { ...prev, gatepasses: JSON.parse(JSON.stringify(nextPasses)) };
    });
  }, [isEditing]);

  const updatePendingFeeBalance = useCallback((fee: number) => {
    if (!isEditing) setIsEditing(true);
    setDraftData(prev => ({ ...prev, pendingFeeBalance: fee }));
  }, [isEditing]);

  const syncLiveStateFromServer = useCallback((serverData: Partial<SaveManagerData>) => {
    setLiveData(prev => {
      const updated = {
        studentProfile: serverData.studentProfile ?? prev.studentProfile,
        attendanceItems: serverData.attendanceItems ?? prev.attendanceItems,
        examPerformances: serverData.examPerformances ?? prev.examPerformances,
        gatepasses: serverData.gatepasses ?? prev.gatepasses,
        pendingFeeBalance: typeof serverData.pendingFeeBalance === 'number' ? serverData.pendingFeeBalance : prev.pendingFeeBalance,
      };
      
      // If we are NOT in edit mode, sync the draft state as well
      if (!isEditing) {
        setDraftData(JSON.parse(JSON.stringify(updated)));
      }
      return updated;
    });
  }, [isEditing]);

  const cancelChanges = useCallback(() => {
    setDraftData(cloneData(liveData));
    setIsEditing(false);
    setError(null);
  }, [liveData]);

  const saveChanges = useCallback(async (): Promise<boolean> => {
    if (isSaving) return false;
    
    // Simple verification & validation
    if (!draftData.studentProfile || !draftData.studentProfile.name.trim()) {
      setError('Student name cannot be empty.');
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        state: {
          studentProfile: draftData.studentProfile,
          attendanceItems: draftData.attendanceItems,
          examPerformances: draftData.examPerformances,
          gatepasses: draftData.gatepasses,
          pendingFeeBalance: draftData.pendingFeeBalance,
          isAdmin: true,
          username: 'admin',
        }
      };

      const response = await fetch('/api/state', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed with server status ${response.status}`);
      }

      const updatedServerState = await response.json();
      
      // Update our live context state and write to localStorage
      setLiveData(cloneData(draftData));
      
      writeStoredValue(STORAGE_KEYS.studentProfile, draftData.studentProfile);
      writeStoredValue(STORAGE_KEYS.attendanceItems, draftData.attendanceItems);
      writeStoredValue(STORAGE_KEYS.examPerformances, draftData.examPerformances);
      writeStoredValue(STORAGE_KEYS.gatepassList, draftData.gatepasses);
      writeStoredValue(STORAGE_KEYS.pendingFeeBalance, draftData.pendingFeeBalance);

      setIsEditing(false);
      setSuccess('Changes Saved Successfully');
      
      // Clear success notification after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      return true;
    } catch (err: any) {
      console.error('Error saving state in SaveManager:', err);
      setError(`Save failed: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [draftData, isSaving]);

  // Handle browser close / reload when changes are unsaved
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved administrative changes in your draft. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return (
    <SaveManagerContext.Provider
      value={{
        isEditing,
        hasUnsavedChanges,
        isSaving,
        error,
        success,
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
        setSuccess,
        setError,
      }}
    >
      {children}
    </SaveManagerContext.Provider>
  );
};

export const useSaveManager = () => {
  const context = useContext(SaveManagerContext);
  if (!context) {
    throw new Error('useSaveManager must be used within a SaveManagerProvider');
  }
  return context;
};
