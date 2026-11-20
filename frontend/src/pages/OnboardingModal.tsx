import React, { useState } from 'react';
import { X, Sparkles, Building2, Check, ArrowRight, Shield } from 'lucide-react';
import { CompanyProfile } from '../types';
import { api } from '../services/api';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (profile: CompanyProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onSaved }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState('AuraChip Electronics Pvt Ltd');
  const [website, setWebsite] = useState('https://aurachip-tech.in');
  const [description, setDescription] = useState(
    'Indian manufacturer of high-density interconnect PCB assemblies and embedded sensor modules for automotive Tier-1s and industrial automation.'
  );
  const [sector, setSector] = useState('Electronics & Semiconductor Manufacturing');

  // Extracted Profile State
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleExtract = async () => {
    setLoading(true);
    try {
      const res = await api.extractProfile({
        company_name: companyName,
        website,
        description,
        sector
      });
      setExtractedData(res);
      setStep(2);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSave = async () => {
    const profileToSave: CompanyProfile = {
      company_name: extractedData?.company_name || companyName,
      website: extractedData?.website || website,
      description: extractedData?.description || description,
      sector: extractedData?.sector || sector,
      subsector: extractedData?.subsector || 'Electronics Manufacturing Services (EMS)',
      products: extractedData?.suggested_products || ['Industrial SMT PCB Assembly', 'Automotive Sensor Modules'],
      regions: extractedData?.suggested_regions || ['Tamil Nadu', 'Karnataka', 'NCR'],
      customer_segments: extractedData?.suggested_customer_segments || ['Automotive Tier-1', 'Industrial OEMs']
    };

    await api.saveProfile(profileToSave);
    onSaved(profileToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Company Context Onboarding</h2>
              <p className="text-xs text-slate-400">Step {step} of 2 • Tailored Intelligence Profile</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Legal / Trading Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                  placeholder="e.g. AuraChip Electronics Pvt Ltd"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Website (Optional)</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Sector</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="Electronics & Semiconductor Manufacturing">Electronics & Semiconductor</option>
                    <option value="Pharmaceuticals & Healthcare">Pharmaceuticals & Healthcare</option>
                    <option value="Renewable Energy">Renewable Energy</option>
                    <option value="Automotive & EV">Automotive & EV</option>
                    <option value="Infrastructure & Construction">Infrastructure & Construction</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Business & Capabilities Summary</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                  placeholder="What does your company manufacture or supply? Who are your customers?"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-2.5">
                <Shield className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your profile is strictly tenant-isolated under your workspace. AI uses this data only to discover relevant competitors and match government tenders.
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300">AI Profile Extracted</span>
                </div>
                <span className="text-[11px] text-slate-400">Confidence: 96%</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Classified Subsector:</span>
                  <div className="mt-1 font-semibold text-slate-200 bg-slate-800/60 p-2 rounded-lg border border-slate-800">
                    {extractedData?.subsector}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Mapped Product Lines:</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {extractedData?.suggested_products.map((p: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-medium text-[11px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Target Customer Segments:</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {extractedData?.suggested_customer_segments.map((seg: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium text-[11px]">
                        {seg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/40 flex justify-between items-center">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="text-xs text-slate-400 hover:text-white transition font-medium"
            >
              Back to edit
            </button>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            {step === 1 ? (
              <button
                onClick={handleExtract}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md shadow-emerald-500/20"
              >
                {loading ? 'Analyzing...' : 'Extract & Mapp Profile'}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleConfirmSave}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md shadow-emerald-500/20"
              >
                Confirm & Discover Competitors
                <Check className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
