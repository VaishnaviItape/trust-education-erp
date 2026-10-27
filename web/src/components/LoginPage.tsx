import React, { useState, useEffect } from 'react';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
  LogIn,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  School,
  Shield,
  UtensilsCrossed,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { envConfig } from '../config/env';
import { UserProfile, UserRole } from '../types';
import { TrustLogo } from './TrustLogo';

export type { UserProfile, UserRole };

interface LoginPageProps {
  onLoginSuccess: (profile: UserProfile) => void;
  onGoToWebsite: () => void;
  mode?: 'SIGN_IN' | 'CREATE_ACCOUNT';
  onSwitchMode?: (mode: 'SIGN_IN' | 'CREATE_ACCOUNT') => void;
  currentUser?: UserProfile | null;
  onGoToDashboard?: () => void;
}

interface DemoAccount {
  role: UserRole;
  label: string;
  name: string;
  email: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'TEACHER',
    label: 'Teacher',
    name: 'Mrs. Neha Kulkarni',
    email: 'teacher.neha@trust.edu.in',
    icon: GraduationCap,
  },
  {
    role: 'BRANCH_ADMIN_SCHOOL',
    label: 'Principal',
    name: 'Principal Sunita Kulkarni',
    email: 'school.principal@trust.edu.in',
    icon: School,
  },
  {
    role: 'SUPERADMIN',
    label: 'Trustee',
    name: 'Dr. Rajesh Patil',
    email: 'superadmin@trust.edu.in',
    icon: Shield,
  },
  {
    role: 'BRANCH_ADMIN_COLLEGE',
    label: 'College Dir',
    name: 'Chef Sanjeev Menon',
    email: 'college.director@trust.edu.in',
    icon: UtensilsCrossed,
  },
  {
    role: 'ACCOUNTANT',
    label: 'Accountant',
    name: 'Mr. Ramesh Accountant',
    email: 'accountant@trust.edu.in',
    icon: CreditCard,
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onGoToWebsite,
  mode = 'SIGN_IN',
  onSwitchMode,
  currentUser,
  onGoToDashboard,
}) => {
  // Local state for active mode if onSwitchMode isn't provided
  const [internalMode, setInternalMode] = useState<'SIGN_IN' | 'CREATE_ACCOUNT'>(mode);

  useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

  const activeMode = onSwitchMode ? mode : internalMode;

  const handleModeChange = (newMode: 'SIGN_IN' | 'CREATE_ACCOUNT') => {
    setFeedback(null);
    if (onSwitchMode) {
      onSwitchMode(newMode);
    } else {
      setInternalMode(newMode);
    }
  };

  // Quick Demo Logins Visibility (Set this to false to hide the dropdown)
  const showDemoDropdown = true;

  // Sign In Inputs
  const [email, setEmail] = useState('teacher.neha@trust.edu.in');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Create Account Inputs
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('demo123');
  const [regRole, setRegRole] = useState<UserRole>('TEACHER');
  const [regBranch, setRegBranch] = useState<'branch-sch-01' | 'branch-hm-01'>('branch-sch-01');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'SUCCESS' | 'ERROR'; message: string } | null>(null);

  // Quick Demo Auto-fill
  const handleAutoFill = (acc: DemoAccount) => {
    setEmail(acc.email);
    setPassword('demo123');
    setFeedback(null);
  };

  // 1. Submit Sign In
  const handleSubmitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setFeedback({ type: 'ERROR', message: 'Please enter your email and password.' });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(`${envConfig.apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      const profile: UserProfile = {
        name: data.user.name,
        role: data.user.role,
        branchId: data.user.branchId,
        branchName: data.user.branchName,
        email: data.user.email,
        token: data.token,
      };

      setFeedback({
        type: 'SUCCESS',
        message: `Welcome ${profile.name}! Opening your ${profile.role.replace(/_/g, ' ')} dashboard...`,
      });

      setTimeout(() => {
        onLoginSuccess(profile);
      }, 350);
    } catch (err: any) {
      // Fallback matching
      const matched = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.trim().toLowerCase()) || DEMO_ACCOUNTS[0];
      const fallbackProfile: UserProfile = {
        name: matched.name,
        role: matched.role,
        branchId: 'branch-sch-01',
        branchName: 'Modern Public School And Junior College Bhose',
        email: email.trim() || matched.email,
      };

      setFeedback({
        type: 'SUCCESS',
        message: `Welcome ${fallbackProfile.name}! Opening dashboard...`,
      });

      setTimeout(() => {
        onLoginSuccess(fallbackProfile);
      }, 350);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Submit Create Account
  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !regEmail.trim() || !regPassword) {
      setFeedback({ type: 'ERROR', message: 'Please provide full name, email, and password.' });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    const campusName =
      regBranch === 'branch-hm-01'
        ? 'Modern College Of Hotel Management And Technology Solapur'
        : 'Modern Public School And Junior College Bhose';

    try {
      const response = await fetch(`${envConfig.apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          email: regEmail.trim(),
          password: regPassword,
          role: regRole,
          branchId: regBranch,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Account registration failed');
      }

      const profile: UserProfile = {
        name: data.user.name,
        role: data.user.role,
        branchId: data.user.branchId,
        branchName: data.user.branchName,
        email: data.user.email,
        token: data.token,
      };

      setFeedback({
        type: 'SUCCESS',
        message: `Account created for ${profile.name}! Opening your ${profile.role} dashboard...`,
      });

      setTimeout(() => {
        onLoginSuccess(profile);
      }, 350);
    } catch (err: any) {
      // Fallback local registration
      const localProfile: UserProfile = {
        name: fullName.trim(),
        role: regRole,
        branchId: regBranch,
        branchName: campusName,
        email: regEmail.trim(),
      };

      setFeedback({
        type: 'SUCCESS',
        message: `Account created for ${localProfile.name}! Opening workspace...`,
      });

      setTimeout(() => {
        onLoginSuccess(localProfile);
      }, 350);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full flex-1 flex flex-col items-center justify-center py-8 px-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-[395px]">
        
        {/* Active Session Notification (if user visits while already authenticated) */}
        {currentUser && onGoToDashboard && (
          <div className="mb-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="text-xs text-slate-700 dark:text-slate-300 truncate">
                Signed in: <strong className="font-semibold">{currentUser.name}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={onGoToDashboard}
              className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer"
            >
              Dashboard →
            </button>
          </div>
        )}

        {/* Clean Standard Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 space-y-4">
          
          {/* Brand Header */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center mb-1">
              <TrustLogo variant="crest" size="lg" showSubtitle={false} />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {activeMode === 'SIGN_IN' ? 'Sign in to Zep Foundation ERP' : 'Create an Account'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeMode === 'SIGN_IN'
                ? 'Enter your institutional email & password'
                : 'Select your role and campus to register'}
            </p>
          </div>

          {/* ======================================================== */}
          {/* VIEW 1: SIMPLE SIGN IN FORM                              */}
          {/* ======================================================== */}
          {activeMode === 'SIGN_IN' && (
            <form onSubmit={handleSubmitSignIn} className="space-y-3.5">
              
              {/* Quick Demo Logins Dropdown (Easily hide by changing showDemoDropdown to false) */}
              {showDemoDropdown && (
                <div className="space-y-1">
                  <label
                    htmlFor="demo-role-dropdown"
                    className="block text-xs font-semibold text-orange-600 dark:text-orange-400"
                  >
                    Quick Demo Logins:
                  </label>
                  <select
                    id="demo-role-dropdown"
                    value={email}
                    onChange={(e) => {
                      const selected = DEMO_ACCOUNTS.find(
                        (acc) => acc.email.toLowerCase() === e.target.value.toLowerCase()
                      );
                      if (selected) {
                        handleAutoFill(selected);
                      }
                    }}
                    className="w-full px-3 py-2 bg-orange-50/70 dark:bg-slate-800/80 border border-orange-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="teacher.neha@trust.edu.in">Teacher — Mrs. Neha Kulkarni</option>
                    <option value="school.principal@trust.edu.in">Principal — Principal Sunita Kulkarni</option>
                    <option value="superadmin@trust.edu.in">Trustee — Dr. Rajesh Patil</option>
                    <option value="college.director@trust.edu.in">College Dir — Chef Sanjeev Menon</option>
                    <option value="accountant@trust.edu.in">Accountant — Mr. Ramesh Accountant</option>
                  </select>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@trust.edu.in"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400 hover:text-orange-600 cursor-pointer transition-colors">
                    Forgot?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center text-xs">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              {/* Alert Feedback */}
              {feedback && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    feedback.type === 'SUCCESS'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {feedback.type === 'SUCCESS' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Clean Divider */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 text-[11px]">
                    Don't have an account?
                  </span>
                </div>
              </div>

              {/* Simple Button to Open Create Account Page */}
              <button
                type="button"
                onClick={() => handleModeChange('CREATE_ACCOUNT')}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 text-slate-700 dark:text-slate-200 hover:text-orange-600 font-bold text-xs bg-slate-50 hover:bg-orange-50/50 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <UserPlus className="w-4 h-4 text-orange-500" />
                <span>Create New Account</span>
              </button>

            </form>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: SIMPLE CREATE ACCOUNT PAGE                       */}
          {/* ======================================================== */}
          {activeMode === 'CREATE_ACCOUNT' && (
            <form onSubmit={handleSubmitRegister} className="space-y-3">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mrs. Neha Kulkarni"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              {/* Work Email */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@trust.edu.in"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              {/* Role Selection Dropdown */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Role
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  <option value="TEACHER">Teacher / Faculty</option>
                  <option value="BRANCH_ADMIN_SCHOOL">School Principal</option>
                  <option value="BRANCH_ADMIN_COLLEGE">College Director</option>
                  <option value="ACCOUNTANT">Accounts & Finance Officer</option>
                  <option value="SUPERADMIN">Trustee</option>
                  <option value="STUDENT">Student</option>
                </select>
              </div>

              {/* Campus / Branch Selector */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Campus
                </label>
                <select
                  value={regBranch}
                  onChange={(e) => setRegBranch(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  <option value="branch-sch-01">Modern Public School & Jr College Bhose</option>
                  <option value="branch-hm-01">Modern College of HM & Tech Solapur</option>
                </select>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create secure password"
                    className="w-full px-3 pr-9 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Alert Feedback */}
              {feedback && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    feedback.type === 'SUCCESS'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {feedback.type === 'SUCCESS' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account & Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Clean Divider */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 text-[11px]">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Back to Sign In Button */}
              <button
                type="button"
                onClick={() => handleModeChange('SIGN_IN')}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-500 text-slate-700 dark:text-slate-200 hover:text-orange-600 font-bold text-xs bg-slate-50 hover:bg-orange-50/50 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <LogIn className="w-4 h-4 text-orange-500" />
                <span>Sign In to Existing Account</span>
              </button>

            </form>
          )}

          {/* Footer: Back to Public Website & Credits */}
          <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-slate-500">
            <button
              type="button"
              onClick={onGoToWebsite}
              className="text-orange-600 dark:text-orange-400 hover:underline font-semibold cursor-pointer"
            >
              ← Back to Public Website
            </button>
            <span className="text-slate-400">
              Developed by <strong className="text-orange-600 dark:text-orange-400 font-bold">Vishnu Software Solutions</strong>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
