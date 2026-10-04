import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent, ContentItemMeta, ContentEditHistoryItem } from '../types/admin';
import { useAdminAuth } from './AdminAuthContext';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  // Global Branding
  'brand.name': 'Shaheen Academy',
  'brand.tagline': 'Rigorous Computer Science, Systems & Theory',

  // Hero Section
  'hero.kicker': 'Academic Rigor & Production Engineering · Sixth-Form & College Curriculum',
  'hero.title': 'Master Code, Infrastructure, and Theory.',
  'hero.description': 'An advanced educational academy connecting idiomatic Python algorithm design, real POSIX Linux systems administration, and A-Level Computer Science theoretical specifications.',
  'hero.primaryCta': 'Explore Tracks',
  'hero.secondaryCta': 'Launch Web Terminal',
  'hero.stat1Value': '3 Core',
  'hero.stat1Label': 'Unified Learning Tracks',
  'hero.stat2Value': '100%',
  'hero.stat2Label': 'Interactive In-Browser Labs',
  'hero.stat3Value': 'OCR / AQA',
  'hero.stat3Label': 'Exam Board Alignment',
  'hero.badgeText': 'POSIX & Python Runtime',
  'hero.badgeStatus': 'Ready for exploration',

  // Pillars & Tracks Overview
  'pillars.kicker': 'Structured Learning Hubs · Comprehensive Syllabus Modules',
  'pillars.title': 'The Three Educational Pillars',
  'pillars.description': 'Each track is designed with practical terminal sandboxes, conceptual mini-games, and academic examination specifications.',
  'pillars.pythonTitle': 'Python Programming & Algorithms',
  'pillars.pythonSubtitle': 'From Fundamentals to Algorithmic Complexity',
  'pillars.pythonDesc': 'Master clean procedural coding, object-oriented paradigms, dynamic memory structures, and high-performance algorithms essential for both academic excellence and production systems.',
  'pillars.pythonCta': 'Explore Python Track',
  'pillars.linuxTitle': 'Linux & Systems Administration',
  'pillars.linuxSubtitle': 'Master the Terminal, Kernel Interfaces, and Automation',
  'pillars.linuxDesc': 'Understand the operating system from the ground up. Master command-line navigation, file system permissions, Unix pipes, process scheduling, and bash automation.',
  'pillars.linuxCta': 'Launch Linux Lab',
  'pillars.theoryTitle': 'A-Level Computer Science Theory',
  'pillars.theorySubtitle': 'Rigorous Academic Specification Mastery',
  'pillars.theoryDesc': 'Boolean algebra, processor architecture, F-D-E cycles, networking protocols, and Cambridge 9618 / OCR / AQA mark-scheme rigor.',
  'pillars.theoryCta': 'Explore Theory Hub',

  // Python Track Hub
  'pythonHub.kicker': 'Track 01 · Idiomatic Code & Big-O Complexity',
  'pythonHub.title': 'Python 3.12 & Algorithmic Design',
  'pythonHub.description': 'Deep dive into clean procedural coding, object-oriented architectures, dynamic data structures, and computational complexity.',
  'pythonHub.runCta': 'Run Code Simulation',
  'pythonHub.matcherTitle': 'Interactive Syntax & Concept Matcher',
  'pythonHub.matcherDesc': 'Pair modern Python syntax constructs, dunder methods, and data structures with their algorithmic definitions.',

  // Linux Track Hub
  'linuxHub.kicker': 'Track 02 · POSIX Linux & Systems Engineering',
  'linuxHub.title': 'Linux & SysAdmin Terminal Lab',
  'linuxHub.description': 'From command-line filesystem traversal and stream redirection to octal permissions math, process signals, and production bash scripting.',
  'linuxHub.terminalTitle': 'Simulated Linux CLI Environment',
  'linuxHub.terminalDesc': 'Interact directly with the virtual filesystem. Type commands like ls -la, cat notes.txt, or chmod 755 script.py.',
  'linuxHub.launchSandboxCta': 'Launch Interactive Sandbox',
  'linuxHub.calcTitle': 'Interactive Octal Permissions Calculator',
  'linuxHub.calcDesc': 'Toggle read (4), write (2), and execute (1) bitmasks for User, Group, and Other.',

  // A-Level Theory Hub
  'theoryHub.kicker': 'Track 03 · AQA / OCR / Cambridge 9618 Specification',
  'theoryHub.title': 'A-Level Computer Science Theory',
  'theoryHub.description': 'Rigorous foundations in Boolean logic simplification, internal processor registers (PC, MAR, MDR, ACC), TCP/IP network protocol stacks, and two’s complement data arithmetic.',
  'theoryHub.quizTitle': 'Interactive A-Level Exam Spec Knowledge Quiz',
  'theoryHub.quizDesc': 'Instant-feedback examination questions with mark-scheme explanations, Boolean logic rules, and step-by-step solutions.',
  'theoryHub.truthTableTitle': 'Interactive Logic Gate Truth Table Analyzer',
  'theoryHub.truthTableDesc': 'Toggle Boolean inputs A and B to observe hardware logic output waveforms and De Morgan equivalence in real time.',

  // Resources Library
  'resourcesHub.kicker': 'Academic Vault & Cheat Sheets',
  'resourcesHub.title': 'Course Resources & Examination Revision',
  'resourcesHub.description': 'Searchable, multi-filterable repository for cheat sheets, past papers, exam spec notes, and code snippets.',
  'resourcesHub.downloadAllCta': 'Browse Resources Vault',

  // Contact
  'contact.kicker': 'Direct Communication & Admissions · Academic Faculty Support',
  'contact.title': 'Get in Touch with Shaheen Academy',
  'contact.description': 'Have questions about our Python algorithm tracks, Linux terminal labs, or A-Level 9618 theory specs? Contact our team directly via WhatsApp or email.',
  'contact.email': 'shaheenacademy0192@gmail.com',
  'contact.whatsapp': '+966539744302',
  'contact.whatsappFormatted': '+966 53 974 4302',
  'contact.hours': 'Sun – Thu: 09:00 – 21:00 (GMT+3) · Rapid Response',
  'contact.location': 'Saudi Arabia / Global Online Academy',

  // Footer & Branding
  'footer.brandDesc': 'Rigorous, interactive learning platform designed for advanced computer science students, sixth-form scholars, and self-directed software engineers.',
  'footer.specAlignmentText': 'Aligned with UK A-Level Specifications (OCR H446, AQA 7517, Cambridge 9618, Edexcel 9CS0)',
  'footer.copyright': '© 2026 Shaheen Academy. Designed for computer science educators, students, and practitioners.'
};

