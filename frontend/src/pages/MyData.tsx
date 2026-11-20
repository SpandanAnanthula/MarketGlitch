import React, { useState, useRef } from 'react';
import { 
  FolderLock, 
  Plus, 
  Download, 
  MoreVertical, 
  FileText, 
  Table, 
  FileSpreadsheet, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  X, 
  Eye, 
  ShieldCheck 
} from 'lucide-react';

interface DataFileItem {
  id: number;
  name: string;
  type: string;
  typeBadge: string;
  uploaded: string;
  size: string;
  recordsCount?: number;
}

export const MyData: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'datasets' | 'exports'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = useState<number | null>(null);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<DataFileItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload Form State
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileType, setUploadFileType] = useState('Dataset');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initial Files table (Replicating Image 3)
  const [files, setFiles] = useState<DataFileItem[]>([
    {
      id: 1,
      name: 'Market_Insights_Q4.csv',
      type: 'Dataset',
      typeBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
      uploaded: 'Nov 12, 2026',
      size: '2.4 MB',
      recordsCount: 4820
    },
    {
      id: 2,
      name: 'Competitor_List.xlsx',
      type: 'Spreadsheet',
      typeBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      uploaded: 'Nov 10, 2026',
      size: '1.8 MB',
      recordsCount: 142
    },
    {
      id: 3,
      name: 'Industry_Report.pdf',
      type: 'Report',
      typeBadge: 'bg-rose-50 text-rose-700 border-rose-200/60',
      uploaded: 'Nov 8, 2026',
      size: '4.1 MB',
      recordsCount: 38
    },
    {
      id: 4,
      name: 'BEL_Kavach_Specs.pdf',
      type: 'Tender Spec',
      typeBadge: 'bg-purple-50 text-purple-700 border-purple-200/60',
      uploaded: 'Nov 17, 2026',
      size: '1.9 MB',
      recordsCount: 16
    },
    {
      id: 5,
      name: 'Dixon_Capex_Filings.pdf',
      type: 'Disclosure',
      typeBadge: 'bg-amber-50 text-amber-700 border-amber-200/60',
      uploaded: 'Nov 19, 2026',
      size: '3.2 MB',
      recordsCount: 24
    }
  ]);

  const filteredFiles = files.filter(f => {
    if (activeTab === 'datasets') return f.type === 'Dataset' || f.type === 'Spreadsheet';
    if (activeTab === 'exports') return f.type === 'Report' || f.type === 'Disclosure' || f.type === 'Tender Spec';
    return true;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadFile = (file: DataFileItem) => {
    let content = '';
    let mimeType = 'text/plain';

    if (file.name.endsWith('.csv')) {
      mimeType = 'text/csv;charset=utf-8;';
      content = `Entity,Subsector,HS_Code,Market_Share_Pct,Capex_Cr_INR,Fiscal_Year\nDixon Technologies,High-Speed SMT,85423100,22.4,1000,2026\nKaynes Technology,OSAT Packaging,85423900,20.4,280,2026\nSyrma SGS Tech,High-Reliability EMS,85429000,17.8,150,2026\nAmber Enterprises,HVAC & Power Electronics,84159000,13.5,450,2026\n`;
    } else {
      mimeType = 'application/json';
      content = JSON.stringify({
        asset_name: file.name,
        type: file.type,
        uploaded_at: file.uploaded,
        file_size: file.size,
        records_indexed: file.recordsCount || 100,
        stage_3_lake_status: "NORMALIZED_AND_GROUNDED",
        audit_provenance: "SHA256:d8a9f4c39b1e2a87d40237e810a012"
      }, null, 2);
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setActiveActionMenuId(null);
    showToast(`Downloaded ${file.name}`);
  };

  const handleDeleteFile = (id: number, name: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setActiveActionMenuId(null);
    showToast(`Deleted ${name} from tenant data lake.`);
  };

  const handleUploadSubmit = () => {
    const fileName = uploadFileName.trim() || `User_Upload_${Date.now()}.${uploadFileType === 'Dataset' ? 'csv' : 'pdf'}`;
    
    let badge = 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
    if (uploadFileType === 'Spreadsheet') badge = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    if (uploadFileType === 'Report') badge = 'bg-rose-50 text-rose-700 border-rose-200/60';

    const newFile: DataFileItem = {
      id: Date.now(),
      name: fileName,
      type: uploadFileType,
      typeBadge: badge,
      uploaded: 'Nov 20, 2026',
      size: `${(Math.random() * 2 + 1.2).toFixed(1)} MB`,
      recordsCount: Math.floor(Math.random() * 500) + 50
    };

    setFiles(prev => [newFile, ...prev]);
    setIsUploadModalOpen(false);
    setUploadFileName('');
    showToast(`"${fileName}" uploaded & indexed in Stage 3 data lake!`);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* TOP HEADER (Replicating Image 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Data
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage your proprietary data assets, extracted datasets, and executive exports
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-[#0F172A] hover:bg-[#1E1B4B] text-white font-semibold text-xs tracking-wide shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Data +</span>
        </button>
      </div>

      {/* TABS (Replicating Image 3: All Files, Datasets, Exports) */}
      <div className="flex items-center gap-6 border-b border-slate-200/80 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'all'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          All Files ({files.length})
        </button>
        <button
          onClick={() => setActiveTab('datasets')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'datasets'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Datasets ({files.filter(f => f.type === 'Dataset' || f.type === 'Spreadsheet').length})
        </button>
        <button
          onClick={() => setActiveTab('exports')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'exports'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Exports & Reports ({files.filter(f => f.type === 'Report' || f.type === 'Disclosure' || f.type === 'Tender Spec').length})
        </button>
      </div>

      {/* ASSETS TABLE (Replicating Image 3) */}
      <div className="p-6 rounded-3xl bg-white/90 border border-slate-100 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Uploaded</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                      📄
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{file.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{file.recordsCount || 50} records indexed</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${file.typeBadge}`}>
                      {file.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-medium">{file.uploaded}</td>
                  <td className="py-4 px-4 text-slate-500 font-medium">{file.size}</td>
                  <td className="py-4 px-4 text-right relative">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleDownloadFile(file)}
                        title="Download Asset"
                        className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => setActiveActionMenuId(activeActionMenuId === file.id ? null : file.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Action Dropdown Menu */}
                    {activeActionMenuId === file.id && (
                      <div className="absolute right-4 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 animate-fadeIn text-left">
                        <button
                          onClick={() => handleDownloadFile(file)}
                          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-semibold"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          <span>Download File</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFileForPreview(file);
                            setActiveActionMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Inspect Metadata</span>
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id, file.name)}
                          className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold border-t border-slate-50 mt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Delete Asset</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* METADATA INSPECTOR MODAL */}
      {selectedFileForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Asset Governance Dossier</h3>
              </div>
              <button onClick={() => setSelectedFileForPreview(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">File Name:</span>
                <span className="font-bold text-slate-800">{selectedFileForPreview.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Asset Type:</span>
                <span className="font-bold text-slate-800">{selectedFileForPreview.type}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Indexed Size:</span>
                <span className="font-bold text-slate-800">{selectedFileForPreview.size}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Ingestion Timestamp:</span>
                <span className="font-bold text-slate-800">{selectedFileForPreview.uploaded}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Stage 3 Normalization:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete (Grounded)
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>Cryptographic provenance hash verified. Available across tenant pipeline stages.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button 
                onClick={() => handleDownloadFile(selectedFileForPreview)}
                className="px-4 py-2 rounded-full bg-[#0F172A] text-white text-xs font-bold hover:bg-[#1E1B4B]"
              >
                Download File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Upload Enterprise Data</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {/* Drag & Drop Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-3xl text-center space-y-3 bg-slate-50/60 cursor-pointer transition-colors"
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadFileName(e.target.files[0].name);
                  }
                }}
              />
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800">
                  {uploadFileName ? `Selected: ${uploadFileName}` : "Click or drag & drop your file here"}
                </div>
                <div className="text-[11px] text-slate-400">Supports CSV, XLSX, PDF up to 25MB</div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Asset Display Name</label>
                <input 
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="e.g. FY27_BOM_Estimates.csv"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Asset Category</label>
                <select
                  value={uploadFileType}
                  onChange={(e) => setUploadFileType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="Dataset">Dataset (CSV / JSON)</option>
                  <option value="Spreadsheet">Spreadsheet (XLSX / Sheet)</option>
                  <option value="Report">Report / Whitepaper (PDF)</option>
                  <option value="Tender Spec">Tender Specifications (PDF)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button 
                onClick={handleUploadSubmit}
                className="px-5 py-2 rounded-full bg-[#0F172A] hover:bg-[#1E1B4B] text-white text-xs font-bold transition-all shadow-md"
              >
                Upload & Ingest Asset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
