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
  const text = rawTranscript.trim().toLowerCase();
  const latencyMs = Math.max(1, Math.round(performance.now() - startTime));

  // Home / First page navigation
  if (/^(home|main\s*menu|start\s*page|first\s*page|back\s*to\s*home)$/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'navigate',
      parameters: { direction: 'home' as any },
      confidence: 0.99,
      rawTranscript
    };
  }

  // Role Switching: "Job seeker" or "Recruiter" (single words or full phrases)
  if (/^(recruiter|recruiter\s*mode|recruiter\s*portal|hiring)$/i.test(text) || /switch(\s*to)?\s*recruiter|i am a recruiter/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_role',
      parameters: { role: 'recruiter' },
      confidence: 0.99,
      rawTranscript
    };
  }

  if (/^(job\s*seeker|candidate|applicant|seeker|job\s*search)$/i.test(text) || /switch(\s*to)?\s*(job\s*seeker|candidate|applicant|seeker)|i am a job seeker/i.test(text)) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'switch_role',
      parameters: { role: 'job_seeker' },
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

  // Pattern matching based on Voice Commands Reference (PPT Slide 4)
  // "Search [keyword]"
  const searchMatch = text.match(/^(?:search|find|filter|look for|show)\s*(?:for\s*)?(.+)$/i);
  if (searchMatch) {
    return {
      source: 'local-nlp-fallback',
      latencyMs,
      intent: 'search',
      parameters: { keyword: searchMatch[1].trim() },
      confidence: 0.96,
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