export const CONTENT_METADATA_LIST: ContentItemMeta[] = [
  // Global Branding
  { key: 'brand.name', category: 'branding', label: 'Academy Name / Brand Wordmark', type: 'label' },
  { key: 'brand.tagline', category: 'branding', label: 'Academy Tagline', type: 'text' },

  // Hero
  { key: 'hero.kicker', category: 'hero', label: 'Hero Top Kicker Notice', type: 'kicker' },
  { key: 'hero.title', category: 'hero', label: 'Hero Main H1 Title', type: 'header', multiline: true },
  { key: 'hero.description', category: 'hero', label: 'Hero Lead Description', type: 'text', multiline: true },
  { key: 'hero.primaryCta', category: 'hero', label: 'Hero Primary CTA Button', type: 'cta' },
  { key: 'hero.secondaryCta', category: 'hero', label: 'Hero Secondary CTA Button', type: 'cta' },
  { key: 'hero.stat1Value', category: 'hero', label: 'Hero Stat 1 Value', type: 'stat' },
  { key: 'hero.stat1Label', category: 'hero', label: 'Hero Stat 1 Label', type: 'label' },
  { key: 'hero.stat2Value', category: 'hero', label: 'Hero Stat 2 Value', type: 'stat' },
  { key: 'hero.stat2Label', category: 'hero', label: 'Hero Stat 2 Label', type: 'label' },
  { key: 'hero.stat3Value', category: 'hero', label: 'Hero Stat 3 Value', type: 'stat' },
  { key: 'hero.stat3Label', category: 'hero', label: 'Hero Stat 3 Label', type: 'label' },
  { key: 'hero.badgeText', category: 'hero', label: 'Hero Asset Badge Title', type: 'label' },
  { key: 'hero.badgeStatus', category: 'hero', label: 'Hero Asset Badge Subtitle', type: 'label' },

  // Pillars
  { key: 'pillars.kicker', category: 'pillars', label: 'Tracks Section Kicker', type: 'kicker' },
  { key: 'pillars.title', category: 'pillars', label: 'Tracks Section H2 Title', type: 'header' },
  { key: 'pillars.description', category: 'pillars', label: 'Tracks Section Intro', type: 'text', multiline: true },
  { key: 'pillars.pythonTitle', category: 'pillars', label: 'Python Track Card Title', type: 'header' },
  { key: 'pillars.pythonSubtitle', category: 'pillars', label: 'Python Track Card Subtitle', type: 'text' },
  { key: 'pillars.pythonDesc', category: 'pillars', label: 'Python Track Card Description', type: 'text', multiline: true },
  { key: 'pillars.pythonCta', category: 'pillars', label: 'Python Track Card CTA Button', type: 'cta' },
  { key: 'pillars.linuxTitle', category: 'pillars', label: 'Linux Track Card Title', type: 'header' },
  { key: 'pillars.linuxSubtitle', category: 'pillars', label: 'Linux Track Card Subtitle', type: 'text' },
  { key: 'pillars.linuxDesc', category: 'pillars', label: 'Linux Track Card Description', type: 'text', multiline: true },
  { key: 'pillars.linuxCta', category: 'pillars', label: 'Linux Track Card CTA Button', type: 'cta' },
  { key: 'pillars.theoryTitle', category: 'pillars', label: 'Theory Track Card Title', type: 'header' },
  { key: 'pillars.theorySubtitle', category: 'pillars', label: 'Theory Track Card Subtitle', type: 'text' },
  { key: 'pillars.theoryDesc', category: 'pillars', label: 'Theory Track Card Description', type: 'text', multiline: true },
  { key: 'pillars.theoryCta', category: 'pillars', label: 'Theory Track Card CTA Button', type: 'cta' },

  // Python Hub
  { key: 'pythonHub.kicker', category: 'python', label: 'Python Hub Kicker', type: 'kicker' },
  { key: 'pythonHub.title', category: 'python', label: 'Python Hub Main Header', type: 'header' },
  { key: 'pythonHub.description', category: 'python', label: 'Python Hub Description', type: 'text', multiline: true },
  { key: 'pythonHub.runCta', category: 'python', label: 'Python Run Demo CTA Button', type: 'cta' },
  { key: 'pythonHub.matcherTitle', category: 'python', label: 'Syntax Matcher Game Header', type: 'header' },
  { key: 'pythonHub.matcherDesc', category: 'python', label: 'Syntax Matcher Game Instructions', type: 'text', multiline: true },

  // Linux Hub
  { key: 'linuxHub.kicker', category: 'linux', label: 'Linux Hub Kicker', type: 'kicker' },
  { key: 'linuxHub.title', category: 'linux', label: 'Linux Hub Main Header', type: 'header' },
  { key: 'linuxHub.description', category: 'linux', label: 'Linux Hub Description', type: 'text', multiline: true },
  { key: 'linuxHub.terminalTitle', category: 'linux', label: 'Terminal Sandbox Header', type: 'header' },
  { key: 'linuxHub.terminalDesc', category: 'linux', label: 'Terminal Sandbox Subtext', type: 'text', multiline: true },
  { key: 'linuxHub.launchSandboxCta', category: 'linux', label: 'Launch Sandbox CTA Button', type: 'cta' },
  { key: 'linuxHub.calcTitle', category: 'linux', label: 'Permissions Calc Header', type: 'header' },
  { key: 'linuxHub.calcDesc', category: 'linux', label: 'Permissions Calc Subtitle', type: 'text' },

  // A-Level Theory Hub
  { key: 'theoryHub.kicker', category: 'theory', label: 'Theory Hub Kicker', type: 'kicker' },
  { key: 'theoryHub.title', category: 'theory', label: 'Theory Hub Main Header', type: 'header' },
  { key: 'theoryHub.description', category: 'theory', label: 'Theory Hub Description', type: 'text', multiline: true },
  { key: 'theoryHub.quizTitle', category: 'theory', label: 'Exam Quiz Section Header', type: 'header' },
  { key: 'theoryHub.quizDesc', category: 'theory', label: 'Exam Quiz Instructions', type: 'text', multiline: true },
  { key: 'theoryHub.truthTableTitle', category: 'theory', label: 'Logic Analyzer Header', type: 'header' },
  { key: 'theoryHub.truthTableDesc', category: 'theory', label: 'Logic Analyzer Subtitle', type: 'text' },

  // Resources Library
  { key: 'resourcesHub.kicker', category: 'resources', label: 'Resources Vault Kicker', type: 'kicker' },
  { key: 'resourcesHub.title', category: 'resources', label: 'Resources Vault Main Header', type: 'header' },
  { key: 'resourcesHub.description', category: 'resources', label: 'Resources Vault Description', type: 'text', multiline: true },
  { key: 'resourcesHub.downloadAllCta', category: 'resources', label: 'Resources CTA Button', type: 'cta' },

  // Contact
  { key: 'contact.kicker', category: 'contact', label: 'Contact Section Kicker', type: 'kicker' },
  { key: 'contact.title', category: 'contact', label: 'Contact Section Main Header', type: 'header' },
  { key: 'contact.description', category: 'contact', label: 'Contact Section Description', type: 'text', multiline: true },
  { key: 'contact.email', category: 'contact', label: 'Contact Email Address', type: 'label' },
  { key: 'contact.whatsapp', category: 'contact', label: 'WhatsApp Phone Raw (+966...)', type: 'label' },
  { key: 'contact.whatsappFormatted', category: 'contact', label: 'WhatsApp Display Formatted', type: 'label' },
  { key: 'contact.hours', category: 'contact', label: 'Office Hours & Availability', type: 'text' },
  { key: 'contact.location', category: 'contact', label: 'Location & Academy Coverage', type: 'text' },

  // Footer & Branding
  { key: 'footer.brandDesc', category: 'footer', label: 'Footer Brand Description', type: 'text', multiline: true },
  { key: 'footer.specAlignmentText', category: 'footer', label: 'Footer Exam Alignment Badge', type: 'text' },
  { key: 'footer.copyright', category: 'footer', label: 'Footer Copyright Notice', type: 'text' }
];

