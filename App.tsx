
import React, { useState } from 'react';
import FrameEditor from './components/FrameEditor';
import { AppMode, ImageState, FrameTemplate } from './types';
import { FRAMES } from './constants';
import { Image as ImageIcon, CheckCircle, ShieldCheck } from 'lucide-react';

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
    link.download = `election-frame-${Date.now()}.png`;
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
    <div className="min-h-screen pb-20 px-4 pt-8 md:pt-12 bg-[#f0f9f4]">
      <div className="max-w-xl mx-auto">
        {/* টপ সেকশন */}
        <div className="text-center mb-8 space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-emerald-100 rounded-full shadow-sm text-emerald-700 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck size={16} />
              Official Campaign Tool
           </div>
           <div className="space-y-1">
              <h1 className="text-3xl font-black text-[#065f46]">Election Frame Studio</h1>
              <p className="text-gray-500 font-medium text-sm italic">এ আর হাফিজ উল্যাহ - এর সমর্থনে ফ্রেম তৈরি করুন</p>
           </div>
        </div>

        {/* প্রধান আপলোড বাটন (ছবি না থাকলে) */}
        {!imageState.src && (
          <label className="flex flex-col items-center justify-center p-12 bg-white border-4 border-dashed border-emerald-200 rounded-[2.5rem] cursor-pointer hover:bg-emerald-50 hover:border-emerald-400 transition-all group shadow-xl mb-8">
            <div className="p-6 bg-emerald-100 rounded-3xl text-emerald-600 group-hover:scale-110 transition-transform mb-4">
              <ImageIcon size={48} />
            </div>
            <span className="font-black text-2xl text-[#065f46]">আপনার ছবি আপলোড করুন</span>
            <p className="text-gray-400 text-sm mt-2">ছবিটি অটোমেটিক ফ্রেমের নিচে বসে যাবে</p>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        )}

        {/* এডিটর */}
        <FrameEditor 
          selectedFrame={selectedFrame} 
          imageState={imageState}
          setImageState={setImageState}
          onDownload={handleDownload}
        />

        {/* ফুটার কার্ড */}
        <div className="mt-12 p-8 bg-white rounded-[2rem] shadow-xl border border-emerald-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#065f46]"></div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-800">এ আর হাফিজ উল্যাহ</h2>
            <p className="text-[#065f46] font-bold text-lg">সংসদ সদস্য পদপ্রার্থী</p>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <span>লক্ষ্মীপুর-৪</span>
              <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></span>
              <span>রামগতি-কমলনগর</span>
            </div>
          </div>
          <p className="mt-6 text-[10px] text-gray-400 font-medium">
            © ২০২৪ ফ্রেম স্টুডিও। আপনার ছবি সুরক্ষিত এবং শুধুমাত্র ফ্রেম তৈরির কাজে ব্যবহৃত হবে।
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
