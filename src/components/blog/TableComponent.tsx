'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TableComponentProps {
  value: {
    rows?: {
      cells?: string[]
    }[]
    hasHeaderRow?: boolean
    caption?: string
  }
}

export default function TableComponent({ value }: TableComponentProps) {
  const { rows = [], hasHeaderRow = true, caption } = value
  
  // Skip rendering if no rows
  if (!rows.length) return null
  
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse rounded overflow-hidden shadow-sm dark:shadow-gray-800">
        {caption && (
          <caption className="p-2 text-sm text-gray-600 dark:text-gray-400 text-center">
            {caption}
          </caption>
        )}
        
        {rows.length > 0 && (
          <>
            {hasHeaderRow && (
              <thead className="bg-gray-100 dark:bg-zinc-800">
                <tr>
                  {rows[0].cells?.map((cell, cellIndex) => (
                    <th 
                      key={cellIndex}
                      className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-800 dark:text-gray-200"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            
            <tbody className="bg-white dark:bg-zinc-900">
              {rows.map((row, rowIndex) => {
                // Skip the header row if hasHeaderRow is true
                if (hasHeaderRow && rowIndex === 0) return null
                
                return (
                  <tr 
                    key={rowIndex}
                    className={cn(
                      "hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors",
                      rowIndex % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-gray-50 dark:bg-zinc-800/30"
                    )}
                  >
                    {row.cells?.map((cell, cellIndex) => (
                      <td 
                        key={cellIndex}
                        className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-300"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </>
        )}
      </table>
    </div>
  )
} 