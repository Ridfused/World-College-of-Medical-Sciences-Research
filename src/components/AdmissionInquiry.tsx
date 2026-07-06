import React, { useState } from 'react';
import { Landmark, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';
import { admissionsService } from '../services/firestoreService';

export default function AdmissionInquiry() {
  const [formData, setFormData] = useState({
    studentName: '',
    course: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
    email: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const coursesList = [
    'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
    'MD General Medicine',
    'MS General Surgery',
    'Diploma in Anaesthesia',
    'B.Sc. Nursing'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.email || !formData.phone) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await admissionsService.add({
        studentName: formData.studentName,
        course: formData.course,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        status: 'Pending',
        submittedAt: new Date().toISOString()
      });

      setSuccess(true);
      setFormData({
        studentName: '',
        course: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
        email: '',
        phone: '',
        message: ''
      });
    } catch (err: any) {
      console.error('Error submitting admission request:', err);
      setError('Failed to submit admission inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto" id="admission-inquiry-view">
      <div className="border-b pb-3">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-[#004a99]" />
          Admission Inquiry Desk
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Submit your academic profiles and request course eligibility evaluations directly with our registrar office.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-[#79a6c1] text-white px-4 py-2 text-sm font-semibold tracking-wider flex justify-between items-center">
          <span>Official Inquiry Submission</span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase">Batch 2026 - 2027</span>
        </div>

        <div className="p-6">
          {success ? (
            <div className="p-6 text-center space-y-4" id="inquiry-success-box">
              <div className="inline-flex p-3 bg-green-50 text-green-600 rounded-full">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Inquiry Logged Successfully!</h3>
                <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto">
                  Your admission request has been recorded into the college system. An admissions officer will contact you shortly on your provided mobile number or email.
                </p>
              </div>
              <button 
                onClick={() => setSuccess(false)}
                className="px-4 py-2 bg-[#004a99] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#003c80] transition cursor-pointer"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded flex items-center gap-2" id="inquiry-error-box">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-xs">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-500 font-semibold uppercase text-[10px] tracking-wide mb-1.5">
                  Candidate Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-400 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-semibold uppercase text-[10px] tracking-wide mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul.sharma@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-400 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold uppercase text-[10px] tracking-wide mb-1.5">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-400 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold uppercase text-[10px] tracking-wide mb-1.5">
                  Desired Course Program <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-400 bg-white text-xs font-medium"
                >
                  {coursesList.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold uppercase text-[10px] tracking-wide mb-1.5">
                  Additional Details &amp; NEET score (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your NEET-UG/PG rank, educational marks, or any queries regarding counseling seats..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-400 text-xs font-medium leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 bg-[#004a99] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#003c80] transition-all cursor-pointer ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Submitting Registry Inquiry...' : 'Submit Academic Registration Inquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
