import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Shield, Lock, Mail, Eye, EyeOff, X, AlertTriangle, KeyRound, CheckCircle2, Clock } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    login,
    lockoutSeconds,
    loginAttempts
  } = useAdminAuth();
  const { isMidnight } = useTheme();

  const [email, setEmail] = useState<string>('shaheenacademy0192@gmail.com');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      } else {
        setPassword('');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unexpected login error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const isLocked = lockoutSeconds > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all transform animate-scaleUp ${
          isMidnight
            ? 'bg-[#040711] border-cyan-500/40 shadow-cyan-950/50 text-slate-100'
            : 'bg-[#0d1322] border-slate-700 shadow-2xl text-slate-100'
        }`}
      >
        {/* Modal Top Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${
          isMidnight ? 'border-cyan-950/80 bg-black/60' : 'border-slate-800 bg-slate-900/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isMidnight
                ? 'bg-cyan-500/15 border border-cyan-400/40 text-[#00e5ff]'
                : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
            }`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Admin Control Portal</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  SECURE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Authorized Academy Personnel Authentication
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Login Window"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Lockout Notice */}
          {isLocked && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
              <Clock className="w-5 h-5 text-red-400 shrink-0 animate-spin" />
              <div>
                <p className="font-bold">Security Lockout Active</p>
                <p className="text-red-300 text-[11px]">
                  Too many consecutive failed attempts. Retry in <span className="font-mono font-bold text-white">{lockoutSeconds}s</span>.
                </p>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {!isLocked && errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* Email / Username field */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono font-semibold uppercase text-slate-300">
              Admin Email / Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                disabled={isLocked || isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shaheen.academy"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  isMidnight
                    ? 'bg-black border-cyan-900/60 text-white focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]'
                    : 'bg-slate-900/90 border-slate-700 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                }`}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-semibold uppercase text-slate-300">
                Password
              </label>
              {loginAttempts > 0 && loginAttempts < 5 && (
                <span className="text-[11px] font-mono text-amber-400">
                  {loginAttempts}/5 attempts used
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLocked || isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  isMidnight
                    ? 'bg-black border-cyan-900/60 text-white focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]'
                    : 'bg-slate-900/90 border-slate-700 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLocked || isLoading}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              isLocked
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : isMidnight
                ? 'bg-[#00e5ff] hover:bg-[#38bdf8] text-black shadow-cyan-500/25'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2 font-mono">
                <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Verifying Security Credentials...
              </span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Authenticate & Access CMS</span>
              </>
            )}
          </button>
        </form>

        {/* Security badges footer */}
        <div className={`px-6 py-3 border-t text-[11px] text-slate-500 flex items-center justify-between ${
          isMidnight ? 'border-cyan-950/60 bg-black/40' : 'border-slate-800 bg-slate-900/30'
        }`}>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Session (8h)</span>
          </div>
          <span>Brute-force Protected</span>
        </div>
      </div>
    </div>
  );
};
