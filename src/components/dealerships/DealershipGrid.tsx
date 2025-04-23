"use client";

import React from 'react';
import Link from 'next/link';
import { Dealership } from '@/lib/dealerships/dealerships';
import { DealershipCard } from './DealershipCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';

interface DealershipGridProps {
  dealerships: Dealership[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  searchQuery?: string;
}

export const DealershipGrid: React.FC<DealershipGridProps> = ({
  dealerships,
  currentPage,
  totalPages,
  totalItems,
  searchQuery,
}) => {
  // Generate a range of page numbers to display
  const generatePaginationItems = () => {
    const items = [];
    const maxPagesShown = 5; // Max number of page links to show

    // If few pages, show all
    if (totalPages <= maxPagesShown) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
      return items;
    }

    // Always include page 1
    items.push(1);

    // Calculate start and end of page range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if at the beginning
    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, maxPagesShown - 1);
    }
    // Adjust if at the end
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - (maxPagesShown - 2));
    }

    // Add ellipsis after page 1 if needed
    if (startPage > 2) {
      items.push('ellipsis1');
    }

    // Add pages in the middle
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push('ellipsis2');
    }

    // Always include the last page
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  const paginationItems = generatePaginationItems();
  
  // Create URL with preserved search query
  const createPageUrl = (pageNum: number) => {
    return `/dealerships?page=${pageNum}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
        {dealerships.map((dealership) => (
          <DealershipCard key={dealership.id} dealership={dealership} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12">
          <div className="flex flex-col items-center">
            <Pagination>
              <PaginationContent className="flex flex-wrap justify-center gap-2 p-2">
                {/* Previous page button */}
                <PaginationItem className="mx-1">
                  {currentPage > 1 ? (
                    <Link
                      href={createPageUrl(currentPage - 1)}
                      className="border border-gray-200 h-10 w-10 flex items-center justify-center p-0 rounded hover:text-red-600 hover:bg-red-50"
                      aria-label="Go to previous page"
                      prefetch={false}
                    >
                      <span aria-hidden="true">&lt;</span>
                      <span className="sr-only">Previous</span>
                    </Link>
                  ) : (
                    <span 
                      className="border border-gray-200 h-10 w-10 flex items-center justify-center p-0 rounded opacity-50"
                      aria-disabled="true"
                    >
                      <span aria-hidden="true">&lt;</span>
                      <span className="sr-only">Previous</span>
                    </span>
                  )}
                </PaginationItem>

                {/* Page number links for desktop view - hide on small screens */}
                <div className="hidden sm:flex">
                  {paginationItems.map((item, index) => {
                    if (item === 'ellipsis1' || item === 'ellipsis2') {
                      return (
                        <PaginationItem key={`ellipsis-${index}`} className="mx-1">
                          <span className="w-10 h-10 flex items-center justify-center">
                            <span>...</span>
                          </span>
                        </PaginationItem>
                      );
                    }

                    const isActive = currentPage === item;
                    
                    return (
                      <PaginationItem key={`page-${item}`} className="mx-1">
                        {isActive ? (
                          <span
                            className="w-10 h-10 flex items-center justify-center rounded-md bg-red-600 text-white border-red-600"
                            aria-current="page"
                          >
                            {item}
                          </span>
                        ) : (
                          <Link
                            href={createPageUrl(item as number)}
                            className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 hover:text-red-600 hover:bg-red-50"
                            prefetch={false}
                          >
                            {item}
                          </Link>
                        )}
                      </PaginationItem>
                    );
                  })}
                </div>

                {/* Simple page indicator for mobile */}
                <div className="flex items-center sm:hidden">
                  <PaginationItem className="mx-1">
                    <div className="w-auto h-10 px-3 flex items-center justify-center border border-gray-200 rounded-md">
                      <span className="text-gray-700">
                        {currentPage} of {totalPages}
                      </span>
                    </div>
                  </PaginationItem>
                </div>

                {/* Next page button */}
                <PaginationItem className="mx-1">
                  {currentPage < totalPages ? (
                    <Link
                      href={createPageUrl(currentPage + 1)}
                      className="border border-gray-200 h-10 w-10 flex items-center justify-center p-0 rounded hover:text-red-600 hover:bg-red-50"
                      aria-label="Go to next page"
                      prefetch={false}
                    >
                      <span aria-hidden="true">&gt;</span>
                      <span className="sr-only">Next</span>
                    </Link>
                  ) : (
                    <span 
                      className="border border-gray-200 h-10 w-10 flex items-center justify-center p-0 rounded opacity-50"
                      aria-disabled="true"
                    >
                      <span aria-hidden="true">&gt;</span>
                      <span className="sr-only">Next</span>
                    </span>
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Showing {dealerships.length} of {totalItems} dealerships
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 