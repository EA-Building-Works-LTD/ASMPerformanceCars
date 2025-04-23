'use client'

import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableTextComponents'

interface PortableTextWrapperProps {
  value: any
}

export default function PortableTextWrapper({ value }: PortableTextWrapperProps) {
  return (
    <PortableText
      value={value}
      components={portableTextComponents}
    />
  )
} 