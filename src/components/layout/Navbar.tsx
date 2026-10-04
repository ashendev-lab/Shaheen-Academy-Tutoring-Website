import React, { useState } from 'react';
import { NavigationTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useContent } from '../../context/ContentContext';
import { Terminal, Code2, Cpu, BookOpen, Layers, Menu, X, ArrowUpRight, Moon, Shield, ShieldCheck, Lock, LayoutDashboard, MessageSquare } from 'lucide-react';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onLaunchTerminal: () => void;
  isTerminalModalOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onLaunchTerminal,
  isTerminalModalOpen = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMidnight, toggleMidnight } = useTheme();
  const { isAuthenticated, setIsLoginModalOpen, setIsDashboardModalOpen } = useAdminAuth();
  const { getContent } = useContent();

  const brandName = getContent('brand.name', 'Shaheen Academy');

  const navLinks: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
    { id: 'python', label: 'Python Track', icon: <Code2 className="w-4 h-4" /> },
    { id: 'linux', label: 'Linux Hub', icon: <Terminal className="w-4 h-4" /> },
    { id: 'theory', label: 'A-Level Theory', icon: <Cpu className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 w-full backdrop-blur-md border-b transition-colors midnight-header-bg ${
      isMidnight 
        ? 'bg-black/95 border-[#142542]' 
        : 'bg-[#090d16]/85 border-slate-800/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark adhering to the Top Bar Contract */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-md py-1"
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-colors ${
            isMidnight
              ? 'bg-cyan-500/15 border border-cyan-400/40 text-[#00e5ff]'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}>
            SA
          </div>
          <span className={`text-lg font-bold tracking-tight text-white transition-colors font-sans ${
            isMidnight ? 'group-hover:text-[#00e5ff]' : 'group-hover:text-emerald-400'
          }`}>
            {brandName}
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-md relative flex items-center gap-2 whitespace-nowrap focus:outline-none focus-visible:ring-2 ${
                  isActive
                    ? isMidnight
                      ? 'text-[#00e5ff] bg-cyan-950/40 font-semibold'
                      : 'text-emerald-400 bg-emerald-500/10'
                    : isMidnight
                    ? 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {isActive && (
                  <span className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${
                    isMidnight ? 'bg-[#00e5ff]' : 'bg-emerald-400'
                  }`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions + Admin Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Admin Portal Button */}
          {isAuthenticated ? (
            <button
              onClick={() => setIsDashboardModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                isMidnight
                  ? 'bg-cyan-950/40 border-cyan-400/50 text-[#00e5ff] hover:bg-cyan-900/50'
                  : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50'
              }`}
              title="Open Admin CMS Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Admin CMS</span>
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-700/80 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
              title="Secure Admin Login (Ctrl+Shift+A)"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* High-Contrast Midnight Mode Toggle */}
          <button
            onClick={toggleMidnight}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 ${
              isMidnight
                ? 'bg-black text-[#00e5ff] border-cyan-400/50 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/70 text-slate-300 border-slate-700/80 hover:text-white hover:border-slate-600'
            }`}
            title={isMidnight ? 'Disable Midnight Mode' : 'Enable High-Contrast Midnight Mode (True Black & Electric Blue)'}
            aria-pressed={isMidnight}
            aria-label="Toggle High-Contrast Midnight Mode"
          >
            <Moon className={`w-3.5 h-3.5 transition-transform ${isMidnight ? 'text-[#00e5ff] rotate-[-15deg]' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Midnight</span>
            {isMidnight && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
            )}
          </button>

          {/* Quick Terminal Launcher with subtle ping / pulse animation when closed */}
          <div className="relative hidden sm:inline-flex items-center">
            {!isTerminalModalOpen && (
              <span
                className={`absolute -inset-1 rounded-xl blur-xs animate-pulse pointer-events-none transition-opacity duration-300 ${
                  isMidnight ? 'bg-cyan-400/25' : 'bg-emerald-400/25'
                }`}
                aria-hidden="true"
              />
            )}

            <button
              onClick={onLaunchTerminal}
              className={`relative inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold font-mono rounded-lg transition-all shadow-sm focus:outline-none focus-visible:ring-2 whitespace-nowrap ${
                isMidnight
                  ? 'text-[#00e5ff] bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-400/40 hover:border-cyan-400/80 shadow-cyan-950/30'
                  : 'text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-500/40 hover:border-emerald-500/80 shadow-emerald-950/30'
              }`}
              title={isTerminalModalOpen ? 'Terminal Sandbox Active' : 'Open Quick Linux Terminal (Shortcut Sandbox)'}
            >
              {/* Subtle ping beacon indicating active shortcut when closed */}
              {!isTerminalModalOpen && (
                <span className="relative flex h-2 w-2 mr-0.5" aria-hidden="true">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isMidnight ? 'bg-[#00e5ff]' : 'bg-emerald-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isMidnight ? 'bg-[#00e5ff]' : 'bg-emerald-400'
                    }`}
                  />
                </span>
              )}

              <Terminal className={`w-3.5 h-3.5 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />
              <span>Terminal</span>
              <ArrowUpRight className={`w-3 h-3 ${isMidnight ? 'text-cyan-400/80' : 'text-emerald-400/80'}`} />
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-4 pt-2 pb-4 space-y-1.5 ${
          isMidnight ? 'bg-black/98 border-[#142542]' : 'bg-[#090d16]/95 border-slate-800'
        }`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === link.id
                  ? isMidnight
                    ? 'text-[#00e5ff] bg-cyan-950/40'
                    : 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}

          {/* Mobile Admin Link */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between px-2 py-1">
            <span className="text-xs text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Admin Panel</span>
            </span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAuthenticated) {
                  setIsDashboardModalOpen(true);
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-slate-800 text-slate-200 border border-slate-700"
            >
              {isAuthenticated ? 'Open CMS' : 'Login'}
            </button>
          </div>

          {/* Midnight mode toggle in mobile drawer */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between px-2 py-1">
            <span className="text-xs text-slate-400 flex items-center gap-2">
              <Moon className="w-4 h-4 text-cyan-400" />
              <span>Midnight Mode (OLED)</span>
            </span>
            <button
              onClick={toggleMidnight}
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-colors ${
                isMidnight
                  ? 'bg-cyan-500/20 text-[#00e5ff] border border-cyan-400/40'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {isMidnight ? 'Active' : 'Off'}
            </button>
          </div>

          <div className="pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchTerminal();
              }}
              className={`relative w-full flex items-center justify-center gap-2 py-2 text-xs font-mono font-medium rounded-lg border transition-all ${
                isMidnight
                  ? 'text-[#00e5ff] bg-cyan-950/40 border-cyan-400/30'
                  : 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30'
              }`}
            >
              {!isTerminalModalOpen && (
                <span className="relative flex h-2 w-2 mr-1" aria-hidden="true">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isMidnight ? 'bg-[#00e5ff]' : 'bg-emerald-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isMidnight ? 'bg-[#00e5ff]' : 'bg-emerald-400'
                    }`}
                  />
                </span>
              )}
              <Terminal className="w-4 h-4" />
              <span>Launch Mock Terminal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

