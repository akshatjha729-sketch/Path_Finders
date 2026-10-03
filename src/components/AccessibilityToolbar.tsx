import React, { useState } from 'react';
import { X, Play, Code2, ShieldAlert, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { UserRole } from '../types/index.ts';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
}

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  rbac: 'Public' | 'Job Seeker' | 'Recruiter' | 'Admin';
  defaultBody?: any;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({
  isOpen,
  onClose,
  role
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);
  const [requestBody, setRequestBody] = useState('');
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const endpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/api/health',
      summary: 'System health probe & uptime',
      description: 'Used by load balancers, Cloud Run, and CI/CD pipelines for readiness & liveness checks.',
      rbac: 'Public'
    },
    {
      method: 'POST',
      path: '/api/auth/login',
      summary: 'Role-based authentication & token issue',
      description: 'Simulates authentication for Job Seeker or Recruiter, issuing scoped capabilities.',
      rbac: 'Public',
      defaultBody: { role: 'job_seeker', email: 'alex.morgan@accessibility.org' }
    },
    {
      method: 'GET',
      path: '/api/jobs',
      summary: 'List accessible job requisitions',
      description: 'Fetches active job listings. Supports query string search: ?q=react&remote=true',
      rbac: 'Public'
    },
    {
      method: 'POST',
      path: '/api/jobs',
      summary: 'Create new accessible job requisition',
      description: 'Recruiter-only RBAC endpoint. Validates job parameters and accessibility provisions.',
      rbac: 'Recruiter',
      defaultBody: {
        title: 'Lead Accessibility Architect',
        company: 'OpenVoice AI',
        location: 'Remote',
        salaryRange: '$160,000 - $195,000 / year',
        jobType: 'Full-time',
        department: 'Core Assistive Engineering',
        description: 'Lead engineering for screen-reader and voice-first job application gateways.',
        requirements: ['WCAG 2.1 AAA', 'TypeScript', 'Node.js'],
        accommodationsOffered: ['Screen reader certified', 'Ergonomic hardware grant']
      }
    },
    {
      method: 'GET',
      path: '/api/profile',
      summary: 'Retrieve stored candidate profile schema',
      description: 'Supplies the candidate profile data used by Module 3 1-Click DOM Form Auto-Fill.',
      rbac: 'Job Seeker'
    },
    {
      method: 'POST',
      path: '/api/applications',
      summary: 'Submit job application (1-Click or Voice)',
      description: 'Injects candidate credentials into the ATS application pipeline.',
      rbac: 'Job Seeker',
      defaultBody: {
        jobId: 'job-101',
        applicantName: 'Alex Morgan',
        applicantEmail: 'alex.morgan@accessibility.org',
        applicantPhone: '+1 (555) 382-9011',
        resumeSummary: 'Frontend accessibility engineer with 4 years experience in WCAG 2.1 AAA.',
        skills: ['JavaScript', 'React', 'WCAG', 'Web Speech API'],
        accommodationsRequested: ['Screen reader support', 'High contrast mode'],
        submittedVia: 'DOM 1-Click (Alt+V)'
      }
    },
    {
      method: 'POST',
      path: '/api/ai/summarize',
      summary: 'Dual-Layer Cognitive Load Reduction',
      description: 'Executes NVIDIA NIM Cloud AI (Llama 3.2) with automatic fallback to Local NLP Rule Engine if latency > 800ms.',
      rbac: 'Public',
      defaultBody: {
        jobTitle: 'Assistive Tech Full Stack Engineer',
        description: 'OpenVoice AI builds speech-driven tools for users with motor and visual limitations.',
        salary: '$140k - $175k',
        location: 'Remote',
        requirements: ['TypeScript', 'React', 'Web Speech API'],
        forceLocalFallback: false
      }
    },
    {
      method: 'GET',
      path: '/api/analytics',
      summary: 'System telemetry & real-time metrics',
      description: 'Returns latency SLA compliance, voice success rates, and backup status.',
      rbac: 'Public'
    }
  ];

  if (!isOpen) return null;

  const handleSelectEndpoint = (idx: number) => {
    setSelectedIdx(idx);
    const ep = endpoints[idx];
    setRequestBody(ep.defaultBody ? JSON.stringify(ep.defaultBody, null, 2) : '');
    setResponseOutput(null);
  };

  const handleExecuteRequest = async () => {
    if (selectedIdx === null) return;
    const ep = endpoints[selectedIdx];
    setIsLoading(true);

    try {
      const options: RequestInit = {
        method: ep.method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': role
        }
      };

      if (ep.method !== 'GET' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(ep.path, options);
      const data = await res.json();
      setResponseOutput({ status: res.status, data });
    } catch (err: any) {
      setResponseOutput({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-docs-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-400/30 text-purple-400">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h2 id="api-docs-title" className="text-lg font-bold text-slate-100">
                Interactive API Documentation & RBAC Specification
              </h2>
              <p className="text-xs text-slate-400">
                RESTful Endpoints with Role-Based Access Control and Dual-Layer SLA guarantees.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close API documentation modal"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Auth Context */}
        <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Role Header:</span>
            <span className="font-mono px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
              x-user-role: {role}
            </span>
          </div>
          <span className="text-slate-500 text-[11px]">
            Switch roles in the top toolbar to test RBAC guards
          </span>
        </div>

        {/* Explorer Layout */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Endpoint List */}
          <div className="md:col-span-5 space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {endpoints.map((ep, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectEndpoint(idx)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedIdx === idx
                    ? 'bg-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      ep.method === 'GET'
                        ? 'bg-sky-500/20 text-sky-400'
                        : ep.method === 'POST'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-200">
                    {ep.path}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {ep.summary}
                </div>
                <div className="mt-1 text-[10px] text-purple-400 font-semibold">
                  RBAC: {ep.rbac}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Request & Response Box */}
          <div className="md:col-span-7 space-y-4">
            {selectedIdx !== null && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      {endpoints[selectedIdx].summary}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {endpoints[selectedIdx].description}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                    {endpoints[selectedIdx].rbac}
                  </span>
                </div>

                {endpoints[selectedIdx].defaultBody && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      JSON Request Body:
                    </label>
                    <textarea
                      rows={6}
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="w-full font-mono text-xs p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleExecuteRequest}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-400/20 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isLoading ? 'Sending Request...' : 'Send Live Request'}</span>
                  </button>
                </div>

                {responseOutput && (
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Server Response:</span>
                      <span
                        className={`font-mono ${
                          responseOutput.status < 300 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        Status: {responseOutput.status || 'Error'}
                      </span>
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-900 text-emerald-300 font-mono text-xs max-h-48 overflow-y-auto border border-slate-800">
                      {JSON.stringify(responseOutput.data || responseOutput, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
