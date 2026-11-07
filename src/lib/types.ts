/**
 * Types & Schemas for DataOps VAPT AI Agent Platform
 * Compliant with NIST SP 800-115, OWASP Top 10, MITRE ATT&CK, CVSS v3.1
 */

export type ToolName = 
  | 'Nmap'
  | 'Nessus'
  | 'OpenVAS'
  | 'Nikto'
  | 'OWASP ZAP'
  | 'Burp Suite'
  | 'Metasploit';

export type IntegrationStatusType = 'Live' | 'Import-only' | 'Planned' | 'Unsupported';

export interface ToolMetadata {
  id: ToolName;
  name: string;
  category: 'Network Recon' | 'Infrastructure' | 'Web Server' | 'Web Application' | 'Exploitation / Validation';
  primaryRole: string;
  integrationType: IntegrationStatusType;
  cliOrApi: string;
  licensingDisclosure: string;
  capabilities: string[];
  supportedImportFormats: string[];
}

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export type ConfidenceLevel = 'Confirmed' | 'High' | 'Medium' | 'Suspected';

export type ValidationStatus = 
  | 'Unvalidated' 
  | 'Pending Human Approval' 
  | 'Validated - Confirmed Exploitable' 
  | 'Validated - Safe Proof-of-Concept' 
  | 'Rejected by Analyst' 
  | 'False Positive Flagged';

export interface RawEvidence {
  id: string;
  tool: ToolName;
  timestamp: string;
  evidenceType: 'HTTP Request/Response' | 'Port Banner' | 'Terminal Log' | 'Configuration Check' | 'Exploit Payload Output';
  summary: string;
  details: string;
  requestDump?: string;
  responseDump?: string;
  commandExecuted?: string;
}

export interface NormalizedFinding {
  id: string;
  title: string;
  affectedAsset: string;
  port?: number;
  protocol?: string;
  service?: string;
  sourceTools: ToolName[];
  severity: SeverityLevel;
  cvssScore: number;
  cvssVector: string;
  cveId?: string;
  cweId?: string;
  mitreAttackId?: string;
  owaspCategory?: string;
  description: string;
  technicalImpact: string;
  businessImpact: string;
  remediation: string;
  references: string[];
  evidenceList: RawEvidence[];
  confidence: ConfidenceLevel;
  validationStatus: ValidationStatus;
  isDuplicateMerged?: boolean;
  duplicateCount?: number;
  riskScore: number; // 0 - 100 calculated score
}

export interface UnnormalizedFindingInput {
  title: string;
  tool: ToolName;
  affectedAsset: string;
  port?: number;
  protocol?: string;
  service?: string;
  cveId?: string;
  cweId?: string;
  mitreAttackId?: string;
  owaspCategory?: string;
  cvssScore: number;
  cvssVector: string;
  severity: SeverityLevel;
  description: string;
  technicalImpact: string;
  businessImpact: string;
  remediation: string;
  references: string[];
  evidence: RawEvidence;
  confidence?: ConfidenceLevel;
}

export interface AuthorizedScope {
  id: string;
  targetName: string;
  allowedHosts: string[];
  allowedCidrs: string[];
  allowedPorts: string;
  forbiddenExclusions: string[];
  environment: 'Authorized Lab Sandbox' | 'Production (Strictly Prohibited)';
  authorizationContact: string;
  validUntil: string;
  rulesOfEngagement: string[];
}

export interface ScanJob {
  id: string;
  tool: ToolName;
  target: string;
  command: string;
  status: 'Queued' | 'Running' | 'Completed' | 'Failed' | 'Requires Approval';
  progress: number;
  startTime: string;
  endTime?: string;
  durationSeconds?: number;
  rawOutput: string;
  findingsFound: number;
  rationale: string;
  error?: string;
}

export interface HumanApprovalRequest {
  id: string;
  findingId: string;
  findingTitle: string;
  target: string;
  tool: ToolName; // Typically Metasploit or active Burp
  actionName: string;
  moduleOrPayload: string;
  intendedProof: string;
  potentialImpact: string;
  safetyControls: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  analystComment?: string;
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
  executionResult?: string;
}

export interface AgentDecisionTrace {
  id: string;
  timestamp: string;
  phase: 'Scope Verification' | 'Adaptive Planning' | 'Orchestration' | 'Correlation' | 'Risk Prioritization' | 'Human Gate' | 'Reporting';
  action: string;
  reasoning: string;
  observedEvidence?: string;
  aiInference?: string;
  status: 'Success' | 'Warning' | 'Blocked' | 'Info';
}

export interface VaptReportData {
  reportId: string;
  title: string;
  targetScope: AuthorizedScope;
  executiveSummary: {
    overview: string;
    overallPosture: 'Critical Risk' | 'High Risk' | 'Moderate Risk' | 'Compliant / Low Risk';
    criticalFindingsCount: number;
    highFindingsCount: number;
    mediumFindingsCount: number;
    lowFindingsCount: number;
    infoFindingsCount: number;
    keyRecommendations: string[];
  };
  methodology: {
    standard: string; // "NIST SP 800-115"
    rulesOfEngagement: string[];
    assetsTested: string[];
    toolExecutionSummary: {
      tool: ToolName;
      status: string;
      findingsCount: number;
    }[];
  };
  severityDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
    total: number;
  };
  findings: NormalizedFinding[];
  remediationRoadmap: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  limitations: {
    testingBoundaries: string[];
    assumptions: string[];
    scanFailures: string[];
    humanApprovalsRecorded: number;
    generatedAt: string;
    analystSignoff: string;
  };
}
