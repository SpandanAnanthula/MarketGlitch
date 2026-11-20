import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Building2,
  Globe2
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (workspaceId: string, userEmail: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('contact@bharat-ems.in');
  const [password, setPassword] = useState('marketpulse2026');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('ws_electronics_default');

  const demoAccounts = [
    {
      id: 'ws_electronics_default',
      name: 'Bharat EMS Solutions Pvt Ltd',
      tier: 'Enterprise SME Tier',
      subsector: 'Integrated EMS & SMT',
      email: 'contact@bharat-ems.in'
    },
    {
      id: 'ws_auto_inverters',
      name: 'NexGen EV Inverters & Power Modules',
      tier: 'Professional SME Tier',
      subsector: 'Automotive Power Electronics',
      email: 'strategy@nexgen-inverters.in'
    },
    {
      id: 'ws_bare_pcb_tech',
      name: 'Shakti Multilayer Circuits & PCB Fab',
      tier: 'Growth Tier',
      subsector: 'Bare Multilayer PCB Fabrication',
      email: 'procurement@shakticircuits.in'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedWorkspace, email);
  };

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setSelectedWorkspace(acc.id);
    setEmail(acc.email);
    onLogin(acc.id, acc.email);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-[#F6F8FD] relative overflow-hidden">
      {/* Ambient background decorative orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-purple-200/40 to-blue-200/20 blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] rounded-full bg-indigo-100/30 blur-2xl pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: Visual Brand & Live Intelligence Showcase (Replicating Image 13) */}
        <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-6">
          {/* Logo Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                MarketMind <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100/80 text-indigo-700 font-semibold tracking-wide">India</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">AI-Powered Market Intelligence</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Turn Market Intelligence into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Strategic Advantage</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Explore. Analyse. Decide better.
            </p>
          </div>

          {/* Floating Glass Preview Cards (Replicating Image 13's 3D Globe & Floating Dashboards) */}
          <div className="relative pt-4 pb-2">
            <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(99,102,241,0.08)] space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Live Verified Indian Electronics Intelligence (Nov 2026)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">
                  5 Signals Active
                </span>
              </div>

              {/* 3 Mini Live Market Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white/90 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-800">Dixon Tech</div>
                  <div className="text-xs font-semibold text-indigo-600">₹13,054.0</div>
                  <div className="text-[10px] text-slate-500 mt-1">₹1,000 Cr SMT Capex</div>
                </div>
                <div className="p-3 bg-white/90 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-800">Kaynes Tech</div>
                  <div className="text-xs font-semibold text-indigo-600">₹2,890.0</div>
                  <div className="text-[10px] text-slate-500 mt-1">Vishay OSAT JV</div>
                </div>
                <div className="p-3 bg-white/90 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-800">Tata Semi</div>
                  <div className="text-xs font-semibold text-purple-600">$5B–$6B</div>
                  <div className="text-[10px] text-slate-500 mt-1">Dholera Fab Tooling</div>
                </div>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-indigo-50/80 text-indigo-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  Zero Hallucinated Citations (§12)
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-purple-50/80 text-purple-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Multi-Tenant Workspace Scoped
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-emerald-50/80 text-emerald-700">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                  ₹99.9 Cr Public Tenders Tracked
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sign In Form (Replicating Image 13) */}
        <div className="lg:col-span-5">
          <div className="bg-white/95 backdrop-blur-2xl p-8 sm:p-10 rounded-[32px] border border-white/90 shadow-[0_20px_50px_rgba(99,102,241,0.1)] space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Sign in to your market intelligence workspace
              </p>
            </div>

            {/* Quick 1-Click Demo Profiles Pill Selector */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                <span>Select Tenant Workspace</span>
                <span className="text-[11px] text-indigo-600 font-semibold lowercase">3 active tenants</span>
              </label>
              <div className="space-y-2">
                {demoAccounts.map(acc => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectDemo(acc)}
                    className={`w-full p-3 rounded-2xl text-left transition-all border flex items-center justify-between ${
                      selectedWorkspace === acc.id
                        ? 'bg-indigo-50/80 border-indigo-300 shadow-sm'
                        : 'bg-slate-50/60 hover:bg-slate-100/60 border-slate-200/60 text-slate-700'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                        {acc.name}
                      </div>
                      <div className="text-[11px] text-slate-500">{acc.subsector}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-indigo-700 border border-indigo-200 shrink-0">
                      {acc.tier.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@company.in"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/60 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50/60 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="ml-2 text-xs text-slate-600 font-medium">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#0F172A] hover:bg-[#1E1B4B] text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Sign in to Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="pt-2 text-center">
              <span className="text-xs text-slate-500">
                Evaluating India-First Market Intelligence?{' '}
                <button
                  type="button"
                  onClick={() => onLogin('ws_electronics_default', 'demo@marketmind.in')}
                  className="font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Instant Guest Access
                </button>
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
