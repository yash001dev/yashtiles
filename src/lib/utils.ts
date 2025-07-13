import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Frame dimension utilities
export const getFrameEdgeWidth = (size: string): number => {
  const sizeMap: Record<string, number> = {
    '8x8': 15,
    '8x10': 18,
    '10x8': 18,
    '9x12': 20,
    '12x9': 20,
    '12x12': 22,
    '12x18': 25,
    '18x12': 25,
    '18x18': 28,
    '18x24': 30,
    '24x18': 30,
    '24x32': 35,
    '32x24': 35,
  };
  return sizeMap[size] || 15;
};

export const getFrameCSSVariables = (size: string) => {
  const edgeWidth = getFrameEdgeWidth(size);
  return {
    '--frame-edge-width': `${edgeWidth}px`,
    '--frame-edge-width-expanded': `calc(var(--frame-edge-width) * 1.3)`,
    '--frame-edge-width-compact': `calc(var(--frame-edge-width) * 0.8)`,
    '--frame-padding': `calc(var(--frame-edge-width) * 0.5)`,
    '--frame-shadow-offset': `calc(var(--frame-edge-width) * 0.1)`,
  } as React.CSSProperties;
};

// Function to set CSS custom properties on a DOM element
export const setFrameCSSVariables = (element: HTMLElement, size: string) => {
  const edgeWidth = getFrameEdgeWidth(size);
  element.style.setProperty('--frame-edge-width', `${edgeWidth}px`);
  element.style.setProperty('--frame-edge-width-expanded', `calc(var(--frame-edge-width) * 1.3)`);
  element.style.setProperty('--frame-edge-width-compact', `calc(var(--frame-edge-width) * 0.8)`);
  element.style.setProperty('--frame-padding', `calc(var(--frame-edge-width) * 0.5)`);
  element.style.setProperty('--frame-shadow-offset', `calc(var(--frame-edge-width) * 0.1)`);
};

// Function to get CSS custom property value
export const getCSSVariable = (element: HTMLElement, variableName: string): string => {
  return getComputedStyle(element).getPropertyValue(variableName);
};
