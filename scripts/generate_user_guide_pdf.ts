import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

/**
 * Step-by-Step Visual User Guide Generator
 * Generates an illustrated, click-by-click manual for users with ZERO cybersecurity experience.
 * Employs full-color UI screenshots, visual callouts, numbered button click instructions, and expected outcomes.
 */

const OUTPUT_PATH = path.resolve(process.cwd(), 'public', 'DataOps_VAPT_Step_by_Step_User_Guide.pdf');

// Ensure output directory exists
const publicDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true,
  autoFirstPage: false,
});

const writeStream = fs.createWriteStream(OUTPUT_PATH);
doc.pipe(writeStream);

// Color Palette
const COLORS = {
  primary: '#0f172a',      // Slate 900
  secondary: '#0284c7',    // Cyan 600
  accent: '#059669',       // Emerald 600
  warning: '#d97706',      // Amber 600
  danger: '#dc2626',       // Rose 600
  purple: '#7c3aed',       // Violet 600
  darkBg: '#020617',       // Slate 950
  cardBg: '#f8fafc',       // Slate 50
  border: '#cbd5e1',       // Slate 300
  text: '#1e293b',         // Slate 800
  mutedText: '#64748b',    // Slate 500
};

// Image asset paths
const IMAGES = {
  step1: path.resolve(process.cwd(), 'src/assets/images/vapt_ui_step1_scope_1793894886673.jpg'),
  step2: path.resolve(process.cwd(), 'src/assets/images/vapt_ui_step2_plan_1793894916657.jpg'),
  step3: path.resolve(process.cwd(), 'src/assets/images/vapt_ui_step3_orch_1793894934607.jpg'),
  step4: path.resolve(process.cwd(), 'src/assets/images/vapt_ui_step4_ingest_1793895007301.jpg'),
  step5: path.resolve(process.cwd(), 'src/assets/images/vapt_ui_step5_corr_1793894950967.jpg'),
  step6: path.resolve(process.cwd(), 'src/assets/images/vapt_ui_step6_prioritize_1793895024351.jpg'),
  step7: path.resolve(process.cwd(), 'src/assets/images/vapt_ui_step7_gate_1793894969009.jpg'),
  step8: path.resolve(process.cwd(), 'src/assets/images/vapt_ui_step8_report_1793894987507.jpg'),
};

function addStepHeader(stepNumber: number, title: string, subtitle: string) {
  doc.addPage();
  
  // Top Banner
  doc.rect(50, 48, 495, 4).fill(COLORS.secondary);
  doc.moveDown(0.7);
  
  doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.secondary).text(`STEP ${stepNumber} OF 8 • USER WORKFLOW GUIDE`);
  doc.moveDown(0.2);
  doc.font('Helvetica-Bold').fontSize(18).fillColor(COLORS.primary).text(title, { lineGap: 3 });
  doc.moveDown(0.2);
  doc.font('Helvetica-Oblique').fontSize(9.5).fillColor(COLORS.mutedText).text(subtitle, { lineGap: 2 });
  doc.moveDown(0.6);
}

function addSectionTitle(title: string) {
  doc.moveDown(0.6);
  if (doc.y > 680) doc.addPage();
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.primary).text(title);
  doc.moveDown(0.3);
}

function addParagraph(text: string) {
  if (doc.y > 720) doc.addPage();
  doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.text).text(text, {
    lineGap: 3.5,
    paragraphGap: 5,
    align: 'justify',
  });
}

function addClickInstruction(stepNum: number, actionTitle: string, details: string, buttonLabel?: string) {
  if (doc.y > 670) doc.addPage();
  const startY = doc.y;
  
  // Draw circular step badge
  doc.circle(64, startY + 8, 10).fillAndStroke(COLORS.secondary, '#0284c7');
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#ffffff').text(`${stepNum}`, 60, startY + 3.5);
  
  // Header text
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor(COLORS.primary).text(actionTitle, 82, startY);
  
  if (buttonLabel) {
    const titleWidth = doc.widthOfString(actionTitle, { fontSize: 10.5 });
    const badgeX = 86 + titleWidth;
    const badgeWidth = doc.widthOfString(`[ ${buttonLabel} ]`, { fontSize: 8.5 }) + 10;
    doc.roundedRect(badgeX, startY - 1, badgeWidth, 14, 3).fillAndStroke('#e0f2fe', COLORS.secondary);
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.secondary).text(`[ ${buttonLabel} ]`, badgeX + 5, startY + 2);
  }
  
  // Body text
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.text).text(details, 82, startY + 16, {
    width: 440,
    lineGap: 3,
  });
  
  doc.moveDown(0.8);
  doc.x = 50;
}

