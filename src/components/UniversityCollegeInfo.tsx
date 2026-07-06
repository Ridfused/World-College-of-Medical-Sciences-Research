import React, { useState, useEffect } from 'react';
import { UniversityInfo, CollegeInfo } from '../types';
import { 
  Building, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Globe, 
  Shield, 
  User, 
  Activity, 
  UserCheck, 
  Heart, 
  BookOpen, 
  Award,
  Calendar
} from 'lucide-react';
import { 
  statisticsService, 
  coursesService, 
  departmentsService, 
  facultyService,
  Statistic,
  Course,
  Department,
  Faculty 
} from '../services/firestoreService';

interface UniversityCollegeInfoProps {
  type: 'university' | 'college';
  universityData: UniversityInfo;
  collegeData: CollegeInfo;
}

export default function UniversityCollegeInfo({ type, universityData, collegeData }: UniversityCollegeInfoProps) {
  const isUni = type === 'university';

  const [stats, setStats] = useState<Statistic[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isUni) return;

    let active = true;
    const loadCollegeDbData = async () => {
      setLoading(true);
      try {
        const [fetchedStats, fetchedCourses, fetchedDepts, fetchedFaculty] = await Promise.all([
          statisticsService.getAll(),
          coursesService.getAll(),
          departmentsService.getAll(),
          facultyService.getAll()
        ]);
        if (active) {
          setStats(fetchedStats);
          setCourses(fetchedCourses);
          setDepartments(fetchedDepts);
          setFaculty(fetchedFaculty);
        }
      } catch (err) {
        console.error('Failed to load college info datasets:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCollegeDbData();
    return () => {
      active = false;
    };
  }, [isUni]);

  const renderStatIcon = (iconName?: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-emerald-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-rose-600" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-pink-600" />;
      default:
        return <Building className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b pb-3">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          {isUni ? <GraduationCap className="w-6 h-6 text-[#004a99]" /> : <Building className="w-6 h-6 text-[#004a99]" />}
          {isUni ? 'University Information' : 'College Information'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isUni ? 'Affiliation details and university board members' : 'Administrative staff and primary college headquarters'}
        </p>
      </div>

      {isUni ? (
        /* University Info Block */
        <div className="grid grid-cols-1 gap-6">
          <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Board &amp; Authority
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-4 rounded border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">University Name</span>
                <span className="font-bold text-slate-800 text-sm mt-1 block">{universityData.name}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Chancellor</span>
                <span className="font-semibold text-slate-700 text-sm mt-1 block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {universityData.chancellor}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Vice Chancellor</span>
                <span className="font-semibold text-slate-700 text-sm mt-1 block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {universityData.viceChancellor}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Contact Details
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs md:text-sm">
              <div className="border-b pb-2 md:col-span-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Address / Street</span>
                <span className="font-medium text-slate-800">{universityData.address}</span>
              </div>
              
              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Country / Region</span>
                <span className="font-medium text-slate-800">{universityData.country}</span>
              </div>
              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">State / Province</span>
                <span className="font-medium text-slate-800">{universityData.state}</span>
              </div>

              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">City</span>
                <span className="font-medium text-slate-800">{universityData.city}</span>
              </div>
              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">ZIP / Postal Code</span>
                <span className="font-mono font-medium text-slate-800">{universityData.zipCode}</span>
              </div>

              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Phone Number</span>
                <span className="font-medium text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {universityData.phone}
                </span>
              </div>
              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Alternative Number</span>
                <span className="font-medium text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {universityData.alternatePhone}
                </span>
              </div>

              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Fax</span>
                <span className="font-medium text-slate-800">{universityData.fax}</span>
              </div>
              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Email ID</span>
                <span className="font-medium text-blue-600 hover:underline">
                  <a href={`mailto:${universityData.email}`}>{universityData.email}</a>
                </span>
              </div>

              <div className="md:col-span-2 pt-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Official Website</span>
                <a 
                  href={universityData.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#004a99] hover:underline font-semibold flex items-center gap-1 text-sm"
                >
                  <Globe className="w-4 h-4" /> {universityData.website}
                </a>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* College Info Block */
        <div className="grid grid-cols-1 gap-6">
          <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Administration
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded border border-slate-100 md:col-span-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">College Name</span>
                <span className="font-bold text-slate-800 text-sm mt-1 block">{collegeData.name}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Director Name</span>
                <span className="font-bold text-slate-800 text-sm mt-1 block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {collegeData.directorName}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Principal Name</span>
                <span className="font-bold text-slate-800 text-sm mt-1 block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {collegeData.principalName}
                </span>
              </div>
              <div className="bg-[#f0f9ff] p-4 rounded border border-blue-100 md:col-span-4 mt-2">
                <span className="block text-[10px] font-bold text-blue-500 uppercase tracking-wide">Affiliated University</span>
                <span className="font-semibold text-blue-900 text-xs mt-1 block">{collegeData.affiliatedUniversity}</span>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> College Address &amp; Contact Details
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs md:text-sm">
              <div className="border-b pb-2 md:col-span-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Address / Street</span>
                <span className="font-medium text-slate-800">{collegeData.address}</span>
              </div>

              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Country / Region</span>
                <span className="font-medium text-slate-800">{collegeData.country}</span>
              </div>
              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">State / Province</span>
                <span className="font-medium text-slate-800">{collegeData.state}</span>
              </div>

              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">City</span>
                <span className="font-medium text-slate-800">{collegeData.city}</span>
              </div>
              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">ZIP / Postal Code</span>
                <span className="font-mono font-medium text-slate-800">{collegeData.zipCode}</span>
              </div>

              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Phone Number</span>
                <span className="font-medium text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {collegeData.phone}
                </span>
              </div>
              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Alternative Number</span>
                <span className="font-medium text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {collegeData.alternatePhone}
                </span>
              </div>

              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Mobile No.</span>
                <span className="font-medium text-slate-800 flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {collegeData.mobile}
                </span>
              </div>
              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Toll Free No.</span>
                <span className="font-medium text-slate-800 font-mono">{collegeData.tollFree}</span>
              </div>

              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Fax</span>
                <span className="font-medium text-slate-800">{collegeData.fax}</span>
              </div>
              <div className="border-b pb-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Email ID</span>
                <span className="font-medium text-blue-600 hover:underline">
                  <a href={`mailto:${collegeData.email}`}>{collegeData.email}</a>
                </span>
              </div>

              <div className="md:col-span-2 pt-2">
                <span className="block text-slate-400 font-bold uppercase text-[10px] tracking-wide mb-1">Official Website</span>
                <a 
                  href={`https://${collegeData.website}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#004a99] hover:underline font-semibold flex items-center gap-1 text-sm"
                >
                  <Globe className="w-4 h-4" /> {collegeData.website}
                </a>
              </div>
            </div>
          </section>

          {/* Dynamic Statistics Block */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.id || stat.name} className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-full shrink-0">
                    {renderStatIcon(stat.icon)}
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">{stat.name}</span>
                    <span className="text-lg font-black text-[#004a99]">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Departments Block */}
          {departments.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4" /> Academic & Clinical Departments
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <div key={dept.id || dept.name} className="bg-slate-50/50 p-4 rounded-lg border border-slate-200/60 flex flex-col justify-between hover:shadow-xs transition">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{dept.name}</h4>
                      {dept.description && <p className="text-xs text-slate-500 mb-3 leading-relaxed">{dept.description}</p>}
                    </div>
                    <div className="border-t pt-2 mt-2 text-[11px] text-slate-600 space-y-1">
                      <div><strong className="text-slate-400 uppercase text-[9px] tracking-wide block">Head of Dept</strong> {dept.headOfDepartment}</div>
                      {dept.location && <div><strong className="text-slate-400 uppercase text-[9px] tracking-wide block mt-1">Location</strong> {dept.location}</div>}
                      {dept.phone && <div><strong className="text-slate-400 uppercase text-[9px] tracking-wide block mt-1">Extension / Phone</strong> {dept.phone}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Dynamic Courses Offered Block */}
          {courses.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Academic Programs Offered
              </div>
              <div className="divide-y divide-slate-100">
                {courses.map((course) => (
                  <div key={course.id || course.name} className="p-5 hover:bg-slate-50/30 transition">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-2">
                      <div>
                        <span className="px-2 py-0.5 bg-blue-100 text-[#004a99] font-extrabold text-[9px] uppercase rounded tracking-wider mr-2">{course.category}</span>
                        <h4 className="inline-block font-extrabold text-slate-800 text-sm">{course.name}</h4>
                      </div>
                      <span className="font-extrabold text-emerald-600 text-xs md:text-sm">{course.fee}</span>
                    </div>
                    {course.description && <p className="text-xs text-slate-500 mb-3 leading-relaxed">{course.description}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-3 rounded border border-slate-150 text-[11px] text-slate-600">
                      <div><strong>Duration:</strong> {course.duration}</div>
                      <div><strong>Annual Seats (Intake):</strong> {course.intake} Students</div>
                      <div><strong>Eligibility:</strong> {course.eligibility}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Dynamic Faculty Members Block */}
          {faculty.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> Registered Medical Faculty &amp; Professors
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                {faculty.map((fac) => (
                  <div key={fac.id || fac.name} className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between hover:border-blue-300 transition shadow-xs relative">
                    <span className={`absolute top-3 right-3 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      fac.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>{fac.status || 'Active'}</span>
                    
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-xs">{fac.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{fac.designation}</p>
                      <p className="text-[11px] text-[#004a99] font-semibold">{fac.department}</p>
                    </div>
                    
                    <div className="border-t pt-2 mt-4 text-[10px] text-slate-500 space-y-1 leading-snug">
                      <div><strong>Qualifications:</strong> {fac.qualification}</div>
                      {fac.experience && <div><strong>Experience:</strong> {fac.experience}</div>}
                      {fac.email && <div className="truncate"><strong>Email:</strong> {fac.email}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
