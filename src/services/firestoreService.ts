import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  DocumentData,
  Firestore
} from 'firebase/firestore';
import { db, auth } from '../firebase';

// ==========================================
// Error Handling conforming to the skill
// ==========================================

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ==========================================
// Type Definitions
// ==========================================

export interface Statistic {
  id?: string;
  name: string;
  value: string;
  icon?: string;
  category?: string;
  updatedAt?: string;
}

export interface Course {
  id?: string;
  name: string;
  duration: string;
  intake: number;
  eligibility: string;
  fee: string;
  category: 'UG' | 'PG' | 'Diploma';
  description?: string;
}

export interface Department {
  id?: string;
  name: string;
  headOfDepartment: string;
  establishedYear?: string;
  email?: string;
  phone?: string;
  location?: string;
  description?: string;
}

export interface Faculty {
  id?: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  email?: string;
  experience?: string;
  status?: 'Active' | 'On Leave';
}

export interface Notice {
  id?: string;
  title: string;
  content: string;
  date: string;
  category: 'Academic' | 'Administrative' | 'General' | 'Event';
  isUrgent?: boolean;
}

export interface Admission {
  id?: string;
  studentName: string;
  course: string;
  email: string;
  phone: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  message?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'Read' | 'Unread';
}

// ==========================================
// Reusable Generic CRUD Helpers
// ==========================================

export async function fetchCollection<T>(collectionName: string, orderField?: string, direction: 'asc' | 'desc' = 'asc'): Promise<T[]> {
  try {
    console.log(`[CLIENT FIRESTORE READ START] List collection: "${collectionName}"${orderField ? `, ordered by: "${orderField}" (${direction})` : ''}`);
    const colRef = collection(db, collectionName);
    const q = orderField ? query(colRef, orderBy(orderField, direction)) : colRef;
    const snapshot = await getDocs(q);
    console.log(`[CLIENT FIRESTORE READ SUCCESS] List collection: "${collectionName}". Retrieved ${snapshot.size} documents.`);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as unknown as T));
  } catch (error) {
    console.error(`[CLIENT FIRESTORE READ ERROR] List collection: "${collectionName}" failed.`, error);
    handleFirestoreError(error, OperationType.LIST, collectionName);
    throw error;
  }
}

export async function fetchDocumentById<T>(collectionName: string, id: string): Promise<T | null> {
  try {
    console.log(`[CLIENT FIRESTORE READ START] Get document: "${collectionName}/${id}"`);
    const docRef = doc(db, collectionName, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      console.log(`[CLIENT FIRESTORE READ SUCCESS] Get document: "${collectionName}/${id}" exists.`);
      return { id: snapshot.id, ...snapshot.data() } as unknown as T;
    }
    console.log(`[CLIENT FIRESTORE READ SUCCESS] Get document: "${collectionName}/${id}" does NOT exist.`);
    return null;
  } catch (error) {
    console.error(`[CLIENT FIRESTORE READ ERROR] Get document: "${collectionName}/${id}" failed.`, error);
    handleFirestoreError(error, OperationType.GET, `${collectionName}/${id}`);
    throw error;
  }
}

export async function addDocumentToCollection<T extends object>(collectionName: string, data: T): Promise<string> {
  try {
    console.log(`[CLIENT FIRESTORE WRITE START] Add document to collection: "${collectionName}"`);
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, data);
    console.log(`[CLIENT FIRESTORE WRITE SUCCESS] Add document to collection: "${collectionName}". Created doc ID: "${docRef.id}"`);
    return docRef.id;
  } catch (error) {
    console.error(`[CLIENT FIRESTORE WRITE ERROR] Add document to collection: "${collectionName}" failed.`, error);
    handleFirestoreError(error, OperationType.CREATE, collectionName);
    throw error;
  }
}

