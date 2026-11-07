/**
 * Tool Integration Definitions & Integration Status Matrix
 * Implements Section 4, 6, and 9.6 of Hackathon Specification
 */

import { ToolMetadata, ToolName, ScanJob, UnnormalizedFindingInput } from './types';

export const INTEGRATION_MATRIX: ToolMetadata[] = [
  {
    id: 'Nmap',
    name: 'Nmap (Network Mapper) v7.94',
    category: 'Network Recon',
    primaryRole: 'Host, port, and service discovery; reconnaissance and enumeration.',
    integrationType: 'Live',
    cliOrApi: 'CLI: nmap -sS -sV -sC -Pn -T4 -p- -oX /output/nmap.xml <target>',
    licensingDisclosure: 'Open Source (Nmap Public Source License v0.92 / GPL compatible). Free to deploy in lab sandbox.',
    capabilities: ['SYN Stealth Scan', 'Service & Version Detection', 'NSE Scripts (Default/Vuln)', 'OS Fingerprinting'],
    supportedImportFormats: ['.xml (Nmap XML Output)', '.gnmap (Grepable Nmap)', '.txt (Standard Output)'],
  },
  {
    id: 'Nikto',
    name: 'Nikto Web Scanner v2.5.0',
    category: 'Web Server',
    primaryRole: 'Web server configuration checks, dangerous files, outdated components, server headers.',
    integrationType: 'Live',
    cliOrApi: 'CLI: nikto -host <target> -port 80,443 -Format json -output /output/nikto.json',
    licensingDisclosure: 'Open Source (GPLv2). Freely available for CLI execution and parsing.',
    capabilities: ['Web Server Header Audit', 'Default File Discovery', 'Known CGIs & Backdoors', 'HTTP Method Auditing'],
    supportedImportFormats: ['.json (Nikto JSON)', '.xml', '.txt (Console Transcript)'],
  },
  {
    id: 'OWASP ZAP',
    name: 'OWASP Zed Attack Proxy (ZAP) v2.14',
    category: 'Web Application',
    primaryRole: 'Web application and API vulnerability scanning (Passive + Active).',
    integrationType: 'Live',
    cliOrApi: 'REST API & Automation Framework: http://zap:8080/JSON/ascan/action/scan/?url=<target>',
    licensingDisclosure: 'Open Source (Apache 2.0). Automated via official ZAP Python/REST API client in sandbox.',
    capabilities: ['Active Injection Scanning (SQLi, XSS)', 'Passive Header Analysis', 'Spider & OpenAPI Ingestion', 'Auth Token Testing'],
    supportedImportFormats: ['.json (ZAP Report JSON)', '.xml (ZAP XML Report)', '.html'],
  },
  {
    id: 'Nessus',
    name: 'Tenable Nessus Professional / Essentials',
    category: 'Infrastructure',
    primaryRole: 'Infrastructure vulnerability assessment and finding import/API integration.',
    integrationType: 'Import-only',
    cliOrApi: 'REST API (/scans/export) + Native File Ingestion (.nessus XML format)',
    licensingDisclosure: 'Proprietary Commercial License (Tenable). Tested via native .nessus XML export ingestion and offline scan parsing; no unauthorized commercial API bypass.',
    capabilities: ['CVE Mapping', 'CVSS v3.1 Scoring', 'Compliance Audits', 'Infrastructure Misconfigurations'],
    supportedImportFormats: ['.nessus (Tenable XML v2)', '.json (Export API schema)'],
  },
  {
    id: 'OpenVAS',
    name: 'Greenbone Community / OpenVAS (GSM 22.4)',
    category: 'Infrastructure',
    primaryRole: 'Infrastructure vulnerability assessment, NVT testing, and result correlation.',
    integrationType: 'Import-only',
    cliOrApi: 'GMP Protocol (Greenbone Management Protocol) XML over TLS or Native XML Import',
    licensingDisclosure: 'Open Source (GPLv2+). Ingests OpenVAS XML reports and GMP scan summaries.',
    capabilities: ['NVT Vulnerability Tests', 'Host Severity Aggregation', 'Port Correlation', 'CVE References'],
    supportedImportFormats: ['.xml (OpenVAS GMP Report)', '.csv'],
  },
  {
    id: 'Burp Suite',
    name: 'PortSwigger Burp Suite Enterprise / Pro',
    category: 'Web Application',
    primaryRole: 'Web testing and analyst-assisted validation; API/export integration.',
    integrationType: 'Import-only',
    cliOrApi: 'REST API (Enterprise) & Burp Issue XML/JSON native export parser',
    licensingDisclosure: 'Proprietary Commercial License (PortSwigger). Ingests exported analyst findings, raw HTTP request/response proofs, and REST scan summaries.',
    capabilities: ['IDOR Verification', 'Custom Parameter Tampering', 'JWT Flaws', 'Session Hijacking Probes'],
    supportedImportFormats: ['.xml (Burp Issue Export)', '.json (Burp Rest API Report)'],
  },
  {
    id: 'Metasploit',
    name: 'Metasploit Framework v6.4 (Controlled)',
    category: 'Exploitation / Validation',
    primaryRole: 'Human-approved, lab-only controlled validation; NEVER autonomous exploitation.',
    integrationType: 'Live',
    cliOrApi: 'MSF RPC Daemon (msfrpcd) via authenticated RPC; restricted to check / proof-of-concept mode.',
    licensingDisclosure: 'Open Source / BSD 3-Clause. Configured strictly with explicit Human-in-the-Loop gating.',
    capabilities: ['Read-only Vulnerability Check Commands', 'Safe Non-Destructive Proofs', 'Audit Trail Recording'],
    supportedImportFormats: ['.json (MSF Event Log)', '.txt (Console Session Log)'],
  },
];

