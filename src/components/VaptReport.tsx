import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Server, 
  Layers, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Flame,
  Activity
} from 'lucide-react';
import { NormalizedFinding, AuthorizedScope, ToolName, ScanJob } from '../lib/types';

interface VaptReportProps {
  activeScope: AuthorizedScope;
  findings: NormalizedFinding[];
  scanJobs: Record<ToolName, ScanJob>;
  approvalsRecorded: number;
}

export const VaptReport: React.FC<VaptReportProps> = ({
  activeScope,
  findings,
  scanJobs,
  approvalsRecorded,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrintPdf = () => {
    window.print();
  };

  const handleExportJson = () => {
    const reportData = {
      reportTitle: 'Unified Penetration Testing & Vulnerability Assessment Report',
      standard: 'NIST SP 800-115',
      generatedAt: new Date().toISOString(),
      targetScope: activeScope,
      toolExecutions: Object.values(scanJobs).map((j) => ({
        tool: j.tool,
        status: j.status,
        findingsDiscovered: j.findingsFound,
      })),
      severityDistribution: {
        critical: findings.filter((f) => f.severity === 'Critical').length,
        high: findings.filter((f) => f.severity === 'High').length,
        medium: findings.filter((f) => f.severity === 'Medium').length,
        low: findings.filter((f) => f.severity === 'Low').length,
        info: findings.filter((f) => f.severity === 'Informational').length,
        total: findings.length,
      },
      findings,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VAPT_Report_${activeScope.allowedHosts[0]}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const criticalCount = findings.filter((f) => f.severity === 'Critical').length;
  const highCount = findings.filter((f) => f.severity === 'High').length;
  const mediumCount = findings.filter((f) => f.severity === 'Medium').length;
  const lowCount = findings.filter((f) => f.severity === 'Low').length;

  const overallPosture =
    criticalCount > 0
      ? 'CRITICAL RISK POSTURE'
      : highCount > 0
      ? 'HIGH RISK POSTURE'
      : mediumCount > 0
      ? 'MODERATE RISK'
      : 'COMPLIANT / LOW RISK';

  return (
    <div className="space-y-6">
      {/* Top Controls Bar (hidden during window.print) */}
      <div className="print:hidden bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono mb-1">
            <FileText className="w-4 h-4" />
            <span>SECTION 7: CLIENT-READY UNIFIED VAPT REPORT</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Professional Penetration Testing Report
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Compliant with NIST SP 800-115, OWASP Top 10, MITRE ATT&CK, and CVSS v3.1 scoring.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportJson}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-lg border border-slate-700 transition flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handlePrintPdf}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-emerald-950/40 transition flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Download / Print PDF Report</span>
          </button>
        </div>
      </div>

      {/* Actual Printable VAPT Document */}
      <div
        ref={reportRef}
        className="bg-slate-900 border border-slate-800 print:bg-white print:border-none print:text-black rounded-xl p-6 sm:p-10 shadow-2xl space-y-8 max-w-5xl mx-auto"
      >
        {/* Document Header */}
        <div className="border-b border-slate-800 print:border-slate-300 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 print:text-emerald-700 font-bold mb-1 uppercase tracking-wider">
              <span>DATAOPS INNOVATION HACKATHON 2026</span>
              <span>•</span>
              <span>SOC / NOC / VAPT DIVISION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 print:text-slate-900 tracking-tight">
              Vulnerability Assessment & Penetration Testing Report
            </h1>
            <p className="text-slate-400 print:text-slate-600 text-xs font-mono mt-1">
              Document Ref: VAPT-REP-2026-0819 | Standard: NIST SP 800-115
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 print:text-slate-600">
            <div>Assessment Date: <strong className="text-slate-200 print:text-black">2026-11-04</strong></div>
            <div>Classification: <span className="text-rose-400 print:text-rose-700 font-bold">CONFIDENTIAL / CLIENT DELIVERY</span></div>
          </div>
        </div>

        {/* 7.1 Executive Summary */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-200 print:text-slate-900 uppercase tracking-wider font-mono border-b border-slate-800 print:border-slate-300 pb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            <span>7.1 Executive Summary</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 print:text-slate-700 leading-relaxed">
            Between <strong>2026-11-04 04:00 UTC</strong> and <strong>2026-11-04 04:15 UTC</strong>, an authorized, AI-orchestrated penetration test was performed against <strong>{activeScope.targetName}</strong> targeting asset <code>{activeScope.allowedHosts[0]}</code>. The objective was to discover exposed attack surfaces, audit configuration postures, test API security, correlate multi-scanner telemetry, and evaluate operational risk without causing service disruption.
          </p>

          {/* Posture Banner */}
          <div className="bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono text-slate-400 print:text-slate-500 uppercase block">
                Overall Risk Posture Rating
              </span>
              <div className="text-lg font-extrabold text-rose-400 print:text-rose-700 font-mono mt-0.5">
                {overallPosture}
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono">
              <div className="text-center px-3 py-1 bg-rose-950/60 print:bg-rose-100 border border-rose-500/30 rounded-lg">
                <span className="text-rose-400 print:text-rose-800 font-bold text-base block">{criticalCount}</span>
                <span className="text-[10px] text-slate-400 print:text-slate-600">Critical</span>
              </div>
              <div className="text-center px-3 py-1 bg-amber-950/60 print:bg-amber-100 border border-amber-500/30 rounded-lg">
                <span className="text-amber-400 print:text-amber-800 font-bold text-base block">{highCount}</span>
                <span className="text-[10px] text-slate-400 print:text-slate-600">High</span>
              </div>
              <div className="text-center px-3 py-1 bg-yellow-950/60 print:bg-yellow-100 border border-yellow-500/30 rounded-lg">
                <span className="text-yellow-400 print:text-yellow-800 font-bold text-base block">{mediumCount}</span>
                <span className="text-[10px] text-slate-400 print:text-slate-600">Medium</span>
              </div>
              <div className="text-center px-3 py-1 bg-blue-950/60 print:bg-blue-100 border border-blue-500/30 rounded-lg">
                <span className="text-blue-400 print:text-blue-800 font-bold text-base block">{lowCount}</span>
                <span className="text-[10px] text-slate-400 print:text-slate-600">Low</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7.2 Assessment Methodology */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-200 print:text-slate-900 uppercase tracking-wider font-mono border-b border-slate-800 print:border-slate-300 pb-1.5">
            <Server className="w-4 h-4 text-cyan-400 print:text-cyan-700" />
            <span>7.2 Assessment Methodology & Rules of Engagement</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 print:bg-slate-100 p-3.5 rounded-lg border border-slate-800 print:border-slate-300">
              <h4 className="font-bold text-slate-200 print:text-black mb-1">NIST SP 800-115 Phase Adherence</h4>
              <ul className="space-y-1 text-slate-400 print:text-slate-600 font-mono text-[11px]">
                <li>✓ Phase 1: Planning & Scope Demarcation</li>
                <li>✓ Phase 2: Discovery & Enumeration (Nmap, Nikto)</li>
                <li>✓ Phase 3: Attack Surface Attack Simulation (ZAP, Burp)</li>
                <li>✓ Phase 4: Reporting & Evidence Correlation</li>
              </ul>
            </div>
            <div className="bg-slate-950 print:bg-slate-100 p-3.5 rounded-lg border border-slate-800 print:border-slate-300">
              <h4 className="font-bold text-slate-200 print:text-black mb-1">Rules of Engagement</h4>
              <ul className="space-y-1 text-slate-400 print:text-slate-600 text-[11px]">
                <li>• Testing constrained strictly to {activeScope.allowedCidrs.join(', ')}</li>
                <li>• Denial of Service (DoS) explicitly prohibited</li>
                <li>• Human-in-the-Loop approval enforced for active validation</li>
              </ul>
            </div>
          </div>

          {/* Tool Execution Summary Table */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-300 print:text-slate-800 mb-2">
              Tool Execution & Adapter Status Matrix (All 7 Tools)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border border-slate-800 print:border-slate-300">
                <thead className="bg-slate-950 print:bg-slate-200 text-slate-400 print:text-slate-700">
                  <tr>
                    <th className="p-2 border-b border-slate-800 print:border-slate-300">Tool Name</th>
                    <th className="p-2 border-b border-slate-800 print:border-slate-300">Role</th>
                    <th className="p-2 border-b border-slate-800 print:border-slate-300">Execution Status</th>
                    <th className="p-2 border-b border-slate-800 print:border-slate-300">Findings Found</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200 text-[11px]">
                  {Object.entries(scanJobs).map(([tool, job]) => (
                    <tr key={tool} className="hover:bg-slate-950/40">
                      <td className="p-2 font-bold text-slate-200 print:text-black">{tool}</td>
                      <td className="p-2 text-slate-400 print:text-slate-600">{job.tool}</td>
                      <td className="p-2">
                        <span className="text-emerald-400 print:text-emerald-700 font-bold">
                          {job.status}
                        </span>
                      </td>
                      <td className="p-2 text-slate-300 print:text-black font-bold">
                        {job.findingsFound}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 7.3 Severity Distribution */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-200 print:text-slate-900 uppercase tracking-wider font-mono border-b border-slate-800 print:border-slate-300 pb-1.5">
            <Activity className="w-4 h-4 text-amber-400 print:text-amber-700" />
            <span>7.3 Severity Distribution & Risk Prioritization</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
            <div className="bg-slate-950 print:bg-slate-100 p-3 rounded-lg border border-slate-800 print:border-slate-300">
              <span className="text-slate-500 text-[10px] uppercase">Critical Risks</span>
              <div className="text-2xl font-bold text-rose-500">{criticalCount}</div>
            </div>
            <div className="bg-slate-950 print:bg-slate-100 p-3 rounded-lg border border-slate-800 print:border-slate-300">
              <span className="text-slate-500 text-[10px] uppercase">High Risks</span>
              <div className="text-2xl font-bold text-amber-500">{highCount}</div>
            </div>
            <div className="bg-slate-950 print:bg-slate-100 p-3 rounded-lg border border-slate-800 print:border-slate-300">
              <span className="text-slate-500 text-[10px] uppercase">Medium Risks</span>
              <div className="text-2xl font-bold text-yellow-500">{mediumCount}</div>
            </div>
            <div className="bg-slate-950 print:bg-slate-100 p-3 rounded-lg border border-slate-800 print:border-slate-300">
              <span className="text-slate-500 text-[10px] uppercase">Low Risks</span>
              <div className="text-2xl font-bold text-blue-500">{lowCount}</div>
            </div>
          </div>
        </section>

        {/* 7.4 Detailed Vulnerability Findings */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-200 print:text-slate-900 uppercase tracking-wider font-mono border-b border-slate-800 print:border-slate-300 pb-1.5">
            <Layers className="w-4 h-4 text-indigo-400 print:text-indigo-700" />
            <span>7.4 Detailed Vulnerability Findings & Evidence Trace</span>
          </div>

          <div className="space-y-5">
            {findings.map((f) => (
              <div
                key={f.id}
                className="bg-slate-950 print:bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-800 print:border-slate-300 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 print:border-slate-200 pb-2">
                  <div>
                    <div className="flex items-center space-x-2 font-mono text-[11px] mb-1">
                      <span className="font-bold text-slate-200 print:text-black">{f.id}</span>
                      <span className="bg-rose-950 print:bg-rose-100 text-rose-300 print:text-rose-800 px-1.5 py-0.2 rounded font-bold">
                        {f.severity} (CVSS {f.cvssScore})
                      </span>
                      {f.cveId && (
                        <span className="bg-slate-800 print:bg-slate-200 text-amber-300 print:text-amber-800 px-1.5 py-0.2 rounded">
                          {f.cveId}
                        </span>
                      )}
                      {f.cweId && (
                        <span className="bg-slate-800 print:bg-slate-200 text-cyan-300 print:text-cyan-800 px-1.5 py-0.2 rounded">
                          {f.cweId}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 print:text-slate-900">{f.title}</h3>
                  </div>

                  <div className="text-right font-mono text-[11px] text-slate-400 print:text-slate-600">
                    <div>Asset: <strong className="text-slate-200 print:text-black">{f.affectedAsset}:{f.port}</strong></div>
                    <div>Confidence: <span className="text-emerald-400 print:text-emerald-700">{f.confidence}</span></div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                  {f.description}
                </p>

                {/* Evidence Box */}
                <div className="bg-slate-900 print:bg-slate-100 p-3 rounded-lg border border-slate-800 print:border-slate-300 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 print:text-cyan-800 uppercase block">
                    Supporting Scanner Evidence ({f.evidenceList.length} sources preserved):
                  </span>
                  {f.evidenceList.map((ev, i) => (
                    <div key={i} className="text-[11px] font-mono text-slate-300 print:text-slate-700 space-y-1">
                      <div className="flex items-center space-x-2 text-slate-400 print:text-slate-600 text-[10px]">
                        <strong className="text-cyan-300 print:text-cyan-700">{ev.tool}</strong>
                        <span>[{ev.evidenceType}]</span>
                        <span>{ev.timestamp}</span>
                      </div>
                      <p className="text-slate-200 print:text-black font-medium">{ev.summary}</p>
                      {ev.requestDump && (
                        <pre className="bg-slate-950 print:bg-slate-200 p-2 rounded text-[10px] text-emerald-400 print:text-emerald-800 overflow-x-auto whitespace-pre-wrap">
                          {ev.requestDump}
                        </pre>
                      )}
                      {ev.responseDump && (
                        <pre className="bg-slate-950 print:bg-slate-200 p-2 rounded text-[10px] text-cyan-300 print:text-cyan-800 overflow-x-auto whitespace-pre-wrap">
                          {ev.responseDump}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>

                {/* Impact & Remediation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <strong className="text-rose-400 print:text-rose-800 font-mono block text-[11px]">Impact:</strong>
                    <span className="text-slate-400 print:text-slate-600 text-[11px]">{f.technicalImpact}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-400 print:text-emerald-800 font-mono block text-[11px]">Remediation:</strong>
                    <span className="text-slate-300 print:text-slate-700 text-[11px] font-mono">{f.remediation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7.5 Impact and Remediation Roadmap */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-200 print:text-slate-900 uppercase tracking-wider font-mono border-b border-slate-800 print:border-slate-300 pb-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            <span>7.5 Strategic Remediation Roadmap</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-rose-950/20 print:bg-rose-50 border border-rose-500/30 rounded-lg">
              <h4 className="font-bold text-rose-400 print:text-rose-800 font-mono text-[11px] mb-1">
                Immediate Actions (0 - 48 Hours)
              </h4>
              <p className="text-slate-300 print:text-slate-700 text-[11px] leading-relaxed">
                1. Upgrade Apache HTTP Server from 2.4.49 to 2.4.51+ to remediate CVE-2021-41773 path traversal.<br/>
                2. Remove vulnerable vsftpd 2.3.4 backdoor package on port 21.<br/>
                3. Apply parameterized queries to /api/v1/transfer to eliminate critical SQL Injection (CWE-89).
              </p>
            </div>
            <div className="p-3 bg-amber-950/20 print:bg-amber-50 border border-amber-500/30 rounded-lg">
              <h4 className="font-bold text-amber-400 print:text-amber-800 font-mono text-[11px] mb-1">
                Short-Term Actions (1 - 2 Weeks)
              </h4>
              <p className="text-slate-300 print:text-slate-700 text-[11px] leading-relaxed">
                1. Enforce strict object-level authorization (IDOR check) on /api/v1/accounts/ statements.<br/>
                2. Restrict public access to /.git and Spring Boot Actuator /actuator/heapdump.<br/>
                3. Disable deprecated TLS 1.0/1.1 ciphers across Apache virtual hosts.
              </p>
            </div>
            <div className="p-3 bg-emerald-950/20 print:bg-emerald-50 border border-emerald-500/30 rounded-lg">
              <h4 className="font-bold text-emerald-400 print:text-emerald-800 font-mono text-[11px] mb-1">
                Long-Term Posture (1 - 3 Months)
              </h4>
              <p className="text-slate-300 print:text-slate-700 text-[11px] leading-relaxed">
                1. Integrate continuous DAST/SAST automation into CI/CD pipelines.<br/>
                2. Deploy Content-Security-Policy and Strict-Transport-Security globally.<br/>
                3. Conduct quarterly third-party penetration retests.
              </p>
            </div>
          </div>
        </section>

        {/* 7.6 Assessment Limitations */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-200 print:text-slate-900 uppercase tracking-wider font-mono border-b border-slate-800 print:border-slate-300 pb-1.5">
            <AlertTriangle className="w-4 h-4 text-slate-400" />
            <span>7.6 Assessment Limitations & Human Gate Audit Trace</span>
          </div>

          <div className="bg-slate-950 print:bg-slate-100 p-4 rounded-lg border border-slate-800 print:border-slate-300 text-xs text-slate-400 print:text-slate-600 font-mono space-y-1.5">
            <div>• Testing strictly limited to authorized lab sandbox environment ({activeScope.allowedCidrs.join(', ')}).</div>
            <div>• Denial of Service (DoS) conditions were intentionally avoided to protect hypervisor health.</div>
            <div>• Human-in-the-Loop Gate recorded: <strong className="text-emerald-400 print:text-emerald-700">{approvalsRecorded} explicit human approvals/rejections</strong> for active validation actions.</div>
            <div>• Standards compliance: NIST SP 800-115, OWASP Top 10, CWE, MITRE ATT&CK, NIST CSF 2.0.</div>
            <div className="pt-2 text-[10px] text-slate-500 print:text-slate-400">
              Generated by DataOps AI VAPT Agent | Lead Security Analyst Sign-off Recorded.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
