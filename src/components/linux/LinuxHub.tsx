import React, { useState } from 'react';
import { COURSE_TRACKS } from '../../data/mockData';
import { MockTerminal } from './MockTerminal';
import { useTheme } from '../../context/ThemeContext';
import { EditableText } from '../admin/EditableText';
import { Terminal, Shield, CheckCircle2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export const LinuxHub: React.FC = () => {
  const { isMidnight } = useTheme();
  const track = COURSE_TRACKS.find((t) => t.id === 'linux')!;
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('lx-1');

  // Interactive Permissions Calculator State
  // Owner (u), Group (g), Other (o)
  const [perms, setPerms] = useState({
    u: { r: true, w: true, x: true },
    g: { r: true, w: false, x: true },
    o: { r: true, w: false, x: true }
  });
  const [copiedChmod, setCopiedChmod] = useState(false);

  const togglePerm = (category: 'u' | 'g' | 'o', bit: 'r' | 'w' | 'x') => {
    setPerms((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [bit]: !prev[category][bit]
      }
    }));
  };

  const getOctalDigit = (obj: { r: boolean; w: boolean; x: boolean }) => {
    return (obj.r ? 4 : 0) + (obj.w ? 2 : 0) + (obj.x ? 1 : 0);
  };

  const getSymbolicString = (obj: { r: boolean; w: boolean; x: boolean }) => {
    return (obj.r ? 'r' : '-') + (obj.w ? 'w' : '-') + (obj.x ? 'x' : '-');
  };

  const octalMode = `${getOctalDigit(perms.u)}${getOctalDigit(perms.g)}${getOctalDigit(perms.o)}`;
  const symbolicMode = `${getSymbolicString(perms.u)}${getSymbolicString(perms.g)}${getSymbolicString(perms.o)}`;
  const chmodCommand = `chmod ${octalMode} script.sh`;

  const copyChmod = () => {
    navigator.clipboard.writeText(chmodCommand);
    setCopiedChmod(true);
    setTimeout(() => setCopiedChmod(false), 2000);
  };

  const toggleModule = (id: string) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
  };

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <div className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-md relative overflow-hidden transition-colors ${
        isMidnight 
          ? 'border-[#14233c] bg-black shadow-cyan-950/20' 
          : 'border-slate-800 bg-[#0d121f]/90'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className={`flex items-center gap-2 text-xs font-mono ${isMidnight ? 'text-[#00e5ff]' : 'text-cyan-400'}`}>
              <Terminal className="w-4 h-4" />
              <EditableText
                contentKey="linuxHub.kicker"
                fallback="Track 02 · POSIX Linux & Systems Engineering"
                label="Linux Hub Kicker"
                as="span"
              />
            </div>

            <EditableText
              contentKey="linuxHub.title"
              fallback="Linux & SysAdmin Terminal Lab"
              label="Linux Hub Main Header"
              as="h1"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            />

            <EditableText
              contentKey="linuxHub.description"
              fallback="From command-line filesystem traversal and stream redirection to octal permissions math, process signals, and production bash scripting."
              label="Linux Hub Description"
              as="p"
              className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl"
            />

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 ${isMidnight ? 'text-[#00e5ff]' : 'text-cyan-400'}`} />
                <span>POSIX Shell Navigation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 ${isMidnight ? 'text-[#00e5ff]' : 'text-cyan-400'}`} />
                <span>Octal Permission Bitmasks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 ${isMidnight ? 'text-[#00e5ff]' : 'text-cyan-400'}`} />
                <span>Pipes & Stream Filtering</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <img
              src={track.imagePath}
              alt="Linux Terminal Console"
              referrerPolicy="no-referrer"
              className={`w-full h-auto rounded-xl object-cover border shadow-lg aspect-[4/3] ${
                isMidnight ? 'border-[#14233c]' : 'border-slate-800'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Primary Feature: In-Browser Mock Linux Terminal */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className={`w-5 h-5 ${isMidnight ? 'text-[#00e5ff]' : 'text-cyan-400'}`} />
              <EditableText
                contentKey="linuxHub.terminalTitle"
                fallback="Simulated Linux CLI Environment"
                label="Terminal Sandbox Header"
                as="span"
              />
            </h2>
            <EditableText
              contentKey="linuxHub.terminalDesc"
              fallback="Interact directly with the virtual filesystem. Type commands like ls -la, cat notes.txt, or chmod 755 script.py."
              label="Terminal Sandbox Subtext"
              as="p"
              className="text-xs text-slate-400 mt-0.5"
            />
          </div>
        </div>
        <MockTerminal />
      </section>

      {/* Interactive Tool: Permissions & Octal Bitmask Visualizer */}
      <section className={`rounded-2xl border p-5 sm:p-6 space-y-6 transition-colors ${
        isMidnight ? 'border-[#14233c] bg-black' : 'border-slate-800 bg-[#0d121f]/90'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className={`flex items-center gap-2 text-xs font-mono ${isMidnight ? 'text-[#00e5ff]' : 'text-cyan-400'}`}>
              <Shield className="w-3.5 h-3.5" />
              <span>Interactive Calculator</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Linux File Permissions (chmod) Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Toggle read, write, and execute bits to inspect real-time octal representation and symbolic notation.
            </p>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-xl border font-mono text-xs ${
            isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-slate-900 border-slate-800'
          }`}>
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">Octal</span>
              <span className={`text-base font-bold tabular-nums ${isMidnight ? 'text-[#00e5ff]' : 'text-cyan-400'}`}>{octalMode}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">Symbolic</span>
              <span className={`text-base font-bold ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`}>{symbolicMode}</span>
            </div>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Owner */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase font-mono">User / Owner (u)</span>
              <span className={`font-mono text-xs font-bold ${isMidnight ? 'text-[#00e5ff]' : 'text-cyan-400'}`}>{getOctalDigit(perms.u)}</span>
            </div>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={perms.u.r}
                  onChange={() => togglePerm('u', 'r')}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Read (r = 4)</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={perms.u.w}
                  onChange={() => togglePerm('u', 'w')}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Write (w = 2)</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={perms.u.x}
                  onChange={() => togglePerm('u', 'x')}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Execute (x = 1)</span>
              </label>
            </div>
          </div>

          {/* Group */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase font-mono">Group (g)</span>
              <span className={`font-mono text-xs font-bold ${isMidnight ? 'text-[#00e5ff]' : 'text-cyan-400'}`}>{getOctalDigit(perms.g)}</span>
            </div>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={perms.g.r}
                  onChange={() => togglePerm('g', 'r')}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Read (r = 4)</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={perms.g.w}
                  onChange={() => togglePerm('g', 'w')}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Write (w = 2)</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={perms.g.x}
                  onChange={() => togglePerm('g', 'x')}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Execute (x = 1)</span>
              </label>
            </div>
          </div>

          {/* Other */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase font-mono">Others (o)</span>
              <span className={`font-mono text-xs font-bold ${isMidnight ? 'text-[#00e5ff]' : 'text-cyan-400'}`}>{getOctalDigit(perms.o)}</span>
            </div>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={perms.o.r}
                  onChange={() => togglePerm('o', 'r')}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Read (r = 4)</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={perms.o.w}
                  onChange={() => togglePerm('o', 'w')}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Write (w = 2)</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={perms.o.x}
                  onChange={() => togglePerm('o', 'x')}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Execute (x = 1)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Copyable Chmod Command */}
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
          isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">$</span>
            <span className={`font-semibold ${isMidnight ? 'text-[#00e5ff]' : 'text-cyan-300'}`}>{chmodCommand}</span>
          </div>

          <button
            onClick={copyChmod}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              isMidnight 
                ? 'bg-black border border-[#14233c] hover:border-cyan-400/40 text-slate-200' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {copiedChmod ? <Check className={`w-3.5 h-3.5 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedChmod ? 'Copied!' : 'Copy Command'}</span>
          </button>
        </div>
      </section>

      {/* Curriculum Modules */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Curriculum Modules & Syllabi</h2>
        <div className="space-y-3">
          {track.modules.map((m) => {
            const isExpanded = expandedModuleId === m.id;
            return (
              <div
                key={m.id}
                className="rounded-xl border border-slate-800 bg-[#0d121f]/70 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleModule(m.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-cyan-400">{m.level}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 font-mono">{m.estimatedHours} Hours</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{m.title}</h3>
                  </div>

                  <div className="p-1 rounded-lg text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/60 space-y-3 text-xs sm:text-sm text-slate-300">
                    <p className="leading-relaxed">{m.description}</p>
                    <div className="space-y-1 pt-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                        Core Competencies:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {m.topics.map((t, tIdx) => (
                          <li key={tIdx} className="flex items-center gap-2 text-slate-300 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
