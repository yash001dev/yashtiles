import { useState } from 'react';
import { FrameCustomization, UploadedImage, ImageTransform } from '../types';

export const useFrameCustomizer = () => {
  const [customization, setCustomization] = useState<FrameCustomization>({
    material: 'classic',
    frameColor: 'black',
    size: '8x8',
    effect: 'original',
    border: true,
    borderColor: '#000000',
    borderWidth: 2,
  });

  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const updateCustomization = (updates: Partial<FrameCustomization>) => {
    setCustomization(prev => ({ ...prev, ...updates }));
  };

  const updateImageTransform = (transform: Partial<ImageTransform>) => {
    if (uploadedImage) {
      setUploadedImage(prev => ({
        ...prev!,
        transform: { ...prev!.transform, ...transform }
      }));
    }
  };

  const setImage = (file: File) => {
    const url = URL.createObjectURL(file);
    setUploadedImage({
      file,
      url,
      transform: {
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0,
      }
    });
  };

  const replaceImage = (file: File) => {
    if (uploadedImage) {
      // Clean up the old URL
      URL.revokeObjectURL(uploadedImage.url);
    }
    
    const url = URL.createObjectURL(file);
    setUploadedImage(prev => ({
      file,
      url,
      transform: prev?.transform || {
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0,
      }
    }));
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return {
    customization,
    updateCustomization,
    uploadedImage,
    setImage,
    replaceImage,
    updateImageTransform,
    activeModal,
    openModal,
    closeModal,
  };
};