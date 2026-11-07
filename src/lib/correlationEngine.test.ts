import test from 'node:test';
import assert from 'node:assert/strict';
import {
  correlateAndDeduplicateFindings,
  calculateRiskScore,
  generateCorrelationKey,
  UnnormalizedFindingInput,
} from './correlationEngine';

test('generateCorrelationKey properly identifies same CVE across tools', () => {
  const f1: UnnormalizedFindingInput = {
    title: 'Apache HTTP Server Path Traversal',
    tool: 'Nikto',
    affectedAsset: '10.0.12.45',
    port: 80,
    cveId: 'CVE-2021-41773',
    cvssScore: 7.5,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
    severity: 'High',
    description: 'Path traversal flaw in Apache 2.4.49',
    technicalImpact: 'Arbitrary file read',
    businessImpact: 'Data exposure',
    remediation: 'Upgrade to Apache 2.4.51',
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2021-41773'],
    evidence: {
      id: 'ev-1',
      tool: 'Nikto',
      timestamp: '2026-11-04T04:00:00Z',
      evidenceType: 'HTTP Request/Response',
      summary: 'Directory traversal test returned /etc/passwd excerpt',
      details: 'HTTP/1.1 200 OK\nroot:x:0:0:root:/root:/bin/bash',
    },
  };

  const f2: UnnormalizedFindingInput = {
    ...f1,
    tool: 'Nessus',
    title: 'Nessus Plugin 153723 - Apache 2.4.49 Path Traversal',
    cvssScore: 7.5,
    evidence: {
      id: 'ev-2',
      tool: 'Nessus',
      timestamp: '2026-11-04T04:05:00Z',
      evidenceType: 'Configuration Check',
      summary: 'Banner matches vulnerable Apache 2.4.49',
      details: 'Remote service banner: Server: Apache/2.4.49 (Unix)',
    },
  };

  assert.equal(generateCorrelationKey(f1), generateCorrelationKey(f2));
});

test('correlateAndDeduplicateFindings merges multi-tool evidence and elevates confidence to Confirmed', () => {
  const raw: UnnormalizedFindingInput[] = [
    {
      title: 'Apache Path Traversal',
      tool: 'Nikto',
      affectedAsset: '10.0.12.45',
      port: 80,
      cveId: 'CVE-2021-41773',
      cvssScore: 7.5,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
      severity: 'High',
      description: 'Nikto detected path traversal',
      technicalImpact: 'File disclosure',
      businessImpact: 'Confidentiality loss',
      remediation: 'Patch Apache',
      references: ['https://nvd.nist.gov/vuln/detail/CVE-2021-41773'],
      evidence: {
        id: 'ev-nikto',
        tool: 'Nikto',
        timestamp: '2026-11-04T04:00:00Z',
        evidenceType: 'HTTP Request/Response',
        summary: 'GET /icons/.%%32%65/.%%32%65/etc/passwd -> 200 OK',
        details: 'root:x:0:0:...',
      },
      confidence: 'Medium',
    },
    {
      title: 'Apache 2.4.49 Vulnerability',
      tool: 'Nessus',
      affectedAsset: '10.0.12.45',
      port: 80,
      cveId: 'CVE-2021-41773',
      cvssScore: 7.5,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
      severity: 'High',
      description: 'Nessus detected vulnerable Apache banner',
      technicalImpact: 'Arbitrary file read',
      businessImpact: 'Confidentiality loss',
      remediation: 'Update Apache',
      references: ['https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-41773'],
      evidence: {
        id: 'ev-nessus',
        tool: 'Nessus',
        timestamp: '2026-11-04T04:02:00Z',
        evidenceType: 'Terminal Log',
        summary: 'Nessus detected vulnerable service',
        details: 'Plugin Output: Server banner Apache/2.4.49',
      },
      confidence: 'Medium',
    },
    {
      title: 'Missing Strict-Transport-Security Header',
      tool: 'OWASP ZAP',
      affectedAsset: '10.0.12.45',
      port: 443,
      cweId: 'CWE-319',
      cvssScore: 3.5,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N',
      severity: 'Low',
      description: 'HSTS header missing on HTTPS service',
      technicalImpact: 'Man-in-the-middle downgrade',
      businessImpact: 'Minor security posture weakness',
      remediation: 'Add Strict-Transport-Security header',
      references: ['https://owasp.org/www-project-top-ten/'],
      evidence: {
        id: 'ev-zap',
        tool: 'OWASP ZAP',
        timestamp: '2026-11-04T04:08:00Z',
        evidenceType: 'HTTP Request/Response',
        summary: 'Response headers inspected, HSTS absent',
        details: 'HTTP/1.1 200 OK\nServer: Apache\nContent-Type: text/html',
      },
      confidence: 'Confirmed',
    },
  ];

  const results = correlateAndDeduplicateFindings(raw, true);

  // Grouping check: 3 raw items merged into 2 normalized findings
  assert.equal(results.length, 2);

  // Finding 1 should be the Apache CVE with both Nikto & Nessus
  const cveFinding = results.find((r) => r.cveId === 'CVE-2021-41773')!;
  assert.ok(cveFinding);
  assert.equal(cveFinding.sourceTools.length, 2);
  assert.ok(cveFinding.sourceTools.includes('Nikto'));
  assert.ok(cveFinding.sourceTools.includes('Nessus'));
  assert.equal(cveFinding.evidenceList.length, 2);
  assert.equal(cveFinding.isDuplicateMerged, true);
  assert.equal(cveFinding.confidence, 'Confirmed');

  // Risk sorting check: higher risk score first
  assert.ok(results[0].riskScore >= results[1].riskScore);
});

test('calculateRiskScore accurately accounts for external exposure and exploitability', () => {
  const highRisk = calculateRiskScore({
    cvssScore: 9.8,
    isExternallyExposed: true,
    hasActivePocOrModule: true,
    confidence: 'Confirmed',
    isHighValueAsset: true,
  });

  const lowRisk = calculateRiskScore({
    cvssScore: 3.5,
    isExternallyExposed: false,
    hasActivePocOrModule: false,
    confidence: 'Medium',
    isHighValueAsset: false,
  });

  assert.ok(highRisk > 85);
  assert.ok(lowRisk < 40);
});
