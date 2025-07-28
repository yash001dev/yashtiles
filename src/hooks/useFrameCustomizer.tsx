import { useCallback } from 'react';
import { FrameCustomization, UploadedImage, ImageTransform, FrameItem, FrameCollection } from '../types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  updateCustomization as updateCustomizationAction, 
  setUploadedImage, 
  replaceImage as replaceImageAction, 
  updateImageTransform as updateImageTransformAction,
  setFrameImage,
  addFrameToCollection as addFrameToCollectionAction,
  removeFrameFromCollection as removeFrameFromCollectionAction,
  selectFrame as selectFrameAction,
  updateActiveFrame as updateActiveFrameAction,
  setActiveModal as setActiveModalAction
} from '@/redux/slices/frameCustomizerSlice';
import { fileToBase64, base64ToFile } from '@/redux/utils';

export const useFrameCustomizer = () => {
  const dispatch = useAppDispatch();
  const customization = useAppSelector((state) => state.frameCustomizer.customization);
  const frameCollection = useAppSelector((state) => state.frameCustomizer.frameCollection);
  const uploadedImage = useAppSelector((state) => state.frameCustomizer.uploadedImage);
  const frameImages = useAppSelector((state) => state.frameCustomizer.frameImages);
  const activeModal = useAppSelector((state) => state.frameCustomizer.activeModal);

  // Use helper functions from Redux utils
  
  // Helper function to convert base64 to Blob URL for display
  const base64ToImageUrl = (base64: string): string => {
    return base64; // Base64 can be used directly as src
  };

  const updateCustomization = (updates: Partial<FrameCustomization>) => {
    dispatch(updateCustomizationAction(updates));
  };

  const updateImageTransform = (transform: Partial<ImageTransform>) => {
    dispatch(updateImageTransformAction(transform));
  };

  const setImage = async (file: File) => {
    const base64 = await fileToBase64(file);
    dispatch(setUploadedImage({
      file,
      url: base64,
      transform: {
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0,
      }
    }));
  };

  const replaceImage = async (file: File) => {
    const base64 = await fileToBase64(file);
    dispatch(replaceImageAction({
      file,
      url: base64
    }));
  };

  const handleImageChange = async (frameId: string, file: File) => {
    const base64 = await fileToBase64(file);
    dispatch(setFrameImage({
      frameId,
      base64
    }));
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
    console.log("Adding frame to collection with uploadedImage:", uploadedImage);
    if (uploadedImage) {
      dispatch(addFrameToCollectionAction());
    }
  };

  const removeFrameFromCollection = (frameId: string) => {
    dispatch(removeFrameFromCollectionAction(frameId));
  };

  const selectFrame = (frameId: string) => {
    dispatch(selectFrameAction(frameId));
  };
  
  const updateActiveFrame = useCallback(() => {
    dispatch(updateActiveFrameAction());
  }, [dispatch]);

  const openModal = (modalName: string) => {
    dispatch(setActiveModalAction(modalName));
  };

  const closeModal = () => {
    dispatch(setActiveModalAction(null));
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