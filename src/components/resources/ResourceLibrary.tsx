/**
 * @file ResourceLibrary.tsx
 * @description Searchable, multi-filterable repository for cheat sheets, past papers, and code snippets.
 */

import React, { useState, useMemo } from 'react';
import { RESOURCE_ITEMS } from '../../data/mockData';
import { ResourceItem, ResourceType, TrackId } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { EditableText } from '../admin/EditableText';
import { Search, Download, Copy, Check, FileText, Code2, Terminal, Cpu, Filter, ExternalLink, X } from 'lucide-react';

export const ResourceLibrary: React.FC = () => {
  const { isMidnight } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrack, setSelectedTrack] = useState<TrackId | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [previewResource, setPreviewResource] = useState<ResourceItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Client-side instant multi-filtering logic
  const filteredResources = useMemo(() => {
    return RESOURCE_ITEMS.filter((item) => {
      const matchesTrack = selectedTrack === 'all' || item.track === selectedTrack;
      const matchesType = selectedType === 'all' || item.type === selectedType;

      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesTrack && matchesType;

      const inTitle = item.title.toLowerCase().includes(query);
      const inDesc = item.description.toLowerCase().includes(query);
      const inTags = item.tags.some((t) => t.toLowerCase().includes(query));

      return matchesTrack && matchesType && (inTitle || inDesc || inTags);
    });
  }, [searchQuery, selectedTrack, selectedType]);

  const handleCopyContent = (item: ResourceItem) => {
    navigator.clipboard.writeText(item.downloadPayload);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadFile = (item: ResourceItem) => {
    const blob = new Blob([item.downloadPayload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const extension = item.type === 'Code Snippet' ? (item.track === 'python' ? '.py' : '.sh') : '.txt';
    link.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getTrackIcon = (track: TrackId | 'general') => {
    switch (track) {
      case 'python':
        return <Code2 className="w-4 h-4 text-emerald-400" />;
      case 'linux':
        return <Terminal className="w-4 h-4 text-cyan-400" />;
      case 'theory':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <EditableText
            contentKey="resourcesHub.kicker"
            fallback="Repository · Production-Ready Curated Assets"
            label="Resources Vault Kicker"
            as="span"
            className="text-xs font-mono uppercase tracking-wider text-emerald-400"
          />
        </div>
        <EditableText
          contentKey="resourcesHub.title"
          fallback="Resource & Exam Revision Library"
          label="Resources Vault Main Header"
          as="h2"
          className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
        />
        <EditableText
          contentKey="resourcesHub.description"
          fallback="High-yield cheat sheets, exam-board specification summaries, model past papers with official marking guidelines, and tested code templates."
          label="Resources Vault Description"
          as="p"
          className="text-sm text-slate-400 max-w-3xl leading-relaxed"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className={`p-4 rounded-2xl border backdrop-blur-md space-y-4 transition-colors ${
        isMidnight ? 'bg-black border-[#14233c]' : 'bg-[#0d121f]/90 border-slate-800'
      }`}>
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources by keyword, topic (e.g. 'Boolean', 'chmod', 'Trees', 'TCP')..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all font-sans ${
              isMidnight 
                ? 'bg-[#03060c] border-[#14233c] focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/60' 
                : 'bg-slate-900/80 border-slate-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-1">
          {/* Track Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-mono flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Track:
            </span>
            {[
              { id: 'all', label: 'All Tracks' },
              { id: 'python', label: 'Python' },
              { id: 'linux', label: 'Linux' },
              { id: 'theory', label: 'A-Level Theory' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTrack(t.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedTrack === t.id
                    ? isMidnight
                      ? 'bg-cyan-500/20 text-[#00e5ff] border border-cyan-400/50'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : isMidnight
                    ? 'bg-black text-slate-400 border border-[#14233c] hover:text-white'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-mono mr-1">Type:</span>
            {[
              { id: 'all', label: 'All Types' },
              { id: 'Cheat Sheet', label: 'Cheat Sheets' },
              { id: 'Past Paper', label: 'Past Papers' },
              { id: 'Code Snippet', label: 'Snippets' }
            ].map((tp) => (
              <button
                key={tp.id}
                onClick={() => setSelectedType(tp.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedType === tp.id
                    ? isMidnight
                      ? 'bg-cyan-500/20 text-[#00e5ff] border border-cyan-400/50'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : isMidnight
                    ? 'bg-black text-slate-400 border border-[#14233c] hover:text-white'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {tp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Metrics */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
        <span>Showing {filteredResources.length} of {RESOURCE_ITEMS.length} resources</span>
        {(searchQuery || selectedTrack !== 'all' || selectedType !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTrack('all');
              setSelectedType('all');
            }}
            className={`hover:underline cursor-pointer ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border backdrop-blur-sm p-5 flex flex-col justify-between transition-all group ${
              isMidnight 
                ? 'border-[#14233c] bg-black hover:border-cyan-400/50' 
                : 'border-slate-800 bg-[#0d121f]/80 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              {/* Unboxed metadata adhering to zero-pill discipline */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  {getTrackIcon(item.track)}
                  <span className="capitalize">{item.track}</span>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{item.type}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="font-mono text-slate-500">{item.fileSize}</span>
              </div>

              <h3 className={`text-base font-bold text-slate-100 transition-colors leading-snug ${
                isMidnight ? 'group-hover:text-[#00e5ff]' : 'group-hover:text-emerald-300'
              }`}>
                {item.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {item.description}
              </p>

              {/* Code/Text Snippet Preview Box */}
              <div className={`p-3 rounded-lg border font-mono text-[11px] overflow-hidden line-clamp-3 leading-relaxed ${
                isMidnight ? 'bg-[#03060c] border-[#14233c] text-cyan-200' : 'bg-slate-900/90 border-slate-800/80 text-slate-300'
              }`}>
                {item.contentPreview}
              </div>
            </div>

            {/* Card Actions */}
            <div className={`flex items-center justify-between pt-4 mt-4 border-t ${
              isMidnight ? 'border-[#14233c]' : 'border-slate-800/80'
            }`}>
              <button
                onClick={() => setPreviewResource(item)}
                className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
                  isMidnight ? 'text-[#00e5ff] hover:text-[#38bdf8]' : 'text-emerald-400 hover:text-emerald-300'
                }`}
              >
                <span>View Full Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyContent(item)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isMidnight 
                      ? 'border-[#14233c] bg-black text-slate-400 hover:text-white' 
                      : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Copy to clipboard"
                >
                  {copiedId === item.id ? (
                    <Check className={`w-3.5 h-3.5 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => handleDownloadFile(item)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isMidnight 
                      ? 'border-[#14233c] bg-black text-slate-400 hover:text-[#00e5ff]' 
                      : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400'
                  }`}
                  title="Download resource file"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-[#0d121f]/40 space-y-3">
          <p className="text-sm text-slate-400">No resources found matching "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTrack('all');
              setSelectedType('all');
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Reset Search Filters
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
            isMidnight ? 'bg-black border-[#14233c]' : 'bg-[#0d1222] border-slate-800'
          }`}>
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
              isMidnight ? 'border-[#14233c]' : 'border-slate-800'
            }`}>
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="capitalize">{previewResource.track} Track</span>
                  <span>·</span>
                  <span>{previewResource.type}</span>
                  <span>·</span>
                  <span className="font-mono">{previewResource.fileFormat}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {previewResource.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewResource(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className={`p-4 sm:p-6 overflow-y-auto space-y-4 font-mono text-xs sm:text-sm text-slate-200 ${
              isMidnight ? 'bg-[#03060c]' : 'bg-[#090d16]'
            }`}>
              <pre className="whitespace-pre-wrap leading-relaxed select-text font-mono">
                {previewResource.downloadPayload}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between ${
              isMidnight ? 'border-[#14233c] bg-[#020408]' : 'border-slate-800 bg-[#0b101c]'
            }`}>
              <span className="text-xs text-slate-500 font-mono">
                Size: {previewResource.fileSize}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyContent(previewResource)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    isMidnight 
                      ? 'border-[#14233c] bg-black text-slate-200 hover:text-white hover:border-cyan-400/40' 
                      : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {copiedId === previewResource.id ? (
                    <Check className={`w-3.5 h-3.5 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === previewResource.id ? 'Copied' : 'Copy Text'}</span>
                </button>
                <button
                  onClick={() => handleDownloadFile(previewResource)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-slate-950 text-xs font-bold font-mono transition-colors ${
                    isMidnight
                      ? 'bg-[#00e5ff] hover:bg-[#38bdf8]'
                      : 'bg-emerald-500 hover:bg-emerald-400'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
