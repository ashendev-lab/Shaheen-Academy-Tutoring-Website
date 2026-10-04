import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useContent } from '../../context/ContentContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  ShieldCheck, 
  Edit3, 
  LayoutDashboard, 
  LogOut, 
  Sparkles, 
  RotateCcw, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  Check,
  MousePointerClick
} from 'lucide-react';

export const AdminFloatingBar: React.FC = () => {
  const { 
    isAuthenticated, 
    adminUser, 
    isEditModeActive, 
    setIsEditModeActive, 
    setIsDashboardModalOpen, 
    logout 
  } = useAdminAuth();
  const { getModifiedCount, resetAllContent } = useContent();
  const { isMidnight } = useTheme();

  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  if (!isAuthenticated) return null;

  const modifiedCount = getModifiedCount();

  const handleResetConfirm = () => {
    resetAllContent();
    setShowConfirmReset(false);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-fadeIn">
        <button
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-2 px-3 py-2 rounded-full border shadow-2xl backdrop-blur-md transition-all ${
            isMidnight
              ? 'bg-black/90 border-cyan-400/50 text-[#00e5ff] shadow-cyan-950/40'
              : 'bg-slate-900/90 border-emerald-500/50 text-emerald-400 shadow-emerald-950/40'
          }`}
          title="Expand Admin Live Control Bar"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-mono font-bold">Admin Active</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Admin control panel" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-4xl animate-slideUp">
      <div className={`p-2.5 sm:p-3 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 transition-colors ${
        isMidnight
          ? 'bg-black/95 border-cyan-500/40 shadow-cyan-950/40 text-slate-100'
          : 'bg-[#0b101c]/95 border-slate-700/80 shadow-2xl text-slate-100'
      }`}>
        {/* Left: Admin Status & Identity */}
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            isMidnight ? 'bg-cyan-500/20 text-[#00e5ff]' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            <ShieldCheck className="w-4 h-4" />
          </div>

          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">Admin Session</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 truncate max-w-[190px]">
              {adminUser?.email || 'admin@shaheen.academy'}
            </p>
          </div>
        </div>

        {/* Center: Live Visual Click-to-Edit Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModeActive(!isEditModeActive)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
              isEditModeActive
                ? isMidnight
                  ? 'bg-cyan-500/20 border-cyan-400 text-[#00e5ff] shadow-cyan-500/20 ring-1 ring-cyan-400'
                  : 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-emerald-500/20 ring-1 ring-emerald-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={isEditModeActive ? 'Click-to-Edit active: click any text on the page to edit it!' : 'Switch to normal Browse Mode'}
          >
            <div className="relative flex items-center justify-center">
              {isEditModeActive ? (
                <span className="relative flex h-2 w-2 mr-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-500 mr-0.5" />
              )}
            </div>
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>
              {isEditModeActive ? 'Click-to-Edit: ON' : 'Browse Mode'}
            </span>
          </button>

          {/* CMS Dashboard Button */}
          <button
            onClick={() => setIsDashboardModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              isMidnight
                ? 'bg-[#00e5ff] hover:bg-[#38bdf8] text-black shadow-cyan-500/25'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
            }`}
            title="Open comprehensive CMS Dashboard with all editable texts and CTAs"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Right: Metrics & Controls */}
        <div className="flex items-center gap-2">
          {modifiedCount > 0 && (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{modifiedCount} edited</span>
            </span>
          )}

          {/* Minimize bar */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Minimize Bar"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
            title="Logout of Admin Panel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
