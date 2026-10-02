import React, { useState, useMemo } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Search,
  User,
  Briefcase,
  FileText,
  Send,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Play,
  RotateCcw,
  Keyboard,
  Compass,
  Plus
} from 'lucide-react';
import { JobPosting, UserRole } from '../types/index.ts';

export interface PageAssistantProps {
  portalView: 'landing' | 'job_seeker' | 'recruiter';
  seekerTab: 'jobs' | 'profile' | 'applications';
  recruiterTab: 'applications' | 'requisitions' | 'create_job';
  voiceActive: boolean;
  voiceStatus: 'idle' | 'listening' | 'speaking' | 'unsupported';
  lastTranscript: string;
  isSpeaking: boolean;
  onToggleVoice: () => void;
  onExecuteCommand: (cmd: string) => void;
  onSpeakText: (text: string) => void;
  onStopSpeaking: () => void;
  selectedJob?: JobPosting | null;
  jobsCount: number;
  applicationsCount: number;
}

export const PageAssistant: React.FC<PageAssistantProps> = ({
  portalView,
  seekerTab,
  recruiterTab,
  voiceActive,
  voiceStatus,
  lastTranscript,
  isSpeaking,
  onToggleVoice,
  onExecuteCommand,
  onSpeakText,
  onStopSpeaking,
  selectedJob,
  jobsCount,
  applicationsCount
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [manualCmd, setManualCmd] = useState('');

  // Page-specific contextual commands and instructions
  const pageContext = useMemo(() => {
    if (portalView === 'landing') {
      return {
        badge: 'Home Portal Gateway',
        title: 'Voice Navigation Assistant · First Page',
        description: 'Choose your portal using voice or keyboard. Say where you want to go.',
        speakGuideText:
          'Welcome to VoiceHire AI. On this page, say "Job Seeker" to browse and apply for jobs, or say "Recruiter" to manage job requisitions and review applicants. Press Alt+M or V to toggle microphone.',
        commands: [
          {
            phrase: '“Job Seeker”',
            cmd: 'job seeker',
            desc: 'Opens candidate job search & 1-click application portal',
            icon: <User className="w-3.5 h-3.5 text-amber-400" />
          },
          {
            phrase: '“Recruiter”',
            cmd: 'recruiter',
            desc: 'Opens inclusive recruiter dashboard & applicant review',
            icon: <Briefcase className="w-3.5 h-3.5 text-sky-400" />
          },
          {
            phrase: '“Jobs”',
            cmd: 'jobs',
            desc: 'Jumps directly to accessible job listings board',
            icon: <Search className="w-3.5 h-3.5 text-emerald-400" />
          },
          {
            phrase: '“High contrast”',
            cmd: 'high contrast',
            desc: 'Toggles WCAG AAA high contrast color mode',
            icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          }
        ]
      };
    }

    if (portalView === 'job_seeker') {
      if (seekerTab === 'jobs') {
        return {
          badge: 'Job Seeker > Accessible Job Board',
          title: 'Job Board Assistant · Voice Search & 1-Click Apply',
          description: `Browsing ${jobsCount} verified accessible jobs. Search, listen aloud, or apply instantly.`,
          speakGuideText:
            `You are on the Accessible Job Board with ${jobsCount} positions available. Say "Search React" to filter by skill. Say "Read job" to listen aloud. Say "Summarize" for cognitive breakdown. Say "Apply now" or press Alt+V to auto-fill. Say "Profile" or "Applications" to switch tabs.`,
          commands: [
            {
              phrase: '“Search React”',
              cmd: 'search react',
              desc: 'Filters jobs matching keyword or technology',
              icon: <Search className="w-3.5 h-3.5 text-amber-400" />
            },
            {
              phrase: '“Read job”',
              cmd: 'read job',
              desc: 'Speaks selected job details and accommodations',
              icon: <Volume2 className="w-3.5 h-3.5 text-sky-400" />
            },
            {
              phrase: '“Summarize”',
              cmd: 'summarize',
              desc: 'Gemini AI cognitive breakdown into plain language',
              icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            },
            {
              phrase: '“Apply now” (Alt+V)',
              cmd: 'apply now',
              desc: '1-Click DOM Form Auto-Fill using saved profile',
              icon: <Send className="w-3.5 h-3.5 text-emerald-400" />
            },
            {
              phrase: '“Next job”',
              cmd: 'next job',
              desc: 'Moves selection to next listing',
              icon: <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            },
            {
              phrase: '“Profile”',
              cmd: 'profile',
              desc: 'Switch to Candidate Profile editor tab',
              icon: <User className="w-3.5 h-3.5 text-amber-400" />
            },
            {
              phrase: '“Applications”',
              cmd: 'applications',
              desc: 'Switch to My Applications tracker tab',
              icon: <FileText className="w-3.5 h-3.5 text-sky-400" />
            },
            {
              phrase: '“Switch to Recruiter”',
              cmd: 'switch to recruiter',
              desc: 'Hands-free portal switch to recruiter mode',
              icon: <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            }
          ]
        };
      }

      if (seekerTab === 'profile') {
        return {
          badge: 'Job Seeker > Candidate Profile',
          title: 'Profile Assistant · Fast Tab Navigation & Save',
          description: 'Manage your assistive preferences, skills, and resume data for 1-click auto-fill.',
          speakGuideText:
            'You are in the Candidate Profile Editor. Edit your skills and accessibility accommodations here. Say "Save profile" to save changes. Say "Jobs" to return to the job board, or say "Applications" to view your submissions.',
          commands: [
            {
              phrase: '“Save profile”',
              cmd: 'save profile',
              desc: 'Persists candidate details for 1-click auto-filling',
              icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            },
            {
              phrase: '“Jobs” / “Job Board”',
              cmd: 'jobs',
              desc: 'Switch tab back to Accessible Job Board',
              icon: <Search className="w-3.5 h-3.5 text-amber-400" />
            },
            {
              phrase: '“Applications”',
              cmd: 'applications',
              desc: 'Switch tab to My Applications tracker',
              icon: <FileText className="w-3.5 h-3.5 text-sky-400" />
            },
            {
              phrase: '“Switch to Recruiter”',
              cmd: 'switch to recruiter',
              desc: 'Change portal to Recruiter dashboard',
              icon: <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            },
            {
              phrase: '“Home”',
              cmd: 'home',
              desc: 'Return to start page portal selection',
              icon: <Compass className="w-3.5 h-3.5 text-slate-300" />
            }
          ]
        };
      }

      // Seeker > Applications
      return {
        badge: 'Job Seeker > My Applications',
        title: 'Application Tracker Assistant · Status & Follow-ups',
        description: `Tracking ${applicationsCount} submitted job applications and ATS matching scores.`,
        speakGuideText:
          `You are viewing My Applications. You have ${applicationsCount} active submissions. Say "Jobs" to search for more openings, or say "Profile" to update your credentials.`,
        commands: [
          {
            phrase: '“Jobs” / “Job Board”',
            cmd: 'jobs',
            desc: 'Switch tab back to search and apply for more jobs',
            icon: <Search className="w-3.5 h-3.5 text-amber-400" />
          },
          {
            phrase: '“Profile”',
            cmd: 'profile',
            desc: 'Switch tab to review candidate profile',
            icon: <User className="w-3.5 h-3.5 text-sky-400" />
          },
          {
            phrase: '“Switch to Recruiter”',
            cmd: 'switch to recruiter',
            desc: 'Switch portal to review applications as employer',
            icon: <Briefcase className="w-3.5 h-3.5 text-purple-400" />
          },
          {
            phrase: '“Home”',
            cmd: 'home',
            desc: 'Return to first page portal selection',
            icon: <Compass className="w-3.5 h-3.5 text-slate-300" />
          }
        ]
      };
    }

    // Recruiter Portal
    if (recruiterTab === 'applications') {
      return {
        badge: 'Recruiter > Candidate Applications',
        title: 'Recruiter Assistant · Candidate Pipeline & Review',
        description: `Reviewing ${applicationsCount} applicant submissions with ATS scores and accommodation requests.`,
        speakGuideText:
          `You are on the Recruiter Candidates tab with ${applicationsCount} applicants. Say "Requisitions" to manage job openings, or say "Post a job" to create a new listing. Say "Job Seeker" to switch back.`,
        commands: [
          {
            phrase: '“Requisitions”',
            cmd: 'requisitions',
            desc: 'Switch tab to view and manage active job listings',
            icon: <Briefcase className="w-3.5 h-3.5 text-amber-400" />
          },
          {
            phrase: '“Post a job”',
            cmd: 'post a job',
            desc: 'Switch tab to create a new accessible job posting',
            icon: <Plus className="w-3.5 h-3.5 text-emerald-400" />
          },
          {
            phrase: '“Shortlist”',
            cmd: 'shortlist',
            desc: 'Updates candidate status to Shortlisted',
            icon: <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
          },
          {
            phrase: '“Switch to Job Seeker”',
            cmd: 'switch to job seeker',
            desc: 'Switch portal back to candidate view',
            icon: <User className="w-3.5 h-3.5 text-purple-400" />
          }
        ]
      };
    }

    if (recruiterTab === 'requisitions') {
      return {
        badge: 'Recruiter > Job Requisitions',
        title: 'Requisitions Assistant · Manage Openings',
        description: `Managing ${jobsCount} active accessible job openings.`,
        speakGuideText:
          `You are viewing Job Requisitions with ${jobsCount} open roles. Say "Candidates" to review incoming applications, or say "Post a job" to add a new opening.`,
        commands: [
          {
            phrase: '“Candidates”',
            cmd: 'candidates',
            desc: 'Switch tab to review candidate applications',
            icon: <User className="w-3.5 h-3.5 text-amber-400" />
          },
          {
            phrase: '“Post a job”',
            cmd: 'post a job',
            desc: 'Switch tab to publish a new job opening',
            icon: <Plus className="w-3.5 h-3.5 text-emerald-400" />
          },
          {
            phrase: '“Switch to Job Seeker”',
            cmd: 'switch to job seeker',
            desc: 'Switch portal to applicant perspective',
            icon: <Briefcase className="w-3.5 h-3.5 text-sky-400" />
          }
        ]
      };
    }

    // Recruiter > Create Job
    return {
      badge: 'Recruiter > Post New Job',
      title: 'Job Creator Assistant · Zero-Barrier Requisition',
      description: 'Define inclusive job requirements, accommodations, and salary ranges.',
      speakGuideText:
        'You are on the Post New Job form. Fill in the title, requirements, and accommodations. Say "Candidates" to return to applicants, or say "Requisitions" to see active jobs.',
      commands: [
        {
          phrase: '“Candidates”',
          cmd: 'candidates',
          desc: 'Switch tab back to applicant pipeline',
          icon: <User className="w-3.5 h-3.5 text-amber-400" />
        },
        {
          phrase: '“Requisitions”',
          cmd: 'requisitions',
          desc: 'Switch tab to active job listings',
          icon: <Briefcase className="w-3.5 h-3.5 text-sky-400" />
        },
        {
          phrase: '“Switch to Job Seeker”',
          cmd: 'switch to job seeker',
          desc: 'Switch portal to job seeker mode',
          icon: <Compass className="w-3.5 h-3.5 text-purple-400" />
        }
      ]
    };
  }, [portalView, seekerTab, recruiterTab, jobsCount, applicationsCount]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCmd.trim()) {
      onExecuteCommand(manualCmd.trim());
      setManualCmd('');
    }
  };

  return (
    <section
      role="region"
      aria-label="Universal Voice and Keyboard Assistant"
      className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-amber-400/40 shadow-2xl space-y-3.5 transition-all"
    >
      {/* Header bar with Status, Location, and Expand Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {/* Animated Mic & Status Indicator */}
          <button
            onClick={onToggleVoice}
            aria-pressed={voiceActive}
            aria-label={voiceActive ? "Turn off Voice Assistant" : "Turn on Voice Assistant (Shortcut: Alt+M or press V)"}
            title="Toggle Voice Listening (Shortcut: Alt+M or press 'V')"
            className={`relative p-2.5 rounded-xl font-bold flex items-center justify-center transition-all ${
              voiceActive
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 ring-2 ring-amber-400/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-400 hover:text-white'
            }`}
          >
            {voiceActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold uppercase tracking-wider">
                {pageContext.badge}
              </span>

              {voiceActive ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>Listening...</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                  Voice Paused
                </span>
              )}

              {/* Keyboard Shortcut Hint */}
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                <Keyboard className="w-3 h-3 text-amber-400" />
                <span>Toggle:</span>
                <kbd className="text-amber-300 font-bold">Alt+M</kbd>
                <span>or</span>
                <kbd className="text-amber-300 font-bold">V</kbd>
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-extrabold text-slate-100 tracking-tight mt-0.5">
              {pageContext.title}
            </h2>
          </div>
        </div>

        {/* Action Controls: Speak Guide, Toggle Expand */}
        <div className="flex items-center gap-2">
          {/* Narrate Page Commands Button */}
          <button
            onClick={() => {
              if (isSpeaking) {
                onStopSpeaking();
              } else {
                onSpeakText(pageContext.speakGuideText);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              isSpeaking
                ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-md shadow-sky-500/10 animate-pulse'
                : 'bg-slate-950 text-slate-200 border-slate-700 hover:border-amber-400'
            }`}
            title="Assistant speaks the available commands on this page aloud"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-sky-400" />
                <span>Stop Speaking</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Hear Page Commands</span>
                <span className="sm:hidden">Hear Guide</span>
              </>
            )}
          </button>

          {/* Toggle Expand / Minimize */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse Voice Assistant Panel" : "Expand Voice Assistant Panel"}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content: Commands Grid + Last Heard + Direct Command Input */}
      {isExpanded && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          <p className="text-xs text-slate-300 leading-relaxed">
            {pageContext.description} <strong className="text-slate-100">Say any tab name or command below</strong>, or click it to execute instantly:
          </p>

          {/* Page-Specific Action Commands Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            {pageContext.commands.map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onExecuteCommand(c.cmd)}
                className="group p-2.5 rounded-xl bg-slate-950/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/80 text-left transition-all flex flex-col justify-between shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between gap-1.5 w-full">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-amber-400/40">
                      {c.icon}
                    </span>
                    <span className="font-mono font-bold text-amber-300 group-hover:text-amber-200 text-xs">
                      {c.phrase}
                    </span>
                  </div>
                  <Play className="w-3 h-3 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                  {c.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Live Feedback Bar: Last Transcript & Manual Dispatch Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 text-xs">
            {/* Last Heard Recognition Feedback */}
            <div className="flex items-center gap-2 min-w-[240px]">
              <span className="text-slate-400 font-medium text-[11px]">Last Heard:</span>
              {lastTranscript ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="truncate max-w-[220px]">“{lastTranscript}”</span>
                </div>
              ) : (
                <span className="text-slate-500 italic text-[11px]">
                  {voiceActive ? 'Listening for speech...' : 'Mic idle (Press Alt+M or V)'}
                </span>
              )}
            </div>

            {/* Direct Command Input (Type or Click) */}
            <form onSubmit={handleManualSubmit} className="flex-1 max-w-md flex items-center gap-1.5">
              <input
                type="text"
                value={manualCmd}
                onChange={(e) => setManualCmd(e.target.value)}
                placeholder='Type command (e.g. "jobs", "profile", "search remote", "summarize")...'
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!manualCmd.trim()}
                className="px-3 py-1.5 rounded-xl bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs shrink-0 hover:bg-amber-300 transition-colors"
              >
                Run
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
