import { DualLayerSummaryResult, VoiceCommandParseResult } from '../types/index.ts';

/**
 * Local NLP Rule Engine
 * Part of Module 1: Dual-Layer Fallback Architecture (PPT Slide 2, 3, 5)
 * Guarantees zero-downtime and ultra-low latency (<5ms)
 * Operates completely offline or when Cloud AI latency exceeds 800ms SLA.
 */

export function localNlpSummarizeJob(
  jobTitle: string,
  description: string,
  salary: string,
  location: string,
  requirements: string[],
  startTime: number
): DualLayerSummaryResult {
  const text = `${jobTitle}\n${description}\n${requirements.join('\n')}`;

  // 1. Role Overview extraction
  let roleOverview = `${jobTitle} opportunity at ${location}. Core focus on inclusive engineering, web accessibility, and resilient client-side architecture.`;
  const firstSentenceMatch = description.match(/^([^.\n]+[.])/);
  if (firstSentenceMatch) {
    roleOverview = firstSentenceMatch[1].trim();
  }

  // 2. Key Skills Needed
  const skillKeywords = [
    'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'WCAG', 'ARIA', 'Screen Readers',
    'NVDA', 'VoiceOver', 'Node.js', 'Python', 'Web Speech API', 'REST API', 'GraphQL',
    'Accessibility', 'Assistive Tech', 'Testing', 'Jest', 'CI/CD', 'Docker', 'Git'
  ];

  const matchedSkills: string[] = [];
  skillKeywords.forEach((skill) => {
    const reg = new RegExp(`\\b${skill}\\b`, 'i');
    if (reg.test(text)) {
      matchedSkills.push(skill);
    }
  });

  if (matchedSkills.length === 0 && requirements.length > 0) {
    matchedSkills.push(...requirements.slice(0, 4));
  }

  // 3. Pay & Schedule
  let payAndSchedule = salary ? `Compensation: ${salary} · Location: ${location}` : `Market Competitive · ${location}`;

  // 4. Accommodations
  const accommodationTerms = [
    'Screen reader tested portal',
    'Ergonomic workstation budget',
    'Flexible asynchronous working hours',
    'Live captioning (CART) provided',
    '100% Keyboard-navigable workflow',
    'Remote-first friendly'
  ];

  const matchedAccommodations: string[] = [];
  if (/screen\s*reader|nvda|voiceover/i.test(text)) {
    matchedAccommodations.push('Screen reader optimized tooling');
  }
  if (/flexible|asynchronous|hours/i.test(text)) {
    matchedAccommodations.push('Flexible working hours & async comms');
  }
  if (/remote|home/i.test(text) || /remote/i.test(location)) {
    matchedAccommodations.push('100% Remote-friendly workstation option');
  }
  if (matchedAccommodations.length === 0) {
    matchedAccommodations.push(...accommodationTerms.slice(0, 3));
  }

  const latencyMs = Math.max(1, Math.round(performance.now() - startTime));

  return {
    source: 'local-nlp-fallback',
    latencyMs,
    roleOverview,
    keySkillsNeeded: matchedSkills.slice(0, 5),
    payAndSchedule,
    accommodations: matchedAccommodations,
    fallbackReason: 'Cloud AI bypassed or latency threshold (<800ms SLA guarantee)'
  };
}

