import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/admin';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  isEditModeActive: boolean;
  setIsEditModeActive: (active: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isDashboardModalOpen: boolean;
  setIsDashboardModalOpen: (open: boolean) => void;
  activeQuickEditKey: string | null;
  setActiveQuickEditKey: (key: string | null) => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  lockoutSeconds: number;
  loginAttempts: number;
}

const STORAGE_SESSION_KEY = 'shaheen_academy_admin_session';
const STORAGE_CREDENTIALS_KEY = 'shaheen_academy_admin_pass_v1';
const STORAGE_LOCKOUT_KEY = 'shaheen_academy_admin_lockout';

const DEFAULT_ADMIN_EMAIL = 'shaheenacademy0192@gmail.com';
const SECONDARY_ADMIN_EMAIL = 'admin@shaheen.academy';
const DEFAULT_INITIAL_PASSWORD = 'Shaheen2026!Admin';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isEditModeActive, setIsEditModeActive] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState<boolean>(false);
  const [activeQuickEditKey, setActiveQuickEditKey] = useState<string | null>(null);

  // Rate limiting / lockout states
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Check existing session on mount
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          setIsAuthenticated(true);
          setAdminUser(parsed.user);
        } else {
          localStorage.removeItem(STORAGE_SESSION_KEY);
        }
      }

      // Check lockout status
      const storedLockout = localStorage.getItem(STORAGE_LOCKOUT_KEY);
      if (storedLockout) {
        const lockoutEnd = parseInt(storedLockout, 10);
        const remaining = Math.max(0, Math.ceil((lockoutEnd - Date.now()) / 1000));
        if (remaining > 0) {
          setLockoutSeconds(remaining);
        } else {
          localStorage.removeItem(STORAGE_LOCKOUT_KEY);
        }
      }
    } catch {
      // Safe fallback
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(STORAGE_LOCKOUT_KEY);
          setLoginAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Global keyboard shortcut to open Admin Modal (Ctrl+Shift+A or Cmd+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAuthenticated) {
          setIsDashboardModalOpen((prev) => !prev);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  const getStoredPassword = (): string => {
    try {
      const stored = localStorage.getItem(STORAGE_CREDENTIALS_KEY);
      if (stored) return stored;
    } catch {
      // fallback
    }
    return DEFAULT_INITIAL_PASSWORD;
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (lockoutSeconds > 0) {
      return {
        success: false,
        error: `Too many failed attempts. Security lockout active for ${lockoutSeconds} more seconds.`
      };
    }

    const cleanEmail = email.trim().toLowerCase();
    const validEmails = [DEFAULT_ADMIN_EMAIL.toLowerCase(), SECONDARY_ADMIN_EMAIL.toLowerCase(), 'admin'];
    const currentAdminPassword = getStoredPassword();

    // Verify
    const isEmailValid = validEmails.includes(cleanEmail);
    const isPassValid = pass === currentAdminPassword;

    if (!isEmailValid || !isPassValid) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= 5) {
        const lockoutUntil = Date.now() + 30000; // 30 seconds lockout
        localStorage.setItem(STORAGE_LOCKOUT_KEY, lockoutUntil.toString());
        setLockoutSeconds(30);
        return {
          success: false,
          error: 'Maximum failed login attempts reached. Security lockout activated for 30 seconds.'
        };
      }

      return {
        success: false,
        error: `Invalid credentials. ${5 - newAttempts} attempt(s) remaining before security lockout.`
      };
    }

    // Success: create 8-hour session
    const user: AdminUser = {
      id: 'admin_usr_01',
      email: cleanEmail.includes('@') ? cleanEmail : DEFAULT_ADMIN_EMAIL,
      role: 'superadmin',
      name: 'Academy Administrator',
      lastLogin: new Date().toISOString()
    };

    const sessionData = {
      user,
      token: `adm_sec_${Math.random().toString(36).substring(2)}_${Date.now()}`,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000 // 8 hours
    };

    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
    } catch {
      // ignore
    }

    setIsAuthenticated(true);
    setAdminUser(user);
    setIsEditModeActive(true);
    setIsLoginModalOpen(false);
    setLoginAttempts(0);

    return { success: true };
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setAdminUser(null);
    setIsDashboardModalOpen(false);
    setActiveQuickEditKey(null);
  };

  const updatePassword = async (currentPass: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    const existing = getStoredPassword();
    if (currentPass !== existing) {
      return { success: false, error: 'Current password does not match records.' };
    }
    if (newPass.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }
    try {
      localStorage.setItem(STORAGE_CREDENTIALS_KEY, newPass);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to save updated password' };
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        isEditModeActive,
        setIsEditModeActive,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isDashboardModalOpen,
        setIsDashboardModalOpen,
        activeQuickEditKey,
        setActiveQuickEditKey,
        login,
        logout,
        updatePassword,
        lockoutSeconds,
        loginAttempts
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
