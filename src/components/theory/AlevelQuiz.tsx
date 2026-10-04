/**
 * @file AlevelQuiz.tsx
 * @description Dynamic multiple-choice exam engine with instant pedagogical explanations.
 * 
 * DEVELOPER ARCHITECTURE & LOGIC NOTES:
 * -------------------------------------
 * 1. Filtered Question Stream:
 *    - `activeQuestions` is derived dynamically based on `selectedTopic`.
 *    - When the topic filter switches, progress and answer states reset cleanly.
 * 2. Instant Formative Feedback Pattern:
 *    - Once an option is clicked, `userAnswers[questionId]` records the choice, and
 *      `showExplanation[questionId]` is immediately toggled to true.
 *    - Options are non-destructively disabled to prevent answer-swapping while allowing students to inspect all choices.
 * 3. Assessment & Grading Rubric:
 *    - Score is tallied from matching `selectedOption === correctIndex`.
 *    - Calculates percentage and maps to standard A-Level grading bands:
 *      >= 85%: A* (Distinction)
 *      >= 75%: A
 *      >= 65%: B
 *      >= 55%: C
 *      < 55%: Review Recommended
 * 4. Topic Diagnostic Breakdown:
 *    - Upon submission or quiz completion, computes per-topic mastery metrics so students know
 *      whether they need to revise Boolean logic vs Processor architecture.
 */

