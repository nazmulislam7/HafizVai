
import React from 'react';
import { User, Image as ImageIcon } from 'lucide-react';
import { AppMode } from '../types';

interface HeaderProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ currentMode, setMode }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <button
        onClick={() => setMode(AppMode.PROFILE)}
        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
          currentMode === AppMode.PROFILE
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
            : 'border-white bg-white text-gray-400 shadow-sm'
        }`}
      >
        <div className={`p-3 rounded-full ${currentMode === AppMode.PROFILE ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
          <User size={24} />
        </div>
        <div className="text-center">
          <p className="font-bold text-lg">প্রোফাইল ফ্রেম</p>
          <p className="text-xs opacity-70">ফেসবুক প্রোফাইল পিকচারের জন্য</p>
          <p className="text-[10px] mt-1">1080 × 1080</p>
        </div>
        {currentMode === AppMode.PROFILE && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></div>
        )}
      </button>

      <button
        onClick={() => setMode(AppMode.POST)}
        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
          currentMode === AppMode.POST
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
            : 'border-white bg-white text-gray-400 shadow-sm'
        }`}
      >
        <div className={`p-3 rounded-full ${currentMode === AppMode.POST ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
          <ImageIcon size={24} />
        </div>
        <div className="text-center">
          <p className="font-bold text-lg">পোস্ট ফ্রেম</p>
          <p className="text-xs opacity-70">ফেসবুক পোস্টের জন্য</p>
          <p className="text-[10px] mt-1">1580 × 1875</p>
        </div>
        {currentMode === AppMode.POST && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></div>
        )}
      </button>
    </div>
  );
};

export default Header;
