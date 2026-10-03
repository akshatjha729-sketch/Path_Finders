import { DualLayerSummaryResult, VoiceCommandParseResult } from '../types/index.ts';
import { localNlpParseVoiceCommand, localNlpSummarizeJob } from './ruleEngine.ts';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const NVIDIA_CHAT_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_MODEL = 'meta/llama-3.2-11b-vision-instruct';

// In-memory cache for instant (<2ms) repeated query performance
const summaryCache = new Map<string, DualLayerSummaryResult>();

/**
 * Safely parse JSON from raw LLM responses (stripping markdown fences if present)
 */
function parseJsonFromText(rawText: string): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  return JSON.parse(cleaned);
}

/**
 * Executes a call to the NVIDIA NIM Cloud Inference API with a strict SLA timeout
 */
async function callNvidiaChat(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  timeoutMs: number = 3000
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(NVIDIA_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages,
        temperature: 0.1,
        max_tokens: 500,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`NVIDIA API HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('NVIDIA API returned empty message content');
    }

    return content;
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Module 1 & 2: Cognitive Load Reduction via NVIDIA AI Summarization
 * with Dual-Layer Fallback Architecture
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

  // Fallback to local rule engine if explicitly requested or API key missing
  if (forceLocalFallback || !NVIDIA_API_KEY) {
    const localResult = localNlpSummarizeJob(jobTitle, description, salary, location, requirements, startTime);
    summaryCache.set(cacheKey, localResult);
    return localResult;
  }

  const systemPrompt = `You are VoiceHire AI's cognitive load reduction engine for disabled job seekers.
Extract accessible, low-cognitive-load job summaries.
Respond ONLY with a valid JSON object matching this schema:
{
  "roleOverview": "2 simple sentences in plain Grade 6 English describing the day-to-day job",
  "keySkillsNeeded": ["skill 1", "skill 2", "skill 3", "skill 4"],
  "payAndSchedule": "compensation, remote/hybrid status, and hours/flexibility",
  "accommodations": ["assistive accommodations offered such as screen reader verified, flexible hours, etc."]
}`;

  const userPrompt = `Job Title: ${jobTitle}
Location: ${location}
Salary: ${salary}
Description:
${description}

Requirements:
${requirements.join('\n')}`;

  try {
    const responseContent = await callNvidiaChat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      6000 // 6s SLA timeout
    );

    const parsed = parseJsonFromText(responseContent);
    const latencyMs = Math.round(performance.now() - startTime);

    const result: DualLayerSummaryResult = {
      source: 'nvidia-cloud',
      latencyMs,
      roleOverview: parsed.roleOverview || `${jobTitle} position at ${location}.`,
      keySkillsNeeded: Array.isArray(parsed.keySkillsNeeded) ? parsed.keySkillsNeeded : requirements.slice(0, 4),
      payAndSchedule: parsed.payAndSchedule || salary,
      accommodations: Array.isArray(parsed.accommodations) ? parsed.accommodations : ['Screen reader verified', 'Flexible hours'],
    };

    summaryCache.set(cacheKey, result);
    return result;
  } catch (error: any) {
    const fallback = localNlpSummarizeJob(jobTitle, description, salary, location, requirements, startTime);
    fallback.fallbackReason = error?.name === 'AbortError'
      ? 'SLA threshold reached. Instant local NLP rule engine triggered.'
      : `NVIDIA Cloud API fallback: ${error?.message || 'Local rule engine activated'}`;
    summaryCache.set(cacheKey, fallback);
    return fallback;
  }
}

/**
 * Natural Language Spoken Command Classification via NVIDIA AI
 * with Dual-Layer Fallback Architecture
 */
export async function parseVoiceCommandWithDualLayer(
  rawTranscript: string,
  forceLocalFallback: boolean = false
): Promise<VoiceCommandParseResult> {
  const startTime = performance.now();

  // Instant local rule check for standard command phrases (<2ms)
  const quickResult = localNlpParseVoiceCommand(rawTranscript, startTime);
  if (quickResult.intent !== 'unknown') {
    return quickResult;
  }

  if (forceLocalFallback || !NVIDIA_API_KEY) {
    return quickResult;
  }

  const systemPrompt = `You classify spoken speech transcripts for an accessible job portal.
IMPORTANT RULES:
1. If the user mentions a tab name ('jobs', 'job board', 'profile', 'applications', 'my applications', 'candidates', 'requisitions', 'create job', 'post job', 'tab 1', 'tab 2', 'tab 3'), intent MUST be "switch_tab". Set "tab" to the tab identifier ('jobs', 'profile', 'applications', 'candidates', 'requisitions', or 'create_job'). NEVER classify tab names as "search", and DO NOT put tab names into "keyword".
2. If the user wants to search (e.g. 'search react', 'find python', 'search remote jobs'), intent is "search", and "keyword" must ONLY be the search query (e.g. 'react', 'python', 'remote').
3. If the user says 'apply now', 'apply', 'submit', 'submit application', intent is "apply".

Respond ONLY with a valid JSON object matching this schema:
{
  "intent": "switch_tab" | "switch_role" | "search" | "read" | "summarize" | "apply" | "navigate" | "contrast" | "help" | "unknown",
  "tab": "jobs" | "profile" | "applications" | "candidates" | "requisitions" | "create_job" or null,
  "role": "job_seeker" | "recruiter" or null,
  "keyword": "search keywords if intent is search or null",
  "direction": "next" | "previous" | "home" or null,
  "confidence": number between 0 and 1
}`;

  try {
    const responseContent = await callNvidiaChat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: rawTranscript },
      ],
      5000 // 5s SLA timeout
    );

    const parsed = parseJsonFromText(responseContent);
    const latencyMs = Math.round(performance.now() - startTime);

    return {
      source: 'nvidia-cloud',
      latencyMs,
      intent: parsed.intent || 'unknown',
      parameters: {
        keyword: parsed.keyword || undefined,
        direction: parsed.direction || undefined,
        tab: parsed.tab || undefined,
        role: parsed.role || undefined,
      },
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
      rawTranscript,
    };
  } catch (err) {
    return localNlpParseVoiceCommand(rawTranscript, startTime);
  }
}
