export interface StudentProfile {
  name: string;
  rollNo: string;
  dob: string;
  batch: string;
  academicYear: string;
  yearTerm: string;
  course: string;
  studentMobile: string;
  studentEmail: string;
  fatherName: string;
  fatherMobile: string;
  fatherEmail: string;
  motherName: string;
  motherMobile: string;
  universityId?: string;
  seatType?: string;
  photoUrl?: string;
  motherEmail: string;
  address: string;
  addressCorrespondence: {
    address: string;
    country: string;
    state: string;
    city: string;
    pin: string;
  };
  addressPermanent: {
    address: string;
    country: string;
    state: string;
    city: string;
    pin: string;
  };
  parentInfo: {
    occupation: string;
    emailId: string;
    alternateEmailId: string;
    phoneNo: string;
    mobileNo: string;
  };
  guardianInfo: {
    relation: string;
    emailId: string;
    phoneNo: string;
    mobileNo: string;
  };
}

export interface AttendanceItem {
  subjectName: string;
  totalClass: number;
  classAttended: number;
  actualPercentage: number;
  minReqPercentage: number;
  categoryName: 'Theory' | 'Practical' | 'Clinical';
}

export interface ExamPerformance {
  examName: string;
  totalMarks: string;
  percentage: number;
}

export interface RecentAttendance {
  subjectName: string;
  status: 'Present' | 'Absent';
  date: string;
  session: string;
  facultyName: string;
}

export interface HolidayItem {
  slNo: number;
  holidayName: string;
  date: string;
  day: string;
  applicableTo: string;
}

export interface VacationItem {
  slNo: number;
  vacationName: string;
  fromDate: string;
  toDate: string;
  noOfDays: number;
  applicableTo: string;
}

export interface UniversityInfo {
  name: string;
  chancellor: string;
  viceChancellor: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  phone: string;
  alternatePhone: string;
  fax: string;
  email: string;
  website: string;
}

export interface CollegeInfo {
  name: string;
  affiliatedUniversity: string;
  directorName: string;
  principalName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  phone: string;
  alternatePhone: string;
  fax: string;
  mobile: string;
  tollFree: string;
  email: string;
  website: string;
}

export interface ExamScheduleItem {
  id: string;
  subject: string;
  date: string;
  time: string;
  room: string;
  status: string;
}

