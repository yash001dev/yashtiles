export interface FrameCustomization {
  material: 'classic' | 'frameless' | 'canvas';
  frameColor: 'black' | 'white' | 'oak';
  size: '8x8' | '8x11' | '11x8';
  effect: 'original' | 'silver' | 'noir' | 'vivid' | 'dramatic';
  border: boolean;
}

export interface MaterialOption {
  id: 'classic' | 'frameless' | 'canvas';
  name: string;
  image: string;
  description: string;
}

export interface FrameColorOption {
  id: 'black' | 'white' | 'oak';
  name: string;
  color: string;
  description: string;
}

export interface SizeOption {
  id: '8x8' | '8x11' | '11x8';
  name: string;
  dimensions: string;
  aspectRatio: number;
}

export interface EffectOption {
  id: 'original' | 'silver' | 'noir' | 'vivid' | 'dramatic';
  name: string;
  filter: string;
}

export interface ImageTransform {
  scale: number;
  rotation: number;
  x: number;
  y: number;
}

export interface UploadedImage {
  file: File;
  url: string;
  transform: ImageTransform;
}