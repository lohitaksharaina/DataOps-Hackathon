import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Eye, 
  ShieldCheck, 
  AlertCircle, 
  ArrowUpDown, 
  CheckCircle2, 
  Lock, 
  ExternalLink,
  Flame,
  FileText
} from 'lucide-react';
import { NormalizedFinding, SeverityLevel, ToolName } from '../lib/types';
import { EvidenceModal } from './EvidenceModal';

interface CorrelationViewProps {
  findings: NormalizedFinding[];
  onOpenEvidence: (finding: NormalizedFinding) => void;
  onRequestValidation: (finding: NormalizedFinding) => void;
  onProceedToHumanGate: () => void;
  onProceedToReport: () => void;
}

export const CorrelationView: React.FC<CorrelationViewProps> = ({
  findings,
  onOpenEvidence,
  onRequestValidation,
  onProceedToHumanGate,
  onProceedToReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedTool, setSelectedTool] = useState<string>('ALL');
  const [selectedFindingForModal, setSelectedFindingForModal] = useState<NormalizedFinding | null>(null);

  const filteredFindings = findings.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.cveId && f.cveId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.cweId && f.cweId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.affectedAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.port && f.port.toString().includes(searchQuery));

    const matchesSeverity = selectedSeverity === 'ALL' || f.severity === selectedSeverity;
    const matchesTool = selectedTool === 'ALL' || f.sourceTools.includes(selectedTool as ToolName);

    return matchesSearch && matchesSeverity && matchesTool;
  });

  const getSeverityBadgeClass = (sev: SeverityLevel) => {
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
        return 'bg-slate-800 border-slate-700 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono mb-1">
              <Layers className="w-4 h-4" />
              <span>SECTION 5.4, 5.5 & 5.6: EVIDENCE NORMALIZATION & CROSS-TOOL CORRELATION</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Correlated Vulnerability Intelligence
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Cross-correlates multi-scanner findings into a unified Common Finding Schema. Deduplicates redundant detections, calibrates confidence up to 'Confirmed' when verified by multiple tools, and preserves complete evidence traceability.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-center">
            <button
              onClick={onProceedToHumanGate}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-sm transition flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Human Approval Gate</span>
            </button>
            <button
              onClick={onProceedToReport}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-sm transition flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate VAPT Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, CVE, CWE, port..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Severity:</span>
          </div>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="flex items-center space-x-1 text-xs text-slate-400 ml-2">
            <span>Tool:</span>
          </div>
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
          >
            <option value="ALL">All Tools</option>
            <option value="Nmap">Nmap</option>
            <option value="Nikto">Nikto</option>
            <option value="OWASP ZAP">OWASP ZAP</option>
            <option value="Nessus">Nessus</option>
            <option value="OpenVAS">OpenVAS</option>
            <option value="Burp Suite">Burp Suite</option>
            <option value="Metasploit">Metasploit</option>
          </select>
        </div>
      </div>

      {/* Correlated Findings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            Showing <strong className="text-slate-200">{filteredFindings.length}</strong> normalized findings
          </span>
          <span className="text-slate-500 text-[11px]">
            Sorted by Risk Prioritization Formula (CVSS + Exposure + PoC + Confidence)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">ID & Title</th>
                <th className="py-2.5 px-3">Target Asset</th>
                <th className="py-2.5 px-3">Severity & CVSS</th>
                <th className="py-2.5 px-3">Correlated Tools</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3 text-right">Evidence & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredFindings.map((finding) => (
                <tr
                  key={finding.id}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedFindingForModal(finding)}
                >
                  <td className="py-3 px-3 max-w-xs">
                    <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-400 mb-0.5">
                      <span className="font-bold text-slate-200">{finding.id}</span>
                      {finding.cveId && (
                        <span className="bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded text-[10px]">
                          {finding.cveId}
                        </span>
                      )}
                      {finding.isDuplicateMerged && (
                        <span className="bg-indigo-950/70 text-indigo-300 border border-indigo-500/30 text-[9px] px-1 py-0.2 rounded font-mono">
                          Merged ({finding.duplicateCount}x)
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-100 text-xs line-clamp-1">
                      {finding.title}
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-xs">
                    <div className="text-slate-200">{finding.affectedAsset}</div>
                    <div className="text-[10px] text-slate-500">
                      Port {finding.port || 'N/A'} ({finding.service || finding.protocol})
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadgeClass(
                          finding.severity
                        )}`}
                      >
                        {finding.severity}
                      </span>
                      <span className="text-xs font-mono text-slate-300 font-semibold">
                        {finding.cvssScore}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {finding.sourceTools.map((tool) => (
                        <span
                          key={tool}
                          className="bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[10px] px-1.5 py-0.5 rounded"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-xs">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        finding.confidence === 'Confirmed'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {finding.confidence}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            finding.riskScore >= 80
                              ? 'bg-rose-500'
                              : finding.riskScore >= 50
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${finding.riskScore}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-200">
                        {finding.riskScore}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => setSelectedFindingForModal(finding)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-[11px] font-medium flex items-center space-x-1 transition"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span>Evidence ({finding.evidenceList.length})</span>
                      </button>

                      {onRequestValidation && (
                        <button
                          onClick={() => onRequestValidation(finding)}
                          className="bg-amber-600/80 hover:bg-amber-500 text-white px-2 py-1 rounded text-[11px] font-medium flex items-center space-x-1 transition"
                          title="Stage for Controlled Validation Check"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Stage PoC</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredFindings.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono text-xs">
                    No findings match current filter criteria. Run tool scans in the Orchestrator tab to ingest findings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Modal Popup */}
      {selectedFindingForModal && (
        <EvidenceModal
          finding={selectedFindingForModal}
          onClose={() => setSelectedFindingForModal(null)}
          onRequestValidation={onRequestValidation}
        />
      )}
    </div>
  );
};
