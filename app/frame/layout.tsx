import { Providers } from '@/components/providers/Providers'
import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'

function layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Providers>
        {children}
        <Toaster />
        <Sonner />
      </Providers>
    </>
  )
}

export default layout