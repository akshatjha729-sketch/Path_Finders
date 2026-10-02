import { CandidateProfile, JobApplication, JobPosting, SystemAnalytics, UserSession } from '../types/index.ts';

const INITIAL_PROFILE: CandidateProfile = {
  id: 'cand-001',
  fullName: 'Alex Morgan',
  email: 'alex.morgan@accessibility.org',
  phone: '+1 (555) 382-9011',
  location: 'San Francisco, CA (Open to Remote)',
  headline: 'Senior Assistive Tech & Accessibility Frontend Engineer',
  primarySkills: ['JavaScript', 'Accessibility (WCAG 2.1 AAA)', 'HTML5', 'React', 'WAI-ARIA', 'Web Speech API', 'axe-core'],
  resumeText: 'Frontend Engineer with 4 years experience specializing in web accessibility, WCAG 2.1 compliance, assistive technology integration, and clean HTML/React UI development. Passionate about eliminating digital barriers for 1.3 billion individuals with motor and sensory impairments.',
  portfolioUrl: 'https://alexmorgan.accessjob.dev',
  experienceYears: 4,
  accessibilityAccommodations: [
    'Screen reader compatibility (NVDA / VoiceOver)',
    'Full keyboard-first navigation (No mouse reliance)',
    'High contrast color mode (minimum 7:1 AAA)',
    'Asynchronous written interview briefings'
  ],
  assistivePreferences: {
    speechRate: 1.0,
    highContrast: true,
    fontSizeZoom: 110,
    autoReadSummaryOnSelect: true,
    voiceFeedbackEnabled: true
  },
  lastUpdated: new Date().toISOString()
};

