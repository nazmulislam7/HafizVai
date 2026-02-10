
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, RefreshCcw, ZoomIn, Download, Move, Camera } from 'lucide-react';
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

    // ক্লিনিং এবং হোয়াইট ব্যাকগ্রাউন্ড
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // ১. নিচের লেয়ার: ইউজার ফটো
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

    // ২. উপরের লেয়ার: ফিক্সড ফ্রেম (11.png)
    if (frameImageRef.current && frameImageRef.current.complete) {
      ctx.drawImage(frameImageRef.current, 0, 0, width, height);
    }
  }, [imageState, selectedFrame]);

  // ফ্রেম লোড (11.png)
  useEffect(() => {
    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.src = selectedFrame.url;
    frameImg.onload = () => {
      frameImageRef.current = frameImg;
      draw();
    };
    frameImg.onerror = () => {
      console.warn("Frame (11.png) load failed. Please ensure the file is in the project root.");
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
    <div className="flex flex-col gap-8 animate-in zoom-in-95 duration-500">
      {/* ক্যানভাস কার্ড */}
      <div 
        ref={containerRef}
        className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden cursor-move touch-none border-[12px] border-white ring-1 ring-slate-100 group"
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
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/50 backdrop-blur-xl rounded-full text-white opacity-0 group-hover:opacity-100 transition-all flex items-center gap-3 text-xs font-bold uppercase tracking-widest pointer-events-none translate-y-4 group-hover:translate-y-0">
          <Move size={16} /> ছবিটি সরিয়ে জায়গা মতো বসান
        </div>
      </div>

      {/* এডিটিং প্যানেল */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-50 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
           <h3 className="font-black text-slate-800 flex items-center gap-3 text-lg">
              <Camera size={22} className="text-emerald-600" /> ফটো কন্ট্রোল
           </h3>
           <label className="text-xs font-black uppercase text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full cursor-pointer hover:bg-emerald-100 transition-all border border-emerald-100 flex items-center gap-2">
              ছবি বদলান
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                       setImageState(prev => ({ ...prev, src: event.target?.result as string, zoom: 100, offsetX: 0, offsetY: 0, rotation: 0 }));
                    };
                    reader.readAsDataURL(file);
                 }
              }} />
           </label>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-black text-slate-500 text-sm">
              <span>জুম (Zoom)</span>
              <span className="text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-100">{Math.round(imageState.zoom)}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="500" 
              value={imageState.zoom} 
              onChange={(e) => setImageState(prev => ({ ...prev, zoom: Number(e.target.value) }))}
              className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setImageState(prev => ({ ...prev, rotation: prev.rotation - 90 }))}
              className="flex items-center justify-center gap-3 py-5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-[1.5rem] font-black transition-all border border-emerald-100 active:scale-95 shadow-sm"
            >
              <RotateCcw size={20} /> ঘোরান
            </button>
            <button 
              onClick={() => setImageState(prev => ({ ...prev, zoom: 100, rotation: 0, offsetX: 0, offsetY: 0 }))}
              className="flex items-center justify-center gap-3 py-5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-[1.5rem] font-black transition-all border border-slate-100 active:scale-95 shadow-sm"
            >
              <RefreshCcw size={20} /> রিসেট
            </button>
          </div>
        </div>
      </div>

      {/* সেভ বাটন */}
      <button 
        onClick={() => canvasRef.current && onDownload(canvasRef.current)}
        className="group w-full py-7 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-2xl rounded-[2.5rem] shadow-2xl shadow-emerald-200 flex items-center justify-center gap-4 transition-all active:scale-95 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        <Download size={32} />
        ছবিটি সেভ করুন
      </button>
    </div>
  );
};

export default FrameEditor;
