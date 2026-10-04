import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useContent } from '../../context/ContentContext';
import { useTheme } from '../../context/ThemeContext';
import { Edit3 } from 'lucide-react';

interface EditableButtonProps {
  contentKey: string;
  fallback?: string;
  label?: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  title?: string;
}

export const EditableButton: React.FC<EditableButtonProps> = ({
  contentKey,
  fallback = 'Action Button',
  label,
  onClick,
  className = '',
  icon,
  iconPosition = 'right',
  title,
}) => {
  const { isAuthenticated, isEditModeActive, setActiveQuickEditKey } = useAdminAuth();
  const { getContent, metadataList } = useContent();
  const { isMidnight } = useTheme();

  const text = getContent(contentKey, fallback);
  const meta = metadataList.find((m) => m.key === contentKey);
  const displayLabel = label || meta?.label || 'CTA Button';

  const isLiveEditing = isAuthenticated && isEditModeActive;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLiveEditing) {
      e.preventDefault();
      e.stopPropagation();
      setActiveQuickEditKey(contentKey);
    } else {
      onClick?.();
    }
  };

  return (
    <button
      onClick={handleClick}
      title={isLiveEditing ? `Admin Edit Mode: Click to edit CTA label "${displayLabel}"` : title}
      className={`relative group ${className} ${
        isLiveEditing
          ? isMidnight
            ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-black hover:bg-cyan-500/20'
            : 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 hover:bg-amber-500/20'
          : ''
      }`}
    >
      {/* Icon left */}
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}

      <span>{text}</span>

      {/* Icon right */}
      {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}

      {/* Live Edit indicator badge */}
      {isLiveEditing && (
        <span
          className={`pointer-events-none absolute -top-3.5 right-1 flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-lg z-30 ${
            isMidnight
              ? 'bg-[#00e5ff] text-black ring-1 ring-cyan-300'
              : 'bg-amber-400 text-slate-950 ring-1 ring-amber-300'
          }`}
        >
          <Edit3 className="w-2.5 h-2.5" />
          <span>Edit CTA</span>
        </span>
      )}
    </button>
  );
};
