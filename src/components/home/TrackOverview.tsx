import React from 'react';
import { COURSE_TRACKS } from '../../data/mockData';
import { NavigationTab, TrackId } from '../../types';
import { EditableText } from '../admin/EditableText';
import { EditableButton } from '../admin/EditableButton';
import { Code2, Terminal, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TrackOverviewProps {
  onSelectTab: (tab: NavigationTab) => void;
}

export const TrackOverview: React.FC<TrackOverviewProps> = ({ onSelectTab }) => {
  const getTrackIcon = (id: TrackId) => {
    switch (id) {
      case 'python':
        return <Code2 className="w-5 h-5 text-emerald-400" />;
      case 'linux':
        return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'theory':
        return <Cpu className="w-5 h-5 text-purple-400" />;
    }
  };

  const getTrackBorderColor = (id: TrackId) => {
    switch (id) {
      case 'python':
        return 'hover:border-emerald-500/50';
      case 'linux':
        return 'hover:border-cyan-500/50';
      case 'theory':
        return 'hover:border-purple-500/50';
    }
  };

  const getTrackContentKeys = (id: TrackId) => {
    switch (id) {
      case 'python':
        return {
          titleKey: 'pillars.pythonTitle',
          subtitleKey: 'pillars.pythonSubtitle',
          descKey: 'pillars.pythonDesc',
          ctaKey: 'pillars.pythonCta',
          defaultCta: 'Explore Python Track'
        };
      case 'linux':
        return {
          titleKey: 'pillars.linuxTitle',
          subtitleKey: 'pillars.linuxSubtitle',
          descKey: 'pillars.linuxDesc',
          ctaKey: 'pillars.linuxCta',
          defaultCta: 'Launch Linux Lab'
        };
      case 'theory':
        return {
          titleKey: 'pillars.theoryTitle',
          subtitleKey: 'pillars.theorySubtitle',
          descKey: 'pillars.theoryDesc',
          ctaKey: 'pillars.theoryCta',
          defaultCta: 'Explore Theory Hub'
        };
    }
  };

  return (
    <section className="py-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <EditableText
              contentKey="pillars.kicker"
              fallback="Structured Learning Hubs · Comprehensive Syllabus Modules"
              label="Tracks Section Kicker"
              as="span"
            />
          </div>

          <EditableText
            contentKey="pillars.title"
            fallback="The Three Educational Pillars"
            label="Tracks Section H2 Title"
            as="h2"
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
          />

          <EditableText
            contentKey="pillars.description"
            fallback="Each track is designed with practical terminal sandboxes, conceptual mini-games, and academic examination specifications."
            label="Tracks Section Intro"
            as="p"
            className="text-sm text-slate-400 max-w-2xl"
          />
        </div>

        {/* 3 Track Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {COURSE_TRACKS.map((track) => {
            const keys = getTrackContentKeys(track.id);
            return (
              <div
                key={track.id}
                className={`rounded-2xl border border-slate-800 bg-[#0d121f]/90 backdrop-blur-sm overflow-hidden flex flex-col justify-between transition-all duration-300 group ${getTrackBorderColor(
                  track.id
                )}`}
              >
                <div>
                  {/* Visual Asset Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 border-b border-slate-800">
                    <img
                      src={track.imagePath}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d121f] via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute bottom-3 left-4 flex items-center gap-2 text-xs font-mono text-white">
                      <div className="p-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700">
                        {getTrackIcon(track.id)}
                      </div>
                      <EditableText
                        contentKey={keys.titleKey}
                        fallback={track.title}
                        label={`${track.title} Card Title`}
                        as="span"
                        className="font-semibold"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 space-y-4 text-left">
                    <div>
                      <EditableText
                        contentKey={keys.subtitleKey}
                        fallback={track.subtitle}
                        label={`${track.title} Card Subtitle`}
                        as="h3"
                        className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors"
                      />
                      <EditableText
                        contentKey={keys.descKey}
                        fallback={track.description}
                        label={`${track.title} Card Description`}
                        as="p"
                        className="text-xs text-slate-400 mt-2 leading-relaxed"
                      />
                    </div>

                    {/* Syllabus Modules Outline */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                        Core Syllabus Modules
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {track.modules.map((m) => (
                          <li key={m.id} className="flex items-center gap-2 text-slate-300">
                            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                            <span className="truncate">{m.title}</span>
                            <span className="text-[10px] font-mono text-slate-500 ml-auto shrink-0">
                              {m.estimatedHours}h
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-5 sm:p-6 pt-0">
                  <EditableButton
                    contentKey={keys.ctaKey}
                    fallback={keys.defaultCta}
                    label={`${track.title} Card CTA Button`}
                    onClick={() => onSelectTab(track.id as NavigationTab)}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-100 hover:text-white transition-colors flex items-center justify-center gap-2 group-hover:border-slate-600"
                    icon={<ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform ml-1" />}
                    iconPosition="right"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
