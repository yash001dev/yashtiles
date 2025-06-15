import React from 'react';
import Header from './components/Header';
import PhotoUpload from './components/PhotoUpload';
import FramePreview from './components/FramePreview';
import Toolbar from './components/Toolbar';
import ImageEditor from './components/ImageEditor';
import MaterialBottomSheet from './components/MaterialBottomSheet';
import FrameBottomSheet from './components/FrameBottomSheet';
import SizeBottomSheet from './components/SizeBottomSheet';
import EffectBottomSheet from './components/EffectBottomSheet';
import BorderBottomSheet from './components/BorderBottomSheet';
import { useFrameCustomizer } from './hooks/useFrameCustomizer';
import { downloadFramedImage } from './utils/downloadImage';

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
  } = useFrameCustomizer();

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      <Header />
      
      <main className="pb-24 relative">
        {!uploadedImage ? (
          <PhotoUpload onImageSelect={setImage} />
        ) : (
          <FramePreview 
            customization={customization} 
            uploadedImage={uploadedImage}
            onImageClick={handleImageClick}
          />
        )}
      </main>

      {uploadedImage && <Toolbar onToolClick={handleToolClick} hasImage={!!uploadedImage} />}

      {/* Bottom Sheets */}
      <MaterialBottomSheet
        isOpen={activeModal === 'material'}
        onClose={closeModal}
        currentMaterial={customization.material}
        onSelect={(material) => updateCustomization({ material })}
      />

      <FrameBottomSheet
        isOpen={activeModal === 'frame'}
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
          onDownload={handleDownload}
          onImageReplace={replaceImage}
        />
      )}
    </div>
  );
}

export default App;