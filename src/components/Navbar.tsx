import React from 'react';
import { 
  Shield, 
  Terminal, 
  Activity, 
  CheckCircle2, 
  FileText, 
  AlertTriangle, 
  Cpu, 
  Layers, 
  ClipboardCheck,
  UserCheck
} from 'lucide-react';
import { AuthorizedScope } from '../lib/types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeScope: AuthorizedScope;
  pendingApprovalsCount: number;
  totalFindingsCount: number;
  onQuickRunAll: () => void;
  isScanningAny: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeScope,
  pendingApprovalsCount,
  totalFindingsCount,
  onQuickRunAll,
  isScanningAny,
}) => {
  const tabs = [
    { id: 'scope', label: 'Scope & RoE', icon: Shield },
    { id: 'agent', label: 'AI Agent & Plan', icon: Cpu },
    { id: 'orchestrator', label: 'Tool Orchestrator', icon: Terminal },
    { id: 'correlation', label: `Correlated Findings (${totalFindingsCount})`, icon: Layers },
    { 
      id: 'approval', 
      label: 'Human Gate', 
      icon: UserCheck, 
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined 
    },
    { id: 'report', label: 'VAPT Report', icon: FileText },
    { id: 'matrix', label: 'Tool Matrix', icon: Activity },
    { id: 'judges', label: "Judges' Checklist", icon: ClipboardCheck },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 select-none">
      {/* Top Brand & Status Strip */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
                DataOps SOC / VAPT
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">NIST SP 800-115</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
              AI Agent for Automated Penetration Testing
            </h1>
          </div>
        </div>

        {/* Target Scope Badge & Quick Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Target:</span>
            <span className="font-mono text-slate-200 font-medium">{activeScope.allowedHosts[0]}</span>
            <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Lab Authorized
            </span>
          </div>

          <button
            onClick={onQuickRunAll}
            disabled={isScanningAny}
            className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition shadow-sm ${
              isScanningAny
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${isScanningAny ? 'animate-spin' : ''}`} />
            <span>{isScanningAny ? 'Orchestrating...' : 'Run Lab Scans'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none border-t border-slate-800/60 py-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors relative ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="ml-1.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
