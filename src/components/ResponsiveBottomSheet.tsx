import React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import DesktopPopover from './DesktopPopover';

interface ResponsiveBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ResponsiveBottomSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ResponsiveBottomSheetProps) {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)'); // lg breakpoint

  if (isLargeScreen) {
    return (
      <DesktopPopover
        isOpen={isOpen}
        onClose={onClose}
        title={title}
      >
        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}
        {children}
      </DesktopPopover>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0 px-4 py-4">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}