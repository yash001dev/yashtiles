"use client";
import React, { useRef } from "react";
import Header from "../../src/components/Header";
import PhotoUpload from "../../src/components/PhotoUpload";
import FramePreview, { FramePreviewRef } from "../../src/components/FramePreview";
import Toolbar from "../../src/components/Toolbar";
import KonvaImageEditor from "../../src/components/KonvaImageEditor";
import MaterialBottomSheet from "../../src/components/MaterialBottomSheet";
import FrameBottomSheet from "../../src/components/FrameBottomSheet";
import SizeBottomSheet from "../../src/components/SizeBottomSheet";
import EffectBottomSheet from "../../src/components/EffectBottomSheet";
import BorderBottomSheet from "../../src/components/BorderBottomSheet";
import ResponsiveLayout from "../../src/components/ResponsiveLayout";
import FloatingAddButton from "../../src/components/FloatingAddButton";
import TutorialTooltip from "../../src/components/TutorialTooltip";
import CheckoutModal from "../../src/components/checkout/CheckoutModal";
import AuthModal from "../../src/components/auth/AuthModal";
import { AuthProvider, useAuth } from "../../src/contexts/AuthContext";
import {
  NotificationProvider,
  useNotifications,
} from "../../src/contexts/NotificationContext";
import { useFrameCustomizer } from "../../src/hooks/useFrameCustomizer";
import { usePersistence } from "../../src/hooks/usePersistence";
import { FrameCustomization } from "@/types";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();

  const {
    customization,
    updateCustomization,
    uploadedImage,
    setImage,
    replaceImage,
    handleImageChange,
    getFrameImageUrl,
    getFrameImageAsFile,
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

  // Initialize persistence functionality
  const { saveCurrentState, clearPersistedData } = usePersistence({
    uploadedImage,
    customization,
    frameCollection,
    onImageRestore: async (image) => {
      // Convert base64 back to File for restoration
      try {
        const response = await fetch(image.url);
        const blob = await response.blob();
        const file = new File([blob], 'restored-image.jpg', { type: blob.type });
        await setImage(file);
      } catch (error) {
        console.error('Failed to restore image:', error);
      }
    },
    onCustomizationRestore: (restoredCustomization) => {
      updateCustomization(restoredCustomization);
    },
    onFrameCollectionRestore: (frames, activeFrameId) => {
      // For now, we'll skip frame collection restoration as it requires more complex implementation
      // TODO: Implement proper frame collection restoration in useFrameCustomizer
      console.log('Frame collection restoration not yet implemented:', frames, activeFrameId);
    },
  });

  // State for checkout and auth modals
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<
    "cart" | "checkout" | null
  >(null);

  // Update active frame when customization or image changes
  React.useEffect(() => {
    if (frameCollection.activeFrameId && uploadedImage) {
      updateActiveFrame();
    }
  }, [
    customization,
    uploadedImage,
    frameCollection.activeFrameId,
    updateActiveFrame,
  ]);

  const handleToolClick = (tool: string) => {
    openModal(tool);
  };

  // Create a hidden file input ref for image change
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (uploadedImage && fileInputRef.current) {
      // Trigger file input when image is clicked
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageReplace(file);
      // Reset the input value so the same file can be selected again
      event.target.value = '';
    }
  };

  const framePreviewRef = useRef<FramePreviewRef>(null);

  const handleDownload = async () => {
    if (uploadedImage && framePreviewRef.current) {
      // Use FramePreview's download method which properly captures all materials
      framePreviewRef.current.handleDownload();
      closeModal();
    }
  };

  const handleBorderUpdate = (updates: {
    borderColor?: string;
    borderWidth?: number;
  }) => {
    updateCustomization(updates);
  };
  const handleAddFrame = React.useCallback(() => {
    if (uploadedImage) {
      addFrameToCollection();
    }
  }, [uploadedImage, addFrameToCollection]);

  const handleImageUpload = async (file: File) => {
    await setImage(file);
    // Automatically add the first frame when image is uploaded
    setTimeout(() => {
      if (frameCollection.frames.length === 0) {
        handleAddFrame();
      }
    }, 100);
  };

  const handleFrameImageUpload = async (frameId: string, file: File) => {
    await handleImageChange(frameId, file);
  };

  const handleImageReplace = async (file: File) => {
    await replaceImage(file);
  };

  const handleAddToCart = () => {
    if (!uploadedImage) {
      addNotification({
        type: "warning",
        title: "No Image",
        message: "Please upload an image first before adding to cart.",
      });
      return;
    }

    if (!isAuthenticated) {
      setPendingAction("cart");
      setIsAuthModalOpen(true);
      return;
    }

    // Add to cart functionality - no redirect, just show success message
    addNotification({
      type: "success",
      title: "Added to Cart",
      message: "Your customized frame has been added to cart.",
    });
  };

  const [cartItems, setCartItems] = React.useState<Array<{
    customization: FrameCustomization;
    image: string;
  }>>([]);

  const [isProcessingCheckout, setIsProcessingCheckout] = React.useState(false);

  const handleCheckout = async () => {
    if (!uploadedImage) {
      addNotification({
        type: "warning",
        title: "No Image",
        message: "Please upload an image first before proceeding to checkout.",
      });
      return;
    }

    if (!isAuthenticated) {
      setPendingAction("checkout");
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setIsProcessingCheckout(true);
      
      // Get the image data URL from the FramePreview component
      const imageDataUrl = await framePreviewRef.current?.getImageDataUrl();
      
      if (!imageDataUrl) {
        throw new Error("Could not generate frame preview");
      }
      
      // Get price based on frame size
      const getSizePrice = (size: string): number => {
        const prices: Record<string, number> = {
          '8x10': 1999,
          '12x18': 2499,
          '16x20': 2999,
          '18x24': 3499,
          '24x36': 4999,
        };
        return prices[size] || 0;
      };

      // Create cart items with customization, image, and price
      const items = [{
        customization: { ...customization },
        image: imageDataUrl,
        price: getSizePrice(customization.size)
      }];
      
      setCartItems(items);
      setIsCheckoutModalOpen(true);
    } catch (error) {
      console.error("Error preparing checkout:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to prepare checkout. Please try again.",
      });
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  // Handle auth modal success
  React.useEffect(() => {
    if (isAuthenticated && pendingAction && !isAuthModalOpen) {
      if (pendingAction === "cart") {
        // Just add to cart, don't redirect
        addNotification({
          type: "success",
          title: "Added to Cart",
          message: "Your customized frame has been added to cart.",
        });
      } else if (pendingAction === "checkout") {
        setTimeout(() => setIsCheckoutModalOpen(true), 100);
      }
      setPendingAction(null);
    }
  }, [isAuthenticated, pendingAction, isAuthModalOpen]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + D to duplicate frame (add new frame)
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "d" &&
        uploadedImage
      ) {
        event.preventDefault();
        handleAddFrame();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [uploadedImage, handleAddFrame]);

  const [showTutorial, setShowTutorial] = React.useState(false);

  // Show tutorial on first image upload
  React.useEffect(() => {
    if (
      uploadedImage &&
      frameCollection.frames.length === 1 &&
      !localStorage.getItem("tutorialSeen")
    ) {
      setShowTutorial(true);
    }
  }, [uploadedImage, frameCollection.frames.length]);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("tutorialSeen", "true");
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
    //todo : dynamic data
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
        id: "temp-frame-" + Date.now(),
        name: "Custom Frame",
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
          setPendingAction("cart");
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
              ref={framePreviewRef}
              customization={customization}
              uploadedImage={uploadedImage}
              onImageClick={handleImageClick}
              frameCount={frameCollection.frames.length}
              currentFrameIndex={frameCollection.frames.findIndex(
                (f) => f.id === frameCollection.activeFrameId
              )}
            />
          )}
        </main>
        
        {/* Hidden file input for image change */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        
        {uploadedImage && (
          <Toolbar
            onToolClick={handleToolClick}
            onAddFrame={handleAddFrame}
            onAuthRequired={() => {
              setPendingAction("cart");
              setIsAuthModalOpen(true);
            }}
            hasImage={!!uploadedImage}
          />
        )}{" "}
        {/* Bottom Sheets */}
        <MaterialBottomSheet
          isOpen={activeModal === "material"}
          onClose={closeModal}
          currentMaterial={customization.material}
          onSelect={(material) => updateCustomization({ material })}
        />
        <FrameBottomSheet
          isOpen={activeModal === "frame"}
          onClose={closeModal}
          currentFrame={customization.frameColor}
          onSelect={(frameColor) => updateCustomization({ frameColor })}
        />
        <SizeBottomSheet
          isOpen={activeModal === "size"}
          onClose={closeModal}
          currentSize={customization.size}
          onSelect={(size) => updateCustomization({ size })}
        />
        {/* <EffectBottomSheet
          isOpen={activeModal === "effect"}
          onClose={closeModal}
          currentEffect={customization.effect}
          onSelect={(effect) => updateCustomization({ effect })}
        /> */}
        <BorderBottomSheet
          isOpen={activeModal === "border"}
          onClose={closeModal}
          currentBorder={customization.border}
          borderColor={customization.borderColor}
          borderWidth={customization.borderWidth}
          onToggle={(border) => updateCustomization({ border })}
          onBorderUpdate={handleBorderUpdate}
          uploadedImage={uploadedImage}
        />
        {uploadedImage && (
          <KonvaImageEditor
            isOpen={activeModal === "imageEditor"}
            onClose={closeModal}
            image={uploadedImage}
            customization={customization}
            onTransformUpdate={updateImageTransform}
            onImageReplace={handleImageReplace}
          />
        )}
        {/* Floating Add Button for mobile */}
        {/* TODO : implement multi frame upload in future */}
        {/* <FloatingAddButton
          onAddFrame={handleAddFrame}
          hasFrames={frameCollection.frames.length > 0}
          hasImage={!!uploadedImage}
          onAuthRequired={() => {
            setPendingAction("cart");
            setIsAuthModalOpen(true);
          }}
        />{" "} */}
        {/* Tutorial Tooltip */}
        <TutorialTooltip show={showTutorial} onClose={handleCloseTutorial} />
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
            cartItemImage={cartItems[0]?.image}
          />
        )}
      </ResponsiveLayout>
    </div>
  );
}

// Helper function to get size pricing
function getSizePrice(size: string) {
  const prices: Record<string, number> = {
    "8x8": 299,
    "8x10": 404,
    "10x8": 404,
    "9x12": 582,
    "12x9": 582,
    "12x12": 797,
    "12x18": 1218,
    "18x12": 1218,
    "18x18": 1900,
    "18x24": 2400,
    "24x18": 2400,
    "24x32": 4200,
    "32x24": 4200,
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
