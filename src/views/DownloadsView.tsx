import React, { useState } from 'react';
import { useCollege } from '../context/CollegeContext';
import { DownloadDoc } from '../types';
import {
  Download,
  FileText,
  Search,
  CheckCircle2,
  Eye,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const DownloadsView: React.FC = () => {
  const { downloads, recordDownload, setActiveDocumentPreview } = useCollege();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Prospectus', 'Forms', 'Syllabus', 'Academic Calendar', 'Institutional'];

  const filteredDownloads = downloads.filter(d => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (doc: DownloadDoc) => {
    recordDownload(doc.id);
    const docText = `=====================================================
IMAGE OF CHRIST BIBLE COLLEGE, VELLORE
=====================================================
Title: ${doc.title}
Category: ${doc.category}
Format: ${doc.format}
File Size: ${doc.fileSize}
Last Updated: ${doc.updatedAt}
Institution: Image of Christ Bible College (ICBC), Vellore, Tamil Nadu

DESCRIPTION & SYLLABUS OVERVIEW:
-----------------------------------------------------
${doc.description}

Authorized by Image of Christ Bible College Academic Board.
Contact: vellorebiblecollege5@gmail.com | +91 94432 17890
=====================================================`;
    const blob = new Blob([docText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreview = (doc: DownloadDoc) => {
    setActiveDocumentPreview({
      title: doc.title,
      type: doc.format,
      content: doc.description
    });
  };

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-14 border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Document Repository & Publications
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold tracking-tight">
            Downloads & Official Forms
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Access official admission prospectuses, printable application forms, academic syllabi, and theological publications.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search downloads by keyword, prospectus, syllabus, or form name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-amber-300'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Downloads List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDownloads.map(doc => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-7 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group hover:border-amber-400"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                      {doc.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                      {doc.format} • {doc.fileSize}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500">Updated: {doc.updatedAt}</span>
                </div>

                <h3 className="font-cinzel text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                  {doc.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-medium">
                  Downloaded {doc.downloadCount} times
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePreview(doc)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-stone-100 transition-colors flex items-center"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1 text-stone-500" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleDownload(doc)}
                    className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
