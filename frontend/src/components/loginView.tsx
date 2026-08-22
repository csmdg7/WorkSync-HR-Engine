import React, { useState } from 'react';
import { AuthUser } from '../types';

interface LoginViewProps {
  onLogin: (user: AuthUser) => void;
  onRegisterUser?: (user: AuthUser) => void;
}

const DEMO_ACCOUNTS: (AuthUser & { demoRoleBadge: string; passwordHint: string })[] = [
  {
    id: 'usr-1',
    name: 'Chandana Rukmini',
    email: 'chandana@dayflow.io',
    role: 'Super Admin (HR Lead)',
    department: 'Executive HR',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHUtv8TZrwdhV01R9RcvbOwWfQrM9EG5KMANhkGZnCEsxzcf0EeOnZp0vABNBCRlCzSBOahT5XaHNWZoQfB_DLfkyDI2qe5wDc9D79CitLcHrlst3DvAIe3W6FWkQqikLdX2OtIwDVgMlwqHzuQf5138JlT1oM0eeRLx37uSeJYJqP86iq8_ktvjfGgIpHF5U5XGb4Uc-NeUslsbmmoBvIYtRzc3rf_M_PllsIS7cbQN-GC2OTlsr8cA',
    demoRoleBadge: 'Super Admin',
    passwordHint: 'admin123'
  },
  {
    id: 'usr-2',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@dayflow.io',
    role: 'Senior Product Designer',
    department: 'Product & Design',
    demoRoleBadge: 'HR Specialist',
    passwordHint: 'pass123'
  },
  {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@dayflow.io',
    role: 'DevOps Architect',
    department: 'Engineering',
    demoRoleBadge: 'Team Lead',
    passwordHint: 'pass123'
  }
];

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegisterUser }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('HR Specialist');
  const [signupDept, setSignupDept] = useState('People Operations');

  // Sign in fields
  const [email, setEmail] = useState('chandana@dayflow.io');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }
    if (!signupPassword.trim() || signupPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: fullName.trim(),
        email: signupEmail.trim(),
        role: signupRole,
        department: signupDept
      };

      if (rememberMe) {
        localStorage.setItem('dayflow_auth_user', JSON.stringify(newUser));
      }
      if (onRegisterUser) {
        onRegisterUser(newUser);
      }
      setIsLoading(false);
      onLogin(newUser);
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }

    if (!password.trim() || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const matched = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
      const userToLogin: AuthUser = matched || {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: email.trim(),
        role: 'HR Officer',
        department: 'Operations'
      };

      if (rememberMe) {
        localStorage.setItem('dayflow_auth_user', JSON.stringify(userToLogin));
      } else {
        sessionStorage.setItem('dayflow_auth_user', JSON.stringify(userToLogin));
      }

      setIsLoading(false);
      onLogin(userToLogin);
    }, 600);
  };

  const handleQuickLogin = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword(account.passwordHint);
    setIsLoading(true);

    setTimeout(() => {
      if (rememberMe) {
        localStorage.setItem('dayflow_auth_user', JSON.stringify(account));
      }
      setIsLoading(false);
      onLogin(account);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F9] flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#0058BE] selection:text-white">
      {/* Top Brand Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-base shadow-sm">
            HR
          </div>
          <div>
            <span className="text-lg font-bold text-[#1B1B1D] tracking-tight block leading-tight">
              DayFlow HR Command
            </span>
            <span className="text-xs text-[#76777D] font-normal">Enterprise Workforce Engine</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#76777D] bg-white border border-[#E4E2E4] px-3 py-1.5 rounded-full shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System v2.4 Online & Secured</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md my-auto py-8">
        <div className="bg-white border border-[#E4E2E4] rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-black via-[#0058BE] to-black" />

          {/* Toggle Mode Tab */}
          <div className="flex bg-[#F6F3F5] p-1 rounded-xl mb-6 border border-[#E4E2E4]">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signin' ? 'bg-white text-black shadow-xs' : 'text-[#76777D] hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup' ? 'bg-white text-black shadow-xs' : 'text-[#76777D] hover:text-black'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-[#1B1B1D] tracking-tight">
              {mode === 'signin' ? 'Sign in to Command Center' : 'Create HR Admin Account'}
            </h2>
            <p className="text-xs text-[#76777D] mt-1 leading-relaxed">
              {mode === 'signin'
                ? 'Enter your corporate credentials to access workforce administration and payroll.'
                : 'Register your admin profile to manage organizational rosters, attendance, and approvals.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <span className="material-symbols-outlined text-[18px] shrink-0 text-rose-600">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1B1B1D] uppercase tracking-wider mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777D] text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F6F3F5] border border-[#E4E2E4] focus:border-[#0058BE] focus:bg-white rounded-xl focus:outline-none transition-all text-[#1B1B1D]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#1B1B1D] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Demo password: admin123')}
                    className="text-[11px] font-semibold text-[#0058BE] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777D] text-[18px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#F6F3F5] border border-[#E4E2E4] focus:border-[#0058BE] focus:bg-white rounded-xl focus:outline-none transition-all text-[#1B1B1D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76777D] hover:text-[#1B1B1D] transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#C6C6CD] text-[#0058BE] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#45464D] font-medium select-none">Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black hover:bg-[#3F465C] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-99 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1B1B1D] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Henderson"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-[#F6F3F5] border border-[#E4E2E4] focus:border-[#0058BE] focus:bg-white rounded-xl focus:outline-none transition-all text-[#1B1B1D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B1B1D] uppercase tracking-wider mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="alex.henderson@dayflow.io"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-[#F6F3F5] border border-[#E4E2E4] focus:border-[#0058BE] focus:bg-white rounded-xl focus:outline-none transition-all text-[#1B1B1D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#1B1B1D] uppercase tracking-wider mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    placeholder="HR Lead"
                    required
                    className="w-full px-3 py-2 text-xs bg-[#F6F3F5] border border-[#E4E2E4] focus:border-[#0058BE] focus:bg-white rounded-xl focus:outline-none transition-all text-[#1B1B1D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B1B1D] uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={signupDept}
                    onChange={(e) => setSignupDept(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-[#F6F3F5] border border-[#E4E2E4] focus:border-[#0058BE] focus:bg-white rounded-xl focus:outline-none transition-all text-[#1B1B1D]"
                  >
                    <option value="Executive HR">Executive HR</option>
                    <option value="People Operations">People Operations</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Finance & Operations">Finance & Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B1B1D] uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Minimum 4 characters"
                    required
                    className="w-full px-3.5 pr-10 py-2 text-sm bg-[#F6F3F5] border border-[#E4E2E4] focus:border-[#0058BE] focus:bg-white rounded-xl focus:outline-none transition-all text-[#1B1B1D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#76777D] hover:text-[#1B1B1D] transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black hover:bg-[#3F465C] text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-99 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create HR Account</span>
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Logins */}
          <div className="mt-5 pt-4 border-t border-[#F0EDEF]">
            <span className="text-[11px] font-bold text-[#76777D] uppercase tracking-wider block mb-2.5">
              1-Click Demo Profiles:
            </span>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  className="w-full p-2.5 border border-[#E4E2E4] hover:border-[#0058BE] hover:bg-blue-50/40 rounded-xl flex items-center justify-between text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#EAE7E9] text-[#1B1B1D] font-bold text-xs flex items-center justify-center group-hover:bg-[#0058BE] group-hover:text-white transition-colors">
                      {acc.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1B1B1D] group-hover:text-[#0058BE]">
                        {acc.name}
                      </p>
                      <p className="text-[10px] text-[#76777D]">{acc.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-800 text-slate-600 rounded-full transition-colors">
                    {acc.demoRoleBadge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#76777D] py-2 border-t border-[#E4E2E4]/60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
          <span>End-to-End Enterprise Access Control & Audit Log Enforced</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security Whitepaper</span>
        </div>
      </div>
    </div>
  );
};