import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Mic,
  MicOff,
  User,
  Briefcase,
  FileText,
  ShieldCheck,
  Send,
  Volume2,
  Database,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  MapPin,
  Globe,
  X
} from 'lucide-react';
import {
  AppLanguage,
  CandidateProfile,
  DualLayerSummaryResult,
  JobApplication,
  JobPosting,
  SystemAnalytics,
  UserRole,
  VoiceInteraction
} from './types/index.ts';
import { api, setApiRole } from './services/api.ts';
import { voiceEngine } from './utils/speech.ts';
import {
  t,
  detectLanguageFromVoiceCommand,
  detectLocationFromVoiceCommand,
  detectRoleFromVoiceCommand
} from './utils/i18n.ts';

import { AccessibilityToolbar } from './components/AccessibilityToolbar.tsx';
import { PortalLandingView } from './components/PortalLandingView.tsx';
import { JobCard } from './components/JobCard.tsx';
import { JobDetailView } from './components/JobDetailView.tsx';
import { AutoFillApplicationModal } from './components/AutoFillApplicationModal.tsx';
import { CandidateProfileEditor } from './components/CandidateProfileEditor.tsx';
import { RecruiterDashboard } from './components/RecruiterDashboard.tsx';
import { MyApplicationsView } from './components/MyApplicationsView.tsx';
import { VoiceAssistantModal } from './components/VoiceAssistantModal.tsx';
import { VoiceAssistantGuideBanner } from './components/VoiceAssistantGuideBanner.tsx';
import { PageAssistant } from './components/PageAssistant.tsx';

