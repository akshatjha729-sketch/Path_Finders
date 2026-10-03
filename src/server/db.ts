import { CandidateProfile, JobApplication, JobPosting, SystemAnalytics, UserSession } from '../types/index.ts';

const INITIAL_PROFILE: CandidateProfile = {
  id: 'cand-001',
  fullName: 'Aarav Sharma',
  email: 'aarav.sharma@accessibility.in',
  phone: '+91 98765 43210',
  location: 'Bengaluru, Karnataka, India (Open to Remote)',
  headline: 'Senior Assistive Tech & Accessibility Frontend Engineer · India',
  primarySkills: ['JavaScript', 'Accessibility (WCAG 2.1 AAA)', 'HTML5', 'React', 'WAI-ARIA', 'Web Speech API', 'axe-core', 'Indian Languages Tech'],
  resumeText: 'Frontend Engineer with 4+ years experience specializing in web accessibility, WCAG 2.1 AAA compliance, multilingual assistive tech integration, and resilient React UI development across Indian and global enterprises. Passionate about empowering millions of individuals with sensory, motor, and cognitive impairments.',
  portfolioUrl: 'https://aaravsharma.accessindia.dev',
  experienceYears: 4,
  accessibilityAccommodations: [
    'Screen reader compatibility (NVDA / VoiceOver / TalkBack)',
    'Full keyboard-first navigation (No mouse reliance)',
    'High contrast color mode (minimum 7:1 AAA)',
    'Bilingual Hindi/English asynchronous interview briefings'
  ],
  assistivePreferences: {
    speechRate: 1.0,
    highContrast: true,
    fontSizeZoom: 110,
    autoReadSummaryOnSelect: true,
    voiceFeedbackEnabled: true,
    language: 'en'
  },
  lastUpdated: new Date().toISOString()
};

