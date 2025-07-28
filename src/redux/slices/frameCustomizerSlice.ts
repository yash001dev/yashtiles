import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FrameCustomization, FrameCollection, UploadedImage, FrameItem, ImageTransform } from '@/types';

interface FrameCustomizerState {
  customization: FrameCustomization;
  frameCollection: FrameCollection;
  uploadedImage: UploadedImage | null;
  frameImages: { [key: string]: string };
  printReadyImages: { [key: string]: string }; // Store print-ready images from KonvaFrameRenderer
  activeModal: string | null;
}

const initialState: FrameCustomizerState = {
  customization: {
    material: 'classic',
    frameColor: 'black',
    size: '8x8',
    effect: 'original',
    border: true,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    hangType: 'stickable_tape',
  },
  frameCollection: {
    frames: [],
    activeFrameId: null,
  },
  uploadedImage: null,
  frameImages: {},
  printReadyImages: {},
  activeModal: null,
};

export const frameCustomizerSlice = createSlice({
  name: 'frameCustomizer',
  initialState,
  reducers: {
    updateCustomization: (state, action: PayloadAction<Partial<FrameCustomization>>) => {
      state.customization = { ...state.customization, ...action.payload };
    },
    
    setUploadedImage: (state, action: PayloadAction<UploadedImage>) => {
      state.uploadedImage = action.payload;
    },

    replaceImage: (state, action: PayloadAction<{ file: File; url: string }>) => {
      if (state.uploadedImage) {
        state.uploadedImage = {
          file: action.payload.file,
          url: action.payload.url,
          transform: state.uploadedImage.transform || {
            scale: 1,
            rotation: 0,
            x: 0,
            y: 0,
          }
        };
        
        // Also update the frameImages cache with the new image
        if (state.frameCollection.activeFrameId) {
          state.frameImages[state.frameCollection.activeFrameId] = action.payload.url;
        }
      }
    },

    updateImageTransform: (state, action: PayloadAction<Partial<ImageTransform>>) => {
      if (state.uploadedImage) {
        state.uploadedImage.transform = { 
          ...state.uploadedImage.transform, 
          ...action.payload 
        };
      }
    },

    setFrameImage: (state, action: PayloadAction<{ frameId: string; base64: string }>) => {
      state.frameImages = {
        ...state.frameImages,
        [action.payload.frameId]: action.payload.base64,
      };

      // Update the uploaded image if this is for the active frame
      if (state.frameCollection.activeFrameId === action.payload.frameId) {
        if (state.uploadedImage) {
          state.uploadedImage.url = action.payload.base64;
        }
      }
    },

    addFrameToCollection: (state) => {
      if (state.uploadedImage) {
        const newFrame: FrameItem = {
          id: Date.now().toString(),
          image: state.uploadedImage,
          customization: { ...state.customization },
          createdAt: new Date(),
        };

        // Store the base64 for this frame
        state.frameImages = {
          ...state.frameImages,
          [newFrame.id]: state.uploadedImage.url,
        };

        state.frameCollection = {
          frames: [...state.frameCollection.frames, newFrame],
          activeFrameId: newFrame.id,
        };
      }
    },

    removeFrameFromCollection: (state, action: PayloadAction<string>) => {
      const frameId = action.payload;
      
      // Remove the base64 for the removed frame
      const newFrameImages = { ...state.frameImages };
      delete newFrameImages[frameId];
      state.frameImages = newFrameImages;

      const newFrames = state.frameCollection.frames.filter(frame => frame.id !== frameId);
      const newActiveId = newFrames.length > 0 ? 
        (state.frameCollection.activeFrameId === frameId ? newFrames[0].id : state.frameCollection.activeFrameId) : 
        null;
      
      state.frameCollection = {
        frames: newFrames,
        activeFrameId: newActiveId,
      };
    },

    selectFrame: (state, action: PayloadAction<string>) => {
      const frameId = action.payload;
      const frame = state.frameCollection.frames.find(f => f.id === frameId);
      if (frame) {
        state.frameCollection.activeFrameId = frameId;
        
        // Use the stored base64 for this frame
        const storedBase64 = state.frameImages[frameId];
        if (storedBase64) {
          state.uploadedImage = {
            ...frame.image,
            url: storedBase64,
          };
        } else {
          state.uploadedImage = frame.image;
        }
        
        state.customization = frame.customization;
      }
    },
    
    updateActiveFrame: (state) => {
      if (state.frameCollection.activeFrameId && state.uploadedImage) {
        // Update the frame image cache to ensure persistence
        state.frameImages[state.frameCollection.activeFrameId] = state.uploadedImage.url;
        
        // Update the frame in the collection
        state.frameCollection.frames = state.frameCollection.frames.map(frame => 
          frame.id === state.frameCollection.activeFrameId 
            ? { 
                ...frame, 
                image: {
                  ...state.uploadedImage!,
                  url: state.uploadedImage!.url // Ensure URL is properly updated
                }, 
                customization: state.customization 
              }
            : frame
        );
      }
    },

    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },

    setPrintReadyImage: (state, action: PayloadAction<{ frameId: string; dataUrl: string }>) => {
      state.printReadyImages = {
        ...state.printReadyImages,
        [action.payload.frameId]: action.payload.dataUrl,
      };
    },
  },
});

export const { 
  updateCustomization, 
  setUploadedImage, 
  replaceImage, 
  updateImageTransform,
  setFrameImage,
  addFrameToCollection,
  removeFrameFromCollection,
  selectFrame,
  updateActiveFrame,
  setActiveModal,
  setPrintReadyImage
} = frameCustomizerSlice.actions;

export default frameCustomizerSlice.reducer;
