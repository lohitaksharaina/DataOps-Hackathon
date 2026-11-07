# AI Agent for Automated Penetration Testing (VAPT Platform)
# Team - OneManArmy
### DataOps SOC | NOC | VAPT Innovation Hackathon

[![React 19](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![NIST SP 800-115](https://img.shields.io/badge/NIST-SP%20800--115-green.svg)](https://csrc.nist.gov/publications/detail/sp/800-115/final)
[![OWASP Top 10](https://img.shields.io/badge/OWASP-Top%2010%20(2021)-orange.svg)](https://owasp.org/Top10/)

An enterprise-grade, context-aware, and evidence-driven AI agent platform for automating Penetration Testing and Vulnerability Assessments (VAPT). The system guides authorized security evaluations from initial reconnaissance and boundary enforcement through multi-tool scan orchestration, cross-tool correlation, defensible risk scoring, human-gated proof-of-concept validation, and client-ready reporting.

---

## 🚀 Key Features

* **Strict Scope & RoE Enforcement**: Automatically verifies targets against authorized CIDR subnets (`10.0.12.0/24`) using 32-bit bitmask calculations; immediately blocks public domains (e.g. `google.com`) and out-of-scope assets.
* **Contextual AI Planning**: Replaces static bash scripts with an adaptive reasoning engine that inspects open ports to schedule appropriate tools and maintains an auditable Decision Trace.
* **7-Tool Unified Orchestration**: Integrates industry-standard network, web, infrastructure, and validation tools: **Nmap, Nikto, OWASP ZAP, Tenable Nessus, OpenVAS / Greenbone, PortSwigger Burp Suite, and Metasploit**.
* **Common Finding Schema & Evidence Ingestion**: Ingests raw stdout, `.nessus` XML, and JSON telemetry into a standardized data model with zero fabricated CVEs or hallucinated proofs.
* **Cross-Tool Correlation & Deduplication**: Unifies findings across multiple scanners using composite keys and Jaccard similarity, elevating confidence from *Suspected* to *Confirmed* without losing raw evidence links.
* **Defensible 0–100 Risk Prioritization**: Computes objective risk scores combining CVSS v3.1 base metrics, external internet exposure, exploit availability, and asset criticality.
* **Non-Negotiable Human Approval Gate**: Prohibits autonomous offensive actions; halts before executing Metasploit in non-destructive `check` mode until an authorized analyst signs off.
* **NIST SP 800-115 Client-Ready VAPT Report**: Generates executive summaries, severity distribution charts, detailed vulnerability dossiers, actionable remediation roadmaps, and printable PDF / JSON exports.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Tailwind CSS v4, Lucide React (Icons), Motion (Animations) |
| **Backend Gateway** | Node.js, Express 4.21, `@google/genai` (Gemini 2.5 Server-Side Proxy), Vite Dev Middleware |
| **Domain Engines** | In-Memory Scope Validator (`scopeValidator.ts`), Correlation Engine (`correlationEngine.ts`), Tool Orchestrator (`toolIntegrations.ts`) |
| **Document Engines** | PDFKit (Comprehensive PDF Guide Generation, Printable In-Browser VAPT Reports) |
| **Test Suite** | Native Node.js Test Runner (`tsx --test`), 10/10 Passing Unit Tests |

---

## 📁 Repository Structure

```text
├── public/                                    # Static assets & generated guide documents
│   ├── DataOps_VAPT_Master_Guide_Beginner_to_Architect.pdf  # 36-page comprehensive manual
│   └── DataOps_VAPT_Step_by_Step_User_Guide.pdf            # 19-page illustrated click-by-click guide
├── scripts/                                   # Automation & report generation scripts
│   ├── generate_guide_pdf.ts                  # Compiles the 36-page master reference handbook
│   └── generate_user_guide_pdf.ts             # Compiles the 19-page illustrated user manual
├── src/                                       # Client-side React source code
│   ├── assets/images/                         # Generated UI screenshot assets
│   ├── lib/                                   # Core domain engines & business logic
│   │   ├── types.ts                           # Standardized TypeScript data models & schemas
│   │   ├── scopeValidator.ts                  # Subnet bitmask calculation & RoE enforcement
│   │   ├── scopeValidator.test.ts             # Unit tests for scope validator
│   │   ├── correlationEngine.ts               # Deduplication, Jaccard similarity & CVSS math
│   │   ├── correlationEngine.test.ts          # Unit tests for correlation engine
│   │   └── toolIntegrations.ts                # Telemetry adapters & execution mocks
│   ├── App.tsx                                # Main application shell, state machine & 8 tabs
│   ├── index.css                              # Tailwind CSS global styles
│   └── main.tsx                               # Application bootstrap entry point
├── .env.example                               # Environment variable templates
├── index.html                                 # HTML5 entry template
├── package.json                               # Dependencies and build scripts
├── server.ts                                  # Express API gateway & Gemini AI streaming proxy
├── tsconfig.json                              # TypeScript compiler configuration
└── vite.config.ts                             # Vite configuration with Tailwind CSS v4
```

---

## ⚙️ Prerequisites & Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Gemini API Key** *(Optional, for live conversational Copilot chat)*: Get one at [Google AI Studio](https://aistudio.google.com/).

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/dataops-vapt-agent.git
   cd dataops-vapt-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your `GEMINI_API_KEY` (if testing the AI chat assistant):
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   PORT=3000
   ```

---

## 🏃 Running the Application

### Development Mode
To launch the full-stack server (Express backend + Vite client middleware on port 3000):
```bash
npm run dev
```
Open your browser and navigate to:
```text
http://localhost:3000
```

### Production Build
To compile the TypeScript code and client bundle:
```bash
npm run build
npm start
```

### Running Unit Tests
To execute the automated unit test suite verifying the Scope Validator and Correlation Engine:
```bash
npx tsx --test src/lib/scopeValidator.test.ts src/lib/correlationEngine.test.ts
```
*(All 10 tests verify CIDR math, boundary blocking, composite key generation, and duplicate merging).*

---

## 📖 How to Use the Application (The 8-Step Workflow)

Follow the numbered tabs across the top navigation bar from left to right:

1. **Tab 1: Scope & RoE**:
   * Click `[ ✓ Lab Host (lab.dataops-sandbox.internal) ]` to authorize target `10.0.12.45`.
   * Observe the green badge: `✓ IN-SCOPE & AUTHORIZED`.
   * Click `[ Proceed to AI Planning → ]`.
2. **Tab 2: AI Agent & Plan**:
   * Click `[ Generate Adaptive Plan ]`.
   * Review the **AI Reasoning Trace** explaining why specific tools are chosen based on expected open ports.
   * Click `[ Approve Plan & Launch Orchestrator → ]`.
3. **Tab 3: Tool Orchestrator**:
   * Click `[ ▶ Run All Approved Scans ]` to trigger all 7 scanners.
   * Watch live streaming logs in the embedded terminal console.
   * Observe green `COMPLETED` badges and execution timers.
   * Click `[ Proceed to Raw Ingestion → ]`.
4. **Tab 4: Raw Ingestion**:
   * Inspect unedited XML, JSON, and stdout outputs (e.g. Nessus Plugin 153723 XML, ZAP SQLi HTTP request/response).
   * Click `[ Proceed to Correlated Findings → ]`.
5. **Tab 5: Correlated Findings**:
   * Click on Finding `VAPT-001 (Apache Path Traversal)`.
   * Notice the purple `Merged (4x)` badge indicating Nmap, Nikto, Nessus, and OpenVAS were merged without duplicate noise.
   * Click `[ Proceed to Risk Prioritization → ]`.
6. **Tab 6: Risk Prioritization**:
   * Inspect 0–100 risk scores combining CVSS, external exposure, exploitability, and asset value.
   * Click `[ Proceed to Human Approval Gate → ]`.
7. **Tab 7: Human Gate**:
   * Review the pending Metasploit check-mode test.
   * Confirm the read-only blast radius and click `[ Approve Validation ✓ ]`.
   * Verify your approval is logged in the **Immutable Audit Trail**.
   * Click `[ Proceed to Final VAPT Report → ]`.
8. **Tab 8: VAPT Report**:
   * View the executive summary, severity breakdown charts, and prioritized remediation roadmap.
   * Click `[ Download / Print PDF Report ]` to print or save a PDF copy.

---

## 🛡️ Truthful Tool Integration Matrix

In strict compliance with Section 6 of the hackathon problem statement:

| Tool | Integration Type | Primary Role in Platform | Licensing / Availability |
| :--- | :--- | :--- | :--- |
| **Nmap v7.94** | **Live (CLI)** | Host, port, and service discovery; banner grabbing | Open Source (NPSL / GPL) |
| **Nikto v2.5.0** | **Live (CLI)** | Web server configuration and known-issue checks | Open Source (GPLv2) |
| **OWASP ZAP v2.14** | **Live (API)** | Dynamic web application & REST API injection fuzzing | Open Source (Apache 2.0) |
| **Tenable Nessus** | **Import-Only** | Infrastructure vulnerability assessment (`.nessus` XML) | Commercial Proprietary (Tenable) |
| **OpenVAS / Greenbone** | **Import-Only** | Community vulnerability assessment & NVT correlation | Open Source (GPLv2+) |
| **Burp Suite Pro** | **Import-Only** | Analyst-assisted web testing & BOLA/IDOR HTTP export | Commercial Proprietary (PortSwigger) |
| **Metasploit v6.4** | **Live (Controlled)** | Safe check-mode validation; **strictly human-approved** | Open Source (BSD 3-Clause) |

---

## 📚 Documentation & Reference Manuals

The repository includes two standalone PDF reference guides compiled directly in `/public`:

1. **[Master Reference Guide (36 Pages)](public/DataOps_VAPT_Master_Guide_Beginner_to_Architect.pdf)**: Complete beginner-to-architect handbook covering cybersecurity fundamentals (fortress analogy), line-by-line problem statement analysis, deep dives into all 7 tools, algorithmic math, NIST SP 800-115 / OWASP standards, and a 15-minute presentation script with 10 judge Q&A defenses.
2. **[Visual Step-by-Step User Guide (19 Pages)](public/DataOps_VAPT_Step_by_Step_User_Guide.pdf)**: Fully illustrated, click-by-click manual containing high-resolution screenshots for all 8 workflow screens, numbered button click instructions, and beginner FAQs.

---

## 🔒 Safety, Ethics & Boundaries

* **Confinement**: All testing is strictly restricted to organizer-authorized lab subnets (`10.0.12.0/24`).
* **Zero Autonomous Exploitation**: Offensive exploitation is disabled by design.
* **Human-in-the-Loop**: Active validation runs solely in non-destructive `check` mode and requires human analyst review and sign-off.
* **Reproducibility**: No fabricated CVEs, simulated proof without underlying telemetry, or hallucinated scores.

---

## 📄 License
This project was developed for the DataOps SOC | NOC | VAPT Innovation Hackathon. Licensed under the [Apache-2.0 License](LICENSE).