interface ContentContextType {
  content: SiteContent;
  metadataList: ContentItemMeta[];
  history: ContentEditHistoryItem[];
  getContent: (key: string, fallback?: string) => string;
  updateContent: (key: string, value: string) => void;
  batchUpdateContent: (updates: Partial<SiteContent>) => void;
  resetField: (key: string) => void;
  resetAllContent: () => void;
  exportJson: () => string;
  importJson: (jsonStr: string) => { success: boolean; error?: string };
  isModified: (key: string) => boolean;
  getModifiedCount: () => number;
}

const STORAGE_CONTENT_KEY = 'shaheen_academy_editable_content_v2';
const STORAGE_HISTORY_KEY = 'shaheen_academy_content_history_v2';

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminUser } = useAdminAuth();
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [history, setHistory] = useState<ContentEditHistoryItem[]>([]);

  // Load stored content and history on initial mount
  useEffect(() => {
    try {
      const storedContent = localStorage.getItem(STORAGE_CONTENT_KEY);
      if (storedContent) {
        const parsed = JSON.parse(storedContent);
        setContent((prev) => ({ ...prev, ...parsed }));
      }
      const storedHistory = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const saveContentToStorage = (newContent: SiteContent) => {
    try {
      localStorage.setItem(STORAGE_CONTENT_KEY, JSON.stringify(newContent));
    } catch {
      // Ignore quota errors
    }
  };

  const saveHistoryToStorage = (newHistory: ContentEditHistoryItem[]) => {
    try {
      // Keep up to 100 history entries
      const capped = newHistory.slice(0, 100);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(capped));
    } catch {
      // ignore
    }
  };

  const getContent = (key: string, fallback?: string): string => {
    return content[key] ?? fallback ?? DEFAULT_SITE_CONTENT[key] ?? '';
  };

  const updateContent = (key: string, value: string) => {
    const prevVal = content[key] ?? DEFAULT_SITE_CONTENT[key] ?? '';
    if (prevVal === value) return;

    const newContent = { ...content, [key]: value };
    setContent(newContent);
    saveContentToStorage(newContent);

    // Record in history audit
    const meta = CONTENT_METADATA_LIST.find((m) => m.key === key);
    const historyItem: ContentEditHistoryItem = {
      id: `edit_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      key,
      label: meta?.label || key,
      previousValue: prevVal,
      newValue: value,
      timestamp: new Date().toISOString(),
      adminEmail: adminUser?.email || 'admin@shaheen.academy'
    };

    setHistory((prev) => {
      const updated = [historyItem, ...prev];
      saveHistoryToStorage(updated);
      return updated;
    });
  };

  const batchUpdateContent = (updates: Partial<SiteContent>) => {
    const newContent: SiteContent = { ...content };
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) {
        newContent[k] = v;
      }
    }
    setContent(newContent);
    saveContentToStorage(newContent);
  };

  const resetField = (key: string) => {
    const defaultValue = DEFAULT_SITE_CONTENT[key];
    if (defaultValue !== undefined) {
      updateContent(key, defaultValue);
    }
  };

  const resetAllContent = () => {
    setContent(DEFAULT_SITE_CONTENT);
    saveContentToStorage(DEFAULT_SITE_CONTENT);
    const resetEntry: ContentEditHistoryItem = {
      id: `reset_${Date.now()}`,
      key: 'all',
      label: 'All Site Content Reset to Defaults',
      previousValue: 'Custom Edits',
      newValue: 'Default Content',
      timestamp: new Date().toISOString(),
      adminEmail: adminUser?.email || 'admin@shaheen.academy'
    };
    setHistory((prev) => {
      const updated = [resetEntry, ...prev];
      saveHistoryToStorage(updated);
      return updated;
    });
  };

  const exportJson = (): string => {
    return JSON.stringify(content, null, 2);
  };

  const importJson = (jsonStr: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed !== 'object' || parsed === null) {
        return { success: false, error: 'Invalid JSON payload structure.' };
      }
      const newContent = { ...DEFAULT_SITE_CONTENT, ...parsed };
      setContent(newContent);
      saveContentToStorage(newContent);

      const importEntry: ContentEditHistoryItem = {
        id: `import_${Date.now()}`,
        key: 'import',
        label: 'Imported Backup Content JSON',
        previousValue: 'Prior State',
        newValue: `Imported ${Object.keys(parsed).length} keys`,
        timestamp: new Date().toISOString(),
        adminEmail: adminUser?.email || 'admin@shaheen.academy'
      };
      setHistory((prev) => {
        const updated = [importEntry, ...prev];
        saveHistoryToStorage(updated);
        return updated;
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'JSON parsing failed.' };
    }
  };

  const isModified = (key: string): boolean => {
    const defaultVal = DEFAULT_SITE_CONTENT[key];
    const currentVal = content[key];
    if (defaultVal === undefined) return false;
    return currentVal !== defaultVal;
  };

  const getModifiedCount = (): number => {
    let count = 0;
    for (const key of Object.keys(DEFAULT_SITE_CONTENT)) {
      if (isModified(key)) count++;
    }
    return count;
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        metadataList: CONTENT_METADATA_LIST,
        history,
        getContent,
        updateContent,
        batchUpdateContent,
        resetField,
        resetAllContent,
        exportJson,
        importJson,
        isModified,
        getModifiedCount
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
