import React from 'react';
import Header from './components/Header';
import PhotoUpload from './components/PhotoUpload';
import FramePreview from './components/FramePreview';
import Toolbar from './components/Toolbar';
import ImageEditor from './components/ImageEditor';
import MaterialModal from './components/MaterialModal';
import FrameModal from './components/FrameModal';
import SizeModal from './components/SizeModal';
import EffectModal from './components/EffectModal';
import BorderModal from './components/BorderModal';
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
    if (tool === 'border') {
      updateCustomization({ border: !customization.border });
    } else {
      openModal(tool);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pb-24">
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

      {uploadedImage && <Toolbar onToolClick={handleToolClick} />}

      <MaterialModal
        isOpen={activeModal === 'material'}
        onClose={closeModal}
        currentMaterial={customization.material}
        onSelect={(material) => updateCustomization({ material })}
      />

      <FrameModal
        isOpen={activeModal === 'frame'}
        onClose={closeModal}
        currentFrame={customization.frameColor}
        onSelect={(frameColor) => updateCustomization({ frameColor })}
      />

      <SizeModal
        isOpen={activeModal === 'size'}
        onClose={closeModal}
        currentSize={customization.size}
        onSelect={(size) => updateCustomization({ size })}
      />

      <EffectModal
        isOpen={activeModal === 'effect'}
        onClose={closeModal}
        currentEffect={customization.effect}
        onSelect={(effect) => updateCustomization({ effect })}
      />

      <BorderModal
        isOpen={activeModal === 'border'}
        onClose={closeModal}
        currentBorder={customization.border}
        onToggle={(border) => updateCustomization({ border })}
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