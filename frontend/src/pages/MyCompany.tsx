import React from 'react';
import { 
  Building2, 
  Edit3, 
  TrendingUp, 
  Cpu, 
  Layers, 
  Award, 
  ChevronRight, 
  Sparkles,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { CompanyProfile } from '../types';
import { TENANT_WORKSPACES } from '../data/tenantWorkspaces';

interface MyCompanyProps {
  profile: CompanyProfile | null;
  workspaceId?: string;
  onEditProfile: () => void;
}

export const MyCompany: React.FC<MyCompanyProps> = ({ 
  profile, 
  workspaceId = 'ws_electronics_default',
  onEditProfile 
}) => {
  const tenantCfg = TENANT_WORKSPACES[workspaceId] || TENANT_WORKSPACES['ws_electronics_default'];
  const companyName = profile?.company_name || tenantCfg.profile.company_name;
  const subsector = profile?.subsector || tenantCfg.profile.subsector;
  const description = profile?.description || tenantCfg.profile.description;
  const marketShare = profile?.market_share || tenantCfg.profile.market_share || "18.5%";
  const annualRevenue = profile?.annual_revenue || tenantCfg.profile.annual_revenue || "₹1,250 Cr";
  const growthRate = profile?.growth_rate || tenantCfg.profile.growth_rate || "12.3%";

  // Segments Donut Chart data (Image 10)
  const segmentsData = tenantCfg.customerSegments;

  // Products List (Image 10)
  const products = tenantCfg.products;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* TOP HEADER (Replicating Image 10) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Company
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Your company profile, manufacturing capabilities, and market positioning
          </p>
        </div>

        <button
          onClick={onEditProfile}
          className="px-5 py-2.5 rounded-full bg-[#0F172A] hover:bg-[#1E1B4B] text-white font-semibold text-xs tracking-wide shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* ROW 1: COMPANY PROFILE CARD (Left) & 3 KEY METRICS CARDS (Right) (Image 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Company Identity Card (4 Cols - Image 10) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-indigo-500/20">
              ⚡
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {companyName}
              </h2>
              <div className="text-xs font-semibold text-indigo-600">{subsector}</div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              "{description}"
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Class 1 Local Content Certified</span>
            <button
              onClick={onEditProfile}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Edit Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Key Metrics Row (7 Cols - Image 10: Market Share 18.5%, Revenue $2.1B, Growth 12.3%) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Metric 1: Market Share */}
          <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-2 flex flex-col justify-center">
            <div className="text-xs font-semibold text-slate-500">Market Share</div>
            <div className="text-3xl font-black text-slate-900">{marketShare}</div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+1.2%</span>
            </div>
          </div>

          {/* Metric 2: Annual Revenue */}
          <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-2 flex flex-col justify-center">
            <div className="text-xs font-semibold text-slate-500">Annual Revenue</div>
            <div className="text-3xl font-black text-slate-900">{annualRevenue}</div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8.5%</span>
            </div>
          </div>

          {/* Metric 3: Growth Rate */}
          <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-2 flex flex-col justify-center">
            <div className="text-xs font-semibold text-slate-500">Growth Rate</div>
            <div className="text-3xl font-black text-slate-900">{growthRate}</div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+0.7%</span>
            </div>
          </div>

        </div>

      </div>

      {/* ROW 2: PRODUCTS CAROUSEL (Left 7 Cols) & CUSTOMER SEGMENTS DONUT (Right 5 Cols) (Image 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Products Grid (7 Cols - Image 10) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Core Manufacturing Products</h3>
            <button 
              onClick={onEditProfile}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View all →</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {products.map(p => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2 flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-2">{p.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{p.category}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 w-fit">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Segments Donut Chart (5 Cols - Image 10) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Customer Segments</h3>
            <p className="text-xs text-slate-500">Revenue distribution by target client vertical</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Donut Chart */}
            <div className="w-36 h-36 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={55}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {segmentsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                    formatter={(val: any) => [`${val}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend List */}
            <div className="space-y-2.5 text-xs font-semibold flex-1">
              {segmentsData.map((seg, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></span>
                    <span className="text-slate-700">{seg.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{seg.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
