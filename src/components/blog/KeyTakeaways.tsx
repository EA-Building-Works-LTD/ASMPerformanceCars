'use client'

import React, { useState } from 'react'
import { Lightbulb, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'

interface KeyTakeawaysProps {
  takeaways: { point: string }[]
}

const KeyTakeaways = ({ takeaways }: KeyTakeawaysProps) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!takeaways || takeaways.length === 0) return null
  
  return (
    <div className="max-w-3xl mx-auto my-12 bg-gradient-to-br from-red-50 to-white dark:from-red-950/30 dark:to-zinc-900 rounded-xl shadow-lg border border-red-100 dark:border-red-900/30 overflow-hidden transition-all duration-300">
      {/* Header - Always visible and clickable */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-red-600" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Key Takeaways</h3>
        </div>
        <div className="text-red-600">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 transform transition-transform duration-200" />
          ) : (
            <ChevronDown className="h-5 w-5 transform transition-transform duration-200" />
          )}
        </div>
      </button>
      
      {/* Content - Conditionally rendered based on isOpen state */}
      {isOpen && (
        <div className="space-y-3 px-6 pb-6 animate-slideDown">
          {takeaways.map((item, index) => (
            <div 
              key={index}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="h-5 w-5 mt-0.5 text-red-600 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-200">{item.point}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default KeyTakeaways 