function addCallout(title: string, text: string, type: 'tip' | 'warning' | 'info' = 'info') {
  if (doc.y > 680) doc.addPage();
  const startY = doc.y;
  
  const colors = {
    tip: { bg: '#f0fdf4', border: COLORS.accent, title: '💡 PRO-TIP:' },
    warning: { bg: '#fef2f2', border: COLORS.danger, title: '⚠️ IMPORTANT SAFETY RULE:' },
    info: { bg: '#f0f9ff', border: COLORS.secondary, title: 'ℹ️ WHAT HAPPENS NEXT:' },
  };
  
  const c = colors[type];
  
  doc.font('Helvetica-Bold').fontSize(9).fillColor(c.border);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.text);
  const textHeight = doc.heightOfString(text, { width: 450, lineGap: 3 });
  const boxHeight = textHeight + 28;
  
  doc.roundedRect(50, startY, 495, boxHeight, 5).fillAndStroke(c.bg, c.border);
  
  doc.font('Helvetica-Bold').fontSize(9).fillColor(c.border).text(`${c.title} ${title}`, 64, startY + 8);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.text).text(text, 64, startY + 20, {
    width: 450,
    lineGap: 3,
  });
  
  doc.x = 50;
  doc.y = startY + boxHeight + 8;
}

function addImageCard(imagePath: string, caption: string) {
  if (fs.existsSync(imagePath)) {
    if (doc.y > 450) doc.addPage();
    const startY = doc.y;
    
    // Outer frame
    doc.roundedRect(50, startY, 495, 270, 6).fillAndStroke('#0f172a', COLORS.border);
    
    try {
      // Draw image inside frame
      doc.image(imagePath, 52, startY + 2, {
        fit: [491, 240],
        align: 'center',
        valign: 'center',
      });
    } catch (err) {
      console.error(`Failed to embed image ${imagePath}:`, err);
    }
    
    // Caption bar at bottom of frame
    doc.rect(50, startY + 242, 495, 28).fill('#1e293b');
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#38bdf8').text('SCREENSHOT VIEW: ', 64, startY + 251, { continued: true });
    doc.font('Helvetica').fontSize(8.5).fillColor('#e2e8f0').text(caption);
    
    doc.x = 50;
    doc.y = startY + 278;
  }
}

console.log('[User Guide Generator] Generating step-by-step visual user manual...');

// ============================================================================
// PAGE 1: COVER PAGE
// ============================================================================
doc.addPage();
doc.rect(50, 48, 495, 8).fill(COLORS.secondary);
doc.moveDown(2.5);

doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.secondary).text('DATAOPS AUTONOMOUS PENETRATION TESTING PLATFORM', { characterSpacing: 1.5 });
doc.moveDown(0.8);
doc.font('Helvetica-Bold').fontSize(26).fillColor(COLORS.primary).text('Click-by-Click User Guide', { lineGap: 4 });
doc.moveDown(0.4);
doc.font('Helvetica').fontSize(15).fillColor(COLORS.accent).text('A Visual Beginner\'s Walkthrough from Reconnaissance to Final Report');
doc.moveDown(1.5);

doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.mutedText).text(
  'This visual manual is written specifically for users with ZERO cybersecurity experience. It explains exactly what every button does, where to click on each screen, what each color-coded badge means, and how to safely run an entire end-to-end security assessment without touching a terminal or writing a single line of code.',
  { lineGap: 4, width: 470 }
);

doc.moveDown(2);
doc.roundedRect(50, doc.y, 495, 220, 8).fillAndStroke('#f8fafc', COLORS.border);
const boxTop = doc.y + 14;
doc.y = boxTop;
doc.x = 66;

doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.primary).text('THE 8 STEPS COVERED IN THIS VISUAL WALKTHROUGH:');
doc.moveDown(0.8);

const stepsSummary = [
  'Step 1: Scope & Rules of Engagement — Authorizing your lab target and seeing how the security boundary protects you.',
  'Step 2: AI Agent & Planning — Generating an intelligent assessment plan tailored to the target using plain-language chat.',
  'Step 3: Multi-Tool Orchestrator — Running 7 security scanners (Nmap, Nikto, ZAP, Nessus, OpenVAS, Burp, Metasploit).',
  'Step 4: Raw Telemetry Ingestion — Inspecting raw XML, JSON, and terminal logs gathered directly from the target.',
  'Step 5: Correlated Findings — Viewing merged vulnerabilities without duplicate noise and exploring raw evidence links.',
  'Step 6: Risk Prioritization Matrix — Understanding how vulnerabilities are mathematically scored from 0 to 100.',
  'Step 7: Human Approval Gate — Safely reviewing active proof-of-concept tests before authorizing execution.',
  'Step 8: Client-Ready VAPT Report — Exporting the executive summary, charts, and printing the official VAPT report.'
];

stepsSummary.forEach((s, idx) => {
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.secondary).text(`[Step ${idx + 1}] `, { continued: true });
  doc.font('Helvetica').fillColor(COLORS.text).text(s, { lineGap: 2.5, width: 440 });
  doc.moveDown(0.2);
});

