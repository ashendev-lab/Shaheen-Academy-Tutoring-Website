import React, { useState, useEffect, useRef } from 'react';
import { NavigationTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { EditableText } from '../admin/EditableText';
import { EditableButton } from '../admin/EditableButton';
import { Terminal, Code2, Cpu, ArrowRight, ShieldCheck, Zap, Sparkles, ChevronDown } from 'lucide-react';
import heroProductImage from '../../assets/images/regenerated_image_1791129858233.png';

interface HeroSectionProps {
  onSelectTab: (tab: NavigationTab) => void;
  onLaunchTerminal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectTab, onLaunchTerminal }) => {
  const { isMidnight } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerColRef = useRef<HTMLDivElement>(null);

  // Scroll state
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [horizontalCenterOffset, setHorizontalCenterOffset] = useState<number>(0);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Viewport detection (disable complex horizontal scroll on mobile)
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Measure exact horizontal pixel delta between header column center and viewport center
      if (!mobile && headerColRef.current && gridRef.current) {
        const headerRect = headerColRef.current.getBoundingClientRect();
        const headerCenterX = headerRect.left + headerRect.width / 2;
        const viewportCenterX = window.innerWidth / 2;
        setHorizontalCenterOffset(viewportCenterX - headerCenterX);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lightweight high-performance scroll listener to tie element positions to scroll progress
  useEffect(() => {
    if (isMobile) {
      setScrollProgress(1);
      return;
    }

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        if (!sectionRef.current) {
          rafId = null;
          return;
        }

        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = sectionRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const totalScrollableDistance = sectionHeight - viewportHeight;

        if (totalScrollableDistance <= 0) {
          setScrollProgress(0);
          rafId = null;
          return;
        }

        // Distance scrolled past the section's entry into the viewport
        const scrollOffset = Math.max(0, -rect.top);
        const progress = Math.min(Math.max(scrollOffset / totalScrollableDistance, 0), 1);

        setScrollProgress(progress);
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  // Interpolation calculations for desktop:
  // 1. Header scale: scales down from 1.18x at center to 1.0x at final locked position
  const headerScale = isMobile ? 1.0 : 1.18 - scrollProgress * 0.18;

  // 2. Header translateX: shifts from center of viewport to natural left column
  const headerTranslateX = isMobile ? 0 : (1 - scrollProgress) * horizontalCenterOffset;

  // 3. Supporting content opacity: 0 on initial load (only prominent header visible), fades in as it transitions
  const supportingContentOpacity = isMobile ? 1 : Math.max(0, Math.min(1, (scrollProgress - 0.25) / 0.75));

  // 4. Product image translateY: starts below viewport (+110vh), scrolls up directly beside the header at progress 1.0
  const imageTranslateY = isMobile ? 0 : (1 - scrollProgress) * 110;

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${isMobile ? 'h-auto py-8' : 'h-[250vh]'}`}
    >
      {/* Background ambient lighting */}
      <div
        className={`pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] blur-[160px] rounded-full z-0 transition-opacity duration-500 ${
          isMidnight
            ? 'bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/15'
            : 'bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-purple-500/10'
        }`}
      />

      {/* Sticky container: stays locked in viewport while scrubbing through the transition */}
      <div
        ref={stickyRef}
        className={`w-full ${
          isMobile
            ? 'relative'
            : 'sticky top-16 h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden z-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
          <div
            ref={gridRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full relative"
          >
            {/* Left Column: Prominent Header & Editorial Proposition */}
            <div
              ref={headerColRef}
              className="lg:col-span-7 space-y-6 text-left relative z-20"
            >
              {/* Main Prominent Header Block with scroll-driven transform */}
              <div
                style={{
                  transform: isMobile
                    ? 'none'
                    : `translate3d(${headerTranslateX}px, 0px, 0px) scale(${headerScale})`,
                  transformOrigin: isMobile ? 'left center' : 'left center',
                  transition: isMobile ? 'none' : 'transform 0.08s ease-out',
                  willChange: isMobile ? 'auto' : 'transform',
                }}
                className={`transition-all duration-75 ${
                  !isMobile && scrollProgress < 0.1 ? 'text-center lg:text-center' : 'text-left'
                }`}
              >
                {/* Unboxed kicker */}
                <div
                  style={{
                    opacity: isMobile ? 1 : Math.max(0, Math.min(1, (scrollProgress - 0.15) / 0.85)),
                    transition: isMobile ? 'none' : 'opacity 0.15s ease-out',
                  }}
                  className={`flex items-center gap-2 text-xs font-mono mb-3 ${
                    isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      isMidnight ? 'bg-[#00e5ff]' : 'bg-emerald-400'
                    }`}
                  />
                  <EditableText
                    contentKey="hero.kicker"
                    fallback="Academic Rigor & Production Engineering · Sixth-Form & College Curriculum"
                    label="Hero Top Kicker"
                    as="span"
                  />
                </div>

                {/* Prominent centered H1 on load, smoothly moving left and scaling down */}
                <EditableText
                  contentKey="hero.title"
                  fallback="Master Code, Infrastructure, and Theory."
                  label="Hero Main H1 Title"
                  as="h1"
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] [text-wrap:balance]"
                />

                {/* Subtitle description placed beneath the header that moves together with the header */}
                <EditableText
                  contentKey="hero.description"
                  fallback="An advanced educational academy connecting idiomatic Python algorithm design, real POSIX Linux systems administration, and A-Level Computer Science theoretical specifications."
                  label="Hero Lead Description"
                  as="p"
                  className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-sans mt-4"
                />
              </div>

              {/* Supporting Details & CTAs: Hidden on initial load, smoothly revealed as Header moves left */}
              <div
                style={{
                  opacity: supportingContentOpacity,
                  transform: isMobile ? 'none' : `translateY(${(1 - scrollProgress) * 24}px)`,
                  pointerEvents: scrollProgress > 0.5 || isMobile ? 'auto' : 'none',
                  transition: isMobile ? 'none' : 'opacity 0.2s ease-out, transform 0.2s ease-out',
                }}
                className="space-y-6"
              >
                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <EditableButton
                    contentKey="hero.primaryCta"
                    fallback="Explore Tracks"
                    label="Hero Primary CTA Button"
                    onClick={() => onSelectTab('python')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 ${
                      isMidnight
                        ? 'bg-[#00e5ff] hover:bg-[#38bdf8] text-black shadow-lg shadow-cyan-500/25 focus-visible:ring-[#00e5ff]'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 focus-visible:ring-emerald-400'
                    }`}
                    icon={<ArrowRight className="w-4 h-4 ml-1" />}
                    iconPosition="right"
                  />

                  <EditableButton
                    contentKey="hero.secondaryCta"
                    fallback="Launch Web Terminal"
                    label="Hero Secondary CTA Button"
                    onClick={onLaunchTerminal}
                    className={`px-5 py-3 rounded-xl border text-sm transition-all flex items-center gap-2 font-mono focus:outline-none focus-visible:ring-2 ${
                      isMidnight
                        ? 'border-cyan-400/40 bg-black hover:bg-slate-950 text-[#00e5ff] focus-visible:ring-[#00e5ff]'
                        : 'border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 focus-visible:ring-slate-400'
                    }`}
                    icon={<Terminal className={`w-4 h-4 mr-1 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />}
                    iconPosition="left"
                  />
                </div>

                {/* Adjacency Proof Metrics */}
                <div
                  className={`pt-6 border-t grid grid-cols-3 gap-4 text-left ${
                    isMidnight ? 'border-[#14233c]' : 'border-slate-800/80'
                  }`}
                >
                  <div>
                    <EditableText
                      contentKey="hero.stat1Value"
                      fallback="3 Core"
                      label="Hero Stat 1 Value"
                      as="div"
                      className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums"
                    />
                    <EditableText
                      contentKey="hero.stat1Label"
                      fallback="Unified Learning Tracks"
                      label="Hero Stat 1 Label"
                      as="div"
                      className="text-xs text-slate-400 mt-0.5"
                    />
                  </div>
                  <div>
                    <EditableText
                      contentKey="hero.stat2Value"
                      fallback="100%"
                      label="Hero Stat 2 Value"
                      as="div"
                      className={`text-xl sm:text-2xl font-mono font-bold tabular-nums ${
                        isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'
                      }`}
                    />
                    <EditableText
                      contentKey="hero.stat2Label"
                      fallback="Interactive In-Browser Labs"
                      label="Hero Stat 2 Label"
                      as="div"
                      className="text-xs text-slate-400 mt-0.5"
                    />
                  </div>
                  <div>
                    <EditableText
                      contentKey="hero.stat3Value"
                      fallback="OCR / AQA"
                      label="Hero Stat 3 Value"
                      as="div"
                      className="text-xl sm:text-2xl font-mono font-bold text-cyan-400 tabular-nums"
                    />
                    <EditableText
                      contentKey="hero.stat3Label"
                      fallback="Exam Board Alignment"
                      label="Hero Stat 3 Label"
                      as="div"
                      className="text-xs text-slate-400 mt-0.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Large Product Image scrolling up from the bottom */}
            <div
              style={{
                transform: isMobile ? 'none' : `translate3d(0px, ${imageTranslateY}vh, 0px)`,
                opacity: isMobile ? 1 : Math.min(1, 0.2 + scrollProgress * 0.8),
                transition: isMobile ? 'none' : 'transform 0.08s ease-out',
                willChange: isMobile ? 'auto' : 'transform, opacity',
              }}
              className="lg:col-span-5 relative z-10"
            >
              <div
                className={`rounded-2xl border p-2 shadow-2xl relative overflow-hidden transition-colors ${
                  isMidnight
                    ? 'border-[#142542] bg-[#04060a]'
                    : 'border-slate-800 bg-[#0d121f]/90'
                }`}
              >
                {/* Profile Picture container ensuring full visibility without cropping */}
                <div className="overflow-hidden rounded-xl bg-slate-950/40 relative flex items-center justify-center">
                  <img
                    src={heroProductImage}
                    alt="Instructor Profile Picture"
                    referrerPolicy="no-referrer"
                    onLoad={() => setImageLoaded(true)}
                    className="w-full h-auto max-h-[62vh] object-contain rounded-xl filter brightness-100 transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Progress indicator during scrub on desktop */}
              {!isMobile && scrollProgress > 0.05 && scrollProgress < 0.95 && (
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 animate-fadeIn">
                  <span className="text-slate-500">Locking 2-Column Grid:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-75 ${
                          isMidnight ? 'bg-[#00e5ff]' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-slate-300">
                      {Math.round(scrollProgress * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Quiet scroll-down cue on initial load */}
        {!isMobile && scrollProgress < 0.15 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[11px] font-mono text-slate-400 pointer-events-none transition-opacity duration-300">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">
              Scroll down to transition layout
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce text-slate-400" />
          </div>
        )}
      </div>
    </section>
  );
};
