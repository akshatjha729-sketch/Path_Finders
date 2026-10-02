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
  RotateCcw
} from 'lucide-react';
import {
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

  // Accessibility States
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeZoom, setFontSizeZoom] = useState(100);
  const [ariaAnnouncement, setAriaAnnouncement] = useState('VoiceHire AI ready. Say "Job Seeker" or "Recruiter" to navigate.');

  // Voice Assistant States
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'speaking' | 'unsupported'>('idle');
  const [lastTranscript, setLastTranscript] = useState('');
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

  // ARIA Announcement helper
  const announce = useCallback((message: string) => {
    setAriaAnnouncement(message);
  }, []);

  // Helper to add recent voice interactions with strict types
  const addRecentInteraction = useCallback((
    rawTranscript: string,
    parsedIntent: string,
    confidence: number,
    source: 'gemini-cloud' | 'local-nlp-fallback' = 'local-nlp-fallback'
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
        api.getJobs(searchQuery, filterType, remoteOnly),
        api.getProfile(),
        api.getApplications(),
        api.getAnalytics()
      ]);

      setJobs(fetchedJobs);
      if (fetchedJobs.length > 0 && !selectedJob) {
        setSelectedJob(fetchedJobs[0]);
      }
      setProfile(fetchedProfile);
      setApplications(fetchedApps);
      setAnalytics(fetchedAnalytics);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  }, [searchQuery, filterType, remoteOnly, selectedJob]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-start speech engine so voice commands work continuously
  useEffect(() => {
    try {
      voiceEngine.startListening();
      setVoiceActive(true);
    } catch {
      // Safe fallback if browser requires user gesture
    }
  }, []);

  // Turn on Voice with AI Helping Assistant Guide Narration
  const handleToggleVoice = useCallback(() => {
    const newState = voiceEngine.toggleListening();
    setVoiceActive(newState);

    if (newState) {
      setShowVoiceGuide(true);
      const guideText = "Voice listening activated. Say any tab name like 'Jobs', 'Profile', or 'Applications'.";
      voiceEngine.speak(guideText, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      announce('Voice Assistant activated. Press Alt+M or V to toggle.');
    } else {
      voiceEngine.stopSpeaking();
      setIsSpeaking(false);
      announce('Voice Assistant paused.');
    }
  }, [announce, profile]);

  // Voice Command Processing - High Speed Instant Execution
  const handleVoiceCommand = useCallback(async (transcript: string) => {
    setLastTranscript(transcript);
    const cleanText = transcript.trim().toLowerCase();

    // ⚡ 1. FAST LOCAL OPTIMISTIC EXECUTION (<1ms response, pure sync regex matching)

    // Stop speaking audio immediately
    if (/^(stop|stop\s*reading|stop\s*speaking|silence|quiet|pause\s*speech|hush)$/i.test(cleanText)) {
      voiceEngine.stopSpeaking();
      setIsSpeaking(false);
      announce('Audio playback stopped.');
      addRecentInteraction(transcript, 'stop_speech', 0.99, 'local-nlp-fallback');
      return;
    }

    // Toggle Voice listening off / on via voice
    if (/^(voice\s*off|turn\s*off\s*voice|stop\s*listening|mute\s*voice|disable\s*voice)$/i.test(cleanText)) {
      voiceEngine.stopListening();
      setVoiceActive(false);
      voiceEngine.stopSpeaking();
      setIsSpeaking(false);
      announce('Voice Assistant deactivated.');
      addRecentInteraction(transcript, 'voice_off', 0.99, 'local-nlp-fallback');
      return;
    }

    if (/^(voice\s*on|turn\s*on\s*voice|start\s*listening|enable\s*voice)$/i.test(cleanText)) {
      voiceEngine.startListening();
      setVoiceActive(true);
      voiceEngine.speak('Voice listening active.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      announce('Voice Assistant active.');
      addRecentInteraction(transcript, 'voice_on', 0.99, 'local-nlp-fallback');
      return;
    }

    // Home / First page navigation
    if (/^(home|main\s*menu|start\s*page|first\s*page|welcome|back\s*to\s*home|landing)$/i.test(cleanText)) {
      handleGoHome();
      voiceEngine.speak('Returned to home page. Say Job Seeker or Recruiter.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'navigate', 0.99, 'local-nlp-fallback');
      return;
    }

    // Role Switching Command: "Job Seeker" or "Recruiter" (single words or full phrases)
    if (/^(recruiter|recruiter\s*mode|recruiter\s*portal|hiring)$/i.test(cleanText) || /switch(\s*to)?\s*recruiter|i am a recruiter/i.test(cleanText)) {
      handleRoleChange('recruiter');
      voiceEngine.speak('Switched whole page to Recruiter portal. You can post jobs and review applicants.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'switch_role', 0.99, 'local-nlp-fallback');
      return;
    }

    if (/^(job\s*seeker|candidate|applicant|seeker|job\s*search)$/i.test(cleanText) || /switch(\s*to)?\s*(job\s*seeker|candidate|applicant|seeker)|i am a job seeker/i.test(cleanText)) {
      handleRoleChange('job_seeker');
      voiceEngine.speak('Switched whole page to Job Seeker portal. Say Search React to filter jobs, or Apply now to submit.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'switch_role', 0.99, 'local-nlp-fallback');
      return;
    }

    // ⚡ TAB SWITCHING BY SPOKEN NAME (Instantaneous switching)
    // TAB: Accessible Job Board
    if (
      /^(jobs|job\s*board|open\s*jobs|show\s*jobs|browse\s*jobs|find\s*jobs|positions|search\s*jobs|tab\s*jobs|tab\s*1)$/i.test(cleanText) ||
      /^(?:go\s*to|switch\s*to|open|view|show)\s+(?:the\s+)?(?:job\s*board|jobs|board|listings)$/i.test(cleanText)
    ) {
      setPortalView('job_seeker');
      setRole('job_seeker');
      setSeekerTab('jobs');
      announce('Switched to Accessible Job Board tab.');
      voiceEngine.speak('Opening Job Board.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    // TAB: Candidate Profile
    if (
      /^(profile|my\s*profile|candidate\s*profile|applicant\s*profile|edit\s*profile|tab\s*profile|tab\s*2|resume|my\s*resume)$/i.test(cleanText) ||
      /^(?:go\s*to|switch\s*to|open|view|show)\s+(?:the\s+)?(?:candidate\s+)?profile$/i.test(cleanText)
    ) {
      setPortalView('job_seeker');
      setRole('job_seeker');
      setSeekerTab('profile');
      announce('Switched to Candidate Profile editor tab.');
      voiceEngine.speak('Opening Candidate Profile.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    // TAB: My Applications / Applications
    if (
      /^(applications|my\s*applications|applied\s*jobs|application\s*status|applied|tab\s*applications|tab\s*3|submissions)$/i.test(cleanText) ||
      /^(?:go\s*to|switch\s*to|open|view|show)\s+(?:the\s+)?(?:my\s+)?applications$/i.test(cleanText)
    ) {
      if (portalView === 'recruiter') {
        setRecruiterTab('applications');
        announce('Switched to Candidate Applications tab.');
        voiceEngine.speak('Opening Candidate Applications.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      } else {
        setPortalView('job_seeker');
        setSeekerTab('applications');
        announce('Switched to My Applications tab.');
        voiceEngine.speak('Opening My Applications.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      }
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'switch_tab', 0.99, 'local-nlp-fallback');
      return;
    }

    // RECRUITER TAB: Candidates
    if (
      /^(candidates|applicants|candidate\s*applications|review\s*candidates|applicant\s*list|candidate\s*pipeline)$/i.test(cleanText) ||
      /^(?:go\s*to|switch\s*to|open|view|show)\s+(?:the\s+)?candidates$/i.test(cleanText)
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
      /^(requisitions|job\s*requisitions|active\s*jobs|job\s*postings|postings|manage\s*jobs|openings)$/i.test(cleanText) ||
      /^(?:go\s*to|switch\s*to|open|view|show)\s+(?:the\s+)?requisitions$/i.test(cleanText)
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

    // RECRUITER TAB: Post / Create Job
    if (
      /^(post\s*a\s*job|post\s*job|create\s*job|new\s*job|add\s*job|create\s*posting|post\s*new\s*job)$/i.test(cleanText) ||
      /^(?:go\s*to|switch\s*to|open)\s+(?:post\s*a\s*job|create\s*job)$/i.test(cleanText)
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

    // Navigation: Next Job / Previous Job
    if (/^(next|next\s*job|go\s*down|next\s*listing)$/i.test(cleanText)) {
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

    if (/^(previous|previous\s*job|go\s*up|prev\s*job|last\s*job)$/i.test(cleanText)) {
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

    // Search Command (when in Job Seeker view or landing)
    const searchMatch = cleanText.match(/^(?:search|find|filter|look for)\s*(?:for\s*)?(.+)$/i);
    if (searchMatch) {
      const keyword = searchMatch[1].trim();
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
    if (/^(remote\s*only|remote|toggle\s*remote)$/i.test(cleanText)) {
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

    if (/^(clear\s*search|reset\s*search|clear\s*filters|reset\s*filters|all\s*jobs|show\s*all)$/i.test(cleanText)) {
      setSearchQuery('');
      setFilterType('all');
      setRemoteOnly(false);
      announce('Cleared search and reset filters.');
      voiceEngine.speak('Cleared filters. Showing all jobs.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'filter', 0.99, 'local-nlp-fallback');
      return;
    }

    // Apply Command
    if (/apply(\s*now)?|submit(\s*application)?|auto[\s-]?fill/i.test(cleanText)) {
      setPortalView('job_seeker');
      if (selectedJob) {
        setAutoFillSource('Voice');
        setIsAutoFillModalOpen(true);
        announce(`Opening 1-Click DOM Form Auto-Fill for ${selectedJob.title}`);
        voiceEngine.speak(`Auto-filling application for ${selectedJob.title}`, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
      }
      addRecentInteraction(transcript, 'apply', 0.99, 'local-nlp-fallback');
      return;
    }

    // Read Command
    if (/read(\s*job|\s*description|\s*aloud|\s*it)?|speak|narrate/i.test(cleanText)) {
      setPortalView('job_seeker');
      if (selectedJob) {
        const textToRead = `${selectedJob.title} at ${selectedJob.company}. Salary: ${selectedJob.salaryRange}. Location: ${selectedJob.location}. ${selectedJob.simplifiedSummary?.roleOverview || selectedJob.description}`;
        voiceEngine.speak(textToRead, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        announce(`Reading aloud ${selectedJob.title}`);
        addRecentInteraction(transcript, 'read', 0.98, 'local-nlp-fallback');
      }
      return;
    }

    // Summarize Command
    if (/summarize|simplify|breakdown|ai summary/i.test(cleanText)) {
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
    if (/^(high\s*contrast|contrast|toggle\s*contrast)$/i.test(cleanText)) {
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
    if (/^(zoom\s*in|font\s*bigger|increase\s*font|larger\s*text)$/i.test(cleanText)) {
      setFontSizeZoom(prev => {
        const next = Math.min(140, prev + 10);
        announce(`Increased font size to ${next} percent.`);
        return next;
      });
      return;
    }

    if (/^(zoom\s*out|font\s*smaller|decrease\s*font|smaller\s*text)$/i.test(cleanText)) {
      setFontSizeZoom(prev => {
        const next = Math.max(80, prev - 10);
        announce(`Decreased font size to ${next} percent.`);
        return next;
      });
      return;
    }

    // Save Profile Command (when in Profile tab)
    if (/^(save\s*profile|save|update\s*profile)$/i.test(cleanText)) {
      if (profile) {
        announce('Candidate profile saved successfully.');
        voiceEngine.speak('Candidate profile saved.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
        addRecentInteraction(transcript, 'save_profile', 0.99, 'local-nlp-fallback');
      }
      return;
    }

    // Help / Commands list
    if (/^(help|commands|what\s*can\s*i\s*do|assistant|voice\s*guide|show\s*commands)$/i.test(cleanText)) {
      setIsVoiceModalOpen(true);
      announce('Opened Voice Assistant commands reference.');
      voiceEngine.speak('Here is the command guide. You can say any tab name or action.', profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
      setIsSpeaking(true);
      addRecentInteraction(transcript, 'help', 0.99, 'local-nlp-fallback');
      return;
    }

    // ⚡ 2. ASYNC BACKEND PARSER FOR COMPLEX SPEECH PHRASES
    try {
      const parseResult = await api.parseVoiceCommand(transcript, forceLocalFallback);
      addRecentInteraction(transcript, parseResult.intent, parseResult.confidence, parseResult.source);

      if (parseResult.intent === 'switch_role') {
        const targetRole = parseResult.parameters.role || (role === 'job_seeker' ? 'recruiter' : 'job_seeker');
        handleRoleChange(targetRole);
        const name = targetRole === 'recruiter' ? 'Recruiter' : 'Job Seeker';
        voiceEngine.speak(`Switched whole page to ${name} portal.`, profile?.assistivePreferences.speechRate || 1.0, () => setIsSpeaking(false));
        setIsSpeaking(true);
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
  }, [addRecentInteraction, announce, forceLocalFallback, handleGoHome, handleRoleChange, profile, role, selectedJob, jobs]);

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
      (transcript) => handleVoiceCommand(transcript),
      (status) => {
        setVoiceStatus(status);
        if (status === 'speaking') setIsSpeaking(true);
        if (status === 'idle') setIsSpeaking(false);
      }
    );
  }, [handleVoiceCommand]);

  // Keyboard Shortcuts:
  // 1. Alt+M or 'V' / 'M' to Toggle Voice Listening
  // 2. Alt+V for 1-Click DOM Form Auto-Fill (or voice toggle if no job selected)
  // 3. Escape to close modals and stop speaking
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
  }, [announce, handleToggleVoice, portalView, selectedJob]);

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
          />
        )}

        {/* ========================================================================= */}
        {/* ROLE 1: JOB SEEKER INTERFACE (WHOLE PAGE CONVERTED - NO TEST SUITE / DOCS)*/}
        {/* ========================================================================= */}
        {portalView === 'job_seeker' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Seeker Sub-Navigation Controls (Clean & focused: NO Test Suite, NO API Docs) */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-2 rounded-2xl">
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Seeker navigation sections">
                <button
                  role="tab"
                  aria-selected={seekerTab === 'jobs'}
                  onClick={() => setSeekerTab('jobs')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                    seekerTab === 'jobs'
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Accessible Job Board</span>
                </button>

                <button
                  role="tab"
                  aria-selected={seekerTab === 'profile'}
                  onClick={() => setSeekerTab('profile')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                    seekerTab === 'profile'
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Applicant Profile (Slide 4)</span>
                </button>

                <button
                  role="tab"
                  aria-selected={seekerTab === 'applications'}
                  onClick={() => setSeekerTab('applications')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                    seekerTab === 'applications'
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>My Applications ({applications.length})</span>
                </button>
              </div>

              {/* Voice Prompt in Job Seeker */}
              <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
                <span>Say <strong className="text-amber-400">“Switch to Recruiter”</strong> to change portals</span>
              </div>
            </div>

            {/* TAB: ACCESSIBLE JOB BOARD */}
            {seekerTab === 'jobs' && (
              <div className="space-y-6">
                {/* Search Bar & Filter Controls */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1 min-w-[280px] relative">
                    <label htmlFor="search-input" className="sr-only">
                      Search job postings by keyword or role
                    </label>
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="search-input"
                      type="text"
                      placeholder='Search by role or say "Search React" / "Search Remote"...'
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
                      <option value="all">All Job Types</option>
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
                      Remote Only
                    </button>
                  </div>
                </div>

                {/* Main Split: Job List + Selected Job Inspector */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Job Cards */}
                  <div className="lg:col-span-5 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                      <span>Available Positions ({jobs.length})</span>
                      <span className="font-mono text-emerald-400">0 Barrier Gateways</span>
                    </div>

                    {jobs.length === 0 ? (
                      <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                        No jobs matched your search criteria.
                        <button
                          onClick={() => { setSearchQuery(''); setFilterType('all'); setRemoteOnly(false); }}
                          className="mt-3 block mx-auto px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs"
                        >
                          Reset Filters
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
    </div>
  );
}