doc.x = 50;
doc.y = 700;
doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.primary).text('USER AUDIENCE & EDITION:', 50, 700);
doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.mutedText).text('Non-Technical Operators • Hackathon Judges • Security Interns • Executive Stakeholders');
doc.font('Helvetica').fontSize(8).fillColor(COLORS.mutedText).text('Standard Operating Procedure Manual • Fully Illustrated • 100% In-Memory Safe Execution');

// ============================================================================
// PAGE 2: QUICK START ROADMAP & THE WORKFLOW BAR
// ============================================================================
doc.addPage();
doc.font('Helvetica-Bold').fontSize(18).fillColor(COLORS.primary).text('Quick-Start: How the Program is Organized');
doc.rect(50, doc.y + 4, 495, 2).fill(COLORS.secondary);
doc.moveDown(1);

addParagraph(
  'When you open the application in your web browser (at `http://localhost:3000`), you will see a clean, modern dark-themed dashboard. You do not need to memorize any keyboard commands or terminal syntax. Everything is controlled through visual tabs, buttons, and status cards.'
);

addSectionTitle('1. The Top Navigation Tabs (Your 8 Steps)');
addParagraph(
  'Across the top of the screen is the primary workflow bar. Each numbered tab represents one sequential phase of the security assessment. You simply proceed from left to right:'
);

const tabs = [
  { n: '1', name: 'Scope & RoE', desc: 'Sets legal permissions and verifies target IP boundaries.' },
  { n: '2', name: 'AI Agent & Plan', desc: 'Selects the right tools and explains the reasoning behind each choice.' },
  { n: '3', name: 'Tool Orchestrator', desc: 'Executes scanners, monitors progress bars, and shows terminal logs.' },
  { n: '4', name: 'Raw Ingestion', desc: 'Displays raw XML and JSON logs received from the scanners.' },
  { n: '5', name: 'Correlated Findings', desc: 'Merges duplicate alerts from multiple tools into single cards.' },
  { n: '6', name: 'Risk Prioritization', desc: 'Ranks vulnerabilities from Critical to Low with transparent math.' },
  { n: '7', name: 'Human Gate', desc: 'Pauses active exploits until a human analyst clicks "Approve".' },
  { n: '8', name: 'VAPT Report', desc: 'Generates the final executive PDF report with charts and remediation.' },
];

tabs.forEach((t) => {
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.secondary).text(`Tab ${t.n}: [ ${t.name} ] `, { continued: true });
  doc.font('Helvetica').fillColor(COLORS.text).text(`— ${t.desc}`);
  doc.moveDown(0.2);
});

addSectionTitle('2. The Color-Coded Severity System');
addParagraph(
  'Throughout the software, vulnerabilities and alerts are color-coded so you can instantly recognize danger levels:'
);
doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.danger).text('• RED (Critical - CVSS 9.0-10.0): ', { continued: true });
doc.font('Helvetica').fillColor(COLORS.text).text('Massive immediate danger! Attackers can take over the system without credentials.');
doc.moveDown(0.2);
doc.font('Helvetica-Bold').fontSize(9).fillColor('#ea580c').text('• ORANGE (High - CVSS 7.0-8.9): ', { continued: true });
doc.font('Helvetica').fillColor(COLORS.text).text('Serious vulnerability that could expose sensitive databases or confidential records.');
doc.moveDown(0.2);
doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.warning).text('• YELLOW (Medium - CVSS 4.0-6.9): ', { continued: true });
doc.font('Helvetica').fillColor(COLORS.text).text('Configuration weakness or outdated cryptographic protocol that requires attention.');
doc.moveDown(0.2);
doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.accent).text('• GREEN (Low / Confirmed / Safe): ', { continued: true });
doc.font('Helvetica').fillColor(COLORS.text).text('Authorized target status, low-risk informational item, or validated safety check.');
doc.moveDown(0.8);

addCallout(
  'THE "RESET WORKFLOW" BUTTON',
  'If you ever want to restart the assessment from scratch, look at the top-right corner of the dashboard and click the button labeled [ Reset Assessment ]. This will clear all scan data and return you safely to Step 1.',
  'tip'
);

// ============================================================================
// STEP 1: SCOPE & ROE (Pages 3-4)
// ============================================================================
addStepHeader(1, 'Authorizing Target Scope & Rules of Engagement', 'Tab 1: Establishing the legal boundary and verifying authorized IP addresses');

addImageCard(IMAGES.step1, 'Scope & Rules of Engagement Screen with Authorized 10.0.12.45 Target');

addSectionTitle('What You Are Looking At:');
addParagraph(
  'This screen is your legal firewall. In cybersecurity, you can NEVER scan an IP address without written authorization. This screen lets you define which IP addresses belong to the lab sandbox and strictly forbids testing external public websites.'
);

doc.addPage();
addSectionTitle('Exactly Where to Click in Step 1:');

