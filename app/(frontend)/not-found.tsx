import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { FrameCustomization } from "@/types";
import { Frame as FrameIcon } from "lucide-react";


export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 py-16">
      <div className="flex items-center space-x-2 mb-8">
        <FrameIcon className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold text-foreground">
          <Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link>
        </span>
      </div>
     
      <h1 className="text-7xl font-bold mb-2 tracking-tight">404</h1>
      <p className="text-xl mb-6 text-center max-w-md">Oops! The page you’re looking for doesn’t exist.<br/>Let’s get you back home.</p>
      <Link href="/" passHref legacyBehavior>
        <Button asChild variant="default" size="lg" className="px-8 py-3 text-l cursor-pointer text-white">
          <span>Go to Home</span>
        </Button>
      </Link>
    </div>
  );
} 