import React from 'react';
import { StudentProfile } from '../types';
import { Home, User, ArrowLeft } from 'lucide-react';

interface ProfileEditProps {
  student: StudentProfile;
  onSave: (updatedProfile: StudentProfile) => void;
  onBack: () => void;
}

export default function ProfileEdit({ student, onBack }: ProfileEditProps) {
  return (
    <div className="space-y-6" id="profile-view-container">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Student Profile Details</h2>
          <p className="text-xs text-slate-500 mt-1">View registered correspondence address and contact details</p>
        </div>
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>
      </div>

      <div className="space-y-8">
        
        {/* Row 1: Correspondence & Permanent Addresses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Address for Correspondence */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="bg-[#79a6c1] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" /> Address For Correspondence
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Address</label>
                <textarea
                  value={student.addressCorrespondence?.address || ''}
                  readOnly
                  className="w-full p-2.5 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none min-h-[60px] cursor-not-allowed font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Country</label>
                  <input
                    type="text"
                    value={student.addressCorrespondence?.country || 'India'}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">State</label>
                  <input
                    type="text"
                    value={student.addressCorrespondence?.state || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={student.addressCorrespondence?.city || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={student.addressCorrespondence?.pin || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-mono font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Permanent Address */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="bg-[#79a6c1] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Home className="w-3.5 h-3.5" /> Permanent Address</span>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Address</label>
                <textarea
                  value={student.addressPermanent?.address || ''}
                  readOnly
                  className="w-full p-2.5 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none min-h-[60px] cursor-not-allowed font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Country</label>
                  <input
                    type="text"
                    value={student.addressPermanent?.country || 'India'}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">State</label>
                  <input
                    type="text"
                    value={student.addressPermanent?.state || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={student.addressPermanent?.city || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={student.addressPermanent?.pin || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-mono font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Parent & Guardian Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Parent Information */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="bg-[#79a6c1] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Parent Information
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Occupation</label>
                  <input
                    type="text"
                    value={student.parentInfo?.occupation || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Email ID</label>
                  <input
                    type="email"
                    value={student.parentInfo?.emailId || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Alternate Email ID</label>
                <input
                  type="email"
                  value={student.parentInfo?.alternateEmailId || ''}
                  readOnly
                  className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Phone No.</label>
                  <input
                    type="text"
                    value={student.parentInfo?.phoneNo || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Mobile No.</label>
                  <input
                    type="text"
                    value={student.parentInfo?.mobileNo || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-mono font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="bg-[#79a6c1] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Guardian Information
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Relation</label>
                  <input
                    type="text"
                    value={student.guardianInfo?.relation || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Email ID</label>
                  <input
                    type="email"
                    value={student.guardianInfo?.emailId || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Phone No.</label>
                  <input
                    type="text"
                    value={student.guardianInfo?.phoneNo || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Mobile No.</label>
                  <input
                    type="text"
                    value={student.guardianInfo?.mobileNo || ''}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded text-xs focus:outline-none cursor-not-allowed font-mono font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
