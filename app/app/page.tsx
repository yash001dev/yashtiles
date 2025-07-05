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
import ToastContainer from '../../src/components/ui/ToastContainer';
import CheckoutModal from '../../src/components/checkout/CheckoutModal';
import AuthModal from '../../src/components/auth/AuthModal';
import { AuthProvider, useAuth } from '../../src/contexts/AuthContext';
import { NotificationProvider, useNotifications } from '../../src/contexts/NotificationContext';
import { useFrameCustomizer } from '../../src/hooks/useFrameCustomizer';
import { downloadFramedImage } from '../../src/utils/downloadImage';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  
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

  // State for checkout and auth modals
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<'cart' | 'checkout' | null>(null);
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
    if (!uploadedImage) {
      addNotification({
        type: 'warning',
        title: 'No Image',
        message: 'Please upload an image first before adding to cart.'
      });
      return;
    }

    if (!isAuthenticated) {
      setPendingAction('cart');
      setIsAuthModalOpen(true);
      return;
    }

    // Add to cart functionality - no redirect, just show success message
    console.log('Adding to cart:', { customization, uploadedImage });
    addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: 'Your customized frame has been added to cart.'
    });
  };

  const handleCheckout = () => {
    if (!uploadedImage) {
      addNotification({
        type: 'warning',
        title: 'No Image',
        message: 'Please upload an image first before proceeding to checkout.'
      });
      return;
    }

    if (!isAuthenticated) {
      setPendingAction('checkout');
      setIsAuthModalOpen(true);
      return;
    }

    setIsCheckoutModalOpen(true);
  };

  // Handle auth modal success
  React.useEffect(() => {
    if (isAuthenticated && pendingAction && !isAuthModalOpen) {
      if (pendingAction === 'cart') {
        // Just add to cart, don't redirect
        console.log('Adding to cart after authentication:', { customization, uploadedImage });
        addNotification({
          type: 'success',
          title: 'Added to Cart',
          message: 'Your customized frame has been added to cart.'
        });
      } else if (pendingAction === 'checkout') {
        setTimeout(() => setIsCheckoutModalOpen(true), 100);
      }
      setPendingAction(null);
    }
  }, [isAuthenticated, pendingAction, isAuthModalOpen]);

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
  };

  // Calculate cart total including temporary frame
  const calculateCartTotal = React.useMemo(() => {
    let total = 0;
    
    // Add price from actual frames
    total += frameCollection.frames.reduce((sum, frame) => {
      return sum + getSizePrice(frame.customization.size);
    }, 0);
    
    // Add price from temporary frame (uploaded image with no frames)
    if (frameCollection.frames.length === 0 && uploadedImage) {
      total += getSizePrice(customization.size);
    }
    
    return total;
  }, [frameCollection.frames, uploadedImage, customization.size]);

  // Generate checkout items including temporary frame
  const generateCheckoutItems = React.useMemo(() => {
    const items = [];
    
    // Add actual frames
    frameCollection.frames.forEach((frame, index) => {
      items.push({
        id: frame.id,
        name: `Custom Frame ${index + 1}`,
        price: getSizePrice(frame.customization.size),
        customization: frame.customization,
        image: frame.image.url,
      });
    });
    
    // Add temporary frame if no actual frames exist
    if (frameCollection.frames.length === 0 && uploadedImage) {
      items.push({
        id: 'temp-frame-' + Date.now(),
        name: 'Custom Frame',
        price: getSizePrice(customization.size),
        customization,
        image: uploadedImage.url,
      });
    }
    
    return items;
  }, [frameCollection.frames, uploadedImage, customization]);

  return (
    <div className="min-h-screen">
      {/* Header takes full width */}
      <Header 
        onCartClick={handleCheckout}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        cartTotal={calculateCartTotal}
      />
      
      {/* Content area starts after header */}
      <ResponsiveLayout
        customization={customization}
        frames={frameCollection.frames}
        activeFrameId={frameCollection.activeFrameId}
        onFrameSelect={selectFrame}
        onFrameRemove={removeFrameFromCollection}
        onAddFrame={handleAddFrame}
        onAddToCart={handleAddToCart}
        onAuthRequired={() => {
          setPendingAction('cart');
          setIsAuthModalOpen(true);
        }}
        hasUploadedImage={!!uploadedImage}
        uploadedImage={uploadedImage}
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

        {uploadedImage && <Toolbar onToolClick={handleToolClick} onAddFrame={handleAddFrame} onAuthRequired={() => {
          setPendingAction('cart');
          setIsAuthModalOpen(true);
        }} hasImage={!!uploadedImage} />}        {/* Bottom Sheets */}
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
            onDownload={handleDownload}            onImageReplace={replaceImage}
          />
        )}

        {/* Floating Add Button for mobile */}
        <FloatingAddButton
          onAddFrame={handleAddFrame}
          hasFrames={frameCollection.frames.length > 0}
          hasImage={!!uploadedImage}
          onAuthRequired={() => {
            setPendingAction('cart');
            setIsAuthModalOpen(true);
          }}
        />        {/* Tutorial Tooltip */}
        <TutorialTooltip 
          show={showTutorial} 
          onClose={handleCloseTutorial} 
        />

        {/* Auth Modal */}
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false);
            setPendingAction(null);
          }}
        />

        {/* Checkout Modal */}
        {(uploadedImage || frameCollection.frames.length > 0) && (
          <CheckoutModal
            isOpen={isCheckoutModalOpen}
            onClose={() => setIsCheckoutModalOpen(false)}
            items={generateCheckoutItems}
          />
        )}

        </ResponsiveLayout>
        <ToastContainer position="top-right" />
    </div>
  );
}

// Helper function to get size pricing
function getSizePrice(size: string) {
  const prices: Record<string, number> = {
    '8x8': 299,
    '8x10': 404,
    '10x8': 404,
    '9x12': 582,
    '12x9': 582,
    '12x12': 797,
    '12x18': 1218,
    '18x12': 1218,
    '18x18': 1900,
    '18x24': 2400,
    '24x18': 2400,
    '24x32': 4200,
    '32x24': 4200,
  };
  return prices[size] || 399;
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;