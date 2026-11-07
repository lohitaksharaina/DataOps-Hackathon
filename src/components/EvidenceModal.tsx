import React from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Terminal, 
  FileText, 
  Tag, 
  Copy, 
  Layers, 
  AlertTriangle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { NormalizedFinding } from '../lib/types';

interface EvidenceModalProps {
  finding: NormalizedFinding | null;
  onClose: () => void;
  onRequestValidation?: (finding: NormalizedFinding) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  finding,
  onClose,
  onRequestValidation,
}) => {
  if (!finding) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-rose-950/80 border-rose-500/50 text-rose-300';
      case 'High':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
      case 'Medium':
        return 'bg-yellow-950/80 border-yellow-500/50 text-yellow-300';
      case 'Low':
        return 'bg-blue-950/80 border-blue-500/50 text-blue-300';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl my-6">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono mb-1">
              <span className="font-bold text-slate-300">{finding.id}</span>
              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getSeverityBadgeClass(finding.severity)}`}>
                {finding.severity.toUpperCase()} (CVSS {finding.cvssScore})
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded">
                Risk Score: <strong className="text-emerald-400">{finding.riskScore}/100</strong>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-1.5 py-0.5 rounded">
                Confidence: {finding.confidence}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-100">{finding.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs text-slate-300 font-sans">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block">Affected Asset:</span>
              <span className="text-slate-200 font-bold">{finding.affectedAsset}:{finding.port || 'all'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Correlated Tools:</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {finding.sourceTools.map((t) => (
                  <span key={t} className="bg-slate-800 text-cyan-300 px-1.5 py-0.2 rounded text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-slate-500 block">CVE / CWE Reference:</span>
              <span className="text-amber-400 font-bold">{finding.cveId || finding.cweId || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Validation State:</span>
              <span className="text-emerald-400">{finding.validationStatus}</span>
            </div>
          </div>

          {/* Description & Technical Breakdown */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1 font-mono">
                Detailed Vulnerability Description
              </h3>
              <p className="text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                {finding.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                <h4 className="font-mono text-[11px] font-bold text-rose-400 mb-1">Technical Impact</h4>
                <p className="text-slate-400 text-xs">{finding.technicalImpact}</p>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                <h4 className="font-mono text-[11px] font-bold text-amber-400 mb-1">Business Impact</h4>
                <p className="text-slate-400 text-xs">{finding.businessImpact}</p>
              </div>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-lg">
              <h4 className="font-mono text-[11px] font-bold text-emerald-400 mb-1 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Actionable Remediation Guidance</span>
              </h4>
              <p className="text-slate-200 text-xs font-mono">{finding.remediation}</p>
            </div>
          </div>

          {/* Supporting Evidence Trace (Section 5.5 Requirement) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                <Terminal className="w-4 h-4" />
                <span>Supporting Raw Evidence Trace ({finding.evidenceList.length} items preserved)</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Section 5.5 Compliant</span>
            </div>

            <div className="space-y-3">
              {finding.evidenceList.map((ev, idx) => (
                <div key={ev.id || idx} className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-800/80 pb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="bg-slate-800 text-cyan-400 px-1.5 py-0.5 rounded font-bold">
                        {ev.tool}
                      </span>
                      <span className="text-slate-400">{ev.evidenceType}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500 text-[10px]">
                      <Clock className="w-3 h-3" />
                      <span>{ev.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-slate-300">{ev.summary}</p>

                  {ev.commandExecuted && (
                    <div className="bg-slate-900 p-2 rounded text-[11px] font-mono text-slate-400">
                      <span className="text-emerald-400 font-bold">$ </span>
                      {ev.commandExecuted}
                    </div>
                  )}

                  {ev.requestDump && (
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block mb-1">HTTP Request:</span>
                      <pre className="bg-slate-900 border border-slate-800 rounded p-2 text-[10px] font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                        {ev.requestDump}
                      </pre>
                    </div>
                  )}

                  {ev.responseDump && (
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block mb-1">HTTP Response / Proof:</span>
                      <pre className="bg-slate-900 border border-slate-800 rounded p-2 text-[10px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                        {ev.responseDump}
                      </pre>
                    </div>
                  )}

                  {!ev.requestDump && !ev.responseDump && ev.details && (
                    <pre className="bg-slate-900 border border-slate-800 rounded p-2 text-[10px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                      {ev.details}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* References */}
          {finding.references.length > 0 && (
            <div>
              <span className="text-[11px] font-mono text-slate-500 block mb-1">Advisory References:</span>
              <div className="flex flex-wrap gap-2">
                {finding.references.map((ref, idx) => (
                  <a
                    key={idx}
                    href={ref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-[11px] font-mono text-cyan-400 hover:underline bg-slate-950 px-2 py-1 rounded border border-slate-800"
                  >
                    <span>{ref}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            CVSS Vector: <code className="text-slate-400">{finding.cvssVector}</code>
          </span>
          <div className="flex items-center space-x-2">
            {onRequestValidation && (
              <button
                onClick={() => onRequestValidation(finding)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition"
              >
                Stage for Controlled PoC Validation
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