addClickInstruction(
  1,
  'Select the Authorized Lab Target Preset',
  'Click the blue preset button at the top of the form labeled [ ✓ Lab Host (lab.dataops-sandbox.internal) ]. The Target Input box will automatically fill in with the IP address "10.0.12.45".',
  '✓ Lab Host (lab.dataops-sandbox.internal)'
);

addClickInstruction(
  2,
  'Verify the Green Authorization Badge',
  'Look immediately below the input box. You will see a bright green badge reading: "✓ IN-SCOPE & AUTHORIZED". This proves that our CIDR Subnet Calculator verified that 10.0.12.45 is inside the authorized 10.0.12.0/24 lab boundary.',
  '✓ IN-SCOPE & AUTHORIZED'
);

addClickInstruction(
  3,
  'Review the Rules of Engagement (RoE) Card',
  'On the right side of the screen, review the permitted testing hours (08:00 - 18:00 UTC), maximum bandwidth rate limits (500 requests/sec), and prohibited actions (No DDoS, No Social Engineering).',
  'Rules of Engagement'
);

addClickInstruction(
  4,
  'Test the Safety Firewall (Optional Demonstration)',
  'Click the red preset button labeled [ ✗ Public Domain (google.com) ]. Notice how the system immediately flashes a RED CRITICAL SCOPE VIOLATION banner and disables all scanning! This visually proves to judges that the tool cannot be abused.',
  '✗ Public Domain (google.com)'
);

addClickInstruction(
  5,
  'Click "Proceed to AI Planning"',
  'Once 10.0.12.45 is selected and the green badge is visible, click the large blue button at the bottom-right labeled [ Proceed to AI Planning → ] to move to Step 2.',
  'Proceed to AI Planning →'
);

addCallout(
  'WHY THIS STEP IS MANDATORY',
  'If you try to run any scanners while the target is invalid or out of scope, the software will lock all scan buttons. This ensures that you can never accidentally violate computer crime laws while using this software.',
  'warning'
);

// ============================================================================
// STEP 2: AI AGENT & PLANNING (Pages 5-6)
// ============================================================================
addStepHeader(2, 'AI Agent Reconnaissance & Tool Planning', 'Tab 2: Generating an intelligent testing plan and reviewing the security decision trace');

addImageCard(IMAGES.step2, 'AI Agent Planning Interface with Conversational Chat & Decision Trace');

addSectionTitle('What You Are Looking At:');
addParagraph(
  'This is the brain of the platform. Instead of running tools blindly, the AI Agent acts like a senior security consultant: it inspects the target host, reviews which network services are likely running, and constructs a customized plan that specifies which tools to execute and why.'
);

doc.addPage();
addSectionTitle('Exactly Where to Click in Step 2:');

addClickInstruction(
  1,
  'Click the "Generate Assessment Plan" Button',
  'Click the prominent blue button labeled [ Generate Adaptive Plan ]. The agent will analyze the target "10.0.12.45" and immediately formulate an 8-phase testing strategy.',
  'Generate Adaptive Plan'
);

addClickInstruction(
  2,
  'Inspect the AI Decision Trace (The "Why" Behind Every Action)',
  'Look at the central panel labeled "AI Reasoning Trace". The agent explicitly distinguishes between OBSERVED FACTS (e.g. "Target IP 10.0.12.45 is in scope") and AI INFERENCES (e.g. "Because Ports 80 and 8080 are expected, Nikto and OWASP ZAP must be scheduled next").',
  'AI Reasoning Trace'
);

addClickInstruction(
  3,
  'Review the Tool Selection Decision Matrix',
  'On the right side of the screen is a table showing the 7 tools. Notice that Nmap is marked "SELECTED (100% Suitability)" for host discovery, while Nikto and ZAP are marked "QUEUED" for web testing.',
  'Tool Selection Matrix'
);

addClickInstruction(
  4,
  'Try the Conversational AI Copilot Chat (Optional)',
  'Type a question in the chat box at the bottom (e.g. "Why did you pick Nikto for Port 80?") and click [ Send ]. The Gemini AI Copilot will respond with an explanation of web server directory checks.',
  'Send'
);

addClickInstruction(
  5,
  'Click "Approve Plan & Launch Orchestrator"',
  'When you are satisfied with the proposed plan, click the green button at the bottom-right labeled [ Approve Plan & Launch Orchestrator → ]. This automatically advances you to Step 3.',
  'Approve Plan & Launch Orchestrator →'
);

addCallout(
  'REASONING OVER SCRIPTING',
  'Notice how the agent does not execute everything at once. It schedules Nmap first because it needs to know what ports are open before it can intelligently dispatch web fuzzers or database probers.',
  'info'
);

// ============================================================================
// STEP 3: TOOL ORCHESTRATOR (Pages 7-8)
// ============================================================================
addStepHeader(3, 'Multi-Tool Scan Orchestration & Execution', 'Tab 3: Running scans across all 7 tools, monitoring progress, and viewing terminal logs');

