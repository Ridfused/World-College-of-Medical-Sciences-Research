import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { contactMessagesService } from '../services/firestoreService';

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await contactMessagesService.add({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        submittedAt: new Date().toISOString(),
        status: 'Unread'
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err: any) {
      console.error('Error submitting contact request:', err);
      setError('Failed to log message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in" id="contact-support-view">
      <div className="border-b pb-3">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Mail className="w-6 h-6 text-[#004a99]" />
          College Contact &amp; Support desk
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Have queries about campus facilities, hostel, fees, or emergencies? Reach out to our 24/7 college administrators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Contact Info Left */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 text-xs md:text-sm">
            <h4 className="font-extrabold text-slate-800 text-sm border-b pb-2 uppercase tracking-wide">Campus Support Contacts</h4>
            
            <div className="flex gap-3">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-700">Official Location</span>
                <span className="text-slate-500 text-xs">Jhajjar - Bahadurgarh Road, Jhajjar, Haryana 124103</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-700">Helpdesk Numbers</span>
                <span className="text-slate-500 text-xs block font-mono">01251-245001, 245002</span>
                <span className="text-slate-500 text-xs block font-mono">Toll Free: 1800-123-WCMS</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-700">Email Enquiries</span>
                <span className="text-blue-600 text-xs block">info@wcmsrh.com</span>
                <span className="text-blue-600 text-xs block">support@wcmsrh.com</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-700">OPD &amp; Office Hours</span>
                <span className="text-slate-500 text-xs block">OPD: 9:00 AM - 4:00 PM (Mon-Sat)</span>
                <span className="text-slate-500 text-xs block">Admin: 10:00 AM - 5:00 PM (Mon-Sat)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Form Right */}
        <div className="md:col-span-7">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#79a6c1] text-white px-4 py-2 text-sm font-semibold tracking-wider flex justify-between items-center">
              <span>Write To Our Administration Desk</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase">Response within 24 Hrs</span>
            </div>

            <div className="p-6">
              {success ? (
                <div className="p-6 text-center space-y-4" id="support-success-box">
                  <div className="inline-flex p-3 bg-green-50 text-green-600 rounded-full">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Support Message Dispatched!</h3>
                    <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
                      Your inquiry has been successfully queued into the administrative dashboard. We will get back to you via email.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="px-4 py-2 bg-[#004a99] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#003c80] transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded flex items-center gap-2" id="support-error-box">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-xs">{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-500 font-semibold uppercase text-[10px] tracking-wide mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suresh Gupta"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-400 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold uppercase text-[10px] tracking-wide mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. suresh.gupta@yahoo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-400 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold uppercase text-[10px] tracking-wide mb-1.5">
                      Subject Inquiry <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Query regarding MBBS Hostel accommodation"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-400 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold uppercase text-[10px] tracking-wide mb-1.5">
                      Support Message Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Write your query in full detail. Include roll number or application ID if applicable..."
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
                      {loading ? 'Sending Support Inquiry...' : 'Dispatch Message To Support'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
