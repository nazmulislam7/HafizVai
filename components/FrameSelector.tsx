
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FrameTemplate, AppMode } from '../types';
import { FRAMES } from '../constants';

interface FrameSelectorProps {
  currentMode: AppMode;
  selectedFrameId: string;
  onSelect: (frame: FrameTemplate) => void;
}

const FrameSelector: React.FC<FrameSelectorProps> = ({ currentMode, selectedFrameId, onSelect }) => {
  const filteredFrames = FRAMES.filter(f => f.mode === currentMode);

  return (
    <div className="mt-8 mb-10 w-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <p className="text-gray-500 text-sm font-medium">ফ্রেম নির্বাচন করুন</p>
        <div className="flex gap-2">
          <button className="p-1 rounded-full bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-emerald-500">
            <ChevronLeft size={20} />
          </button>
          <button className="p-1 rounded-full bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-emerald-500">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {filteredFrames.map((frame) => (
          <button
            key={frame.id}
            onClick={() => onSelect(frame)}
            className={`flex-shrink-0 relative w-24 h-24 rounded-xl overflow-hidden border-4 transition-all ${
              selectedFrameId === frame.id ? 'border-emerald-500 scale-105 shadow-md' : 'border-white opacity-80'
            }`}
          >
            <img 
              src={frame.url || `https://placehold.co/100x100/065f46/ffffff?text=${frame.name}`} 
              alt={frame.name} 
              className="w-full h-full object-cover"
            />
            {selectedFrameId === frame.id && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
            )}
          </button>
        ))}
        
        {/* Mock empty frame for more options */}
        <div className="flex-shrink-0 w-24 h-24 rounded-xl bg-gray-200 flex items-center justify-center border-4 border-white opacity-50">
          <span className="text-gray-400 text-xs">আরও আসবে</span>
        </div>
      </div>
    </div>
  );
};

export default FrameSelector;