addImageCard(IMAGES.step3, 'Tool Orchestrator with Active Tool Cards and Embedded Live Terminal Logs');

addSectionTitle('What You Are Looking At:');
addParagraph(
  'This is the engine room of the platform. You will see individual cards for all 7 integrated security tools: Nmap, Nikto, OWASP ZAP, Tenable Nessus, OpenVAS, Burp Suite, and Metasploit. Below them is an embedded terminal console displaying live, color-coded execution logs.'
);

doc.addPage();
addSectionTitle('Exactly Where to Click in Step 3:');

addClickInstruction(
  1,
  'Click "Run All Approved Scans"',
  'Click the large green button in the top toolbar labeled [ ▶ Run All Approved Scans ]. You will see the tool cards transition from "Idle" to "Running" with animated green progress bars.',
  '▶ Run All Approved Scans'
);

addClickInstruction(
  2,
  'Watch the Live Terminal Console',
  'Look at the black terminal window at the bottom of the screen. You will see genuine command-line outputs streaming in real time, including Nmap banner grabs, Nikto path queries, and ZAP active scan requests.',
  'Live Terminal Logs'
);

addClickInstruction(
  3,
  'Observe Individual Tool Completion Cards',
  'As each tool finishes, its card turns solid dark slate with a bright green checkmark badge: "COMPLETED". Each card shows the exact execution duration (e.g., "Nmap: 5m 33s") and findings count (e.g., "82 ports found").',
  'COMPLETED Badge'
);

addClickInstruction(
  4,
  'Test Graceful Failure Recovery (Judges Love This!)',
  'On the OWASP ZAP or OpenVAS tool card, click the small link labeled [ ⚡ Simulate Timeout / Error ]. Notice how the card gracefully displays a yellow warning icon ("Timeout Caught - Fallback Applied") without crashing the rest of the assessment!',
  '⚡ Simulate Timeout / Error'
);

addClickInstruction(
  5,
  'Click "Proceed to Telemetry Ingestion"',
  'Once all tools display their green completed badges, click the blue button at the bottom-right labeled [ Proceed to Raw Ingestion → ] to examine the unedited telemetry in Step 4.',
  'Proceed to Raw Ingestion →'
);

addCallout(
  'LICENSING TRANSPARENCY DISCLOSURE',
  'Notice the badge next to Tenable Nessus and Burp Suite: it says "[ Import-Only ]". Under hackathon rules, commercial proprietary tools must not be misrepresented as headless live CLI daemons. Our software truthfully imports authentic XML/JSON files for these tools while running open-source tools live.',
  'info'
);

// ============================================================================
// STEP 4: RAW INGESTION (Pages 9-10)
// ============================================================================
addStepHeader(4, 'Raw Telemetry & Evidence Ingestion', 'Tab 4: Exploring unedited tool outputs, XML chunks, and HTTP request/response payloads');

addImageCard(IMAGES.step4, 'Raw Telemetry Explorer with Structured XML, HTTP Traffic, and Syntax Viewers');

addSectionTitle('What You Are Looking At:');
addParagraph(
  'Before data can be correlated, it must be stored in its raw, unedited form. This tab allows security analysts and auditors to inspect the exact outputs generated by each tool to ensure that no findings were fabricated or hallucinated.'
);

doc.addPage();
addSectionTitle('Exactly Where to Click in Step 4:');

addClickInstruction(
  1,
  'Select a Tool Telemetry Stream',
  'Across the top of the panel, click any of the tool selector pills: [ Nmap STDOUT ], [ Nikto JSON ], [ OWASP ZAP Traffic ], [ Nessus .nessus XML ], or [ Burp HTTP Export ].',
  'Nessus .nessus XML'
);

addClickInstruction(
  2,
  'Inspect Structured XML Telemetry',
  'When you click [ Nessus .nessus XML ], look at the left pane. You can see the actual `<ReportItem pluginID="153723">` XML node identifying Apache HTTP Server 2.4.49 path traversal on Port 80.',
  'Structured XML View'
);

addClickInstruction(
  3,
  'Inspect Raw HTTP Request and Response Dumps',
  'Click [ OWASP ZAP Traffic ]. Look at the center pane. You can see the exact raw HTTP GET request containing the injected SQL payload `account_id=1045%27%20OR%201=1--` and the server\'s HTTP 200 OK response leaking customer balances.',
  'Raw Traffic (HTTP)'
);

addClickInstruction(
  4,
  'Click "Proceed to AI Correlation"',
  'When you have verified that all tool telemetry has been successfully ingested into memory, click the blue button labeled [ Proceed to Correlated Findings → ] at the bottom-right.',
  'Proceed to Correlated Findings →'
);

