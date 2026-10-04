import React, { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useContent } from '../../context/ContentContext';
import { useTheme } from '../../context/ThemeContext';
import { X, Check, RotateCcw, Edit3, ArrowRight, Shield, Sparkles } from 'lucide-react';

export const InlineEditPopover: React.FC = () => {
  const { activeQuickEditKey, setActiveQuickEditKey } = useAdminAuth();
  const { getContent, updateContent, resetField, metadataList } = useContent();
  const { isMidnight } = useTheme();

  const [currentValue, setCurrentValue] = useState<string>('');
  const [initialValue, setInitialValue] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const meta = metadataList.find((m) => m.key === activeQuickEditKey);

  useEffect(() => {
    if (activeQuickEditKey) {
      const val = getContent(activeQuickEditKey);
      setCurrentValue(val);
      setInitialValue(val);
      setIsSaved(false);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.select();
        }
      }, 50);
    }
  }, [activeQuickEditKey]);

  if (!activeQuickEditKey) return null;

  const handleSave = () => {
    updateContent(activeQuickEditKey, currentValue);
    setIsSaved(true);
    setTimeout(() => {
      setActiveQuickEditKey(null);
    }, 450);
  };

  const handleResetToDefault = () => {
    resetField(activeQuickEditKey);
    const def = getContent(activeQuickEditKey);
    setCurrentValue(def);
    setIsSaved(true);
    setTimeout(() => {
      setActiveQuickEditKey(null);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setActiveQuickEditKey(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div 
        className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden transition-all transform animate-scaleUp ${
          isMidnight 
            ? 'bg-[#050810] border-cyan-500/40 shadow-cyan-950/40 text-slate-100' 
            : 'bg-[#0f172a] border-slate-700 shadow-2xl text-slate-100'
        }`}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isMidnight ? 'border-cyan-900/40 bg-black/60' : 'border-slate-800 bg-slate-900/60'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${isMidnight ? 'bg-cyan-500/20 text-[#00e5ff]' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Quick Live Edit
                </span>
                {meta?.type && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                    meta.type === 'cta'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : meta.type === 'header'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {meta.type.toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-white truncate max-w-sm">
                {meta?.label || activeQuickEditKey}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setActiveQuickEditKey(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cancel & Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Field: <span className="text-slate-200">{activeQuickEditKey}</span></span>
              <span>{currentValue.length} chars</span>
            </div>

            <textarea
              ref={textareaRef}
              rows={meta?.multiline ? 4 : 2}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter text..."
              className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none transition-all resize-none ${
                isMidnight
                  ? 'bg-black border-cyan-500/40 text-white focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]'
                  : 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
              }`}
            />
            <p className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-slate-300 border border-slate-700">Ctrl + Enter</kbd> to save immediately</span>
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-slate-300 border border-slate-700">Esc</kbd> to cancel</span>
            </p>
          </div>

          {/* Live Preview Box */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Real-Time On-Screen Preview</span>
            </div>
            <div className="text-sm text-slate-200 italic break-words line-clamp-3">
              "{currentValue || <span className="text-slate-600 font-sans">[Empty content]</span>}"
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`px-5 py-3.5 border-t flex items-center justify-between gap-3 ${
          isMidnight ? 'border-cyan-900/40 bg-black/40' : 'border-slate-800 bg-slate-900/40'
        }`}>
          <button
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-800/60"
            title="Revert to factory default text"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveQuickEditKey(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
                isSaved
                  ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                  : isMidnight
                  ? 'bg-[#00e5ff] hover:bg-[#38bdf8] text-black shadow-cyan-500/25'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
