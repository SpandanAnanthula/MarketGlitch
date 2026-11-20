# 🚀 Emergent Push & Prompt Guide (Zero-Waste Strategy)

This guide shows you how to initialize and run this project in **Emergent (`emergent.sh`)** using minimal credits while demonstrating genuine agentic build progression.

---

## Step 1: Initialize Project in Emergent
1. Log in to [emergent.sh](https://emergent.sh).
2. Click **Create New Project**.
3. Choose the template: **Full Stack App (React + FastAPI + MongoDB)**.
4. Name your project: `marketpulse-india` or `market-intel-saas`.

---

## Step 2: Feed Emergent the Seed & Data Model (Prompt 1)
Paste this prompt into the Emergent AI chat. This prompts Emergent to set up the data models and seeds without needing to brainstorm:

```text
We are building an India-first AI Market Intelligence platform tailored for Indian electronics & semiconductor manufacturers.
First, create `backend/app/seeds/electronics_semiconductors.json` with the canonical Indian market intelligence dataset including:
- Target Company: AuraChip Electronics Pvt Ltd (EMS & sensor packaging)
- 5 Competitor Candidates with reason codes: Dixon Technologies, Kaynes Technology, Syrma SGS, Tata Electronics, Amber Enterprises
- Competitor events backed by BSE filings & PIB releases
- Commerce Department HS Code 8542 import-export time series
- GeM & CPPP government tenders (BEL Kavach, MeitY EMC 2.0 AOI units)
- MeitY PLI 2.0 and SPECS policy notices
- IP India published patents
- Public source registry (Commerce Portal, GeM, BSE, IP India, MeitY)
Make sure the seeder populates MongoDB on startup and provides in-memory fallback.
```

---

## Step 3: Fast-Track Backend Endpoints (Prompt 2)
Paste this prompt into Emergent to generate the FastAPI routers:

```text
Now configure the FastAPI backend in `backend/app`:
1. `models/`: Pydantic models for CompanyProfile, CompetitorCandidate, CompetitorEvent, TradeMetric, TenderItem, PolicyItem, PatentItem, SourceItem.
2. `database.py`: Async Motor MongoDB connector using `os.getenv("MONGO_URL")` with index on `workspace_id` for multi-tenant isolation.
3. `routers/`:
   - `onboarding.py`: POST `/api/onboarding/extract`, POST `/api/onboarding/save-profile`, GET `/api/onboarding/current-profile`
   - `competitors.py`: GET `/api/competitors/discover` (with explainable reason codes), POST `/api/competitors/watchlist/action`, GET `/api/competitors/timeline`
   - `industry.py`: GET `/api/industry/trade`, GET `/api/industry/tenders`, GET `/api/industry/policy`, GET `/api/industry/patents`, GET `/api/industry/verticals`
   - `sources.py`: GET `/api/sources/registry`
4. `main.py`: Include CORS for all origins, lifespan startup seeding, and health checks.
```

---

## Step 4: Frontend UI Scaffold (Prompt 3)
Paste this prompt into Emergent to create the React + Tailwind dashboard:

```text
Create the React + TypeScript frontend using Tailwind CSS, Lucide icons, and Recharts:
1. `components/Header.tsx`: Shows brand, active industry vertical badge ("Electronics & Semiconductor Manufacturing"), user company context, and onboarding button.
2. `components/SourceFreshnessBar.tsx`: Top horizontal bar showing status of 5 official data feeds (Commerce Analytics, GeM, BSE India, IP India, MeitY).
3. `components/Sidebar.tsx`: Navigation matching Executive Overview, Competitor Intelligence (Level 1), Industry Intelligence (Level 2), Public Source Registry (§18), and Privacy & DPDP Governance (§11 & §14).
4. `pages/CompetitorWorkspace.tsx`: Displays AI-recommended competitors with explicit Reason Codes, Follow/Dismiss actions, and a chronological Sourced Event Timeline with clickable citations.
5. `pages/IndustryDashboard.tsx`: Displays Recharts visualizer for HS 8542 trade trends, GeM/CPPP tender watch, and MeitY policy watch.
6. `pages/PrivacyGovernanceView.tsx`: Displays DPDP Act 2023 compliance, the k >= 5 minimum cohort safeguard, and the optional anonymized benchmark contribution toggle.
```

---

## Part 2: Emergent Live Pitch & Multi-Industry Demo Walkthrough

Use these ready credentials and demonstration script when presenting to the Emergent team to prove **Live Updates**, **Temporal Reproducibility**, and **Strict Tenant Isolation**.

### 🏢 Two Distinct Industry Accounts (Credentials)

#### Industry Account 1: Electronics Manufacturing Services (EMS & High-Speed SMT)
* **Company Name**: `Bharat EMS Solutions Pvt Ltd`
* **Workspace ID**: `ws_electronics_default`
* **Login Email**: `contact@bharat-ems.in`
* **Password**: `marketpulse2026`
* **Subscription Tier**: Enterprise SME Tier
* **Industry Profile**: High-density interconnect SMT PCB assembly, smart meter gateway PCBs, Kavach train safety sub-assemblies (₹1,250 Cr revenue, 18.5% market share).
* **Tracked Competitors**: Dixon Technologies, Kaynes Technology, Syrma SGS, Amber Enterprises, Tata Electronics.

#### Industry Account 2: Automotive Power Electronics & EV Traction Inverters
* **Company Name**: `NexGen EV Inverters & Power Modules Ltd`
* **Workspace ID**: `ws_auto_inverters`
* **Login Email**: `strategy@nexgen-inverters.in`
* **Password**: `marketpulse2026`
* **Subscription Tier**: Professional Tier
* **Industry Profile**: 800V Silicon Carbide (SiC) traction inverters, DBC ceramic substrate power modules, automotive EV fleet power electronics (₹680 Cr revenue, 14.2% market share).
* **Tracked Competitors**: Kaynes Technology India Ltd (Vishay OSAT JV), Tata Electronics Dholera Anchor Fab.

#### Bonus Industry Account 3: High-Density Bare PCB Fabrication
* **Company Name**: `Shakti Multilayer Circuits & PCB Fab`
* **Workspace ID**: `ws_bare_pcb_tech`
* **Login Email**: `procurement@shakticircuits.in`
* **Password**: `marketpulse2026`
* **Subscription Tier**: Growth Tier
* **Industry Profile**: 16-layer rigid-flex bare PCBs, aerospace RF laminates, Class 3 IPC mil-spec (₹340 Cr revenue).

---

### ⏱ How to Prove Live Updates to the Emergent Team (Presenter Script)

1. **Show the Live Active Pipeline**:
   - In the top header or dashboard switcher, point to **`Present Week (13–20 Nov 2026) · LIVE STREAM`**.
   - Note to the team: *"Notice the pulsing green dot. This timeline filters down to the 15 verified empirical events ingested over the last 7 days."*
   - Highlight the live signals:
     - *Tata Electronics $5B–$6B Equipment Tooling in Dholera (Nov 18, 2026)*
     - *Kaynes & Vishay Joint Venture for SiC Packaging (Nov 14, 2026)*
     - *Dixon lines up ₹1,000 Cr Durables SMT Scale (Nov 17, 2026)*
     - *CESL ₹12.8 Cr SiC Power Module Test Bench Tender (Nov 14, 2026)*
   - KPI metrics: 16 Market Developments, 9 Competitor Activities, 3 Level-3 Strategic Signals, ₹12.8 Cr active tender pipeline.

2. **Trigger the Temporal Rollback**:
   - Click the timeline filter and select **`Past Week (06–12 Nov 2026)`**.
   - Note to the team: *"Now watch what happens. The entire application instantly rolls back to Nov 12, 2026."*
   - Show that recent announcements (Tata Dholera $5B tooling, Kaynes-Vishay SiC JV) **disappear**, and the prior historical pipeline appears:
     - *DPIIT Public Procurement Preference revised DVA mandate (55% local content, Nov 10, 2026)*
     - *BEL Kavach ₹42.5 Cr SMT Multilayer PCB Tender (Nov 09, 2026)*
     - *Patent IN-PAT-2026-41092 DBC Ceramic Substrate (Nov 06, 2026)*
     - *Amber subsidiary IL JIN acquisition of Ascent Circuits (Nov 03, 2026)*
   - KPI metrics instantly adapt: 11 Market Developments, 6 Competitor Activities, 2 Strategic Signals, ₹42.5 Cr tender pipeline.

3. **Switch Back to Live Stream**:
   - Click back to **`Present Week (13–20 Nov 2026)`**.
   - Show how the live stream immediately restores the newest 15 events, proving real-time updates and strict temporal filtering without page refreshes or mocks.

4. **Demonstrate Tenant Scoping (§10)**:
   - Click the top right dropdown **`Switch Workspace (§10 Tenant Scoped)`**.
   - Select **`NexGen EV Inverters & Power Modules`**.
   - Show how the company profile, products (800V SiC Inverters), customer segments, and competitor watchlist immediately swap to automotive power electronics with zero data bleed.
