/**
 * Scope Validator for Authorized VAPT
 * Enforces strict compliance with Section 5.1 & Section 13 of the problem statement.
 */
import { AuthorizedScope } from './types';

export interface ScopeValidationResult {
  isAuthorized: boolean;
  target: string;
  reason: string;
  matchedRule?: string;
  scopeId?: string;
  violations?: string[];
}

export const DEFAULT_AUTHORIZED_SCOPES: AuthorizedScope[] = [
  {
    id: 'scope-sandbox-alpha',
    targetName: 'DataOps Primary Sandbox Lab (Banking Portal & API)',
    allowedHosts: ['lab.dataops-sandbox.internal', 'app.vulnerable-bank.lab', 'api.vulnerable-bank.lab'],
    allowedCidrs: ['10.0.12.0/24'],
    allowedPorts: '21, 22, 80, 443, 3306, 5432, 8080, 8443, 9090',
    forbiddenExclusions: ['10.0.12.1', '10.0.12.254', 'prod.dataops.internal'],
    environment: 'Authorized Lab Sandbox',
    authorizationContact: 'Security Operations Center (soc-lead@dataops.hackathon.internal)',
    validUntil: '2026-12-31T23:59:59Z',
    rulesOfEngagement: [
      'Testing permitted strictly against authorized lab subnets',
      'No denial of service (DoS/DDoS) attacks against sandbox hypervisors',
      'Active exploitation requires explicit Human-in-the-Loop authorization',
      'Production systems, external IPs, and public third-party domains strictly out of scope',
    ],
  },
  {
    id: 'scope-sandbox-corp',
    targetName: 'DataOps Corp Active Directory & Internal Lab',
    allowedHosts: ['dc01.corp-lab.local', 'files.corp-lab.local', 'samba.corp-lab.local'],
    allowedCidrs: ['10.0.15.0/24'],
    allowedPorts: '53, 88, 139, 389, 445, 636, 3389',
    forbiddenExclusions: ['10.0.15.1'],
    environment: 'Authorized Lab Sandbox',
    authorizationContact: 'DataOps NOC/SOC Oversight',
    validUntil: '2026-12-31T23:59:59Z',
    rulesOfEngagement: [
      'Internal domain testing permitted under monitored lab conditions',
      'Controlled credential audit only; do not lockout administrative accounts',
    ],
  },
];

const KNOWN_PUBLIC_DOMAINS = [
  'google.com',
  'youtube.com',
  'facebook.com',
  'twitter.com',
  'x.com',
  'amazon.com',
  'microsoft.com',
  'apple.com',
  'github.com',
  'paypal.com',
  'yahoo.com',
];

/**
 * Checks if an IP is within a CIDR subnet
 */
export function isIpInCidr(ip: string, cidr: string): boolean {
  try {
    const [range, bitsStr = '32'] = cidr.split('/');
    const bits = parseInt(bitsStr, 10);
    const ipToInt = (dotIp: string) =>
      dotIp
        .split('.')
        .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;

    const ipInt = ipToInt(ip);
    const rangeInt = ipToInt(range);
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;

    return (ipInt & mask) === (rangeInt & mask);
  } catch {
    return false;
  }
}

/**
 * Validates whether a target (IP or hostname) is within registered authorized scopes
 */
export function validateTargetScope(
  rawInput: string,
  scopes: AuthorizedScope[] = DEFAULT_AUTHORIZED_SCOPES
): ScopeValidationResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      isAuthorized: false,
      target: rawInput,
      reason: 'Target input is empty. Please specify a valid authorized lab target.',
    };
  }

  // Extract clean hostname/IP (strip http://, https://, trailing slashes, and ports)
  let cleaned = trimmed;
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  cleaned = cleaned.split('/')[0];
  cleaned = cleaned.split(':')[0];

  // 1. Check known third-party public domains
  const lower = cleaned.toLowerCase();
  for (const publicDomain of KNOWN_PUBLIC_DOMAINS) {
    if (lower === publicDomain || lower.endsWith('.' + publicDomain)) {
      return {
        isAuthorized: false,
        target: cleaned,
        reason: `CRITICAL SCOPE VIOLATION: "${cleaned}" is a public/third-party domain. Testing non-authorized public systems is strictly prohibited under Hackathon Rules of Engagement and Computer Fraud legislation.`,
        violations: ['Public Internet Target Prohibited', 'Non-Lab Domain Access Denied'],
      };
    }
  }

  // 2. Check if it's a public IP (e.g. 8.8.8.8, 1.1.1.1)
  const isIpv4 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(cleaned);
  if (isIpv4) {
    const octets = cleaned.split('.').map((o) => parseInt(o, 10));
    const isPrivate =
      octets[0] === 10 ||
      (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
      (octets[0] === 192 && octets[1] === 168) ||
      cleaned === '127.0.0.1';

    if (!isPrivate) {
      return {
        isAuthorized: false,
        target: cleaned,
        reason: `SCOPE BOUNDARY ERROR: IP address ${cleaned} is a public routable address outside authorized lab sandboxes. Only organizer-provided private lab ranges are permitted.`,
        violations: ['Public Routable IP Address Blocked'],
      };
    }
  }

  // 3. Match against configured authorized scopes
  for (const scope of scopes) {
    // Check exclusions first
    for (const exclusion of scope.forbiddenExclusions) {
      if (cleaned.toLowerCase() === exclusion.toLowerCase()) {
        return {
          isAuthorized: false,
          target: cleaned,
          reason: `EXCLUSION LIST TRIGGERED: "${cleaned}" is explicitly registered as a protected exclusion asset in ${scope.targetName}. Scanning this host is strictly denied.`,
          scopeId: scope.id,
          violations: ['Explicit Exclusion Target'],
        };
      }
    }

    // Check allowed hosts
    for (const host of scope.allowedHosts) {
      if (cleaned.toLowerCase() === host.toLowerCase()) {
        return {
          isAuthorized: true,
          target: cleaned,
          reason: `Target "${cleaned}" is an authorized asset under ${scope.targetName}. Rules of engagement verified.`,
          matchedRule: `Allowed Host: ${host}`,
          scopeId: scope.id,
        };
      }
    }

    // Check CIDRs if IP
    if (isIpv4) {
      for (const cidr of scope.allowedCidrs) {
        if (isIpInCidr(cleaned, cidr)) {
          return {
            isAuthorized: true,
            target: cleaned,
            reason: `Target IP ${cleaned} is located within authorized lab subnet ${cidr} (${scope.targetName}).`,
            matchedRule: `Subnet Match: ${cidr}`,
            scopeId: scope.id,
          };
        }
      }
    }
  }

  // Default: Not found in authorized list
  return {
    isAuthorized: false,
    target: cleaned,
    reason: `UNREGISTERED TARGET: "${cleaned}" is not registered in any authorized sandbox scope. All scans must target approved lab assets (e.g. lab.dataops-sandbox.internal or 10.0.12.0/24).`,
    violations: ['Target Not in Authorized Scope Matrix'],
  };
}
