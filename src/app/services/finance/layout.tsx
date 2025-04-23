import React from 'react'
import type { Metadata } from 'next'
import { ClientLayout } from '@/components/layout/ClientLayout'

export const metadata: Metadata = {
  title: 'Car Finance | ASM Performance Cars',
  description: 'Flexible finance options for your next car. Find the perfect finance package for your dream vehicle.',
}

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
} 