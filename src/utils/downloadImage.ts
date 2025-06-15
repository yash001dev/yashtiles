import { FrameCustomization, UploadedImage } from '../types';

export const downloadFramedImage = async (
  image: UploadedImage,
  customization: FrameCustomization
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;

  // Set canvas size based on frame size with higher resolution
  const sizeMap: Record<string, { width: number; height: number }> = {
    '8x8': { width: 800, height: 800 },
    '8x10': { width: 800, height: 1000 },
    '10x8': { width: 1000, height: 800 },
    '9x12': { width: 900, height: 1200 },
    '12x9': { width: 1200, height: 900 },
    '12x12': { width: 1200, height: 1200 },
    '12x18': { width: 1200, height: 1800 },
    '18x12': { width: 1800, height: 1200 },
    '18x18': { width: 1800, height: 1800 },
    '18x24': { width: 1800, height: 2400 },
    '24x18': { width: 2400, height: 1800 },
    '24x32': { width: 2400, height: 3200 },
    '32x24': { width: 3200, height: 2400 },
  };

  const { width, height } = sizeMap[customization.size] || { width: 800, height: 800 };
  canvas.width = width;
  canvas.height = height;

  // Create image element
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  return new Promise<void>((resolve) => {
    img.onload = () => {
      // Clear canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);

      // Apply frame background for classic material
      if (customization.material === 'classic') {
        const frameWidth = width * 0.1; // 10% frame width
        
        // Set frame color
        switch (customization.frameColor) {
          case 'white':
            ctx.fillStyle = '#ffffff';
            break;
          case 'oak':
            ctx.fillStyle = '#fef3c7';
            break;
          default:
            ctx.fillStyle = '#1f2937';
        }
        
        ctx.fillRect(0, 0, width, height);
        
        // Create inner area for image
        ctx.fillStyle = 'white';
        ctx.fillRect(frameWidth, frameWidth, width - frameWidth * 2, height - frameWidth * 2);
      }

      // Save context for transformations
      ctx.save();

      // Calculate image area
      const imageArea = customization.material === 'classic' 
        ? { 
            x: width * 0.1, 
            y: height * 0.1, 
            width: width * 0.8, 
            height: height * 0.8 
          }
        : { x: 0, y: 0, width, height };

      // Move to center of image area
      ctx.translate(
        imageArea.x + imageArea.width / 2, 
        imageArea.y + imageArea.height / 2
      );

      // Apply transformations
      ctx.scale(image.transform.scale, image.transform.scale);
      ctx.rotate((image.transform.rotation * Math.PI) / 180);
      ctx.translate(image.transform.x, image.transform.y);

      // Apply effects
      switch (customization.effect) {
        case 'silver':
          ctx.filter = 'grayscale(100%) contrast(110%)';
          break;
        case 'noir':
          ctx.filter = 'grayscale(100%) contrast(150%) brightness(90%)';
          break;
        case 'vivid':
          ctx.filter = 'saturate(150%) contrast(120%)';
          break;
        case 'dramatic':
          ctx.filter = 'contrast(140%) brightness(95%) saturate(130%)';
          break;
        default:
          ctx.filter = 'none';
      }

      // Draw image centered
      const aspectRatio = img.width / img.height;
      const areaAspectRatio = imageArea.width / imageArea.height;
      
      let drawWidth, drawHeight;
      if (aspectRatio > areaAspectRatio) {
        drawWidth = imageArea.width;
        drawHeight = imageArea.width / aspectRatio;
      } else {
        drawHeight = imageArea.height;
        drawWidth = imageArea.height * aspectRatio;
      }

      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      // Restore context
      ctx.restore();

      // Add custom border if enabled
      if (customization.border) {
        ctx.strokeStyle = customization.borderColor || '#000000';
        ctx.lineWidth = (customization.borderWidth || 2) * (width / 400); // Scale border width
        
        if (customization.material === 'classic') {
          const frameWidth = width * 0.1;
          ctx.strokeRect(frameWidth, frameWidth, width - frameWidth * 2, height - frameWidth * 2);
        } else {
          ctx.strokeRect(0, 0, width, height);
        }
      }

      // Download the image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `yashtiles-frame-${customization.size}-${customization.material}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        resolve();
      }, 'image/png');
    };

    img.src = image.url;
  });
};