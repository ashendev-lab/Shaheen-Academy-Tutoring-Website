/**
 * @file SyntaxMatcher.tsx
 * @description Interactive concept-pairing mini-game for Python learners.
 * 
 * DEVELOPER ARCHITECTURE & LOGIC NOTES:
 * -------------------------------------
 * 1. State Machine:
 *    - Tracks separate selections: `selectedConceptId` (left column) and `selectedDefinitionId` (right column).
 *    - When both columns have an active selection, `checkMatch()` evaluates whether their IDs correlate.
 * 2. Visual & Audio/Haptic Feedback:
 *    - Matching items are added to `matchedPairIds` and highlighted with emerald glow before locking.
 *    - Mismatches trigger a temporary `wrongPairAttempt` state for 700ms to trigger a subtle red shake animation,
 *      then resets the active selections without clearing previous matches.
 * 3. Scoring Calculus:
 *    - Base score per correct match: 100 points.
 *    - Streak multiplier: +25% bonus per consecutive match without errors.
 *    - Time penalty/bonus: Higher score for completing the board quickly.
 * 4. Accessibility:
 *    - Supports keyboard focus and click-to-match interaction, ensuring usability across touchscreens and desktop.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { SYNTAX_MATCH_PAIRS } from '../../data/mockData';
import { MatchPair } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, RotateCcw, CheckCircle2, AlertCircle, Timer, Flame, Trophy } from 'lucide-react';

interface SyntaxMatcherProps {
  initialDifficulty?: 'Beginner' | 'Intermediate';
}

export const SyntaxMatcher: React.FC<SyntaxMatcherProps> = ({ initialDifficulty = 'Beginner' }) => {
  const { isMidnight } = useTheme();
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate'>(initialDifficulty);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [selectedDefinitionId, setSelectedDefinitionId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [wrongAttempt, setWrongAttempt] = useState<{ conceptId: string; definitionId: string } | null>(null);
  
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Filter pairs by active difficulty
  const activePool = useMemo(() => {
    return SYNTAX_MATCH_PAIRS.filter((p) => p.difficulty === difficulty);
  }, [difficulty]);

  // Shuffled concept column (left) and definition column (right)
  const [leftConcepts, setLeftConcepts] = useState<MatchPair[]>([]);
  const [rightDefinitions, setRightDefinitions] = useState<MatchPair[]>([]);

  // Function to initialize or reset game state
  const resetGame = (newDifficulty = difficulty) => {
    setSelectedConceptId(null);
    setSelectedDefinitionId(null);
    setMatchedPairIds([]);
    setWrongAttempt(null);
    setScore(0);
    setStreak(0);
    setSeconds(0);
    setIsTimerRunning(false);

    const pool = SYNTAX_MATCH_PAIRS.filter((p) => p.difficulty === newDifficulty);
    // Fisher-Yates shuffle
    const shuffledLeft = [...pool].sort(() => Math.random() - 0.5);
    const shuffledRight = [...pool].sort(() => Math.random() - 0.5);

    setLeftConcepts(shuffledLeft);
    setRightDefinitions(shuffledRight);
  };

  // Re-seed on mount or difficulty switch
  useEffect(() => {
    resetGame(difficulty);
  }, [difficulty]);

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && matchedPairIds.length < activePool.length) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, matchedPairIds.length, activePool.length]);

  /**
   * Concept card selection handler (Left column)
   */
  const handleSelectConcept = (id: string) => {
    if (matchedPairIds.includes(id)) return;
    if (!isTimerRunning) setIsTimerRunning(true);

    if (selectedConceptId === id) {
      setSelectedConceptId(null);
      return;
    }

    setSelectedConceptId(id);

    // If definition already selected, evaluate match
    if (selectedDefinitionId) {
      evaluatePair(id, selectedDefinitionId);
    }
  };

  /**
   * Definition card selection handler (Right column)
   */
  const handleSelectDefinition = (id: string) => {
    if (matchedPairIds.includes(id)) return;
    if (!isTimerRunning) setIsTimerRunning(true);

    if (selectedDefinitionId === id) {
      setSelectedDefinitionId(null);
      return;
    }

    setSelectedDefinitionId(id);

    // If concept already selected, evaluate match
    if (selectedConceptId) {
      evaluatePair(selectedConceptId, id);
    }
  };

  /**
   * Match evaluation logic
   */
  const evaluatePair = (cId: string, dId: string) => {
    if (cId === dId) {
      // Successful match
      const newMatches = [...matchedPairIds, cId];
      setMatchedPairIds(newMatches);
      setSelectedConceptId(null);
      setSelectedDefinitionId(null);
      setWrongAttempt(null);

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      // Score bonus based on streak
      const pointsEarned = 100 + (newStreak - 1) * 25;
      setScore((prev) => prev + pointsEarned);

      if (newMatches.length === activePool.length) {
        setIsTimerRunning(false);
      }
    } else {
      // Mismatch
      setWrongAttempt({ conceptId: cId, definitionId: dId });
      setStreak(0);

      // Reset selection after brief animation delay
      setTimeout(() => {
        setSelectedConceptId(null);
        setSelectedDefinitionId(null);
        setWrongAttempt(null);
      }, 700);
    }
  };

  const isCompleted = activePool.length > 0 && matchedPairIds.length === activePool.length;

  return (
    <div className={`rounded-2xl border backdrop-blur-md p-5 sm:p-6 shadow-xl transition-colors ${
      isMidnight 
        ? 'border-[#14233c] bg-black shadow-cyan-950/10' 
        : 'border-slate-800 bg-[#0d121f]/90'
    }`}>
      {/* Header Deck: Controls & Metrics */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b ${
        isMidnight ? 'border-[#14233c]' : 'border-slate-800/80'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono uppercase tracking-wider ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`}>
              Interactive Lab
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Memory & Concept Pairing</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Python Syntax & Idiom Matcher</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click a code construct on the left, then select its matching definition or runtime output on the right.
          </p>
        </div>

        {/* Tier Selector & Reset */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className={`inline-flex rounded-lg border p-0.5 ${
            isMidnight ? 'bg-black border-[#14233c]' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <button
              onClick={() => {
                setDifficulty('Beginner');
                resetGame('Beginner');
              }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                difficulty === 'Beginner'
                  ? isMidnight
                    ? 'bg-cyan-500/20 text-[#00e5ff] font-semibold'
                    : 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => {
                setDifficulty('Intermediate');
                resetGame('Intermediate');
              }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                difficulty === 'Intermediate'
                  ? isMidnight
                    ? 'bg-cyan-500/20 text-[#00e5ff] font-semibold'
                    : 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Intermediate
            </button>
          </div>

          <button
            onClick={() => resetGame()}
            className={`p-1.5 rounded-lg border transition-colors ${
              isMidnight
                ? 'border-[#14233c] bg-black text-slate-400 hover:text-white hover:border-cyan-400/50'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
            title="Reset Game"
            aria-label="Reset Matcher Board"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time Scoreboard Bar */}
      <div className={`grid grid-cols-4 gap-2 my-4 py-3 px-4 rounded-xl border text-xs ${
        isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-slate-900/60 border-slate-800/60'
      }`}>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Score</div>
            <div className="font-mono font-bold text-slate-100 tabular-nums">{score}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Streak</div>
            <div className={`font-mono font-bold tabular-nums ${isMidnight ? 'text-[#00e5ff]' : 'text-slate-100'}`}>{streak}x</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Time</div>
            <div className="font-mono font-bold text-slate-100 tabular-nums">{seconds}s</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Matched</div>
            <div className="font-mono font-bold text-slate-100 tabular-nums">
              {matchedPairIds.length} / {activePool.length}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between animate-fadeIn ${
          isMidnight 
            ? 'bg-cyan-950/30 border-cyan-400/40 text-cyan-100' 
            : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${
              isMidnight ? 'bg-cyan-500/20 border-cyan-400/40 text-[#00e5ff]' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Board Cleared! Excellent Comprehension</h4>
              <p className="text-xs opacity-80">
                Completed in {seconds} seconds with a high streak of {bestStreak}x. Final Score: {score} pts.
              </p>
            </div>
          </div>
          <button
            onClick={() => resetGame()}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors ${
              isMidnight 
                ? 'bg-[#00e5ff] hover:bg-[#38bdf8] text-black' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Game Board: Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Code Constructs */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-400 px-1 flex items-center justify-between">
            <span>Code Syntax / Expression</span>
            <span className="text-[11px] text-slate-500">Step 1</span>
          </div>

          {leftConcepts.map((item) => {
            const isMatched = matchedPairIds.includes(item.id);
            const isSelected = selectedConceptId === item.id;
            const isWrong = wrongAttempt?.conceptId === item.id;

            return (
              <button
                key={`concept-${item.id}`}
                disabled={isMatched}
                onClick={() => handleSelectConcept(item.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 relative group focus:outline-none focus-visible:ring-2 ${
                  isMatched
                    ? isMidnight
                      ? 'border-cyan-500/40 bg-cyan-950/20 text-[#00e5ff]/70 opacity-70 cursor-default'
                      : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300/70 opacity-70 cursor-default'
                    : isWrong
                    ? 'border-red-500/60 bg-red-950/30 text-red-200 scale-[0.98]'
                    : isSelected
                    ? isMidnight
                      ? 'border-[#00e5ff] bg-cyan-950/40 text-cyan-100 shadow-lg shadow-cyan-950/50 ring-1 ring-[#00e5ff]'
                      : 'border-emerald-400 bg-emerald-950/40 text-emerald-200 shadow-lg shadow-emerald-900/20 ring-1 ring-emerald-400'
                    : isMidnight
                    ? 'border-[#14233c] bg-black hover:bg-[#03060c] text-slate-200 hover:border-cyan-400/40'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                    {item.category}
                  </span>
                  {isMatched && (
                    <span className={`text-xs font-mono flex items-center gap-1 ${
                      isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Paired</span>
                    </span>
                  )}
                </div>

                <pre className={`font-mono text-xs sm:text-[13px] overflow-x-auto whitespace-pre-wrap leading-relaxed ${
                  isMidnight ? 'text-[#00e5ff]' : 'text-emerald-300'
                }`}>
                  <code>{item.concept}</code>
                </pre>
              </button>
            );
          })}
        </div>

        {/* Right Column: Definitions / Explanations */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-400 px-1 flex items-center justify-between">
            <span>Concept Meaning / Behavior</span>
            <span className="text-[11px] text-slate-500">Step 2</span>
          </div>

          {rightDefinitions.map((item) => {
            const isMatched = matchedPairIds.includes(item.id);
            const isSelected = selectedDefinitionId === item.id;
            const isWrong = wrongAttempt?.definitionId === item.id;

            return (
              <button
                key={`def-${item.id}`}
                disabled={isMatched}
                onClick={() => handleSelectDefinition(item.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 relative group focus:outline-none focus-visible:ring-2 ${
                  isMatched
                    ? isMidnight
                      ? 'border-cyan-500/40 bg-cyan-950/20 text-[#00e5ff]/70 opacity-70 cursor-default'
                      : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300/70 opacity-70 cursor-default'
                    : isWrong
                    ? 'border-red-500/60 bg-red-950/30 text-red-200 scale-[0.98]'
                    : isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-100 shadow-lg shadow-cyan-900/20 ring-1 ring-cyan-400'
                    : isMidnight
                    ? 'border-[#14233c] bg-black hover:bg-[#03060c] text-slate-300 hover:border-cyan-400/40'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                    Definition
                  </span>
                  {isMatched && (
                    <span className={`text-xs font-mono flex items-center gap-1 ${
                      isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Paired</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