/**
 * Authentic Pre-configured Scanner Outputs for the Authorized Lab Target:
 * lab.dataops-sandbox.internal (10.0.12.45)
 */
export const SAMPLE_LAB_DATASETS: Record<ToolName, {
  stdout: string;
  findings: UnnormalizedFindingInput[];
}> = {
  Nmap: {
    stdout: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-11-04 04:01 UTC
Nmap scan report for lab.dataops-sandbox.internal (10.0.12.45)
Host is up (0.00042s latency).
Not shown: 994 closed tcp ports (reset)
PORT     STATE SERVICE     VERSION
21/tcp   open  ftp         vsftpd 2.3.4
| ftp-anon: Anonymous FTP login permitted (FTP code 230)
|_07-12-25  11:42AM       <DIR>          pub_backup
22/tcp   open  ssh         OpenSSH 7.4p1 (protocol 2.0)
| ssh-hostkey: 
|   2048 b1:29:43:08:92:ef:2a:45:10:e2:3b:01:c7:29:9b:08 (RSA)
|_  256 cd:12:ef:90:34:ba:11:54:99:a2:bb:cc:dd:ee:ff:01 (ED25519)
80/tcp   open  http        Apache httpd 2.4.49 ((Unix))
|_http-server-header: Apache/2.4.49
|_http-title: DataOps Internal Banking Portal - Authentication Portal
443/tcp  open  ssl/http    Apache httpd 2.4.49 ((Unix))
|_ssl-date: TLS randomness does not represent time
| ssl-enum-ciphers: 
|   TLSv1.0: 
|     ciphers: 
|       TLS_RSA_WITH_AES_128_CBC_SHA (secp256r1) - D
|     compressors: 
|       NULL
|   TLSv1.1: 
|     ciphers: 
|       TLS_RSA_WITH_AES_256_CBC_SHA (secp256r1) - D
5432/tcp open  postgresql  PostgreSQL DB 14.2
8080/tcp open  http        Apache Tomcat / Spring Boot 2.6.3
|_http-title: Banking API Microservice Backend
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Nmap done: 1 IP address (1 host up) scanned in 14.82 seconds`,
    findings: [
      {
        title: 'Outdated Apache HTTP Server 2.4.49 Detected',
        tool: 'Nmap',
        affectedAsset: 'lab.dataops-sandbox.internal',
        port: 80,
        protocol: 'TCP',
        service: 'http (Apache/2.4.49)',
        cveId: 'CVE-2021-41773',
        cvssScore: 7.5,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
        severity: 'High',
        description: 'Nmap service version probe identified Apache httpd 2.4.49. Known vulnerable to path traversal and remote code execution if mod_cgi is enabled.',
        technicalImpact: 'Directory traversal allowing unauthenticated disclosure of files outside webroot.',
        businessImpact: 'Exposure of configuration files, private keys, or system credentials.',
        remediation: 'Upgrade Apache HTTP Server to version 2.4.51 or later immediately.',
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2021-41773', 'https://httpd.apache.org/security/vulnerabilities_24.html'],
        evidence: {
          id: 'ev-nmap-1',
          tool: 'Nmap',
          timestamp: '2026-11-04T04:01:14Z',
          evidenceType: 'Port Banner',
          summary: 'Port 80/tcp open, Service: Apache httpd 2.4.49 ((Unix))',
          details: '80/tcp open http Apache httpd 2.4.49 ((Unix))\n_http-server-header: Apache/2.4.49',
          commandExecuted: 'nmap -sS -sV -p 80,443,8080 10.0.12.45',
        },
      },
      {
        title: 'Deprecated TLS 1.0 / TLS 1.1 Protocols Enabled',
        tool: 'Nmap',
        affectedAsset: 'lab.dataops-sandbox.internal',
        port: 443,
        protocol: 'TCP',
        service: 'https',
        cweId: 'CWE-326',
        cvssScore: 5.3,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N',
        severity: 'Medium',
        description: 'NSE ssl-enum-ciphers identified active TLSv1.0 and TLSv1.1 protocols using CBC mode ciphers susceptible to cryptographic downgrade attacks.',
        technicalImpact: 'Man-in-the-middle attackers could intercept or decrypt legacy encrypted sessions.',
        businessImpact: 'Non-compliance with PCI-DSS 4.0 and NIST guidelines requiring modern TLS 1.2+.',
        remediation: 'Disable TLS 1.0 and TLS 1.1 in Apache SSL configuration. Enforce TLS 1.2 and TLS 1.3 only.',
        references: ['https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-52r2.pdf'],
        evidence: {
          id: 'ev-nmap-2',
          tool: 'Nmap',
          timestamp: '2026-11-04T04:01:14Z',
          evidenceType: 'Terminal Log',
          summary: 'Nmap ssl-enum-ciphers negotiated TLSv1.0 with CBC cipher',
          details: 'TLSv1.0: ciphers: TLS_RSA_WITH_AES_128_CBC_SHA - Grade D',
          commandExecuted: 'nmap --script ssl-enum-ciphers -p 443 10.0.12.45',
        },
      },
    ],
  },

  Nikto: {
    stdout: `- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          10.0.12.45
+ Target Hostname:    lab.dataops-sandbox.internal
+ Target Port:        80
+ Start Time:         2026-11-04 04:02:10 (GMT0)
---------------------------------------------------------------------------
+ Server: Apache/2.4.49 (Unix)
+ /: The anti-clickjacking X-Frame-Options header is not present.
+ /: The X-Content-Type-Options header is not set. This could allow the browser to sniff content types.
+ Apache/2.4.49 appears to be outdated (current is at least Apache/2.4.58).
+ /icons/.%%32%65/.%%32%65/etc/passwd: Apache 2.4.49 Path Traversal flaw (CVE-2021-41773). Confirmed: File retrieved with HTTP status 200.
+ /.git/HEAD: Git repository directory found. Allows reconstruction of source code repository.
+ /cgi-bin/: CGI directory exists and has execute permissions enabled.
+ 7843 requests: 0 error(s) and 5 item(s) reported on remote host
+ End Time:           2026-11-04 04:02:45 (GMT0) (35 seconds)`,
    findings: [
      {
        title: 'Apache HTTP Server 2.4.49 Path Traversal (CVE-2021-41773)',
        tool: 'Nikto',
        affectedAsset: 'lab.dataops-sandbox.internal',
        port: 80,
        protocol: 'TCP',
        service: 'http',
        cveId: 'CVE-2021-41773',
        cweId: 'CWE-22',
        mitreAttackId: 'T1083',
        owaspCategory: 'A01:2021-Broken Access Control',
        cvssScore: 7.5,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
        severity: 'High',
        description: 'Nikto verified path traversal exploit via URL-encoded dots "/icons/.%%32%65/.%%32%65/etc/passwd". The server responded with HTTP 200 and leaked Unix user accounts.',
        technicalImpact: 'Arbitrary local file disclosure bypassing DocumentRoot restrictions.',
        businessImpact: 'High risk of credential theft, system reconnaissance, and configuration exposure.',
        remediation: 'Upgrade to Apache HTTP Server 2.4.51 or newer and verify mod_cgi configurations.',
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2021-41773', 'https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-41773'],
        evidence: {
          id: 'ev-nikto-1',
          tool: 'Nikto',
          timestamp: '2026-11-04T04:02:22Z',
          evidenceType: 'HTTP Request/Response',
          summary: 'Path traversal request returned 200 OK with /etc/passwd contents',
          details: 'GET /icons/.%%32%65/.%%32%65/etc/passwd HTTP/1.1\nHost: 10.0.12.45\n\nHTTP/1.1 200 OK\nServer: Apache/2.4.49\nContent-Length: 1290\n\nroot:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin',
          requestDump: 'GET /icons/.%%32%65/.%%32%65/etc/passwd HTTP/1.1\nHost: 10.0.12.45\nUser-Agent: Mozilla/5.0 (Nikto)',
          responseDump: 'HTTP/1.1 200 OK\nDate: Wed, 04 Nov 2026 04:02:22 GMT\nServer: Apache/2.4.49 (Unix)\n\nroot:x:0:0:root:/root:/bin/bash',
        },
      },
      {
        title: 'Exposed Git Source Code Repository (/.git/HEAD)',
        tool: 'Nikto',
        affectedAsset: 'lab.dataops-sandbox.internal',
        port: 80,
        protocol: 'TCP',
        service: 'http',
        cweId: 'CWE-538',
        mitreAttackId: 'T1552.001',
        owaspCategory: 'A05:2021-Security Misconfiguration',
        cvssScore: 6.5,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
        severity: 'Medium',
        description: 'Exposed /.git/HEAD file detected in public webroot. Attackers can dump commits, secrets, and source code using git-dumper.',
        technicalImpact: 'Full exposure of application source code repository history and embedded database credentials.',
        businessImpact: 'Proprietary IP loss and disclosure of hardcoded API secrets.',
        remediation: 'Restrict access to the .git directory in web server configuration or remove it from deployment webroot.',
        references: ['https://cwe.mitre.org/data/definitions/538.html'],
        evidence: {
          id: 'ev-nikto-2',
          tool: 'Nikto',
          timestamp: '2026-11-04T04:02:30Z',
          evidenceType: 'HTTP Request/Response',
          summary: 'HTTP 200 returned for /.git/HEAD',
          details: 'GET /.git/HEAD HTTP/1.1 -> ref: refs/heads/main',
          requestDump: 'GET /.git/HEAD HTTP/1.1\nHost: 10.0.12.45',
          responseDump: 'HTTP/1.1 200 OK\nContent-Type: text/plain\n\nref: refs/heads/main\n',
        },
      },
    ],
  },

  'OWASP ZAP': {
    stdout: `OWASP ZAP 2.14.0 Automation Engine Finished
Target: http://10.0.12.45:8080/api/v1/
Spidering completed: 28 unique endpoints discovered.
Active Scan finished: 1,420 attack vectors dispatched across 4 alert plugins.
[CRITICAL] SQL Injection (CWE-89) in 'account_id' parameter
[HIGH] Reflected Cross-Site Scripting (XSS) (CWE-79) in 'search' query
[MEDIUM] Missing Anti-Clickjacking Header (X-Frame-Options)
[LOW] Missing Strict-Transport-Security (HSTS) Header
Reports saved to zap-report-10.0.12.45.json`,
    findings: [
      {
        title: 'SQL Injection via REST API (account_id parameter)',
        tool: 'OWASP ZAP',
        affectedAsset: 'lab.dataops-sandbox.internal',
        port: 8080,
        protocol: 'TCP',
        service: 'http (Spring Boot API)',
        cweId: 'CWE-89',
        mitreAttackId: 'T1190',
        owaspCategory: 'A03:2021-Injection',
        cvssScore: 9.8,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        severity: 'Critical',
        description: 'Active scan confirmed boolean-based and time-based SQL Injection in the /api/v1/transfer endpoint when manipulating the "account_id" query parameter.',
        technicalImpact: 'Complete database read/write compromise, authentication bypass, data exfiltration.',
        businessImpact: 'Catastrophic regulatory liability under GDPR/CCPA, unauthorized money transfers in banking simulator.',
        remediation: 'Use parameterized queries / PreparedStatements with Hibernate ORM. Never concatenate unvalidated user inputs into SQL strings.',
        references: ['https://owasp.org/www-community/attacks/SQL_Injection', 'https://cwe.mitre.org/data/definitions/89.html'],
        evidence: {
          id: 'ev-zap-1',
          tool: 'OWASP ZAP',
          timestamp: '2026-11-04T04:03:15Z',
          evidenceType: 'HTTP Request/Response',
          summary: 'SQL injection payload: account_id=1045 UNION SELECT null,username,password_hash FROM users--',
          details: 'Payload injected into GET /api/v1/transfer?account_id=1045%20UNION%20SELECT%20null,username,password_hash%20FROM%20users--\nDatabase error response and table dump reflected in JSON output.',
          requestDump: 'GET /api/v1/transfer?account_id=1045%27%20OR%201=1-- HTTP/1.1\nHost: 10.0.12.45:8080\nAccept: application/json',
          responseDump: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"status":"success","records":[{"id":1001,"name":"admin","balance":994020.50}]}',
        },
      },
      {
        title: 'Reflected Cross-Site Scripting (XSS) in Search Query',
        tool: 'OWASP ZAP',
        affectedAsset: 'lab.dataops-sandbox.internal',
        port: 80,
        protocol: 'TCP',
        service: 'http',
        cweId: 'CWE-79',
        mitreAttackId: 'T1189',
        owaspCategory: 'A03:2021-Injection',
        cvssScore: 6.1,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N',
        severity: 'Medium',
        description: 'Parameter "q" on search page does not sanitize HTML characters before echoing into DOM.',
        technicalImpact: 'Arbitrary JavaScript execution in victim browser context, session cookie hijacking.',
        businessImpact: 'Account takeover of authenticated bank customers via malicious phishing links.',
        remediation: 'Encode all dynamic inputs using context-aware output encoding (HTML Entity Encoding) and deploy Content-Security-Policy (CSP).',
        references: ['https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html'],
        evidence: {
          id: 'ev-zap-2',
          tool: 'OWASP ZAP',
          timestamp: '2026-11-04T04:03:25Z',
          evidenceType: 'HTTP Request/Response',
          summary: 'Injected <script>alert(1)</script> was returned unescaped in HTTP body',
          details: 'GET /search?q=%3Cscript%3Ealert(1)%3C/script%3E',
          requestDump: 'GET /search?q=%3Cscript%3Ealert(1)%3C/script%3E HTTP/1.1\nHost: 10.0.12.45',
          responseDump: 'HTTP/1.1 200 OK\n\n<div>Results for: <script>alert(1)</script></div>',
        },
      },
    ],
  },

  Nessus: {
    stdout: `[Tenable Nessus Professional Ingestion Engine]
Parsed File: nessus_export_lab_10_0_12_45.nessus
Host Tested: lab.dataops-sandbox.internal (10.0.12.45)
OS Detected: Linux Kernel 5.4.0 (Ubuntu 20.04 LTS)
Plugins Dispatched: 412
Critical Findings: 1
High Findings: 2
Medium Findings: 3
Low / Info: 8
Native format verified. Cross-correlation ready.`,
    findings: [
      {
        title: 'Apache 2.4.49 Path Traversal and File Disclosure (CVE-2021-41773)',
        tool: 'Nessus',
        affectedAsset: 'lab.dataops-sandbox.internal',
        port: 80,
        protocol: 'TCP',
        service: 'http',
        cveId: 'CVE-2021-41773',
        cweId: 'CWE-22',
        cvssScore: 7.5,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
        severity: 'High',
        description: 'Tenable Plugin ID 153723: A flaw was found in a change made to path normalization in Apache HTTP Server 2.4.49. An attacker could use a path traversal attack to map URLs to files outside the directories configured by Alias-like directives.',
        technicalImpact: 'Unauthorized read access to sensitive operating system files.',
        businessImpact: 'System compromise and credentials harvesting.',
        remediation: 'Update to Apache HTTP Server 2.4.51 or later.',
        references: ['https://www.tenable.com/plugins/nessus/153723', 'https://nvd.nist.gov/vuln/detail/CVE-2021-41773'],
        evidence: {
          id: 'ev-nessus-1',
          tool: 'Nessus',
          timestamp: '2026-11-04T04:04:10Z',
          evidenceType: 'Configuration Check',
          summary: 'Nessus Plugin 153723 verified Apache 2.4.49 banner and vulnerable normalization check',
          details: 'Plugin: 153723 - Apache 2.4.49 Path Traversal and File Disclosure\nRemote Banner: Apache/2.4.49 (Unix)',
        },
      },
      {
        title: 'Spring Boot Actuator Endpoints Unauthenticated Exposure',
        tool: 'Nessus',
        affectedAsset: 'lab.dataops-sandbox.internal',
        port: 8080,
        protocol: 'TCP',
        service: 'http',
        cweId: 'CWE-200',
        cvssScore: 7.5,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
        severity: 'High',
        description: 'Tenable Plugin ID 112108: Spring Boot Actuator endpoints (/actuator/env, /actuator/heapdump, /actuator/metrics) are accessible without authentication.',
        technicalImpact: 'Heapdump download permits extraction of plaintext database passwords and API tokens from Java memory.',
        businessImpact: 'Unrestricted disclosure of operational application secrets.',
        remediation: 'Set management.endpoints.web.exposure.include=health,info in application.properties and enforce Spring Security.',
        references: ['https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html'],
        evidence: {
          id: 'ev-nessus-2',
          tool: 'Nessus',
          timestamp: '2026-11-04T04:04:18Z',
          evidenceType: 'HTTP Request/Response',
          summary: 'Accessible endpoint: http://10.0.12.45:8080/actuator/env returned environment properties',
          details: 'GET /actuator/env HTTP/1.1 returned 200 OK with SPRING_DATASOURCE_PASSWORD mask.',
        },
      },
    ],
  },

  OpenVAS: {
    stdout: `[Greenbone OpenVAS GMP Result Ingestion]
GMP Task ID: 8192a-openvas-lab-assessment
Report ID: rpt-901-2026-dataops
Host: 10.0.12.45
Total NVTs Evaluated: 2,890
High Severity Findings: 2
Medium Severity Findings: 2
Corroborated: CVE-2021-41773, vsftpd 2.3.4 backdoor presence check.`,
    findings: [
      {
        title: 'vsftpd 2.3.4 Backdoor Signature Detection (CVE-2011-2523)',
        tool: 'OpenVAS',
        affectedAsset: 'lab.dataops-sandbox.internal',
        port: 21,
        protocol: 'TCP',
        service: 'ftp',
        cveId: 'CVE-2011-2523',
        cweId: 'CWE-78',
        mitreAttackId: 'T1190',
        cvssScore: 9.8,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        severity: 'Critical',
        description: 'OpenVAS NVT (OID: 1.3.6.1.4.1.25623.1.0.103185) detected vsftpd version 2.3.4. Certain distributed archives of this version contained a backdoor triggered by a smile smiley face :) in the username.',
        technicalImpact: 'Potential remote root shell on TCP port 6200 upon backdoor trigger.',
        businessImpact: 'Total host takeover and privilege escalation to root.',
        remediation: 'Immediately remove vsftpd 2.3.4. Upgrade to a maintained version (vsftpd 3.0.5) from official package repositories.',
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2011-2523', 'https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-2523'],
        evidence: {
          id: 'ev-openvas-1',
          tool: 'OpenVAS',
          timestamp: '2026-11-04T04:05:02Z',
          evidenceType: 'Port Banner',
          summary: 'NVT 1.3.6.1.4.1.25623.1.0.103185 matched vsftpd 2.3.4 service string',
          details: 'Banner: 220 (vsFTPd 2.3.4)\nWarning: Suspected malicious backdoor release. Stage for controlled verification.',
        },
      },
      {
        title: 'Apache HTTP Server Path Traversal (CVE-2021-41773)',
        tool: 'OpenVAS',
        affectedAsset: 'lab.dataops-sandbox.internal',
        port: 80,
        protocol: 'TCP',
        service: 'http',
        cveId: 'CVE-2021-41773',
        cweId: 'CWE-22',
        cvssScore: 7.5,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
        severity: 'High',
        description: 'OpenVAS NVT 1.3.6.1.4.1.25623.1.0.146864 verified Apache 2.4.49 path traversal via URL-encoded traversal patterns.',
        technicalImpact: 'Arbitrary local file disclosure outside document root.',
        businessImpact: 'Leakage of sensitive server assets.',
        remediation: 'Upgrade Apache httpd to 2.4.51 or newer.',
        references: ['https://nvd.nist.gov/vuln/detail/CVE-2021-41773'],
        evidence: {
          id: 'ev-openvas-2',
          tool: 'OpenVAS',
          timestamp: '2026-11-04T04:05:15Z',
          evidenceType: 'Configuration Check',
          summary: 'NVT confirmed file access vulnerability on Apache 2.4.49',
          details: 'URI /cgi-bin/.%2e/.%2e/.%2e/etc/passwd returned valid /etc/passwd excerpt.',
        },
      },
    ],
  },

  'Burp Suite': {
    stdout: `[Burp Suite Professional - REST Ingestion & Export Parser]
Imported Items: 15 analyst-flagged transactions
Target: https://lab.dataops-sandbox.internal:8443
Authenticated Profile: Analyst-Assisted Testing (Role: Customer_Tier_1)
High Impact Finding Identified: Insecure Direct Object Reference (IDOR) on Transaction Ledger
Evidence Request/Response bodies captured with token replay validation.`,
    findings: [
      {
        title: 'BOLA / Insecure Direct Object Reference (IDOR) on Customer Statements',
        tool: 'Burp Suite',
        affectedAsset: 'lab.dataops-sandbox.internal',
        port: 8080,
        protocol: 'TCP',
        service: 'http (REST API)',
        cweId: 'CWE-639',
        mitreAttackId: 'T1552',
        owaspCategory: 'A01:2021-Broken Access Control',
        cvssScore: 8.5,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N',
        severity: 'High',
        description: 'Analyst-assisted Burp Repeater testing identified that modifying the "accountId" path parameter in /api/v1/accounts/{accountId}/statements allows an unprivileged user to view and export complete financial records belonging to any other user.',
        technicalImpact: 'Horizontal privilege escalation allowing access to all bank tenant statements.',
        businessImpact: 'Severe regulatory breach under banking privacy laws, customer data leak.',
        remediation: 'Enforce object-level authorization checks: verify that the authenticated JWT subject ID owns the requested account ID before returning records.',
        references: ['https://owasp.org/www-project-api-security/'],
        evidence: {
          id: 'ev-burp-1',
          tool: 'Burp Suite',
          timestamp: '2026-11-04T04:06:12Z',
          evidenceType: 'HTTP Request/Response',
          summary: 'Replayed request with victim account ID 20042 returned statement without 403 Forbidden',
          details: 'Burp Repeater Session Trace: Modifying accountId parameter from 10014 to 20042 successfully returned balance: $4,850,230.12.',
          requestDump: 'GET /api/v1/accounts/20042/statements HTTP/1.1\nHost: 10.0.12.45:8080\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user10014\nAccept: application/json',
          responseDump: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"accountId":20042,"holder":"Corporate Reserve Corp","balance":4850230.12,"transactions":[]}',
        },
      },
    ],
  },

  Metasploit: {
    stdout: `[Metasploit Framework v6.4 - Human-Approved Controlled Validation]
[*] Target: 10.0.12.45
[*] Mode: CHECK ONLY / Non-Destructive Proof-of-Concept
[*] Active exploitation disabled by default - Human Gate Enforced
[+] Module: exploit/multi/http/apache_normalize_path
[+] Result: Target 10.0.12.45:80 is VULNERABLE to Apache 2.4.49 Path Traversal
[*] Execution logged to immutable audit trail. No persistent payload installed.`,
    findings: [
      {
        title: 'Validated Vulnerability: Apache 2.4.49 Path Traversal Proof-of-Concept',
        tool: 'Metasploit',
        affectedAsset: 'lab.dataops-sandbox.internal',
        port: 80,
        protocol: 'TCP',
        service: 'http',
        cveId: 'CVE-2021-41773',
        cweId: 'CWE-22',
        cvssScore: 7.5,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
        severity: 'High',
        description: 'Controlled, human-approved Metasploit check module "exploit/multi/http/apache_normalize_path" confirmed vulnerable path normalization without damaging target availability.',
        technicalImpact: 'Confirmed exploitability of directory traversal under sandbox conditions.',
        businessImpact: 'Eliminates false-positive doubt; demonstrates verifiable vulnerability state.',
        remediation: 'Patch Apache HTTP Server to version 2.4.51.',
        references: ['https://www.rapid7.com/db/modules/exploit/multi/http/apache_normalize_path/'],
        evidence: {
          id: 'ev-msf-1',
          tool: 'Metasploit',
          timestamp: '2026-11-04T04:07:30Z',
          evidenceType: 'Exploit Payload Output',
          summary: 'MSF check routine returned "Target is vulnerable" code 1',
          details: 'msf6 exploit(multi/http/apache_normalize_path) > check\n[*] 10.0.12.45:80 - The target is vulnerable.',
          commandExecuted: 'msfconsole -q -x "use exploit/multi/http/apache_normalize_path; set RHOSTS 10.0.12.45; set RPORT 80; check; exit"',
        },
      },
    ],
  },
};
