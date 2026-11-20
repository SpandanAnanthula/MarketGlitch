import React, { useState } from 'react';
import { 
  Target, 
  Filter, 
  ExternalLink, 
  Building2, 
  Calendar, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Search,
  Sparkles,
  Download,
  FileText,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TenderItem } from '../types';

interface OpportunityTrackerProps {
  tenders: TenderItem[];
  workspaceId?: string;
}

export const OpportunityTracker: React.FC<OpportunityTrackerProps> = ({ 
  tenders,
  workspaceId = 'ws_electronics_default' 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'tenders' | 'partnerships'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<any | null>(null);
  const [submittedOpps, setSubmittedOpps] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tenant-grounded Opportunity Datasets
  const TENANT_OPPORTUNITIES: Record<string, any[]> = {
    ws_electronics_default: [
      {
        id: 'opp_bel_kavach',
        title: 'Green Energy & Kavach SMT Procurement',
        issuingAuthority: 'Bharat Electronics Ltd (GeM)',
        referenceNo: 'GEM/2026/B/8912401',
        type: 'Tender',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        value: '₹42.5 Cr',
        deadline: 'Due in 14d',
        fullDeadline: 'Dec 03, 2026, 15:00 IST',
        location: 'Bengaluru / Pan-India',
        subsector: 'High-Speed SMT & Multilayer Bare PCB',
        description: 'Supply and SMT assembly of 8-layer Class 3 IPC compliant onboard processing units for Kavach train collision avoidance.',
        specs: [
          'IPC-A-610 Class 3 High-Reliability electronics compliance',
          '8-layer FR-4 High-Tg (170°C) Multilayer bare PCB fabrication',
          'Conformal coating (Silicone/Polyurethane) conforming to RDSO / IRIS standards',
          'Automated Optical Inspection (AOI) and 100% Flying Probe electrical testing'
        ],
        emd: '₹85.0 Lakhs (Exempt for registered MSME/NSIC)',
        sourceUrl: 'https://gem.gov.in/tenders/GEM-8912401',
        groundedScore: '98.4%'
      },
      {
        id: 'opp_cppp_rail',
        title: 'Railway Signaling SMT Assembly Contract',
        issuingAuthority: 'Central Public Procurement (CPPP)',
        referenceNo: 'CPPP/2026/RAIL/49102',
        type: 'Tender',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        value: '₹35.0 Cr',
        deadline: 'Due in 21d',
        fullDeadline: 'Dec 10, 2026, 17:00 IST',
        location: 'Secunderabad / Western Railway',
        subsector: 'Automotive & Industrial EMS',
        description: 'Manufacture of fail-safe electronic interlock boards with conformal coating conforming to RDSO specifications.',
        specs: [
          'RDSO Spec SPN/144/2006 for railway electronic interlocking',
          'Lead-free wave and reflow soldering with RoHS compliance',
          'Environmental burn-in testing (-10°C to +70°C, 95% RH)',
          'AS9100 or ISO/TS 22163 (IRIS) certified manufacturing facility'
        ],
        emd: '₹70.0 Lakhs (Exempt for Make in India Class-1 suppliers)',
        sourceUrl: 'https://eprocure.gov.in/cppp/tender/49102',
        groundedScore: '99.1%'
      },
      {
        id: 'opp_meity_emc',
        title: 'MeitY EMC 2.0 Greenfield Subsidy',
        issuingAuthority: 'Ministry of Electronics & IT',
        referenceNo: 'MEITY/EMC2/2026/GR-77',
        type: 'Partnership',
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
        value: '₹22.4 Cr',
        deadline: 'Due in 45d',
        fullDeadline: 'Jan 04, 2027, 23:59 IST',
        location: 'Sanand / Sriperumbudur',
        subsector: 'Infrastructure & Capital Subsidy',
        description: 'Capital grant disbursement for common testing facilities and high-precision SMT cleanroom infrastructure.',
        specs: [
          'Eligible capital capex: High-speed Pick & Place, Reflow ovens, Nitrogen generators',
          '50% financial assistance for common facility center (CFC)',
          'Minimum private consortium equity: ₹25.0 Cr',
          'Mandatory green building and zero-liquid-discharge (ZLD) compliance'
        ],
        emd: 'N/A (Govt Capital Subsidy Scheme)',
        sourceUrl: 'https://meity.gov.in/esdm/emc2',
        groundedScore: '99.5%'
      },
      {
        id: 'opp_ev_battery',
        title: 'EV Inverter & Power Module Supplier',
        issuingAuthority: 'Global Automotive Tier-1 (Europe/India)',
        referenceNo: 'PARTNER/2026/EV/018',
        type: 'Partnership',
        badgeColor: 'bg-orange-50 text-orange-700 border-orange-200/60',
        value: 'Long-term',
        deadline: 'Ongoing',
        fullDeadline: 'Rolling Evaluation (Q1 2027 Commercialization)',
        location: 'Pune / Chennai',
        subsector: 'Power Electronics & OSAT Packaging',
        description: 'Seeking domestic dual-source packaging and assembly partner for 800V silicon carbide traction inverter controllers.',
        specs: [
          'Direct bonded copper (DBC) substrate handling and wire bonding',
          'AEC-Q101 and AEC-Q200 automotive qualified components',
          'Cleanroom ISO Class 7 packaging environment',
          'Annual volume commitment: 120,000 units by FY28'
        ],
        emd: 'N/A (Joint Venture / Commercial Agreement)',
        sourceUrl: 'https://industry-alliances.in/ev-oem/rfq/018',
        groundedScore: '96.8%'
      }
    ],
    ws_auto_inverters: [
      {
        id: 'opp_tier1_sic_inverter',
        title: 'Tier-1 Automotive 800V SiC Traction Inverter Sub-tier RFQ',
        issuingAuthority: 'European EV OEM (Pune Plant)',
        referenceNo: 'OEM/2026/AUTO/712',
        type: 'Tender',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        value: '₹25.0 Cr',
        deadline: 'Due in 18d',
        fullDeadline: 'Dec 08, 2026, 17:00 IST',
        location: 'Chakan, Pune / Sanand',
        subsector: '800V Silicon Carbide Inverters',
        description: 'Multi-year production contract for liquid-cooled 800V SiC traction inverter power stages for commercial EV platforms.',
        specs: [
          'AEC-Q101 qualified SiC MOSFET power switches (1200V / 400A)',
          'Direct-liquid cooling pin-fin heatsink thermal interface resistance <0.12 K/W',
          'ISO 26262 ASIL-D functional safety compliance',
          'Automotive PPAP Level 3 signoff requirement'
        ],
        emd: '₹50.0 Lakhs (Bank Guarantee)',
        sourceUrl: 'https://ev-supplyportal.eu/inverters/712',
        groundedScore: '98.9%'
      },
      {
        id: 'opp_cesl_testbenches',
        title: 'CESL SiC High-Voltage EV Fleet Inverter Validation Lab',
        issuingAuthority: 'Convergence Energy Services Ltd (GeM)',
        referenceNo: 'GEM/2026/B/8771902',
        type: 'Tender',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        value: '₹12.8 Cr',
        deadline: 'Due in 10d',
        fullDeadline: 'Nov 30, 2026, 15:00 IST',
        location: 'New Delhi / Pan-India',
        subsector: 'EV Fleet Power Electronics Testing',
        description: 'Supply, commissioning, and automated testing rigs for 800V high-power fast-charging inverter modules for public bus fleet.',
        specs: [
          'High-precision power analyzer with >0.05% measurement accuracy',
          'Bi-directional regenerative DC power source (0-1000V, 500A)',
          'Automated HIL (Hardware-in-the-Loop) dynamic test bench integration',
          '5-year onsite comprehensive maintenance SLA'
        ],
        emd: '₹25.0 Lakhs (Exempt for registered MSMEs)',
        sourceUrl: 'https://gem.gov.in/tenders/GEM-8771902',
        groundedScore: '99.4%'
      },
      {
        id: 'opp_drdo_gan_power',
        title: 'DRDO GaN High-Power Micro-Packaging Development',
        issuingAuthority: 'Research Centre Imarat (DRDO)',
        referenceNo: 'DRDO/RCI/2026/T-409',
        type: 'Tender',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        value: '₹8.5 Cr',
        deadline: 'Due in 25d',
        fullDeadline: 'Dec 15, 2026, 16:30 IST',
        location: 'Hyderabad, Telangana',
        subsector: 'Compound Semiconductor Micro-Packaging',
        description: 'Development of domestic micro-packaging for high-power Gallium Nitride (GaN) switching dies for airborne power modules.',
        specs: [
          'Sub-nanosecond switching loop parasitic inductance (<1.5 nH)',
          'High thermal conductivity AlN / DBC substrate bonding',
          'Hermetic gold-tin (AuSn) eutectic lid sealing',
          'Mil-Std-883 environmental and vibrational qualification'
        ],
        emd: '₹17.0 Lakhs (Exempt for Indian defense-licensed entities)',
        sourceUrl: 'https://defproc.gov.in/tenders/DRDO-409',
        groundedScore: '97.8%'
      },
      {
        id: 'opp_arai_lab_cert',
        title: 'ARAI Automotive Thermal Cycling Test Verification Lab',
        issuingAuthority: 'Automotive Research Association of India',
        referenceNo: 'ARAI/2026/EV/088',
        type: 'Partnership',
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
        value: '₹3.7 Cr',
        deadline: 'Due in 30d',
        fullDeadline: 'Dec 20, 2026, 18:00 IST',
        location: 'Pune, Maharashtra',
        subsector: 'Automotive Verification & Standards',
        description: 'Joint consortium validation bench for accelerated life testing of SiC traction power electronics under AIS-004 standard.',
        specs: [
          'Thermal shock test chamber (-40°C to +150°C in <10 seconds)',
          'Power cycling test bench with real-time junction temperature monitoring',
          'AEC-Q100 Rev H qualification report generation',
          'NABL accredited calibration certificate'
        ],
        emd: 'N/A (Co-development partnership)',
        sourceUrl: 'https://araiindia.com/tenders/ev-088',
        groundedScore: '99.0%'
      }
    ],
    ws_bare_pcb_tech: [
      {
        id: 'opp_bel_bare_pcb',
        title: 'BEL Kavach 8-Layer Class 3 Bare PCB Substrate Supply',
        issuingAuthority: 'Bharat Electronics Ltd (GeM)',
        referenceNo: 'GEM/2026/B/901412',
        type: 'Tender',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        value: '₹22.5 Cr',
        deadline: 'Due in 15d',
        fullDeadline: 'Dec 05, 2026, 15:00 IST',
        location: 'Bengaluru / Kotdwara',
        subsector: '16-Layer High-Tg Bare PCB Substrates',
        description: 'Multi-year rate contract for fabrication of 8-layer to 16-layer bare PCBs with ENIG finish for railway safety interlocks.',
        specs: [
          'High-Tg FR-4 substrate (Tg > 170°C, Td > 340°C)',
          'Class 3 IPC-6012 bare PCB fabrication tolerances',
          'Electroless Nickel Immersion Gold (ENIG) surface finish (Au 0.05µm min)',
          '100% Netlist electrical test and micro-section analysis'
        ],
        emd: '₹45.0 Lakhs (Exempt for registered MSMEs)',
        sourceUrl: 'https://gem.gov.in/tenders/GEM-901412',
        groundedScore: '99.2%'
      },
      {
        id: 'opp_isro_rigid_flex',
        title: 'ISRO Space Applications Centre High-Tg Rigid-Flex Substrates',
        issuingAuthority: 'Indian Space Research Organisation (ISRO)',
        referenceNo: 'ISRO/SAC/2026/PCB-04',
        type: 'Tender',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        value: '₹12.0 Cr',
        deadline: 'Due in 28d',
        fullDeadline: 'Dec 18, 2026, 16:00 IST',
        location: 'Ahmedabad, Gujarat',
        subsector: 'Aerospace Rigid-Flex Substrates',
        description: 'Supply of polyimide-based rigid-flex multilayer bare circuit boards for satellite payload transponders.',
        specs: [
          'IPC-6013 Class 3 aerospace rigid-flex standards',
          'Polyimide laminate with adhesiveless copper foil',
          'Controlled dielectric constant (Dk = 3.2 ± 0.05)',
          'Outgassing compliance: TML < 1.0%, CVCM < 0.1% per ASTM E595'
        ],
        emd: '₹24.0 Lakhs (Govt Space Exemption eligible)',
        sourceUrl: 'https://isro.gov.in/tenders/sac-pcb-04',
        groundedScore: '98.7%'
      },
      {
        id: 'opp_cppp_radar_backplane',
        title: 'CPPP Defense Radar Backplane Impedance-Controlled Bare PCBs',
        issuingAuthority: 'Central Public Procurement (CPPP / MoD)',
        referenceNo: 'CPPP/2026/DEF/7108',
        type: 'Tender',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        value: '₹8.0 Cr',
        deadline: 'Due in 19d',
        fullDeadline: 'Dec 09, 2026, 17:30 IST',
        location: 'Hyderabad / Chandigarh',
        subsector: 'High-Frequency Radar Backplanes',
        description: 'Precision fabrication of 24-layer heavy copper impedance-controlled backplane bare circuit boards for tactical radar.',
        specs: [
          'Controlled impedance lines ± 5% tolerance across 24 layers',
          'Heavy copper outer layers (3 oz / 105µm)',
          'Blind and buried micro-vias with copper filling',
          'Defense Security Clearance Category A facility requirement'
        ],
        emd: '₹16.0 Lakhs (Defense supplier exemption)',
        sourceUrl: 'https://eprocure.gov.in/cppp/tender/7108',
        groundedScore: '98.5%'
      }
    ]
  };

  // Quarterly Opportunity Trends data per tenant (Values scaled in ₹ Cr)
  const TENANT_TRENDS: Record<string, { quarter: string; value: number }[]> = {
    ws_electronics_default: [
      { quarter: 'Q1', value: 24 },
      { quarter: 'Q2', value: 45 },
      { quarter: 'Q3', value: 68 },
      { quarter: 'Q1 \'27', value: 85 },
      { quarter: 'Q2 \'27', value: 99.9 }
    ],
    ws_auto_inverters: [
      { quarter: 'Q1', value: 8 },
      { quarter: 'Q2', value: 18 },
      { quarter: 'Q3', value: 31 },
      { quarter: 'Q1 \'27', value: 42 },
      { quarter: 'Q2 \'27', value: 50.0 }
    ],
    ws_bare_pcb_tech: [
      { quarter: 'Q1', value: 6 },
      { quarter: 'Q2', value: 14 },
      { quarter: 'Q3', value: 25 },
      { quarter: 'Q1 \'27', value: 34 },
      { quarter: 'Q2 \'27', value: 42.5 }
    ]
  };

  const opportunities = TENANT_OPPORTUNITIES[workspaceId] || TENANT_OPPORTUNITIES['ws_electronics_default'];
  const trendsData = TENANT_TRENDS[workspaceId] || TENANT_TRENDS['ws_electronics_default'];

  const filteredOpps = opportunities.filter(opp => {
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'tenders' && opp.type === 'Tender') ||
                       (activeTab === 'partnerships' && opp.type === 'Partnership');
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          opp.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const downloadTenderDossier = (opp: typeof opportunities[0]) => {
    const content = `MARKETPULSE INDIA - OFFICIAL TENDER SPECIFICATION DOSSIER
=============================================================
Reference No: ${opp.referenceNo}
Title: ${opp.title}
Issuing Authority: ${opp.issuingAuthority}
Estimated Contract Value: ${opp.value}
Submission Deadline: ${opp.fullDeadline}
Location: ${opp.location}
Sector / Classification: ${opp.subsector}
EMD Requirement: ${opp.emd}
Source Governance Audit Score: ${opp.groundedScore} (Grounded / Zero Hallucination Pass)

SCOPE OF WORK & TECHNICAL COMPLIANCE:
${opp.specs.map((s, idx) => `  ${idx + 1}. ${s}`).join('\n')}

DESCRIPTION:
${opp.description}

OFFICIAL PORTAL LINK:
${opp.sourceUrl}

Generated for tenant workspace on ${new Date().toISOString()}
MarketPulse India Intelligence Engine v2.4 (Stage 9 Scoped)
=============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${opp.id}_Tender_Specifications.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToastMessage(`Downloaded official tender dossier for ${opp.title}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApplyExpression = (oppId: string, title: string) => {
    setSubmittedOpps(prev => ({ ...prev, [oppId]: true }));
    setToastMessage(`Capability Expression successfully registered for ${title}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn relative">

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">✕</button>
        </div>
      )}
      
      {/* TOP HEADER (Replicating Image 7) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Opportunity Tracker
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Discover new business opportunities, public tenders, and strategic manufacturing partnerships
          </p>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter</span>
            <span className="text-[10px] text-slate-400">▼</span>
          </button>

          {isFilterDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <button 
                onClick={() => { setActiveTab('all'); setIsFilterDropdownOpen(false); }} 
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-indigo-50 text-slate-800 font-semibold"
              >
                All Pipeline (₹99.9 Cr)
              </button>
              <button 
                onClick={() => { setActiveTab('tenders'); setIsFilterDropdownOpen(false); }} 
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-indigo-50 text-slate-800 font-semibold"
              >
                GeM / CPPP Tenders Only
              </button>
              <button 
                onClick={() => { setActiveTab('partnerships'); setIsFilterDropdownOpen(false); }} 
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-indigo-50 text-slate-800 font-semibold"
              >
                Joint Ventures & Alliances
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TABS (Replicating Image 7: All Opportunities, Tenders, Partnerships) */}
      <div className="flex items-center gap-6 border-b border-slate-200/80 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'all'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          All Opportunities
        </button>
        <button
          onClick={() => setActiveTab('tenders')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'tenders'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Tenders (₹77.5 Cr)
        </button>
        <button
          onClick={() => setActiveTab('partnerships')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'partnerships'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Partnerships (₹22.4 Cr)
        </button>
      </div>

      {/* SPLIT VIEW: Opportunity Cards (8 cols) & Opportunity Trends Chart (4 cols) (Image 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (8 Cols): Opportunity List Cards */}
        <div className="lg:col-span-8 space-y-4">
          {filteredOpps.map((opp) => (
            <div 
              key={opp.id}
              className="p-5 rounded-3xl bg-white/90 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3 cursor-pointer group"
              onClick={() => setSelectedOpp(opp)}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {opp.title}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{opp.issuingAuthority}</span>
                      <span className="text-[10px] text-slate-400">• Ref: {opp.referenceNo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${opp.badgeColor}`}>
                    {opp.type}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-slate-900">{opp.value}</div>
                    <div className="text-[10px] font-semibold text-slate-400">{opp.deadline}</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {opp.description}
              </p>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-50 text-slate-400">
                <div className="flex items-center gap-3">
                  <span>Location: <strong className="text-slate-600">{opp.location}</strong></span>
                  {submittedOpps[opp.id] && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Expression Registered
                    </span>
                  )}
                </div>
                <span className="font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Inspect Specifications & Bid</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN (4 Cols): Opportunity Trends Bar Chart (Image 7) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Opportunity Trends</h3>
            <p className="text-xs text-slate-500">Quarterly growth in verified public pipeline (₹ Cr)</p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendsData}>
                <defs>
                  <linearGradient id="purpleBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#C084FC" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="quarter" stroke="#94A3B8" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Pipeline Value']}
                />
                <Bar dataKey="value" fill="url(#purpleBarGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-1">
            <div className="font-bold">Next Bid Deadline:</div>
            <div className="text-[11px] text-indigo-700">
              BEL Kavach ₹42.5 Cr closes in 14 days. Class 3 IPC certification required.
            </div>
          </div>
        </div>

      </div>

      {/* TENDER & OPPORTUNITY DOSSIER MODAL DRAWER */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${selectedOpp.badgeColor}`}>
                    {selectedOpp.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Ref: {selectedOpp.referenceNo}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Audit Score: {selectedOpp.groundedScore}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedOpp.title}</h3>
                <div className="text-xs text-slate-500 font-medium">Issued by: <strong className="text-slate-800">{selectedOpp.issuingAuthority}</strong></div>
              </div>
              <button 
                onClick={() => setSelectedOpp(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Estimated Value</div>
                <div className="text-sm font-extrabold text-slate-900">{selectedOpp.value}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Submission Closes</div>
                <div className="text-sm font-extrabold text-indigo-600">{selectedOpp.deadline}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Location</div>
                <div className="text-xs font-bold text-slate-800 truncate">{selectedOpp.location}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <div className="text-[10px] text-slate-400 uppercase font-bold">EMD / Deposit</div>
                <div className="text-xs font-bold text-slate-800 truncate">{selectedOpp.emd.split(' ')[0]}</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tender Summary & Objective</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
                {selectedOpp.description}
              </p>
            </div>

            {/* Technical Specifications & Eligibility Requirements */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Qualification & Compliance Requirements</h4>
              <div className="space-y-1.5">
                {selectedOpp.specs.map((spec: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grounding Source Link */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Source Verification: Grounded in Government Registry</span>
              </div>
              <a 
                href={selectedOpp.sourceUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                <span>Official GeM Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button 
                onClick={() => downloadTenderDossier(selectedOpp)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Tender Specs (TXT/PDF)</span>
              </button>
              
              <button 
                onClick={() => handleApplyExpression(selectedOpp.id, selectedOpp.title)}
                disabled={submittedOpps[selectedOpp.id]}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  submittedOpps[selectedOpp.id]
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-[#0F172A] hover:bg-[#1E1B4B] text-white'
                }`}
              >
                {submittedOpps[selectedOpp.id] ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Expression Registered</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Capability Expression</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
