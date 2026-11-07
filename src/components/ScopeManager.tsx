import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Lock, 
  FileCheck, 
  Server,
  ArrowRight
} from 'lucide-react';
import { AuthorizedScope } from '../lib/types';
import { validateTargetScope, DEFAULT_AUTHORIZED_SCOPES, ScopeValidationResult } from '../lib/scopeValidator';

interface ScopeManagerProps {
  activeScope: AuthorizedScope;
  setActiveScope: (scope: AuthorizedScope) => void;
  onProceedToPlanning: () => void;
}

export const ScopeManager: React.FC<ScopeManagerProps> = ({
  activeScope,
  setActiveScope,
  onProceedToPlanning,
}) => {
  const [testInput, setTestInput] = useState('lab.dataops-sandbox.internal');
  const [testResult, setTestResult] = useState<ScopeValidationResult | null>(() =>
    validateTargetScope('lab.dataops-sandbox.internal')
  );

  const handleRunValidation = (val: string) => {
    setTestInput(val);
    const res = validateTargetScope(val);
    setTestResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Section 5.1 Scope Enforcement */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>SECTION 5.1 COMPLIANCE: SCOPE ENFORCEMENT & RULES OF ENGAGEMENT</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Authorized Security Assessment Boundaries
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Strict boundary enforcement ensures that all reconnaissance, enumeration, and validation remain confined to explicitly authorized lab sandboxes. Any out-of-scope, public, or third-party targets are rejected immediately.
            </p>
          </div>
          <button
            onClick={onProceedToPlanning}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2.5 rounded-lg shadow-sm transition whitespace-nowrap self-start md:self-center"
          >
            <span>Proceed to AI Planning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Registered Scope Profiles */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2 mb-3">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Active Lab Scope Profiles</span>
            </h3>

            <div className="space-y-3">
              {DEFAULT_AUTHORIZED_SCOPES.map((scope) => {
                const isSelected = activeScope.id === scope.id;
                return (
                  <div
                    key={scope.id}
                    onClick={() => setActiveScope(scope)}
                    className={`cursor-pointer border rounded-lg p-4 transition-all ${
                      isSelected
                        ? 'border-emerald-500/80 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/30'
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-slate-100">{scope.targetName}</span>
                          {isSelected && (
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                              Active Scope
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 font-mono">
                          Subnet: <span className="text-slate-200">{scope.allowedCidrs.join(', ')}</span> | Ports: <span className="text-slate-200">{scope.allowedPorts}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 font-mono block">Auth Contact:</span>
                        <span className="text-[11px] text-emerald-400 font-mono">{scope.authorizationContact.split('(')[0]}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 block mb-1">Approved Hostnames:</span>
                        <div className="flex flex-wrap gap-1">
                          {scope.allowedHosts.map((h) => (
                            <span key={h} className="bg-slate-800 text-slate-300 font-mono text-[11px] px-2 py-0.5 rounded">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">Protected Exclusions (Blocked):</span>
                        <div className="flex flex-wrap gap-1">
                          {scope.forbiddenExclusions.map((e) => (
                            <span key={e} className="bg-rose-950/50 text-rose-300 font-mono text-[11px] px-2 py-0.5 rounded border border-rose-900/50">
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rules of Engagement */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2 mb-3">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Rules of Engagement (NIST SP 800-115)</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {activeScope.rulesOfEngagement.map((roe, idx) => (
                <li key={idx} className="flex items-start space-x-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{roe}</span>
                </li>
              ))}
              <li className="flex items-start space-x-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                <Lock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span><strong className="text-amber-300">Section 5.7 Gate:</strong> Any active exploitation or offensive proof-of-concept requires explicit Human-in-the-Loop authorization before execution.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive Scope Validation & Rejection Tester */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2 mb-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Live Target Scope Validator</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Test targets against sandbox policies. Observe the agent instantly approving lab assets and strictly blocking unauthorized or third-party targets.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Host, IP or URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => handleRunValidation(e.target.value)}
                    placeholder="e.g. lab.dataops-sandbox.internal or google.com"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => handleRunValidation(testInput)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg font-medium transition"
                  >
                    Check
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons for Judges */}
              <div>
                <span className="text-[11px] text-slate-500 block mb-1.5 font-mono">Sample Test Presets (Judges Evaluation):</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleRunValidation('lab.dataops-sandbox.internal')}
                    className="bg-slate-800/90 hover:bg-slate-700 text-emerald-300 text-[11px] font-mono px-2 py-1 rounded border border-emerald-500/30 transition"
                  >
                    ✓ Authorized Host
                  </button>
                  <button
                    onClick={() => handleRunValidation('10.0.12.45')}
                    className="bg-slate-800/90 hover:bg-slate-700 text-emerald-300 text-[11px] font-mono px-2 py-1 rounded border border-emerald-500/30 transition"
                  >
                    ✓ Subnet IP (10.0.12.45)
                  </button>
                  <button
                    onClick={() => handleRunValidation('10.0.12.1')}
                    className="bg-slate-800/90 hover:bg-slate-700 text-rose-300 text-[11px] font-mono px-2 py-1 rounded border border-rose-500/30 transition"
                  >
                    ✗ Excluded Gateway (10.0.12.1)
                  </button>
                  <button
                    onClick={() => handleRunValidation('google.com')}
                    className="bg-slate-800/90 hover:bg-slate-700 text-rose-300 text-[11px] font-mono px-2 py-1 rounded border border-rose-500/30 transition"
                  >
                    ✗ Public Domain (google.com)
                  </button>
                  <button
                    onClick={() => handleRunValidation('8.8.8.8')}
                    className="bg-slate-800/90 hover:bg-slate-700 text-rose-300 text-[11px] font-mono px-2 py-1 rounded border border-rose-500/30 transition"
                  >
                    ✗ Public IP (8.8.8.8)
                  </button>
                </div>
              </div>

              {/* Validation Result Box */}
              {testResult && (
                <div
                  className={`mt-4 p-4 rounded-lg border transition-all ${
                    testResult.isAuthorized
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    {testResult.isAuthorized ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs uppercase tracking-wider">
                          {testResult.isAuthorized ? 'SCOPE AUTHORIZED' : 'SCOPE VIOLATION BLOCKED'}
                        </span>
                        {testResult.matchedRule && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                            {testResult.matchedRule}
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-1.5 font-mono leading-relaxed">
                        {testResult.reason}
                      </p>
                      {testResult.violations && testResult.violations.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {testResult.violations.map((v, i) => (
                            <span key={i} className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-mono">
                              {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Section 13: Assessment Integrity Standard</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Do not test third-party or public systems. Do not evade authorization. Respect organizer-provided lab boundaries, rate limits, and credentials. Ensure every action is attributable through an audit trail."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
