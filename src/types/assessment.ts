export type EducationLevel = 'tieuhoc' | 'thcs' | 'thpt';

export type ExamObjective = 
  | 'input' 
  | 'regular' 
  | 'periodic' 
  | 'post_topic' 
  | 'other';

export interface ExamInfo {
  subject: string;
  educationLevel: EducationLevel;
  grade: string;
  examObjective: ExamObjective;
  examObjectiveCustom: string;
  durationMinutes: number;
  knowledgeScope: string;
  learningOutcomes: string[];
  totalScore: number;
}

export type CreationMode = 'template' | 'custom' | null;

export type QuestionType = 
  | 'multiple_choice' 
  | 'true_false' 
  | 'short_answer' 
  | 'essay';

export interface TemplateSectionAnalysis {
  id: string;
  name: string;
  questionType: QuestionType;
  questionCount: number;
  pointsPerQuestion: number;
  totalPoints: number;
  subStatementsCount?: number; // e.g. 4 for true/false
  optionsCount?: number; // e.g. 4 for MCQ
  cognitiveLevelIdentified?: string;
  presentationStructure?: string;
  note?: string;
}

export interface TemplateAnalysis {
  fileName: string;
  fileSize: number;
  sections: TemplateSectionAnalysis[];
  detectedTotalScore: number;
  detectedDurationMinutes?: number;
  hasAmbiguousLevels: boolean;
  ambiguityNote?: string;
  isConfirmed: boolean;
}

export interface SourceDocument {
  id: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  readStatus: 'reading' | 'success' | 'warning' | 'error';
  recognizedTopics: string[];
  errorPages: Array<{
    pageNumber: number;
    reason: string;
    locationSnippet?: string;
  }>;
  isConfirmedAsSource: boolean;
  contentSnippet: string;
}

export interface CognitiveLevelProfile {
  id: string;
  name: string;
  levels: string[];
  description: string;
  isOfficial?: boolean;
}

export interface BlueprintRow {
  id: string;
  topic: string;
  learningOutcome: string;
  questionType: QuestionType;
  cognitiveLevel: string;
  questionCount: number;
  pointsPerQuestion: number;
  totalPoints: number;
}

export type VerificationStatus = 
  | 'not_verified' 
  | 'verified' 
  | 'not_applicable' 
  | 'needs_confirmation';

export interface RegulatoryProfile {
  id: string;
  docNumber: string;
  issueDate: string;
  issuingBody: string;
  title: string;
  scope: string;
  testType: string;
  gradeLevel: string;
  verificationSource: string;
  verificationDate: string;
  status: VerificationStatus;
  allowedLevels: string[];
  rulesSummary: string;
  officialDocUrl?: string;
}

export interface QuestionSubStatement {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface ScoringCriterion {
  step: string;
  criterion: string;
  points: number;
  note?: string;
}

export interface QuestionSchema {
  id: string;
  number: number;
  section: string;
  topic: string;
  learningOutcome: string;
  type: QuestionType;
  level: string;
  score: number;
  sourceReference: string;
  prompt: string;
  options?: QuestionOption[];
  subStatements?: QuestionSubStatement[];
  correctAnswer: string;
  solution: string;
  scoringCriteria: ScoringCriterion[];
  shortAnswerSpecs?: {
    standardAnswer: string;
    acceptedEquivalents: string[];
    unit?: string;
    tolerance?: string;
    roundingRules?: string;
  };
}

export interface ValidationItem {
  id: string;
  type: 'valid' | 'warning' | 'error';
  category: 'score' | 'count' | 'level' | 'time' | 'source' | 'structure' | 'regulation';
  title: string;
  detail: string;
  fixSuggestion?: string;
}

export interface ValidationResult {
  isValid: boolean; // No error level items
  canProceed: boolean;
  items: ValidationItem[];
  totalScoreCalculated: number;
  totalScoreTarget: number;
  scoreDifference: number;
  estimatedDuration: number;
  declaredDuration: number;
  regulatoryConflicts?: Array<{
    targetField: string;
    regulationRule: string;
    currentValue: string;
    recommendedValue: string;
  }>;
}

export interface QACheckItem {
  id: number;
  name: string;
  category: string;
  status: 'pass' | 'warning' | 'fail';
  description: string;
  details?: string;
}

export interface QAReport {
  passed: boolean;
  totalScoreVerified: number;
  totalQuestionsVerified: number;
  checks: QACheckItem[];
  summary: string;
  timestamp: string;
}

export interface GeneratedAssessmentData {
  examInfo: ExamInfo;
  questions: QuestionSchema[];
  blueprint: BlueprintRow[];
  totalScore: number;
  totalQuestions: number;
  qaReport: QAReport;
  generatedAt: string;
}
