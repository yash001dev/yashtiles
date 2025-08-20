"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Frame, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { trackCartButtonClick, trackFaqClick } from "@/lib/analytics"
import { Drawer, DrawerContent, DrawerHeader, DrawerClose } from '@/components/ui/drawer'
import { usePathname } from 'next/navigation'


function FrameItHeader({hideMenu=false}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Helper for smooth scroll and close drawer
  const handleMobileMenuClick = (selector: string) => {
    setOpen(false);
    setTimeout(() => {
      const el = document.querySelector(selector);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 200); // Wait for drawer to close
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-14">
      <div className="section-container section-padding">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Frame className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              <Link href="/">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </Link>
            </span>
          </div>
          {/* Desktop Menu */}
          {!hideMenu && (
            <div className="hidden md:flex items-center space-x-8">
              {!isHome && (
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              )}
              {isHome && (
                <>
                  <Link
                    href="#work"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Our Work
                  </Link>
                  <a
                    href="#features"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#faq"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => trackFaqClick('header-faq', 'FAQ Section from Header')}
                  >
                    FAQ
                  </a>
                </>
              )}
              <Link
                href="/installation"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Installation Guide
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
              <Link href="/frame">
                <Button>Start Framing</Button>
              </Link>
            </div>
          )}
          {/* Mobile Menu Trigger */}
          {!hideMenu && (
            <div className="md:hidden flex items-center">
              <button
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <Menu className="h-7 w-7 text-foreground" />
              </button>
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="pb-8">
                  <DrawerHeader className="flex flex-row items-center justify-between border-b">
                    <span className="text-lg font-bold text-foreground">Menu</span>
                    <DrawerClose asChild>
                      <button
                        aria-label="Close menu"
                        className="p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </DrawerClose>
                  </DrawerHeader>
                  <div className="flex flex-col gap-4 mt-4 px-4">
                    {!isHome && (
                      <Link href="/" onClick={() => setOpen(false)}>
                        <span className="block text-left text-muted-foreground hover:text-foreground text-lg transition-colors py-2">Home</span>
                      </Link>
                    )}
                    {isHome && (
                      <>
                        <button
                          className="text-left text-muted-foreground hover:text-foreground text-lg transition-colors"
                          onClick={() => handleMobileMenuClick('#work')}
                        >
                          Our Work
                        </button>
                        <button
                          className="text-left text-muted-foreground hover:text-foreground text-lg transition-colors"
                          onClick={() => handleMobileMenuClick('#features')}
                        >
                          Features
                        </button>
                        <button
                          className="text-left text-muted-foreground hover:text-foreground text-lg transition-colors"
                          onClick={() => {
                            trackFaqClick('mobile-faq', 'FAQ Section from Mobile Menu');
                            handleMobileMenuClick('#faq');
                          }}
                        >
                          FAQ
                        </button>
                      </>
                    )}
                    <Link href="/installation" onClick={() => setOpen(false)}>
                      <span className="block text-left text-muted-foreground hover:text-foreground text-lg transition-colors py-2">Installation Guide</span>
                    </Link>
                    <Link href="/contact" onClick={() => setOpen(false)}>
                      <span className="block text-left text-muted-foreground hover:text-foreground text-lg transition-colors py-2">Contact</span>
                    </Link>
                    <Link href="/frame" onClick={() => setOpen(false)}>
                      <Button className="w-full mt-2">Start Framing</Button>
                    </Link>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default FrameItHeader