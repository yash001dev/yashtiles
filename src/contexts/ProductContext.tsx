"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProductContextType {
  selectedSize: string;
  selectedColor: string;
  selectedMaterial: string;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: string) => void;
  setSelectedMaterial: (material: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");

  return (
    <ProductContext.Provider
      value={{
        selectedSize,
        selectedColor,
        selectedMaterial,
        setSelectedSize,
        setSelectedColor,
        setSelectedMaterial,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}
