
import React, { useState } from 'react';
import FrameEditor from './components/FrameEditor';
import { ImageState, FrameTemplate } from './types';
import { FRAMES } from './constants';
import { Image as ImageIcon, ShieldCheck, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [selectedFrame] = useState<FrameTemplate>(FRAMES[0]);
  
  const [imageState, setImageState] = useState<ImageState>({
    src: null,
    zoom: 100,
    rotation: 0,
    offsetX: 0,
    offsetY: 0
  });

  const handleDownload = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `frame-output-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageState({ 
          src: result,
          zoom: 100,
          offsetX: 0,
          offsetY: 0,
          rotation: 0
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-8 md:pt-16 bg-[#f8fafc]">
      <div className="max-w-xl mx-auto">
        {/* ব্র্যান্ডিং সেকশন */}
        <div className="text-center mb-10 space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-full shadow-sm text-emerald-800 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck size={16} />
              নির্বাচনী ফ্রেম স্টুডিও
           </div>
           <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Campaign Editor</h1>
              <p className="text-slate-500 font-medium text-sm">নিচের বাটনে ক্লিক করে আপনার ছবি যুক্ত করুন</p>
           </div>
        </div>

        {/* ছবি আপলোড এরিয়া */}
        {!imageState.src && (
          <label className="flex flex-col items-center justify-center p-16 bg-white border-4 border-dashed border-emerald-100 rounded-[3rem] cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-all group shadow-2xl mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-50/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-6 bg-emerald-50 rounded-3xl text-emerald-600 group-hover:scale-110 transition-transform mb-4 relative z-10 shadow-inner">
              <ImageIcon size={48} />
            </div>
            <span className="font-black text-2xl text-slate-800 relative z-10">এখানে ছবি আপলোড করুন</span>
            <p className="text-slate-400 text-sm mt-2 relative z-10">আপনার ছবি ফ্রেমের পেছনে সুন্দরভাবে সেট হবে</p>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        )}

        {/* মেইন এডিটর উইজেট */}
        <div className="relative">
          <FrameEditor 
            selectedFrame={selectedFrame} 
            imageState={imageState}
            setImageState={setImageState}
            onDownload={handleDownload}
          />
        </div>

        {/* ইনফরমেশন কার্ড */}
        <div className="mt-12 p-10 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-600"></div>
          <div className="space-y-3">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <UserCircle size={32} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">এ আর হাফিজ উল্যাহ</h2>
            <p className="text-emerald-700 font-black text-lg">সংসদ সদস্য পদপ্রার্থী</p>
            <div className="flex items-center justify-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
              <span>লক্ষ্মীপুর-৪</span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              <span>রামগতি-কমলনগর</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-50">
             <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              এই সিস্টেমটি আপনার ডিভাইসে ছবি প্রসেস করে। <br/>
              আপনার গোপনীয়তা আমাদের কাছে অগ্রাধিকার পায়।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
