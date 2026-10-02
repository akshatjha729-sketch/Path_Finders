import React, { useState } from 'react';
import { X, Play, CheckCircle2, XCircle, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { AutomatedTestResult } from '../types/index.ts';
import { api } from '../services/api.ts';

interface UnitTestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnitTestRunnerModal: React.FC<UnitTestRunnerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [tests, setTests] = useState<AutomatedTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const data = await api.runTests();
      setTests(data.tests || []);
      setSummary(data.summary || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="test-runner-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 id="test-runner-title" className="text-lg font-bold text-slate-100">
                Automated Unit Test Suite & SLA Benchmarks
              </h2>
              <p className="text-xs text-slate-400">
                Verifies Module 1-3 core functionalities, Dual-Layer Fallback SLA, RBAC security, and WCAG 2.1 AAA.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close unit test runner dialog"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Summary */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-300">
              Test Coverage Status:
            </div>
            {summary ? (
              <div className="text-sm font-bold text-slate-100 mt-0.5 flex items-center gap-2">
                <span className="text-emerald-400">{summary.passed} Passed</span>
                <span className="text-slate-500">/</span>
                <span className={summary.failed > 0 ? 'text-rose-400' : 'text-slate-400'}>{summary.failed} Failed</span>
                <span className="text-xs font-mono text-slate-400">({summary.total} total tests)</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 mt-0.5">
                Ready to execute tests against live services.
              </div>
            )}
          </div>

          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-400/20 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Executing Test Suite...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Core Test Suite Now</span>
              </>
            )}
          </button>
        </div>

        {/* Test Results List */}
        <div className="mt-4 space-y-3">
          {tests.length === 0 && !isRunning && (
            <div className="text-center py-10 text-slate-500 text-xs">
              Click &quot;Run Core Test Suite Now&quot; to execute automated unit benchmarks.
            </div>
          )}

          {tests.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-xl border transition-all ${
                t.status === 'passed'
                  ? 'bg-slate-950/70 border-emerald-500/30'
                  : 'bg-rose-950/20 border-rose-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {t.status === 'passed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {t.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100">{t.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{t.description}</p>
                    <div className="mt-2 text-xs font-mono text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                      Assert: {t.assertion}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t.durationMs}ms
                  </span>
                  <span className="text-[10px] text-slate-500 block uppercase mt-0.5 font-bold">
                    {t.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close Runner
          </button>
        </div>
      </div>
    </div>
  );
};
