'use client'

import React, { useState, ReactNode } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface FaqItemProps {
  question: string
  answer: string | ReactNode
}

export const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button 
        className="flex items-center justify-between w-full p-4 text-left bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-semibold">{question}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-200 dark:border-gray-700">
          {typeof answer === 'string' ? (
            <p className="text-gray-700 dark:text-gray-300">{answer}</p>
          ) : (
            answer
          )}
        </div>
      )}
    </div>
  )
} 