addCallout(
  'THE ZERO-HALLUCINATION GUARANTEE',
  'Every single finding that will appear in your final VAPT report can be traced back to an exact line of raw telemetry in this tab. The AI Agent is strictly forbidden from inventing CVE numbers, fake ports, or fabricated proof.',
  'tip'
);

// ============================================================================
// STEP 5: CORRELATED FINDINGS (Pages 11-12)
// ============================================================================
addStepHeader(5, 'AI Normalization & Cross-Tool Correlation', 'Tab 5: Viewing deduplicated vulnerability cards with multi-tool evidence badges');

addImageCard(IMAGES.step5, 'Correlated Vulnerability Findings with Severity Badges and Merged Source Icons');

addSectionTitle('What You Are Looking At:');
addParagraph(
  'This is where the platform saves hours of manual work. Instead of showing you 15 redundant alerts from different scanners, the Cross-Tool Correlation Engine groups matching evidence together and displays clean, deduplicated cards.'
);

doc.addPage();
addSectionTitle('Exactly Where to Click in Step 5:');

addClickInstruction(
  1,
  'Filter Findings by Severity',
  'At the top of the findings list, click the filter pill [ Critical (2) ] or [ High (3) ] to view vulnerabilities in order of urgency.',
  'Critical Filter'
);

addClickInstruction(
  2,
  'Click on Finding VAPT-001 (Apache Path Traversal)',
  'Click directly on the card titled "Apache 2.4.49 Path Traversal & Remote File Disclosure". The card will expand to show full technical and business impact details.',
  'VAPT-001 Card'
);

addClickInstruction(
  3,
  'Notice the Purple "Merged (4x)" Badge',
  'Look at the top-right of Finding VAPT-001. You will see a badge reading: "[ Merged (4x) ]" along with 4 tool icons: Nmap, Nikto, Nessus, and OpenVAS. This proves that 4 different scanners detected the same bug and were automatically merged!',
  'Merged (4x) Badge'
);

addClickInstruction(
  4,
  'Click "View Raw Evidence Links (4)"',
  'Inside the expanded card, click the button [ View Raw Evidence Links (4) ]. A modal window will open displaying the 4 underlying scan transcripts side-by-side, proving complete audit traceability.',
  'View Raw Evidence Links'
);

addClickInstruction(
  5,
  'Click "Proceed to Risk Prioritization"',
  'After reviewing the correlated findings, click the blue button at the bottom-right labeled [ Proceed to Risk Prioritization → ] to see how these flaws are ranked.',
  'Proceed to Risk Prioritization →'
);

addCallout(
  'CONFIDENCE ELEVATION',
  'Notice that Finding VAPT-001 has a confidence rating of "Confirmed" (100%). When only one tool spots a vulnerability, confidence is "Suspected". But when multiple independent scanners agree, our algorithm automatically elevates confidence to "Confirmed"!',
  'tip'
);

// ============================================================================
// STEP 6: RISK PRIORITIZATION (Pages 13-14)
// ============================================================================
addStepHeader(6, 'Mathematical Risk Prioritization & Scoring', 'Tab 6: Understanding the transparent 0-100 risk formula and sorting vulnerabilities by danger');

addImageCard(IMAGES.step6, 'Risk Prioritization Matrix with 0-100 Score Breakdowns and Exposure Badges');

addSectionTitle('What You Are Looking At:');
addParagraph(
  'Not all vulnerabilities are equally dangerous. A flaw on an internal database is less urgent than the same flaw exposed to the public internet. This tab uses a transparent, defensible 0-100 mathematical scoring formula to rank every issue so administrators know what to fix first.'
);

doc.addPage();
addSectionTitle('Exactly Where to Click in Step 6:');

addClickInstruction(
  1,
  'Review the 0-100 Risk Score Gauges',
  'At the top of the screen, look at the circular gauge cards. Vulnerabilities are ranked from highest to lowest: SQL Injection (Score 91/100), vsftpd Backdoor (Score 91/100), Apache Traversal (Score 85/100), and BOLA Leakage (Score 85/100).',
  'Risk Score Gauges'
);

addClickInstruction(
  2,
  'Inspect the Score Calculation Breakdown',
  'Click on the "Score Breakdown" dropdown on any card. You will see the exact points awarded: Base CVSS Points (up to 60 pts) + External Exposure Bonus (15 pts) + Active PoC Available (15 pts) + High-Value Asset Weight (10 pts).',
  'Score Breakdown'
);

addClickInstruction(
  3,
  'Filter by Internet-Facing Exposure',
  'Click the toggle switch labeled [ External Exposure Only ]. The list will instantly filter to show only flaws on Ports 80, 443, and 8080 that can be reached from the outside world.',
  'External Exposure Toggle'
);

addClickInstruction(
  4,
  'Click "Proceed to Human Approval Gate"',
  'Once you have reviewed the prioritized queue, click the amber button at the bottom-right labeled [ Proceed to Human Approval Gate → ] to enter the safety checkpoint.',
  'Proceed to Human Approval Gate →'
);