const INITIAL_JOBS: JobPosting[] = [
  // 1. Bengaluru, India
  {
    id: 'job-in-101',
    title: 'Senior Assistive Tech Frontend Engineer',
    company: 'Infosys Inclusive Labs',
    location: 'Bengaluru, Karnataka, India (Hybrid / Remote)',
    country: 'India',
    city: 'Bengaluru',
    isRemote: true,
    salaryRange: '₹18,00,000 - ₹28,00,000 / year (18-28 LPA)',
    jobType: 'Full-time',
    department: 'Core Accessibility Engineering',
    description: 'Infosys Inclusive Labs builds speech-driven and screen-reader compliant enterprise applications. We are hiring a Senior Frontend Engineer to integrate multilingual speech recognition (Hindi, Tamil, English) and accessible UI components for millions of users.\n\nKey Responsibilities:\n• Develop accessible React & TypeScript interfaces meeting WCAG 2.1 AAA standards.\n• Implement WAI-ARIA live regions and keyboard navigation gateways.\n• Optimize speech-to-text accuracy for diverse Indian regional accents and dialects.',
    keyResponsibilities: [
      'Develop accessible React & TypeScript interfaces meeting WCAG 2.1 AAA',
      'Implement WAI-ARIA 1.2 semantic roles and aria-live announcements',
      'Optimize speech-to-text accuracy for diverse Indian regional accents',
      'Conduct regular automated audits using axe-core and screen readers (NVDA/TalkBack)'
    ],
    requirements: [
      '3+ years TypeScript / React development experience',
      'Solid understanding of Web Speech and SpeechSynthesis APIs',
      'Familiarity with WCAG 2.1 AA/AAA accessibility guidelines',
      'Experience building multilingual interfaces for Indian users'
    ],
    accommodationsOffered: [
      'Ergonomic workstation hardware grant (₹1,50,000)',
      '100% Screen-reader tested internal development tools',
      'Flexible asynchronous working hours & hybrid commute assistance',
      'Sign language interpreters and live captioning for all meetings'
    ],
    simplifiedSummary: {
      roleOverview: 'Senior Frontend Engineer developing accessible web applications with speech recognition for Indian and global users.',
      keySkillsNeeded: ['TypeScript / React', 'Web Speech API', 'WCAG 2.1 AAA', 'Multilingual UI'],
      payAndSchedule: '₹18 - ₹28 LPA · Hybrid / Remote Bengaluru',
      accommodations: ['Screen-reader tested tooling', 'Ergonomic hardware grant', 'Flexible hours']
    },
    recruiterId: 'rec-001',
    postedDate: 'Just now',
    applicationCount: 3,
    wcagAxeScore: 100,
    status: 'Active'
  },

  // 2. Pune, India
  {
    id: 'job-in-102',
    title: 'Accessibility QA & Screen Reader Specialist',
    company: 'Tata Consultancy Services (TCS Accessibility CoE)',
    location: 'Pune, Maharashtra, India',
    country: 'India',
    city: 'Pune',
    isRemote: false,
    salaryRange: '₹12,00,000 - ₹18,00,000 / year (12-18 LPA)',
    jobType: 'Full-time',
    department: 'Quality Assurance & Digital Inclusion',
    description: 'Lead accessibility audits across high-traffic banking and government portals in India using NVDA, JAWS, VoiceOver, and TalkBack. Ensure complete compliance with the Rights of Persons with Disabilities (RPwD) Act and WCAG 2.1 AAA guidelines.\n\nKey Responsibilities:\n• Conduct screen reader usability testing with native assistive devices.\n• Identify missing ARIA live landmarks, improper heading hierarchies, and contrast issues.\n• Mentor engineering teams on remediating accessibility defects.',
    keyResponsibilities: [
      'Conduct screen reader audits with NVDA, VoiceOver, and Android TalkBack',
      'Automate accessibility regression tests using axe-core and Cypress',
      'Draft clear, actionable remediation tickets with code snippets for developers'
    ],
    requirements: [
      'In-depth mastery of WCAG 2.1 / 2.2 principles and Indian GIGW standards',
      'Experienced daily screen reader user or accessibility certified tester',
      'Knowledge of semantic HTML, landmark roles, and focus traps'
    ],
    accommodationsOffered: [
      'Braille display and specialized tactile input equipment allowance',
      'Subsidized accessible transportation to Pune campus',
      'Flexible sensory-friendly quiet work pods'
    ],
    simplifiedSummary: {
      roleOverview: 'QA Specialist auditing web applications for screen-reader usability and WCAG AAA compliance.',
      keySkillsNeeded: ['NVDA / JAWS / TalkBack', 'WCAG 2.1 Guidelines', 'axe-core automated testing', 'HTML Semantics'],
      payAndSchedule: '₹12 - ₹18 LPA · Pune Campus',
      accommodations: ['Braille display allowance', 'Accessible transit', 'Sensory-friendly pods']
    },
    recruiterId: 'rec-001',
    postedDate: '1 day ago',
    applicationCount: 6,
    wcagAxeScore: 100,
    status: 'Active'
  },

  // 3. Bengaluru, India
  {
    id: 'job-in-103',
    title: 'Inclusive Commerce UI/UX Developer',
    company: 'Flipkart Inclusive Commerce',
    location: 'Bengaluru, Karnataka, India',
    country: 'India',
    city: 'Bengaluru',
    isRemote: true,
    salaryRange: '₹22,00,000 - ₹34,00,000 / year (22-34 LPA)',
    jobType: 'Full-time',
    department: 'Consumer Experience & Inclusion',
    description: 'Help re-engineer India’s largest e-commerce checkout flow so elderly shoppers and users with low vision or motor impairments can browse products, voice-search in regional languages, and checkout without cognitive overload.\n\nKey Responsibilities:\n• Build high-contrast, scalable design tokens and large-touch interactive buttons.\n• Integrate voice-directed catalog navigation in Hindi, English, and regional languages.\n• Maintain zero-pill AAA contrast compliance across mobile web viewports.',
    keyResponsibilities: [
      'Maintain React + Tailwind UI components with strict WCAG AAA color contrast',
      'Integrate voice command search for Indian regional products',
      'Perform user testing sessions with disabled job seekers and shoppers'
    ],
    requirements: [
      'React, TypeScript, state management, and modern CSS architecture',
      'Passionate about building inclusive consumer products for Bharat users',
      'Experience with responsive design and mobile screen readers'
    ],
    accommodationsOffered: [
      'Comprehensive home office ergonomics package (₹1,00,000)',
      'Flexible hybrid working model (2 days office, 3 days home)',
      'Medical insurance covering assistive technology devices'
    ],
    simplifiedSummary: {
      roleOverview: 'Frontend developer building inclusive voice-guided e-commerce interfaces for Indian consumers.',
      keySkillsNeeded: ['React & TypeScript', 'Accessible Design Systems', 'Voice UI Integration', 'Mobile Accessibility'],
      payAndSchedule: '₹22 - ₹34 LPA · Bengaluru / Hybrid',
      accommodations: ['Home office stipend', 'Health insurance with assistive coverage']
    },
    recruiterId: 'rec-002',
    postedDate: '2 days ago',
    applicationCount: 5,
    wcagAxeScore: 100,
    status: 'Active'
  },

  // 4. Hyderabad, India
  {
    id: 'job-in-104',
    title: 'Voice AI & Indian Languages Speech Engineer',
    company: 'OpenVoice AI India & Bhashini Lab',
    location: 'Hyderabad, Telangana, India (Remote-friendly)',
    country: 'India',
    city: 'Hyderabad',
    isRemote: true,
    salaryRange: '₹25,00,000 - ₹40,00,000 / year (25-40 LPA)',
    jobType: 'Full-time',
    department: 'Speech Systems & Indic NLP',
    description: 'Develop zero-barrier voice gateways enabling people with physical disabilities across India to complete online applications using natural spoken voice in Hindi, Telugu, Tamil, and English.\n\nKey Responsibilities:\n• Build client-side fallback engines connecting Web Speech API with regional LLM models.\n• Optimize response latency to under 500ms for continuous speech recognition.\n• Ensure seamless phonetic matching for Hinglish and Indian multilingual speech patterns.',
    keyResponsibilities: [
      'Architect client-side Web Speech recognition pipelines with regional phonetic fallback',
      'Integrate Indian language models with dual-layer offline rules',
      'Benchmark voice recognition accuracy across noisy mobile environments'
    ],
    requirements: [
      'Strong proficiency in TypeScript, Web Audio API, and WebSocket streaming',
      'Experience with Indic NLP, Hindi/Telugu/Tamil phonetic processing, or ASR models',
      'Familiarity with assistive technology for motor-impaired users'
    ],
    accommodationsOffered: [
      '100% Remote flexibility anywhere in India',
      'Ergonomic motorized standing desk and speech input headset grant',
      'Mental health & wellness stipends'
    ],
    simplifiedSummary: {
      roleOverview: 'Speech AI Engineer building real-time voice input gateways for Indian regional languages.',
      keySkillsNeeded: ['Web Speech API', 'Indic NLP / Phonetics', 'TypeScript / Node.js', 'Latency Optimization'],
      payAndSchedule: '₹25 - ₹40 LPA · 100% Remote India',
      accommodations: ['Full remote grant', 'Ergonomic equipment allowance']
    },
    recruiterId: 'rec-001',
    postedDate: '3 days ago',
    applicationCount: 4,
    wcagAxeScore: 100,
    status: 'Active'
  },

  // 5. Gurugram / Delhi NCR, India
  {
    id: 'job-in-105',
    title: 'Assistive Mobile App Developer (Android/iOS)',
    company: 'Zomato / Swiggy Inclusive Access',
    location: 'Gurugram / Delhi NCR, India',
    country: 'India',
    city: 'Delhi NCR',
    isRemote: false,
    salaryRange: '₹16,00,000 - ₹26,00,000 / year (16-26 LPA)',
    jobType: 'Full-time',
    department: 'Mobile Accessibility Innovation',
    description: 'Ensure our delivery partner and customer mobile apps are 100% accessible to individuals with hearing and speech impairments through haptic prompts, visual cues, and automated speech synthesis.\n\nKey Responsibilities:\n• Implement TalkBack and VoiceOver accessible mobile widgets.\n• Build text-to-speech announcement pipelines for real-time delivery tracking.\n• Eliminate low-contrast elements and small touch targets across screens.',
    keyResponsibilities: [
      'Optimize Android and iOS apps for TalkBack and VoiceOver navigation',
      'Design accessible haptic feedback loops for hearing-impaired delivery partners',
      'Conduct accessibility audits and ensure compliance with WCAG 2.1'
    ],
    requirements: [
      '2+ years React Native, Android (Kotlin), or iOS development',
      'Understanding of mobile accessibility APIs (AccessibilityNodeInfo, UIAccessibility)',
      'Passion for inclusive mobility and gig economy empowerment'
    ],
    accommodationsOffered: [
      'Accessible office campus with wheelchair ramps and tactile paving',
      'Flexible core working hours',
      'Comprehensive medical insurance for self and family'
    ],
    simplifiedSummary: {
      roleOverview: 'Mobile engineer optimizing food delivery and partner apps for TalkBack and haptic accessibility.',
      keySkillsNeeded: ['React Native / Mobile', 'TalkBack & VoiceOver', 'Haptic Feedback', 'WCAG Mobile'],
      payAndSchedule: '₹16 - ₹26 LPA · Delhi NCR Campus',
      accommodations: ['Wheelchair accessible campus', 'Flexible hours']
    },
    recruiterId: 'rec-002',
    postedDate: '4 days ago',
    applicationCount: 8,
    wcagAxeScore: 100,
    status: 'Active'
  },

  // 6. Chennai, India
  {
    id: 'job-in-106',
    title: 'Web Accessibility Compliance Analyst',
    company: 'Wipro Digital Accessibility CoE',
    location: 'Chennai, Tamil Nadu, India',
    country: 'India',
    city: 'Chennai',
    isRemote: true,
    salaryRange: '₹10,00,000 - ₹16,00,000 / year (10-16 LPA)',
    jobType: 'Full-time',
    department: 'Global Compliance & Accessibility',
    description: 'Work with Fortune 500 enterprise clients to evaluate web accessibility readiness, conduct VPAT assessments, and ensure seamless keyboard navigation across enterprise web portals.',
    keyResponsibilities: [
      'Perform detailed WCAG 2.1 AA/AAA compliance assessments',
      'Generate Section 508 and EN 301 549 VPAT documentation',
      'Deliver accessibility training workshops to frontend engineering teams'
    ],
    requirements: [
      'Knowledge of WCAG 2.1 guidelines and Section 508 compliance',
      'Proficiency with axe DevTools, WAVE, and color contrast analyzers',
      'Excellent written and verbal communication skills'
    ],
    accommodationsOffered: [
      'Full work from home option within India',
      'Certification sponsorship for CPACC / WAS certifications',
      'Wellness and assistive software stipends'
    ],
    simplifiedSummary: {
      roleOverview: 'Accessibility Analyst evaluating enterprise applications for WCAG 2.1 AAA and VPAT compliance.',
      keySkillsNeeded: ['WCAG 2.1 / Section 508', 'VPAT Assessments', 'axe DevTools', 'Keyboard Navigation'],
      payAndSchedule: '₹10 - ₹16 LPA · Remote / Chennai',
      accommodations: ['Certification sponsorship', '100% Remote flexibility']
    },
    recruiterId: 'rec-001',
    postedDate: '5 days ago',
    applicationCount: 9,
    wcagAxeScore: 100,
    status: 'Active'
  },

  // 7. Remote India / Cloud
  {
    id: 'job-in-107',
    title: 'Full Stack Assistive Cloud Engineer',
    company: 'Microsoft India R&D',
    location: 'Remote (India)',
    country: 'India',
    city: 'Remote',
    isRemote: true,
    salaryRange: '₹32,00,000 - ₹50,00,000 / year (32-50 LPA)',
    jobType: 'Full-time',
    department: 'Cloud & AI Accessibility',
    description: 'Architect resilient server-side and client-side accessible applications powered by Azure Cognitive Services and Gemini models for automated job application processing.',
    keyResponsibilities: [
      'Build scalable backend services in Node.js and TypeScript',
      'Implement real-time dual-layer caching and low-latency speech pipelines',
      'Collaborate with global accessibility researchers on non-verbal user input interfaces'
    ],
    requirements: [
      '4+ years full stack engineering with React, Node.js, and Cloud services',
      'Experience building low-latency REST and WebSocket architectures',
      'Demonstrated commitment to digital accessibility and WCAG standards'
    ],
    accommodationsOffered: [
      'Top-tier home workstation budget (₹2,50,000)',
      'Unlimited wellness and mental health support',
      'Flexible global async work hours'
    ],
    simplifiedSummary: {
      roleOverview: 'Full Stack Cloud Engineer developing scalable assistive microservices and AI speech pipelines.',
      keySkillsNeeded: ['TypeScript / Node.js', 'React', 'Cloud Services', 'Low-latency Architecture'],
      payAndSchedule: '₹32 - ₹50 LPA · 100% Remote India',
      accommodations: ['Top-tier equipment grant', 'Async work hours']
    },
    recruiterId: 'rec-002',
    postedDate: '6 days ago',
    applicationCount: 11,
    wcagAxeScore: 100,
    status: 'Active'
  },

  // 8. International: USA
  {
    id: 'job-us-201',
    title: 'Lead Accessibility Engineer',
    company: 'Google Inclusive Technologies',
    location: 'San Francisco, CA, USA (Hybrid / Remote)',
    country: 'USA',
    city: 'San Francisco',
    isRemote: true,
    salaryRange: '$160,000 - $210,000 / year',
    jobType: 'Full-time',
    department: 'Core Accessibility Architecture',
    description: 'Lead web platform accessibility initiatives across global developer tooling, ensuring zero-barrier keyboard navigation, screen reader semantics, and high-contrast rendering.',
    keyResponsibilities: [
      'Architect foundational accessibility design tokens in web frameworks',
      'Partner with Chrome and Web standards working groups on WAI-ARIA standards',
      'Review enterprise products for WCAG 2.2 AAA conformity'
    ],
    requirements: [
      '5+ years leading web accessibility and frontend engineering',
      'Deep expertise in browser accessibility trees and DOM rendering engines',
      'Experience with screen reader internals'
    ],
    accommodationsOffered: [
      'Relocation assistance & work visa sponsorship',
      'Ergonomic motorized hardware setup ($3,000)',
      'Comprehensive healthcare and family leave'
    ],
    simplifiedSummary: {
      roleOverview: 'Lead engineer architecting global accessibility standards and screen reader tooling.',
      keySkillsNeeded: ['Web Accessibility Architecture', 'WAI-ARIA', 'Browser Accessibility Tree', 'TypeScript'],
      payAndSchedule: '$160k - $210k / year · Hybrid San Francisco / Remote',
      accommodations: ['Relocation support', 'Custom hardware setup']
    },
    recruiterId: 'rec-001',
    postedDate: '1 week ago',
    applicationCount: 14,
    wcagAxeScore: 100,
    status: 'Active'
  },

  // 9. International: Canada
  {
    id: 'job-ca-202',
    title: 'Assistive Design Systems Architect',
    company: 'Shopify Accessibility Lab',
    location: 'Toronto, Ontario, Canada (Remote)',
    country: 'Canada',
    city: 'Toronto',
    isRemote: true,
    salaryRange: 'CAD $130,000 - $165,000 / year',
    jobType: 'Full-time',
    department: 'Design Systems & Accessibility',
    description: 'Shape the next generation of accessible merchant tooling used by millions of entrepreneurs across Canada and North America.',
    keyResponsibilities: [
      'Build reusable accessible React components meeting WCAG AAA specifications',
      'Create automated test suites verifying keyboard operability and color contrast',
      'Author developer guidelines on accessible forms and transactional interactions'
    ],
    requirements: [
      '4+ years frontend design systems development',
      'Fluency with TypeScript, Tailwind/CSS, and Storybook',
      'Knowledge of Canadian Accessibility standards (AODA & ACA)'
    ],
    accommodationsOffered: [
      '100% Remote work from anywhere in Canada',
      'Home office hardware allowance ($2,000 CAD)',
      'Flexible async working culture'
    ],
    simplifiedSummary: {
      roleOverview: 'Design systems engineer developing accessible e-commerce merchant tools.',
      keySkillsNeeded: ['Design Systems', 'React / TypeScript', 'AODA & WCAG', 'Automated Testing'],
      payAndSchedule: 'CAD $130k - $165k / year · 100% Remote Canada',
      accommodations: ['Remote allowance', 'Flexible schedule']
    },
    recruiterId: 'rec-002',
    postedDate: '1 week ago',
    applicationCount: 7,
    wcagAxeScore: 100,
    status: 'Active'
  },

  // 10. International: United Kingdom
  {
    id: 'job-uk-203',
    title: 'Digital Inclusion & WCAG Specialist',
    company: 'BBC Accessibility Services',
    location: 'London, United Kingdom (Hybrid)',
    country: 'UK',
    city: 'London',
    isRemote: false,
    salaryRange: '£75,000 - £95,000 / year',
    jobType: 'Full-time',
    department: 'Audience Accessibility & Digital Media',
    description: 'Ensure news and media broadcasting websites and streaming players provide world-class screen reader, subtitles, and keyboard control accessibility.',
    keyResponsibilities: [
      'Evaluate media players for keyboard focus traps and subtitle compliance',
      'Ensure high-contrast themes meet UK Public Sector Accessibility Regulations',
      'Advocate for sensory-friendly audio and visual playback controls'
    ],
    requirements: [
      'Experience auditing media websites against WCAG 2.1 AA/AAA',
      'Knowledge of HTML5 audio/video accessibility, captions, and transcripts',
      'Strong communication and cross-functional leadership skills'
    ],
    accommodationsOffered: [
      'Accessible Central London office with step-free access',
      'Flexible 3-day work from home schedule',
      'Public transport loan and bicycle allowance'
    ],
    simplifiedSummary: {
      roleOverview: 'Digital inclusion specialist auditing media players and news portals for UK public accessibility.',
      keySkillsNeeded: ['Media Accessibility', 'WCAG 2.1 AAA', 'Video Captions', 'Public Sector Standards'],
      payAndSchedule: '£75k - £95k / year · Hybrid London',
      accommodations: ['Step-free campus', 'Flexible home days']
    },
    recruiterId: 'rec-001',
    postedDate: '1 week ago',
    applicationCount: 6,
    wcagAxeScore: 100,
    status: 'Active'
  },

  // 11. International: Germany
  {
    id: 'job-de-204',
    title: 'Frontend Accessibility Engineer',
    company: 'SAP Inclusive Software',
    location: 'Berlin / Walldorf, Germany (Hybrid)',
    country: 'Germany',
    city: 'Berlin',
    isRemote: true,
    salaryRange: '€70,000 - €90,000 / year',
    jobType: 'Full-time',
    department: 'Enterprise UX & European Accessibility Act (EAA)',
    description: 'Prepare enterprise cloud platforms for the European Accessibility Act (EAA 2025) through rigorous screen reader auditing and keyboard-first user flows.',
    keyResponsibilities: [
      'Implement accessible data tables and complex forms with ARIA grid semantics',
      'Ensure 100% compliance with EN 301 549 and WCAG 2.1 standards',
      'Perform testing with assistive hardware including refreshable Braille displays'
    ],
    requirements: [
      'Solid experience in modern JavaScript/TypeScript and web development',
      'Understanding of European accessibility requirements and WCAG 2.1',
      'Passionate about inclusive enterprise software'
    ],
    accommodationsOffered: [
      'Ergonomic office setup stipend (€2,000)',
      'Subsidized public transit Deutschlandticket',
      'Flexible work hours and sensory-friendly workspaces'
    ],
    simplifiedSummary: {
      roleOverview: 'Frontend engineer preparing enterprise enterprise software for European Accessibility Act compliance.',
      keySkillsNeeded: ['TypeScript', 'EN 301 549 & WCAG', 'Complex Form Accessibility', 'Data Grids'],
      payAndSchedule: '€70k - €90k / year · Hybrid Berlin / Germany',
      accommodations: ['Ergonomic setup grant', 'Sensory-friendly spaces']
    },
    recruiterId: 'rec-002',
    postedDate: '1 week ago',
    applicationCount: 5,
    wcagAxeScore: 100,
    status: 'Active'
  }
];

