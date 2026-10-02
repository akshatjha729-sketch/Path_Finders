import React from 'react';
import { JobApplication } from '../types/index.ts';
import { FileText, CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface MyApplicationsViewProps {
  applications: JobApplication[];
  onSelectJob: (jobId: string) => void;
}

export const MyApplicationsView: React.FC<MyApplicationsViewProps> = ({
  applications,
  onSelectJob
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-100">My Job Applications</h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-semibold">
              {applications.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time candidate review statuses, ATS match ratings, and verified accommodations.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Verified Assistive Records</span>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <FileText className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <h3 className="text-sm font-bold text-slate-200">No applications submitted yet</h3>
          <p className="text-xs text-slate-500">
            Browse jobs and press <strong>Alt+V</strong> or say <strong>&quot;Apply now&quot;</strong> to submit in 1 click.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800">
          {applications.map((app) => (
            <div key={app.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-slate-100 text-base">{app.jobTitle}</h3>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    {app.matchScore}% Match
                  </span>
                </div>

                <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2 font-medium">
                  <span className="text-slate-200">{app.company}</span>
                  <span aria-hidden="true">·</span>
                  <span>Submitted: {app.submittedAt}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-300 font-mono">Via: {app.submittedVia}</span>
                </div>

                {/* Accommodations badge */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {app.accommodationsRequested.map((acc, i) => (
                    <span
                      key={i}
                      className="text-[11px] text-slate-300 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-purple-400" />
                      {acc}
                    </span>
                  ))}
                </div>

                {app.recruiterNotes && (
                  <div className="mt-2.5 text-xs text-amber-300/90 bg-amber-950/20 p-2 rounded-lg border border-amber-500/20">
                    <strong className="text-amber-400">Recruiter Note:</strong> {app.recruiterNotes}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    app.status === 'Shortlisted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : app.status === 'Interview Scheduled'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : app.status === 'Under Review'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {app.status}
                </span>

                <button
                  onClick={() => onSelectJob(app.jobId)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1"
                >
                  <span>View Job</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
