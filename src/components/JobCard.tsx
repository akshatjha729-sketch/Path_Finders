import React from 'react';
import { Send, Volume2, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { JobPosting } from '../types/index.ts';

interface JobCardProps {
  job: JobPosting;
  isSelected: boolean;
  onSelect: () => void;
  onQuickApply: () => void;
  onReadAloud: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSelected,
  onSelect,
  onQuickApply,
  onReadAloud,
}) => {
  return (
    <div
      role="article"
      aria-labelledby={`job-title-${job.id}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      onClick={onSelect}
      className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${
        isSelected
          ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
      }`}
    >
      {/* Quiet 1-line text kicker without pill badges (Zero-Pill Discipline) */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="text-amber-400 font-semibold">{job.salaryRange}</span>
        <span>{job.postedDate}</span>
      </div>

      {/* Main Title */}
      <h3
        id={`job-title-${job.id}`}
        className="mt-1.5 text-base sm:text-lg font-bold text-slate-100 tracking-tight"
      >
        {job.title}
      </h3>

      {/* Unboxed metadata with typographic separators (WCAG AAA & Anti-Slop Compliant) */}
      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
        <span className="text-slate-200 font-semibold">{job.company}</span>
        <span aria-hidden="true">·</span>
        <span>{job.location}</span>
        <span aria-hidden="true">·</span>
        <span>{job.jobType}</span>
      </div>

      {/* Brief Preview */}
      <p className="mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed">
        {job.simplifiedSummary?.roleOverview || job.description}
      </p>

      {/* Accommodations Highlight */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{job.accommodationsOffered[0]}</span>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onReadAloud}
            aria-label={`Read aloud ${job.title} at ${job.company}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-900 transition-colors"
            title="Read summary aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={onQuickApply}
            aria-label={`1-Click Apply to ${job.title}`}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors flex items-center gap-1 shadow-sm"
          >
            <Send className="w-3 h-3" />
            <span>Apply (Alt+V)</span>
          </button>

          <button
            onClick={onSelect}
            aria-label={`View details for ${job.title}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
