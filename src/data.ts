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

export const initialStudentProfile: StudentProfile = {
  name: "Khushi",
  rollNo: "2022/24",
  dob: "14/05/2004",
  batch: "2022",
  academicYear: "2026 - 2027",
  yearTerm: "MBBS 3RD PROF PART-2",
  course: "MBBS",
  studentMobile: "8708992125",
  studentEmail: "khushichhikara2019@gmail.com",
  fatherName: "Krishan Kumar",
  fatherMobile: "8168941658",
  fatherEmail: "krishanchhikara31@gmail.com",
  motherName: "POONAM",
  motherMobile: "",
  motherEmail: "",
  address: "GUPTA WALI GALI BEHIND NEW ANAJ MANDI, SAMPLA, HARYANA - 124501",
  addressCorrespondence: {
    address: "GUPTA WALI GALI BEHIND NEW ANAJ MANDI, SAMPLA, HARYANA - 124501",
    country: "India",
    state: "HARYANA",
    city: "SAMPLA",
    pin: "124501"
  },
  addressPermanent: {
    address: "GUPTA WALI GALI BEHIND NEW ANAJ MANDI, SAMPLA, HARYANA - 124501",
    country: "India",
    state: "HARYANA",
    city: "SAMPLA",
    pin: "124501"
  },
  parentInfo: {
    occupation: "",
    emailId: "krishanchhikara31@gmail.com",
    alternateEmailId: "",
    phoneNo: "",
    mobileNo: "8168941658"
  },
  guardianInfo: {
    relation: "",
    emailId: "",
    phoneNo: "",
    mobileNo: ""
  }
};

export const defaultAttendanceItems: AttendanceItem[] = [
  { subjectName: "ENT-Clinical", totalClass: 12, classAttended: 3, actualPercentage: 25, minReqPercentage: 80, categoryName: "Clinical" },
  { subjectName: "Ent-Theory", totalClass: 9, classAttended: 6, actualPercentage: 67, minReqPercentage: 75, categoryName: "Theory" },
  { subjectName: "Ent-Tutorial-Practical", totalClass: 16, classAttended: 7, actualPercentage: 44, minReqPercentage: 75, categoryName: "Practical" },
  { subjectName: "General Medicine SGD-Practical", totalClass: 1, classAttended: 1, actualPercentage: 100, minReqPercentage: 80, categoryName: "Practical" },
  { subjectName: "General Medicine-Clinical", totalClass: 23, classAttended: 13, actualPercentage: 57, minReqPercentage: 80, categoryName: "Clinical" },
  { subjectName: "GENERAL MEDICINE-Practical", totalClass: 1, classAttended: 1, actualPercentage: 100, minReqPercentage: 80, categoryName: "Practical" },
  { subjectName: "General Medicine-Theory", totalClass: 30, classAttended: 17, actualPercentage: 57, minReqPercentage: 75, categoryName: "Theory" },
  { subjectName: "General Surgery-Clinical", totalClass: 24, classAttended: 13, actualPercentage: 54, minReqPercentage: 80, categoryName: "Clinical" },
  { subjectName: "General Surgery-Practical", totalClass: 11, classAttended: 0, actualPercentage: 0, minReqPercentage: 80, categoryName: "Practical" },
  { subjectName: "General Surgery-Theory", totalClass: 31, classAttended: 9, actualPercentage: 29, minReqPercentage: 75, categoryName: "Theory" },
  { subjectName: "GeneralMedicine-Practical", totalClass: 9, classAttended: 1, actualPercentage: 11, minReqPercentage: 80, categoryName: "Practical" },
  { subjectName: "OBG SGD-Practical", totalClass: 9, classAttended: 4, actualPercentage: 44, minReqPercentage: 80, categoryName: "Practical" },
  { subjectName: "OBG-Clinical", totalClass: 22, classAttended: 5, actualPercentage: 23, minReqPercentage: 80, categoryName: "Clinical" },
  { subjectName: "OBG-Practical", totalClass: 10, classAttended: 2, actualPercentage: 20, minReqPercentage: 80, categoryName: "Practical" },
  { subjectName: "OBG-Theory", totalClass: 21, classAttended: 11, actualPercentage: 52, minReqPercentage: 80, categoryName: "Theory" },
  { subjectName: "Ophthalmology-Clinical", totalClass: 12, classAttended: 1, actualPercentage: 8, minReqPercentage: 80, categoryName: "Clinical" },
  { subjectName: "Ophthalmology-Theory", totalClass: 19, classAttended: 8, actualPercentage: 42, minReqPercentage: 75, categoryName: "Theory" },
  { subjectName: "Ophthalmology-Tutorials-Practical", totalClass: 17, classAttended: 5, actualPercentage: 29, minReqPercentage: 75, categoryName: "Practical" },
  { subjectName: "Orthopaedics-Clinical", totalClass: 11, classAttended: 0, actualPercentage: 0, minReqPercentage: 80, categoryName: "Clinical" },
  { subjectName: "Orthopaedics-Practical", totalClass: 6, classAttended: 0, actualPercentage: 0, minReqPercentage: 80, categoryName: "Practical" },
  { subjectName: "Paediatrics SGD-Practical", totalClass: 8, classAttended: 3, actualPercentage: 38, minReqPercentage: 80, categoryName: "Practical" },
  { subjectName: "paediatrics-Practical", totalClass: 10, classAttended: 2, actualPercentage: 20, minReqPercentage: 80, categoryName: "Practical" },
  { subjectName: "Paediatrics-Theory", totalClass: 11, classAttended: 4, actualPercentage: 36, minReqPercentage: 75, categoryName: "Theory" },
  { subjectName: "Pediatrics-Clinical", totalClass: 12, classAttended: 1, actualPercentage: 8, minReqPercentage: 80, categoryName: "Clinical" },
  { subjectName: "PSYCHIATRY-Theory", totalClass: 1, classAttended: 0, actualPercentage: 0, minReqPercentage: 75, categoryName: "Theory" },
  { subjectName: "RESPIRATORY MEDICINE-Practical", totalClass: 13, classAttended: 1, actualPercentage: 8, minReqPercentage: 80, categoryName: "Practical" }
];

