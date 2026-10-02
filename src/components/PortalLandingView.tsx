import React from 'react';
import { User, Briefcase, Mic, Sparkles, Send, Volume2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PortalLandingViewProps {
  onSelectRole: (role: 'job_seeker' | 'recruiter') => void;
  voiceActive: boolean;
  onActivateVoice: () => void;
  onPlayWelcomeAudio: () => void;
  isSpeaking: boolean;
}

export const PortalLandingView: React.FC<PortalLandingViewProps> = ({
  onSelectRole,
  voiceActive,
  onActivateVoice,
  onPlayWelcomeAudio,
  isSpeaking
}) => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-10 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>VOICE-CONTROLLED ACCESSIBLE JOB PORTAL</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight leading-tight">
          VoiceHire <span className="text-amber-400">AI</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
          Zero-barrier, voice-first job application gateway for applicants and inclusive recruiters.
          Navigate entirely hands-free using voice commands.
        </p>

        {/* Live Voice Status Indicator & Audio Welcome */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div
            onClick={onActivateVoice}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onActivateVoice();
              }
            }}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 border transition-all ${
              voiceActive
                ? 'bg-amber-400/15 text-amber-300 border-amber-400/40 shadow-lg shadow-amber-400/10 animate-pulse'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${voiceActive ? 'bg-amber-400 animate-ping' : 'bg-slate-500'}`} />
            <span>{voiceActive ? '🎙️ Voice Active: Say "Job Seeker" or "Recruiter"' : '🎙️ Turn On Voice'}</span>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-amber-400 border border-slate-800">
              Alt+M / V
            </kbd>
          </div>

          <button
            onClick={onPlayWelcomeAudio}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-sky-400" />
            <span>{isSpeaking ? 'Playing Audio Guide...' : 'Listen to Voice Instructions'}</span>
          </button>
        </div>
      </div>

      {/* Two Main Role Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
        {/* OPTION 1: JOB SEEKER */}
        <div
          tabIndex={0}
          role="button"
          aria-label="Enter Job Seeker Portal. Say 'Job Seeker' or press enter."
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
                Say: “Job Seeker”
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-5 group-hover:text-amber-400 transition-colors">
              Job Seeker Portal
            </h2>

            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Find accessible jobs, listen to postings aloud, simplify 1,000-word job descriptions with Gemini AI, and apply in 1 click using your stored profile.
            </p>

            <ul className="mt-5 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Voice search: <strong className="text-slate-100">“Search React”</strong>, <strong className="text-slate-100">“Search Remote”</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Audio narration & cognitive AI summary: <strong className="text-slate-100">“Read job”</strong>, <strong className="text-slate-100">“Summarize”</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-Click DOM Auto-Fill: <strong className="text-slate-100">“Apply now”</strong> or <strong className="text-slate-100">Alt+V</strong></span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-amber-400 font-bold text-sm">
            <span>Enter as Job Seeker</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>

        {/* OPTION 2: RECRUITER */}
        <div
          tabIndex={0}
          role="button"
          aria-label="Enter Recruiter Portal. Say 'Recruiter' or press enter."
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
              <div className="w-14 h-14 rounded-2xl bg-sky-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                Say: “Recruiter”
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-5 group-hover:text-sky-400 transition-colors">
              Recruiter Portal
            </h2>

            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Post accessible job requisitions with built-in accessibility verification, review candidate applications, inspect auto-fill match scores, and update statuses.
            </p>

            <ul className="mt-5 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Create accessible postings with zero digital barriers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Review auto-filled candidate profiles & ATS match ratings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Voice navigation: <strong className="text-slate-100">“Post job”</strong>, <strong className="text-slate-100">“Applications”</strong></span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-sky-400 font-bold text-sm">
            <span>Enter as Recruiter</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Voice Prompts & Quick Command Bar */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Mic className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Hands-free voice recognition is always running. Speak either command:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectRole('job_seeker')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 font-mono font-bold border border-slate-700"
          >
            Say: “Job Seeker”
          </button>
          <button
            onClick={() => onSelectRole('recruiter')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-400 font-mono font-bold border border-slate-700"
          >
            Say: “Recruiter”
          </button>
        </div>
      </div>
    </div>
  );
};
