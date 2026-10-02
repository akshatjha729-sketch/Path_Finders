import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Eye, BookOpen, User, Briefcase, Activity, ShieldCheck, FileText } from 'lucide-react';
import { UserRole } from '../types/index.ts';

interface AccessibilityToolbarProps {
  currentView: 'landing' | 'job_seeker' | 'recruiter';
  onGoHome: () => void;
  role: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  fontSizeZoom: number;
  onChangeFontSize: (delta: number) => void;
  voiceActive: boolean;
  voiceStatus: 'idle' | 'listening' | 'speaking' | 'unsupported';
  onToggleVoice: () => void;
  onOpenVoiceModal: () => void;
  ariaAnnouncement: string;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  currentView,
  onGoHome,
  role,
  onRoleChange,
  highContrast,
  onToggleHighContrast,
  fontSizeZoom,
  onChangeFontSize,
  voiceActive,
  voiceStatus,
  onToggleVoice,
  onOpenVoiceModal,
  ariaAnnouncement
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 py-2.5 transition-colors">
      {/* Invisible Screen Reader ARIA Live Region (WCAG 2.1 AAA SC 4.1.3) */}
      <div
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="aria-live-polite"
      >
        {ariaAnnouncement}
      </div>

      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Team Details from PPT */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGoHome}
            aria-label="VoiceHire AI Home - Return to portal selection"
            className="flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-0.5"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-base shadow-sm">
              VH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-100">
                  VoiceHire AI
                </span>
                <span className="text-xs text-amber-400 font-mono tracking-wider font-semibold">
                  PS003
                </span>
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5">
                <span>Accessible Job Application Assistant</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300 font-medium">Team Path_Finders</span>
              </div>
            </div>
          </button>
        </div>

        {/* Accessibility & Voice Control Island */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Voice Assistant Toggle (Module 1 & 4) */}
          <button
            onClick={onToggleVoice}
            aria-pressed={voiceActive}
            aria-label={voiceActive ? "Turn off Voice Assistant (Shortcut: Alt+M or press V)" : "Turn on Voice Assistant (Shortcut: Alt+M or press V)"}
            title="Toggle Voice Listening (Shortcut: Alt+M or press 'V')"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
              voiceActive
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20 animate-pulse'
                : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-amber-400'
            }`}
          >
            {voiceActive ? <Mic className="w-3.5 h-3.5 text-slate-950" /> : <MicOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>{voiceActive ? (voiceStatus === 'listening' ? 'Listening...' : 'Voice On') : 'Turn On Voice'}</span>
            <kbd className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${
              voiceActive ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              Alt+M / V
            </kbd>
          </button>

          {/* Voice Commands Cheat Sheet */}
          <button
            onClick={onOpenVoiceModal}
            aria-label="View Voice Commands Reference"
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-600 flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Voice Commands</span>
          </button>

          {/* High Contrast Mode Toggle (WCAG AAA) */}
          <button
            onClick={onToggleHighContrast}
            aria-pressed={highContrast}
            aria-label={`Toggle High Contrast Mode (Current: ${highContrast ? 'On' : 'Off'})`}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors ${
              highContrast
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>High Contrast</span>
          </button>

          {/* Font Size Zoom Controls (A- / 110% / A+) */}
          <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5 text-xs">
            <button
              onClick={() => onChangeFontSize(-5)}
              aria-label="Decrease Font Size"
              className="px-2 py-1 text-slate-300 hover:text-white rounded hover:bg-slate-800 font-bold"
            >
              A-
            </button>
            <span className="px-1.5 text-[11px] text-amber-400 font-mono font-semibold" aria-label={`Current font scale ${fontSizeZoom}%`}>
              {fontSizeZoom}%
            </span>
            <button
              onClick={() => onChangeFontSize(5)}
              aria-label="Increase Font Size"
              className="px-2 py-1 text-slate-300 hover:text-white rounded hover:bg-slate-800 font-bold"
            >
              A+
            </button>
          </div>

          {/* Role & View Switcher (First Page / Job Seeker / Recruiter) */}
          <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5" role="group" aria-label="Portal Selection">
            <button
              onClick={onGoHome}
              aria-pressed={currentView === 'landing'}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'landing'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Home</span>
            </button>
            <button
              onClick={() => onRoleChange('job_seeker')}
              aria-pressed={currentView === 'job_seeker'}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'job_seeker'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Job Seeker</span>
            </button>
            <button
              onClick={() => onRoleChange('recruiter')}
              aria-pressed={currentView === 'recruiter'}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'recruiter'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3 h-3" />
              <span>Recruiter</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
