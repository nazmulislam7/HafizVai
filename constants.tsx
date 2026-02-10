
import { AppMode, FrameTemplate } from './types';

export const FRAMES: FrameTemplate[] = [
  {
    id: 'campaign-frame-fixed',
    name: 'নির্বাচনী ফ্রেম',
    // আপনার ফোল্ডারে থাকা '11.png' ফাইলটির পাথ এখানে দেওয়া হলো
    url: './11.png', 
    mode: AppMode.PROFILE,
    aspectRatio: 1
  }
];

export const DEMO_FRAMES_GRADIENTS = [
  'linear-gradient(135deg, #064e3b 0%, #065f46 100%)'
];
