
import { AppMode, FrameTemplate } from './types';

export const FRAMES: FrameTemplate[] = [
  {
    id: 'campaign-frame-fixed',
    name: 'নির্বাচনী ফ্রেম',
    // GitHub Pages-এ হোস্ট করলে যাতে ফাইলটি সহজে পায় সেজন্য রিলেটিভ পাথ
    url: './11.png', 
    mode: AppMode.PROFILE,
    aspectRatio: 1
  }
];

export const DEMO_FRAMES_GRADIENTS = [
  'linear-gradient(135deg, #064e3b 0%, #065f46 100%)'
];