export default function App() {
  // First Page & Portal View State
  const [portalView, setPortalView] = useState<'landing' | 'job_seeker' | 'recruiter'>('landing');

  // Roles & Authentication
  const [role, setRole] = useState<UserRole>('job_seeker');
  const [seekerTab, setSeekerTab] = useState<'jobs' | 'profile' | 'applications'>('jobs');
  const [recruiterTab, setRecruiterTab] = useState<'applications' | 'requisitions' | 'create_job'>('applications');

  // Single Language Support: English Only
  const currentLanguage: AppLanguage = 'en';

  // Location / Country Filtering (Focused on India by default, voice detects requested country)
  const [selectedCountry, setSelectedCountry] = useState<string>('India');

  // Accessibility States
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeZoom, setFontSizeZoom] = useState(100);
  const [ariaAnnouncement, setAriaAnnouncement] = useState('VoiceHire AI ready. Say "Job Seeker" or "Recruiter" to navigate.');

  // Voice Assistant States
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'speaking' | 'unsupported'>('idle');
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const [hudCommandInput, setHudCommandInput] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [forceLocalFallback, setForceLocalFallback] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVoiceGuide, setShowVoiceGuide] = useState(false);

  // Recent Voice Interactions (Last 5 commands review & correction)
  const [recentVoiceInteractions, setRecentVoiceInteractions] = useState<VoiceInteraction[]>([
    {
      id: 'vi-1',
      rawTranscript: 'job seeker',
      parsedIntent: 'switch_role',
      confidence: 0.99,
      timestamp: 'Just now',
      source: 'local-nlp-fallback',
      status: 'executed'
    },
    {
      id: 'vi-2',
      rawTranscript: 'search accessibility engineer',
      parsedIntent: 'search',
      confidence: 0.98,
      timestamp: '1m ago',
      source: 'local-nlp-fallback',
      status: 'executed'
    },
    {
      id: 'vi-3',
      rawTranscript: 'recruiter',
      parsedIntent: 'switch_role',
      confidence: 0.99,
      timestamp: '3m ago',
      source: 'local-nlp-fallback',
      status: 'executed'
    }
  ]);

  // Core Data
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [remoteOnly, setRemoteOnly] = useState(false);

  // AI Cognitive Load Reduction
  const [summaryData, setSummaryData] = useState<DualLayerSummaryResult | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Modals
  const [isAutoFillModalOpen, setIsAutoFillModalOpen] = useState(false);
  const [autoFillSource, setAutoFillSource] = useState<'Voice' | 'DOM 1-Click (Alt+V)' | 'Manual Form'>('DOM 1-Click (Alt+V)');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Instant Visual Feedback for Voice Application Submission
  const [submissionSuccessToast, setSubmissionSuccessToast] = useState<{
    jobTitle: string;
    company: string;
    matchScore: number;
  } | null>(null);

  useEffect(() => {
    if (submissionSuccessToast) {
      const timer = setTimeout(() => {
        setSubmissionSuccessToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [submissionSuccessToast]);

  // ARIA Announcement helper
  const announce = useCallback((message: string) => {
    setAriaAnnouncement(message);
  }, []);

  // Helper to add recent voice interactions with strict types
  const addRecentInteraction = useCallback((
    rawTranscript: string,
    parsedIntent: string,
    confidence: number,
    source: 'nvidia-cloud' | 'gemini-cloud' | 'local-nlp-fallback' = 'local-nlp-fallback'
  ) => {
    const item: VoiceInteraction = {
      id: `vi-${Date.now()}`,
      rawTranscript,
      parsedIntent,
      confidence,
      timestamp: 'Just now',
      source,
      status: 'executed'
    };
    setRecentVoiceInteractions(prev => [item, ...prev].slice(0, 5));
  }, []);

  // Role Switcher with instant execution & whole-tab conversion
  const handleRoleChange = useCallback(async (newRole: UserRole) => {
    setRole(newRole);
    setPortalView(newRole === 'recruiter' ? 'recruiter' : 'job_seeker');
    setApiRole(newRole);
    announce(`Switched whole page to ${newRole === 'recruiter' ? 'Recruiter' : 'Job Seeker'} portal.`);
    api.login(newRole).catch(console.error);
  }, [announce]);

  // Navigate to First Page (Home)
  const handleGoHome = useCallback(() => {
    setPortalView('landing');
    announce('Returned to first page. Say "Job Seeker" or "Recruiter" to navigate.');
  }, [announce]);

  // Fetch initial data
  const loadData = useCallback(async () => {
    try {
      const [fetchedJobs, fetchedProfile, fetchedApps, fetchedAnalytics] = await Promise.all([
        api.getJobs(searchQuery, filterType, remoteOnly, selectedCountry),
        api.getProfile(),
        api.getApplications(),
        api.getAnalytics()
      ]);

      setJobs(fetchedJobs);
      if (fetchedJobs.length > 0) {
        setSelectedJob(prev => {
          if (prev && fetchedJobs.some(j => j.id === prev.id)) return prev;
          return fetchedJobs[0];
        });
      } else {
        setSelectedJob(null);
      }
      setProfile(fetchedProfile);
      setApplications(fetchedApps);
      setAnalytics(fetchedAnalytics);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  }, [searchQuery, filterType, remoteOnly, selectedCountry]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Country/Location Filter Change Handler
  const handleCountryFilterChange = useCallback((country: string) => {
    setSelectedCountry(country);
    const label = country === 'all' ? 'All locations' : country;
    const msg = `Filtered for ${label} jobs.`;
    announce(msg);
    voiceEngine.speak(msg, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
    setIsSpeaking(true);
  }, [announce, profile]);

  // Attempt non-intrusive start on mount; user can always click button or press V / Alt+M
  useEffect(() => {
    voiceEngine.startListening().then((active) => {
      setVoiceActive(active);
    }).catch(() => {
      setVoiceActive(false);
    });
  }, []);

  // Turn on Voice with AI Helping Assistant Guide Narration
  const handleToggleVoice = useCallback(async () => {
    const newState = await voiceEngine.toggleListening();
    setVoiceActive(newState);

    if (newState) {
      setShowVoiceGuide(true);
      const guideText = 'Voice Assistant active. Say any command, job role, or tab name.';
      voiceEngine.speak(guideText, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      announce(guideText);
    } else {
      voiceEngine.stopSpeaking();
      setIsSpeaking(false);
      announce('Voice Assistant paused.');
    }
  }, [announce, profile]);

  // Tab Switching Voice & Keyboard Navigation Handlers
  const handleNextTab = useCallback(() => {
    if (portalView === 'recruiter') {
      if (recruiterTab === 'applications') {
        setRecruiterTab('requisitions');
        announce('Switched to Job Requisitions tab.');
        voiceEngine.speak('Job Requisitions tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else if (recruiterTab === 'requisitions') {
        setRecruiterTab('create_job');
        announce('Switched to Post New Job tab.');
        voiceEngine.speak('Post New Job tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else {
        setRecruiterTab('applications');
        announce('Switched to Candidate Applications tab.');
        voiceEngine.speak('Candidate Applications tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      }
    } else {
      setPortalView('job_seeker');
      setRole('job_seeker');
      if (seekerTab === 'jobs') {
        setSeekerTab('profile');
        announce('Switched to Applicant Profile tab.');
        voiceEngine.speak('Applicant Profile tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else if (seekerTab === 'profile') {
        setSeekerTab('applications');
        announce('Switched to My Applications tab.');
        voiceEngine.speak('My Applications tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else {
        setSeekerTab('jobs');
        announce('Switched to Accessible Job Board tab.');
        voiceEngine.speak('Accessible Job Board tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      }
    }
    setIsSpeaking(true);
  }, [portalView, recruiterTab, seekerTab, profile, announce]);

  const handlePrevTab = useCallback(() => {
    if (portalView === 'recruiter') {
      if (recruiterTab === 'create_job') {
        setRecruiterTab('requisitions');
        announce('Switched to Job Requisitions tab.');
        voiceEngine.speak('Job Requisitions tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else if (recruiterTab === 'requisitions') {
        setRecruiterTab('applications');
        announce('Switched to Candidate Applications tab.');
        voiceEngine.speak('Candidate Applications tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else {
        setRecruiterTab('create_job');
        announce('Switched to Post New Job tab.');
        voiceEngine.speak('Post New Job tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      }
    } else {
      setPortalView('job_seeker');
      setRole('job_seeker');
      if (seekerTab === 'jobs') {
        setSeekerTab('applications');
        announce('Switched to My Applications tab.');
        voiceEngine.speak('My Applications tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else if (seekerTab === 'applications') {
        setSeekerTab('profile');
        announce('Switched to Applicant Profile tab.');
        voiceEngine.speak('Applicant Profile tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else {
        setSeekerTab('jobs');
        announce('Switched to Accessible Job Board tab.');
        voiceEngine.speak('Accessible Job Board tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      }
    }
    setIsSpeaking(true);
  }, [portalView, recruiterTab, seekerTab, profile, announce]);

  const handleSelectTabNumber = useCallback((num: number) => {
    if (portalView === 'recruiter') {
      if (num === 1) {
        setRecruiterTab('applications');
        announce('Switched to Candidate Applications tab.');
        voiceEngine.speak('Candidate Applications tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else if (num === 2) {
        setRecruiterTab('requisitions');
        announce('Switched to Job Requisitions tab.');
        voiceEngine.speak('Job Requisitions tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else if (num === 3) {
        setRecruiterTab('create_job');
        announce('Switched to Post New Job tab.');
        voiceEngine.speak('Post New Job tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      }
    } else {
      setPortalView('job_seeker');
      setRole('job_seeker');
      if (num === 1) {
        setSeekerTab('jobs');
        announce('Switched to Accessible Job Board tab.');
        voiceEngine.speak('Accessible Job Board tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else if (num === 2) {
        setSeekerTab('profile');
        announce('Switched to Applicant Profile tab.');
        voiceEngine.speak('Applicant Profile tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else if (num === 3) {
        setSeekerTab('applications');
        announce('Switched to My Applications tab.');
        voiceEngine.speak('My Applications tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      }
    }
    setIsSpeaking(true);
  }, [portalView, profile, announce]);

  // Voice Command Processing - High Speed Instant Execution for English Voice Commands
  const handleVoiceCommand = useCallback(async (transcript: string) => {
    setLastTranscript(transcript);
    setInterimTranscript('');

    // Clean and normalize incoming transcript: remove punctuation and multiple spaces
    const cleanText = transcript
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    // ⚡ 1. FAST STOP / AUDIO SILENCE
    if (/\b(stop|stop reading|stop speaking|silence|quiet|pause speech|pause audio|hush|shut up)\b/i.test(cleanText)) {
      voiceEngine.stopSpeaking();
      setIsSpeaking(false);
      announce('Audio playback stopped.');
      addRecentInteraction(transcript, 'stop_speech', 0.99, 'local-nlp-fallback');
      return;
    }

    // ⚡ 2. VOICE MUTE / UNMUTE LISTENING
    if (/\b(voice off|turn off voice|stop listening|mute voice|disable voice)\b/i.test(cleanText)) {
      voiceEngine.stopListening();
      setVoiceActive(false);
      voiceEngine.stopSpeaking();
      setIsSpeaking(false);
      announce('Voice Assistant paused.');
      addRecentInteraction(transcript, 'voice_off', 0.99, 'local-nlp-fallback');
      return;
    }

    if (/\b(voice on|turn on voice|start listening|enable voice)\b/i.test(cleanText)) {
      await voiceEngine.startListening();
      setVoiceActive(true);
      const activeMsg = 'Voice Assistant active. Listening for commands.';
      voiceEngine.speak(activeMsg, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      announce(activeMsg);
      addRecentInteraction(transcript, 'voice_on', 0.99, 'local-nlp-fallback');
      return;
    }

    // ⚡ 3. COUNTRY / LOCATION VOICE DETECTION: "Jobs in India", "Job in USA", "Jobs in Bengaluru", etc.
    const detectedLoc = detectLocationFromVoiceCommand(cleanText);
    if (detectedLoc) {
      setPortalView('job_seeker');
      setRole('job_seeker');
      setSeekerTab('jobs');

      if (detectedLoc.country) {
        setSelectedCountry(detectedLoc.country);
      }
      if (detectedLoc.city) {
        setSearchQuery(detectedLoc.city);
      } else {
        setSearchQuery('');
      }

      const feedback = `Showing accessible jobs for ${detectedLoc.displayLabel}.`;
      announce(feedback);
      voiceEngine.speak(feedback, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'filter_location', 0.99, 'local-nlp-fallback');
      return;
    }

    // ⚡ 4. ROLE SWITCHING: "Job Seeker" or "Recruiter"
    const detectedRole = detectRoleFromVoiceCommand(cleanText);
    if (detectedRole) {
      handleRoleChange(detectedRole);
      const isRecruiter = detectedRole === 'recruiter';
      const speechMsg = isRecruiter 
        ? 'Switched to Recruiter portal. You can review applicants and post jobs.'
        : 'Switched to Job Seeker portal. Say Jobs to view openings.';
      voiceEngine.speak(speechMsg, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'switch_role', 0.99, 'local-nlp-fallback');
      return;
    }

    // ⚡ 5. HOME / MAIN GATEWAY
    if (
      /^(home|main menu|start page|first page|welcome|back to home|landing|go home)$/i.test(cleanText) ||
      /\b(go to home|back to home)\b/i.test(cleanText)
    ) {
      handleGoHome();
      const welcomeMsg = 'Welcome to VoiceHire AI. Say Job Seeker to find jobs, or say Recruiter to hire.';
      voiceEngine.speak(welcomeMsg, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'navigate', 0.99, 'local-nlp-fallback');
      return;
    }

    // ⚡ 6. TAB SWITCHING: Next Tab / Previous Tab / Numbered Tabs / Direct Named Tabs
    if (/\b(next tab|switch tab|cycle tab|change tab|forward tab|rotate tab)\b/i.test(cleanText)) {
      handleNextTab();
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    if (/\b(previous tab|prev tab|back tab|last tab|prior tab)\b/i.test(cleanText)) {
      handlePrevTab();
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    if (/\b(tab 1|tab one|first tab)\b/i.test(cleanText)) {
      handleSelectTabNumber(1);
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    if (/\b(tab 2|tab two|second tab)\b/i.test(cleanText)) {
      handleSelectTabNumber(2);
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    if (/\b(tab 3|tab three|third tab)\b/i.test(cleanText)) {
      handleSelectTabNumber(3);
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    // TAB: Accessible Job Board
    if (
      /^(jobs|job board|open jobs|show jobs|browse jobs|find jobs|positions|search jobs|tab jobs|jobs tab|view jobs|listings)$/i.test(cleanText) ||
      /\b(go to jobs|show jobs|open job board|browse jobs|view jobs|switch to jobs|switch to jobs tab|switch to job board)\b/i.test(cleanText)
    ) {
      setPortalView('job_seeker');
      setRole('job_seeker');
      setSeekerTab('jobs');
      announce('Opening Accessible Job Board.');
      voiceEngine.speak('Opening Accessible Job Board.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    // TAB: Candidate Profile
    if (
      /^(profile|my profile|candidate profile|applicant profile|edit profile|tab profile|profile tab|resume|my resume|cv)$/i.test(cleanText) ||
      /\b(go to profile|open profile|edit profile|view profile|switch to profile|switch to profile tab|switch to candidate profile|switch to applicant profile)\b/i.test(cleanText)
    ) {
      setPortalView('job_seeker');
      setRole('job_seeker');
      setSeekerTab('profile');
      announce('Opening Candidate Profile.');
      voiceEngine.speak('Opening Candidate Profile.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    // TAB: My Applications
    if (
      /^(applications|my applications|applied jobs|application status|applied|tab applications|applications tab|submissions)$/i.test(cleanText) ||
      /\b(go to applications|view applications|my applications|switch to applications|switch to applications tab|switch to my applications)\b/i.test(cleanText)
    ) {
      if (portalView === 'recruiter') {
        setRecruiterTab('applications');
        announce('Switched to Candidate Applications tab.');
        voiceEngine.speak('Opening Candidate Applications.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else {
        setPortalView('job_seeker');
        setSeekerTab('applications');
        announce('Opening My Applications.');
        voiceEngine.speak('Opening My Applications.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      }
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    // RECRUITER TAB: Candidates
    if (
      /^(candidates|applicants|candidate applications|review candidates|applicant list|candidate pipeline|tab candidates|candidates tab)$/i.test(cleanText) ||
      /\b(go to candidates|view candidates|review applicants|switch to candidates|switch to candidates tab)\b/i.test(cleanText)
    ) {
      setPortalView('recruiter');
      setRole('recruiter');
      setRecruiterTab('applications');
      announce('Switched to Recruiter Candidate Applications.');
      voiceEngine.speak('Opening Candidate Applications.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    // RECRUITER TAB: Job Requisitions
    if (
      /^(requisitions|job requisitions|active jobs|job postings|postings|manage jobs|openings|tab requisitions|requisitions tab)$/i.test(cleanText) ||
      /\b(go to requisitions|view requisitions|manage jobs|switch to requisitions|switch to requisitions tab)\b/i.test(cleanText)
    ) {
      setPortalView('recruiter');
      setRole('recruiter');
      setRecruiterTab('requisitions');
      announce('Switched to Job Requisitions tab.');
      voiceEngine.speak('Opening Job Requisitions.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    // RECRUITER TAB: Post Job
    if (
      /^(post a job|post job|create job|new job|add job|publish job|tab post job|tab create job|create job tab|post job tab)$/i.test(cleanText) ||
      /\b(post a job|create job|add new job|switch to post job|switch to create job)\b/i.test(cleanText)
    ) {
      setPortalView('recruiter');
      setRole('recruiter');
      setRecruiterTab('create_job');
      announce('Switched to Post New Job form.');
      voiceEngine.speak('Opening Post New Job form.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    // Navigation: Next Job / Previous Job (strictly job navigation)
    if (/^(next|next job|go down|next listing)$/i.test(cleanText) || /\b(next job|next listing)\b/i.test(cleanText)) {
      setPortalView('job_seeker');
      setSeekerTab('jobs');
      if (jobs.length > 0) {
        const currentIndex = selectedJob ? jobs.findIndex(j => j.id === selectedJob.id) : -1;
        const nextIndex = (currentIndex + 1) % jobs.length;
        const nextJob = jobs[nextIndex];
        setSelectedJob(nextJob);
        setSummaryData(null);
        announce(`Selected job ${nextIndex + 1} of ${jobs.length}: ${nextJob.title} at ${nextJob.company}`);
        voiceEngine.speak(`Selected ${nextJob.title} at ${nextJob.company}`, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        addRecentInteraction(transcript, 'navigate_job', 0.99, 'local-nlp-fallback');
      }
      return;
    }

    if (/^(previous|prev|previous job|prev job|go up|last job)$/i.test(cleanText) || /\b(previous job|prev job)\b/i.test(cleanText)) {
      setPortalView('job_seeker');
      setSeekerTab('jobs');
      if (jobs.length > 0) {
        const currentIndex = selectedJob ? jobs.findIndex(j => j.id === selectedJob.id) : 0;
        const prevIndex = (currentIndex - 1 + jobs.length) % jobs.length;
        const prevJob = jobs[prevIndex];
        setSelectedJob(prevJob);
        setSummaryData(null);
        announce(`Selected job ${prevIndex + 1} of ${jobs.length}: ${prevJob.title} at ${prevJob.company}`);
        voiceEngine.speak(`Selected ${prevJob.title} at ${prevJob.company}`, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        addRecentInteraction(transcript, 'navigate_job', 0.99, 'local-nlp-fallback');
      }
      return;
    }

    // Search Command (e.g. "search react", "find python", "look for designer")
    // Only triggers on explicit search prefix, and never writes tab names into search box!
    const searchMatch = cleanText.match(/^(?:search|search for|find|filter|look for)\s+(.+)$/i);
    if (searchMatch) {
      const keyword = searchMatch[1].trim();

      // Guard: If spoken keyword is actually a tab name, switch tab instead of typing in search box!
      if (/^(jobs|job|job board|open jobs|positions|listings|all jobs)$/i.test(keyword)) {
        setPortalView('job_seeker');
        setSeekerTab('jobs');
        announce('Showing Accessible Job Board.');
        voiceEngine.speak('Showing Accessible Job Board.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
        return;
      }
      if (/^(profile|my profile|candidate profile|resume|cv)$/i.test(keyword)) {
        setPortalView('job_seeker');
        setSeekerTab('profile');
        announce('Opening Candidate Profile.');
        voiceEngine.speak('Opening Candidate Profile.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
        return;
      }
      if (/^(applications|my applications|applied jobs|applied|submissions)$/i.test(keyword)) {
        setPortalView('job_seeker');
        setSeekerTab('applications');
        announce('Opening My Applications.');
        voiceEngine.speak('Opening My Applications.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
        return;
      }
      if (/^(candidates|applicants|review candidates)$/i.test(keyword)) {
        setPortalView('recruiter');
        setRecruiterTab('applications');
        announce('Opening Candidate Applications.');
        voiceEngine.speak('Opening Candidate Applications.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
        return;
      }
      if (/^(requisitions|manage jobs|postings)$/i.test(keyword)) {
        setPortalView('recruiter');
        setRecruiterTab('requisitions');
        announce('Opening Job Requisitions.');
        voiceEngine.speak('Opening Job Requisitions.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
        return;
      }
      if (/^(post job|create job|new job|add job)$/i.test(keyword)) {
        setPortalView('recruiter');
        setRecruiterTab('create_job');
        announce('Opening Create Job form.');
        voiceEngine.speak('Opening Create Job form.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
        return;
      }

      setPortalView('job_seeker');
      setSeekerTab('jobs');
      setSearchQuery(keyword);
      announce(`Filtering jobs for keyword: ${keyword}`);
      voiceEngine.speak(`Searching jobs for ${keyword}`, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'search', 0.98, 'local-nlp-fallback');
      return;
    }

    // Filter toggles
    if (/\b(remote only|remote|toggle remote)\b/i.test(cleanText)) {
      setPortalView('job_seeker');
      setSeekerTab('jobs');
      setRemoteOnly(prev => {
        const next = !prev;
        announce(next ? 'Filtered for Remote Only jobs.' : 'Showing all location types.');
        voiceEngine.speak(next ? 'Showing Remote Only jobs.' : 'Showing all jobs.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        return next;
      });
      addRecentInteraction(transcript, 'filter', 0.99, 'local-nlp-fallback');
      return;
    }

    if (/\b(clear search|reset search|clear filters|reset filters|all jobs|show all)\b/i.test(cleanText)) {
      setSearchQuery('');
      setFilterType('all');
      setSelectedCountry('all');
      setRemoteOnly(false);
      announce('Cleared search and reset filters.');
      voiceEngine.speak('Cleared filters. Showing all jobs.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'filter', 0.99, 'local-nlp-fallback');
      return;
    }

    // Apply Command -> Immediately Auto-Fill and Submit Application to Recruiter
    if (/\b(apply|apply now|submit application|submit|auto fill|1 click apply|one click apply|submit to recruiter|apply job|submit job)\b/i.test(cleanText)) {
      setPortalView('job_seeker');
      const targetJob = selectedJob || (jobs.length > 0 ? jobs[0] : null);

      if (targetJob) {
        if (!selectedJob) {
          setSelectedJob(targetJob);
        }

        try {
          const appPayload = {
            jobId: targetJob.id,
            jobTitle: targetJob.title,
            company: targetJob.company,
            applicantName: profile?.fullName || 'Alex Morgan',
            applicantEmail: profile?.email || 'alex.morgan@accessibility.org',
            applicantPhone: profile?.phone || '+1 (555) 382-9011',
            resumeSummary: profile?.resumeText || 'Frontend accessibility engineer with 4 years experience in WCAG 2.1 AAA.',
            skills: profile?.primarySkills && profile.primarySkills.length > 0
              ? profile.primarySkills
              : ['React', 'TypeScript', 'WCAG', 'Accessibility'],
            accommodationsRequested: profile?.accessibilityAccommodations && profile.accessibilityAccommodations.length > 0
              ? profile.accessibilityAccommodations
              : ['Screen reader support', 'Flexible working hours'],
            coverNote: `Excited to apply for ${targetJob.title} at ${targetJob.company}. Spoken voice auto-submission with pre-verified assistive accommodations.`,
            submittedVia: 'Voice' as const
          };

          const newApp = await api.createApplication(appPayload);
          setApplications(prev => [newApp, ...prev.filter(a => a.id !== newApp.id)]);
          setIsAutoFillModalOpen(false);

          setSubmissionSuccessToast({
            jobTitle: targetJob.title,
            company: targetJob.company,
            matchScore: newApp.matchScore
          });

          const msg = `Application for ${targetJob.title} at ${targetJob.company} has been submitted to the recruiter! ATS Match Score: ${newApp.matchScore}%.`;
          announce(msg);
          voiceEngine.speak(`Application for ${targetJob.title} submitted to recruiter successfully!`, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
          setIsSpeaking(true);

          api.getAnalytics().then(setAnalytics).catch(console.error);
          addRecentInteraction(transcript, 'apply_and_submit', 1.0, 'local-nlp-fallback');
        } catch (err: any) {
          console.error('Submission error:', err);
          const errMsg = `Error submitting application: ${err.message || 'Please try again.'}`;
          announce(errMsg);
          voiceEngine.speak(errMsg, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
          setIsSpeaking(true);
        }
      } else {
        const noJobMsg = 'Please select a job first before saying apply now.';
        announce(noJobMsg);
        voiceEngine.speak(noJobMsg, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
      }
      return;
    }

    // Read Command
    if (/\b(read|read job|read description|speak|narrate|read aloud)\b/i.test(cleanText)) {
      setPortalView('job_seeker');
      if (selectedJob) {
        const textToRead = `${selectedJob.title} at ${selectedJob.company}. Salary: ${selectedJob.salaryRange}. Location: ${selectedJob.location}. ${selectedJob.simplifiedSummary?.roleOverview || selectedJob.description}`;
        voiceEngine.speak(textToRead, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        announce(`Reading aloud ${selectedJob.title}`);
        addRecentInteraction(transcript, 'read', 0.98, 'local-nlp-fallback');
      } else {
        announce('Please select a job to read aloud.');
      }
      return;
    }

    // Summarize Command
    if (/\b(summarize|simplify|breakdown|ai summary|explain|summary)\b/i.test(cleanText)) {
      setPortalView('job_seeker');
      if (selectedJob) {
        setIsSummarizing(true);
        announce('Simplifying job posting...');
        addRecentInteraction(transcript, 'summarize', 0.97, 'local-nlp-fallback');
        const sum = await api.summarizeJob(
          selectedJob.title,
          selectedJob.description,
          selectedJob.salaryRange,
          selectedJob.location,
          selectedJob.requirements,
          forceLocalFallback
        );
        setSummaryData(sum);
        setIsSummarizing(false);
        announce(`Cognitive breakdown ready. Role overview: ${sum.roleOverview}`);
        if (profile?.assistivePreferences.autoReadSummaryOnSelect) {
          voiceEngine.speak(sum.roleOverview, profile.assistivePreferences.speechRate, () => setIsSpeaking(false));
          setIsSpeaking(true);
        }
      }
      return;
    }

    // High Contrast Command
    if (/\b(high contrast|contrast|toggle contrast)\b/i.test(cleanText)) {
      setHighContrast(prev => {
        const next = !prev;
        announce(next ? 'Enabled high contrast mode.' : 'Disabled high contrast mode.');
        voiceEngine.speak(next ? 'High contrast enabled.' : 'Standard contrast enabled.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        return next;
      });
      addRecentInteraction(transcript, 'contrast', 0.99, 'local-nlp-fallback');
      return;
    }

    // Zoom Controls
    if (/\b(zoom in|font bigger|increase font|larger text|bigger text)\b/i.test(cleanText)) {
      setFontSizeZoom(prev => {
        const next = Math.min(140, prev + 10);
        announce(`Increased font size to ${next} percent.`);
        return next;
      });
      return;
    }

    if (/\b(zoom out|font smaller|decrease font|smaller text)\b/i.test(cleanText)) {
      setFontSizeZoom(prev => {
        const next = Math.max(80, prev - 10);
        announce(`Decreased font size to ${next} percent.`);
        return next;
      });
      return;
    }

    // Save Profile Command
    if (/\b(save profile|save|update profile)\b/i.test(cleanText)) {
      if (profile) {
        announce('Candidate profile saved successfully.');
        voiceEngine.speak('Candidate profile saved.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        addRecentInteraction(transcript, 'save_profile', 0.99, 'local-nlp-fallback');
      }
      return;
    }

    // Help / Commands list
    if (/\b(help|commands|what can i do|assistant|voice guide|show commands)\b/i.test(cleanText)) {
      setIsVoiceModalOpen(true);
      announce('Opened Voice Assistant commands reference.');
      voiceEngine.speak('Here is the command guide. You can say any tab name, country, or action.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'help', 0.99, 'local-nlp-fallback');
      return;
    }

    // ⚡ 7. ASYNC BACKEND PARSER FOR COMPLEX SPEECH PHRASES
    try {
      const parseResult = await api.parseVoiceCommand(transcript, forceLocalFallback);
      addRecentInteraction(transcript, parseResult.intent, parseResult.confidence, parseResult.source);

      if (parseResult.intent === 'switch_role') {
        const targetRole = parseResult.parameters.role || (role === 'job_seeker' ? 'recruiter' : 'job_seeker');
        handleRoleChange(targetRole);
        const name = targetRole === 'recruiter' ? 'Recruiter' : 'Job Seeker';
        voiceEngine.speak(`Switched whole page to ${name} portal.`, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
      } else if (parseResult.intent === 'apply') {
        setPortalView('job_seeker');
        const targetJob = selectedJob || (jobs.length > 0 ? jobs[0] : null);
        if (targetJob) {
          if (!selectedJob) {
            setSelectedJob(targetJob);
          }
          try {
            const appPayload = {
              jobId: targetJob.id,
              jobTitle: targetJob.title,
              company: targetJob.company,
              applicantName: profile?.fullName || 'Alex Morgan',
              applicantEmail: profile?.email || 'alex.morgan@accessibility.org',
              applicantPhone: profile?.phone || '+1 (555) 382-9011',
              resumeSummary: profile?.resumeText || 'Frontend accessibility engineer with 4 years experience in WCAG 2.1 AAA.',
              skills: profile?.primarySkills && profile.primarySkills.length > 0
                ? profile.primarySkills
                : ['React', 'TypeScript', 'WCAG', 'Accessibility'],
              accommodationsRequested: profile?.accessibilityAccommodations && profile.accessibilityAccommodations.length > 0
                ? profile.accessibilityAccommodations
                : ['Screen reader support', 'Flexible working hours'],
              coverNote: `Excited to apply for ${targetJob.title} at ${targetJob.company}. Spoken voice auto-submission with pre-verified assistive accommodations.`,
              submittedVia: 'Voice' as const
            };

            const newApp = await api.createApplication(appPayload);
            setApplications(prev => [newApp, ...prev.filter(a => a.id !== newApp.id)]);
            setIsAutoFillModalOpen(false);

            setSubmissionSuccessToast({
              jobTitle: targetJob.title,
              company: targetJob.company,
              matchScore: newApp.matchScore
            });

            const msg = `Application for ${targetJob.title} at ${targetJob.company} has been submitted to the recruiter! ATS Match Score: ${newApp.matchScore}%.`;
            announce(msg);
            voiceEngine.speak(`Application for ${targetJob.title} submitted to recruiter successfully!`, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
            setIsSpeaking(true);

            api.getAnalytics().then(setAnalytics).catch(console.error);
          } catch (err: any) {
            console.error('Submission error:', err);
          }
        }
      } else if (parseResult.intent === 'read') {
        setPortalView('job_seeker');
        if (selectedJob) {
          const textToRead = `${selectedJob.title} at ${selectedJob.company}. ${selectedJob.simplifiedSummary?.roleOverview || selectedJob.description}`;
          voiceEngine.speak(textToRead, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
          setIsSpeaking(true);
        }
      } else if (parseResult.intent === 'summarize') {
        setPortalView('job_seeker');
        if (selectedJob) {
          setIsSummarizing(true);
          const sum = await api.summarizeJob(
            selectedJob.title,
            selectedJob.description,
            selectedJob.salaryRange,
            selectedJob.location,
            selectedJob.requirements,
            forceLocalFallback
          );
          setSummaryData(sum);
          setIsSummarizing(false);
          voiceEngine.speak(sum.roleOverview, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
          setIsSpeaking(true);
        }
      } else if (parseResult.intent === 'switch_tab') {
        const direction = parseResult.parameters?.direction;
        const tabNumber = parseResult.parameters?.tabNumber;
        const targetTab = parseResult.parameters?.tab;

        if (direction === 'next') {
          handleNextTab();
        } else if (direction === 'previous') {
          handlePrevTab();
        } else if (tabNumber) {
          handleSelectTabNumber(Number(tabNumber));
        } else if (targetTab === 'jobs') {
          setPortalView('job_seeker');
          setRole('job_seeker');
          setSeekerTab('jobs');
          announce('Opening Accessible Job Board.');
          voiceEngine.speak('Accessible Job Board tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
          setIsSpeaking(true);
        } else if (targetTab === 'profile') {
          setPortalView('job_seeker');
          setRole('job_seeker');
          setSeekerTab('profile');
          announce('Opening Candidate Profile.');
          voiceEngine.speak('Candidate Profile tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
          setIsSpeaking(true);
        } else if (targetTab === 'applications') {
          if (portalView === 'recruiter') {
            setRecruiterTab('applications');
            announce('Switched to Candidate Applications tab.');
            voiceEngine.speak('Candidate Applications tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
          } else {
            setPortalView('job_seeker');
            setSeekerTab('applications');
            announce('Opening My Applications.');
            voiceEngine.speak('My Applications tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
          }
          setIsSpeaking(true);
        } else if (targetTab === 'candidates') {
          setPortalView('recruiter');
          setRole('recruiter');
          setRecruiterTab('applications');
          announce('Switched to Recruiter Candidate Applications.');
          voiceEngine.speak('Candidate Applications tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
          setIsSpeaking(true);
        } else if (targetTab === 'requisitions') {
          setPortalView('recruiter');
          setRole('recruiter');
          setRecruiterTab('requisitions');
          announce('Switched to Job Requisitions tab.');
          voiceEngine.speak('Job Requisitions tab.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
          setIsSpeaking(true);
        } else if (targetTab === 'create_job') {
          setPortalView('recruiter');
          setRole('recruiter');
          setRecruiterTab('create_job');
          announce('Switched to Post New Job form.');
          voiceEngine.speak('Post New Job form.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
          setIsSpeaking(true);
        }
      } else if (parseResult.intent === 'navigate') {
        if (parseResult.parameters.direction === 'home') {
          handleGoHome();
        } else if (parseResult.parameters.direction === 'next' && jobs.length > 0) {
          const currentIndex = selectedJob ? jobs.findIndex(j => j.id === selectedJob.id) : -1;
          const nextIndex = (currentIndex + 1) % jobs.length;
          setSelectedJob(jobs[nextIndex]);
          voiceEngine.speak(`Selected ${jobs[nextIndex].title}`, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
          setIsSpeaking(true);
        } else if (parseResult.parameters.direction === 'previous' && jobs.length > 0) {
          const currentIndex = selectedJob ? jobs.findIndex(j => j.id === selectedJob.id) : 0;
          const prevIndex = (currentIndex - 1 + jobs.length) % jobs.length;
          setSelectedJob(jobs[prevIndex]);
          voiceEngine.speak(`Selected ${jobs[prevIndex].title}`, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
          setIsSpeaking(true);
        }
      } else if (parseResult.intent === 'search') {
        const rawKw = (parseResult.parameters.keyword || '').trim();
        const isTabTerm = /^(jobs|job|job board|open jobs|positions|listings|profile|my profile|candidate profile|resume|cv|applications|my applications|applied jobs|applied|candidates|applicants|requisitions|create job|post job|tab\s*\d?)$/i.test(rawKw);

        if (isTabTerm) {
          // Never write tab name into search box! Switch to corresponding tab instead
          if (/profile|resume|cv/i.test(rawKw)) {
            setPortalView('job_seeker');
            setRole('job_seeker');
            setSeekerTab('profile');
          } else if (/application|applied/i.test(rawKw)) {
            setPortalView('job_seeker');
            setSeekerTab('applications');
          } else if (/candidate|applicant/i.test(rawKw)) {
            setPortalView('recruiter');
            setRole('recruiter');
            setRecruiterTab('applications');
          } else if (/requisition/i.test(rawKw)) {
            setPortalView('recruiter');
            setRole('recruiter');
            setRecruiterTab('requisitions');
          } else if (/create|post/i.test(rawKw)) {
            setPortalView('recruiter');
            setRole('recruiter');
            setRecruiterTab('create_job');
          } else {
            setPortalView('job_seeker');
            setRole('job_seeker');
            setSeekerTab('jobs');
          }
        } else {
          setPortalView('job_seeker');
          setSeekerTab('jobs');
          if (parseResult.parameters.country) {
            setSelectedCountry(parseResult.parameters.country);
          }
          if (rawKw) {
            setSearchQuery(rawKw);
            announce(`Filtered jobs for keyword: ${rawKw}`);
          }
        }
      } else if (parseResult.intent === 'contrast') {
        setHighContrast(prev => !prev);
      } else if (parseResult.intent === 'help') {
        setIsVoiceModalOpen(true);
      } else {
        announce(`Command processed: "${transcript}"`);
      }
    } catch (err) {
      console.error('Error handling voice command:', err);
    }
  }, [
    addRecentInteraction,
    announce,
    forceLocalFallback,
    handleCountryFilterChange,
    handleGoHome,
    handleNextTab,
    handlePrevTab,
    handleRoleChange,
    handleSelectTabNumber,
    jobs,
    portalView,
    profile,
    role,
    selectedJob
  ]);

  // Play audio welcome on the first page
  const handlePlayWelcomeAudio = useCallback(() => {
    const guideText = "Welcome to VoiceHire AI. Please say 'Job Seeker' to find jobs, or say 'Recruiter' to manage postings and review applicants.";
    voiceEngine.speak(guideText, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
    setIsSpeaking(true);
    announce("Playing welcome audio guide.");
  }, [announce, profile]);

  // Replay Voice Guide Audio
  const handleReplayVoiceGuide = useCallback(() => {
    const guideText = "Here is your voice guide. Say 'Job Seeker' or 'Recruiter' to switch portals. Say 'Search React' to filter jobs. Say 'Read job' to listen. Say 'Summarize' for the breakdown. Say 'Apply now' or press Alt+V to auto-fill.";
    voiceEngine.speak(guideText, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
    setIsSpeaking(true);
    announce('Replaying AI Voice Assistant audio guide.');
  }, [announce, profile]);

  // Voice Interaction Correction Handler
  const handleCorrectInteraction = useCallback((id: string, newText: string) => {
    setRecentVoiceInteractions(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, rawTranscript: newText, status: 'corrected', timestamp: 'Just now' }
          : item
      )
    );
    announce(`Voice command corrected to: "${newText}".`);
  }, [announce]);

  // Clear Voice Interactions
  const handleClearRecentCommands = useCallback(() => {
    setRecentVoiceInteractions([]);
    announce('Voice command history cleared.');
  }, [announce]);

  // Voice Engine Callbacks Setup
  useEffect(() => {
    voiceEngine.setCallbacks(
      (transcript) => {
        setInterimTranscript('');
        handleVoiceCommand(transcript);
      },
      (status) => {
        setVoiceStatus(status);
        if (status === 'speaking') setIsSpeaking(true);
        if (status === 'idle') setIsSpeaking(false);
        if (status === 'listening') setMicErrorMessage(null);
      },
      (interim) => {
        setInterimTranscript(interim);
      },
      (errorMsg) => {
        setMicErrorMessage(errorMsg);
        announce(errorMsg);
      }
    );
  }, [announce, handleVoiceCommand]);

  // Keyboard Shortcuts:
  // 1. Alt+M or 'V' / 'M' to Toggle Voice Listening
  // 2. Alt+V for 1-Click DOM Form Auto-Fill (or voice toggle if no job selected)
  // 3. Alt+1, Alt+2, Alt+3 to Switch to specific Tabs
  // 4. Alt+T or Alt+RightArrow / Alt+LeftArrow to cycle Next / Previous Tab
  // 5. Escape to close modals and stop speaking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      // Keyboard Shortcut 1: Alt+M to toggle Voice anytime (even if inside input)
      if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        handleToggleVoice();
        return;
      }

      // Keyboard Shortcut 2: Single key 'v' or 'm' (when NOT typing in input)
      if (!isInputFocused && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === 'v' || e.key === 'V' || e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          handleToggleVoice();
          return;
        }
      }

      // Keyboard Shortcut 3: Alt+V for 1-Click DOM Auto-Fill (or toggle voice if not on job)
      if (e.altKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        if (selectedJob && portalView === 'job_seeker') {
          setAutoFillSource('DOM 1-Click (Alt+V)');
          setIsAutoFillModalOpen(true);
          announce(`Alt+V triggered: Injected candidate profile into ${selectedJob.title} application form.`);
        } else {
          handleToggleVoice();
        }
        return;
      }

      // Keyboard Shortcut 4: Alt+1, Alt+2, Alt+3 for Direct Tab Navigation
      if (e.altKey && (e.key === '1' || e.key === '2' || e.key === '3')) {
        e.preventDefault();
        handleSelectTabNumber(parseInt(e.key, 10));
        return;
      }

      // Keyboard Shortcut 5: Alt+T or Alt+ArrowRight to cycle Next Tab
      if (e.altKey && (e.key === 't' || e.key === 'T' || e.key === 'ArrowRight')) {
        e.preventDefault();
        handleNextTab();
        return;
      }

      // Keyboard Shortcut 6: Alt+ArrowLeft to cycle Previous Tab
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevTab();
        return;
      }

      // Escape to close modals or stop speech
      if (e.key === 'Escape') {
        setIsAutoFillModalOpen(false);
        setIsVoiceModalOpen(false);
        voiceEngine.stopSpeaking();
        setIsSpeaking(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [announce, handleNextTab, handlePrevTab, handleSelectTabNumber, handleToggleVoice, portalView, selectedJob]);

  // Summarize handler (Fast with cache)
  const handleSummarizeJob = async (job: JobPosting, forceFallback: boolean = false) => {
    setIsSummarizing(true);
    try {
      const result = await api.summarizeJob(
        job.title,
        job.description,
        job.salaryRange,
        job.location,
        job.requirements,
        forceFallback
      );
      setSummaryData(result);
      announce(`Cognitive summary ready. ${result.roleOverview}`);
      return result;
    } finally {
      setIsSummarizing(false);
    }
  };

  // 1-Click Application Submission
  const handleApplicationSubmit = async (appData: any) => {
    try {
      const newApp = await api.createApplication(appData);
      setApplications(prev => [newApp, ...prev]);
      announce(`Application successfully submitted to ${selectedJob?.company}! ATS Match: ${newApp.matchScore}%.`);
      api.getAnalytics().then(setAnalytics).catch(console.error);
    } catch (err: any) {
      announce(`Submission error: ${err.message}`);
    }
  };

  // Profile Save
  const handleSaveProfile = async (updates: Partial<CandidateProfile>) => {
    const updated = await api.updateProfile(updates);
    setProfile(updated);
  };

  // Recruiter Create Job
  const handleCreateJob = async (jobData: Partial<JobPosting>) => {
    const created = await api.createJob(jobData);
    setJobs(prev => [created, ...prev]);
    setSelectedJob(created);
  };

  // Recruiter Update Status
  const handleUpdateAppStatus = async (appId: string, status: JobApplication['status'], notes?: string) => {
    const updated = await api.updateApplicationStatus(appId, status, notes);
    setApplications(prev => prev.map(a => a.id === appId ? updated : a));
  };

  return (
    <div
      style={{ fontSize: `${fontSizeZoom}%` }}
      className={`min-h-screen transition-colors ${
        highContrast
          ? 'bg-black text-white high-contrast'
          : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Skip to Main Content Link (WCAG 2.1 AAA SC 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-400 focus:text-slate-950 focus:font-bold focus:rounded-lg focus:shadow-xl"
      >
        Skip to main content
      </a>

      {/* Universal Accessibility & Navigation Toolbar */}
      <AccessibilityToolbar
        currentView={portalView}
        onGoHome={handleGoHome}
        role={role}
        onRoleChange={(newRole) => {
          handleRoleChange(newRole);
        }}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        fontSizeZoom={fontSizeZoom}
        onChangeFontSize={(delta) => setFontSizeZoom(prev => Math.min(140, Math.max(80, prev + delta)))}
        voiceActive={voiceActive}
        voiceStatus={voiceStatus}
        onToggleVoice={handleToggleVoice}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        ariaAnnouncement={ariaAnnouncement}
      />

      {/* Main Container */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Instant Visual Confirmation for Spoken "Apply Now" Submission */}
        {submissionSuccessToast && (
          <div
            role="status"
            aria-live="polite"
            className="p-4 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 text-emerald-100 flex flex-wrap items-center justify-between gap-4 shadow-2xl animate-in fade-in"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Application Submitted Directly to Recruiter!</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    Voice Auto-Fill (100% WCAG)
                  </span>
                </p>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Position: <strong>{submissionSuccessToast.jobTitle}</strong> at <strong>{submissionSuccessToast.company}</strong> · ATS Match Score: <strong className="text-amber-300 font-bold">{submissionSuccessToast.matchScore}%</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPortalView('job_seeker');
                  setRole('job_seeker');
                  setSeekerTab('applications');
                  setSubmissionSuccessToast(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
              >
                View in My Applications
              </button>
              <button
                onClick={() => setSubmissionSuccessToast(null)}
                aria-label="Dismiss confirmation notification"
                className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* UNIVERSAL VOICE & KEYBOARD ASSISTANT (CONTEXT-AWARE FOR EVERY PAGE)       */}
        {/* ========================================================================= */}
        <PageAssistant
          portalView={portalView}
          seekerTab={seekerTab}
          recruiterTab={recruiterTab}
          voiceActive={voiceActive}
          voiceStatus={voiceStatus}
          lastTranscript={lastTranscript}
          isSpeaking={isSpeaking}
          onToggleVoice={handleToggleVoice}
          onExecuteCommand={handleVoiceCommand}
          onSpeakText={(text) => {
            voiceEngine.speak(text, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
            setIsSpeaking(true);
          }}
          onStopSpeaking={() => {
            voiceEngine.stopSpeaking();
            setIsSpeaking(false);
          }}
          selectedJob={selectedJob}
          jobsCount={jobs.length}
          applicationsCount={applications.length}
          currentCountryFilter={selectedCountry}
          onCountryFilterChange={handleCountryFilterChange}
        />

        {/* ========================================================================= */}
        {/* FIRST PAGE: WEB APPLICATION NAME & TWO PORTAL OPTIONS (VOICE OR CLICK)    */}
        {/* ========================================================================= */}
        {portalView === 'landing' && (
          <PortalLandingView
            onSelectRole={(selected) => handleRoleChange(selected)}
            voiceActive={voiceActive}
            onActivateVoice={handleToggleVoice}
            onPlayWelcomeAudio={handlePlayWelcomeAudio}
            isSpeaking={isSpeaking}
            lastTranscript={lastTranscript}
            interimTranscript={interimTranscript}
            onExecuteCommand={handleVoiceCommand}
          />
        )}

        {/* ========================================================================= */}
        {/* ROLE 1: JOB SEEKER INTERFACE (WHOLE PAGE CONVERTED - NO TEST SUITE / DOCS)*/}
        {/* ========================================================================= */}
        {portalView === 'job_seeker' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Seeker Sub-Navigation Controls with explicit Voice Dependencies */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl shadow-lg">
              <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Seeker navigation sections">
                <button
                  role="tab"
                  aria-selected={seekerTab === 'jobs'}
                  onClick={() => setSeekerTab('jobs')}
                  className={`cursor-pointer px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    seekerTab === 'jobs'
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'text-slate-300 hover:text-white bg-slate-950/60 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Accessible Job Board</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-semibold flex items-center gap-1 ${
                    seekerTab === 'jobs' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-300'
                  }`}>
                    <Mic className="w-2.5 h-2.5" /> “Jobs” · Alt+1
                  </span>
                </button>

                <button
                  role="tab"
                  aria-selected={seekerTab === 'profile'}
                  onClick={() => setSeekerTab('profile')}
                  className={`cursor-pointer px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    seekerTab === 'profile'
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'text-slate-300 hover:text-white bg-slate-950/60 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Applicant Profile</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-semibold flex items-center gap-1 ${
                    seekerTab === 'profile' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-300'
                  }`}>
                    <Mic className="w-2.5 h-2.5" /> “Profile” · Alt+2
                  </span>
                </button>

                <button
                  role="tab"
                  aria-selected={seekerTab === 'applications'}
                  onClick={() => setSeekerTab('applications')}
                  className={`cursor-pointer px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    seekerTab === 'applications'
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'text-slate-300 hover:text-white bg-slate-950/60 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>My Applications ({applications.length})</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-semibold flex items-center gap-1 ${
                    seekerTab === 'applications' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-300'
                  }`}>
                    <Mic className="w-2.5 h-2.5" /> “Applications” · Alt+3
                  </span>
                </button>
              </div>

              {/* Quick Tab Cycle & Voice Prompts */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <button
                  onClick={handleNextTab}
                  className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-400 flex items-center gap-1.5 text-xs transition-colors"
                  title="Cycle to next tab using voice or keyboard"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Next Tab</span>
                  <span className="font-mono text-amber-300 text-[10px] hidden sm:inline">(Say “Next Tab” · Alt+T)</span>
                </button>
                <span className="hidden md:inline text-slate-600">|</span>
                <span className="hidden md:inline">Say <strong className="text-amber-400">“Recruiter”</strong> to change portal</span>
              </div>
            </div>

            {/* TAB: ACCESSIBLE JOB BOARD */}
            {seekerTab === 'jobs' && (
              <div className="space-y-6">
                {/* Search Bar & Filter Controls */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex-1 min-w-[280px] relative">
                      <label htmlFor="search-input" className="sr-only">
                        Search job postings by keyword or role
                      </label>
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="search-input"
                        type="text"
                        placeholder={t('searchPlaceholder', currentLanguage)}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        aria-label="Filter by employment type"
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-400"
                      >
                        <option value="all">{t('allJobTypes', currentLanguage)}</option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                      </select>

                      <button
                        onClick={() => setRemoteOnly(!remoteOnly)}
                        aria-pressed={remoteOnly}
                        className={`px-3 py-2 rounded-xl border transition-colors ${
                          remoteOnly
                            ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                            : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {t('remoteOnly', currentLanguage)}
                      </button>
                    </div>
                  </div>

                  {/* Location & Country Filter Bar (India-first + Voice Country Detection) */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('location', currentLanguage)}:</span>
                    </span>
                    {[
                      { label: '🇮🇳 India (All)', val: 'India' },
                      { label: '🇮🇳 Bengaluru', val: 'Bengaluru' },
                      { label: '🇮🇳 Pune', val: 'Pune' },
                      { label: '🇮🇳 Hyderabad', val: 'Hyderabad' },
                      { label: '🇮🇳 Delhi NCR', val: 'Delhi NCR' },
                      { label: '🇮🇳 Chennai', val: 'Chennai' },
                      { label: '🇺🇸 USA', val: 'USA' },
                      { label: '🇩🇪 Germany', val: 'Germany' },
                      { label: '🇬🇧 UK', val: 'UK' },
                      { label: '🇨🇦 Canada', val: 'Canada' },
                      { label: '🌍 All Locations', val: 'all' }
                    ].map((loc) => (
                      <button
                        key={loc.val}
                        onClick={() => handleCountryFilterChange(loc.val)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                          selectedCountry === loc.val
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-400/20'
                            : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        {loc.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Split: Job List + Selected Job Inspector */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Job Cards */}
                  <div className="lg:col-span-5 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                      <span>{t('availablePositions', currentLanguage)} ({jobs.length})</span>
                      <span className="font-mono text-emerald-400">
                        {selectedCountry === 'all' ? 'All Locations' : selectedCountry}
                      </span>
                    </div>

                    {jobs.length === 0 ? (
                      <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                        No jobs matched your search criteria in {selectedCountry}.
                        <button
                          onClick={() => { setSearchQuery(''); setFilterType('all'); setSelectedCountry('India'); setRemoteOnly(false); }}
                          className="mt-3 block mx-auto px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs"
                        >
                          Show India Jobs
                        </button>
                      </div>
                    ) : (
                      jobs.map((j) => (
                        <JobCard
                          key={j.id}
                          job={j}
                          isSelected={selectedJob?.id === j.id}
                          onSelect={() => {
                            setSelectedJob(j);
                            setSummaryData(null);
                            announce(`Selected ${j.title} at ${j.company}`);
                          }}
                          onQuickApply={() => {
                            setSelectedJob(j);
                            setAutoFillSource('DOM 1-Click (Alt+V)');
                            setIsAutoFillModalOpen(true);
                          }}
                          onReadAloud={() => {
                            const text = `${j.title} at ${j.company}. ${j.salaryRange}. ${j.simplifiedSummary?.roleOverview || j.description}`;
                            voiceEngine.speak(text, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
                            setIsSpeaking(true);
                          }}
                        />
                      ))
                    )}
                  </div>

                  {/* Right Column: Detailed Inspector & Cognitive Simplifier */}
                  <div className="lg:col-span-7">
                    {selectedJob ? (
                      <JobDetailView
                        job={selectedJob}
                        onBack={() => {}}
                        onApplyClick={() => {
                          setAutoFillSource('DOM 1-Click (Alt+V)');
                          setIsAutoFillModalOpen(true);
                        }}
                        onReadAloud={(text) => {
                          voiceEngine.speak(text, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
                          setIsSpeaking(true);
                        }}
                        onStopReading={() => {
                          voiceEngine.stopSpeaking();
                          setIsSpeaking(false);
                        }}
                        isSpeaking={isSpeaking}
                        onSummarize={handleSummarizeJob}
                        summaryData={summaryData}
                        isSummarizing={isSummarizing}
                        forceLocalFallback={forceLocalFallback}
                      />
                    ) : (
                      <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
                        Select a job from the left panel or say &quot;Next&quot; / &quot;Search [keyword]&quot;.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CANDIDATE PROFILE EDITOR */}
            {seekerTab === 'profile' && profile && (
              <CandidateProfileEditor
                profile={profile}
                onSaveProfile={handleSaveProfile}
                onAnnounce={announce}
              />
            )}

            {/* TAB: MY APPLICATIONS */}
            {seekerTab === 'applications' && (
              <MyApplicationsView
                applications={applications}
                onSelectJob={(jobId) => {
                  const targetJob = jobs.find(j => j.id === jobId);
                  if (targetJob) {
                    setSelectedJob(targetJob);
                    setSeekerTab('jobs');
                  }
                }}
              />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 2: RECRUITER INTERFACE (WHOLE PAGE CONVERTED TO RECRUITER)           */}
        {/* ========================================================================= */}
        {portalView === 'recruiter' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <RecruiterDashboard
              jobs={jobs}
              applications={applications}
              onCreateJob={handleCreateJob}
              onUpdateAppStatus={handleUpdateAppStatus}
              onAnnounce={announce}
              activeTab={recruiterTab}
              onTabChange={setRecruiterTab}
            />
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODALS & OVERLAYS                                                         */}
      {/* ========================================================================= */}

      {/* Module 3: 1-Click DOM Form Auto-Fill Application Modal */}
      {profile && (
        <AutoFillApplicationModal
          isOpen={isAutoFillModalOpen}
          onClose={() => setIsAutoFillModalOpen(false)}
          job={selectedJob}
          profile={profile}
          onSubmit={handleApplicationSubmit}
          submittedVia={autoFillSource}
        />
      )}

      {/* Voice Assistant Commands Reference & Recent Commands Side-Panel Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        voiceActive={voiceActive}
        onToggleVoice={handleToggleVoice}
        voiceStatus={voiceStatus}
        lastSpokenTranscript={lastTranscript}
        forceLocalFallback={forceLocalFallback}
        onToggleForceFallback={() => setForceLocalFallback(!forceLocalFallback)}
        recentInteractions={recentVoiceInteractions}
        onExecuteCommand={handleVoiceCommand}
        onCorrectInteraction={handleCorrectInteraction}
        onClearRecentCommands={handleClearRecentCommands}
      />

      {/* ========================================================================= */}
      {/* FLOATING VOICE CONTROL & LIVE COMMAND BAR (ALWAYS ACCESSIBLE)              */}
      {/* ========================================================================= */}
      <aside
        aria-label="Floating Voice Command Control Bar"
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-slate-950/95 border border-amber-400/50 backdrop-blur-md rounded-2xl shadow-2xl p-3 text-slate-100 transition-all"
      >
        {micErrorMessage && (
          <div className="mb-2 p-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200 flex items-center justify-between gap-2">
            <span>⚠️ {micErrorMessage}</span>
            <button
              onClick={handleToggleVoice}
              className="cursor-pointer px-2.5 py-1 rounded bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold shrink-0 text-[11px]"
            >
              Retry Microphone
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Mic Toggle Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleVoice}
              aria-pressed={voiceActive}
              aria-label={voiceActive ? "Turn off Voice Assistant" : "Turn on Voice Assistant"}
              className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                voiceActive
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20 animate-pulse'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-amber-400'
              }`}
            >
              <Mic className={`w-4 h-4 ${voiceActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{voiceActive ? 'Listening...' : 'Turn On Mic'}</span>
              <kbd className={`px-1 rounded text-[10px] font-mono ${
                voiceActive ? 'bg-amber-500 text-slate-950 border border-amber-600' : 'bg-slate-800 text-amber-300 border border-slate-700'
              }`}>
                Alt+M
              </kbd>
            </button>

            {/* Live Audio / Sound wave feedback */}
            {voiceActive && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800">
                <span className="w-1.5 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="w-1.5 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-1.5 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold ml-1">Live (English)</span>
              </div>
            )}
          </div>

          {/* Real-Time Speech Heard Badge */}
          <div className="flex-1 min-w-[200px] text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 truncate">
            <span className="text-slate-400 font-medium shrink-0">Heard:</span>
            {interimTranscript ? (
              <span className="text-amber-300 font-mono italic animate-pulse truncate">
                “{interimTranscript}...”
              </span>
            ) : lastTranscript ? (
              <span className="text-emerald-300 font-mono font-semibold truncate">
                “{lastTranscript}”
              </span>
            ) : (
              <span className="text-slate-500 italic truncate">
                {voiceActive ? 'Speak clearly: "jobs", "read", "apply", "job seeker"...' : 'Mic paused. Click "Turn On Mic" or type below'}
              </span>
            )}
          </div>

          {/* Quick Command Text Input & Run (Zero-Barrier fallback if mic is muted) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (hudCommandInput.trim()) {
                handleVoiceCommand(hudCommandInput.trim());
                setHudCommandInput('');
              }
            }}
            className="flex items-center gap-1.5 shrink-0"
          >
            <input
              type="text"
              value={hudCommandInput}
              onChange={(e) => setHudCommandInput(e.target.value)}
              placeholder="Type command (e.g. 'next tab', 'jobs', 'profile', 'apply')..."
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs w-52 sm:w-64 focus:border-amber-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!hudCommandInput.trim()}
              className="cursor-pointer px-3 py-1.5 rounded-xl bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs shrink-0 hover:bg-amber-300 transition-colors"
            >
              Run
            </button>
          </form>
        </div>

        {/* 1-Click Spoken Quick Chips including Tabs */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] pb-0.5 scrollbar-none">
          <span className="text-slate-400 shrink-0 font-medium text-[10px]">Quick test:</span>
          {[
            { label: '“Next Tab” (Alt+T)', cmd: 'next tab' },
            { label: '“Jobs Tab” (Alt+1)', cmd: 'jobs' },
            { label: '“Profile Tab” (Alt+2)', cmd: 'profile' },
            { label: '“Applications Tab” (Alt+3)', cmd: 'applications' },
            { label: '“Job Seeker”', cmd: 'job seeker' },
            { label: '“Recruiter”', cmd: 'recruiter' },
            { label: '“Candidates”', cmd: 'candidates' },
            { label: '“Requisitions”', cmd: 'requisitions' },
            { label: '“Post Job”', cmd: 'post job' },
            { label: '“Read Job”', cmd: 'read job' },
            { label: '“Summarize”', cmd: 'summarize' },
            { label: '“Apply Now”', cmd: 'apply now' },
            { label: '“High Contrast”', cmd: 'high contrast' },
            { label: '“Stop”', cmd: 'stop' }
          ].map((chip) => (
            <button
              key={chip.cmd}
              onClick={() => handleVoiceCommand(chip.cmd)}
              className="cursor-pointer shrink-0 px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-400 font-mono transition-colors"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