export async function setDocumentWithCustomId<T extends object>(collectionName: string, id: string, data: T): Promise<void> {
  try {
    console.log(`[CLIENT FIRESTORE WRITE START] Set document with custom ID: "${collectionName}/${id}"`);
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data);
    console.log(`[CLIENT FIRESTORE WRITE SUCCESS] Set document with custom ID: "${collectionName}/${id}" succeeded.`);
  } catch (error) {
    console.error(`[CLIENT FIRESTORE WRITE ERROR] Set document with custom ID: "${collectionName}/${id}" failed.`, error);
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${id}`);
    throw error;
  }
}

export async function updateDocumentInCollection<T extends object>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
  try {
    console.log(`[CLIENT FIRESTORE WRITE START] Update document: "${collectionName}/${id}"`);
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data as DocumentData);
    console.log(`[CLIENT FIRESTORE WRITE SUCCESS] Update document: "${collectionName}/${id}" succeeded.`);
  } catch (error) {
    console.error(`[CLIENT FIRESTORE WRITE ERROR] Update document: "${collectionName}/${id}" failed.`, error);
    handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${id}`);
    throw error;
  }
}

export async function deleteDocumentFromCollection(collectionName: string, id: string): Promise<void> {
  try {
    console.log(`[CLIENT FIRESTORE WRITE START] Delete document: "${collectionName}/${id}"`);
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    console.log(`[CLIENT FIRESTORE WRITE SUCCESS] Delete document: "${collectionName}/${id}" succeeded.`);
  } catch (error) {
    console.error(`[CLIENT FIRESTORE WRITE ERROR] Delete document: "${collectionName}/${id}" failed.`, error);
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
    throw error;
  }
}

// ==========================================
// Specific Services for Each Requested Module
// ==========================================

export const statisticsService = {
  getAll: () => fetchCollection<Statistic>('statistics', 'name'),
  getById: (id: string) => fetchDocumentById<Statistic>('statistics', id),
  add: (data: Omit<Statistic, 'id'>) => addDocumentToCollection('statistics', data),
  update: (id: string, data: Partial<Statistic>) => updateDocumentInCollection('statistics', id, data),
  delete: (id: string) => deleteDocumentFromCollection('statistics', id)
};

export const coursesService = {
  getAll: () => fetchCollection<Course>('courses', 'name'),
  getById: (id: string) => fetchDocumentById<Course>('courses', id),
  add: (data: Omit<Course, 'id'>) => addDocumentToCollection('courses', data),
  update: (id: string, data: Partial<Course>) => updateDocumentInCollection('courses', id, data),
  delete: (id: string) => deleteDocumentFromCollection('courses', id)
};

export const departmentsService = {
  getAll: () => fetchCollection<Department>('departments', 'name'),
  getById: (id: string) => fetchDocumentById<Department>('departments', id),
  add: (data: Omit<Department, 'id'>) => addDocumentToCollection('departments', data),
  update: (id: string, data: Partial<Department>) => updateDocumentInCollection('departments', id, data),
  delete: (id: string) => deleteDocumentFromCollection('departments', id)
};

export const facultyService = {
  getAll: () => fetchCollection<Faculty>('faculty', 'name'),
  getById: (id: string) => fetchDocumentById<Faculty>('faculty', id),
  add: (data: Omit<Faculty, 'id'>) => addDocumentToCollection('faculty', data),
  update: (id: string, data: Partial<Faculty>) => updateDocumentInCollection('faculty', id, data),
  delete: (id: string) => deleteDocumentFromCollection('faculty', id)
};

export const noticesService = {
  getAll: () => fetchCollection<Notice>('notices', 'date', 'desc'),
  getById: (id: string) => fetchDocumentById<Notice>('notices', id),
  add: (data: Omit<Notice, 'id'>) => addDocumentToCollection('notices', data),
  update: (id: string, data: Partial<Notice>) => updateDocumentInCollection('notices', id, data),
  delete: (id: string) => deleteDocumentFromCollection('notices', id)
};

