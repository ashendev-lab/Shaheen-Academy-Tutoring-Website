/**
 * Types for the Shaheen Academy Admin Panel and Content Management System.
 */

export interface AdminUser {
  id: string;
  email: string;
  role: 'superadmin' | 'editor';
  name: string;
  lastLogin: string;
}

export type ContentFieldType = 'header' | 'text' | 'kicker' | 'cta' | 'stat' | 'code' | 'label';

export type ContentCategory = 
  | 'hero'
  | 'pillars'
  | 'python'
  | 'linux'
  | 'theory'
  | 'resources'
  | 'contact'
  | 'footer'
  | 'branding';

export interface ContentItemMeta {
  key: string;
  category: ContentCategory;
  label: string;
  type: ContentFieldType;
  description?: string;
  maxLength?: number;
  multiline?: boolean;
}

export interface ContentEditHistoryItem {
  id: string;
  key: string;
  label: string;
  previousValue: string;
  newValue: string;
  timestamp: string;
  adminEmail: string;
}

export interface SiteContent {
  // Global Branding
  'brand.name': string;
  'brand.tagline': string;
  
  // Hero Section
  'hero.kicker': string;
  'hero.title': string;
  'hero.description': string;
  'hero.primaryCta': string;
  'hero.secondaryCta': string;
  'hero.stat1Value': string;
  'hero.stat1Label': string;
  'hero.stat2Value': string;
  'hero.stat2Label': string;
  'hero.stat3Value': string;
  'hero.stat3Label': string;
  'hero.badgeText': string;
  'hero.badgeStatus': string;

  // Pillars & Tracks Overview
  'pillars.kicker': string;
  'pillars.title': string;
  'pillars.description': string;
  'pillars.pythonTitle': string;
  'pillars.pythonSubtitle': string;
  'pillars.pythonDesc': string;
  'pillars.pythonCta': string;
  'pillars.linuxTitle': string;
  'pillars.linuxSubtitle': string;
  'pillars.linuxDesc': string;
  'pillars.linuxCta': string;
  'pillars.theoryTitle': string;
  'pillars.theorySubtitle': string;
  'pillars.theoryDesc': string;
  'pillars.theoryCta': string;

  // Python Track Hub
  'pythonHub.kicker': string;
  'pythonHub.title': string;
  'pythonHub.description': string;
  'pythonHub.runCta': string;
  'pythonHub.matcherTitle': string;
  'pythonHub.matcherDesc': string;

  // Linux Track Hub
  'linuxHub.kicker': string;
  'linuxHub.title': string;
  'linuxHub.description': string;
  'linuxHub.terminalTitle': string;
  'linuxHub.terminalDesc': string;
  'linuxHub.launchSandboxCta': string;
  'linuxHub.calcTitle': string;
  'linuxHub.calcDesc': string;

  // A-Level Theory Hub
  'theoryHub.kicker': string;
  'theoryHub.title': string;
  'theoryHub.description': string;
  'theoryHub.quizTitle': string;
  'theoryHub.quizDesc': string;
  'theoryHub.truthTableTitle': string;
  'theoryHub.truthTableDesc': string;

  // Resources Library
  'resourcesHub.kicker': string;
  'resourcesHub.title': string;
  'resourcesHub.description': string;
  'resourcesHub.downloadAllCta': string;

  // Contact Section
  'contact.kicker': string;
  'contact.title': string;
  'contact.description': string;
  'contact.email': string;
  'contact.whatsapp': string;
  'contact.whatsappFormatted': string;
  'contact.hours': string;
  'contact.location': string;

  // Footer
  'footer.brandDesc': string;
  'footer.specAlignmentText': string;
  'footer.copyright': string;

  // Custom extensible fields
  [key: string]: string;
}
