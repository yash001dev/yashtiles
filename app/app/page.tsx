'use client';
import React from 'react';
import Header from '../../src/components/Header';
import PhotoUpload from '../../src/components/PhotoUpload';
import FramePreview from '../../src/components/FramePreview';
import Toolbar from '../../src/components/Toolbar';
import ImageEditor from '../../src/components/ImageEditor';
import MaterialBottomSheet from '../../src/components/MaterialBottomSheet';
import FrameBottomSheet from '../../src/components/FrameBottomSheet';
import SizeBottomSheet from '../../src/components/SizeBottomSheet';
import EffectBottomSheet from '../../src/components/EffectBottomSheet';
import BorderBottomSheet from '../../src/components/BorderBottomSheet';
import ResponsiveLayout from '../../src/components/ResponsiveLayout';
import FloatingAddButton from '../../src/components/FloatingAddButton';
import TutorialTooltip from '../../src/components/TutorialTooltip';
import { useFrameCustomizer } from '../../src/hooks/useFrameCustomizer';
import { downloadFramedImage } from '../../src/utils/downloadImage';

function App() {
  const {
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
  } = useFrameCustomizer();
  // Update active frame when customization or image changes
  React.useEffect(() => {
    if (frameCollection.activeFrameId && uploadedImage) {
      updateActiveFrame();
    }
  }, [customization, uploadedImage, frameCollection.activeFrameId, updateActiveFrame]);

  const handleToolClick = (tool: string) => {
    openModal(tool);
  };

  const handleImageClick = () => {
    if (uploadedImage) {
      openModal('imageEditor');
    }
  };

  const handleDownload = async () => {
    if (uploadedImage) {
      await downloadFramedImage(uploadedImage, customization);
      closeModal();
    }
  };

  const handleBorderUpdate = (updates: { borderColor?: string; borderWidth?: number }) => {
    updateCustomization(updates);
  };  const handleAddFrame = React.useCallback(() => {
    if (uploadedImage) {
      addFrameToCollection();
    }
  }, [uploadedImage, addFrameToCollection]);

  const handleImageUpload = (file: File) => {
    setImage(file);
    // Automatically add the first frame when image is uploaded
    setTimeout(() => {
      if (frameCollection.frames.length === 0) {
        handleAddFrame();
      }
    }, 100);
  };

  const handleAddToCart = () => {
    // Add to cart functionality
    console.log('Adding to cart:', { customization, uploadedImage });
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + D to duplicate frame (add new frame)
      if ((event.ctrlKey || event.metaKey) && event.key === 'd' && uploadedImage) {
        event.preventDefault();
        handleAddFrame();
      }
    };    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [uploadedImage, handleAddFrame]);

  const [showTutorial, setShowTutorial] = React.useState(false);

  // Show tutorial on first image upload
  React.useEffect(() => {
    if (uploadedImage && frameCollection.frames.length === 1 && !localStorage.getItem('tutorialSeen')) {
      setShowTutorial(true);
    }
  }, [uploadedImage, frameCollection.frames.length]);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('tutorialSeen', 'true');
  };  return (
    <div className="min-h-screen">
      {/* Header takes full width */}
      <Header />
      
      {/* Content area starts after header */}
      <ResponsiveLayout
        customization={customization}
        frames={frameCollection.frames}
        activeFrameId={frameCollection.activeFrameId}
        onFrameSelect={selectFrame}
        onFrameRemove={removeFrameFromCollection}
        onAddFrame={handleAddFrame}
        onAddToCart={handleAddToCart}
        hasUploadedImage={!!uploadedImage}
      >
        <main className="pb-2 relative">
          {!uploadedImage ? (
            <PhotoUpload onImageSelect={handleImageUpload} />
          ) : (
            <FramePreview 
              customization={customization} 
              uploadedImage={uploadedImage}
              onImageClick={handleImageClick}
              frameCount={frameCollection.frames.length}
              currentFrameIndex={frameCollection.frames.findIndex(f => f.id === frameCollection.activeFrameId)}
            />
          )}
        </main>

      {uploadedImage && <Toolbar onToolClick={handleToolClick} onAddFrame={handleAddFrame} hasImage={!!uploadedImage} />}      {/* Bottom Sheets */}
      <MaterialBottomSheet
        isOpen={activeModal === 'frame'}
        onClose={closeModal}
        currentMaterial={customization.material}
        onSelect={(material) => updateCustomization({ material })}
      />

      <FrameBottomSheet
        isOpen={activeModal === 'material'}
        onClose={closeModal}
        currentFrame={customization.frameColor}
        onSelect={(frameColor) => updateCustomization({ frameColor })}
      />

      <SizeBottomSheet
        isOpen={activeModal === 'size'}
        onClose={closeModal}
        currentSize={customization.size}
        onSelect={(size) => updateCustomization({ size })}
      />

      <EffectBottomSheet
        isOpen={activeModal === 'effect'}
        onClose={closeModal}
        currentEffect={customization.effect}
        onSelect={(effect) => updateCustomization({ effect })}
      />

      <BorderBottomSheet
        isOpen={activeModal === 'border'}
        onClose={closeModal}
        currentBorder={customization.border}
        borderColor={customization.borderColor}
        borderWidth={customization.borderWidth}
        onToggle={(border) => updateCustomization({ border })}
        onBorderUpdate={handleBorderUpdate}
        uploadedImage={uploadedImage}
      />

      {uploadedImage && (
        <ImageEditor
          isOpen={activeModal === 'imageEditor'}
          onClose={closeModal}
          image={uploadedImage}
          customization={customization}
          onTransformUpdate={updateImageTransform}
          onDownload={handleDownload}          onImageReplace={replaceImage}
        />
      )}

      {/* Floating Add Button for mobile */}
      <FloatingAddButton
        onAddFrame={handleAddFrame}
        hasFrames={frameCollection.frames.length > 0}
        hasImage={!!uploadedImage}
      />      {/* Tutorial Tooltip */}
      <TutorialTooltip 
        show={showTutorial} 
        onClose={handleCloseTutorial} 
      />
      </ResponsiveLayout>
    </div>
  );
}

export default App;