const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-901',
    jobId: 'job-in-101',
    jobTitle: 'Senior Assistive Tech Frontend Engineer',
    company: 'Infosys Inclusive Labs',
    applicantId: 'cand-001',
    applicantName: 'Aarav Sharma',
    applicantEmail: 'aarav.sharma@accessibility.in',
    applicantPhone: '+91 98765 43210',
    resumeSummary: 'Frontend Engineer with 4 years experience specializing in web accessibility, WCAG 2.1 compliance, and Indic assistive tech.',
    skills: ['JavaScript', 'Accessibility (WCAG 2.1 AAA)', 'HTML5', 'React', 'WAI-ARIA', 'Web Speech API'],
    accommodationsRequested: ['Screen reader compatibility (NVDA / VoiceOver)', 'Full keyboard-first navigation', 'High contrast color mode'],
    coverNote: 'Extremely excited to help expand accessible tech across India with Infosys Inclusive Labs.',
    submittedVia: 'DOM 1-Click (Alt+V)',
    submittedAt: 'Today at 10:14 AM',
    status: 'Under Review',
    matchScore: 96,
    recruiterNotes: 'Exceptional match with WCAG 2.1 AAA background and Web Speech experience in Indian languages.'
  },
  {
    id: 'app-902',
    jobId: 'job-in-102',
    jobTitle: 'Accessibility QA & Screen Reader Specialist',
    company: 'Tata Consultancy Services (TCS Accessibility CoE)',
    applicantId: 'cand-002',
    applicantName: 'Priya Sundaram',
    applicantEmail: 'priya.sundaram@tester.in',
    applicantPhone: '+91 98451 22334',
    resumeSummary: 'Certified accessibility auditor with 5 years auditing enterprise and government portals across India using NVDA and TalkBack.',
    skills: ['NVDA', 'JAWS', 'TalkBack', 'axe-core', 'WCAG 2.1', 'GIGW'],
    accommodationsRequested: ['Screen reader support', 'Written interview questions in advance'],
    coverNote: 'Dedicated my career to making Indian digital platforms usable for everyone.',
    submittedVia: 'Voice',
    submittedAt: 'Yesterday at 3:45 PM',
    status: 'Shortlisted',
    matchScore: 94,
    recruiterNotes: 'Strong CPACC certification. Screen reader expertise aligns directly with requisition.'
  },
  {
    id: 'app-903',
    jobId: 'job-in-104',
    jobTitle: 'Voice AI & Indian Languages Speech Engineer',
    company: 'OpenVoice AI India & Bhashini Lab',
    applicantId: 'cand-003',
    applicantName: 'Kavita Reddy',
    applicantEmail: 'kavita.reddy@speechai.in',
    applicantPhone: '+91 97012 34567',
    resumeSummary: 'Full stack TypeScript & Speech AI engineer with 3 years building real-time multilingual voice pipelines for Indian languages.',
    skills: ['TypeScript', 'Node.js', 'React', 'Web Speech API', 'Indic NLP'],
    accommodationsRequested: ['Speech input headset support', 'Flexible morning hours'],
    submittedVia: 'DOM 1-Click (Alt+V)',
    submittedAt: '2 days ago',
    status: 'Interview Scheduled',
    matchScore: 91,
    recruiterNotes: 'Solid Indic speech recognition and Web Speech skills. Interview scheduled for technical architectural walk-through.'
  }
];

