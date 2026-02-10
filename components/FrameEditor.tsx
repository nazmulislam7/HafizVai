
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, RefreshCcw, ZoomIn, Download, Move, Upload } from 'lucide-react';
import { ImageState, FrameTemplate } from '../types';

interface FrameEditorProps {
  selectedFrame: FrameTemplate;
  imageState: ImageState;
  setImageState: React.Dispatch<React.SetStateAction<ImageState>>;
  onDownload: (canvas: HTMLCanvasElement) => void;
}

const FrameEditor: React.FC<FrameEditorProps> = ({ selectedFrame, imageState, setImageState, onDownload }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const userImageRef = useRef<HTMLImageElement | null>(null);
  const frameImageRef = useRef<HTMLImageElement | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // ১. লেয়ার ১: ব্যবহারকারীর ছবি (সবার নিচে)
    if (imageState.src && userImageRef.current && userImageRef.current.complete) {
      ctx.save();
      ctx.translate(width / 2 + imageState.offsetX, height / 2 + imageState.offsetY);
      ctx.rotate((imageState.rotation * Math.PI) / 180);
      
      const scale = imageState.zoom / 100;
      const drawWidth = userImageRef.current.width * scale;
      const drawHeight = userImageRef.current.height * scale;
      
      ctx.drawImage(userImageRef.current, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();
    }

    // ২. লেয়ার ২: ফিক্সড নির্বাচনী ফ্রেম (সবার উপরে)
    if (frameImageRef.current && frameImageRef.current.complete) {
      ctx.drawImage(frameImageRef.current, 0, 0, width, height);
    }
  }, [imageState, selectedFrame]);

  // ফিক্সড ফ্রেম লোড
  useEffect(() => {
    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.src = selectedFrame.url;
    frameImg.onload = () => {
      frameImageRef.current = frameImg;
      draw();
    };
  }, [selectedFrame, draw]);

  // ইউজার ফটো লোড
  useEffect(() => {
    if (imageState.src) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageState.src;
      img.onload = () => {
        userImageRef.current = img;
        draw();
      };
    } else {
      userImageRef.current = null;
      draw();
    }
  }, [imageState.src, draw]);

  useEffect(() => {
    draw();
  }, [draw, imageState.zoom, imageState.rotation, imageState.offsetX, imageState.offsetY]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!imageState.src) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX - imageState.offsetX, y: clientY - imageState.offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    setImageState(prev => ({
      ...prev,
      offsetX: clientX - dragStart.x,
      offsetY: clientY - dragStart.y
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  if (!imageState.src) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto animate-in fade-in duration-500">
      <div 
        ref={containerRef}
        className="relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden cursor-move touch-none border-[10px] border-white group ring-1 ring-emerald-50"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <canvas 
          ref={canvasRef}
          width={1080}
          height={1080}
          className="w-full h-full block"
        />
        
        <div className="absolute top-6 right-6 p-2 bg-black/30 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] font-bold uppercase pointer-events-none">
          <Move size={14} /> Hold to adjust photo
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-50 space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="font-black text-[#065f46] flex items-center gap-2">
              <ZoomIn size={18} /> ছবি এডিট করুন
           </h3>
           <label className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-emerald-100 transition-all border border-emerald-100 flex items-center gap-1.5">
              <Upload size={12} /> ছবি পরিবর্তন
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                       setImageState(prev => ({ ...prev, src: event.target?.result as string }));
                    };
                    reader.readAsDataURL(file);
                 }
              }} />
           </label>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-400">জুম নিয়ন্ত্রণ</span>
            <span className="text-sm font-black text-[#065f46]">{Math.round(imageState.zoom)}%</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="500" 
            value={imageState.zoom} 
            onChange={(e) => setImageState(prev => ({ ...prev, zoom: Number(e.target.value) }))}
            className="w-full h-2.5 bg-emerald-50 rounded-lg appearance-none cursor-pointer accent-[#065f46]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setImageState(prev => ({ ...prev, rotation: prev.rotation - 90 }))}
            className="flex items-center justify-center gap-2 py-3 bg-emerald-50 hover:bg-emerald-100 text-[#065f46] rounded-2xl font-black transition-all border border-emerald-100 shadow-sm"
          >
            <RotateCcw size={18} /> ঘোরান
          </button>
          <button 
            onClick={() => setImageState(prev => ({ ...prev, zoom: 100, rotation: 0, offsetX: 0, offsetY: 0 }))}
            className="flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl font-black transition-all border border-gray-100 shadow-sm"
          >
            <RefreshCcw size={18} /> রিসেট
          </button>
        </div>
      </div>

      <button 
        onClick={() => canvasRef.current && onDownload(canvasRef.current)}
        className="w-full py-6 bg-[#065f46] hover:bg-[#044d39] text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-emerald-200 flex items-center justify-center gap-3 transition-all active:scale-95"
      >
        <Download size={24} />
        ফাইনাল ইমেজ সেভ করুন
      </button>
    </div>
  );
};

export default FrameEditor;
