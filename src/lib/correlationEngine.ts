/**
 * Normalization & Cross-Tool Correlation Engine
 * Implements Sections 5.4, 5.5, and 5.6 of the hackathon specification.
 * - Maps tool-specific findings into Common Finding Schema
 * - Deduplicates across Nmap, Nessus, OpenVAS, Nikto, OWASP ZAP, Burp Suite, Metasploit
 * - Corroborates evidence and calibrates confidence
 * - Computes defensible risk scores based on CVSS v3.1, exposure, exploitability, and asset impact
 */

import { 
  NormalizedFinding, 
  RawEvidence, 
  SeverityLevel, 
  ConfidenceLevel, 
  ToolName,
  UnnormalizedFindingInput 
} from './types';

export type { UnnormalizedFindingInput };

/**
 * Calculates a composite 0-100 Risk Score based on CVSS, Asset Exposure, Exploitability, and Confidence.
 * Meets Section 5.6: "Evaluate vulnerabilities by considering: Severity and CVSS, Exposure, Exploitability, Asset impact, Confidence level."
 */
export function calculateRiskScore(params: {
  cvssScore: number;
  isExternallyExposed: boolean;
  hasActivePocOrModule: boolean;
  confidence: ConfidenceLevel;
  isHighValueAsset: boolean;
}): number {
  // Base weight from CVSS (0 - 10) * 6 => up to 60 points
  let score = params.cvssScore * 6;

  // Exposure weight: +15 if external, +5 if internal lab DMZ
  score += params.isExternallyExposed ? 15 : 5;

  // Exploitability: +15 if working PoC / Metasploit module exists, +5 if theoretical
  score += params.hasActivePocOrModule ? 15 : 5;

  // Confidence factor multiplier
  const confidenceMultiplier = {
    Confirmed: 1.0,
    High: 0.9,
    Medium: 0.75,
    Suspected: 0.6,
  }[params.confidence];

  // Asset impact bonus
  if (params.isHighValueAsset) {
    score += 10;
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(score * confidenceMultiplier)));
  return finalScore;
}

/**
 * Deduplication & Correlation Key
 * Groups findings that target the same asset, port, and either CVE or normalized signature
 */
export function generateCorrelationKey(f: UnnormalizedFindingInput): string {
  const asset = f.affectedAsset.toLowerCase();
  const port = f.port ? `:${f.port}` : '';
  if (f.cveId) {
    return `${asset}${port}::CVE::${f.cveId.toUpperCase()}`;
  }
  if (f.cweId) {
    return `${asset}${port}::CWE::${f.cweId.toUpperCase()}`;
  }
  // Title slug
  const titleSlug = f.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 30);
  return `${asset}${port}::SIG::${titleSlug}`;
}

/**
 * Correlates raw findings from multiple tools into normalized findings
 */
export function correlateAndDeduplicateFindings(
  rawFindings: UnnormalizedFindingInput[],
  isHighValueAsset = true
): NormalizedFinding[] {
  const groups = new Map<string, UnnormalizedFindingInput[]>();

  for (const item of rawFindings) {
    const key = generateCorrelationKey(item);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }

  const correlated: NormalizedFinding[] = [];
  let index = 1;

  for (const [, items] of groups.entries()) {
    const primary = items[0];
    const sourceTools = Array.from(new Set(items.map((i) => i.tool)));
    const mergedEvidence: RawEvidence[] = items.map((i) => i.evidence);

    // If multiple tools corroborated this, calibrate confidence up to Confirmed!
    let confidence: ConfidenceLevel = primary.confidence || 'Medium';
    if (sourceTools.length > 1) {
      confidence = 'Confirmed';
    } else if (primary.cveId && primary.evidence.requestDump) {
      confidence = 'High';
    }

    // Merge references
    const allRefs = Array.from(new Set(items.flatMap((i) => i.references)));

    // Choose highest CVSS among reports
    const maxCvss = Math.max(...items.map((i) => i.cvssScore));
    const highestCvssItem = items.find((i) => i.cvssScore === maxCvss) || primary;

    const hasMetasploitOrExploit =
      sourceTools.includes('Metasploit') ||
      items.some((i) => i.description.toLowerCase().includes('exploit') || i.cveId === 'CVE-2021-41773');

    const isExternallyExposed = primary.port === 80 || primary.port === 443 || primary.port === 8080;

    const riskScore = calculateRiskScore({
      cvssScore: maxCvss,
      isExternallyExposed,
      hasActivePocOrModule: hasMetasploitOrExploit,
      confidence,
      isHighValueAsset,
    });

    correlated.push({
      id: `VAPT-${String(index++).padStart(3, '0')}`,
      title: primary.title,
      affectedAsset: primary.affectedAsset,
      port: primary.port,
      protocol: primary.protocol || 'TCP',
      service: primary.service,
      sourceTools,
      severity: highestCvssItem.severity,
      cvssScore: maxCvss,
      cvssVector: highestCvssItem.cvssVector,
      cveId: primary.cveId,
      cweId: primary.cweId,
      mitreAttackId: primary.mitreAttackId,
      owaspCategory: primary.owaspCategory,
      description: primary.description,
      technicalImpact: primary.technicalImpact,
      businessImpact: primary.businessImpact,
      remediation: primary.remediation,
      references: allRefs,
      evidenceList: mergedEvidence,
      confidence,
      validationStatus: sourceTools.includes('Metasploit')
        ? 'Validated - Safe Proof-of-Concept'
        : 'Unvalidated',
      isDuplicateMerged: items.length > 1,
      duplicateCount: items.length,
      riskScore,
    });
  }

  // Sort by riskScore descending (Risk Prioritization - Section 5.6)
  return correlated.sort((a, b) => b.riskScore - a.riskScore);
}
