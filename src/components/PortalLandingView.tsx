import React from 'react';
import { User, Briefcase, Mic, Sparkles, Volume2, ArrowRight, CheckCircle2, Radio } from 'lucide-react';
import { t } from '../utils/i18n.ts';

interface PortalLandingViewProps {
  onSelectRole: (role: 'job_seeker' | 'recruiter') => void;
  voiceActive: boolean;
  onActivateVoice: () => void;
  onPlayWelcomeAudio: () => void;
  isSpeaking: boolean;
  lastTranscript?: string;
  interimTranscript?: string;
  onExecuteCommand?: (cmd: string) => void;
}

export const PortalLandingView: React.FC<PortalLandingViewProps> = ({
  onSelectRole,
  voiceActive,
  onActivateVoice,
  onPlayWelcomeAudio,
  isSpeaking,
  lastTranscript = '',
  interimTranscript = '',
  onExecuteCommand
}) => {
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('tagline')}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight leading-tight">
          VoiceHire <span className="text-amber-400">AI</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
          {t('landingSubtitle')}
        </p>

        {/* Live Voice Status Indicator & Audio Welcome */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onActivateVoice}
            aria-pressed={voiceActive}
            aria-label={voiceActive ? "Turn off Voice Assistant" : "Turn on Voice Assistant (Shortcut: Alt+M or press V)"}
            className={`cursor-pointer px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 border transition-all ${
              voiceActive
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/20 animate-pulse'
                : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-amber-400 hover:text-white'
            }`}
          >
            <Mic className={`w-4 h-4 ${voiceActive ? 'text-slate-950 animate-bounce' : 'text-amber-400'}`} />
            <span>{voiceActive ? `🎙️ Listening... (Say a command)` : `🎙️ Click to Start Voice Assistant`}</span>
            <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
              voiceActive ? 'bg-amber-500 text-slate-950 border border-amber-600' : 'bg-slate-950 text-amber-400 border border-slate-800'
            }`}>
              Alt+M / V
            </kbd>
          </button>

          <button
            onClick={onPlayWelcomeAudio}
            className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-sky-400" />
            <span>{isSpeaking ? 'Playing Audio Guide...' : 'Listen to Instructions'}</span>
          </button>
        </div>

        {/* Live Voice Transcript Feedback Box */}
        <div className="max-w-xl mx-auto mt-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left shadow-lg">
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className={`w-3.5 h-3.5 ${voiceActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="font-semibold text-slate-300">
                {voiceActive ? 'Live Voice Recognition Active · English (en-US)' : 'Mic Paused · Click button above or press V / Alt+M'}
              </span>
            </div>
            {voiceActive && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="w-1.5 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-1.5 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
              </span>
            )}
          </div>

          <div className="pt-2 text-xs flex items-center justify-between gap-2">
            <div className="truncate">
              <span className="text-slate-400 mr-1.5">Voice Heard:</span>
              {interimTranscript ? (
                <span className="text-amber-300 font-mono italic animate-pulse">“{interimTranscript}...”</span>
              ) : lastTranscript ? (
                <span className="text-emerald-300 font-mono font-semibold">“{lastTranscript}”</span>
              ) : (
                <span className="text-slate-400 italic">
                  Say: "Job Seeker", "Recruiter", "Jobs in India", or "Jobs in USA"
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Clickable Voice Commands Carousel */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-medium">Try saying (or click to run):</span>
          <button
            onClick={() => onExecuteCommand ? onExecuteCommand('job seeker') : onSelectRole('job_seeker')}
            className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 hover:border-amber-400 font-mono transition-colors"
          >
            🎤 “Job Seeker”
          </button>
          <button
            onClick={() => onExecuteCommand ? onExecuteCommand('recruiter') : onSelectRole('recruiter')}
            className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-sky-300 hover:border-sky-400 font-mono transition-colors"
          >
            🎤 “Recruiter”
          </button>
          <button
            onClick={() => onExecuteCommand ? onExecuteCommand('jobs in india') : onSelectRole('job_seeker')}
            className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 hover:border-emerald-400 font-mono transition-colors"
          >
            🇮🇳 “Jobs in India”
          </button>
          <button
            onClick={() => onExecuteCommand ? onExecuteCommand('jobs in usa') : onSelectRole('job_seeker')}
            className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-600 font-mono transition-colors"
          >
            🇺🇸 “Jobs in USA”
          </button>
          <button
            onClick={() => onExecuteCommand ? onExecuteCommand('high contrast') : null}
            className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-purple-300 hover:border-purple-400 font-mono transition-colors"
          >
            ⚡ “High Contrast”
          </button>
        </div>
      </div>

      {/* Two Main Role Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-2">
        {/* OPTION 1: JOB SEEKER */}
        <div
          tabIndex={0}
          role="button"
          aria-label={`${t('jobSeeker')}. ${t('sayJobSeeker')}`}
          onClick={() => onSelectRole('job_seeker')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectRole('job_seeker');
            }
          }}
          className="group relative p-8 rounded-3xl bg-slate-900/90 border-2 border-slate-800 hover:border-amber-400 focus-visible:border-amber-400 focus-visible:ring-4 focus-visible:ring-amber-400/40 transition-all cursor-pointer shadow-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform">
                <User className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30">
                {t('sayJobSeeker')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-5 group-hover:text-amber-400 transition-colors">
              {t('jobSeeker')} Portal
            </h2>

            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {t('jobSeekerDesc')}
            </p>

            <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Search & Filter: <strong className="text-slate-100 font-mono">“Jobs in India”</strong>, <strong className="text-slate-100 font-mono">“Search React”</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Audio narration & AI summary: <strong className="text-slate-100 font-mono">“Read job”</strong>, <strong className="text-slate-100 font-mono">“Summarize”</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-Click DOM Auto-Fill: <strong className="text-slate-100 font-mono">“Apply now”</strong> or <strong className="text-slate-100 font-mono">Alt+V</strong></span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-amber-400 font-bold text-sm">
            <span>{t('jobSeeker')} &rarr;</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>

        {/* OPTION 2: RECRUITER */}
        <div
          tabIndex={0}
          role="button"
          aria-label={`${t('recruiter')}. ${t('sayRecruiter')}`}
          onClick={() => onSelectRole('recruiter')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectRole('recruiter');
            }
          }}
          className="group relative p-8 rounded-3xl bg-slate-900/90 border-2 border-slate-800 hover:border-amber-400 focus-visible:border-amber-400 focus-visible:ring-4 focus-visible:ring-amber-400/40 transition-all cursor-pointer shadow-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-sky-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-sky-400/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-sky-400/10 text-sky-400 border border-sky-400/30">
                {t('sayRecruiter')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-5 group-hover:text-amber-400 transition-colors">
              {t('recruiter')} Dashboard
            </h2>

            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {t('recruiterDesc')}
            </p>

            <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Voice portal navigation: <strong className="text-slate-100 font-mono">“Candidates”</strong>, <strong className="text-slate-100 font-mono">“Requisitions”</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Publish inclusive openings: <strong className="text-slate-100 font-mono">“Post a job”</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Switch portals hands-free: <strong className="text-slate-100 font-mono">“Switch to Job Seeker”</strong></span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-sky-400 font-bold text-sm">
            <span>{t('recruiter')} &rarr;</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
