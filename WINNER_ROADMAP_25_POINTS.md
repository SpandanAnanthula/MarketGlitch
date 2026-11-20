# 🏆 MarketGlitch 25/25 Point Winning Execution Plan

This document tracks the step-by-step implementation of all 5 scoring dimensions to achieve a full 25/25 score in the hackathon judging rubric.

---

## 📊 Score Progression Tracker

| Category | Initial Score | Target Score | Status |
| :--- | :---: | :---: | :---: |
| **1. Working Product** (9 pts max) | 7.0 | **9.0 / 9** | 🟡 In Progress |
| **2. Creativity & Fun** (5 pts max) | 2.0 | **5.0 / 5** | 🟡 In Progress |
| **3. Build Quality & AI Use** (4 pts max) | 2.0 | **4.0 / 4** | 🟡 In Progress |
| **4. Idea Clarity** (3 pts max) | 2.5 | **3.0 / 3** | 🟡 In Progress |
| **5. Pitch & Q&A** (4 pts max) | 3.0 | **4.0 / 4** | 🟡 In Progress |
| **TOTAL** | **16.5** | **25.0 / 25** | 🚀 Executing |

---

## 🎯 Implementation Checklist

### Phase 1: Layout Consistency & Locking (Immediate User Request)
- [ ] **Lock Top Bar**: Pinned header with backdrop blur, ensuring workspace switch & timeline scope stay visible on scroll.
- [ ] **Lock Sidebar**: Fixed sticky sidebar (`h-screen`, `sticky top-0`) with independent vertical scroll.
- [ ] **Sidebar Text Alignment**: Fix "Strategic Intelligence" text wrapping and enforce strict `text-left` alignment so it never centers.
- [ ] **Sidebar Width & Spacing**: Adjust width to `w-70` so navigation labels and status badges breathe comfortably.

### Phase 2: Category 2 & 3 — AI Strategy Chat & Real AI Grounding (The Killer Feature)
- [ ] **AI Strategist Floating Chat (`AiStrategyChat.tsx`)**:
  - Accessible from any page via floating pill / button in bottom-right.
  - Pre-seeded with 4 high-value executive prompts:
    - *"Should I bid on the BEL Kavach tender (₹42.5 Cr)?"*
    - *"How does Dixon's ₹1,000 Cr capex threat affect my margins?"*
    - *"Evaluate our competitive position against Kaynes-Vishay SiC JV"*
    - *"What subsidies can I claim under MeitY EMC 2.0?"*
  - Contextual awareness: automatically passes active workspace (`Bharat EMS` vs `NexGen EV` vs `Shakti PCB`), active timeline, competitors, and tenders to the AI engine.
  - Streaming typing effect with grounded citations (`[Source: BSE Filing Nov 2026]`, `[GeM Reference GEM/2026/B/8912401]`).
  - Cache responses in `localStorage` for sub-millisecond retrieval.
- [ ] **What-If Scenario Simulator (`WhatIfSimulator.tsx`)**:
  - Interactive simulator modal on Executive Dashboard.
  - Scenarios:
    1. *Consolidation Shock*: "Dixon acquires Syrma SGS — recalculate market share and SMT capacity."
    2. *Tariff & Trade Shift*: "DGTR imposes 15% anti-dumping duty on bare PCB imports from China."
    3. *PLI Capex Surge*: "Government raises SPECS component subsidy cap from 25% to 40%."
  - Computes impact on tenant revenue, market share delta, and generates AI action recommendations.

### Phase 3: Category 2 & 3 — Live Intelligence Ticker & Real External API
- [ ] **Live Intelligence Feed Ticker**:
  - Real-time animated ticker below the header with pulsing green live dot.
  - Rotates through real verified market events every 7 seconds with subtle slide-in animation.
- [ ] **Live External Data Integration**:
  - Integrate live USD/INR exchange rate and benchmark macro indicators directly into the header / industry page with real live timestamps.
- [ ] **Mobile Responsiveness**:
  - Responsive hamburger drawer navigation for mobile screens (`<md`).
  - Stacked KPI tile grid (2-column on mobile, 6-column on desktop).
  - Responsive scroll wrappers on all charts.

### Phase 4: Category 1 — Working Product Hardening & Fallbacks
- [ ] **Global Error Boundary (`ErrorBoundary.tsx`)**:
  - Catches any unexpected rendering errors and presents a sleek branded fallback screen with a "Reset View" button.
- [ ] **Page Transition Skeletons**:
  - Smooth skeleton loaders when switching between pages or loading new tenant workspaces.
- [ ] **Shareable Executive Intelligence Dossier**:
  - "Export Executive Snapshot" generating an instant printable / shareable executive summary card.

### Phase 5: Category 4 & 5 — Idea Clarity & Pitch Materials
- [ ] **Punchy One-Liner Banner**:
  - Added to Login screen and Top Header: *"MarketGlitch gives Indian manufacturers an AI strategist that watches competitors, tenders, and trade policy — so you never miss a move."*
- [ ] **Interactive 30-Second Guided Tour**:
  - 4-step quick highlight explaining (1) KPI Tiles, (2) Timeline Scope, (3) Multi-tenant Switch, (4) AI Strategist.
- [ ] **Mentor Feedback Acknowledgment Banner**:
  - Prominently showing: *"Incorporating mentor feedback: strict multi-tenant isolation, verifiable weekly timeline filtering, and zero-hallucination AI grounding."*
- [ ] **Judge Q&A Cheat Sheet (`PITCH_AND_QA_SCRIPT.md`)**:
  - Pre-packaged answers to all tough questions (*"Where's the AI?"*, *"Is the data real?"*, *"Who pays for this?"*, *"Why not ChatGPT?"*).
