import { useState } from 'react';
import { FrameCustomization, UploadedImage, ImageTransform, FrameItem, FrameCollection } from '../types';

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

  const [frameCollection, setFrameCollection] = useState<FrameCollection>({
    frames: [],
    activeFrameId: null,
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

  const addFrameToCollection = () => {
    if (uploadedImage) {
      const newFrame: FrameItem = {
        id: Date.now().toString(),
        image: uploadedImage,
        customization: { ...customization },
        createdAt: new Date(),
      };

      setFrameCollection(prev => ({
        frames: [...prev.frames, newFrame],
        activeFrameId: newFrame.id,
      }));
    }
  };

  const removeFrameFromCollection = (frameId: string) => {
    setFrameCollection(prev => {
      const newFrames = prev.frames.filter(frame => frame.id !== frameId);
      const newActiveId = newFrames.length > 0 ? 
        (prev.activeFrameId === frameId ? newFrames[0].id : prev.activeFrameId) : 
        null;
      
      return {
        frames: newFrames,
        activeFrameId: newActiveId,
      };
    });
  };

  const selectFrame = (frameId: string) => {
    const frame = frameCollection.frames.find(f => f.id === frameId);
    if (frame) {
      setFrameCollection(prev => ({ ...prev, activeFrameId: frameId }));
      setUploadedImage(frame.image);
      setCustomization(frame.customization);
    }
  };

  const updateActiveFrame = () => {
    if (frameCollection.activeFrameId && uploadedImage) {
      setFrameCollection(prev => ({
        ...prev,
        frames: prev.frames.map(frame => 
          frame.id === prev.activeFrameId 
            ? { ...frame, image: uploadedImage, customization }
            : frame
        ),
      }));
    }
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const activeFrame = frameCollection.frames.find(f => f.id === frameCollection.activeFrameId);

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
    frameCollection,
    addFrameToCollection,
    removeFrameFromCollection,
    selectFrame,
    updateActiveFrame,
    activeFrame,
  };
};