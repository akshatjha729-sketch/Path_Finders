import { AppLanguage, LanguageOption } from '../types/index.ts';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐', speechCode: 'en-US' },
];

export const TRANSLATIONS: Record<string, string> = {
  appName: 'VoiceHire AI',
  tagline: 'Accessible Job Application Assistant',
  home: 'Home',
  jobSeeker: 'Job Seeker',
  recruiter: 'Recruiter',
  voiceOn: 'Voice On',
  voiceOff: 'Turn On Voice',
  listening: 'Listening...',
  voicePaused: 'Voice Paused',
  highContrast: 'High Contrast',
  voiceCommands: 'Voice Commands',
  language: 'Language',
  
  // Landing
  landingTitle: 'VoiceHire AI',
  landingSubtitle: 'Zero-barrier, voice-first job gateway for job seekers and inclusive employers.',
  sayJobSeeker: 'Say: “Job Seeker”',
  sayRecruiter: 'Say: “Recruiter”',
  jobSeekerDesc: 'Find accessible jobs, listen to job descriptions aloud, simplify requirements with AI, and apply with 1 click.',
  recruiterDesc: 'Post accessible job openings, review candidate applications, and hire inclusive talent without accessibility barriers.',
  turnOnVoiceAction: 'Turn On Voice',
  listenInstructions: 'Listen to Voice Instructions',
  playingAudio: 'Playing Audio Guide...',
  
  // Assistant
  assistantBadgeHome: 'Home Portal Gateway',
  assistantBadgeJobs: 'Job Seeker > Accessible Job Board',
  assistantBadgeProfile: 'Job Seeker > Candidate Profile',
  assistantBadgeApplications: 'Job Seeker > My Applications',
  assistantBadgeRecruiterApps: 'Recruiter > Candidate Applications',
  assistantBadgeRecruiterJobs: 'Recruiter > Job Requisitions',
  assistantBadgeRecruiterPost: 'Recruiter > Post New Job',
  hearCommands: 'Hear Page Commands',
  stopSpeaking: 'Stop Speaking',
  lastHeard: 'Last Heard:',
  micIdle: 'Mic idle (Press Alt+M or V)',
  typeCommandPlaceholder: 'Type command (e.g. "jobs", "apply", "read", "profile")...',
  runBtn: 'Run',
  
  // Job board
  searchPlaceholder: 'Search by role, skill, or location (e.g. "React", "Jobs in India", "Remote")...',
  allLocations: 'All Locations',
  indiaOnly: 'India (All)',
  bengaluru: 'Bengaluru',
  delhiNcr: 'Delhi NCR',
  mumbai: 'Mumbai',
  pune: 'Pune',
  hyderabad: 'Hyderabad',
  usa: 'United States',
  canada: 'Canada',
  uk: 'United Kingdom',
  germany: 'Germany',
  allJobTypes: 'All Job Types',
  remoteOnly: 'Remote Only',
  availablePositions: 'Available Positions',
  clearFilters: 'Clear Filters',
  oneClickApply: '1-Click Apply',
  readAloud: 'Read Aloud',
  summarizeAI: 'AI Summary',
  atsMatch: 'ATS Match',
  
  // Profile
  candidateProfileTitle: 'Candidate Profile & Assistive Preferences',
  fullName: 'Full Name',
  email: 'Email Address',
  phone: 'Phone Number',
  location: 'Current Location',
  headline: 'Professional Headline',
  primarySkills: 'Primary Skills & Tools',
  accessibilityAccommodations: 'Accessibility Accommodations Requested',
  saveProfileBtn: 'Save Profile',
  
  // Applications
  myApplicationsTitle: 'My Submitted Applications',
  noApplicationsYet: 'No applications submitted yet. Search jobs and click 1-Click Apply!',
  
  // Spoken feedback
  spokenWelcome: 'Welcome to VoiceHire AI. Say Job Seeker to find jobs, or say Recruiter to hire.',
  spokenVoiceActive: 'Voice Assistant is active. Say any command or tab name.',
  spokenVoicePaused: 'Voice Assistant paused.',
  spokenSwitchedToSeeker: 'Switched to Job Seeker portal. Say Jobs to view openings.',
  spokenSwitchedToRecruiter: 'Switched to Recruiter portal. You can review applicants and post jobs.',
  spokenOpeningJobs: 'Opening Accessible Job Board.',
  spokenOpeningProfile: 'Opening Candidate Profile.',
  spokenOpeningApplications: 'Opening My Applications.',
  spokenLangChanged: 'Language set to English.',
};

