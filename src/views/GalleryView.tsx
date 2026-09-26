import React, { useState } from 'react';
import { useCollege } from '../context/CollegeContext';
import { GalleryPhoto } from '../types';
import { Image as ImageIcon, Eye, X, UploadCloud } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const { gallery, currentUser, setActivePage } = useCollege();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const baseCategories = ['All', 'Campus', 'Chapel', 'Graduation', 'Library', 'Mission', 'Classrooms', 'Outreach'];
  const dynamicCategories = Array.from(
    new Set([...baseCategories, ...gallery.map(p => p.category).filter(Boolean)])
  );

  const filteredPhotos =
    selectedCategory === 'All'
      ? gallery
      : gallery.filter(
          p =>
            p.category === selectedCategory ||
            (selectedCategory === 'Classrooms' && p.category === ('Classroom' as any))
        );

  const isAdmin =
    currentUser && (currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'faculty');

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-14 border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Campus Moments & Memories
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold tracking-tight">
            Photo Gallery
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Witnessing the hand of God through student fellowship, chapel worship, and gospel outreach in Vellore.
          </p>
          {isAdmin && (
            <div className="pt-2">
              <button
                onClick={() => setActivePage('admin')}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Photos in Admin Panel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-stone-200 pb-4">
          {dynamicCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-amber-300 shadow-md'
                  : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredPhotos.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 sm:p-16 text-center max-w-xl mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-cinzel text-xl font-bold text-slate-900">
                {gallery.length === 0 ? 'No Gallery Photos Uploaded Yet' : `No Photos in "${selectedCategory}"`}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                {gallery.length === 0
                  ? 'Photos uploaded from the Admin Panel (Gallery section) will automatically appear here on the website gallery page.'
                  : 'Try selecting "All" categories above or upload new photos in the Admin Panel.'}
              </p>
            </div>
            {isAdmin && (
              <div className="pt-2">
                <button
                  onClick={() => setActivePage('admin')}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Go to Admin Panel to Upload Pictures</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPhotos.map(item => (
              <div
                key={item.id}
                onClick={() => setActivePhoto(item)}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-900 aspect-4/3"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                {/* Tag */}
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 text-amber-300 backdrop-blur-sm">
                  {item.category}
                </span>

                {/* Caption */}
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                  <h4 className="font-cinzel text-sm font-bold leading-snug group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-300 line-clamp-1">
                    {item.caption}
                  </p>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute -top-12 right-0 text-white hover:text-amber-400 p-2 text-sm flex items-center"
            >
              <X className="w-6 h-6 mr-1" />
              <span>Close</span>
            </button>

            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-h-[75vh]">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="w-full h-full object-contain max-h-[75vh]"
              />
            </div>

            <div className="text-center mt-4 text-white space-y-1">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                {activePhoto.category}
              </span>
              <h3 className="font-cinzel text-xl font-bold">{activePhoto.title}</h3>
              <p className="text-xs text-stone-300 max-w-lg mx-auto">{activePhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
