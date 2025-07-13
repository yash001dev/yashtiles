"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Frame } from 'lucide-react'
import Link from 'next/link'


function FrameItHeader({hideMenu=false}) {

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-14">
    <div className="section-container section-padding">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
          <Frame className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">
            <Link href="/">
            FrameIt
            </Link>
          </span>
        </div>
      {!hideMenu &&  <div className="hidden md:flex items-center space-x-8">
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
          >
            FAQ
          </a>
        
          <Link href="/app">
            <Button>Start Framing</Button>
          </Link>
        </div>}
      </div>
    </div>
  </nav>
  )
}

export default FrameItHeader