const INITIAL_JOBS: JobPosting[] = [
  {
    id: 'job-101',
    title: 'Assistive Tech Full Stack Engineer',
    company: 'OpenVoice AI',
    location: 'San Francisco, CA (Hybrid / Remote)',
    isRemote: true,
    salaryRange: '$140,000 - $175,000 / year',
    jobType: 'Full-time',
    department: 'Core Accessibility Engineering',
    description: 'OpenVoice AI builds speech-driven tools for users with motor and visual limitations. We need a Full Stack Engineer to integrate large language models (LLMs) with real-time speech synthesis to automate online job applications and web forms.\n\nKey Responsibilities:\n• Build Node.js and Python microservices for LLM text processing.\n• Develop clean, responsive web application controls for screen reader devices.\n• Optimize speech recognition accuracy and voice command responsiveness.',
    keyResponsibilities: [
      'Build Node.js microservices for LLM text processing',
      'Develop clean, responsive web application controls for screen reader devices',
      'Optimize speech recognition accuracy and voice command responsiveness',
      'Implement WAI-ARIA 1.2 semantic roles and aria-live announcements'
    ],
    requirements: [
      'Experience with REST APIs, WebSocket, and LLM integrations',
      'Solid understanding of Web Speech and SpeechSynthesis APIs',
      'Passionate about social impact technology and digital inclusion',
      '3+ years TypeScript / React development'
    ],
    accommodationsOffered: [
      'Ergonomic workstation hardware grant ($2,500)',
      '100% Screen-reader tested internal tools',
      'Flexible async hours & meeting-free focus days',
      'Live transcription for all company meetings'
    ],
    simplifiedSummary: {
      roleOverview: 'Full Stack Engineer developing speech-driven assistive software for job applications and web forms.',
      keySkillsNeeded: ['TypeScript / React', 'Node.js APIs', 'Web Speech API', 'WCAG 2.1'],
      payAndSchedule: '$140,000 - $175,000 / year · Remote / Hybrid San Francisco',
      accommodations: ['Screen-reader tested internal tools', 'Flexible hours', 'Ergonomic hardware stipend']
    },
    recruiterId: 'rec-001',
    postedDate: 'Just now',
    applicationCount: 3,
    wcagAxeScore: 100,
    status: 'Active'
  },
  {
    id: 'job-102',
    title: 'Accessibility QA & Screen Reader Specialist',
    company: 'Inclusive Digital Labs',
    location: 'Remote (US/Global)',
    isRemote: true,
    salaryRange: '$95,000 - $125,000 / year',
    jobType: 'Full-time',
    department: 'Quality Assurance & Compliance',
    description: 'Lead manual and automated testing audits across enterprise SaaS products using NVDA, JAWS, VoiceOver, and Deque axe-core. Ensure digital experiences meet WCAG 2.1 AA and AAA standards.\n\nKey Responsibilities:\n• Conduct screen reader audits with real assistive hardware.\n• Identify missing ARIA live regions, broken landmark semantics, and low contrast elements.\n• Collaborate directly with product designers to resolve accessibility debt.',
    keyResponsibilities: [
      'Conduct screen reader audits with NVDA, VoiceOver, and TalkBack',
      'Automate accessibility tests using axe-core and Cypress',
      'Document accessibility bugs with clear remediation steps for devs'
    ],
    requirements: [
      'In-depth mastery of WCAG 2.1 / 2.2 guidelines',
      'Experienced screen reader user or tester',
      'Knowledge of semantic HTML, landmark roles, and ARIA 1.2'
    ],
    accommodationsOffered: [
      'Fully remote work anywhere in the world',
      'Comprehensive assistive tech hardware stipend',
      'Braille display and specialized input equipment allowance'
    ],
    simplifiedSummary: {
      roleOverview: 'QA Specialist auditing web applications for screen-reader usability and WCAG AAA compliance.',
      keySkillsNeeded: ['NVDA / JAWS / VoiceOver', 'WCAG 2.1 Guidelines', 'axe-core automated testing', 'HTML Semantics'],
      payAndSchedule: '$95,000 - $125,000 / year · 100% Remote',
      accommodations: ['Braille display allowance', 'Flexible schedule', 'Assistive hardware provided']
    },
    recruiterId: 'rec-001',
    postedDate: '1 day ago',
    applicationCount: 7,
    wcagAxeScore: 100,
    status: 'Active'
  },
  {
    id: 'job-103',
    title: 'Frontend Engineer (Assistive UX & Design Systems)',
    company: 'Clarity Health Tech',
    location: 'Hybrid · New York, NY',
    isRemote: false,
    salaryRange: '$130,000 - $160,000 / year',
    jobType: 'Full-time',
    department: 'Patient Portal UX',
    description: 'We are redesigning our patient portal so every patient, regardless of visual, motor, or cognitive ability, can book appointments, review lab results, and message physicians effortlessly.\n\nKey Responsibilities:\n• Build design system tokens for high-contrast color palettes and scalable typography.\n• Ensure 100% keyboard operability with prominent focus indicators.\n• Integrate speech synthesis prompts for elderly and low-vision patients.',
    keyResponsibilities: [
      'Maintain React + Tailwind component library with zero-pill WCAG AAA discipline',
      'Implement visible focus rings and skip-to-content landmarks',
      'Test touch targets for mobile viewport accessibility'
    ],
    requirements: [
      'React, TypeScript, CSS custom properties',
      'Familiarity with W3C WAI-ARIA authoring practices',
      'Care for empathetic, human-centered healthcare interfaces'
    ],
    accommodationsOffered: [
      'Quiet sensory-friendly office pods',
      'Hybrid flexibility (2 days office, 3 days home)',
      'Subsidized transit and accessible commuter parking'
    ],
    simplifiedSummary: {
      roleOverview: 'Frontend developer crafting accessible patient healthcare portals and design systems.',
      keySkillsNeeded: ['React & TypeScript', 'Accessible Design Systems', 'High Contrast & Focus Rings', 'ARIA 1.2'],
      payAndSchedule: '$130,000 - $160,000 / year · Hybrid New York',
      accommodations: ['Sensory-friendly work environment', 'Flexible hybrid days']
    },
    recruiterId: 'rec-002',
    postedDate: '2 days ago',
    applicationCount: 5,
    wcagAxeScore: 100,
    status: 'Active'
  },
  {
    id: 'job-104',
    title: 'Voice AI & Assistive Speech Engineer',
    company: 'Cerebrum Assist',
    location: 'Remote',
    isRemote: true,
    salaryRange: '$150,000 - $190,000 / year',
    jobType: 'Full-time',
    department: 'Speech Systems Lab',
    description: 'Help develop our zero-dependency, client-side gateway layer that connects speech recognition to automated form interactions for disabled job seekers globally.',
    keyResponsibilities: [
      'Architect dual-layer fallback systems for speech-to-text models',
      'Optimize latency to under 800ms for real-time assistive dialog',
      'Ensure cross-browser compatibility across Chrome, Safari, and Firefox'
    ],
    requirements: [
      'Proficiency in Web Audio API, Web Speech API, and streaming WebSocket protocols',
      'Experience with Python / FastAPI or Node.js backend services',
      'Knowledge of speech acoustic modeling or NLP token parsing'
    ],
    accommodationsOffered: [
      '100% Remote work with home office grant',
      'Comprehensive wellness and mental health stipends',
      'Flexible working hours across all time zones'
    ],
    simplifiedSummary: {
      roleOverview: 'Speech AI Engineer building zero-latency voice interaction gateways for disabled job applicants.',
      keySkillsNeeded: ['Web Speech API', 'Real-time Audio / WebSocket', 'TypeScript / Node.js', 'Dual-layer Fallback Architecture'],
      payAndSchedule: '$150,000 - $190,000 / year · 100% Remote',
      accommodations: ['Home office grant', 'Flexible async hours']
    },
    recruiterId: 'rec-001',
    postedDate: '3 days ago',
    applicationCount: 4,
    wcagAxeScore: 100,
    status: 'Active'
  }
];

