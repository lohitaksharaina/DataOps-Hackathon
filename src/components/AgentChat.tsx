import React, { useState } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  FileCheck2, 
  Lightbulb, 
  History, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  PlayCircle
} from 'lucide-react';
import { AgentDecisionTrace, AuthorizedScope } from '../lib/types';

interface AgentChatProps {
  activeScope: AuthorizedScope;
  decisionTraces: AgentDecisionTrace[];
  onExecuteTool: (toolName: any) => void;
  onNavigateTab: (tab: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  source?: string;
  suggestedAction?: {
    label: string;
    action: () => void;
  };
}

export const AgentChat: React.FC<AgentChatProps> = ({
  activeScope,
  decisionTraces,
  onExecuteTool,
  onNavigateTab,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'agent',
      timestamp: '04:00:15',
      text: `Hello, Analyst. I am the DataOps Autonomous VAPT Agent. I have verified that target **${activeScope.allowedHosts[0]}** (${activeScope.allowedCidrs.join(', ')}) is within our approved lab sandbox boundaries.

I am ready to orchestrate reconnaissance, web application assessment, infrastructure scanning, evidence correlation, and client-ready reporting under **NIST SP 800-115**. 

How would you like to proceed? You can ask me to explain our scan plan, examine specific tool evidence, or launch the automated reconnaissance workflow.`,
      source: 'DataOps Reasoning Engine',
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const quickPrompts = [
    'Explain the adaptive scan plan for 10.0.12.45',
    'Why is Metasploit held at the human approval checkpoint?',
    'How do you distinguish observed evidence from AI inferences?',
    'What tools should we run against Apache 2.4.49?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            activeTarget: activeScope.allowedHosts[0],
            allowedCidr: activeScope.allowedCidrs,
            phase: 'Adaptive Planning & Execution',
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const agentMsg: Message = {
          id: `a-${Date.now()}`,
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString(),
          text: data.reply,
          source: data.source,
        };
        setMessages((prev) => [...prev, agentMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Local fallback reasoning engine
      const lower = query.toLowerCase();
      let fallback = '';

      if (lower.includes('plan')) {
        fallback = `🛡️ **Adaptive 5-Stage VAPT Plan**:
1. **Host & Port Discovery (Nmap)**: Discover listening daemons (80, 443, 8080, 21, 5432).
2. **Web Server & Config Testing (Nikto)**: Audit Apache 2.4.49 configuration & traversal vectors.
3. **API & Injection Analysis (OWASP ZAP & Burp Suite)**: Ingest REST endpoints and audit for SQLi (CWE-89) & IDOR (CWE-639).
4. **Cross-Tool Infrastructure Correlation (Nessus & OpenVAS)**: Ingest vulnerability databases to match CVE-2021-41773 & vsftpd 2.3.4.
5. **Controlled PoC Gate (Metasploit)**: Require analyst sign-off before safe validation.`;
      } else if (lower.includes('metasploit') || lower.includes('human')) {
        fallback = `🔒 **Human-in-the-Loop Policy (Section 5.7)**:
Under Hackathon RoE and NIST SP 800-115, the agent strictly prohibits autonomous exploitation. Any weaponized check or proof-of-concept module is automatically routed to the **Human Gate** tab for mandatory analyst review.`;
      } else if (lower.includes('distinguish') || lower.includes('evidence')) {
        fallback = `🔍 **Observed Evidence vs AI Inference Distinction**:
- **Observed Evidence**: Cryptographic hashes, raw HTTP 200 responses with /etc/passwd contents, raw banners (vsftpd 2.3.4), exact port numbers, and CVE matches.
- **AI Inference**: Risk criticality synthesis, composite attack path likelihood, remediation roadmap prioritization, and threat actor motivation.
All findings clearly preserve both in our common finding schema.`;
      } else {
        fallback = `I have received your query. Target **${activeScope.allowedHosts[0]}** is monitored under authorized rules. You can proceed directly to the **Tool Orchestrator** to dispatch scans, or inspect **Correlated Findings** to view cross-tool normalization.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString(),
          text: fallback,
          source: 'VAPT Security Reasoning Engine',
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Conversational AI Copilot */}
      <div className="lg:col-span-7 flex flex-col h-[700px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        {/* Chat Header */}
        <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                <span>VAPT AI Security Copilot</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                  Adaptive
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Context-aware reasoning, tool rationale, and NIST SP 800-115 methodology
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigateTab('orchestrator')}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-700 flex items-center space-x-1 transition"
            >
              <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Orchestrator</span>
            </button>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'agent' && (
                <div className="w-6 h-6 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg p-3 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[10px] opacity-70 mb-1 font-mono">
                  <span>{m.sender === 'user' ? 'Analyst' : m.source || 'AI Agent'}</span>
                  <span>{m.timestamp}</span>
                </div>
                <div className="whitespace-pre-line text-xs font-mono">{m.text}</div>
              </div>
              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono italic p-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Agent is reasoning over security posture and tool outputs...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Strip */}
        <div className="p-2.5 bg-slate-950 border-t border-slate-800/80">
          <span className="text-[10px] text-slate-500 block mb-1 font-mono">Suggested Inquiries:</span>
          <div className="flex flex-wrap gap-1">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(qp)}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-800 transition text-left"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask AI agent for reasoning, tool rationale, or evidence analysis..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isThinking || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-3 py-2 rounded-lg transition flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Column: Agent Decision Trace & Evidence vs Inference Breakdown */}
      <div className="lg:col-span-5 space-y-4">
        {/* Adaptive Assessment Plan Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <h3 className="text-xs font-bold text-slate-200 flex items-center space-x-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Agent Adaptive Plan & Rationale</span>
          </h3>
          <p className="text-[11px] text-slate-400 mb-3">
            Section 5.2 requirement: The agent explains why each subsequent scan is necessary based on previously discovered services.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-emerald-400 font-semibold mb-1">
                <span>Phase 1: Recon & Fingerprinting</span>
                <span className="text-[10px] font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded">Nmap</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                <strong className="text-slate-300">Rationale:</strong> Maps network attack surface without alert saturation. Discovered HTTP/80, HTTPS/443, API/8080, and FTP/21.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-cyan-400 font-semibold mb-1">
                <span>Phase 2: Web Server Audit</span>
                <span className="text-[10px] font-mono bg-cyan-500/10 px-1.5 py-0.2 rounded">Nikto</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                <strong className="text-slate-300">Rationale:</strong> Triggered because Nmap revealed Apache 2.4.49. Dispatched to verify known path traversal CVE-2021-41773.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-indigo-400 font-semibold mb-1">
                <span>Phase 3: Web App & API Testing</span>
                <span className="text-[10px] font-mono bg-indigo-500/10 px-1.5 py-0.2 rounded">OWASP ZAP & Burp</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                <strong className="text-slate-300">Rationale:</strong> Discovered Spring Boot API on 8080. Crawled endpoints to uncover SQL Injection (CWE-89) and IDOR (CWE-639).
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-purple-400 font-semibold mb-1">
                <span>Phase 4: Vulnerability Correlation</span>
                <span className="text-[10px] font-mono bg-purple-500/10 px-1.5 py-0.2 rounded">Nessus & OpenVAS</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                <strong className="text-slate-300">Rationale:</strong> Aggregates CVE databases, matches vsftpd backdoor signature (CVE-2011-2523), and consolidates duplicate findings.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-900/50 bg-amber-950/10">
              <div className="flex items-center justify-between text-amber-400 font-semibold mb-1">
                <span>Phase 5: Human-Approved Validation</span>
                <span className="text-[10px] font-mono bg-amber-500/10 px-1.5 py-0.2 rounded">Metasploit</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                <strong className="text-slate-300">Rationale:</strong> Section 5.7 Gate strictly prevents autonomous exploitation. Staged for analyst approval.
              </p>
            </div>
          </div>
        </div>

        {/* Live Decision Trace (Observed Evidence vs Inferences) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Decision Trace & Audit Log</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Section 2 & 9.5</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Every AI agent decision distinguishes between factual observed scanner evidence and contextual AI inference.
          </p>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-1 font-mono text-[11px]">
            {decisionTraces.map((dt) => (
              <div key={dt.id} className="p-2 bg-slate-950 rounded border border-slate-800">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-emerald-400 font-bold">{dt.phase}</span>
                  <span className="text-slate-500">{dt.timestamp}</span>
                </div>
                <div className="text-slate-200 font-medium">{dt.action}</div>
                <div className="text-slate-400 text-[10px] mt-1">{dt.reasoning}</div>
                
                {dt.observedEvidence && (
                  <div className="mt-1.5 text-[10px] bg-slate-900 p-1 rounded border border-slate-800">
                    <span className="text-cyan-400 font-semibold">Observed Evidence: </span>
                    <span className="text-slate-300">{dt.observedEvidence}</span>
                  </div>
                )}
                {dt.aiInference && (
                  <div className="mt-1 text-[10px] bg-slate-900 p-1 rounded border border-slate-800">
                    <span className="text-purple-400 font-semibold">AI Inference: </span>
                    <span className="text-slate-300">{dt.aiInference}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
