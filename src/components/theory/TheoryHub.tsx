import React, { useState } from 'react';
import { COURSE_TRACKS } from '../../data/mockData';
import { AlevelQuiz } from './AlevelQuiz';
import { useTheme } from '../../context/ThemeContext';
import { EditableText } from '../admin/EditableText';
import { Cpu, Binary, CheckCircle2, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';

export const TheoryHub: React.FC = () => {
  const { isMidnight } = useTheme();
  const track = COURSE_TRACKS.find((t) => t.id === 'theory')!;
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('th-1');

  // Interactive Truth Table State (Inputs A and B)
  const [inputA, setInputA] = useState<boolean>(true);
  const [inputB, setInputB] = useState<boolean>(false);

  const toggleModule = (id: string) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
  };

  // Boolean Calculations
  const notA = !inputA;
  const andVal = inputA && inputB;
  const orVal = inputA || inputB;
  const xorVal = (inputA || inputB) && !(inputA && inputB);
  const nandVal = !(inputA && inputB);
  const deMorganDecomp = (!inputA) || (!inputB); // ¬A ∨ ¬B == ¬(A ∧ B)

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
            <div className={`flex items-center gap-2 text-xs font-mono ${
              isMidnight ? 'text-[#00e5ff]' : 'text-purple-400'
            }`}>
              <Cpu className="w-4 h-4" />
              <EditableText
                contentKey="theoryHub.kicker"
                fallback="Track 03 · AQA / OCR / Cambridge 9618 Specification"
                label="Theory Hub Kicker"
                as="span"
              />
            </div>

            <EditableText
              contentKey="theoryHub.title"
              fallback="A-Level Computer Science Theory"
              label="Theory Hub Main Header"
              as="h1"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            />

            <EditableText
              contentKey="theoryHub.description"
              fallback="Rigorous foundations in Boolean logic simplification, internal processor registers (PC, MAR, MDR, ACC), TCP/IP network protocol stacks, and two’s complement data arithmetic."
              label="Theory Hub Description"
              as="p"
              className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl"
            />

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 ${isMidnight ? 'text-[#00e5ff]' : 'text-purple-400'}`} />
                <span>De Morgan & Karnaugh Maps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 ${isMidnight ? 'text-[#00e5ff]' : 'text-purple-400'}`} />
                <span>Fetch-Decode-Execute Cycles</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 ${isMidnight ? 'text-[#00e5ff]' : 'text-purple-400'}`} />
                <span>TCP/IP 4-Layer Architecture</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <img
              src={track.imagePath}
              alt="Processor Architecture Schematic"
              referrerPolicy="no-referrer"
              className={`w-full h-auto rounded-xl object-cover border shadow-lg aspect-[4/3] ${
                isMidnight ? 'border-[#14233c]' : 'border-slate-800'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Primary Feature: Dynamic A-Level Multiple Choice Quiz */}
      <section className="space-y-4">
        <AlevelQuiz />
      </section>

      {/* Interactive Boolean Gate & De Morgan's Law Verification Workbench */}
      <section className={`rounded-2xl border p-5 sm:p-6 space-y-6 transition-colors ${
        isMidnight ? 'border-[#14233c] bg-black' : 'border-slate-800 bg-[#0d121f]/90'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className={`flex items-center gap-2 text-xs font-mono ${
              isMidnight ? 'text-[#00e5ff]' : 'text-purple-400'
            }`}>
              <Binary className="w-3.5 h-3.5" />
              <span>Logic Circuit Workbench</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Boolean Algebra & De Morgan Equivalence Visualizer
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Toggle binary inputs A and B to observe gate logic and live verification of De Morgan’s Second Law: <span className={`font-mono ${isMidnight ? 'text-[#00e5ff]' : 'text-purple-300'}`}>¬(A ∧ B) ≡ ¬A ∨ ¬B</span>.
            </p>
          </div>

          {/* Input Bit Toggles */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setInputA(!inputA)}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                inputA
                  ? isMidnight
                    ? 'bg-blue-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/20'
                  : isMidnight
                  ? 'bg-black border-[#14233c] text-slate-400 hover:text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Input A: {inputA ? '1 (TRUE)' : '0 (FALSE)'}
            </button>
            <button
              onClick={() => setInputB(!inputB)}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                inputB
                  ? isMidnight
                    ? 'bg-[#00e5ff] border-cyan-300 text-black shadow-lg shadow-cyan-500/30'
                    : 'bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-600/20'
                  : isMidnight
                  ? 'bg-black border-[#14233c] text-slate-400 hover:text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Input B: {inputB ? '1 (TRUE)' : '0 (FALSE)'}
            </button>
          </div>
        </div>

        {/* Live Gates Table */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className={`p-3.5 rounded-xl border text-center ${
            isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <span className="text-[10px] text-slate-500 uppercase block mb-1">NOT A (¬A)</span>
            <span className={`text-base font-bold ${
              notA ? (isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400') : 'text-slate-500'
            }`}>
              {notA ? '1' : '0'}
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border text-center ${
            isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <span className="text-[10px] text-slate-500 uppercase block mb-1">AND (A ∧ B)</span>
            <span className={`text-base font-bold ${
              andVal ? (isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400') : 'text-slate-500'
            }`}>
              {andVal ? '1' : '0'}
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border text-center ${
            isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <span className="text-[10px] text-slate-500 uppercase block mb-1">OR (A ∨ B)</span>
            <span className={`text-base font-bold ${
              orVal ? (isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400') : 'text-slate-500'
            }`}>
              {orVal ? '1' : '0'}
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border text-center ${
            isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <span className="text-[10px] text-slate-500 uppercase block mb-1">XOR (A ⊕ B)</span>
            <span className={`text-base font-bold ${
              xorVal ? (isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400') : 'text-slate-500'
            }`}>
              {xorVal ? '1' : '0'}
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border text-center ${
            isMidnight ? 'bg-[#03060c] border-cyan-400/40' : 'bg-slate-900/80 border-purple-500/30'
          }`}>
            <span className={`text-[10px] uppercase block mb-1 ${isMidnight ? 'text-[#00e5ff]' : 'text-purple-400'}`}>
              NAND ¬(A ∧ B)
            </span>
            <span className={`text-base font-bold ${
              nandVal ? (isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400') : 'text-slate-500'
            }`}>
              {nandVal ? '1' : '0'}
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border text-center ${
            isMidnight ? 'bg-[#03060c] border-cyan-400/40' : 'bg-slate-900/80 border-purple-500/30'
          }`}>
            <span className={`text-[10px] uppercase block mb-1 ${isMidnight ? 'text-[#00e5ff]' : 'text-purple-400'}`}>
              De Morgan (¬A ∨ ¬B)
            </span>
            <span className={`text-base font-bold ${
              deMorganDecomp ? (isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400') : 'text-slate-500'
            }`}>
              {deMorganDecomp ? '1' : '0'}
            </span>
          </div>
        </div>

        {/* Mathematical Equivalence Note */}
        <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
          isMidnight 
            ? 'bg-cyan-950/20 border-cyan-400/40 text-[#00e5ff]' 
            : 'bg-purple-950/20 border-purple-500/30 text-purple-200'
        }`}>
          <span>De Morgan Law Status: ¬(A ∧ B) == (¬A ∨ ¬B)</span>
          <span className={`font-bold flex items-center gap-1 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Identical Output ({nandVal ? '1' : '0'} == {deMorganDecomp ? '1' : '0'})</span>
          </span>
        </div>
      </section>

      {/* Curriculum Syllabus Modules */}
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
                      <span className="font-mono text-purple-400">{m.level}</span>
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
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
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
