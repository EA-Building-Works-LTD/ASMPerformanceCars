"use client"

import React from 'react'
import { Header } from '@/components/layout/Header'
import { Sheet } from '@/components/ui/sheet'
import { AnimatePresence } from 'framer-motion'

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Sheet>
      <AnimatePresence mode="wait">
        <div className="flex min-h-screen flex-col">
          <Header />
          {children}
        </div>
      </AnimatePresence>
    </Sheet>
  )
} 