import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  FileCode, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  Server,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { INTEGRATION_MATRIX } from '../lib/toolIntegrations';

export const IntegrationMatrixView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono mb-1">
            <Activity className="w-4 h-4" />
            <span>SECTION 6 & 9.6: TRUTHFUL INTEGRATION TRANSPARENCY MATRIX</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Tool Integration Status & Licensing Disclosures
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            As mandated by Section 6 of the hackathon problem statement: "Teams must clearly disclose which integrations execute live scans and which only import recorded outputs. Commercial tool availability and licensing must not be misrepresented."
          </p>
        </div>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATION_MATRIX.map((tool) => (
          <div
            key={tool.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                  {tool.category}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">{tool.name}</h3>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                  tool.integrationType === 'Live'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                }`}
              >
                ● {tool.integrationType}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {tool.primaryRole}
            </p>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">Command / API Execution:</span>
                <code className="text-cyan-300 text-[11px] block mt-0.5 break-all">
                  {tool.cliOrApi}
                </code>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Licensing Disclosure:</span>
                <span className="text-slate-300 text-[11px] block mt-0.5">
                  {tool.licensingDisclosure}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Supported Import Formats:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tool.supportedImportFormats.map((fmt) => (
                    <span key={fmt} className="bg-slate-900 text-slate-300 px-1.5 py-0.2 rounded text-[10px] border border-slate-800">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                Supported Assessment Capabilities:
              </span>
              <div className="flex flex-wrap gap-1">
                {tool.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="text-[11px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800/80"
                  >
                    ✓ {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assumptions & Known Limitations Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Known Limitations, Assumptions & Unsupported Scenarios (Section 9.6)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-200">1. Commercial Tool Boundaries</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Tenable Nessus and Burp Suite Pro are commercial licensed software. They are supported via native XML/JSON export ingestion and official REST APIs without misrepresenting proprietary licensing.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-200">2. Lab Sandbox Scope Boundary</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Active testing is restricted to organizer-authorized lab networks (10.0.12.0/24). Production domains, cloud hypervisors, and public third-party IPs are rejected at the scope filter.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-200">3. Safe Exploitation Check Mode</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Metasploit integration operates exclusively in human-approved "check" / non-destructive proof-of-concept mode. Autonomous weaponization and system destruction are disabled by design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
