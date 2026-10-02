import React, { useState } from 'react';
import {
  X,
  Mic,
  Volume2,
  Sparkles,
  Send,
  ArrowRight,
  Eye,
  ShieldAlert,
  Cpu,
  History,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Edit2,
  Check,
  Trash2,
  Briefcase,
  Compass
} from 'lucide-react';
import { VoiceInteraction } from '../types/index.ts';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceActive: boolean;
  onToggleVoice: () => void;
  voiceStatus: 'idle' | 'listening' | 'speaking' | 'unsupported';
  lastSpokenTranscript: string;
  forceLocalFallback: boolean;
  onToggleForceFallback: () => void;
  recentInteractions: VoiceInteraction[];
  onExecuteCommand: (commandText: string) => void;
  onCorrectInteraction: (id: string, newText: string) => void;
  onClearRecentCommands: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  voiceActive,
  onToggleVoice,
  voiceStatus,
  lastSpokenTranscript,
  forceLocalFallback,
  onToggleForceFallback,
  recentInteractions,
  onExecuteCommand,
  onCorrectInteraction,
  onClearRecentCommands
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [activePanelTab, setActivePanelTab] = useState<'reference' | 'recent'>('reference');

  if (!isOpen) return null;

  const commands = [
    {
      phrase: '“Search [Keyword]”',
      purpose: 'Filters listings instantly',
      example: '“Search React”, “Search Remote”, “Search Accessibility”',
      icon: <Mic className="w-4 h-4 text-amber-400" />
    },
    {
      phrase: '“Read job”',
      purpose: 'Reads selected job details aloud via SpeechSynthesis',
      example: '“Read job”, “Read description”, “Narrate”',
      icon: <Volume2 className="w-4 h-4 text-sky-400" />
    },
    {
      phrase: '“Summarize”',
      purpose: 'Triggers Cognitive Load Simplifier (Gemini AI + Local Fallback)',
      example: '“Summarize”, “Simplify”, “Explain in simple words”',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />
    },
    {
      phrase: '“Apply now” / Alt+V',
      purpose: '1-Click DOM Form Auto-Fill Engine (85% faster submission)',
      example: '“Apply now”, “Submit application”, or press Alt+V',
      icon: <Send className="w-4 h-4 text-emerald-400" />
    },
    {
      phrase: '“Next” / “Previous”',
      purpose: 'Navigates through available job listings',
      example: '“Next job”, “Previous”, “Go down”',
      icon: <ArrowRight className="w-4 h-4 text-slate-300" />
    },
    {
      phrase: '“High contrast”',
      purpose: 'Toggles WCAG 2.1 AAA high-contrast visual theme',
      example: '“High contrast”, “Toggle contrast”',
      icon: <Eye className="w-4 h-4 text-amber-300" />
    },
    {
      phrase: '“Jobs” / “Profile” / “Applications”',
      purpose: 'Fast tab navigation by spoken name in Job Seeker portal',
      example: '“Jobs”, “Profile”, “My Applications”',
      icon: <Compass className="w-4 h-4 text-amber-400" />
    },
    {
      phrase: '“Candidates” / “Requisitions” / “Post a job”',
      purpose: 'Fast tab navigation by spoken name in Recruiter portal',
      example: '“Candidates”, “Requisitions”, “Post a job”',
      icon: <Briefcase className="w-4 h-4 text-emerald-400" />
    },
    {
      phrase: 'Alt+M / V (Keyboard)',
      purpose: 'Toggle Voice Assistant on or off with keyboard hotkey',
      example: 'Press Alt+M or press "V" to start/stop listening',
      icon: <Mic className="w-4 h-4 text-amber-400" />
    },
    {
      phrase: '“Switch to Recruiter” / “Job Seeker”',
      purpose: 'Hands-free voice portal role switching',
      example: '“Switch to recruiter”, “Switch to job seeker”',
      icon: <Briefcase className="w-4 h-4 text-amber-400" />
    }
  ];

  const handleStartEditing = (item: VoiceInteraction) => {
    setEditingId(item.id);
    setEditText(item.rawTranscript);
  };

  const handleSaveCorrection = (id: string) => {
    if (editText.trim()) {
      onCorrectInteraction(id, editText.trim());
      onExecuteCommand(editText.trim());
    }
    setEditingId(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 id="voice-modal-title" className="text-lg font-bold text-slate-100">
                  Voice Assistant & Interaction Center
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 font-semibold">
                  W3C Web Speech API
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Voice command reference, live microphone controls, and recent interactions review.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close voice assistant dialog"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Mic Status Bar */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                voiceActive
                  ? voiceStatus === 'listening'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-emerald-400'
                  : 'bg-slate-600'
              }`}
            />
            <div>
              <div className="text-xs font-semibold text-slate-200">
                Voice Engine Status:{' '}
                {voiceActive
                  ? voiceStatus === 'listening'
                    ? 'Listening for command...'
                    : 'Active'
                  : 'Turned Off'}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {lastSpokenTranscript ? `Last heard: "${lastSpokenTranscript}"` : 'Speak any phrase or review recent speech below'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleVoice}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                voiceActive
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-amber-400 text-slate-950 font-bold hover:bg-amber-300'
              }`}
            >
              {voiceActive ? 'Stop Listening' : 'Activate Microphone'}
            </button>
          </div>
        </div>

        {/* Mobile & Small Screen Tab Switcher */}
        <div className="mt-4 flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePanelTab('reference')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activePanelTab === 'reference'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Voice Commands Reference
            </button>
            <button
              onClick={() => setActivePanelTab('recent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activePanelTab === 'recent'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Recent Voice Commands ({recentInteractions.length})</span>
            </button>
          </div>

          {activePanelTab === 'recent' && recentInteractions.length > 0 && (
            <button
              onClick={onClearRecentCommands}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 px-2 py-1 rounded"
              title="Clear voice history"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Content Layout */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* ========================================================================= */}
          {/* COLUMN 1: VOICE COMMANDS REFERENCE (PPT SLIDE 4)                          */}
          {/* ========================================================================= */}
          <div className={`space-y-3 ${activePanelTab === 'reference' ? 'block md:col-span-6' : 'hidden md:block md:col-span-6'}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span className="font-semibold text-slate-300">Supported Spoken Phrases:</span>
              <span className="font-mono text-amber-400 text-[11px]">Alt+V / Voice</span>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {commands.map((cmd, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 flex items-start gap-2.5 transition-colors"
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                    {cmd.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-amber-400 text-xs font-mono tracking-tight truncate">
                        {cmd.phrase}
                      </span>
                      <button
                        onClick={() => {
                          const cleanPhrase = cmd.example.split(',')[0].replace(/[“"”]/g, '').trim();
                          onExecuteCommand(cleanPhrase);
                        }}
                        className="text-[10px] text-slate-400 hover:text-amber-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 shrink-0"
                        title="Simulate speaking this command"
                      >
                        Try It
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {cmd.purpose}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      Say: <span className="text-slate-300">{cmd.example}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dual-Layer SLA Testing Toggle */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="font-semibold text-slate-200">Dual-Layer Fallback SLA</span>
                  <p className="text-[10px] text-slate-400">
                    Simulate offline network or latency &gt;800ms
                  </p>
                </div>
              </div>
              <button
                onClick={onToggleForceFallback}
                aria-pressed={forceLocalFallback}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors ${
                  forceLocalFallback
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {forceLocalFallback ? 'Forced Local (<5ms)' : 'Cloud AI Default'}
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUMN 2: RECENT VOICE COMMANDS (SIDE-PANEL / LIST VIEW)                   */}
          {/* Allows users to review last 5 interactions for clarity and correction     */}
          {/* ========================================================================= */}
          <div className={`space-y-3 ${activePanelTab === 'recent' ? 'block md:col-span-6' : 'hidden md:block md:col-span-6'}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>Recent Voice Commands (Review & Correct)</span>
              </div>
              <span className="text-[11px] text-slate-500">Last {recentInteractions.length} commands</span>
            </div>

            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {recentInteractions.length === 0 ? (
                <div className="p-6 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-xs space-y-1">
                  <Mic className="w-6 h-6 text-slate-600 mx-auto mb-1" />
                  <p className="font-semibold text-slate-300">No voice interactions recorded yet</p>
                  <p className="text-[11px] text-slate-500">
                    Click &quot;Activate Microphone&quot; above and speak a command, or click &quot;Try It&quot; from the reference list.
                  </p>
                </div>
              ) : (
                recentInteractions.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all text-xs ${
                      item.status === 'corrected'
                        ? 'bg-slate-950 border-purple-500/40'
                        : item.confidence < 0.6
                        ? 'bg-slate-950 border-amber-500/40'
                        : 'bg-slate-950/90 border-slate-800'
                    }`}
                  >
                    {editingId === item.id ? (
                      /* Inline Correction Form */
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor={`edit-cmd-${item.id}`} className="text-[11px] font-bold text-amber-400">
                            Correct Misheard Transcript:
                          </label>
                          <span className="text-[10px] text-slate-500">Fix words & re-execute</span>
                        </div>
                        <input
                          id={`edit-cmd-${item.id}`}
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-amber-400 text-slate-100 text-xs font-mono focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveCorrection(item.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveCorrection(item.id)}
                            className="px-3 py-1 rounded bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3 h-3" />
                            <span>Save & Run</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Regular Interaction Display */
                      <div>
                        {/* What was heard */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-slate-500 text-[10px] block">Spoken Input:</span>
                            <span className="font-mono text-slate-100 font-semibold text-xs">
                              &ldquo;{item.rawTranscript}&rdquo;
                            </span>
                          </div>

                          {/* Clarity Indicator */}
                          <div className="shrink-0 text-right">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                item.confidence >= 0.85
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : item.confidence >= 0.6
                                  ? 'bg-sky-500/20 text-sky-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {item.confidence >= 0.85
                                ? 'High Clarity'
                                : item.confidence >= 0.6
                                ? 'Moderate'
                                : 'Needs Review'}
                            </span>
                          </div>
                        </div>

                        {/* Metadata row: Intent, Source, Time */}
                        <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                          <div className="flex items-center gap-2">
                            <span>
                              Intent: <strong className="text-amber-400">{item.parsedIntent}</strong>
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{item.timestamp}</span>
                            {item.status === 'corrected' && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-purple-400 font-semibold text-[10px]">
                                  (User Corrected)
                                </span>
                              </>
                            )}
                          </div>

                          {/* Actions: Re-run & Edit/Correct */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onExecuteCommand(item.rawTranscript)}
                              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 text-[11px] flex items-center gap-1"
                              title="Re-run this command"
                            >
                              <RotateCcw className="w-3 h-3 text-sky-400" />
                              <span>Re-run</span>
                            </button>

                            <button
                              onClick={() => handleStartEditing(item)}
                              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-400 text-[11px] flex items-center gap-1"
                              title="Correct misheard command text"
                            >
                              <Edit2 className="w-3 h-3 text-amber-400" />
                              <span>Correct</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Clarity Notice for Low-Vision & Motor Impairment */}
            <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/20 flex items-start gap-2 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span>
                Speech clarity is scored in real-time. If the microphone misheard you due to ambient noise or vocal variations, click <strong>Correct</strong> to edit the text and immediately execute it.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close Voice Assistant
          </button>
        </div>
      </div>
    </div>
  );
};
