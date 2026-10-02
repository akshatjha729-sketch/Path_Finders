import React, { useState } from 'react';
import { Sparkles, Mic, Volume2, VolumeX, X, ArrowRight, CheckCircle2, Send, Briefcase, User, Search } from 'lucide-react';

interface VoiceAssistantGuideBannerProps {
  onDismiss: () => void;
  onExecuteCommand: (cmd: string) => void;
  onReplayGuideAudio: () => void;
  isSpeaking: boolean;
}

export const VoiceAssistantGuideBanner: React.FC<VoiceAssistantGuideBannerProps> = ({
  onDismiss,
  onExecuteCommand,
  onReplayGuideAudio,
  isSpeaking,
}) => {
  const quickChips = [
    { label: '“Search React”', cmd: 'search react', icon: <Search className="w-3 h-3 text-amber-400" /> },
    { label: '“Search Remote”', cmd: 'search remote', icon: <Search className="w-3 h-3 text-amber-400" /> },
    { label: '“Read job”', cmd: 'read job', icon: <Volume2 className="w-3 h-3 text-sky-400" /> },
    { label: '“Summarize”', cmd: 'summarize', icon: <Sparkles className="w-3 h-3 text-purple-400" /> },
    { label: '“Apply now” (Alt+V)', cmd: 'apply now', icon: <Send className="w-3 h-3 text-emerald-400" /> },
    { label: '“Switch to Recruiter”', cmd: 'switch to recruiter', icon: <Briefcase className="w-3 h-3 text-amber-400" /> },
    { label: '“Switch to Job Seeker”', cmd: 'switch to job seeker', icon: <User className="w-3 h-3 text-sky-400" /> },
  ];

  return (
    <div
      role="region"
      aria-label="AI Voice Assistant Helping Guide"
      className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-purple-500/10 border border-amber-400/40 shadow-xl space-y-4 transition-all"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20 animate-pulse">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-100 tracking-tight">
                AI Voice Assistant Guide & Command Navigator
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                Listening Active
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Speak naturally at any time. Here is how to search jobs, control the interface, and switch portals:
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReplayGuideAudio}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isSpeaking
                ? 'bg-sky-500/20 text-sky-300 border-sky-400'
                : 'bg-slate-950 text-slate-200 border-slate-700 hover:border-slate-500'
            }`}
            title="Listen to voice guide narration"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-sky-400" /> : <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
            <span>{isSpeaking ? 'Playing Voice Guide...' : 'Replay Guide Audio'}</span>
          </button>

          <button
            onClick={onDismiss}
            aria-label="Dismiss AI Voice Guide"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Clear Step-by-Step Voice Guide Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Step 1 */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <span className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center text-[10px]">1</span>
            <span>How to Search Jobs</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            Say <strong className="text-amber-400 font-mono">“Search React”</strong> or <strong className="text-amber-400 font-mono">“Search Remote”</strong> to instantly filter the requisition board.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-sky-400 font-bold">
            <span className="w-4 h-4 rounded-full bg-sky-400/20 flex items-center justify-center text-[10px]">2</span>
            <span>How to Listen & Simplify</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            Say <strong className="text-sky-400 font-mono">“Read job”</strong> to listen aloud, or <strong className="text-purple-400 font-mono">“Summarize”</strong> for the 4-part low-cognitive breakdown.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center text-[10px]">3</span>
            <span>1-Click Auto-Fill (Alt+V)</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            Say <strong className="text-emerald-400 font-mono">“Apply now”</strong> or press <strong className="text-emerald-400 font-mono">Alt+V</strong> to inject your stored profile into the application form.
          </p>
        </div>

        {/* Step 4 */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-purple-400 font-bold">
            <span className="w-4 h-4 rounded-full bg-purple-400/20 flex items-center justify-center text-[10px]">4</span>
            <span>Switch Role Portals</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            Say <strong className="text-amber-400 font-mono">“Switch to Recruiter”</strong> or <strong className="text-sky-400 font-mono">“Switch to Job Seeker”</strong> to switch accounts hands-free.
          </p>
        </div>
      </div>

      {/* Quick Test Chips */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400 block mb-2">
          Click any sample command below to test speech execution immediately:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onExecuteCommand(chip.cmd)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-400 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {chip.icon}
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
