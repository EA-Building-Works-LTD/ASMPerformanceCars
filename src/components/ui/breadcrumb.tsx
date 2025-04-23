import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  href: string
  label: string
  isCurrent?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Responsive breadcrumb navigation
 * On mobile, only shows current page and parent
 * On desktop, shows full path
 */
export const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  // Filter out any items with undefined href
  const validItems = items.filter(item => typeof item.href === 'string' && item.href.length > 0);
  
  // Ensure we have at least one valid item (home)
  if (validItems.length === 0) {
    validItems.push({
      href: '/',
      label: 'Home',
    });
  }
  
  const lastIndex = validItems.length - 1;

  // Mobile version (compact)
  return (
    <nav aria-label="Breadcrumb" className={`pt-2 pb-4 sm:py-4 ${className}`}>
      <ol className="flex sm:hidden flex-wrap items-center gap-2 text-sm text-gray-600">
        <li>
          <Link
            href={validItems[0].href}
            className="text-gray-600 hover:text-red-600 transition-colors"
            aria-label="Home"
          >
            Home
          </Link>
        </li>
        
        {validItems.length > 2 && (
          <>
            <li aria-hidden="true">
              <ChevronRight className="flex-shrink-0 h-3.5 w-3.5 text-gray-500" />
            </li>
            {validItems.length > 3 && (
              <li>
                <span className="text-gray-500 px-1">...</span>
              </li>
            )}
            {validItems.length > 3 && (
              <li aria-hidden="true">
                <ChevronRight className="flex-shrink-0 h-3.5 w-3.5 text-gray-500" />
              </li>
            )}
            {validItems.length <= 3 && (
              <li>
                <Link 
                  href={validItems[1].href} 
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  {validItems[1].label}
                </Link>
              </li>
            )}
            {validItems.length <= 3 && (
              <li aria-hidden="true">
                <ChevronRight className="flex-shrink-0 h-3.5 w-3.5 text-gray-500" />
              </li>
            )}
          </>
        )}
        
        {/* Always show current page on mobile */}
        {validItems.length > 1 && (
          <li aria-current="page" className="font-medium text-red-600">
            {validItems[lastIndex].label}
          </li>
        )}
      </ol>
      
      {/* Desktop version (full) */}
      <ol className="hidden sm:flex flex-wrap items-center gap-2 text-sm text-gray-600">
        {validItems.map((item, i) => (
          <React.Fragment key={i}>
            <li>
              {item.isCurrent ? (
                <span aria-current="page" className="font-medium text-red-600">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-gray-600 hover:text-red-600 transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
            {i < lastIndex && (
              <li aria-hidden="true">
                <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-500 mx-1" />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
} 