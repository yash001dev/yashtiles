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
      <Dialog open={isOpen} onOpenChange={onClose}>        <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="flex-shrink-0 px-6 py-4">
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {children}
          </div>
        </DialogContent></Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>      <DrawerContent className="max-h-[80vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0 px-4 py-4">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
