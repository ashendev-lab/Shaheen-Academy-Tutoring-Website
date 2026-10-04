import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useContent } from '../../context/ContentContext';
import { useTheme } from '../../context/ThemeContext';
import { Edit3 } from 'lucide-react';

interface EditableTextProps {
  contentKey: string;
  fallback?: string;
  label?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  fallback = '',
  label,
  as: Component = 'span',
  className = '',
}) => {
  const { isAuthenticated, isEditModeActive, setActiveQuickEditKey } = useAdminAuth();
  const { getContent, metadataList } = useContent();
  const { isMidnight } = useTheme();

  const text = getContent(contentKey, fallback);
  const meta = metadataList.find((m) => m.key === contentKey);
  const displayLabel = label || meta?.label || contentKey;

  const isLiveEditing = isAuthenticated && isEditModeActive;

  const handleClick = (e: React.MouseEvent) => {
    if (isLiveEditing) {
      e.preventDefault();
      e.stopPropagation();
      setActiveQuickEditKey(contentKey);
    }
  };

  if (!isLiveEditing) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title={`Admin: Click to edit "${displayLabel}"`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActiveQuickEditKey(contentKey);
        }
      }}
      className={`relative group cursor-pointer transition-all duration-150 inline-block ${className} ${
        isMidnight
          ? 'hover:outline-dashed hover:outline-1 hover:outline-[#00e5ff] hover:bg-cyan-950/20'
          : 'hover:outline-dashed hover:outline-1 hover:outline-emerald-400 hover:bg-emerald-500/10'
      } rounded px-0.5`}
    >
      {text}
      
      {/* Visual Edit Badge on Hover */}
      <span
        className={`pointer-events-none absolute -top-3.5 right-0 hidden group-hover:flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-lg z-30 transition-transform ${
          isMidnight
            ? 'bg-[#00e5ff] text-black ring-1 ring-cyan-300'
            : 'bg-emerald-500 text-slate-950 ring-1 ring-emerald-300'
        }`}
      >
        <Edit3 className="w-2.5 h-2.5" />
        <span>Edit</span>
      </span>
    </Component>
  );
};
