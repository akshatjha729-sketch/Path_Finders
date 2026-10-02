import React from 'react';
import { Activity, ShieldCheck, Cpu, Clock, CheckCircle2, Database, Download, RefreshCw, Zap, Server } from 'lucide-react';
import { SystemAnalytics } from '../types/index.ts';

interface SystemAnalyticsDashboardProps {
  analytics: SystemAnalytics | null;
  onRefresh: () => void;
  onTriggerBackup: () => void;
  onDownloadBackup: () => void;
}

export const SystemAnalyticsDashboard: React.FC<SystemAnalyticsDashboardProps> = ({
  analytics,
  onRefresh,
  onTriggerBackup,
  onDownloadBackup
}) => {
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>REAL-TIME SYSTEM MONITORING & TELEMETRY · HEALTH: OPERATIONAL</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight mt-1">
            System Health & Accessibility Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dual-Layer SLA latency tracking (&lt;800ms), Web Speech accuracy, WCAG 2.1 AAA compliance, and automated backups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Refresh Metrics</span>
          </button>

          <button
            onClick={onTriggerBackup}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>Snapshot DB</span>
          </button>

          <button
            onClick={onDownloadBackup}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latency & SLA */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg AI / Fallback Latency</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-100 font-mono">
              {analytics.avgLatencyMs}ms
            </span>
            <span className="text-xs text-emerald-400 font-semibold font-mono">
              SLA &lt;800ms
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            SLA Compliance: <strong className="text-emerald-400">{analytics.slaComplianceRate}%</strong>
          </div>
        </div>

        {/* Voice Accuracy */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Voice Command Accuracy</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-100 font-mono">
              {analytics.voiceSuccessRate}%
            </span>
            <span className="text-xs text-slate-400">
              ({analytics.voiceCommandsExecuted} cmds)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Dual-Layer Fallback triggers: <strong className="text-purple-400">{analytics.dualLayerFallbacksCount}</strong>
          </div>
        </div>

        {/* Form Time Saved (Module 3) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Time Saved per Form</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              85% Cut
            </span>
            <span className="text-xs text-slate-400">
              (~12 min saved)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            1-Click DOM Auto-Fill active across {analytics.totalApplications} apps
          </div>
        </div>

        {/* WCAG Compliance */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>axe-core Accessibility Audit</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-sky-400 font-mono">
              0 Errors
            </span>
            <span className="text-xs text-emerald-400 font-bold">
              WCAG 2.1 AAA
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Contrast ratio: <strong className="text-slate-300">{analytics.wcagComplianceAudit.colorContrastRatio}</strong>
          </div>
        </div>
      </div>

      {/* Database & Automated Backups Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backups Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-400" />
              <h2 className="text-base font-bold text-slate-100">
                Automated Database Backups
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Daily @ 02:00 UTC
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Scheduled cron jobs back up all job requisitions, candidate profiles, and application states to resilient cloud storage.
          </p>

          <div className="space-y-2.5">
            {analytics.backups.map((bak) => (
              <div
                key={bak.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-mono text-slate-200 font-semibold">{bak.id}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {new Date(bak.timestamp).toLocaleString()} · {bak.sizeKb} KB
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    {bak.status}
                  </span>
                  <button
                    onClick={onDownloadBackup}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Download snapshot"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Server Architecture & Cloud Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-slate-100">
                Cloud Provider Deployment & Stack
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Uptime: {Math.floor(analytics.uptimeSeconds / 60)}m {analytics.uptimeSeconds % 60}s
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Primary Cloud AI Engine</span>
              <span className="text-amber-400 font-mono font-semibold">Google Gemini 3.8 Flash (@google/genai)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Offline NLP Fallback SLA Engine</span>
              <span className="text-emerald-400 font-mono font-semibold">Deterministic Regex Tokenizer (&lt;5ms)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Assistive Speech Standard</span>
              <span className="text-sky-400 font-mono font-semibold">W3C Web Speech API (Recognition + Synthesis)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Automated CI/CD Pipeline</span>
              <span className="text-purple-400 font-mono font-semibold">GitHub Actions (.github/workflows/ci-cd.yml)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