export const defaultExamPerformances: ExamPerformance[] = [
  { examName: "1st Class test", totalMarks: "53/90", percentage: 58.89 },
  { examName: "1st Internal Examination", totalMarks: "48/100", percentage: 48.00 }
];

export const defaultRecentAttendance: RecentAttendance[] = [
  { subjectName: "OBG-Practical", status: "Present", date: "27/06/2026", session: "09:00 AM To 12:00 PM", facultyName: "Ritu Bawa" },
  { subjectName: "paediatrics-Practical", status: "Present", date: "26/06/2026", session: "09:00 AM To 12:00 PM", facultyName: "Kuldeep Singh Ahlawat" },
  { subjectName: "OBG-Theory", status: "Present", date: "25/06/2026", session: "09:00 AM To 12:00 PM", facultyName: "Ritu Bawa" },
  { subjectName: "Ophthalmology-Theory", status: "Present", date: "24/06/2026", session: "09:00 AM To 12:00 PM", facultyName: "RAMESH DHANKHAR" }
];

export const defaultHolidays: HolidayItem[] = [
  { slNo: 1, holidayName: "REPUBLIC DAY", date: "26-Jan-2026", day: "Monday", applicableTo: "All" },
  { slNo: 2, holidayName: "Mahashivratri", date: "15-Feb-2026", day: "Sunday", applicableTo: "All" },
  { slNo: 3, holidayName: "RAM NAVMI", date: "26-Mar-2026", day: "Thursday", applicableTo: "All" },
  { slNo: 4, holidayName: "Indian Independence Day", date: "15-Aug-2026", day: "Saturday", applicableTo: "All" },
  { slNo: 5, holidayName: "Raksha Bandhan", date: "28-Aug-2026", day: "Friday", applicableTo: "All" },
  { slNo: 6, holidayName: "Shri Krishna Janmashtami", date: "04-Sep-2026", day: "Friday", applicableTo: "All" },
  { slNo: 7, holidayName: "Gandhi Jayanti", date: "02-Oct-2026", day: "Friday", applicableTo: "All" },
  { slNo: 8, holidayName: "Dussehra", date: "20-Oct-2026", day: "Tuesday", applicableTo: "All" },
  { slNo: 9, holidayName: "Haryana Foundation Day", date: "01-Nov-2026", day: "Sunday", applicableTo: "All" },
  { slNo: 10, holidayName: "Diwali", date: "08-Nov-2026", day: "Sunday", applicableTo: "All" }
];

export const defaultVacations: VacationItem[] = [
  { slNo: 1, vacationName: "HOLI VACATION", fromDate: "04-Mar-2026", toDate: "08-Mar-2026", noOfDays: 4, applicableTo: "Student" }
];

export const defaultUniversityInfo: UniversityInfo = {
  name: "Pandit Bhagwat Dayal Sharma University of Health Sciences",
  chancellor: "Shri Bandaru Dattatraya",
  viceChancellor: "Prof. Anita Saxena",
  address: "UH2, PGIMS Road, Dariyao Nagar, Rohtak, Haryana 124001",
  country: "India",
  state: "Haryana",
  city: "Rohtak",
  zipCode: "124001",
  phone: "+91-08662451206",
  alternatePhone: "+91-08662451210",
  fax: "+91-08662450463",
  email: "vc@uhsr.ac.in",
  website: "http://uhsr.ac.in"
};

export const defaultCollegeInfo: CollegeInfo = {
  name: "World College of Medical Sciences & Research",
  affiliatedUniversity: "Pt. B.D Sharma University of Health Science, Rohtak, Haryana",
  directorName: "Dr. C. S. Dhull",
  principalName: "Dr. J. C. Passey",
  address: "Sampla - Jhajjar Road, Village - Girawar, Jhajjar, Haryana 124103",
  country: "India",
  state: "Haryana",
  city: "Jhajjar",
  zipCode: "124103",
  phone: "7015213807",
  alternatePhone: "9416528226",
  fax: "-",
  mobile: "+91-9416528226",
  tollFree: "18008330126",
  email: "admin@wcmsrh.com",
  website: "www.wcmsrh.com"
};

export const defaultExamSchedule: ExamScheduleItem[] = [
  { id: '1', subject: 'Ophthalmology (Theory Assessment)', date: '12-10-2026', time: '10:00 AM To 01:00 PM', room: 'Lecture Hall 2', status: 'Admitted' },
  { id: '2', subject: 'ENT (Otorhinolaryngology Theory)', date: '15-10-2026', time: '10:00 AM To 01:00 PM', room: 'Lecture Hall 1', status: 'Admitted' },
  { id: '3', subject: 'Ophthalmology (Clinical & Practical Exam)', date: '18-10-2026', time: '09:00 AM Onwards', room: 'Dept Clinical Lab', status: 'Admitted' },
  { id: '4', subject: 'ENT (Clinical & Oral Vose Exam)', date: '20-10-2026', time: '09:00 AM Onwards', room: 'Dept Ward-A', status: 'Admitted' },
];