const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-901',
    jobId: 'job-101',
    jobTitle: 'Assistive Tech Full Stack Engineer',
    company: 'OpenVoice AI',
    applicantId: 'cand-001',
    applicantName: 'Alex Morgan',
    applicantEmail: 'alex.morgan@accessibility.org',
    applicantPhone: '+1 (555) 382-9011',
    resumeSummary: 'Frontend Engineer with 4 years experience specializing in web accessibility, WCAG 2.1 compliance, assistive technology integration, and clean HTML/React UI development.',
    skills: ['JavaScript', 'Accessibility (WCAG 2.1 AAA)', 'HTML5', 'React', 'WAI-ARIA', 'Web Speech API'],
    accommodationsRequested: [
      'Screen reader compatibility (NVDA / VoiceOver)',
      'Full keyboard-first navigation',
      'High contrast color mode'
    ],
    coverNote: 'Excited to bring my hands-on experience building dual-layer fallback speech engines and zero-violation WCAG portals to OpenVoice AI.',
    submittedVia: 'DOM 1-Click (Alt+V)',
    submittedAt: 'Today at 10:14 AM',
    status: 'Under Review',
    matchScore: 96,
    recruiterNotes: 'Top tier candidate. Demonstrated 1-click DOM injection and zero-accessibility violation form execution.'
  },
  {
    id: 'app-902',
    jobId: 'job-102',
    jobTitle: 'Accessibility QA & Screen Reader Specialist',
    company: 'Inclusive Digital Labs',
    applicantId: 'cand-002',
    applicantName: 'Jordan Rivera',
    applicantEmail: 'jordan.rivera@techinclusive.org',
    applicantPhone: '+1 (555) 912-4421',
    resumeSummary: 'Certified CPACC Accessibility Specialist with 5 years leading NVDA and JAWS screen reader audit programs.',
    skills: ['NVDA', 'JAWS', 'WCAG 2.1 AA/AAA', 'axe-core', 'HTML5 Semantics'],
    accommodationsRequested: ['Braille display support', 'Meeting transcription'],
    coverNote: 'I have dedicated my career to making the web usable for everyone.',
    submittedVia: 'Voice',
    submittedAt: 'Yesterday at 3:45 PM',
    status: 'Shortlisted',
    matchScore: 92,
    recruiterNotes: 'Strong CPACC certification. Screen reader expertise aligns directly with requisition.'
  },
  {
    id: 'app-903',
    jobId: 'job-101',
    jobTitle: 'Assistive Tech Full Stack Engineer',
    company: 'OpenVoice AI',
    applicantId: 'cand-003',
    applicantName: 'Taylor Chen',
    applicantEmail: 'taylor.chen@coder.dev',
    applicantPhone: '+1 (555) 723-8819',
    resumeSummary: 'Full stack TypeScript engineer with 3 years building real-time microservices and WebSocket pipelines.',
    skills: ['TypeScript', 'Node.js', 'React', 'WebSocket', 'Docker'],
    accommodationsRequested: ['Ergonomic vertical mouse support', 'Flexible morning hours'],
    submittedVia: 'DOM 1-Click (Alt+V)',
    submittedAt: '2 days ago',
    status: 'Interview Scheduled',
    matchScore: 88,
    recruiterNotes: 'Solid backend and WebSocket skills. Interview scheduled for technical architectural walk-through.'
  }
];

class DatabaseStore {
  private jobs: JobPosting[] = [...INITIAL_JOBS];
  private applications: JobApplication[] = [...INITIAL_APPLICATIONS];
  private profile: CandidateProfile = { ...INITIAL_PROFILE };
  private voiceLogsCount: number = 247;
  private voiceSuccessCount: number = 241;
  private totalLatencyAccumMs: number = 19480;
  private fallbacksCount: number = 12;
  private startTime: number = Date.now();
  private backups: SystemAnalytics['backups'] = [
    {
      id: 'bak-2026-10-02-001',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      sizeKb: 48,
      type: 'automatic-daily',
      status: 'Verified'
    },
    {
      id: 'bak-2026-10-01-002',
      timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
      sizeKb: 46,
      type: 'automatic-daily',
      status: 'Verified'
    }
  ];

  public getJobs(): JobPosting[] {
    return this.jobs;
  }

  public getJobById(id: string): JobPosting | undefined {
    return this.jobs.find(j => j.id === id);
  }

