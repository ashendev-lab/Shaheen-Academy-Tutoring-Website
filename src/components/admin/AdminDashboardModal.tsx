import React, { useState, useMemo } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useContent } from '../../context/ContentContext';
import { useTheme } from '../../context/ThemeContext';
import { ContentCategory, ContentItemMeta } from '../../types/admin';
import { NavigationTab } from '../../types';
import { 
  X, 
  Search, 
  Edit3, 
  Check, 
  RotateCcw, 
  Download, 
  Upload, 
  History, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  Code2, 
  Terminal, 
  Cpu, 
  BookOpen, 
  AlertTriangle,
  KeyRound,
  Copy,
  FileJson,
  MousePointerClick,
  MessageSquare
} from 'lucide-react';

interface AdminDashboardModalProps {
  onNavigateToTab?: (tab: NavigationTab) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ onNavigateToTab }) => {
  const { 
    isDashboardModalOpen, 
    setIsDashboardModalOpen, 
    adminUser, 
    updatePassword, 
    setIsEditModeActive,
    setActiveQuickEditKey 
  } = useAdminAuth();
  
  const { 
    content, 
    metadataList, 
    history, 
    getContent, 
    updateContent, 
    resetField, 
    resetAllContent, 
    exportJson, 
    importJson, 
    isModified, 
    getModifiedCount 
  } = useContent();

  const { isMidnight } = useTheme();

  // Active dashboard tabs
  type DashboardTab = 'content' | 'history' | 'backup' | 'security';
  const [activeTab, setActiveTab] = useState<DashboardTab>('content');
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editing state inside dashboard
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const [savedFeedback, setSavedFeedback] = useState<Record<string, boolean>>({});

  // Security tab state
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [securityMessage, setSecurityMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Backup tab state
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importMessage, setImportMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [copiedBackup, setCopiedBackup] = useState<boolean>(false);
  const [showConfirmResetAll, setShowConfirmResetAll] = useState<boolean>(false);

  if (!isDashboardModalOpen) return null;

  // Filter content items
  const filteredItems = metadataList.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    if (!matchesCat) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const currentVal = getContent(item.key).toLowerCase();
    const labelMatch = item.label.toLowerCase().includes(query);
    const keyMatch = item.key.toLowerCase().includes(query);
    const valMatch = currentVal.includes(query);
    return labelMatch || keyMatch || valMatch;
  });

  const handleFieldChange = (key: string, val: string) => {
    setEditingValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSaveField = (key: string) => {
    const valToSave = editingValues[key] !== undefined ? editingValues[key] : getContent(key);
    updateContent(key, valToSave);

    setSavedFeedback((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setSavedFeedback((prev) => ({ ...prev, [key]: false }));
    }, 1500);
  };

  const handleRevertField = (key: string) => {
    resetField(key);
    setEditingValues((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setSavedFeedback((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setSavedFeedback((prev) => ({ ...prev, [key]: false }));
    }, 1500);
  };

  const handleJumpToSection = (item: ContentItemMeta) => {
    setIsDashboardModalOpen(false);
    setIsEditModeActive(true);

    let targetTab: NavigationTab = 'home';
    if (item.category === 'python') targetTab = 'python';
    else if (item.category === 'linux') targetTab = 'linux';
    else if (item.category === 'theory') targetTab = 'theory';
    else if (item.category === 'resources') targetTab = 'resources';
    else if (item.category === 'contact') targetTab = 'contact';

    onNavigateToTab?.(targetTab);

    // After navigation, activate quick edit on that field
    setTimeout(() => {
      setActiveQuickEditKey(item.key);
    }, 350);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    if (newPassword !== confirmPassword) {
      setSecurityMessage({ text: 'New password and confirmation do not match.', isError: true });
      return;
    }

    const res = await updatePassword(currentPassword, newPassword);
    if (!res.success) {
      setSecurityMessage({ text: res.error || 'Failed to update password.', isError: true });
    } else {
      setSecurityMessage({ text: 'Admin password updated successfully! Please note it down safely.', isError: false });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleCopyBackup = () => {
    navigator.clipboard.writeText(exportJson());
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  const handleDownloadBackup = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shaheen_academy_content_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    setImportMessage(null);
    if (!importJsonText.trim()) {
      setImportMessage({ text: 'Please paste valid JSON text.', isError: true });
      return;
    }
    const res = importJson(importJsonText);
    if (!res.success) {
      setImportMessage({ text: res.error || 'Invalid JSON format.', isError: true });
    } else {
      setImportMessage({ text: 'Site content restored successfully from backup!', isError: false });
      setImportJsonText('');
      setEditingValues({});
    }
  };

  const modifiedCount = getModifiedCount();

  const categories: { id: ContentCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Fields', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'hero', label: 'Hero & Top', icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'pillars', label: 'Pillars & Tracks', icon: <Layers className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'python', label: 'Python Lab', icon: <Code2 className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'linux', label: 'Linux Hub', icon: <Terminal className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'theory', label: 'Theory Hub', icon: <Cpu className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'resources', label: 'Resources', icon: <BookOpen className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'contact', label: 'Contact & Admissions', icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'footer', label: 'Footer & Legal', icon: <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> },
    { id: 'branding', label: 'Branding', icon: <Sparkles className="w-3.5 h-3.5 text-blue-400" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className={`w-full max-w-6xl h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all transform animate-scaleUp ${
          isMidnight
            ? 'bg-[#03060f] border-cyan-500/40 shadow-cyan-950/40 text-slate-100'
            : 'bg-[#0c121e] border-slate-700 shadow-2xl text-slate-100'
        }`}
      >
        {/* Top Header */}
        <div className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${
          isMidnight ? 'border-cyan-950/80 bg-black/80' : 'border-slate-800 bg-slate-900/70'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl flex items-center justify-center ${
              isMidnight ? 'bg-cyan-500/20 text-[#00e5ff]' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  CMS Content Management Dashboard
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {metadataList.length} Editable Elements
                </span>
                {modifiedCount > 0 && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {modifiedCount} Modified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Click and edit any headers, body copy, and call-to-actions directly. Real-time updates saved across sessions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsDashboardModalOpen(false);
                setIsEditModeActive(true);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors ${
                isMidnight
                  ? 'border-cyan-500/40 bg-cyan-950/30 text-[#00e5ff] hover:bg-cyan-900/40'
                  : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40'
              }`}
              title="Close modal and jump into live on-page click-to-edit mode"
            >
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>Live Visual Edit Mode</span>
            </button>

            <button
              onClick={() => setIsDashboardModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className={`px-6 py-2 border-b flex items-center justify-between gap-4 overflow-x-auto ${
          isMidnight ? 'border-cyan-950/60 bg-black/40' : 'border-slate-800/80 bg-slate-900/40'
        }`}>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'content'
                  ? isMidnight
                    ? 'bg-cyan-500/20 text-[#00e5ff] border border-cyan-400/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>All Site Content & CTAs</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'history'
                  ? isMidnight
                    ? 'bg-cyan-500/20 text-[#00e5ff] border border-cyan-400/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Edit Audit Log ({history.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'backup'
                  ? isMidnight
                    ? 'bg-cyan-500/20 text-[#00e5ff] border border-cyan-400/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Backup & Restore (JSON)</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'security'
                  ? isMidnight
                    ? 'bg-cyan-500/20 text-[#00e5ff] border border-cyan-400/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Admin Security</span>
            </button>
          </div>

          <div className="text-xs font-mono text-slate-500 hidden md:block">
            Signed in as: <span className="text-slate-300 font-semibold">{adminUser?.email}</span>
          </div>
        </div>

        {/* Tab 1: Content Editor */}
        {activeTab === 'content' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Filter and Search Bar */}
            <div className={`p-4 border-b space-y-3 ${
              isMidnight ? 'border-cyan-950/60 bg-black/20' : 'border-slate-800 bg-slate-900/20'
            }`}>
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap border ${
                      selectedCategory === cat.id
                        ? isMidnight
                          ? 'bg-[#00e5ff] text-black border-cyan-300 font-bold'
                          : 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter and search text, headers, CTAs, button labels, or keys..."
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border text-xs focus:outline-none transition-all ${
                    isMidnight
                      ? 'bg-black border-cyan-950 text-white focus:border-cyan-400'
                      : 'bg-slate-900/90 border-slate-700 text-white focus:border-emerald-500'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* List of Content Cards */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {filteredItems.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-2">
                  <Search className="w-8 h-8 mx-auto opacity-40" />
                  <p className="text-sm">No elements matched your current filter criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredItems.map((item) => {
                    const currentStored = getContent(item.key);
                    const currentVal = editingValues[item.key] !== undefined ? editingValues[item.key] : currentStored;
                    const hasUnsavedLocal = editingValues[item.key] !== undefined && editingValues[item.key] !== currentStored;
                    const isItemModified = isModified(item.key);
                    const isSuccess = savedFeedback[item.key];

                    return (
                      <div
                        key={item.key}
                        className={`rounded-xl border p-4 sm:p-5 transition-all space-y-3 ${
                          isMidnight
                            ? 'bg-[#040712] border-cyan-950/80 hover:border-cyan-500/40'
                            : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {/* Type Badge */}
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              item.type === 'cta'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : item.type === 'header'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : item.type === 'kicker'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              {item.type}
                            </span>

                            <h4 className="text-sm font-bold text-white">
                              {item.label}
                            </h4>

                            {isItemModified && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Customized
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-500">
                              key: <code className="text-slate-400">{item.key}</code>
                            </span>

                            {/* Jump to on site button */}
                            <button
                              onClick={() => handleJumpToSection(item)}
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                              title="Navigate to page location and highlight this item"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span className="hidden sm:inline">Inspect On Site</span>
                            </button>
                          </div>
                        </div>

                        {/* Input or Textarea */}
                        <div className="space-y-1.5">
                          {item.multiline ? (
                            <textarea
                              rows={3}
                              value={currentVal}
                              onChange={(e) => handleFieldChange(item.key, e.target.value)}
                              placeholder={`Enter ${item.label.toLowerCase()}...`}
                              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-sans focus:outline-none transition-all resize-y ${
                                isMidnight
                                  ? 'bg-black border-cyan-900/50 text-slate-100 focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]'
                                  : 'bg-slate-950/80 border-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                              }`}
                            />
                          ) : (
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => handleFieldChange(item.key, e.target.value)}
                              placeholder={`Enter ${item.label.toLowerCase()}...`}
                              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-sans focus:outline-none transition-all ${
                                isMidnight
                                  ? 'bg-black border-cyan-900/50 text-slate-100 focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]'
                                  : 'bg-slate-950/80 border-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                              }`}
                            />
                          )}
                        </div>

                        {/* Actions for this card */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-mono text-slate-500">
                            {currentVal.length} characters
                          </span>

                          <div className="flex items-center gap-2">
                            {isItemModified && (
                              <button
                                onClick={() => handleRevertField(item.key)}
                                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                                title="Revert to factory default text"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Revert</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleSaveField(item.key)}
                              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                                isSuccess
                                  ? 'bg-emerald-500 text-slate-950 ring-1 ring-emerald-300'
                                  : hasUnsavedLocal
                                  ? isMidnight
                                    ? 'bg-[#00e5ff] hover:bg-[#38bdf8] text-black shadow-cyan-500/20'
                                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isSuccess ? 'Saved!' : hasUnsavedLocal ? 'Save Changes' : 'Update'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Audit History */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Content Change History & Audit Log</h3>
                <p className="text-xs text-slate-400">
                  Every edit made to headers, text, and call-to-actions is logged here with instant rollback capability.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {history.length} audit entries
              </span>
            </div>

            {history.length === 0 ? (
              <div className="py-16 text-center text-slate-500 space-y-2">
                <History className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-sm">No edits have been made yet in this session.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className={`rounded-xl border p-4 space-y-2.5 ${
                      isMidnight ? 'bg-[#040712] border-cyan-950/80' : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{entry.label}</span>
                        <code className="text-[11px] text-slate-500 font-mono">({entry.key})</code>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(entry.timestamp).toLocaleTimeString()} · {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30">
                        <span className="text-[10px] font-mono font-bold text-red-400 uppercase block mb-1">
                          Previous Text:
                        </span>
                        <p className="text-slate-300 font-mono text-[11px] line-clamp-3">
                          {entry.previousValue || '<empty>'}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block mb-1">
                          New Updated Text:
                        </span>
                        <p className="text-slate-200 font-mono text-[11px] line-clamp-3">
                          {entry.newValue}
                        </p>
                      </div>
                    </div>

                    {entry.key !== 'all' && entry.key !== 'import' && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            updateContent(entry.key, entry.previousValue);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Rollback this change</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Backup & Restore */}
        {activeTab === 'backup' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Backup & Restore Site Content</h3>
              <p className="text-xs text-slate-400">
                Export your custom site texts, headers, and call-to-actions as JSON to back them up or import on another device.
              </p>
            </div>

            {/* Export Section */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isMidnight ? 'bg-[#040712] border-cyan-950/80' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Export Content JSON</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyBackup}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedBackup ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={handleDownloadBackup}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                      isMidnight
                        ? 'bg-[#00e5ff] text-black hover:bg-[#38bdf8]'
                        : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Backup File</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/60 font-mono text-[11px] text-slate-400 max-h-36 overflow-y-auto border border-slate-800">
                <pre>{exportJson()}</pre>
              </div>
            </div>

            {/* Import Section */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isMidnight ? 'bg-[#040712] border-cyan-950/80' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Import Content JSON</h4>
              </div>

              {importMessage && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  importMessage.isError 
                    ? 'bg-red-950/40 border border-red-500/40 text-red-200' 
                    : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200'
                }`}>
                  <span>{importMessage.text}</span>
                </div>
              )}

              <textarea
                rows={4}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='Paste exported site content JSON here {"hero.title": "..."}'
                className="w-full p-3 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleImportJson}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restore from JSON</span>
                </button>
              </div>
            </div>

            {/* Factory Reset */}
            <div className="p-5 rounded-2xl border border-red-900/30 bg-red-950/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Reset All Site Content to Factory Defaults</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    This will discard all custom text, header, and CTA modifications across all pages and restore initial curriculum specs.
                  </p>
                </div>

                {!showConfirmResetAll ? (
                  <button
                    onClick={() => setShowConfirmResetAll(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold border border-red-500/40 text-red-300 hover:bg-red-900/40 transition-colors"
                  >
                    Reset Everything
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowConfirmResetAll(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        resetAllContent();
                        setShowConfirmResetAll(false);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors"
                    >
                      Confirm Factory Reset
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Security */}
        {activeTab === 'security' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-xl">
            <div>
              <h3 className="text-base font-bold text-white">Admin Security & Credentials</h3>
              <p className="text-xs text-slate-400">
                Update your administrator credentials, view security audit status, and manage active session details.
              </p>
            </div>

            {securityMessage && (
              <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                securityMessage.isError
                  ? 'bg-red-950/40 border border-red-500/40 text-red-200'
                  : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200'
              }`}>
                <span>{securityMessage.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase text-slate-300">
                  Current Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase text-slate-300">
                  New Admin Password (min 8 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase text-slate-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className={`py-2.5 px-5 rounded-xl font-bold text-xs transition-all shadow-md ${
                  isMidnight
                    ? 'bg-[#00e5ff] hover:bg-[#38bdf8] text-black shadow-cyan-500/25'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                }`}
              >
                Update Admin Password
              </button>
            </form>

            <div className={`p-4 rounded-xl border space-y-2 ${
              isMidnight ? 'bg-cyan-950/20 border-cyan-900/40' : 'bg-slate-900/50 border-slate-800'
            }`}>
              <h4 className="text-xs font-bold text-slate-200 uppercase font-mono">
                Active Session Summary
              </h4>
              <div className="text-xs font-mono text-slate-400 space-y-1">
                <p>User: <span className="text-white">{adminUser?.email}</span></p>
                <p>Role: <span className="text-white">{adminUser?.role}</span></p>
                <p>Session Duration: <span className="text-white">8 hours</span></p>
                <p>Encryption: <span className="text-white">AES-256 local token</span></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
