/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ContentProvider } from './context/ContentContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { TrackOverview } from './components/home/TrackOverview';
import { PythonHub } from './components/python/PythonHub';
import { LinuxHub } from './components/linux/LinuxHub';
import { TheoryHub } from './components/theory/TheoryHub';
import { ResourceLibrary } from './components/resources/ResourceLibrary';
import { ContactSection } from './components/contact/ContactSection';
import { MockTerminal } from './components/linux/MockTerminal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { InlineEditPopover } from './components/admin/InlineEditPopover';
import { AdminFloatingBar } from './components/admin/AdminFloatingBar';
import { Terminal, X, Moon, Eye } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState<boolean>(false);
  const { isMidnight } = useTheme();

  // Synchronize with URL hash if provided
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as NavigationTab;
    if (['home', 'python', 'linux', 'theory', 'resources', 'contact'].includes(hash)) {
      setCurrentTab(hash);
    }
  }, []);

  const handleSelectTab = (tab: NavigationTab) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTerminal = () => {
    if (currentTab === 'linux') {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else {
      setIsTerminalModalOpen(true);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 font-sans ${
      isMidnight
        ? 'bg-black text-[#f1f5f9] selection:bg-cyan-500/25 selection:text-[#00e5ff]'
        : 'bg-[#090d16] text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300'
    }`}>
      {/* Navigation Header adhering to the Top Bar Contract (Fixed Top) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onLaunchTerminal={handleOpenTerminal}
        isTerminalModalOpen={isTerminalModalOpen}
      />

      {/* Main Content Viewport Container with top padding for fixed navbar */}
      <main className="flex-1 w-full pt-16">
        {/* High-contrast active banner (quiet notice) */}
        {isMidnight && (
          <div className="bg-[#030712] border-b border-[#14233c] px-4 py-1.5 text-center text-[11px] font-mono text-[#00e5ff] flex items-center justify-center gap-2">
            <Eye className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>High-Contrast Midnight Mode active — True OLED black (#000000) & electric blue accents for low eye strain</span>
          </div>
        )}

        {currentTab === 'home' && (
          <div>
            <HeroSection
              onSelectTab={handleSelectTab}
              onLaunchTerminal={handleOpenTerminal}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
              <TrackOverview onSelectTab={handleSelectTab} />
              <ContactSection />
            </div>
          </div>
        )}

        {currentTab === 'python' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <PythonHub />
          </div>
        )}

        {currentTab === 'linux' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <LinuxHub />
          </div>
        )}

        {currentTab === 'theory' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <TheoryHub />
          </div>
        )}

        {currentTab === 'resources' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ResourceLibrary />
          </div>
        )}

        {currentTab === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ContactSection />
          </div>
        )}
      </main>

      {/* Global Terminal Quick Sandbox Modal */}
      {isTerminalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-4xl relative">
            <div className="absolute -top-10 right-0 flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Quick Sandbox Modal</span>
              <button
                onClick={() => setIsTerminalModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Close Terminal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <MockTerminal />
          </div>
        </div>
      )}

      {/* Live Admin Floating Controls Dock */}
      <AdminFloatingBar />

      {/* Inline Quick Edit Popover */}
      <InlineEditPopover />

      {/* Full CMS Admin Content Dashboard Modal */}
      <AdminDashboardModal onNavigateToTab={handleSelectTab} />

      {/* Secure Admin Login Portal Modal */}
      <AdminLoginModal />

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <ContentProvider>
          <AppContent />
        </ContentProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
