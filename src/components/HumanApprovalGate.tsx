import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Lock, 
  Terminal, 
  Clock, 
  User, 
  History,
  FileCheck2,
  Play
} from 'lucide-react';
import { HumanApprovalRequest } from '../lib/types';

interface HumanApprovalGateProps {
  pendingRequests: HumanApprovalRequest[];
  auditLog: HumanApprovalRequest[];
  onApprove: (requestId: string, analystComment: string) => void;
  onReject: (requestId: string, analystComment: string) => void;
  onStageDefaultPoc: () => void;
}

export const HumanApprovalGate: React.FC<HumanApprovalGateProps> = ({
  pendingRequests,
  auditLog,
  onApprove,
  onReject,
  onStageDefaultPoc,
}) => {
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCommentChange = (id: string, text: string) => {
    setCommentInputs((prev) => ({ ...prev, [id]: text }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono mb-1">
              <Lock className="w-4 h-4" />
              <span>SECTION 5.7 & 9.5: HUMAN-IN-THE-LOOP APPROVAL CHECKPOINT</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Active Validation & Controlled Exploitation Gate
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Autonomous weaponized exploitation is strictly disallowed. Every active proof-of-concept validation, Metasploit check module, or intrusive payload requires explicit, authenticated human approval with an immutable audit record.
            </p>
          </div>

          {pendingRequests.length === 0 && (
            <button
              onClick={onStageDefaultPoc}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-sm transition flex items-center space-x-1.5 self-start md:self-center"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Stage Apache 2.4.49 PoC Validation</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pending Approval Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Pending Human Authorization ({pendingRequests.length})</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Mandatory Approval Before Action</span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">No Pending Exploitation Actions</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                All scanner activities are currently passive or non-intrusive. To demonstrate the human gate checkpoint, stage a controlled Metasploit validation.
              </p>
              <button
                onClick={onStageDefaultPoc}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                + Stage Metasploit PoC Check for Review
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-900 border-2 border-amber-500/60 rounded-xl p-5 shadow-xl space-y-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-300 text-[10px] font-mono px-3 py-1 rounded-bl-lg border-b border-l border-amber-500/30 font-bold uppercase">
                    Awaiting Human Sign-Off
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-1">
                      <span className="bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                        {req.tool}
                      </span>
                      <span>Target: <strong className="text-slate-200">{req.target}</strong></span>
                      <span>Requested: {req.requestedAt}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{req.actionName}</h4>
                    <p className="text-xs text-slate-300 font-mono mt-1">
                      Finding: <strong className="text-emerald-400">{req.findingTitle}</strong>
                    </p>
                  </div>

                  {/* Safety & Parameters Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-500 font-mono block text-[11px]">Module / Payload:</span>
                      <code className="text-cyan-300 font-mono text-[11px] block mt-0.5">
                        {req.moduleOrPayload}
                      </code>
                    </div>
                    <div>
                      <span className="text-slate-500 font-mono block text-[11px]">Intended Verification:</span>
                      <span className="text-slate-300 text-[11px] block mt-0.5">{req.intendedProof}</span>
                    </div>
                    <div className="sm:col-span-2 pt-2 border-t border-slate-900">
                      <span className="text-slate-500 font-mono block text-[11px]">Safety Controls & Boundaries:</span>
                      <span className="text-emerald-400 text-[11px] font-mono block mt-0.5">
                        ✓ {req.safetyControls}
                      </span>
                    </div>
                  </div>

                  {/* Analyst Comment Input */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Analyst Authorization Justification (Recorded in Audit Trail):
                    </label>
                    <input
                      type="text"
                      value={commentInputs[req.id] || ''}
                      onChange={(e) => handleCommentChange(req.id, e.target.value)}
                      placeholder="e.g. Authorized read-only verification for hackathon lab judging"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Decision Buttons */}
                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      onClick={() =>
                        onReject(req.id, commentInputs[req.id] || 'Rejected by security analyst')
                      }
                      className="bg-slate-800 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800 text-slate-300 border border-slate-700 text-xs px-3.5 py-2 rounded-lg font-medium transition flex items-center space-x-1.5"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Reject / Deny Action</span>
                    </button>
                    <button
                      onClick={() =>
                        onApprove(
                          req.id,
                          commentInputs[req.id] || 'Explicitly approved by lead security analyst'
                        )
                      }
                      className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-4 py-2 rounded-lg font-bold shadow-lg shadow-amber-950/50 transition flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Validation (Execute Safe PoC)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Immutable Audit Ledger */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center space-x-2">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Immutable Human-Approval Audit Trail</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">NIST SP 800-115 Attributable</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <p className="text-xs text-slate-400">
              Section 5.7 & 13 Mandate: Every consequential action must record the explicit human approval or rejection outcome, analyst identity, timestamp, and result.
            </p>

            <div className="max-h-[500px] overflow-y-auto space-y-2.5 font-mono text-[11px]">
              {auditLog.map((log) => {
                const isApproved = log.status === 'Approved';
                return (
                  <div
                    key={log.id}
                    className={`p-3 rounded-lg border text-xs ${
                      isApproved
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-bold uppercase tracking-wider flex items-center space-x-1">
                        {isApproved ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        )}
                        <span>{log.status}</span>
                      </span>
                      <span className="text-slate-400">{log.decidedAt || log.requestedAt}</span>
                    </div>

                    <div className="font-semibold text-slate-100 text-xs">{log.actionName}</div>
                    <div className="text-slate-400 text-[10px] mt-0.5">
                      Target: {log.target} | Tool: {log.tool}
                    </div>

                    <div className="mt-2 bg-slate-950 p-2 rounded border border-slate-800 text-[11px] text-slate-300">
                      <span className="text-slate-500 block text-[10px]">Analyst Justification:</span>
                      "{log.analystComment || 'No comment provided'}"
                    </div>

                    {log.executionResult && (
                      <div className="mt-2 bg-slate-950 p-2 rounded border border-slate-800 text-[10px] text-emerald-300">
                        <span className="text-cyan-400 font-bold block mb-0.5">Execution Result:</span>
                        <pre className="whitespace-pre-wrap">{log.executionResult}</pre>
                      </div>
                    )}
                  </div>
                );
              })}

              {auditLog.length === 0 && (
                <div className="py-6 text-center text-slate-500 text-xs">
                  No authorization decisions logged yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
