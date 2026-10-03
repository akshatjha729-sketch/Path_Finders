import React, { useState } from 'react';
import { Briefcase, Plus, Users, CheckCircle2, Clock, AlertTriangle, ShieldCheck, FileText, ChevronRight, X, Sparkles, MessageSquare, Mic, ArrowRight } from 'lucide-react';
import { JobApplication, JobPosting } from '../types/index.ts';

interface RecruiterDashboardProps {
  jobs: JobPosting[];
  applications: JobApplication[];
  onCreateJob: (jobData: Partial<JobPosting>) => Promise<void>;
  onUpdateAppStatus: (appId: string, status: JobApplication['status'], notes?: string) => Promise<void>;
  onAnnounce: (msg: string) => void;
  activeTab?: 'applications' | 'requisitions' | 'create_job';
  onTabChange?: (tab: 'applications' | 'requisitions' | 'create_job') => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  jobs,
  applications,
  onCreateJob,
  onUpdateAppStatus,
  onAnnounce,
  activeTab: controlledTab,
  onTabChange
}) => {
  const [internalTab, setInternalTab] = useState<'applications' | 'requisitions' | 'create_job'>('applications');
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const setActiveTab = (tab: 'applications' | 'requisitions' | 'create_job') => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  // New Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    company: 'OpenVoice AI & Inclusive Labs',
    location: 'Remote (US/Global)',
    isRemote: true,
    salaryRange: '$130,000 - $160,000 / year',
    jobType: 'Full-time' as JobPosting['jobType'],
    department: 'Assistive Tech Engineering',
    description: '',
    keyResponsibilities: '',
    requirements: '',
    accommodationsOffered: '100% Screen reader tested tools\nFlexible asynchronous schedule\nErgonomic equipment grant'
  });

  const handleCreateJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingJob(true);
    try {
      await onCreateJob({
        title: newJob.title,
        company: newJob.company,
        location: newJob.location,
        isRemote: newJob.isRemote,
        salaryRange: newJob.salaryRange,
        jobType: newJob.jobType,
        department: newJob.department,
        description: newJob.description,
        keyResponsibilities: newJob.keyResponsibilities.split('\n').filter(Boolean),
        requirements: newJob.requirements.split('\n').filter(Boolean),
        accommodationsOffered: newJob.accommodationsOffered.split('\n').filter(Boolean),
        wcagAxeScore: 100,
        status: 'Active'
      });
      onAnnounce('New accessible job requisition posted successfully.');
      setActiveTab('requisitions');
      setNewJob({
        title: '',
        company: 'OpenVoice AI & Inclusive Labs',
        location: 'Remote (US/Global)',
        isRemote: true,
        salaryRange: '$130,000 - $160,000 / year',
        jobType: 'Full-time',
        department: 'Assistive Tech Engineering',
        description: '',
        keyResponsibilities: '',
        requirements: '',
        accommodationsOffered: '100% Screen reader tested tools\nFlexible asynchronous schedule\nErgonomic equipment grant'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleStatusChange = async (appId: string, status: JobApplication['status']) => {
    await onUpdateAppStatus(appId, status, recruiterNotes);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, status, recruiterNotes });
    }
    onAnnounce(`Application status updated to ${status}.`);
  };

  return (
    <div className="space-y-6">
      {/* Recruiter Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold">
            <span>RECRUITER DASHBOARD · TALENT & ACCESSIBILITY PIPELINE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight mt-1">
            Inclusive Hiring & Candidate Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review candidates submitted via 1-Click DOM Form Auto-Fill (Alt+V) and manage accessible job postings.
          </p>
        </div>

        {/* Tab Controls with Voice Dependencies */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('applications')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'applications'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Candidate Applications ({applications.length})</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-semibold flex items-center gap-1 ${
              activeTab === 'applications' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-300'
            }`}>
              <Mic className="w-2.5 h-2.5" /> “Candidates” · Alt+1
            </span>
          </button>

          <button
            onClick={() => setActiveTab('requisitions')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'requisitions'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Job Requisitions ({jobs.length})</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-semibold flex items-center gap-1 ${
              activeTab === 'requisitions' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-300'
            }`}>
              <Mic className="w-2.5 h-2.5" /> “Requisitions” · Alt+2
            </span>
          </button>

          <button
            onClick={() => setActiveTab('create_job')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'create_job'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Accessible Job</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-semibold flex items-center gap-1 ${
              activeTab === 'create_job' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-300'
            }`}>
              <Mic className="w-2.5 h-2.5" /> “Post Job” · Alt+3
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: CANDIDATE APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Submitted Candidates ({applications.length})
            </h2>

            {applications.map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  setSelectedApp(app);
                  setRecruiterNotes(app.recruiterNotes || '');
                }}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedApp?.id === app.id
                    ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-100">{app.applicantName}</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    {app.matchScore}% Match
                  </span>
                </div>

                <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {app.jobTitle}
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-slate-400 font-mono">{app.submittedVia}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    app.status === 'Shortlisted' ? 'bg-emerald-500/20 text-emerald-300' :
                    app.status === 'Interview Scheduled' ? 'bg-sky-500/20 text-sky-300' :
                    app.status === 'Under Review' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Application Inspector */}
          <div className="lg:col-span-2">
            {selectedApp ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-100">
                        {selectedApp.applicantName}
                      </h2>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                        ATS Match: {selectedApp.matchScore}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {selectedApp.applicantEmail} · {selectedApp.applicantPhone}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Status:</span>
                    <select
                      value={selectedApp.status}
                      onChange={(e) => handleStatusChange(selectedApp.id, e.target.value as any)}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold focus:border-amber-400"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Offer Extended">Offer Extended</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Candidate Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-semibold text-slate-400 block mb-1">Position Applied For</span>
                    <span className="font-bold text-slate-200 text-sm">{selectedApp.jobTitle}</span>
                    <span className="text-slate-500 block mt-0.5">{selectedApp.company}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-semibold text-slate-400 block mb-1">Submission Channel</span>
                    <span className="font-bold text-emerald-400 text-sm">{selectedApp.submittedVia}</span>
                    <span className="text-slate-500 block mt-0.5">Submitted: {selectedApp.submittedAt}</span>
                  </div>
                </div>

                {/* Resume Summary */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Candidate Resume Text Summary
                  </h3>
                  <p className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs leading-relaxed">
                    {selectedApp.resumeSummary}
                  </p>
                </div>

                {/* Verified Accommodations Requested */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Assistive Accommodations Requested
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.accommodationsRequested.map((acc, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-purple-950/30 text-purple-300 border border-purple-500/30 text-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recruiter Evaluation Notes */}
                <div>
                  <label htmlFor="r-notes" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Recruiter Assessment Notes
                  </label>
                  <textarea
                    id="r-notes"
                    rows={3}
                    value={recruiterNotes}
                    onChange={(e) => setRecruiterNotes(e.target.value)}
                    placeholder="Enter notes on candidate's assistive evaluation or interview schedule..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-400"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => handleStatusChange(selectedApp.id, selectedApp.status)}
                      className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-sm"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <Users className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold">Select a candidate application to review details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE JOB REQUISITIONS */}
      {activeTab === 'requisitions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-slate-100">
              Active Job Postings ({jobs.length})
            </h2>
            <button
              onClick={() => setActiveTab('create_job')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Posting</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {jobs.map((j) => (
              <div key={j.id} className="py-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-base">{j.title}</span>
                    <span className="text-xs font-mono text-amber-400">{j.salaryRange}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>{j.company}</span>
                    <span>·</span>
                    <span>{j.location}</span>
                    <span>·</span>
                    <span>{j.jobType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="text-slate-300">
                    <strong className="text-emerald-400 font-mono text-sm">{j.applicationCount}</strong> Applicants
                  </div>
                  <div className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>WCAG AAA 100%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CREATE ACCESSIBLE JOB REQUISITION */}
      {activeTab === 'create_job' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-slate-100">
              Post an Accessible Job Requisition
            </h2>
            <p className="text-xs text-slate-400">
              Includes automated axe-core validation to verify clear language, no exclusionary hurdles, and stated accommodations.
            </p>
          </div>

          <form onSubmit={handleCreateJobSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job Requisition Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Accessibility Specialist"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Company Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Salary / Compensation Range <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newJob.salaryRange}
                  onChange={(e) => setNewJob({ ...newJob, salaryRange: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Employment Type
                </label>
                <select
                  value={newJob.jobType}
                  onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Job Description <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe role responsibilities, inclusive mission, and project goals..."
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Requirements & Qualifications (One per line)
              </label>
              <textarea
                rows={3}
                placeholder="Experience with WCAG 2.1 AAA&#10;TypeScript and React&#10;Screen reader testing knowledge"
                value={newJob.requirements}
                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Verified Assistive Accommodations Offered (One per line)
              </label>
              <textarea
                rows={3}
                value={newJob.accommodationsOffered}
                onChange={(e) => setNewJob({ ...newJob, accommodationsOffered: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-400"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('requisitions')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmittingJob}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold flex items-center gap-2 shadow-lg shadow-amber-400/20 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmittingJob ? 'Publishing Requisition...' : 'Publish Accessible Job Requisition'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