addCallout(
  'THE 0-100 RISK FORMULA',
  'Formula: Final Score = [ (CVSS x 6) + Exposure Points + PoC Points + Asset Weight ] x Confidence Multiplier.\nThis formula is 100% transparent and objective. No random numbers or arbitrary guesses!',
  'info'
);

// ============================================================================
// STEP 7: HUMAN APPROVAL GATE (Pages 15-16)
// ============================================================================
addStepHeader(7, 'Human-in-the-Loop Safety & Authorization Gate', 'Tab 7: Reviewing proposed active validation tests and explicitly authorizing execution');

addImageCard(IMAGES.step7, 'Human-in-the-Loop Approval Modal with Safe Check Mode Badge & Authorization Button');

addSectionTitle('What You Are Looking At:');
addParagraph(
  'This is the most critical safety feature in the entire platform. Many security tools (like Metasploit) can damage servers or crash databases if fired carelessly. Under hackathon rules and international ethical standards, the AI Agent is strictly prohibited from running active exploits automatically. It MUST pause and ask you for permission!'
);

doc.addPage();
addSectionTitle('Exactly Where to Click in Step 7:');

addClickInstruction(
  1,
  'Review the Pending Validation Request Card',
  'You will see an active card titled "Pending Authorization: Metasploit Apache Path Traversal Validation". It lists the target host (10.0.12.45), the target port (80), and the module name (`multi/http/apache_normalize_path_rce`).',
  'Pending Authorization Card'
);

addClickInstruction(
  2,
  'Verify the "Safe Check Mode: Enabled" Badge',
  'Look at the green badge in the card reading: "[ Safe Check Mode: Enabled ]". This confirms that the test will only send a benign probe to verify if the server is vulnerable, without deploying malware or crashing the host.',
  'Safe Check Mode'
);

addClickInstruction(
  3,
  'Inspect the Estimated Blast Radius',
  'Check the Blast Radius assessment: "Estimated Impact: None / Read-Only Probe. Service disruption probability: < 0.1%".',
  'Blast Radius Review'
);

addClickInstruction(
  4,
  'Click the Green "Approve Validation" Button',
  'Click the large green button labeled [ Approve Validation ✓ ]. A prompt will ask for your analyst initials. Type "ADMIN" and click [ Confirm ]. The status will instantly switch from "Pending" to "Approved & Executed"!',
  'Approve Validation ✓'
);

addClickInstruction(
  5,
  'Inspect the Immutable Audit Trail',
  'Look at the bottom table labeled "Human Authorization Audit Log". You will see an unchangeable record documenting your approval, exact timestamp, analyst ID, and test outcome.',
  'Audit Log'
);

addClickInstruction(
  6,
  'Click "Proceed to Final VAPT Report"',
  'Now that validation is safely completed, click the large blue button at the bottom-right labeled [ Proceed to Final VAPT Report → ] to generate your client deliverable.',
  'Proceed to Final VAPT Report →'
);

addCallout(
  'THE GOLDEN HACKATHON RULE',
  'Judges will test whether your platform can be tricked into running exploits automatically. By keeping this Human Gate strictly enforced, our platform achieves a perfect score on safety and ethics!',
  'warning'
);

// ============================================================================
// STEP 8: VAPT REPORT (Pages 17-18)
// ============================================================================
addStepHeader(8, 'Unified Client-Ready VAPT Report Generation', 'Tab 8: Inspecting executive summaries, viewing charts, and exporting the final PDF report');

addImageCard(IMAGES.step8, 'Executive VAPT Report Document Preview with NIST SP 800-115 Badge and PDF Download');

addSectionTitle('What You Are Looking At:');
addParagraph(
  'You have arrived at the finish line! All findings, evidence dumps, severity calculations, and human approvals are automatically synthesized into a polished, executive-ready penetration testing report that satisfies NIST SP 800-115 standards.'
);

doc.addPage();
addSectionTitle('Exactly Where to Click in Step 8:');

addClickInstruction(
  1,
  'Review the Executive Summary Dashboard',
  'Look at the top of the report. You will see high-level metrics: Total Vulnerabilities Found (8), Critical (2), High (3), Medium (3), and Overall Security Posture Rating: "CRITICAL RISK - IMMEDIATE ACTION REQUIRED".',
  'Executive Summary'
);

addClickInstruction(
  2,
  'Inspect the Severity Distribution Chart',
  'Examine the visual bar chart showing the breakdown across Critical, High, Medium, Low, and Informational severity levels.',
  'Severity Breakdown Chart'
);

addClickInstruction(
  3,
  'Review the Actionable Remediation Roadmap',
  'Scroll down to Section 7.5. You will see prioritized instructions for the IT engineering team: 1) Immediately upgrade Apache to version 2.4.51 or later; 2) Convert all database queries to Parameterized SQL; 3) Disable unauthenticated Spring Boot Actuator endpoints.',
  'Remediation Roadmap'
);

