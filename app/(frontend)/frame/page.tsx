"use client";
import React from "react";
import Header from "@/components/Header";
import PhotoUpload from "@/components/PhotoUpload";
import FramePreview from "@/components/FramePreview";
import Toolbar from "@/components/Toolbar";
import ImageEditor from "@/components/ImageEditor";
import MaterialBottomSheet from "@/components/MaterialBottomSheet";
import FrameBottomSheet from "@/components/FrameBottomSheet";
import SizeBottomSheet from "@/components/SizeBottomSheet";
import EffectBottomSheet from "@/components/EffectBottomSheet";
import BorderBottomSheet from "@/components/BorderBottomSheet";
import BackgroundBottomSheet from "@/components/BackgroundBottomSheet";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import FloatingAddButton from "@/components/FloatingAddButton";
import TutorialTooltip from "@/components/TutorialTooltip";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import AuthModal from "@/components/auth/AuthModal";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import PreviewModeToggle from "@/components/PreviewModeToggle";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import {
  NotificationProvider,
  useNotifications,
} from "@/contexts/NotificationContext";
import { useFrameCustomizer } from "@/hooks/useFrameCustomizer";
import { downloadFramedImage } from "@/utils/downloadImage";
import { FrameCustomization } from "@/types";
import HangBottomSheet from "@/components/HangBottomSheet";

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

  // State for checkout and auth modals
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<
    "cart" | "checkout" | null
  >(null);
  // State for loading overlay
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState("Processing your image...");
  
  // State for background image
  const [backgroundImage, setBackgroundImage] = React.useState("/framedecor1.png");
  const [wallColor, setWallColor] = React.useState("#f3f4f6");
  
  // State for toolbar more button (mobile only)
  const [isMoreOpen, setIsMoreOpen] = React.useState(false);
  
  // State for preview mode toggle
  const [previewMode, setPreviewMode] = React.useState<'edit' | 'preview'>('edit');
  
  // Update active frame when customization or image changes
  React.useEffect(() => {
    if (frameCollection.activeFrameId && uploadedImage) {
      updateActiveFrame();
    }
  }, [
    customization,
    uploadedImage,
    uploadedImage?.transform, // Add transform as dependency to ensure re-render
    frameCollection.activeFrameId,
    updateActiveFrame,
  ]);

  const handleToolClick = (tool: string) => {
    openModal(tool);
  };

  const handleImageClick = () => {
    if (uploadedImage) {
      openModal("imageEditor");
    }
  };

  const handleDownload = async () => {
    if (uploadedImage) {
      await downloadFramedImage(uploadedImage, customization);
      closeModal();
    }
  };

  const handleBorderUpdate = (updates: {
    borderColor?: string;
    borderWidth?: number;
  }) => {
    updateCustomization(updates);
  };

  const handleBackgroundUpdate = (newBackgroundImage: string) => {
    setBackgroundImage(newBackgroundImage);
  };

  const handleWallColorUpdate = (newWallColor: string) => {
    setWallColor(newWallColor);
  };
  
  const handleFrameDrag = (pos: { x: number; y: number }) => {
    // You can store this position in state if needed
  };
  
  const handleAddFrame = React.useCallback(() => {
    if (uploadedImage) {
      addFrameToCollection();
    }
  }, [uploadedImage, addFrameToCollection]);

  const handleImageUpload = async (file: File) => {
    // Show loading overlay for first-time upload
    setLoadingMessage("Processing your image and preparing frame customization tools...");
    setIsLoading(true);
    
    try {
      // Store uploaded image in Redux immediately
      await setImage(file);
      // Frame addition will be handled by useEffect below
      
      // Add a small delay to show the loading animation
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsLoading(false);
    }
  };
  // Add first frame to Redux when image is uploaded and no frames exist
  React.useEffect(() => {
    if (uploadedImage && frameCollection.frames.length === 0) {
      addFrameToCollection();
    }
  }, [uploadedImage, frameCollection.frames.length, addFrameToCollection]);

  const handleFrameImageUpload = async (frameId: string, file: File) => {
    setLoadingMessage("Updating frame image...");
    setIsLoading(true);
    try {
      await handleImageChange(frameId, file);
      // Add a small delay to show the loading animation
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error uploading frame image:', error);
      setIsLoading(false);
    }
  };

  const handleImageReplace = async (file: File) => {
    setLoadingMessage("Replacing your image...");
    setIsLoading(true);
    try {
      await replaceImage(file);
      // Add a small delay to show the loading animation
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error replacing image:', error);
      setIsLoading(false);
    }
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
    console.log("Adding to cart:", { customization, uploadedImage });
    addNotification({
      type: "success",
      title: "Added to Cart",
      message: "Your customized frame has been added to cart.",
    });
  };

  const handleCheckout = () => {
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

    setIsCheckoutModalOpen(true);
  };

  // Handle auth modal success
  React.useEffect(() => {
    if (isAuthenticated && pendingAction && !isAuthModalOpen) {
      if (pendingAction === "cart") {
        // Just add to cart, don't redirect
        console.log("Adding to cart after authentication:", {
          customization,
          uploadedImage,
        });
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
  // React.useEffect(() => {
  //   if(!document) return;
  //   const handleKeyPress = (event: KeyboardEvent) => {
  //     // Ctrl/Cmd + D to duplicate frame (add new frame)
  //     if (
  //       (event.ctrlKey || event.metaKey) &&
  //       event.key === "d" &&
  //       uploadedImage
  //     ) {
  //       event.preventDefault();
  //       handleAddFrame();
  //     }
  //   };
  //   document.addEventListener("keydown", handleKeyPress);
  //   return () => document.removeEventListener("keydown", handleKeyPress);
  // }, [uploadedImage, handleAddFrame]);

  const [showTutorial, setShowTutorial] = React.useState(false);

  // Show tutorial on first image upload
  React.useEffect(() => {
    if (
      uploadedImage &&
      frameCollection.frames.length === 1 &&
      typeof window !== "undefined" && !localStorage.getItem("tutorialSeen")
    ) {
      setShowTutorial(true);
    }
  }, [uploadedImage, frameCollection.frames.length]);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("tutorialSeen", "true");
    }
  };

  // Calculate cart total including temporary frame
  const calculateCartTotal = React.useMemo(() => {
    let total = 0;

    // Add price from actual frames
    total += frameCollection.frames.reduce((sum: number, frame: any) => {
      return sum + getSizePrice(frame.customization.size);
    }, 0);

    // Add price from temporary frame (uploaded image with no frames)
    if (frameCollection.frames.length === 0 && uploadedImage) {
      total += getSizePrice(customization.size);
    }

    return total;
  }, [frameCollection.frames, uploadedImage, customization.size]);

  // Unique id for temporary frame (persisted for session)
  const [tempFrameId] = React.useState(() => {
    if (typeof window !== "undefined" && window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    return "temp-frame-" + Date.now();
  });

  // Generate checkout items including temporary frame
  const generateCheckoutItems = React.useMemo(() => {
    const items = [];

    // Add actual frames
    frameCollection.frames.forEach((frame: any, index: number) => {
      items.push({
        id: frame.id,
        name: `Custom Frame ${index + 1}`,
        price: getSizePrice(frame.customization.size),
        customization: frame.customization,
        image: frame.image.url,
        quantity:1
      });
    });

    // Add temporary frame if no actual frames exist
    if (frameCollection.frames.length === 0 && uploadedImage) {
      items.push({
        id: tempFrameId,
        name: "Custom Frame",
        price: getSizePrice(customization.size),
        customization,
        image: uploadedImage.url,
        quantity:1
      });
    }

    return items;
  }, [frameCollection.frames, uploadedImage, customization, tempFrameId]);

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
            <>
              <div className="px-4 sm:px-0">
                <PreviewModeToggle
                  mode={previewMode}
                  onModeChange={setPreviewMode}
                />
              </div>
              <FramePreview
                customization={customization}
                uploadedImage={uploadedImage}
                onImageClick={handleImageClick}
                frameCount={frameCollection.frames.length}
                currentFrameIndex={frameCollection.frames.findIndex(
                  (f: any) => f.id === frameCollection.activeFrameId
                )}
                backgroundImage={backgroundImage}
                wallColor={wallColor}
                mode={previewMode}
                onFrameDrag={handleFrameDrag}
              />
            </>
          )}
        </main>
        {uploadedImage && (
          <Toolbar
            onToolClick={handleToolClick}
            onAddFrame={handleAddFrame}
            onAuthRequired={() => {
              setPendingAction("cart");
              setIsAuthModalOpen(true);
            }}
            hasImage={!!uploadedImage}
            onMoreToggle={setIsMoreOpen}
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
          onSelect={(size) => updateCustomization({ size: size as FrameCustomization["size"] })}
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
        <BackgroundBottomSheet
          isOpen={activeModal === "background"}
          onClose={closeModal}
          currentBackground={backgroundImage}
          onBackgroundUpdate={handleBackgroundUpdate}
        />
        <HangBottomSheet
          isOpen={activeModal === "hang"}
          onClose={closeModal}
          currentHangType={customization.hangType}
          onSelect={(hangType) => updateCustomization({ hangType })}
        />
        <BackgroundBottomSheet
          isOpen={activeModal === "background"}
          onClose={closeModal}
          currentBackground={backgroundImage}
          onBackgroundUpdate={handleBackgroundUpdate}
          currentWallColor={wallColor}
          onWallColorUpdate={handleWallColorUpdate}
        />
        {uploadedImage && (
          <ImageEditor
            isOpen={activeModal === "imageEditor"}
            onClose={closeModal}
            image={uploadedImage}
            customization={customization}
            onTransformUpdate={updateImageTransform}
            onDownload={handleDownload}
            onImageReplace={handleImageReplace}
          />
        )}
        {/* Floating Add Button for mobile */}
       {activeModal !== "imageEditor" &&
        <FloatingAddButton
          onAddFrame={handleAddFrame}
          hasFrames={frameCollection.frames.length > 0}
          hasImage={!!uploadedImage}
          onAuthRequired={() => {
            setPendingAction("cart");
            setIsAuthModalOpen(true);
          }}
          isMoreOpen={isMoreOpen}
          isImageEditorOpen={activeModal === "imageEditor"}
        />}
        {/* Loading Overlay */}
        <LoadingOverlay 
          isVisible={isLoading} 
          message={loadingMessage} 
        />
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