export const admissionsService = {
  getAll: () => fetchCollection<Admission>('admissions', 'submittedAt', 'desc'),
  getById: (id: string) => fetchDocumentById<Admission>('admissions', id),
  add: (data: Omit<Admission, 'id'>) => addDocumentToCollection('admissions', data),
  update: (id: string, data: Partial<Admission>) => updateDocumentInCollection('admissions', id, data),
  delete: (id: string) => deleteDocumentFromCollection('admissions', id)
};

export const contactMessagesService = {
  getAll: () => fetchCollection<ContactMessage>('contactMessages', 'submittedAt', 'desc'),
  getById: (id: string) => fetchDocumentById<ContactMessage>('contactMessages', id),
  add: (data: Omit<ContactMessage, 'id'>) => addDocumentToCollection('contactMessages', data),
  update: (id: string, data: Partial<ContactMessage>) => updateDocumentInCollection('contactMessages', id, data),
  delete: (id: string) => deleteDocumentFromCollection('contactMessages', id)
};

// ==========================================
// Database Seed / Setup Helper
// ==========================================

export async function seedInitialDatabaseIfEmpty() {
  try {
    const stats = await statisticsService.getAll();
    if (stats.length === 0) {
      console.log('Seeding initial data into Firestore...');
      
      // 1. Statistics
      const defaultStats: Omit<Statistic, 'id'>[] = [
        { name: 'Total Students', value: '1,200+', icon: 'GraduationCap', category: 'Academic', updatedAt: new Date().toISOString() },
        { name: 'Faculty Members', value: '150+', icon: 'UserCheck', category: 'Staff', updatedAt: new Date().toISOString() },
        { name: 'Hospital Beds', value: '650+', icon: 'Activity', category: 'Hospital', updatedAt: new Date().toISOString() },
        { name: 'OPD Patients Daily', value: '1,000+', icon: 'Heart', category: 'Hospital', updatedAt: new Date().toISOString() },
      ];
      for (const stat of defaultStats) {
        await statisticsService.add(stat);
      }

      // 2. Courses
      const defaultCourses: Omit<Course, 'id'>[] = [
        { name: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)', duration: '4.5 Years + 1 Year Internship', intake: 150, eligibility: 'NEET-UG qualified, 10+2 with 50% in PCB', fee: '₹12,00,000/Year', category: 'UG', description: 'Undergraduate medical program leading to professional registration.' },
        { name: 'MD General Medicine', duration: '3 Years', intake: 10, eligibility: 'NEET-PG qualified, MBBS degree', fee: '₹18,00,000/Year', category: 'PG', description: 'Postgraduate clinical residency course focusing on adult non-surgical diseases.' },
        { name: 'MS General Surgery', duration: '3 Years', intake: 8, eligibility: 'NEET-PG qualified, MBBS degree', fee: '₹18,00,000/Year', category: 'PG', description: 'Postgraduate clinical residency course in operative and surgical methods.' },
      ];
      for (const course of defaultCourses) {
        await coursesService.add(course);
      }

      // 3. Departments
      const defaultDepartments: Omit<Department, 'id'>[] = [
        { name: 'Department of General Medicine', headOfDepartment: 'Dr. Ritu Bawa', establishedYear: '2016', email: 'medicine@wcmsrh.com', phone: '01251-245001', location: 'Block A, 1st Floor', description: 'Provides complete preventive and therapeutic medical care.' },
        { name: 'Department of General Surgery', headOfDepartment: 'Dr. J. C. Passey', establishedYear: '2016', email: 'surgery@wcmsrh.com', phone: '01251-245002', location: 'Block B, Ground Floor', description: 'Advanced operative facility and emergency trauma management.' },
        { name: 'Department of Ophthalmology', headOfDepartment: 'Dr. Ramesh Dhankhar', establishedYear: '2017', email: 'eye@wcmsrh.com', phone: '01251-245003', location: 'Block C, 2nd Floor', description: 'Comprehensive eye clinics, refraction testing, and surgery suites.' },
      ];
      for (const dept of defaultDepartments) {
        await departmentsService.add(dept);
      }

      // 4. Faculty
      const defaultFaculty: Omit<Faculty, 'id'>[] = [
        { name: 'Dr. Ritu Bawa', designation: 'Professor & HoD', department: 'General Medicine', qualification: 'MD (Internal Medicine)', email: 'ritu.bawa@wcmsrh.com', experience: '15 Years', status: 'Active' },
        { name: 'Dr. J. C. Passey', designation: 'Principal & Professor', department: 'General Surgery', qualification: 'MS (General Surgery)', email: 'jc.passey@wcmsrh.com', experience: '25 Years', status: 'Active' },
        { name: 'Dr. Ramesh Dhankhar', designation: 'Professor', department: 'Ophthalmology', qualification: 'MS (Ophthalmology)', email: 'ramesh.dhankhar@wcmsrh.com', experience: '18 Years', status: 'Active' },
        { name: 'Dr. Kuldeep Singh Ahlawat', designation: 'Professor', department: 'Paediatrics', qualification: 'MD (Paediatrics)', email: 'kuldeep.ahlawat@wcmsrh.com', experience: '12 Years', status: 'Active' },
      ];
      for (const fac of defaultFaculty) {
        await facultyService.add(fac);
      }

      // 5. Notices
      const defaultNotices: Omit<Notice, 'id'>[] = [
        { title: 'MBBS 3rd Prof Part-2 Terminal Exam Schedule', content: 'The terminal examinations are scheduled to start from August 10, 2026. Hall tickets will be issued at the administrative block.', date: '2026-07-04', category: 'Academic', isUrgent: true },
        { title: 'Urgent Notice: Fee Submission Deadline', content: 'All students are requested to clear their pending fee dues for the academic year 2026-2027 by July 31, 2026, to avoid penalty.', date: '2026-07-02', category: 'Administrative', isUrgent: true },
        { title: 'CME Webcast on Medical Ethics', content: 'World College of Medical Sciences is hosting a national level webinar/CME on July 15, 2026. Registration is mandatory for PG residents.', date: '2026-06-28', category: 'Academic', isUrgent: false },
      ];
      for (const notice of defaultNotices) {
        await noticesService.add(notice);
      }

      // 6. Admissions
      const defaultAdmissions: Omit<Admission, 'id'>[] = [
        { studentName: 'Rahul Sharma', course: 'MS General Surgery', email: 'rahul.sharma@gmail.com', phone: '9876543210', status: 'Pending', submittedAt: new Date().toISOString(), message: 'I have qualified NEET PG with Rank 3452.' },
        { studentName: 'Priya Verma', course: 'MBBS', email: 'priya.verma@gmail.com', phone: '9988776655', status: 'Approved', submittedAt: new Date(Date.now() - 86400000).toISOString(), message: 'Interested in management seat opportunities.' },
      ];
      for (const adm of defaultAdmissions) {
        await admissionsService.add(adm);
      }

      // 7. Contact Messages
      const defaultMessages: Omit<ContactMessage, 'id'>[] = [
        { name: 'Suresh Gupta', email: 'suresh.gupta@yahoo.com', subject: 'Inquiry regarding MBBS Fee Structure', message: 'Can you please email me the detailed annual hostel charges and course fee breakups for MBBS batch 2026?', submittedAt: new Date().toISOString(), status: 'Unread' },
        { name: 'Ankita Sen', email: 'ankita.sen@outlook.com', subject: 'OPD schedule enquiry', message: 'When is the general medicine OPD available during the upcoming public holidays?', submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(), status: 'Read' },
      ];
      for (const msg of defaultMessages) {
        await contactMessagesService.add(msg);
      }

      console.log('Successfully completed Firestore database seeding!');
    } else {
      console.log('Database already has content, skipping seeding.');
    }
  } catch (err) {
    console.error('Seeding Firestore database failed:', err);
  }
}
