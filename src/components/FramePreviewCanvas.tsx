"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Image as KonvaImage,
  Group,
  Line,
} from "react-konva";
import useImage from "use-image";
import { FrameCustomization, UploadedImage } from "../types";

// Helper functions from KonvaFrameRenderer
const getFrameColor = (color: string) => {
  switch (color) {
    case "white":
      return "#fff";
    case "brown":
      return "#a0522d";
    default:
      return "#111";
  }
};

const getFrameBorderColor = (color: string) => {
  switch (color) {
    case "white":
      return "#e5e7eb";
    case "brown":
      return "#8b5c2d";
    default:
      return "#1f2937";
  }
};

const getEffectFilter = (effect: string) => {
  switch (effect) {
    case "silver":
      return "grayscale(1) contrast(1.1)";
    case "noir":
      return "grayscale(1) contrast(1.5) brightness(0.9)";
    case "vivid":
      return "saturate(1.5) contrast(1.2)";
    case "dramatic":
      return "contrast(1.4) brightness(0.95) saturate(1.3)";
    default:
      return "none";
  }
};

// Utility to lighten or darken a hex color
function shadeColor(hex: string, percent: number): string {
  hex = hex.replace(/^#/, "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  r = Math.min(255, Math.max(0, Math.round(r + (percent / 100) * 255)));
  g = Math.min(255, Math.max(0, Math.round(g + (percent / 100) * 255)));
  b = Math.min(255, Math.max(0, Math.round(b + (percent / 100) * 255)));
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Helper for aspect ratio
const getAspectRatio = (size: string): number => {
  switch (size) {
    case "8x8":
    case "12x12":
    case "18x18":
      return 1;
    case "8x10":
      return 8 / 10;
    case "10x8":
      return 10 / 8;
    case "9x12":
      return 9 / 12;
    case "12x9":
      return 12 / 9;
    case "12x18":
      return 12 / 18;
    case "18x12":
      return 18 / 12;
    case "18x24":
      return 18 / 24;
    case "24x18":
      return 24 / 18;
    case "24x32":
      return 24 / 32;
    case "32x24":
      return 32 / 24;
    default:
      return 1;
  }
};

interface FramePreviewCanvasProps {
  customization: FrameCustomization;
  uploadedImage?: UploadedImage | null;
  backgroundImage?: string;
  wallColor?: string;
  onFrameDrag?: (pos: { x: number; y: number }) => void;
}

const FramePreviewCanvas: React.FC<FramePreviewCanvasProps> = ({
  customization,
  uploadedImage,
  backgroundImage = "/framedecor1.png",
  wallColor = "#f3f4f6",
  onFrameDrag,
}) => {
  const stageRef = useRef<any>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [framePosition, setFramePosition] = useState({ x: 200, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);

  // Load images
  const [backgroundImg] = useImage(backgroundImage, "anonymous");
  const [frameImg] = useImage(uploadedImage?.url || "", "anonymous");

  // Responsive stage size
  useEffect(() => {
    const updateStageSize = () => {
      const container = stageRef.current?.container()?.parentElement;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        // Ensure minimum size and handle mobile better
        const minWidth = 300;
        const minHeight = 400;
        setStageSize({
          width: Math.max(width || 800, minWidth),
          height: Math.max(height || 600, minHeight),
        });
      }
    };

    updateStageSize();
    window.addEventListener("resize", updateStageSize);
    return () => window.removeEventListener("resize", updateStageSize);
  }, []);

  // Frame size calculation - responsive scaling with better size differentiation
  const getFrameSize = () => {
    const [width, height] = customization.size.split("x").map(Number);

    // Base size calculation (inches to pixels)
    const pixelsPerInch = 72;
    //in preview frame size is 1/3 of actual frame size
    const baseFrameWidth = (width * pixelsPerInch) / 3;
    const baseFrameHeight = (height * pixelsPerInch) / 3;

    // Calculate responsive scale based on viewport size
    const viewportWidth = stageSize.width;
    const viewportHeight = stageSize.height;

    // Determine the maximum frame size that fits in the viewport
    // Use different percentages based on frame size to maintain differentiation
    let maxFrameWidth, maxFrameHeight;

    if (width <= 12 && height <= 12) {
      // Small frames (8x8, 8x10, 9x12, 12x12, etc.)
      maxFrameWidth = viewportWidth * 0.35; // 35% of viewport width
      maxFrameHeight = viewportHeight * 0.35; // 35% of viewport height
    } else if (width <= 18 && height <= 18) {
      // Medium frames (12x18, 18x12, 18x18, etc.)
      maxFrameWidth = viewportWidth * 0.45; // 45% of viewport width
      maxFrameHeight = viewportHeight * 0.45; // 45% of viewport height
    } else {
      // Large frames (18x24, 24x18, 24x32, 32x24, etc.)
      maxFrameWidth = viewportWidth * 0.55; // 55% of viewport width
      maxFrameHeight = viewportHeight * 0.55; // 55% of viewport height
    }

    // Calculate scale factors for both dimensions
    const scaleX = maxFrameWidth / baseFrameWidth;
    const scaleY = maxFrameHeight / baseFrameHeight;

    // Use the smaller scale to ensure frame fits in both dimensions
    const responsiveScale = Math.min(scaleX, scaleY, 0.6); // Cap at 60% to allow larger frames

    // Ensure minimum size for very small screens
    const minWidth = 120;
    const minHeight = 120;

    const finalWidth = Math.max(baseFrameWidth * responsiveScale, minWidth);
    const finalHeight = Math.max(baseFrameHeight * responsiveScale, minHeight);

    return {
      width: finalWidth,
      height: finalHeight,
    };
  };

  const frameSize = getFrameSize();

  // Recalculate frame size and position when stage size changes
  React.useEffect(() => {
    if (stageSize.width > 0 && stageSize.height > 0) {
      // Recalculate frame size based on new viewport
      const newFrameSize = getFrameSize();

      // Only update position if not dragged yet
      if (!hasBeenDragged) {
        const centerX = (stageSize.width - newFrameSize.width) / 2;
        const centerY = (stageSize.height - newFrameSize.height) / 2;
        setFramePosition({ x: centerX, y: centerY });
      }
    }
  }, [stageSize, hasBeenDragged]);

  // Frame style calculations (same as KonvaFrameRenderer)
  let frameBorder = 0;
  let frameColor = getFrameColor(customization.frameColor);
  let frameBorderColor = getFrameBorderColor(customization.frameColor);
  const bevelTop = shadeColor(frameBorderColor, 30);
  const bevelLeft = shadeColor(frameBorderColor, -30);
  const bevelRight = shadeColor(frameBorderColor, -15);
  const bevelBottom = shadeColor(frameBorderColor, 30);
  let shadow = {};

  if (customization.material === "classic") {
    frameBorder = 15;
    shadow = {
      shadowColor: "black",
      shadowBlur: 12,
      shadowOffset: { x: 2, y: 2 },
      shadowOpacity: 0.6,
    };
  } else if (customization.material === "frameless") {
    frameBorder = 0;
    shadow = {
      shadowColor: "black",
      shadowBlur: 8,
      shadowOffset: { x: 1, y: 1 },
      shadowOpacity: 0.3,
    };
  } else if (customization.material === "canvas") {
    frameBorder = 8;
    shadow = {
      shadowColor: "black",
      shadowBlur: 10,
      shadowOffset: { x: 2, y: 2 },
      shadowOpacity: 0.4,
    };
  }

  const matting =
    customization.material === "classic" ||
    customization.material === "frameless" ||
    customization.material === "canvas"
      ? 0
      : 10;
  const showCustomBorder =
    customization.border &&
    customization.borderWidth &&
    customization.borderColor;

  // Image transform
  const transform = uploadedImage?.transform || {
    scale: 1,
    rotation: 0,
    x: 0,
    y: 0,
  };

  // Calculate available area for image
  const availableWidth =
    customization.material === "frameless" ||
    customization.material === "canvas"
      ? frameSize.width -
        2 * (showCustomBorder ? customization.borderWidth! : 0) -
        2 * (customization.material === "canvas" ? frameBorder : 0)
      : frameSize.width -
        2 *
          (frameBorder +
            matting +
            (showCustomBorder ? customization.borderWidth! : 0));
  const availableHeight =
    customization.material === "frameless" ||
    customization.material === "canvas"
      ? frameSize.height -
        2 * (showCustomBorder ? customization.borderWidth! : 0) -
        2 * (customization.material === "canvas" ? frameBorder : 0)
      : frameSize.height -
        2 *
          (frameBorder +
            matting +
            (showCustomBorder ? customization.borderWidth! : 0));

  // Get natural image size
  const naturalWidth = frameImg?.width || 1;
  const naturalHeight = frameImg?.height || 1;
  const imageAspect = naturalWidth / naturalHeight;
  const areaAspect = availableWidth / availableHeight;

  let displayWidth = availableWidth;
  let displayHeight = availableHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (frameImg) {
    if (
      customization.material === "frameless" ||
      customization.material === "canvas"
    ) {
      if (imageAspect > areaAspect) {
        displayHeight = availableHeight;
        displayWidth = availableHeight * imageAspect;
        offsetX = (availableWidth - displayWidth) / 2;
      } else {
        displayWidth = availableWidth;
        displayHeight = availableWidth / imageAspect;
        offsetY = (availableHeight - displayHeight) / 2;
      }
    } else {
      if (imageAspect > areaAspect) {
        displayWidth = availableWidth;
        displayHeight = availableWidth / imageAspect;
        offsetY = (availableHeight - displayHeight) / 2;
      } else {
        displayHeight = availableHeight;
        displayWidth = availableHeight * imageAspect;
        offsetX = (availableWidth - displayWidth) / 2;
      }
    }
  }

  // Handle frame drag
  const handleFrameDragStart = () => {
    setIsDragging(true);
  };

  const handleFrameDragEnd = (e: any) => {
    const newPos = e.target.position();
    setFramePosition(newPos);
    setIsDragging(false);
    setHasBeenDragged(true); // Mark that frame has been manually positioned
    if (onFrameDrag) {
      onFrameDrag(newPos);
    }
  };

  return (
    <div className="w-full h-full min-h-[60vh] relative">
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        style={{
          background: wallColor,
          borderRadius: "8px",
          overflow: "hidden",
          border: "2px solid black",
          // padding:'10px'
        }}
      >
        <Layer>
          {/* Background Image */}
          {backgroundImg && (
            <KonvaImage
              image={backgroundImg}
              x={0}
              y={0}
              width={stageSize.width}
              height={stageSize.height}
              listening={false}
            />
          )}

          {/* Frame Group - Draggable */}
          <Group
            x={framePosition.x}
            y={framePosition.y}
            draggable={true}
            onDragStart={handleFrameDragStart}
            onDragEnd={handleFrameDragEnd}
            opacity={isDragging ? 0.8 : 1}
            scaleX={isDragging ? 1.05 : 1}
            scaleY={isDragging ? 1.05 : 1}
          >
            {/* Frame rendering (same as KonvaFrameRenderer) */}
            {customization.material === "classic" ? (
              // Draw 3D beveled classic frame using polygons
              <>
                {/* Main background */}
                <Rect
                  x={0}
                  y={0}
                  width={frameSize.width}
                  height={frameSize.height}
                  fill={customization.borderColor ?? "#fff"}
                  cornerRadius={6}
                  {...shadow}
                />
                {/* Top bevel (trapezoid) */}
                <Line
                  points={[
                    0,
                    0,
                    frameSize.width,
                    0,
                    frameSize.width - frameBorder,
                    frameBorder,
                    frameBorder,
                    frameBorder,
                  ]}
                  closed
                  fill={bevelLeft}
                  listening={false}
                />
                {/* Left bevel (trapezoid) */}
                <Line
                  points={[
                    0,
                    0,
                    frameBorder,
                    frameBorder,
                    frameBorder,
                    frameSize.height - frameBorder,
                    0,
                    frameSize.height,
                  ]}
                  closed
                  fill={bevelLeft}
                  listening={false}
                />
                {/* Right bevel (trapezoid) */}
                <Line
                  points={[
                    frameSize.width,
                    0,
                    frameSize.width,
                    frameSize.height,
                    frameSize.width - frameBorder,
                    frameSize.height - frameBorder,
                    frameSize.width - frameBorder,
                    frameBorder,
                  ]}
                  closed
                  fill={bevelRight}
                  listening={false}
                />
                {/* Bottom bevel (trapezoid) */}
                <Line
                  points={[
                    frameBorder,
                    frameSize.height - frameBorder,
                    frameSize.width - frameBorder,
                    frameSize.height - frameBorder,
                    frameSize.width,
                    frameSize.height,
                    0,
                    frameSize.height,
                  ]}
                  closed
                  fill={bevelLeft}
                  listening={false}
                />
                {/* Bottom left triangle */}
                <Line
                  points={[
                    0,
                    frameSize.height,
                    frameBorder,
                    frameSize.height - frameBorder,
                    0,
                    frameSize.height - frameBorder,
                  ]}
                  closed
                  fill={bevelLeft}
                  listening={false}
                />
                {/* Bottom right triangle */}
                <Line
                  points={[
                    frameSize.width,
                    frameSize.height,
                    frameSize.width,
                    frameSize.height - frameBorder,
                    frameSize.width - frameBorder,
                    frameSize.height - frameBorder,
                  ]}
                  closed
                  fill={bevelRight}
                  listening={false}
                />
              </>
            ) : customization.material === "frameless" ? (
              // Border rectangle illusion for frameless
              <Rect
                x={0}
                y={0}
                width={frameSize.width}
                height={frameSize.height}
                fill={customization.borderColor ?? "#fff"}
                stroke={getFrameBorderColor(customization.frameColor)}
                strokeWidth={showCustomBorder ? customization.borderWidth! : 2}
                cornerRadius={6}
                {...shadow}
              />
            ) : (
              // Other frame types
              <Rect
                x={0}
                y={0}
                width={frameSize.width}
                height={frameSize.height}
                fill={frameColor}
                stroke={frameBorderColor}
                strokeWidth={frameBorder}
                cornerRadius={6}
                {...shadow}
              />
            )}

            {/* Matting/inner border - only for non-classic */}
            {customization.material !== "classic" && (
              <Rect
                x={frameBorder}
                y={frameBorder}
                width={frameSize.width - 2 * frameBorder}
                height={frameSize.height - 2 * frameBorder}
                fill={customization.borderColor ?? "#fff"}
                cornerRadius={4}
                shadowColor={"#000"}
                shadowBlur={2}
                shadowOpacity={0.08}
              />
            )}

            {/* Image group (for transform) */}
            <Group
              x={
                customization.material === "frameless"
                  ? showCustomBorder
                    ? customization.borderWidth!
                    : 0
                  : customization.material === "canvas"
                  ? frameBorder +
                    (showCustomBorder ? customization.borderWidth! : 0)
                  : frameBorder +
                    matting +
                    (showCustomBorder ? customization.borderWidth! : 0)
              }
              y={
                customization.material === "frameless"
                  ? showCustomBorder
                    ? customization.borderWidth!
                    : 0
                  : customization.material === "canvas"
                  ? frameBorder +
                    (showCustomBorder ? customization.borderWidth! : 0)
                  : frameBorder +
                    matting +
                    (showCustomBorder ? customization.borderWidth! : 0)
              }
              width={availableWidth}
              height={availableHeight}
              clipFunc={(ctx) => {
                ctx.beginPath();
                if (customization.material === "frameless") {
                  ctx.rect(0, 0, availableWidth, availableHeight);
                } else {
                  ctx.rect(0, 0, availableWidth, availableHeight);
                }
                ctx.closePath();
              }}
            >
              {/* Image */}
              {frameImg && (
                <KonvaImage
                  image={frameImg}
                  width={displayWidth}
                  height={displayHeight}
                  x={offsetX + (transform.x || 0)}
                  y={offsetY + (transform.y || 0)}
                  scaleX={transform.scale}
                  scaleY={transform.scale}
                  rotation={transform.rotation}
                  filters={[]}
                  style={{ filter: getEffectFilter(customization.effect) }}
                  listening={false}
                  perfectDrawEnabled={false}
                />
              )}
            </Group>
          </Group>
        </Layer>
      </Stage>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Click and drag the frame to place it anywhere on the wall</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>
            Select your preferred image or color from the <b>Background </b>menu
            in the left panel.
          </span>
        </div>
      </div>
    </div>
  );
};

export default FramePreviewCanvas;
