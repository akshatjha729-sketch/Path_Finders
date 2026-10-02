import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { DualLayerSummaryResult, VoiceCommandParseResult } from '../types/index.ts';
import { localNlpParseVoiceCommand, localNlpSummarizeJob } from './ruleEngine.ts';

const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory LRU-style cache for ultra-fast instant responses (<2ms)
const summaryCache = new Map<string, DualLayerSummaryResult>();

/**
 * Module 1 & 2: Cognitive Load Reduction via Gemini AI Summarization
 * with Dual-Layer Fallback Architecture (PPT Slides 2, 3, 4)
 * High-speed performance with ThinkingLevel.LOW and instant cache
 */
export async function summarizeJobWithDualLayer(
  jobTitle: string,
  description: string,
  salary: string,
  location: string,
  requirements: string[],
  forceLocalFallback: boolean = false
): Promise<DualLayerSummaryResult> {
  const startTime = performance.now();
  const cacheKey = `${jobTitle}__${salary}__${location}`.toLowerCase();

  // Instant Cache Check
  if (!forceLocalFallback && summaryCache.has(cacheKey)) {
    const cached = summaryCache.get(cacheKey)!;
    return {
      ...cached,
      latencyMs: Math.max(1, Math.round(performance.now() - startTime)),
    };
  }

  // If user or network forced offline / local fallback
  if (forceLocalFallback || !ai) {
    const localResult = localNlpSummarizeJob(jobTitle, description, salary, location, requirements, startTime);
    summaryCache.set(cacheKey, localResult);
    return localResult;
  }

  const prompt = `You are VoiceHire AI's cognitive load reduction engine for disabled job seekers (PS003).
Transform this dense job posting into 4 crystal-clear, plain-English sections to eliminate cognitive fatigue:
1. roleOverview: 2 simple sentences explaining what the job does in everyday plain English (Grade 6 reading level).
2. keySkillsNeeded: Array of 3 to 5 core hard/soft skills required.
3. payAndSchedule: Exact compensation, remote/hybrid status, and hours/flexibility.
4. accommodations: Key assistive accommodations available (screen reader support, hardware stipend, async comms).

Job Title: ${jobTitle}
Location: ${location}
Salary: ${salary}
Description:
${description}

Requirements:
${requirements.join('\n')}`;

  try {
    // 600ms SLA promise race for lightning-fast zero-lag experience
    const geminiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction: 'You extract accessible, low-cognitive-load job summaries in strict JSON format.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roleOverview: { type: Type.STRING },
            keySkillsNeeded: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            payAndSchedule: { type: Type.STRING },
            accommodations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['roleOverview', 'keySkillsNeeded', 'payAndSchedule', 'accommodations'],
        },
      },
    });

    const timeoutPromise = new Promise<'TIMEOUT'>((resolve) => {
      setTimeout(() => resolve('TIMEOUT'), 650);
    });

    const raceResult = await Promise.race([geminiPromise, timeoutPromise]);

    if (raceResult === 'TIMEOUT') {
      const fallback = localNlpSummarizeJob(jobTitle, description, salary, location, requirements, startTime);
      fallback.fallbackReason = 'SLA threshold reached. Instant local NLP rule engine triggered.';
      summaryCache.set(cacheKey, fallback);
      return fallback;
    }

    const responseText = raceResult.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(responseText);
    const latencyMs = Math.round(performance.now() - startTime);

    const result: DualLayerSummaryResult = {
      source: 'gemini-cloud',
      latencyMs,
      roleOverview: parsed.roleOverview || `${jobTitle} position at ${location}.`,
      keySkillsNeeded: parsed.keySkillsNeeded || requirements.slice(0, 4),
      payAndSchedule: parsed.payAndSchedule || salary,
      accommodations: parsed.accommodations || ['Screen reader verified', 'Flexible hours'],
    };

    summaryCache.set(cacheKey, result);
    return result;
  } catch (error) {
    const fallback = localNlpSummarizeJob(jobTitle, description, salary, location, requirements, startTime);
    fallback.fallbackReason = 'Cloud API unreachable or error. Instant local rule engine activated.';
    summaryCache.set(cacheKey, fallback);
    return fallback;
  }
}

/**
 * Natural Language Voice Command Parsing with Dual-Layer Fallback
 */
export async function parseVoiceCommandWithDualLayer(
  rawTranscript: string,
  forceLocalFallback: boolean = false
): Promise<VoiceCommandParseResult> {
  const startTime = performance.now();

  if (forceLocalFallback || !ai) {
    return localNlpParseVoiceCommand(rawTranscript, startTime);
  }

  // Quick check: if it's a simple recognized phrase, local parser runs in <2ms
  const quickResult = localNlpParseVoiceCommand(rawTranscript, startTime);
  if (quickResult.intent !== 'unknown') {
    return quickResult;
  }

  const prompt = `Classify this spoken speech transcript for an accessible job portal:
"${rawTranscript}"

Intent must be one of:
- "search": looking for jobs, skills, or roles (extract parameter "keyword")
- "read": requesting TTS narration of current job
- "summarize": asking to simplify or summarize the job posting
- "apply": asking to apply or auto-fill form
- "navigate": next/previous job navigation (direction: "next" | "previous")
- "contrast": toggling high contrast or theme
- "help": asking for voice command assistance
- "unknown": unrecognized`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: {
              type: Type.STRING,
              description: 'One of: search, read, summarize, apply, navigate, contrast, help, unknown',
            },
            keyword: { type: Type.STRING },
            direction: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
          },
          required: ['intent', 'confidence'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const latencyMs = Math.round(performance.now() - startTime);

    return {
      source: 'gemini-cloud',
      latencyMs,
      intent: parsed.intent || 'unknown',
      parameters: {
        keyword: parsed.keyword,
        direction: parsed.direction as any,
      },
      confidence: parsed.confidence || 0.85,
      rawTranscript,
    };
  } catch (err) {
    return localNlpParseVoiceCommand(rawTranscript, startTime);
  }
}