export function localNlpParseVoiceCommand(
  rawTranscript: string,
  startTime: number
): VoiceCommandParseResult {
  const text = rawTranscript
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const latencyMs = Math.max(1, Math.round(performance.now() - startTime));

  // Home / First page navigation
  if (/^(home|main menu|start page|first page|back to home|landing|go to home)$/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'navigate',
      parameters: { direction: 'home' as any },
      confidence: 0.99,
      rawTranscript
    };
  }

  // Country & Location Voice Commands
  if (/\b(india|bharat)\b/i.test(text) && /\b(job|jobs|work|opening|positions)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'search',
      parameters: { country: 'India', keyword: '' },
      confidence: 0.99,
      rawTranscript
    };
  }
  if (/\b(usa|america|united states|us)\b/i.test(text) && /\b(job|jobs|work)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'search',
      parameters: { country: 'USA', keyword: '' },
      confidence: 0.99,
      rawTranscript
    };
  }
  if (/\b(germany|deutschland|जर्मनी)\b/i.test(text) && /\b(job|jobs|naukri|काम|नौकरी|जॉब)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'search',
      parameters: { country: 'Germany', keyword: '' },
      confidence: 0.99,
      rawTranscript
    };
  }
  if (/\b(uk|united\s*kingdom|britain|ब्रिटेन)\b/i.test(text) && /\b(job|jobs|naukri|काम|नौकरी|जॉब)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'search',
      parameters: { country: 'UK', keyword: '' },
      confidence: 0.99,
      rawTranscript
    };
  }
  if (/\b(canada)\b/i.test(text) && /\b(job|jobs|work)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'search',
      parameters: { country: 'Canada', keyword: '' },
      confidence: 0.99,
      rawTranscript
    };
  }
  if (/\b(bengaluru|bangalore)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'search',
      parameters: { keyword: 'Bengaluru', country: 'India' },
      confidence: 0.99,
      rawTranscript
    };
  }

  // Role Switching: "Job seeker" or "Recruiter" in English
  if (
    /^(recruiter|recruiter mode|recruiter portal|employer|hiring)$/i.test(text) ||
    /\b(switch to recruiter|i am a recruiter|open recruiter|hiring portal)\b/i.test(text)
  ) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_role',
      parameters: { role: 'recruiter' },
      confidence: 0.99,
      rawTranscript
    };
  }

  if (
    /^(job seeker|candidate|applicant|seeker|job seeker portal)$/i.test(text) ||
    /\b(switch to job seeker|switch to candidate|i am a job seeker|open job seeker)\b/i.test(text)
  ) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_role',
      parameters: { role: 'job_seeker' },
      confidence: 0.99,
      rawTranscript
    };
  }

  // Tab Switching: Next/Previous tab, Numbered Tabs, and Direct Tabs
  if (/\b(next tab|switch tab|cycle tab|change tab|forward tab|rotate tab)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_tab',
      parameters: { direction: 'next' },
      confidence: 0.99,
      rawTranscript
    };
  }

  if (/\b(previous tab|prev tab|back tab|last tab|prior tab)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_tab',
      parameters: { direction: 'previous' },
      confidence: 0.99,
      rawTranscript
    };
  }

  if (/\b(tab 1|tab one|first tab)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_tab',
      parameters: { tabNumber: 1 },
      confidence: 0.99,
      rawTranscript
    };
  }

  if (/\b(tab 2|tab two|second tab)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_tab',
      parameters: { tabNumber: 2 },
      confidence: 0.99,
      rawTranscript
    };
  }

  if (/\b(tab 3|tab three|third tab)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_tab',
      parameters: { tabNumber: 3 },
      confidence: 0.99,
      rawTranscript
    };
  }

  if (/\b(jobs|job board|open jobs|show jobs|browse jobs|positions|view jobs|listings|tab jobs|jobs tab)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_tab',
      parameters: { tab: 'jobs' },
      confidence: 0.99,
      rawTranscript
    };
  }

  if (/\b(profile|my profile|candidate profile|applicant profile|edit profile|resume|my resume|cv|tab profile|profile tab)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_tab',
      parameters: { tab: 'profile' },
      confidence: 0.99,
      rawTranscript
    };
  }

  if (/\b(applications|my applications|applied jobs|application status|submissions|tab applications|applications tab)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_tab',
      parameters: { tab: 'applications' },
      confidence: 0.99,
      rawTranscript
    };
  }

  if (/\b(candidates|applicants|candidate applications|review candidates|applicant list|tab candidates|candidates tab)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_tab',
      parameters: { tab: 'candidates' },
      confidence: 0.99,
      rawTranscript
    };
  }

  if (/\b(requisitions|job requisitions|active jobs|job postings|manage jobs|openings|tab requisitions|requisitions tab)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_tab',
      parameters: { tab: 'requisitions' },
      confidence: 0.99,
      rawTranscript
    };
  }

  if (/\b(post a job|post job|create job|new job|add job|publish job|tab post job|tab create job|create job tab|post job tab)\b/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_tab',
      parameters: { tab: 'create_job' },
      confidence: 0.99,
      rawTranscript
    };
  }

  // Clear / Reset search: "Clear search" / "Show all jobs"
  if (/clear(\s*search|\s*filter)?|show\s*all(\s*jobs)?|reset(\s*search|\s*filter)?/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'search',
      parameters: { keyword: '' },
      confidence: 0.98,
      rawTranscript
    };
  }

  // Explicit Search Command (e.g. "search react", "find python", "look for typescript")
  // Only matches when user explicitly uses search prefixes, and excludes tab names from search box!
  const searchMatch = text.match(/^(?:search|find|filter|look for)\s*(?:for\s*)?(.+)$/i);
  if (searchMatch) {
    const rawKeyword = searchMatch[1].trim();

    // Guard: If keyword is a tab name, redirect to tab switch instead of filling search box
    if (/^(jobs|job|job board|open jobs|positions|listings)$/i.test(rawKeyword)) {
      return { source: 'local-nlp-fallback', latencyMs, intent: 'switch_tab', parameters: { tab: 'jobs' }, confidence: 0.99, rawTranscript };
    }
    if (/^(profile|my profile|candidate profile|resume|cv)$/i.test(rawKeyword)) {
      return { source: 'local-nlp-fallback', latencyMs, intent: 'switch_tab', parameters: { tab: 'profile' }, confidence: 0.99, rawTranscript };
    }
    if (/^(applications|my applications|applied jobs|applied|submissions)$/i.test(rawKeyword)) {
      return { source: 'local-nlp-fallback', latencyMs, intent: 'switch_tab', parameters: { tab: 'applications' }, confidence: 0.99, rawTranscript };
    }
    if (/^(candidates|applicants|review candidates)$/i.test(rawKeyword)) {
      return { source: 'local-nlp-fallback', latencyMs, intent: 'switch_tab', parameters: { tab: 'candidates' }, confidence: 0.99, rawTranscript };
    }
    if (/^(requisitions|manage jobs|postings)$/i.test(rawKeyword)) {
      return { source: 'local-nlp-fallback', latencyMs, intent: 'switch_tab', parameters: { tab: 'requisitions' }, confidence: 0.99, rawTranscript };
    }
    if (/^(post job|create job|new job|add job)$/i.test(rawKeyword)) {
      return { source: 'local-nlp-fallback', latencyMs, intent: 'switch_tab', parameters: { tab: 'create_job' }, confidence: 0.99, rawTranscript };
    }

    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'search',
      parameters: { keyword: rawKeyword },
      confidence: 0.98,
      rawTranscript
    };
  }

  // "Read job" / "Read description"
  if (/read(\s*job|\s*description|\s*aloud|\s*it)?|speak|narrate/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'read',
      parameters: {},
      confidence: 0.98,
      rawTranscript
    };
  }

  // "Summarize" / "Simplify"
  if (/summarize|simplify|breakdown|ai summary|explain/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'summarize',
      parameters: {},
      confidence: 0.99,
      rawTranscript
    };
  }

  // "Apply now" / "Submit"
  if (/apply(\s*now)?|submit(\s*application)?|auto[\s-]?fill|one[\s-]?click/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'apply',
      parameters: {},
      confidence: 0.99,
      rawTranscript
    };
  }

  // "Next" / "Previous"
  if (/next|forward|down/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'navigate',
      parameters: { direction: 'next' },
      confidence: 0.97,
      rawTranscript
    };
  }

  if (/previous|back|up/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'navigate',
      parameters: { direction: 'previous' },
      confidence: 0.97,
      rawTranscript
    };
  }

  // "High contrast"
  if (/contrast|dark mode|light mode|theme/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'contrast',
      parameters: { setting: 'toggle' },
      confidence: 0.95,
      rawTranscript
    };
  }

  // "Help"
  if (/help|what can i say|commands/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'help',
      parameters: {},
      confidence: 0.99,
      rawTranscript
    };
  }

  return {
    source: 'local-nlp-fallback',
    latencyMs,
    intent: 'unknown',
    parameters: {},
    confidence: 0.4,
    rawTranscript
  };
}