/**
 * Clean voice text helper: strips punctuation and multiple spaces
 */
export function cleanSpeechText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Access translated string in English
 */
export function t(key: string, _lang?: AppLanguage): string {
  return TRANSLATIONS[key] || key;
}

export interface DetectedLocationResult {
  country?: string;
  city?: string;
  searchTerm?: string;
  displayLabel: string;
}

/**
 * Robust English parser for "Jobs in [Location/Country]"
 */
export function detectLocationFromVoiceCommand(transcript: string): DetectedLocationResult | null {
  const text = cleanSpeechText(transcript);

  // 1. Direct Location Keywords
  if (
    /\b(india|bharat)\b/i.test(text) &&
    /\b(job|jobs|work|career|opening|positions|vacancy)\b/i.test(text)
  ) {
    return { country: 'India', displayLabel: 'India (All)' };
  }

  if (/\b(bengaluru|bangalore)\b/i.test(text)) {
    return { city: 'Bengaluru', country: 'India', displayLabel: 'Bengaluru, India' };
  }

  if (/\b(pune)\b/i.test(text)) {
    return { city: 'Pune', country: 'India', displayLabel: 'Pune, India' };
  }

  if (/\b(hyderabad)\b/i.test(text)) {
    return { city: 'Hyderabad', country: 'India', displayLabel: 'Hyderabad, India' };
  }

  if (/\b(mumbai|bombay)\b/i.test(text)) {
    return { city: 'Mumbai', country: 'India', displayLabel: 'Mumbai, India' };
  }

  if (/\b(delhi|delhi ncr|gurugram|gurgaon|noida)\b/i.test(text)) {
    return { city: 'Delhi NCR', country: 'India', displayLabel: 'Delhi NCR, India' };
  }

  if (/\b(chennai|madras)\b/i.test(text)) {
    return { city: 'Chennai', country: 'India', displayLabel: 'Chennai, India' };
  }

  // 2. Global Countries
  if (/\b(usa|united states|america|us)\b/i.test(text)) {
    return { country: 'USA', displayLabel: 'United States (USA)' };
  }

  if (/\b(germany|berlin)\b/i.test(text)) {
    return { country: 'Germany', displayLabel: 'Germany' };
  }

  if (/\b(uk|united kingdom|britain|england|london)\b/i.test(text)) {
    return { country: 'UK', displayLabel: 'United Kingdom (UK)' };
  }

  if (/\b(canada|toronto)\b/i.test(text)) {
    return { country: 'Canada', displayLabel: 'Canada' };
  }

  // 3. Regex Patterns: "jobs in [X]" or "job in [X]"
  const inPatternMatch = text.match(/(?:jobs?|openings?|work|positions?|vacanc(?:y|ies))\s+(?:in|at|for)\s+([a-z\s]+)/i);
  if (inPatternMatch && inPatternMatch[1]) {
    const rawPlace = inPatternMatch[1].trim();
    if (rawPlace) {
      const capitalized = rawPlace.charAt(0).toUpperCase() + rawPlace.slice(1);
      return { country: capitalized, displayLabel: capitalized };
    }
  }

  return null;
}

/**
 * Detect language switch request - English only
 */
export function detectLanguageFromVoiceCommand(transcript: string): AppLanguage | null {
  const text = cleanSpeechText(transcript);
  if (/\b(english|speak english|set language english)\b/i.test(text)) {
    return 'en';
  }
  return null;
}

/**
 * Detect portal role from spoken voice in English
 */
export function detectRoleFromVoiceCommand(transcript: string): 'job_seeker' | 'recruiter' | null {
  const text = cleanSpeechText(transcript);

  // Recruiter
  if (
    /^(recruiter|recruiter mode|recruiter portal|employer|hiring)$/i.test(text) ||
    /\b(switch to recruiter|i am a recruiter|open recruiter|hiring portal|recruiter view)\b/i.test(text)
  ) {
    return 'recruiter';
  }

  // Job Seeker
  if (
    /^(job seeker|candidate|applicant|seeker|job seeker portal)$/i.test(text) ||
    /\b(switch to job seeker|switch to candidate|i am a job seeker|open job seeker|candidate portal|seeker view)\b/i.test(text)
  ) {
    return 'job_seeker';
  }

  return null;
}
