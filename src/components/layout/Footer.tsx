import React from 'react';
import { NavigationTab } from '../../types';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useContent } from '../../context/ContentContext';
import { EditableText } from '../admin/EditableText';
import { Terminal, Code2, Cpu, BookOpen, ExternalLink, ShieldCheck, Lock, LayoutDashboard, MessageSquare, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const { isAuthenticated, setIsLoginModalOpen, setIsDashboardModalOpen } = useAdminAuth();
  const { getContent } = useContent();

  const brandName = getContent('brand.name', 'Shaheen Academy');
  const email = getContent('contact.email', 'shaheenacademy0192@gmail.com');
  const whatsapp = getContent('contact.whatsapp', '+966539744302');
  const whatsappFormatted = getContent('contact.whatsappFormatted', '+966 53 974 4302');

  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="border-t border-slate-800/80 bg-[#070a12] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12 text-left">
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
              SA
            </div>
            <span className="text-base font-bold text-white tracking-tight">{brandName}</span>
          </div>

          <EditableText
            contentKey="footer.brandDesc"
            fallback="Rigorous, interactive learning platform designed for advanced computer science students, sixth-form scholars, and self-directed software engineers."
            label="Footer Brand Description"
            as="p"
            className="text-xs text-slate-400 leading-relaxed"
          />

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <EditableText
              contentKey="footer.specAlignmentText"
              fallback="Aligned with UK A-Level Specifications"
              label="Footer Exam Alignment Badge"
              as="span"
            />
          </div>
        </div>

        {/* Learning Tracks & Contact */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Curriculum & Access</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => onSelectTab('python')} 
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Python Programming & OOP</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab('linux')} 
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Linux CLI & SysAdmin Lab</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab('theory')} 
                className="hover:text-purple-400 transition-colors flex items-center gap-1.5 text-left"
              >
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>A-Level CS Theory Hub</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab('resources')} 
                className="hover:text-slate-200 transition-colors flex items-center gap-1.5 text-left"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Resource & Exam Library</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab('contact')} 
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left font-medium text-emerald-400/90"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contact & Admissions</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Direct Contact Channels & Admin Access */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Direct Inquiries</h4>
          <div className="space-y-2.5 text-xs text-slate-300">
            <a 
              href={`https://wa.me/${cleanWhatsapp}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-emerald-300 transition-colors group"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-mono">{whatsappFormatted}</span>
            </a>

            <a 
              href={`mailto:${email}`}
              className="flex items-center gap-2 hover:text-cyan-300 transition-colors truncate group"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-mono truncate">{email}</span>
            </a>

            <div className="text-[11px] text-slate-500 font-mono pt-0.5">
              <span>Rapid response · WhatsApp & Email</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            {isAuthenticated ? (
              <button
                onClick={() => setIsDashboardModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Open CMS Content Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login Portal (Ctrl+Shift+A)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <EditableText
          contentKey="footer.copyright"
          fallback="© 2026 Shaheen Academy. Designed for computer science educators, students, and practitioners."
          label="Footer Copyright Text"
          as="p"
        />
        <div className="flex items-center gap-4 text-slate-400">
          <span>Python 3.12</span>
          <span className="text-slate-700">·</span>
          <span>POSIX.1-2017</span>
          <span className="text-slate-700">·</span>
          <span>WCAG 2.1 AA Compliant</span>
        </div>
      </div>
    </footer>
  );
};
