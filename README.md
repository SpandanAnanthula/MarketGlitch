# 🌐 MarketGlitch / MarketPulse India
### AI Market Intelligence & Autonomous Signal Discovery Platform for Indian Electronics & Semiconductor Manufacturing

MarketGlitch (MarketPulse India) is an enterprise-grade AI market intelligence SaaS tailored specifically for Indian electronics manufacturing services (EMS), automotive power electronics, and semiconductor packaging industries. 

Built with **React + TypeScript + Tailwind CSS** on the frontend and **FastAPI + MongoDB + Python** on the backend.

---

## ⚡ Key Highlights
* **Zero-Hallucination Empirical Grounding (§12)**: Every metric, competitor capex filing, and tender reference is grounded in statutory data from Commerce Ministry DGCIS (HS 8542 & 8541), GeM public tenders, BSE exchange filings, and MeitY policy orders.
* **Strict Multi-Tenant Isolation (§10)**: Dynamic tenant configuration switching between 3 distinct manufacturing profiles with 100% data separation.
* **Live Weekly Timeline Isolation**: Instant switching between **Present Week** (live daily streaming up to Nov 20, 2026) and **Past Week** (reproducible audit cutoff at Nov 12, 2026).
* **Interactive Executive KPI Tile Drilldowns**: Modal inspection of considered market developments, competitor moves, level-3 strategic signals, tenders, and official data sources.
* **Interactive Charting Suite**:
  - **Executive Dashboard**: Dynamic Market Activity Curve (AreaChart) adapting to the selected timeline.
  - **Competitor Intelligence**: Competitive Positioning Bubble Chart (ScatterChart) with dynamic auto-scaling `[0, 45%]` Y-axis and dynamic workspace legend.
  - **Opportunity Tracker**: Quarterly pipeline growth trends (BarChart) matching exact tenant contract pipeline values.
  - **Industry Intelligence**: DGCIS HS 8542 Trade Sparklines and ISM 2030 Trajectory projections.
  - **My Company**: Customer segment revenue breakdown (Donut / PieChart).

---

## 🏢 Multi-Tenant Demonstration Accounts

| Attribute | Account 1 (Integrated EMS) | Account 2 (EV Inverters) | Account 3 (Bare PCBs) |
| :--- | :--- | :--- | :--- |
| **Company Name** | Bharat EMS Solutions Pvt Ltd | NexGen EV Inverters & Power Modules | Shakti Multilayer Circuits & PCB Fab |
| **Workspace ID** | `ws_electronics_default` | `ws_auto_inverters` | `ws_bare_pcb_tech` |
| **Email Login** | `contact@bharat-ems.in` | `strategy@nexgen-inverters.in` | `procurement@shakticircuits.in` |
| **Password** | `marketpulse2026` | `marketpulse2026` | `marketpulse2026` |
| **Pipeline Value** | **₹99.9 Cr** | **₹50.0 Cr** | **₹42.5 Cr** |
| **Competitors** | Dixon, Kaynes, Syrma, Amber | Kaynes (Vishay JV), Tata Semi, Centum, Avalon | Amber (Ascent), Syrma (Elemaster), AT&S |

---

## 🚀 Quick Start (Local Setup)

### 1. Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at: `http://localhost:8000/docs`

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Dashboard will be available at: `http://localhost:3000`

---

## 🛠️ Project Structure
```
MarketGlitch/
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models/           # Pydantic schemas (Company, Competitor, Industry, Source)
│   │   ├── routers/          # API endpoints (Onboarding, Competitors, Industry, Sources)
│   │   ├── seeds/            # Canonical market intelligence seeders & live ingestion snapshots
│   │   └── services/         # Scrapers, collectors, normalizers, signal synthesizer
│   ├── requirements.txt
│   └── verify_steps_and_flow.py
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Multi-tenant state controller & routing
│   │   ├── components/       # Header, Sidebar, SourceFreshnessBar, Modals
│   │   ├── data/             # Multi-tenant workspaces & live market data
│   │   ├── pages/            # Executive, Competitor, Industry, Opportunities, MyCompany
│   │   └── services/         # Axios API clients
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── CHECKLIST.md              # Feature delivery verification matrix
├── EMERGENT_PROMPT_GUIDE.md  # Detailed prompt guide for Emergent deployment
├── FEATURE_PAGE_MAP.md       # Complete sitemap & user journey navigation map
├── preview.html              # Standalone zero-dependency single-file preview
└── README.md
```

---

## 📜 Source Governance & Official Data Feeds (§18)
All intelligence pipelines ingest exclusively from authorized public feeds:
1. **Ministry of Commerce (DGCIS)**: Monthly trade flows under HS Code 8542 & 8541.
2. **GeM & CPPP**: Railway (Kavach), Defense (DRDO/BEL), and state electronics tenders.
3. **BSE & NSE India**: Statutory corporate capex declarations and investor presentations.
4. **IP India / WIPO**: Published patents in semiconductor packaging and power substrates.
5. **PIB & MeitY**: PLI 2.0, SPECS, and India Semiconductor Mission (ISM) policy releases.
