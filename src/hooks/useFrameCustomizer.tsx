import { useState, useCallback } from 'react';
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
  const [frameImages, setFrameImages] = useState<{ [key: string]: string }>({});
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Helper function to convert base64 to Blob URL for display
  const base64ToImageUrl = (base64: string): string => {
    return base64; // Base64 can be used directly as src
  };

  // Helper function to convert base64 back to File when needed
  const base64ToFile = (base64: string, filename: string = 'image.jpg'): File => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

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

  const setImage = async (file: File) => {
    const base64 = await fileToBase64(file);
    setUploadedImage({
      file,
      url: base64,
      transform: {
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0,
      }
    });
  };

  const replaceImage = async (file: File) => {
    const base64 = await fileToBase64(file);
    setUploadedImage(prev => ({
      file,
      url: base64,
      transform: prev?.transform || {
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0,
      }
    }));
  };

  const handleImageChange = async (frameId: string, file: File) => {
    const base64 = await fileToBase64(file);

    setFrameImages(prev => ({
      ...prev,
      [frameId]: base64,
    }));

    // Update the uploaded image if this is for the active frame
    if (frameCollection.activeFrameId === frameId) {
      setUploadedImage({
        file,
        url: base64,
        transform: {
          scale: 1,
          rotation: 0,
          x: 0,
          y: 0,
        }
      });
    }
  };

  const getFrameImageUrl = (frameId: string): string | null => {
    return frameImages[frameId] || null;
  };

  const getFrameImageAsFile = (frameId: string, filename?: string): File | null => {
    const base64 = frameImages[frameId];
    if (!base64) return null;
    return base64ToFile(base64, filename);
  };

  const addFrameToCollection = () => {
    if (uploadedImage) {
      const newFrame: FrameItem = {
        id: Date.now().toString(),
        image: uploadedImage,
        customization: { ...customization },
        createdAt: new Date(),
      };

      // Store the base64 for this frame
      setFrameImages(prev => ({
        ...prev,
        [newFrame.id]: uploadedImage.url,
      }));

      setFrameCollection(prev => ({
        frames: [...prev.frames, newFrame],
        activeFrameId: newFrame.id,
      }));
    }
  };

  const removeFrameFromCollection = (frameId: string) => {
    // Remove the base64 for the removed frame
    setFrameImages(prev => {
      const newFrameImages = { ...prev };
      delete newFrameImages[frameId];
      return newFrameImages;
    });

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
      
      // Use the stored base64 for this frame
      const storedBase64 = frameImages[frameId];
      if (storedBase64) {
        setUploadedImage({
          ...frame.image,
          url: storedBase64,
        });
      } else {
        setUploadedImage(frame.image);
      }
      
      setCustomization(frame.customization);
    }
  };
  const updateActiveFrame = useCallback(() => {
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
  }, [frameCollection.activeFrameId, uploadedImage, customization]);

  const openModal = (modalName: string) => {
    // Ensure modalName matches the intended modal to open
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
    handleImageChange,
    getFrameImageUrl,
    getFrameImageAsFile,
    frameImages,
    base64ToImageUrl,
    base64ToFile,
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