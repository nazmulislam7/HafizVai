
export enum AppMode {
  PROFILE = 'PROFILE',
  POST = 'POST'
}

export interface FrameTemplate {
  id: string;
  name: string;
  url: string;
  mode: AppMode;
  aspectRatio: number;
}

export interface ImageState {
  src: string | null;
  zoom: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}
