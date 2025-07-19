import { useEffect, useCallback, useState } from 'react';
import { indexedDBService } from '../services/indexedDBService';
import { FrameCustomization, UploadedImage } from '../types';

interface UsePersistenceProps {
  uploadedImage: UploadedImage | null;
  customization: FrameCustomization;
  frameCollection: {
    frames: any[];
    activeFrameId: string | null;
  };
  onImageRestore: (image: UploadedImage) => void;
  onCustomizationRestore: (customization: FrameCustomization) => void;
  onFrameCollectionRestore: (frames: any[], activeFrameId: string | null) => void;
}

export const usePersistence = ({
  uploadedImage,
  customization,
  frameCollection,
  onImageRestore,
  onCustomizationRestore,
  onFrameCollectionRestore,
}: UsePersistenceProps) => {
  const [hasRestoredData, setHasRestoredData] = useState(false);

  // Initialize IndexedDB on mount
  useEffect(() => {
    indexedDBService.init();
  }, []);

  // Restore data from IndexedDB ONLY on initial mount
  useEffect(() => {
    if (hasRestoredData) return; // Prevent multiple restorations

    const restoreData = async () => {
      try {
        console.log('🔄 Initial data restoration from IndexedDB...');
        
        // Restore current image
        const savedImage = await indexedDBService.getCurrentImage();
        if (savedImage) {
          console.log('🖼️ Restoring image from IndexedDB');
          onImageRestore(savedImage);
        }

        // Restore current customization
        const savedCustomization = await indexedDBService.getCurrentCustomization();
        if (savedCustomization) {
          console.log('🔄 Restoring customization from IndexedDB:', savedCustomization);
          onCustomizationRestore(savedCustomization);
        }

        // Restore frame collection
        const savedFrameCollection = await indexedDBService.getFrameCollection();
        if (savedFrameCollection) {
          console.log('📁 Restoring frame collection from IndexedDB');
          onFrameCollectionRestore(savedFrameCollection.frames, savedFrameCollection.activeFrameId);
        }

        setHasRestoredData(true);
        console.log('✅ Initial data restoration completed');
      } catch (error) {
        console.error('Failed to restore data from IndexedDB:', error);
        setHasRestoredData(true); // Mark as attempted even if failed
      }
    };

    restoreData();
  }, []); // Empty dependency array - only run once on mount

  // Save current image to IndexedDB when it changes (only after initial restoration)
  useEffect(() => {
    if (uploadedImage && hasRestoredData) {
      console.log('💾 Saving image to IndexedDB');
      indexedDBService.saveCurrentImage(uploadedImage);
    }
  }, [uploadedImage, hasRestoredData]);

  // Save current customization to IndexedDB when it changes (only after initial restoration)
  useEffect(() => {
    if (hasRestoredData) {
      console.log('💾 Saving customization to IndexedDB:', customization);
      indexedDBService.saveCurrentCustomization(customization);
    }
  }, [customization, hasRestoredData]);

  // Save frame collection to IndexedDB when it changes
  useEffect(() => {
    indexedDBService.saveFrameCollection(frameCollection.frames, frameCollection.activeFrameId);
  }, [frameCollection.frames, frameCollection.activeFrameId]);

  // Manual save functions
  const saveCurrentState = useCallback(async () => {
    try {
      if (uploadedImage) {
        await indexedDBService.saveCurrentImage(uploadedImage);
      }
      await indexedDBService.saveCurrentCustomization(customization);
      await indexedDBService.saveFrameCollection(frameCollection.frames, frameCollection.activeFrameId);
    } catch (error) {
      console.error('Failed to save current state:', error);
    }
  }, [uploadedImage, customization, frameCollection]);

  const clearPersistedData = useCallback(async () => {
    try {
      await indexedDBService.clearAllFrames();
      await indexedDBService.saveSetting('currentImage', null);
      await indexedDBService.saveSetting('currentCustomization', null);
      await indexedDBService.saveSetting('frameCollection', null);
    } catch (error) {
      console.error('Failed to clear persisted data:', error);
    }
  }, []);

  return {
    saveCurrentState,
    clearPersistedData,
  };
};
