# AI Agent for Automated Penetration Testing (VAPT Platform)
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
