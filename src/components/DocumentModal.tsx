import React from 'react';
import { useCollege } from '../context/CollegeContext';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { COLLEGE_INFO } from '../data/collegeData';
import officialLogo from '../assets/images/icbc_vellore_official_logo_1790438854633.jpg';

export const DocumentModal: React.FC = () => {
  const { activeDocumentPreview, setActiveDocumentPreview, collegeLogo } = useCollege();

  if (!activeDocumentPreview) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-amber-900/10">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                Official College Document
              </span>
              <h3 className="text-base font-semibold font-cinzel text-slate-100 line-clamp-1">
                {activeDocumentPreview.title}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setActiveDocumentPreview(null)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Content View */}
        <div className="p-6 md:p-8 overflow-y-auto bg-stone-50 font-serif text-slate-800 space-y-6">
          {/* Institutional Letterhead */}
          <div className="text-center pb-6 border-b border-stone-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500 bg-white mb-2 shadow-sm">
              <img
                src={collegeLogo || officialLogo}
                alt="Image of Christ Bible College Vellore Logo"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = officialLogo;
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-cinzel font-bold text-slate-900 tracking-wide uppercase">
              {COLLEGE_INFO.name}
            </h2>
            <p className="text-xs font-sans text-stone-600 mt-1">
              {COLLEGE_INFO.address}
            </p>
            <p className="text-xs font-sans text-amber-800 font-medium mt-0.5">
              Affiliated under high theological guidelines • Vellore, Tamil Nadu
            </p>
            <div className="w-24 h-0.5 bg-amber-600 mx-auto mt-3"></div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-sans text-stone-500 bg-stone-100 p-2.5 rounded-lg border border-stone-200">
              <span>Doc Ref: ICBC-DOC-{new Date().getFullYear()}-OFFICIAL</span>
              <span className="flex items-center text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4 mr-1" /> Verified Institutional Copy
              </span>
            </div>

            <h4 className="text-lg font-bold font-cinzel text-slate-900 text-center">
              {activeDocumentPreview.title}
            </h4>

            <div className="text-sm leading-relaxed text-stone-700 bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-3 font-sans">
              <p>
                This document serves as the authorized academic curriculum and administrative publication of <strong>Image of Christ Bible College (Vellore)</strong>.
              </p>
              <p>
                {activeDocumentPreview.content ||
                  'The materials, doctrinal positions, and academic guidelines contained herein are published for the theological training, spiritual formation, and pastoral equipment of candidates called to Christian ministry in India and across the world.'}
              </p>
              <div className="pt-4 border-t border-stone-100">
                <h5 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Key Verification Highlights:
                </h5>
                <ul className="text-xs space-y-1.5 text-stone-600">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mr-2 flex-shrink-0" />
                    Prepared by the Academic Council & Department of Theological Studies
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mr-2 flex-shrink-0" />
                    Rooted in sound biblical doctrine and practical ministry formation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mr-2 flex-shrink-0" />
                    Authorized for official admission, study preparation, and student reference
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs font-sans text-amber-900 flex items-start space-x-3">
              <div className="text-lg">📜</div>
              <p>
                <em>“Do your best to present yourself to God as one approved, a worker who does not need to be ashamed and who correctly handles the word of truth.”</em> — 2 Timothy 2:15
              </p>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="bg-white p-4 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center text-xs font-sans font-medium text-slate-600 hover:text-slate-900 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            Print Document
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const docText = `=====================================================
IMAGE OF CHRIST BIBLE COLLEGE, VELLORE
=====================================================
Title: ${activeDocumentPreview.title}
Format: ${activeDocumentPreview.type}
Institution: Image of Christ Bible College (ICBC)
Address: Calvary Hill Road, Katpadi, Vellore, Tamil Nadu - 632014
Contact: vellorebiblecollege5@gmail.com | +91 94432 17890

DOCUMENT SUMMARY & DETAILS:
-----------------------------------------------------
${activeDocumentPreview.content || 'Official institutional document.'}

-----------------------------------------------------
Scripture: “Do your best to present yourself to God as one approved, a worker who does not need to be ashamed and who correctly handles the word of truth.” — 2 Timothy 2:15
=====================================================`;
                const blob = new Blob([docText], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${activeDocumentPreview.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setActiveDocumentPreview(null);
              }}
              className="inline-flex items-center text-xs font-sans font-semibold bg-blue-900 hover:bg-blue-800 text-amber-300 py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
