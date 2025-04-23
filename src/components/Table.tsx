import React from 'react'

type Cell = string

type Row = {
  _type: 'row'
  cells: Cell[]
}

type TableProps = {
  value: {
    rows: Row[]
    hasHeaderRow: boolean
    caption?: string
  }
}

export default function Table({ value }: TableProps) {
  const { rows, hasHeaderRow, caption } = value
  
  if (!rows || rows.length === 0) {
    return null
  }

  return (
    <figure className="my-8">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {hasHeaderRow && rows.length > 0 && (
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {rows[0].cells.map((cell, cellIndex) => (
                  <th 
                    key={cellIndex}
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {rows.slice(hasHeaderRow ? 1 : 0).map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                {row.cells.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-400"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
} 