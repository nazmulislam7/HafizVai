
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, RefreshCcw, ZoomIn, Download, Move, Upload, ImageIcon, Layout } from 'lucide-react';
import { ImageState, FrameTemplate } from '../types';

interface FrameEditorProps {
  selectedFrame: FrameTemplate;
  customFrameSrc?: string | null;
  imageState: ImageState;
  setImageState: React.Dispatch<React.SetStateAction<ImageState>>;
  onDownload: (canvas: HTMLCanvasElement) => void;
}

const FrameEditor: React.FC<FrameEditorProps> = ({ selectedFrame, customFrameSrc, imageState, setImageState, onDownload }) => {
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

    // ১. ক্যানভাস ক্লিয়ার ও ব্যাকগ্রাউন্ড
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // ২. লেয়ার ১: ব্যবহারকারীর ছবি (সবার নিচে থাকবে)
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

    // ৩. লেয়ার ২: ফ্রেম ওভারলে (সবার উপরে থাকবে)
    if (frameImageRef.current && frameImageRef.current.complete) {
      ctx.drawImage(frameImageRef.current, 0, 0, width, height);
    }

    // ছবি না থাকলে নির্দেশিকা দেখানো
    if (!imageState.src && !customFrameSrc) {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.font = 'bold 36px Hind Siliguri';
      ctx.textAlign = 'center';
      ctx.fillText('ছবি এবং ফ্রেম যোগ করুন', width / 2, height / 2);
    }
  }, [imageState, customFrameSrc, selectedFrame]);

  // ফ্রেম ইমেজ লোড করা (ডিফল্ট বা কাস্টম)
  useEffect(() => {
    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.src = customFrameSrc || selectedFrame.url || `https://placehold.co/1080x1080/065f46/ffffff?text=FRAME`;
    frameImg.onload = () => {
      frameImageRef.current = frameImg;
      draw();
    };
  }, [selectedFrame, customFrameSrc, draw]);

  // ইউজার ফটো লোড করা
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

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      {/* ক্যানভাস ভিউপোর্ট */}
      <div 
        ref={containerRef}
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden cursor-move touch-none border-4 border-white group"
        style={{ aspectRatio: selectedFrame.aspectRatio }}
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
          height={selectedFrame.mode === 'PROFILE' ? 1080 : 1280}
          className="w-full h-full block"
        />
        
        {imageState.src && (
          <div className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs">
            <Move size={14} /> ছবি ড্র্যাগ করে সাজান
          </div>
        )}
      </div>

      {/* কন্ট্রোল প্যানেল */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-50 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-800 rounded-xl cursor-pointer hover:bg-emerald-100 transition-all font-bold text-sm">
            <Layout size={18} />
            ফ্রেম পাল্টান
            <input type="file" accept="image/png" className="hidden" onChange={(e) => {
               const file = e.target.files?.[0];
               if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                     // logic handled in App.tsx typically, but for standalone editor:
                     const result = event.target?.result as string;
                     const frameImg = new Image();
                     frameImg.src = result;
                     frameImg.onload = () => {
                        frameImageRef.current = frameImg;
                        draw();
                     };
                  };
                  reader.readAsDataURL(file);
               }
            }} />
          </label>
          <label className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-800 rounded-xl cursor-pointer hover:bg-blue-100 transition-all font-bold text-sm">
            <ImageIcon size={18} />
            নতুন ছবি দিন
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

        {imageState.src && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <ZoomIn size={18} className="text-emerald-600" />
                <span className="font-bold text-sm text-gray-600">জুম নিয়ন্ত্রণ</span>
              </div>
              <span className="text-sm font-bold text-[#065f46] bg-emerald-50 px-3 py-1 rounded-full">{Math.round(imageState.zoom)}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="500" 
              value={imageState.zoom} 
              onChange={(e) => setImageState(prev => ({ ...prev, zoom: Number(e.target.value) }))}
              className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-[#065f46]"
            />

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setImageState(prev => ({ ...prev, rotation: prev.rotation - 90 }))}
                className="flex items-center justify-center gap-2 py-3 bg-emerald-50 hover:bg-emerald-100 text-[#065f46] rounded-xl font-bold transition-all border border-emerald-100"
              >
                <RotateCcw size={18} /> ঘোরান
              </button>
              <button 
                onClick={() => setImageState(prev => ({ ...prev, zoom: 100, rotation: 0, offsetX: 0, offsetY: 0 }))}
                className="flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-bold transition-all border border-gray-200"
              >
                <RefreshCcw size={18} /> রিসেট
              </button>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={() => canvasRef.current && onDownload(canvasRef.current)}
        disabled={!imageState.src}
        className={`w-full py-5 text-white font-bold text-xl rounded-3xl shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
          imageState.src 
          ? 'bg-[#065f46] hover:bg-[#044d39] shadow-emerald-200' 
          : 'bg-gray-300 cursor-not-allowed opacity-50'
        }`}
      >
        <Download size={24} />
        ছবি ডাউনলোড করুন
      </button>
    </div>
  );
};

export default FrameEditor;