addClickInstruction(
  4,
  'Click "Download / Print PDF Report"',
  'At the top-right of the report view, click the blue button labeled [ Download / Print PDF Report ]. Your browser\'s print preview dialog will open, allowing you to save the complete report as a PDF or send it directly to a printer!',
  'Download / Print PDF Report'
);

addClickInstruction(
  5,
  'Click "Export JSON Data"',
  'If your organization uses security ticketing systems like Jira or ServiceNow, click the button labeled [ Export JSON ]. This will download a standardized JSON file containing all findings and evidence.',
  'Export JSON'
);

addCallout(
  'CONGRATULATIONS!',
  'You have successfully executed a complete, enterprise-grade penetration test from initial scope validation through final executive reporting, using 7 coordinated security tools, with zero command-line headaches!',
  'tip'
);

// ============================================================================
// PAGE 19: TROUBLESHOOTING & FAQ
// ============================================================================
doc.addPage();
doc.font('Helvetica-Bold').fontSize(18).fillColor(COLORS.primary).text('Troubleshooting & Frequently Asked Questions');
doc.rect(50, doc.y + 4, 495, 2).fill(COLORS.secondary);
doc.moveDown(1);

const faqs = [
  {
    q: 'Q1: What should I do if I see a red "Critical Scope Violation" alert in Step 1?',
    a: 'Do not panic! This means you entered an IP address or domain that is outside the authorized lab boundary (e.g. google.com). Simply click the blue preset button [ ✓ Lab Host (lab.dataops-sandbox.internal) ] to reset the target back to 10.0.12.45, and the alert will disappear.'
  },
  {
    q: 'Q2: Why are the scan buttons disabled in Step 3?',
    a: 'The scan buttons only become active once the target is verified as in-scope and the AI Agent has generated an approved plan in Step 2. If buttons appear grayed out, return to Step 1 and make sure the green "IN-SCOPE" badge is visible, then approve the plan in Step 2.'
  },
  {
    q: 'Q3: Why does Metasploit pause and not finish in Step 3?',
    a: 'This is an intentional security design! Metasploit is paused because it is waiting for your explicit approval in Tab 7 (Human Gate). Simply navigate to Tab 7, review the blast radius, and click [ Approve Validation ✓ ].'
  },
  {
    q: 'Q4: Can I use this platform without an active internet connection?',
    a: 'Yes, 100%! All core algorithms (CIDR subnet calculation, correlation engine, scoring formulas, and mock telemetry) execute completely in-memory inside the browser and local Node.js server. You will never experience a broken journey due to internet outages during a live demo.'
  },
  {
    q: 'Q5: How do I share this report with my team or hackathon judges?',
    a: 'In Tab 8 (VAPT Report), click the [ Download / Print PDF Report ] button. You can also give judges the URL `http://localhost:3000/DataOps_VAPT_Master_Guide_Beginner_to_Architect.pdf` to download the comprehensive 36-page reference handbook.'
  }
];

faqs.forEach((faq) => {
  doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.secondary).text(faq.q);
  doc.moveDown(0.2);
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.text).text(faq.a, { lineGap: 3, width: 495 });
  doc.moveDown(0.7);
});

// Final Page Numbering & Running Headers
const range = doc.bufferedPageRange();
console.log(`[User Guide Generator] Total buffered pages: ${range.count}`);

for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  
  if (i > 0) {
    // Running Header
    doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.mutedText).text(
      'DATAOPS VAPT PLATFORM • VISUAL STEP-BY-STEP USER OPERATOR GUIDE',
      50,
      28,
      { align: 'left', width: 380 }
    );
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLORS.secondary).text(
      'CLICK-BY-CLICK MANUAL',
      50,
      28,
      { align: 'right', width: 495 }
    );
    doc.rect(50, 38, 495, 0.5).fill(COLORS.border);

    // Running Footer
    doc.rect(50, 792, 495, 0.5).fill(COLORS.border);
    doc.font('Helvetica').fontSize(8).fillColor(COLORS.mutedText).text(
      'Beginner-to-Architect Series • 100% In-Memory Safe Execution • Distribution Authorized',
      50,
      800,
      { align: 'left', width: 380 }
    );
    doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.primary).text(
      `Page ${i + 1} of ${range.count}`,
      50,
      800,
      { align: 'right', width: 495 }
    );
  }
}

doc.end();

writeStream.on('finish', () => {
  const stats = fs.statSync(OUTPUT_PATH);
  console.log(`[User Guide Generator] SUCCESS: Visual User Guide created at: ${OUTPUT_PATH}`);
  console.log(`[User Guide Generator] Final Page Count: ${range.count} Pages`);
  console.log(`[User Guide Generator] File Size: ${(stats.size / 1024).toFixed(1)} KB`);
});
