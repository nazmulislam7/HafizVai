
import React, { useState } from 'react';
import Header from './components/Header';
import FrameEditor from './components/FrameEditor';
import FrameSelector from './components/FrameSelector';
import { AppMode, ImageState, FrameTemplate } from './types';
import { FRAMES } from './constants';
import { Layout, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.PROFILE);
  const [selectedFrame, setSelectedFrame] = useState<FrameTemplate>(FRAMES[0]);
  const [customFrameSrc, setCustomFrameSrc] = useState<string | null>(null);
  
  const [imageState, setImageState] = useState<ImageState>({
    src: null,
    zoom: 100,
    rotation: 0,
    offsetX: 0,
    offsetY: 0
  });

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    const firstFrameForMode = FRAMES.find(f => f.mode === newMode);
    if (firstFrameForMode) {
      setSelectedFrame(firstFrameForMode);
      setCustomFrameSrc(null);
    }
  };

  const handleDownload = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `frame-studio-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const handleCustomFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomFrameSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageState(prev => ({ 
          ...prev, 
          src: result,
          zoom: 100,
          offsetX: 0,
          offsetY: 0,
          rotation: 0
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-8 md:pt-12 bg-[#f0f9f4]">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#065f46] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">F</div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Frame Studio</h1>
           </div>
           <div className="px-3 py-1 bg-white border border-emerald-100 rounded-full text-xs font-semibold text-emerald-600 shadow-sm">Advanced Version</div>
        </div>

        {/* আপলোড অপশনসমূহ */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <label className="flex flex-col items-center justify-center p-5 bg-white border-2 border-dashed border-emerald-200 rounded-2xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-400 transition-all group shadow-sm">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform mb-2">
              <Layout size={28} />
            </div>
            <span className="font-bold text-[#065f46] text-sm text-center">ফ্রেম আপলোড করুন</span>
            <input type="file" accept="image/png" className="hidden" onChange={handleCustomFrameUpload} />
          </label>

          <label className="flex flex-col items-center justify-center p-5 bg-white border-2 border-dashed border-blue-100 rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all group shadow-sm">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-500 group-hover:scale-110 transition-transform mb-2">
              <ImageIcon size={28} />
            </div>
            <span className="font-bold text-blue-800 text-sm text-center">আপনার ছবি দিন</span>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        <Header currentMode={mode} setMode={handleModeChange} />
        
        <FrameEditor 
          selectedFrame={selectedFrame} 
          customFrameSrc={customFrameSrc}
          imageState={imageState}
          setImageState={setImageState}
          onDownload={handleDownload}
        />

        <div className="mt-10">
          <FrameSelector 
            currentMode={mode} 
            selectedFrameId={selectedFrame.id}
            onSelect={(frame) => {
              setSelectedFrame(frame);
              setCustomFrameSrc(null);
            }}
          />
        </div>

        <footer className="text-center mt-12 space-y-2 opacity-60">
           <p className="text-gray-500 text-[10px] tracking-widest uppercase">Professional Frame Editor</p>
           <p className="text-gray-400 text-[10px]">© ২০২৪ ফ্রেম স্টুডিও। সকল অধিকার সংরক্ষিত।</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
