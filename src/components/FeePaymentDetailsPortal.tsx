import React, { useState, useRef, useEffect } from 'react';
import { StudentProfile } from '../types';
import { CreditCard, CheckCircle, Download, FileText } from 'lucide-react';

interface FeePaymentDetailsPortalProps {
  student: StudentProfile;
  onUpdateStudent?: (updated: StudentProfile) => void;
  isAdmin?: boolean;
  feesHistory: Array<{
    receiptNo: string;
    date: string;
    head: string;
    amount: string;
    status: string;
    method: string;
  }>;
  pendingFeeBalance: number;
  onPayNow: () => void;
}

export default function FeePaymentDetailsPortal({
  student,
  onUpdateStudent,
  isAdmin = false,
  feesHistory,
  pendingFeeBalance,
  onPayNow,
}: FeePaymentDetailsPortalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Local editing states
  const [name, setName] = useState(student.name);
  const [course, setCourse] = useState(student.course);
  const [yearTerm, setYearTerm] = useState(student.yearTerm);
  const [batch, setBatch] = useState(student.batch);
  const [academicYear, setAcademicYear] = useState(student.academicYear || '2026');
  const [rollNo, setRollNo] = useState(student.rollNo);
  const [universityId, setUniversityId] = useState(student.universityId || '');
  const [dob, setDob] = useState(student.dob);
  const [fatherName, setFatherName] = useState(student.fatherName);
  const [fatherMobile, setFatherMobile] = useState(student.fatherMobile);
  const [seatType, setSeatType] = useState(student.seatType || 'OPEN CAT');
  const [photoUrl, setPhotoUrl] = useState(student.photoUrl || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if student prop changes externally
  useEffect(() => {
    setName(student.name);
    setCourse(student.course);
    setYearTerm(student.yearTerm);
    setBatch(student.batch);
    setAcademicYear(student.academicYear || '2026');
    setRollNo(student.rollNo);
    setUniversityId(student.universityId || '');
    setDob(student.dob);
    setFatherName(student.fatherName);
    setFatherMobile(student.fatherMobile);
    setSeatType(student.seatType || 'OPEN CAT');
    setPhotoUrl(student.photoUrl || '');
  }, [student]);

  const startEditing = () => {
    setName(student.name);
    setCourse(student.course);
    setYearTerm(student.yearTerm);
    setBatch(student.batch);
    setAcademicYear(student.academicYear || '2026');
    setRollNo(student.rollNo);
    setUniversityId(student.universityId || '');
    setDob(student.dob);
    setFatherName(student.fatherName);
    setFatherMobile(student.fatherMobile);
    setSeatType(student.seatType || 'OPEN CAT');
    setPhotoUrl(student.photoUrl || '');
    setIsEditing(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (onUpdateStudent) {
      onUpdateStudent({
        ...student,
        name,
        course,
        yearTerm,
        batch,
        academicYear,
        rollNo,
        universityId,
        dob,
        fatherName,
        fatherMobile,
        seatType,
        photoUrl,
      });
    }
    setIsEditing(false);
    setSuccessMsg('Details updated successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-4 select-none font-sans">
      
      {/* ==================== OFFICIAL WCMSRH ERP PAGE COPY ==================== */}
      <div className="bg-white border border-[#b4c7d6] rounded shadow-sm overflow-hidden">
        
        {/* Block Header 1: Fee Payment Details */}
        <div className="bg-[#4D6F7B] text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex justify-between items-center">
          <span>Fee Payment Details</span>
          {isAdmin && (
            <span className="text-[9px] bg-yellow-400 text-slate-950 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider border border-yellow-300 animate-pulse">
              ★ Admin Level Controls Enabled
            </span>
          )}
        </div>

        {/* Block Header 2: Student Details & Admin Toggle */}
        <div className="bg-[#5C8290] text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border-b border-[#b4c7d6] flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span>Student Details</span>
            {successMsg && (
              <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-extrabold lowercase first-letter:uppercase">
                ✓ {successMsg}
              </span>
            )}
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={startEditing}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase transition cursor-pointer shadow-xs"
                >
                  ★ Edit Student Details
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-0.5 rounded text-[10px] font-black uppercase transition cursor-pointer shadow-xs"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-slate-500 hover:bg-slate-600 text-white px-2.5 py-0.5 rounded text-[10px] font-black uppercase transition cursor-pointer shadow-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Student Details Grid (Constructed with table for absolute visual copy) */}
        <div className="overflow-x-auto bg-white p-4">
          <table className="w-full border-collapse text-[11px] text-slate-700">
            <tbody>
              {/* Row 1 */}
              <tr>
                <td className="text-right pr-2 py-1.5 font-medium text-slate-600 w-[10%] whitespace-nowrap">Name</td>
                <td className="py-1.5 w-[22%]">
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={isEditing ? name : `Miss.Khushi`}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full border rounded px-1.5 py-0.5 text-[11px] font-medium outline-none transition-all ${
                      isEditing 
                        ? 'bg-blue-50 border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-500 text-blue-900 shadow-sm' 
                        : 'bg-white border-[#ccd6dd] text-slate-800'
                    }`}
                  />
                </td>
                <td className="text-right pr-2 py-1.5 font-medium text-slate-600 w-[10%] whitespace-nowrap">Course</td>
                <td className="py-1.5 w-[22%]">
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={isEditing ? course : student.course}
                    onChange={(e) => setCourse(e.target.value)}
                    className={`w-full border rounded px-1.5 py-0.5 text-[11px] font-medium outline-none transition-all ${
                      isEditing 
                        ? 'bg-blue-50 border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-500 text-blue-900 shadow-sm' 
                        : 'bg-white border-[#ccd6dd] text-slate-800'
                    }`}
                  />
                </td>
                <td className="text-right pr-2 py-1.5 font-medium text-slate-600 w-[10%] whitespace-nowrap">Term</td>
                <td className="py-1.5 w-[26%]">
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={isEditing ? yearTerm : student.yearTerm}
                    onChange={(e) => setYearTerm(e.target.value)}
                    className={`w-full border rounded px-1.5 py-0.5 text-[11px] font-medium outline-none transition-all ${
                      isEditing 
                        ? 'bg-blue-50 border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-500 text-blue-900 shadow-sm' 
                        : 'bg-white border-[#ccd6dd] text-slate-800'
                    }`}
                  />
                </td>
              </tr>

              {/* Row 2 */}
              <tr>
                <td className="text-right pr-2 py-1.5 font-medium text-slate-600 whitespace-nowrap">Batch</td>
                <td className="py-1.5">
                  {isEditing ? (
                    <input
                      type="text"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full bg-blue-50 border border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-500 text-blue-900 rounded px-1.5 py-0.5 text-[11px] outline-none"
                    />
                  ) : (
                    <div className="relative w-full">
                      <select
                        disabled
                        className="w-full bg-white border border-[#ccd6dd] rounded px-1.5 py-0.5 text-[11px] text-slate-800 outline-none appearance-none cursor-default"
                      >
                        <option>{batch}</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-500">
                        <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </td>
                <td className="text-right pr-2 py-1.5 font-medium text-slate-600 whitespace-nowrap">Academic Year</td>
                <td className="py-1.5">
                  {isEditing ? (
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full bg-blue-50 border border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-500 text-blue-900 rounded px-1.5 py-0.5 text-[11px] outline-none"
                    />
                  ) : (
                    <div className="relative w-full">
                      <select
                        disabled
                        className="w-full bg-white border border-[#ccd6dd] rounded px-1.5 py-0.5 text-[11px] text-slate-800 outline-none appearance-none cursor-default"
                      >
                        <option>{academicYear}</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-500">
                        <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </td>
                {/* Photo Span */}
                <td colSpan={2} rowSpan={4} className="p-2 align-middle text-center">
                  <div 
                    onClick={() => isEditing && fileInputRef.current?.click()}
                    className={`mx-auto w-[112px] h-[106px] border border-slate-400 rounded flex flex-col items-center justify-center p-0.5 shadow-xs overflow-hidden relative group transition-all ${
                      isEditing 
                        ? 'cursor-pointer hover:border-blue-500 hover:ring-2 hover:ring-blue-100 bg-slate-50 border-dashed' 
                        : 'bg-[#1a1a1a]'
                    }`}
                    title={isEditing ? "Click to upload / change photo" : undefined}
                  >
                    {isEditing ? (
                      photoUrl ? (
                        <>
                          <img src={photoUrl} alt="Preview" className="w-full h-full object-cover rounded-xs" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-[8px] font-bold text-center leading-normal">
                            <span>CLICK TO</span>
                            <span>CHANGE</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-slate-500 p-1">
                          <svg className="w-5 h-5 text-slate-400 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[8px] font-bold uppercase text-center leading-normal">
                            Click to<br />Upload Photo
                          </span>
                        </div>
                      )
                    ) : (
                      student.photoUrl ? (
                        <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover rounded-xs" />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-white">
                          <span className="text-[10px] font-bold italic uppercase text-center leading-tight tracking-wide">
                            No<br />Photo<br />Available
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        accept="image/*"
                        className="hidden"
                      />
                      {photoUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhotoUrl('');
                          }}
                          className="mt-1 text-[9px] font-semibold text-red-600 hover:text-red-800 transition block mx-auto underline cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>

              {/* Row 3 */}
              <tr>
                <td className="text-right pr-2 py-1.5 font-medium text-slate-600 whitespace-nowrap">Roll No</td>
                <td className="py-1.5">
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={isEditing ? rollNo : student.rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className={`w-full border rounded px-1.5 py-0.5 text-[11px] font-medium outline-none transition-all ${
                      isEditing 
                        ? 'bg-blue-50 border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-500 text-blue-900 shadow-sm' 
                        : 'bg-white border-[#ccd6dd] text-slate-800'
                    }`}
                  />
                </td>
                <td className="text-right pr-2 py-1.5 font-medium text-slate-600 whitespace-nowrap">University ID</td>
                <td className="py-1.5">
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={isEditing ? universityId : (student.universityId || '')}
                    onChange={(e) => setUniversityId(e.target.value)}
                    className={`w-full border rounded px-1.5 py-0.5 text-[11px] font-medium outline-none transition-all ${
                      isEditing 
                        ? 'bg-blue-50 border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-500 text-blue-900 shadow-sm' 
                        : 'bg-white border-[#ccd6dd] text-slate-800'
                    }`}
                  />
                </td>
              </tr>

              {/* Row 4 */}
              <tr>
                <td className="text-right pr-2 py-1.5 font-medium text-slate-600 whitespace-nowrap">Date of Birth</td>
                <td className="py-1.5">
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={isEditing ? dob : student.dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={`w-full border rounded px-1.5 py-0.5 text-[11px] font-medium outline-none transition-all ${
                      isEditing 
                        ? 'bg-blue-50 border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-500 text-blue-900 shadow-sm' 
                        : 'bg-white border-[#ccd6dd] text-slate-800'
                    }`}
                  />
                </td>
                <td className="text-right pr-2 py-1.5 font-medium text-slate-600 whitespace-nowrap">Parent Name</td>
                <td className="py-1.5">
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={isEditing ? fatherName : student.fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className={`w-full border rounded px-1.5 py-0.5 text-[11px] font-medium outline-none transition-all ${
                      isEditing 
                        ? 'bg-blue-50 border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-500 text-blue-900 shadow-sm' 
                        : 'bg-white border-[#ccd6dd] text-slate-800'
                    }`}
                  />
                </td>
              </tr>

              {/* Row 5 */}
              <tr>
                <td className="text-right pr-2 py-1.5 font-medium text-slate-600 whitespace-nowrap">Seat Type*</td>
                <td className="py-1.5">
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={isEditing ? seatType : (student.seatType || 'OPEN CAT')}
                    onChange={(e) => setSeatType(e.target.value)}
                    className={`w-full border rounded px-1.5 py-0.5 text-[11px] font-medium outline-none transition-all ${
                      isEditing 
                        ? 'bg-blue-50 border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-500 text-blue-900 shadow-sm' 
                        : 'bg-white border-[#ccd6dd] text-slate-800'
                    }`}
                  />
                </td>
                <td className="text-right pr-2 py-1.5 font-medium text-slate-600 whitespace-nowrap">Parent Mobile No.</td>
                <td className="py-1.5">
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={isEditing ? fatherMobile : student.fatherMobile}
                    onChange={(e) => setFatherMobile(e.target.value)}
                    className={`w-full border rounded px-1.5 py-0.5 text-[11px] font-medium outline-none transition-all ${
                      isEditing 
                        ? 'bg-blue-50 border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-500 text-blue-900 shadow-sm' 
                        : 'bg-white border-[#ccd6dd] text-slate-800'
                    }`}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>


      {pendingFeeBalance === 0 && feesHistory.length === 0 && (
        <div className="border border-[#f8a3a3] bg-[#fff5f5] px-3 py-1 text-left rounded-sm">
          <span className="text-[#dc2626] font-bold text-[11px] tracking-wide">
            No fee record found
          </span>
        </div>
      )}

    </div>
  );
}