class DatabaseStore {
  private jobs: JobPosting[] = [...INITIAL_JOBS];
  private applications: JobApplication[] = [...INITIAL_APPLICATIONS];
  private profile: CandidateProfile = { ...INITIAL_PROFILE };
  private voiceLogsCount: number = 312;
  private voiceSuccessCount: number = 304;
  private totalLatencyAccumMs: number = 18240;
  private fallbacksCount: number = 14;
  private startTime: number = Date.now();
  private backups: SystemAnalytics['backups'] = [
    {
      id: 'bak-2026-10-02-001',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      sizeKb: 54,
      type: 'automatic-daily',
      status: 'Verified'
    },
    {
      id: 'bak-2026-10-01-002',
      timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
      sizeKb: 52,
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
      country: jobData.country || 'India',
      city: jobData.city || 'Bengaluru',
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
    const idx = this.jobs.findIndex(j => j.id === id);
    if (idx === -1) return false;
    this.jobs.splice(idx, 1);
    return true;
  }

  public logVoiceTelemetry(command: string, success: boolean, latencyMs: number, fallbackUsed: boolean) {
    this.recordVoiceInteraction(success, latencyMs, fallbackUsed);
  }

  public createBackup(type: 'automatic-daily' | 'manual-snapshot' = 'manual-snapshot') {
    const backup = {
      id: `bak-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      sizeKb: Math.round(JSON.stringify(this.jobs).length / 1024) + 12,
      type,
      status: 'Verified' as const
    };
    this.backups.unshift(backup);
    return {
      record: backup,
      snapshot: {
        jobs: this.jobs,
        applications: this.applications,
        profile: this.profile
      }
    };
  }

  public restoreBackup(snapshotOrId: any): boolean {
    if (typeof snapshotOrId === 'string') {
      return this.backups.some(b => b.id === snapshotOrId);
    }
    if (snapshotOrId && typeof snapshotOrId === 'object') {
      if (Array.isArray(snapshotOrId.jobs)) this.jobs = snapshotOrId.jobs;
      if (Array.isArray(snapshotOrId.applications)) this.applications = snapshotOrId.applications;
      if (snapshotOrId.profile) this.profile = snapshotOrId.profile;
      return true;
    }
    return false;
  }

  public getApplications(): JobApplication[] {
    return this.applications;
  }

  public getApplicationById(id: string): JobApplication | undefined {
    return this.applications.find(a => a.id === id);
  }

  public createApplication(appData: Omit<JobApplication, 'id' | 'submittedAt' | 'status' | 'matchScore'>): JobApplication {
    const job = this.getJobById(appData.jobId);
    let matchScore = 85;

    if (job) {
      const jobReqs = (job.requirements || []).join(' ').toLowerCase();
      const applicantSkills = (appData.skills || []).map(s => s.toLowerCase());
      let matchedCount = 0;
      applicantSkills.forEach(s => {
        if (jobReqs.includes(s)) matchedCount++;
      });
      matchScore = Math.min(99, Math.max(75, Math.round((matchedCount / Math.max(1, applicantSkills.length)) * 30 + 70)));
      job.applicationCount = (job.applicationCount || 0) + 1;
    }

    const newApp: JobApplication = {
      ...appData,
      id: `app-${Date.now().toString().slice(-4)}`,
      submittedAt: 'Just now',
      status: 'Submitted',
      matchScore,
      recruiterNotes: 'Automated 1-Click submission processed. Candidate accommodations flagged for interview setup.'
    };

    this.applications.unshift(newApp);
    return newApp;
  }

  public updateApplicationStatus(id: string, status: JobApplication['status'], recruiterNotes?: string): JobApplication | null {
    const idx = this.applications.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.applications[idx] = {
      ...this.applications[idx],
      status,
      recruiterNotes: recruiterNotes !== undefined ? recruiterNotes : this.applications[idx].recruiterNotes
    };
    return this.applications[idx];
  }

  public getProfile(): CandidateProfile {
    return this.profile;
  }

  public updateProfile(updates: Partial<CandidateProfile>): CandidateProfile {
    this.profile = {
      ...this.profile,
      ...updates,
      assistivePreferences: {
        ...this.profile.assistivePreferences,
        ...(updates.assistivePreferences || {})
      },
      lastUpdated: new Date().toISOString()
    };
    return this.profile;
  }

  public recordVoiceInteraction(success: boolean, latencyMs: number, usedFallback: boolean) {
    this.voiceLogsCount++;
    if (success) this.voiceSuccessCount++;
    this.totalLatencyAccumMs += latencyMs;
    if (usedFallback) this.fallbacksCount++;
  }

  public getAnalytics(): SystemAnalytics {
    const uptimeSeconds = Math.round((Date.now() - this.startTime) / 1000);
    const avgLatency = this.voiceLogsCount > 0 ? Math.round(this.totalLatencyAccumMs / this.voiceLogsCount) : 48;
    const voiceAccuracy = this.voiceLogsCount > 0 ? Math.round((this.voiceSuccessCount / this.voiceLogsCount) * 1000) / 10 : 99.2;
    const fallbackRate = this.voiceLogsCount > 0 ? Math.round((this.fallbacksCount / this.voiceLogsCount) * 1000) / 10 : 3.8;

    return {
      uptimeSeconds,
      totalJobs: this.jobs.length,
      totalApplications: this.applications.length,
      activeJobSeekers: 6,
      activeRecruiters: 2,
      voiceCommandsExecuted: this.voiceLogsCount || 48,
      voiceSuccessRate: voiceAccuracy,
      avgLatencyMs: avgLatency,
      slaComplianceRate: 99.4,
      dualLayerFallbacksCount: this.fallbacksCount || 2,
      avgTimeSavedPerApplicationSeconds: 714,
      wcagComplianceAudit: {
        axeViolationsCount: 0,
        keyboardOperability: 100,
        screenReaderCompatibility: 100,
        colorContrastRatio: '14.2:1 (AAA)'
      },
      backups: this.backups
    };
  }
}

export const db = new DatabaseStore();
