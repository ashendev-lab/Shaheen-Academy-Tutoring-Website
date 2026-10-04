import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useContent } from '../../context/ContentContext';
import { EditableText } from '../admin/EditableText';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  Globe, 
  ShieldCheck, 
  Sparkles,
  Phone,
  CheckCircle2
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { isMidnight } = useTheme();
  const { getContent } = useContent();

  const email = getContent('contact.email', 'shaheenacademy0192@gmail.com');
  const whatsapp = getContent('contact.whatsapp', '+966539744302');
  const whatsappFormatted = getContent('contact.whatsappFormatted', '+966 53 974 4302');

  const [copiedType, setCopiedType] = useState<'email' | 'whatsapp' | null>(null);

  // Quick inquiry form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    track: 'Python Programming',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const handleCopy = (text: string, type: 'email' | 'whatsapp') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const cleanWhatsappNumber = whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    `Hello Shaheen Academy, I would like to inquire about the ${formData.track} curriculum.`
  )}`;

  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
    `Shaheen Academy Inquiry: ${formData.track}`
  )}&body=${encodeURIComponent(
    `Name: ${formData.name || 'Prospective Student'}\nTrack of Interest: ${formData.track}\n\nMessage:\n${formData.message || 'I would like more information about enrolling.'}`
  )}`;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', track: 'Python Programming', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-12 border-t border-slate-800/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-12 text-left">
        {/* Section Header */}
        <div className="space-y-2">
          <div className={`flex items-center gap-2 text-xs font-mono transition-colors ${
            isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${
              isMidnight ? 'bg-[#00e5ff]' : 'bg-emerald-400'
            }`} />
            <EditableText
              contentKey="contact.kicker"
              fallback="Direct Communication & Admissions · Academic Faculty Support"
              label="Contact Section Kicker"
              as="span"
            />
          </div>

          <EditableText
            contentKey="contact.title"
            fallback="Get in Touch with Shaheen Academy"
            label="Contact Section Main Header"
            as="h2"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          />

          <EditableText
            contentKey="contact.description"
            fallback="Have questions about our Python algorithm tracks, Linux terminal labs, or A-Level 9618 theory specs? Contact our team directly via WhatsApp or email."
            label="Contact Section Description"
            as="p"
            className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed"
          />
        </div>

        {/* Primary Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Official WhatsApp Support */}
          <div className={`rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
            isMidnight
              ? 'bg-[#040711] border-cyan-500/30 hover:border-cyan-400 shadow-lg shadow-cyan-950/20'
              : 'bg-[#0d121f]/90 border-slate-800 hover:border-emerald-500/50 shadow-xl'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isMidnight
                    ? 'bg-cyan-500/15 border border-cyan-400/40 text-[#00e5ff]'
                    : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                }`}>
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Instant Messaging Active</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Direct WhatsApp Channel
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Fastest response channel for admissions questions, course outlines, syllabus guidance, and technical inquiries.
                </p>
              </div>

              {/* Number display */}
              <div className={`p-4 rounded-xl border flex items-center justify-between font-mono text-sm sm:text-base ${
                isMidnight ? 'bg-black border-cyan-900/40' : 'bg-slate-900/90 border-slate-800'
              }`}>
                <div className="flex items-center gap-3">
                  <Phone className={`w-4 h-4 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />
                  <span className="font-bold text-white tracking-wide">
                    {whatsappFormatted}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(whatsapp, 'whatsapp')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Copy WhatsApp number"
                >
                  {copiedType === 'whatsapp' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isMidnight
                    ? 'bg-[#00e5ff] hover:bg-[#38bdf8] text-black shadow-cyan-500/25'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                }`}
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Open WhatsApp Chat</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleCopy(whatsapp, 'whatsapp')}
                className="py-3 px-4 rounded-xl border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                {copiedType === 'whatsapp' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Official Academy Email */}
          <div className={`rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
            isMidnight
              ? 'bg-[#040711] border-cyan-500/30 hover:border-cyan-400 shadow-lg shadow-cyan-950/20'
              : 'bg-[#0d121f]/90 border-slate-800 hover:border-cyan-500/50 shadow-xl'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isMidnight
                    ? 'bg-cyan-500/15 border border-cyan-400/40 text-[#00e5ff]'
                    : 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-400'
                }`}>
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Reply within 24 Hours</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Academic Admissions Email
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Formal inquiries, institutional partnership proposals, exam syllabus consultations, and student records.
                </p>
              </div>

              {/* Email display */}
              <div className={`p-4 rounded-xl border flex items-center justify-between font-mono text-xs sm:text-sm ${
                isMidnight ? 'bg-black border-cyan-900/40' : 'bg-slate-900/90 border-slate-800'
              }`}>
                <div className="flex items-center gap-2.5 truncate mr-2">
                  <Mail className={`w-4 h-4 shrink-0 ${isMidnight ? 'text-[#00e5ff]' : 'text-cyan-400'}`} />
                  <span className="font-semibold text-white truncate">
                    {email}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(email, 'email')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                  title="Copy email address"
                >
                  {copiedType === 'email' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${email}?subject=Shaheen%20Academy%20Inquiry`}
                className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isMidnight
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/30'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/30'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Send Direct Email</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleCopy(email, 'email')}
                className="py-3 px-4 rounded-xl border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                {copiedType === 'email' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Inquiry Dispatcher Form & Availability Overview */}
        <div className={`rounded-2xl border p-6 sm:p-8 transition-colors ${
          isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-[#0d121f]/90 border-slate-800'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Details & Office Hours */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">
                  Office Schedule
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Availability & Academic Guidance
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Our instructors and academic advisors actively review student questions and track enrollment requests throughout the week.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <Clock className={`w-4 h-4 shrink-0 mt-0.5 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />
                  <div>
                    <span className="font-semibold text-white block">Operating Hours</span>
                    <EditableText
                      contentKey="contact.hours"
                      fallback="Sun – Thu: 09:00 – 21:00 (GMT+3) · Rapid Response"
                      label="Office Hours & Availability"
                      as="span"
                      className="text-slate-400 text-[11px] font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
                  <div>
                    <span className="font-semibold text-white block">Certified Curriculum Focus</span>
                    <span className="text-slate-400 text-[11px]">
                      Cambridge 9618, OCR H446, AQA 7517, and POSIX Linux Administration
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Quick Inquiry Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-medium text-slate-300">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-all ${
                        isMidnight
                          ? 'bg-black border-cyan-900/60 text-white focus:border-[#00e5ff]'
                          : 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-medium text-slate-300">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. student@school.ac.uk"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-all ${
                        isMidnight
                          ? 'bg-black border-cyan-900/60 text-white focus:border-[#00e5ff]'
                          : 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-medium text-slate-300">
                    Subject / Area of Interest
                  </label>
                  <select
                    value={formData.track}
                    onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-all ${
                      isMidnight
                        ? 'bg-black border-cyan-900/60 text-white focus:border-[#00e5ff]'
                        : 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                    }`}
                  >
                    <option value="Python Programming">Python Programming & Algorithmic Complexity</option>
                    <option value="Linux SysAdmin">Linux & Systems Administration Lab</option>
                    <option value="A-Level 9618 Theory">A-Level Computer Science (Cambridge 9618 / OCR / AQA)</option>
                    <option value="Institutional Partnership">Institutional / School Partnership</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-medium text-slate-300">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your inquiry, background, or exam schedule..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-all resize-none ${
                      isMidnight
                        ? 'bg-black border-cyan-900/60 text-white focus:border-[#00e5ff]'
                        : 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                    }`}
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {formSubmitted ? (
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Thank you! Your message has been prepared.</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono">
                      Direct WhatsApp: <span className="text-slate-300">{whatsapp}</span>
                    </span>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    <a
                      href={mailtoUrl}
                      className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Via Email</span>
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                        isMidnight
                          ? 'bg-[#00e5ff] hover:bg-[#38bdf8] text-black shadow-cyan-500/20'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      <span>Dispatch to WhatsApp</span>
                    </a>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