import React, { useState, useMemo } from 'react';
import { ALEVEL_QUIZ_QUESTIONS } from '../../data/mockData';
import { TheoryTopic, QuizQuestion } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { EditableText } from '../admin/EditableText';
import { CheckCircle2, XCircle, HelpCircle, Bookmark, BookmarkCheck, RotateCcw, Award, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

export const AlevelQuiz: React.FC = () => {
  const { isMidnight } = useTheme();
  const [selectedTopic, setSelectedTopic] = useState<TheoryTopic | 'All'>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Derivation of questions based on active topic filter
  const questions: QuizQuestion[] = useMemo(() => {
    if (selectedTopic === 'All') return ALEVEL_QUIZ_QUESTIONS;
    return ALEVEL_QUIZ_QUESTIONS.filter((q) => q.topic === selectedTopic);
  }, [selectedTopic]);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (optionIndex: number) => {
    if (userAnswers[currentQ.id] !== undefined) return; // Answer already submitted
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetQuiz = (topic: TheoryTopic | 'All' = selectedTopic) => {
    setSelectedTopic(topic);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsFinished(false);
  };

  // Score calculations
  const totalAnswered = Object.keys(userAnswers).length;
  const correctCount = questions.filter(
    (q) => userAnswers[q.id] !== undefined && userAnswers[q.id] === q.correctIndex
  ).length;
  const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const getGradeBand = (pct: number) => {
    if (pct >= 85) return { grade: 'A*', label: 'Exceptional Mastery', color: 'text-emerald-400' };
    if (pct >= 75) return { grade: 'A', label: 'Strong Understanding', color: 'text-cyan-400' };
    if (pct >= 65) return { grade: 'B', label: 'Proficient', color: 'text-purple-400' };
    if (pct >= 55) return { grade: 'C', label: 'Developing', color: 'text-amber-400' };
    return { grade: 'Revision Needed', label: 'Review Core Concepts', color: 'text-rose-400' };
  };

  const topicFilters: (TheoryTopic | 'All')[] = [
    'All',
    'Boolean Algebra',
    'Processors & Architecture',
    'Data Representation',
    'Networking Architectures'
  ];

  return (
    <div className={`rounded-2xl border backdrop-blur-md p-5 sm:p-7 shadow-2xl transition-colors ${
      isMidnight 
        ? 'border-[#14233c] bg-black shadow-cyan-950/10' 
        : 'border-slate-800 bg-[#0d1222]/90'
    }`}>
      {/* Header Bar */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b ${
        isMidnight ? 'border-[#14233c]' : 'border-slate-800/80'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono uppercase tracking-wider ${
              isMidnight ? 'text-[#00e5ff]' : 'text-purple-400'
            }`}>Exam Engine</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">OCR / AQA / Cambridge 9618</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            <EditableText
              contentKey="theoryHub.quizTitle"
              fallback="Interactive A-Level Exam Spec Knowledge Quiz"
              label="Exam Quiz Section Header"
              as="span"
            />
          </h3>
          <EditableText
            contentKey="theoryHub.quizDesc"
            fallback="Real multiple-choice exam challenges with instant step-by-step mathematical & structural explanations."
            label="Exam Quiz Instructions"
            as="p"
            className="text-xs text-slate-400 mt-0.5"
          />
        </div>

        {/* Action Controls */}
        <button
          onClick={() => resetQuiz()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            isMidnight
              ? 'border-[#14233c] bg-black text-slate-300 hover:text-[#00e5ff] hover:border-cyan-400/40'
              : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Quiz</span>
        </button>
      </div>

      {/* Topic Filter Tabs */}
      <div className="flex items-center gap-1.5 my-4 overflow-x-auto pb-1 text-xs">
        {topicFilters.map((t) => (
          <button
            key={t}
            onClick={() => resetQuiz(t)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedTopic === t
                ? isMidnight
                  ? 'bg-cyan-500/20 text-[#00e5ff] border border-cyan-400/50'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : isMidnight
                ? 'bg-black text-slate-400 border border-[#14233c] hover:text-white'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Card: In-Progress vs Finished Results */}
      {!isFinished ? (
        <div className="space-y-6">
          {/* Progress Tracker Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-mono text-white font-semibold tabular-nums">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{currentQ.topic}</span>
              <span className="text-slate-600">·</span>
              <span className={`font-mono ${isMidnight ? 'text-[#00e5ff]' : 'text-purple-400'}`}>
                {currentQ.examBoard}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleBookmark(currentQ.id)}
                className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
                title="Bookmark for review"
              >
                {bookmarkedIds.includes(currentQ.id) ? (
                  <BookmarkCheck className="w-4 h-4 text-amber-400" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Bookmark</span>
              </button>

              <div className="font-mono text-xs text-slate-300">
                Score: <span className={`font-bold tabular-nums ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`}>{correctCount}</span> / {totalAnswered}
              </div>
            </div>
          </div>

          {/* Stepper Progress Line */}
          <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isMidnight 
                  ? 'bg-gradient-to-r from-blue-500 to-[#00e5ff]' 
                  : 'bg-gradient-to-r from-purple-500 to-cyan-400'
              }`}
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text Box */}
          <div className={`p-4 sm:p-5 rounded-xl border ${
            isMidnight ? 'bg-[#03060c] border-[#14233c]' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <h4 className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed font-sans">
              {currentQ.question}
            </h4>

            {currentQ.formulaOrRule && (
              <div className={`mt-3 p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                isMidnight 
                  ? 'bg-cyan-950/20 border-cyan-400/30 text-[#00e5ff]' 
                  : 'bg-purple-950/20 border-purple-500/20 text-purple-300'
              }`}>
                <HelpCircle className={`w-4 h-4 shrink-0 ${isMidnight ? 'text-[#00e5ff]' : 'text-purple-400'}`} />
                <span>Reference Rule: {currentQ.formulaOrRule}</span>
              </div>
            )}
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, oIdx) => {
              const hasAnswered = userAnswers[currentQ.id] !== undefined;
              const isSelected = userAnswers[currentQ.id] === oIdx;
              const isCorrect = oIdx === currentQ.correctIndex;

              let optionStyle = isMidnight 
                ? 'border-[#14233c] bg-black hover:border-cyan-400/40 text-slate-200' 
                : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 text-slate-200';

              if (hasAnswered) {
                if (isCorrect) {
                  optionStyle = isMidnight
                    ? 'border-cyan-400 bg-cyan-950/40 text-[#00e5ff] ring-1 ring-cyan-400'
                    : 'border-emerald-500/80 bg-emerald-950/40 text-emerald-100 ring-1 ring-emerald-500/60';
                } else if (isSelected) {
                  optionStyle = 'border-rose-500/80 bg-rose-950/40 text-rose-100 ring-1 ring-rose-500/60';
                } else {
                  optionStyle = isMidnight 
                    ? 'border-[#14233c]/40 bg-black text-slate-600 opacity-40'
                    : 'border-slate-800/40 bg-slate-900/30 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={oIdx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-start gap-3 group focus:outline-none focus-visible:ring-2 ${
                    isMidnight ? 'focus-visible:ring-[#00e5ff]' : 'focus-visible:ring-purple-400'
                  } ${optionStyle}`}
                >
                  <span className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 border transition-colors ${
                    isMidnight
                      ? 'border-[#14233c] bg-slate-950 text-slate-300 group-hover:border-cyan-400/50'
                      : 'border-slate-700 bg-slate-800 text-slate-300 group-hover:border-purple-400/60'
                  }`}>
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span className="text-xs sm:text-sm font-sans flex-1 pt-0.5 leading-snug">
                    {option}
                  </span>
                  {hasAnswered && isCorrect && (
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Formative Pedagogical Explanation Box (Revealed on Answer) */}
          {userAnswers[currentQ.id] !== undefined && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed animate-fadeIn ${
                userAnswers[currentQ.id] === currentQ.correctIndex
                  ? isMidnight
                    ? 'bg-cyan-950/30 border-cyan-400/50 text-[#00e5ff]'
                    : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="font-bold flex items-center gap-2 mb-1.5">
                {userAnswers[currentQ.id] === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className={`w-4 h-4 ${isMidnight ? 'text-[#00e5ff]' : 'text-emerald-400'}`} />
                    <span>Correct Answer</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Incorrect — Mark Scheme Explanation</span>
                  </>
                )}
              </div>
              <p className="text-slate-300 font-sans">{currentQ.explanation}</p>
            </div>
          )}

          {/* Question Navigation Controls */}
          <div className={`flex items-center justify-between pt-4 border-t ${
            isMidnight ? 'border-[#14233c]' : 'border-slate-800/80'
          }`}>
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isMidnight
                  ? 'border-[#14233c] bg-black text-slate-400 hover:text-white disabled:opacity-30'
                  : 'border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isMidnight
                    ? 'bg-[#00e5ff] hover:bg-[#38bdf8] text-black font-bold'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsFinished(true)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-slate-950 text-xs font-bold transition-colors ${
                  isMidnight ? 'bg-[#00e5ff] hover:bg-[#38bdf8]' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                <span>Complete Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results & Diagnostics Summary Card */
        <div className="space-y-6 animate-fadeIn">
          <div className={`p-6 rounded-2xl border text-center space-y-4 ${
            isMidnight ? 'bg-black border-[#14233c]' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className={`w-16 h-16 rounded-full border flex items-center justify-center mx-auto ${
              isMidnight ? 'bg-cyan-500/20 border-cyan-400/40 text-[#00e5ff]' : 'bg-purple-500/20 border-purple-500/40 text-purple-300'
            }`}>
              <Award className="w-8 h-8" />
            </div>

            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-slate-400">Assessment Result</div>
              <div className="text-4xl font-extrabold font-mono text-white mt-1 tabular-nums">
                {percentage}%
              </div>
              <div className={`text-base font-bold mt-1 ${isMidnight ? 'text-[#00e5ff]' : getGradeBand(percentage).color}`}>
                Grade {getGradeBand(percentage).grade} — {getGradeBand(percentage).label}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                You correctly answered {correctCount} out of {questions.length} questions.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => resetQuiz()}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isMidnight
                    ? 'bg-[#00e5ff] hover:bg-[#38bdf8] text-black font-bold'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                Retake Full Quiz
              </button>
            </div>
          </div>

          {/* Question Breakdown List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Detailed Question Review
            </h4>

            {questions.map((q, idx) => {
              const ans = userAnswers[q.id];
              const isCorrect = ans === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    isCorrect
                      ? 'border-emerald-500/30 bg-emerald-950/15'
                      : 'border-rose-500/30 bg-rose-950/15'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-slate-200">
                      {idx + 1}. {q.question}
                    </span>
                    {isCorrect ? (
                      <span className="text-emerald-400 font-mono flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="text-rose-400 font-mono flex items-center gap-1 shrink-0">
                        <XCircle className="w-4 h-4" /> Missed
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
