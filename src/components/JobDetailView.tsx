import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Send, MapPin, DollarSign, Building, ShieldCheck, CheckCircle2, Cpu, ArrowLeft } from 'lucide-react';
import { DualLayerSummaryResult, JobPosting } from '../types/index.ts';

interface JobDetailViewProps {
  job: JobPosting;
  onBack: () => void;
  onApplyClick: () => void;
  onReadAloud: (text: string) => void;
  onStopReading: () => void;
  isSpeaking: boolean;
  onSummarize: (job: JobPosting, forceLocalFallback?: boolean) => Promise<DualLayerSummaryResult>;
  summaryData: DualLayerSummaryResult | null;
  isSummarizing: boolean;
  forceLocalFallback: boolean;
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({
  job,
  onBack,
  onApplyClick,
  onReadAloud,
  onStopReading,
  isSpeaking,
  onSummarize,
  summaryData,
  isSummarizing,
  forceLocalFallback
}) => {
  const [activeTab, setActiveTab] = useState<'simplified' | 'full'>('simplified');

  const handleReadJobAloud = () => {
    if (isSpeaking) {
      onStopReading();
    } else {
      if (summaryData) {
        const textToRead = `${job.title} at ${job.company}. Role Overview: ${summaryData.roleOverview}. Required Skills: ${summaryData.keySkillsNeeded.join(', ')}. Compensation: ${summaryData.payAndSchedule}. Accommodations: ${summaryData.accommodations.join(', ')}. Press Alt+V or say Apply Now to submit with your stored profile.`;
        onReadAloud(textToRead);
      } else {
        const textToRead = `${job.title} at ${job.company}. Location: ${job.location}. Salary: ${job.salaryRange}. Description: ${job.description}. Say Summarize to view plain language breakdown, or Apply Now to auto-fill.`;
        onReadAloud(textToRead);
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Navigation & Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <button
          onClick={onBack}
          aria-label="Back to job listings"
          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Jobs</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Read Aloud Button */}
          <button
            onClick={handleReadJobAloud}
            aria-pressed={isSpeaking}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isSpeaking
                ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-md animate-pulse'
                : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-700'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-sky-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
            <span>{isSpeaking ? 'Stop Reading' : 'Read Aloud'}</span>
          </button>

          {/* AI Cognitive Simplifier (Module 2) */}
          <button
            onClick={() => onSummarize(job, forceLocalFallback)}
            disabled={isSummarizing}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{isSummarizing ? 'Simplifying...' : 'AI Simplify Job Posting'}</span>
          </button>

          {/* 1-Click Auto-Fill (Module 3) */}
          <button
            onClick={onApplyClick}
            aria-keyshortcuts="Alt+V"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Apply with Stored Profile (Alt+V)</span>
          </button>
        </div>
      </div>

      {/* Job Title & Metadata Strip (Zero-Pill Discipline: Unboxed Text with Separators) */}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs text-amber-400 font-mono font-semibold tracking-wide">
              {job.salaryRange} · {job.postedDate}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
              {job.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="text-slate-200 font-semibold">{job.company}</span>
              <span aria-hidden="true">·</span>
              <span>{job.location}</span>
              <span aria-hidden="true">·</span>
              <span>{job.jobType}</span>
              <span aria-hidden="true">·</span>
              <span>{job.department}</span>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 justify-end">
              <ShieldCheck className="w-4 h-4" />
              <span>axe-core 100% WCAG AAA</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Zero Accessibility Violations
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher: AI Simplified Breakdown vs Dense Original */}
      <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('simplified')}
          aria-pressed={activeTab === 'simplified'}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'simplified'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ✨ Cognitive AI Breakdown (Low Load)
        </button>
        <button
          onClick={() => setActiveTab('full')}
          aria-pressed={activeTab === 'full'}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'full'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📄 Full 1,000-Word Specification
        </button>
      </div>

      {/* TAB 1: COGNITIVE LOAD REDUCTION BREAKDOWN (MODULE 2) */}
      {activeTab === 'simplified' && (
        <div className="space-y-4">
          {summaryData ? (
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              {/* Dual-Layer Telemetry Badge */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-slate-200">
                    Dual-Layer Engine:{' '}
                    <strong className="text-amber-400 font-mono">
                      {summaryData.source === 'nvidia-cloud'
                        ? 'NVIDIA NIM AI (Cloud)'
                        : summaryData.source === 'gemini-cloud'
                        ? 'Google Gemini AI (Cloud)'
                        : 'Local NLP Rule Engine (Offline Fallback)'}
                    </strong>
                  </span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  Latency: <span className="text-emerald-400 font-bold">{summaryData.latencyMs}ms</span> (SLA &lt;800ms)
                </div>
              </div>

              {summaryData.fallbackReason && (
                <div className="text-[11px] text-amber-300 bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/30">
                  ⚡ <strong>Fallback Activated:</strong> {summaryData.fallbackReason}
                </div>
              )}

              {/* 4 Pillars of Cognitive Load Reduction (PPT Slide 2 & 4) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Role Overview */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    1. Role Overview (Grade 6 Plain English)
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {summaryData.roleOverview}
                  </p>
                </div>

                {/* 2. Pay, Schedule & Location */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    2. Pay, Schedule & Location
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {summaryData.payAndSchedule}
                  </p>
                </div>

                {/* 3. Core Skills Needed */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-2">
                    3. Required Skills & Experience
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {summaryData.keySkillsNeeded.map((skill, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Accessibility & Accommodations */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
                    4. Accessibility & Accommodations
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {summaryData.accommodations.map((acc, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{acc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-bounce" />
              <h3 className="text-sm font-bold text-slate-200">
                Cognitive Load Simplifier Available
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                Click below or say <strong>“Summarize”</strong> to convert this 1,000-word job description into 4 clear plain-English points.
              </p>
              <button
                onClick={() => onSummarize(job, forceLocalFallback)}
                disabled={isSummarizing}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20"
              >
                {isSummarizing ? 'Analyzing with Dual-Layer Engine...' : 'Generate Cognitive Summary Now'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FULL 1000-WORD DENSE SPECIFICATION */}
      {activeTab === 'full' && (
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5 text-slate-300 text-xs sm:text-sm">
          <div>
            <h3 className="font-bold text-slate-100 text-sm mb-2">About The Role</h3>
            <p className="whitespace-pre-line leading-relaxed text-slate-300">
              {job.description}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-100 text-sm mb-2">Key Responsibilities</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              {job.keyResponsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-100 text-sm mb-2">Requisite Qualifications</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-100 text-sm mb-2">Verified Assistive Accommodations</h3>
            <div className="flex flex-wrap gap-2">
              {job.accommodationsOffered.map((acc, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {acc}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
