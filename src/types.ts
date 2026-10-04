/**
 * Core type definitions for the Shaheen Academy educational platform.
 */

export type NavigationTab = 'home' | 'python' | 'linux' | 'theory' | 'resources' | 'contact';

export type TrackId = 'python' | 'linux' | 'theory';

export interface CurriculumModule {
  id: string;
  title: string;
  level: 'Foundation' | 'Intermediate' | 'Advanced' | 'Exam Spec';
  estimatedHours: number;
  description: string;
  topics: string[];
  prerequisites?: string[];
}

export interface CourseTrack {
  id: TrackId;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  modules: CurriculumModule[];
  accentColor: string;
  imagePath: string;
  learningOutcomes: string[];
}

// -------------------------------------------------------------
// Interactive Syntax Matcher Types
// -------------------------------------------------------------
export interface MatchPair {
  id: string;
  concept: string; // The code snippet or keyword
  description: string; // The explanation, output, or concept definition
  category: 'Syntax' | 'Data Structures' | 'OOP' | 'Algorithms';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface MatchGameState {
  selectedConceptId: string | null;
  selectedDefinitionId: string | null;
  matchedPairIds: string[];
  wrongPairAttempt: { conceptId: string; definitionId: string } | null;
  score: number;
  streak: number;
  attempts: number;
  secondsElapsed: number;
  isCompleted: boolean;
}

// -------------------------------------------------------------
// Mock Terminal Types
// -------------------------------------------------------------
export interface VirtualFile {
  name: string;
  type: 'file' | 'directory';
  permissions: string; // e.g. "rwxr-xr-x"
  owner: string;
  size: string;
  updatedAt: string;
  content?: string;
  children?: Record<string, VirtualFile>;
}

export interface TerminalHistoryItem {
  id: string;
  command: string;
  output: string | string[];
  isError?: boolean;
  timestamp: string;
  cwd: string;
}

// -------------------------------------------------------------
// A-Level CS Theory Quiz Types
// -------------------------------------------------------------
export type TheoryTopic = 
  | 'Boolean Algebra'
  | 'Networking Architectures'
  | 'Data Representation'
  | 'Processors & Architecture';

export interface QuizQuestion {
  id: string;
  topic: TheoryTopic;
  examBoard: 'OCR' | 'AQA' | 'Cambridge 9618' | 'Universal';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  formulaOrRule?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<string, number>; // questionId -> option index
  showExplanation: Record<string, boolean>;
  bookmarkedQuestions: string[];
  isSubmitted: boolean;
  score: number;
}

// -------------------------------------------------------------
// Resource Library Types
// -------------------------------------------------------------
export type ResourceType = 'Cheat Sheet' | 'Past Paper' | 'Code Snippet' | 'Revision Guide';

export interface ResourceItem {
  id: string;
  title: string;
  track: TrackId | 'general';
  type: ResourceType;
  description: string;
  fileFormat: string;
  fileSize: string;
  contentPreview: string;
  downloadPayload: string;
  tags: string[];
  dateAdded: string;
}
