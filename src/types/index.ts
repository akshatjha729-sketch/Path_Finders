export type UserRole = 'job_seeker' | 'recruiter' | 'admin';

export type AppLanguage = 'en';

export interface LanguageOption {
  code: AppLanguage;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  primarySkills: string[];
  resumeText: string;
  portfolioUrl?: string;
  experienceYears: number;
  accessibilityAccommodations: string[];
  assistivePreferences: {
    speechRate: number; // 0.8 to 1.5
    highContrast: boolean;
    fontSizeZoom: number; // 100, 110, 125, etc.
    autoReadSummaryOnSelect: boolean;
    voiceFeedbackEnabled: boolean;
    language?: AppLanguage;
  };
  lastUpdated: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string; // e.g. "India", "USA", "Canada", "UK", "Germany"
  city?: string; // e.g. "Bengaluru", "Hyderabad", "Pune", "Mumbai", "Delhi NCR"
  isRemote: boolean;
  salaryRange: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  department: string;
  description: string;
  keyResponsibilities: string[];
  requirements: string[];
  accommodationsOffered: string[];
  simplifiedSummary?: {
    roleOverview: string;
    keySkillsNeeded: string[];
    payAndSchedule: string;
    accommodations: string[];
  };
  recruiterId: string;
  postedDate: string;
  applicationCount: number;
  wcagAxeScore: number; // e.g. 100 (0 violations)
  status: 'Active' | 'Draft' | 'Closed';
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeSummary: string;
  skills: string[];
  accommodationsRequested: string[];
  coverNote?: string;
  submittedVia: 'Voice' | 'DOM 1-Click (Alt+V)' | 'Manual Form';
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Offer Extended' | 'Archived';
  matchScore: number; // 0-100%
  recruiterNotes?: string;
}

export interface DualLayerSummaryResult {
  source: 'nvidia-cloud' | 'gemini-cloud' | 'local-nlp-fallback';
  latencyMs: number;
  roleOverview: string;
  keySkillsNeeded: string[];
  payAndSchedule: string;
  accommodations: string[];
  fallbackReason?: string;
}

export interface VoiceCommandParseResult {
  source: 'nvidia-cloud' | 'gemini-cloud' | 'local-nlp-fallback';
  latencyMs: number;
  intent: 'search' | 'read' | 'summarize' | 'apply' | 'navigate' | 'contrast' | 'switch_role' | 'switch_tab' | 'switch_language' | 'filter_country' | 'help' | 'unknown';
  parameters: {
    keyword?: string;
    direction?: 'next' | 'previous' | 'home';
    role?: 'job_seeker' | 'recruiter';
    jobId?: string;
    setting?: string;
    country?: string;
    language?: AppLanguage;
    tab?: string;
    tabNumber?: number;
  };
  confidence: number;
  rawTranscript: string;
}

export interface VoiceInteraction {
  id: string;
  rawTranscript: string;
  parsedIntent: string;
  confidence: number;
  timestamp: string;
  source: 'nvidia-cloud' | 'gemini-cloud' | 'local-nlp-fallback';
  status: 'executed' | 'corrected' | 'failed';
  feedback?: string;
}

export interface SystemAnalytics {
  uptimeSeconds: number;
  totalJobs: number;
  totalApplications: number;
  activeJobSeekers: number;
  activeRecruiters: number;
  voiceCommandsExecuted: number;
  voiceSuccessRate: number; // percentage e.g. 97.4
  avgLatencyMs: number;
  slaComplianceRate: number; // % < 800ms
  dualLayerFallbacksCount: number;
  avgTimeSavedPerApplicationSeconds: number; // 85% cut from standard 14min
  wcagComplianceAudit: {
    axeViolationsCount: number;
    keyboardOperability: number; // 100%
    screenReaderCompatibility: number; // 100%
    colorContrastRatio: string; // "14.2:1 (AAA)"
  };
  backups: {
    id: string;
    timestamp: string;
    sizeKb: number;
    type: 'automatic-daily' | 'manual-snapshot';
    status: 'Healthy' | 'Verified';
  }[];
}

export interface AutomatedTestResult {
  id: string;
  category: 'Local NLP Fallback' | 'Cloud NVIDIA AI' | 'Cloud Gemini AI' | 'DOM Form Auto-Fill' | 'RBAC & Auth' | 'W3C Speech API' | 'WCAG 2.1 AAA';
  title: string;
  description: string;
  status: 'passed' | 'failed' | 'running';
  durationMs: number;
  assertion: string;
}