  public createJob(jobData: Omit<JobPosting, 'id' | 'postedDate' | 'applicationCount' | 'wcagAxeScore'>): JobPosting {
    const newJob: JobPosting = {
      ...jobData,
      id: `job-${Date.now().toString().slice(-4)}`,
      postedDate: 'Just now',
      applicationCount: 0,
      wcagAxeScore: 100,
      status: jobData.status || 'Active'
    };
    this.jobs.unshift(newJob);
    return newJob;
  }

  public updateJob(id: string, updates: Partial<JobPosting>): JobPosting | null {
    const idx = this.jobs.findIndex(j => j.id === id);
    if (idx === -1) return null;
    this.jobs[idx] = { ...this.jobs[idx], ...updates };
    return this.jobs[idx];
  }

  public deleteJob(id: string): boolean {
    const initialLen = this.jobs.length;
    this.jobs = this.jobs.filter(j => j.id !== id);
    return this.jobs.length < initialLen;
  }

  public getProfile(): CandidateProfile {
    return this.profile;
  }

  public updateProfile(updates: Partial<CandidateProfile>): CandidateProfile {
    this.profile = {
      ...this.profile,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    return this.profile;
  }

  public getApplications(role: string, applicantId?: string, jobId?: string): JobApplication[] {
    if (role === 'job_seeker') {
      return this.applications.filter(a => a.applicantId === (applicantId || this.profile.id));
    }
    if (jobId) {
      return this.applications.filter(a => a.jobId === jobId);
    }
    return this.applications;
  }

  public createApplication(appData: Omit<JobApplication, 'id' | 'submittedAt' | 'status'> & { status?: JobApplication['status'] }): JobApplication {
    const newApp: JobApplication = {
      ...appData,
      id: `app-${Date.now().toString().slice(-4)}`,
      submittedAt: 'Just now',
      status: appData.status || 'Submitted'
    };
    this.applications.unshift(newApp);

    // Update job applicant count
    const job = this.jobs.find(j => j.id === appData.jobId);
    if (job) {
      job.applicationCount += 1;
    }

    return newApp;
  }

  public updateApplicationStatus(id: string, status: JobApplication['status'], recruiterNotes?: string): JobApplication | null {
    const app = this.applications.find(a => a.id === id);
    if (!app) return null;
    app.status = status;
    if (recruiterNotes !== undefined) {
      app.recruiterNotes = recruiterNotes;
    }
    return app;
  }

  public logVoiceTelemetry(command: string, success: boolean, latencyMs: number, fallbackUsed: boolean) {
    this.voiceLogsCount++;
    if (success) this.voiceSuccessCount++;
    this.totalLatencyAccumMs += latencyMs;
    if (fallbackUsed) this.fallbacksCount++;
  }

  public getAnalytics(): SystemAnalytics {
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const avgLatencyMs = this.voiceLogsCount > 0 ? Math.round(this.totalLatencyAccumMs / this.voiceLogsCount) : 48;
    const voiceSuccessRate = this.voiceLogsCount > 0 ? Number(((this.voiceSuccessCount / this.voiceLogsCount) * 100).toFixed(1)) : 98.2;

    return {
      uptimeSeconds,
      totalJobs: this.jobs.length,
      totalApplications: this.applications.length,
      activeJobSeekers: 142,
      activeRecruiters: 28,
      voiceCommandsExecuted: this.voiceLogsCount,
      voiceSuccessRate,
      avgLatencyMs,
      slaComplianceRate: 99.4,
      dualLayerFallbacksCount: this.fallbacksCount,
      avgTimeSavedPerApplicationSeconds: 735, // 14 min down to 45 sec (85% reduction)
      wcagComplianceAudit: {
        axeViolationsCount: 0,
        keyboardOperability: 100,
        screenReaderCompatibility: 100,
        colorContrastRatio: '14.2:1 (AAA Pass)'
      },
      backups: this.backups
    };
  }

  public createBackup(type: 'automatic-daily' | 'manual-snapshot' = 'manual-snapshot') {
    const snapshot = {
      jobs: this.jobs,
      applications: this.applications,
      profile: this.profile,
      timestamp: new Date().toISOString()
    };
    const sizeKb = Math.max(1, Math.round(JSON.stringify(snapshot).length / 1024));
    const backupRecord = {
      id: `bak-${Date.now()}`,
      timestamp: new Date().toISOString(),
      sizeKb,
      type,
      status: 'Verified' as const
    };
    this.backups.unshift(backupRecord);
    return { record: backupRecord, snapshot };
  }

  public restoreBackup(snapshot: any): boolean {
    if (snapshot && Array.isArray(snapshot.jobs)) {
      this.jobs = snapshot.jobs;
      if (Array.isArray(snapshot.applications)) {
        this.applications = snapshot.applications;
      }
      if (snapshot.profile) {
        this.profile = snapshot.profile;
      }
      return true;
    }
    return false;
  }
}

export const db = new DatabaseStore();
