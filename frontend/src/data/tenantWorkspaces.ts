import { CompanyProfile, StrategicSignal } from '../types';

export interface TenantWorkspaceConfig {
  id: string;
  name: string;
  email: string;
  initials: string;
  subsector: string;
  tier: string;
  profile: CompanyProfile;
  kpi: {
    developments: number;
    activities: number;
    signalsCount: number;
    pipelineValue: string;
    supplyRisks: number;
    sourcesCount: number;
    heroSummary: string;
  };
  products: Array<{
    id: number;
    title: string;
    category: string;
    leadTime: string;
    status: string;
  }>;
  customerSegments: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  competitors: Array<{
    id: string;
    name: string;
    ticker: string;
    marketShare: string;
    shareDelta: string;
    isPositive: boolean;
    price: string;
    mcap: string;
    capexScale: number;
    marketShareNum: number;
    bubbleSize: number;
    color: string;
    subsector: string;
    keyMove: string;
  }>;
  relevantSignalIds: string[];
}

export const TENANT_WORKSPACES: Record<string, TenantWorkspaceConfig> = {
  'ws_electronics_default': {
    id: 'ws_electronics_default',
    name: 'Bharat EMS Solutions Pvt Ltd',
    email: 'contact@bharat-ems.in',
    initials: 'UY',
    subsector: 'Integrated EMS & Surface Mount Assembly',
    tier: 'Enterprise Tier',
    profile: {
      workspace_id: 'ws_electronics_default',
      company_name: 'Bharat EMS Solutions Pvt Ltd',
      website: 'https://bharat-ems.in',
      email: 'contact@bharat-ems.in',
      description: 'Indian manufacturer of high-density interconnect SMT PCB assemblies and consumer electronics for Tier-1 suppliers.',
      sector: 'Electronics & Semiconductor Manufacturing',
      subsector: 'Integrated EMS & Surface Mount Assembly',
      products: [
        'High-Density SMT PCB Assemblies',
        'Automotive ECU Control Modules',
        'Smart Energy Meter Boards',
        'Telecom Line Cards'
      ],
      regions: ['Karnataka', 'Tamil Nadu', 'Maharashtra', 'NCR'],
      customer_segments: ['Consumer Durables OEMs', 'Automotive Tier-1', 'Defense & Aerospace Contractors'],
      market_share: '18.5%',
      annual_revenue: '₹1,250 Cr',
      growth_rate: '12.3% YoY'
    },
    kpi: {
      developments: 27,
      activities: 15,
      signalsCount: 5,
      pipelineValue: '₹99.9 Cr',
      supplyRisks: 2,
      sourcesCount: 9,
      heroSummary: 'Tracking 5 Indian electronics competitors, ₹99.9 Cr public tenders, and Dholera fab capex in real time.'
    },
    products: [
      { id: 1, title: 'High-Density SMT Assemblies', category: 'Surface Mount Technology', leadTime: '4 Weeks', status: 'High Demand' },
      { id: 2, title: 'Automotive ECU Sensor Boards', category: 'Automotive Grade', leadTime: '6 Weeks', status: 'AEC-Q100' },
      { id: 3, title: 'Smart Metering Gateway PCBs', category: 'Utilities & IoT', leadTime: '3 Weeks', status: 'Active Bid' },
      { id: 4, title: 'Telecom Multi-Gigabit Line Cards', category: 'Network Infrastructure', leadTime: '5 Weeks', status: 'Mass Production' }
    ],
    customerSegments: [
      { name: 'Enterprise Tier-1s', value: 45, color: '#3B82F6' },
      { name: 'Industrial SMBs', value: 35, color: '#A855F7' },
      { name: 'Defense & Aerospace', value: 20, color: '#F59E0B' }
    ],
    competitors: [
      {
        id: 'comp_dixon',
        name: 'Dixon Technologies',
        ticker: 'DIXON.NS',
        marketShare: '22.4%',
        shareDelta: '+0.8%',
        isPositive: true,
        price: '₹13,054.0',
        mcap: '₹78,200 Cr',
        capexScale: 90,
        marketShareNum: 22.4,
        bubbleSize: 320,
        color: '#6366F1',
        subsector: 'Consumer Electronics & High-Speed SMT',
        keyMove: '₹1,000 Cr Capex expansion for consumer durables and telecom hardware'
      },
      {
        id: 'comp_kaynes',
        name: 'Kaynes Technology',
        ticker: 'KAYNES.NS',
        marketShare: '20.4%',
        shareDelta: '+0.5%',
        isPositive: true,
        price: '₹2,890.0',
        mcap: '₹18,450 Cr',
        capexScale: 75,
        marketShareNum: 20.4,
        bubbleSize: 260,
        color: '#10B981',
        subsector: 'Industrial & Automotive EMS, OSAT Packaging',
        keyMove: 'Formed Joint Venture with Vishay Intertechnology for SiC power modules'
      },
      {
        id: 'comp_syrma',
        name: 'Syrma SGS Tech',
        ticker: 'SYRMA.NS',
        marketShare: '17.8%',
        shareDelta: '+0.3%',
        isPositive: true,
        price: '₹1,517.0',
        mcap: '₹8,820 Cr',
        capexScale: 60,
        marketShareNum: 17.8,
        bubbleSize: 210,
        color: '#F59E0B',
        subsector: 'High-Reliability EMS & Kavach Rail Systems',
        keyMove: 'Kavach SMT assembly subcontract and Elemaster JV deployment'
      },
      {
        id: 'comp_amber',
        name: 'Amber Enterprises',
        ticker: 'AMBER.NS',
        marketShare: '13.5%',
        shareDelta: '+0.3%',
        isPositive: true,
        price: '₹6,697.0',
        mcap: '₹22,600 Cr',
        capexScale: 68,
        marketShareNum: 13.5,
        bubbleSize: 190,
        color: '#8B5CF6',
        subsector: 'Bare Multilayer PCB Fab (Ascent Circuits)',
        keyMove: 'Completed 98.5% acquisition of Ascent Circuits for captive PCB supply'
      }
    ],
    relevantSignalIds: [
      'sig_osat_power_semicon_pivot',
      'sig_tata_dholera_fab_equipment_ramp',
      'sig_defense_rail_kavach_localization',
      'sig_bare_pcb_mna_consolidation',
      'sig_dixon_durables_smt_scale'
    ]
  },

  'ws_auto_inverters': {
    id: 'ws_auto_inverters',
    name: 'NexGen EV Inverters & Power Modules Ltd',
    email: 'strategy@nexgen-inverters.in',
    initials: 'NI',
    subsector: 'Automotive Power Electronics & Inverters',
    tier: 'Professional Tier',
    profile: {
      workspace_id: 'ws_auto_inverters',
      company_name: 'NexGen EV Inverters & Power Modules Ltd',
      website: 'https://nexgen-inverters.in',
      email: 'strategy@nexgen-inverters.in',
      description: 'Specialized manufacturer of 800V Silicon Carbide (SiC) traction inverter modules, high-voltage gate drivers, and EV motor controllers.',
      sector: 'Electronics & Semiconductor Manufacturing',
      subsector: 'Automotive Power Electronics & Inverters',
      products: [
        '800V SiC Traction Inverters',
        'Bidirectional On-Board Chargers (OBC)',
        'DC-DC Automotive Converters',
        'Direct Bonded Copper (DBC) Power Stacks'
      ],
      regions: ['Pune', 'Chennai', 'Sanand', 'Bengaluru'],
      customer_segments: ['Electric Vehicle OEMs (2W/4W/Bus)', 'Charging Infrastructure Providers', 'Renewable Solar Inverter Brands'],
      market_share: '14.2%',
      annual_revenue: '₹680 Cr',
      growth_rate: '28.4% YoY'
    },
    kpi: {
      developments: 18,
      activities: 8,
      signalsCount: 2,
      pipelineValue: '₹50.0 Cr',
      supplyRisks: 3,
      sourcesCount: 7,
      heroSummary: 'Tracking 800V Silicon Carbide traction inverters, power module OSAT packaging, and automotive Tier-1 RFQs.'
    },
    products: [
      { id: 1, title: '800V SiC Traction Inverter Core', category: 'EV Propulsion Systems', leadTime: '6 Weeks', status: 'Automotive Qualified' },
      { id: 2, title: 'Direct-Bonded Copper (DBC) Power Stack', category: 'Power Semiconductor Packaging', leadTime: '8 Weeks', status: 'AEC-Q101 Verified' },
      { id: 3, title: '11kW Bidirectional On-Board Charger', category: 'Automotive Power Units', leadTime: '5 Weeks', status: 'Commercial Supply' },
      { id: 4, title: 'Liquid-Cooled DC-DC Bus Converter', category: 'Power Electronics', leadTime: '4 Weeks', status: 'High Demand' }
    ],
    customerSegments: [
      { name: 'EV 2W/4W/Bus OEMs', value: 55, color: '#10B981' },
      { name: 'Fast-Charging Infrastructure', value: 25, color: '#6366F1' },
      { name: 'Solar & Grid Energy Storage', value: 20, color: '#F59E0B' }
    ],
    competitors: [
      {
        id: 'comp_kaynes',
        name: 'Kaynes Technology (Vishay JV)',
        ticker: 'KAYNES.NS',
        marketShare: '34.2%',
        shareDelta: '+1.4%',
        isPositive: true,
        price: '₹2,890.0',
        mcap: '₹18,450 Cr',
        capexScale: 85,
        marketShareNum: 34.2,
        bubbleSize: 310,
        color: '#10B981',
        subsector: 'Power Semiconductor Packaging & OSAT',
        keyMove: 'Sanand cleanroom construction for automotive SiC power module packaging'
      },
      {
        id: 'comp_tata_semi',
        name: 'Tata Electronics (Power Fab)',
        ticker: 'PRIVATE',
        marketShare: '26.5%',
        shareDelta: '+2.1%',
        isPositive: true,
        price: 'Unlisted',
        mcap: '₹91,000 Cr',
        capexScale: 95,
        marketShareNum: 26.5,
        bubbleSize: 350,
        color: '#6366F1',
        subsector: 'Dholera Fab Cleanroom & Automotive Tooling',
        keyMove: 'Announced $5B-$6B equipment spend for compound power semiconductors'
      },
      {
        id: 'comp_centum',
        name: 'Centum Electronics',
        ticker: 'CENTUM.NS',
        marketShare: '18.4%',
        shareDelta: '+0.6%',
        isPositive: true,
        price: '₹1,940.0',
        mcap: '₹5,400 Cr',
        capexScale: 55,
        marketShareNum: 18.4,
        bubbleSize: 200,
        color: '#F59E0B',
        subsector: 'Aerospace & Automotive Power Electronics',
        keyMove: 'Supplying space-qualified DC-DC converters and high-voltage modules'
      },
      {
        id: 'comp_avalon',
        name: 'Avalon Technologies',
        ticker: 'AVALON.NS',
        marketShare: '12.1%',
        shareDelta: '-0.2%',
        isPositive: false,
        price: '₹560.0',
        mcap: '₹3,680 Cr',
        capexScale: 45,
        marketShareNum: 12.1,
        bubbleSize: 160,
        color: '#EC4899',
        subsector: 'Box-Build Power Management Assemblies',
        keyMove: 'Expanded US export capacity for industrial EV charging sub-assemblies'
      }
    ],
    relevantSignalIds: [
      'sig_osat_power_semicon_pivot',
      'sig_tata_dholera_fab_equipment_ramp'
    ]
  },

  'ws_bare_pcb_tech': {
    id: 'ws_bare_pcb_tech',
    name: 'Shakti Multilayer Circuits & PCB Fab',
    email: 'procurement@shakticircuits.in',
    initials: 'SM',
    subsector: 'Bare Multilayer PCB Fabrication',
    tier: 'Growth Tier',
    profile: {
      workspace_id: 'ws_bare_pcb_tech',
      company_name: 'Shakti Multilayer Circuits & PCB Fab',
      website: 'https://shakticircuits.in',
      email: 'procurement@shakticircuits.in',
      description: 'Pioneering domestic fabrication of up to 16-layer High-Density Interconnect (HDI) bare printed circuit boards, Class 3 IPC mil-spec standards.',
      sector: 'Electronics & Semiconductor Manufacturing',
      subsector: 'Bare Multilayer PCB Fabrication',
      products: [
        '16-Layer Rigid-Flex Bare PCBs',
        'High-Frequency PTFE Laminate Boards',
        'High-Tg FR-4 Automotive Substrates',
        'Impedance-Controlled Backplanes'
      ],
      regions: ['Gujarat (Sanand)', 'Maharashtra (Pune)', 'Andhra Pradesh (Sri City)', 'Telangana'],
      customer_segments: ['EMS Assemblers (Captive & Merchant)', 'Railways & Kavach Suppliers', 'Satellite & Defense Electronics Labs'],
      market_share: '9.8%',
      annual_revenue: '₹340 Cr',
      growth_rate: '19.6% YoY'
    },
    kpi: {
      developments: 14,
      activities: 6,
      signalsCount: 2,
      pipelineValue: '₹42.5 Cr',
      supplyRisks: 1,
      sourcesCount: 6,
      heroSummary: 'Tracking 16-layer Bare PCB fabrication, Kavach rail board localization (₹42.5 Cr), and copper laminate imports.'
    },
    products: [
      { id: 1, title: '16-Layer High-Tg HDI Bare PCBs', category: 'Multilayer Bare Boards', leadTime: '3 Weeks', status: 'Class 3 IPC' },
      { id: 2, title: 'Rigid-Flex Aerospace Bare Substrates', category: 'Specialized Substrates', leadTime: '5 Weeks', status: 'Mil-Spec Compliant' },
      { id: 3, title: 'Automotive Heavy Copper (3oz) PCBs', category: 'Automotive Substrates', leadTime: '4 Weeks', status: 'AEC-Q200 Tested' },
      { id: 4, title: 'PTFE High-Frequency RF Laminates', category: 'RF & Radar Boards', leadTime: '6 Weeks', status: 'ISRO Approved' }
    ],
    customerSegments: [
      { name: 'EMS Assemblers (Dixon, Syrma, Centum)', value: 50, color: '#8B5CF6' },
      { name: 'Defense & Kavach Rail Contractors', value: 30, color: '#3B82F6' },
      { name: 'Direct Industrial Merchant Export', value: 20, color: '#10B981' }
    ],
    competitors: [
      {
        id: 'comp_amber',
        name: 'Amber Enterprises (Ascent Circuits)',
        ticker: 'AMBER.NS',
        marketShare: '38.6%',
        shareDelta: '+2.4%',
        isPositive: true,
        price: '₹6,697.0',
        mcap: '₹22,600 Cr',
        capexScale: 85,
        marketShareNum: 38.6,
        bubbleSize: 340,
        color: '#8B5CF6',
        subsector: 'Captive Multilayer Bare PCB Fabrication',
        keyMove: 'Acquired 98.5% of Ascent Circuits to dominate domestic bare PCB market'
      },
      {
        id: 'comp_syrma',
        name: 'Syrma SGS Tech (Elemaster PCB)',
        ticker: 'SYRMA.NS',
        marketShare: '24.5%',
        shareDelta: '+0.8%',
        isPositive: true,
        price: '₹1,517.0',
        mcap: '₹8,820 Cr',
        capexScale: 65,
        marketShareNum: 24.5,
        bubbleSize: 250,
        color: '#F59E0B',
        subsector: 'High-Density Interconnect (HDI) Bare Boards',
        keyMove: 'In-house quick-turn PCB fabrication for rail and defense programs'
      },
      {
        id: 'comp_ats',
        name: 'AT&S India (Nanjangud)',
        ticker: 'GLOBAL',
        marketShare: '18.2%',
        shareDelta: '-0.5%',
        isPositive: false,
        price: 'Global Ticker',
        mcap: '₹14,200 Cr',
        capexScale: 60,
        marketShareNum: 18.2,
        bubbleSize: 210,
        color: '#6366F1',
        subsector: 'High-End Bare PCB & Substrates',
        keyMove: 'Focusing on medical and automotive export substrates from Karnataka'
      },
      {
        id: 'comp_shindengen',
        name: 'Shindengen Circuits',
        ticker: 'PRIVATE',
        marketShare: '11.4%',
        shareDelta: '+0.3%',
        isPositive: true,
        price: 'Private',
        mcap: '₹1,850 Cr',
        capexScale: 40,
        marketShareNum: 11.4,
        bubbleSize: 150,
        color: '#10B981',
        subsector: 'Standard FR-4 Multilayer PCBs',
        keyMove: 'Supplying consumer electronics and lighting board assemblies'
      }
    ],
    relevantSignalIds: [
      'sig_bare_pcb_mna_consolidation',
      'sig_defense_rail_kavach_localization'
    ]
  }
};
