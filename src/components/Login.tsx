import React, { useState, useEffect } from 'react';
import { Lock, User, AlertCircle, Phone, Mail, Clock, Check } from 'lucide-react';
// @ts-ignore
import collegeLogo from '../assets/images/wcmsrh_logo_1782671643394.jpg';

interface LoginProps {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('logout_success') === 'true') {
      setLogoutSuccess(true);
      localStorage.removeItem('logout_success');
      const timer = setTimeout(() => {
        setLogoutSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredUserName = username.trim();
    const enteredPassword = password.trim();
    const u = enteredUserName.toLowerCase();
    const p = enteredPassword;

    if (!u || !p) {
      setError('Please enter both User Name and Password');
      return;
    }

    const storedUserName = (localStorage.getItem('user_username') || 'Khushi1427').trim();
    const storedUserPassword = (localStorage.getItem('user_password') || 'Khushi2748121').trim();
    const storedUserNameLower = storedUserName.toLowerCase();

    const isStoredUserMatch = u === storedUserNameLower && p === storedUserPassword;
    const isHardcodedUserMatch = u === 'khushi1427' && p === 'Khushi2748121';
    const isAdminMatch = u === 'admin' && p === 'admin@123';

    if (isStoredUserMatch || isHardcodedUserMatch || isAdminMatch) {
      setError('');
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (!isAdminMatch) {
          // If the login was successful and we used either the stored profile or the default ones,
          // make sure the local storage values are synced to what was actually used to log in.
          localStorage.setItem('user_username', enteredUserName);
          localStorage.setItem('user_password', enteredPassword);
        }
        const displayName = isAdminMatch ? 'admin' : enteredUserName;
        onLogin(displayName);
      }, 600);
    } else {
      setError('Invalid User Name or Password. Please check the credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f0f4f8]">
      {/* Top Header */}
      <header className="bg-[#004a99] text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <img 
              alt="College Logo" 
              className="h-12 w-12 rounded bg-white p-1 object-contain" 
              src={collegeLogo}
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-lg md:text-xl font-bold uppercase leading-tight tracking-wide">
                World College of Medical Sciences &amp; Research
              </h1>
              <p className="text-[10px] md:text-xs opacity-90 font-medium">
                (Approved by Ministry of Health &amp; Family Welfare &amp; Affiliated to Pt. B.D Sharma University of Health Science, Rohtak, Haryana)
              </p>
            </div>
          </div>
          <div className="text-right">
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-slate-200">
          
          {/* Left Column: Contact & Info */}
          <div className="md:col-span-6 bg-slate-50 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-[#004a99] border-b pb-3 mb-6 flex items-center gap-2">
                Contact Us
              </h2>
              
              <div className="space-y-6 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#2c8ed6] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800">Staff / Faculty / Student / Parent</h3>
                    <p className="text-slate-600 mt-1">Please drop an email at</p>
                    <a href="mailto:academicsection@wcmsrh.com" className="text-blue-600 font-medium hover:underline flex items-center gap-1 mt-1">
                      <Mail className="w-4 h-4 inline" /> academicsection@wcmsrh.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t pt-4">
                  <Phone className="w-5 h-5 text-[#2c8ed6] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800">Live Support</h3>
                    <p className="text-slate-600 mt-1">Please call at</p>
                    <p className="font-semibold text-[#004a99] mt-1 text-lg">09416528226</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t pt-4">
                  <Clock className="w-5 h-5 text-[#2c8ed6] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800">Support Hours</h3>
                    <p className="text-slate-600 mt-1">Monday to Saturday</p>
                    <p className="font-medium text-slate-700 mt-0.5">09:00 AM to 05:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Campus Medicine Portal</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">Online</span>
            </div>
          </div>

          {/* Right Column: Login Form */}
          <div className="md:col-span-6 p-8 flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-blue-50 text-[#004a99] rounded-full mb-3">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Campus Medicine Login</h2>
              <p className="text-sm text-slate-500 mt-1">Access your academic and attendance portal</p>
            </div>

            {logoutSuccess && (
              <div className="p-3 mb-4 bg-green-50 border-l-4 border-green-500 text-green-800 text-xs flex items-center gap-2 rounded animate-fadeIn font-semibold">
                <Check className="w-4 h-4 shrink-0 text-green-600 bg-green-100 rounded-full p-0.5" />
                <span>Logout Successful! You have been safely logged out.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs flex items-center gap-2 rounded">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  User Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2c8ed6] focus:border-transparent text-sm bg-slate-50 transition-all duration-200"
                    placeholder="Enter User Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2c8ed6] focus:border-transparent text-sm bg-slate-50 transition-all duration-200"
                    placeholder="Enter Password"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn_submit_login"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#004a99] hover:bg-blue-800 text-white rounded font-bold text-sm shadow-md transition-colors duration-200 uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>



          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#004a99] text-white border-t-2 border-green-500 py-3">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-200">
          <div>
            © Copyright 2012 <span className="text-green-400 font-semibold">Campus Medicine</span>. All Rights Reserved. Application designed and developed by <span className="text-green-400 font-semibold">Wonesty</span>.
          </div>
          <div className="mt-1 md:mt-0">Best Viewed at 1024 x 768 Resolution</div>
        </div>
      </footer>
    </div>
  );
}
