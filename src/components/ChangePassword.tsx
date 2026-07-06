import React, { useState } from 'react';
import { Lock, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ChangePasswordProps {
  onBack: () => void;
  isAdmin?: boolean;
  onPasswordChanged?: (newPassword: string) => void;
}

export default function ChangePassword({ onBack, isAdmin = false, onPasswordChanged }: ChangePasswordProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all the password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(isAdmin ? 'User password has been updated successfully for user mode.' : 'Your password has been changed successfully! Keep this password safe for your next login.');
      // If admin updated password, persist it for user-mode login
      if (isAdmin && onPasswordChanged) {
        try {
          onPasswordChanged(newPassword);
        } catch (e) {
          // ignore storage errors
        }
      }
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 800);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-6 h-6 text-[#004a99]" />
          Change Password
        </h2>
        <p className="text-xs text-slate-500 mt-1">Ensure your Campus Medicine account remains secure by updating your password periodically</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-[#79a6c1] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Lock className="w-4 h-4" /> Reset Portal Password
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs flex items-center gap-2 rounded">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs flex items-center gap-2 rounded">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Old Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50 font-mono"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50 font-mono"
              placeholder="Enter new strong password"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50 font-mono"
              placeholder="Re-enter new password"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#2c8ed6] hover:bg-[#1a5f91] disabled:bg-slate-300 text-white font-bold rounded text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
