"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { VehicleList } from './VehicleList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  Filter, 
  Search, 
  X, 
  SlidersHorizontal,
  Tag
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'

// Define a type for vehicle objects
interface VehicleType {
  _id?: string;
  _type?: string;
  title?: string;
  make?: string;
  model?: string;
  year?: number;
  price?: number;
  priceOnApplication?: boolean;
  mileage?: number;
  fuelType?: string;
  engineSize?: string;
  transmission?: string;
  extendedInfo?: string;
  mainImage?: any;
  status?: string;
  specifications?: {
    vehicle?: {
      status?: string;
    }
  };
  badges?: string[];
  slug?: string | { current: string };
  [key: string]: any; // Allow other properties
}

interface PaginatedVehicleGridProps {
  vehicles: VehicleType[]
}

// Add a custom motion div component that correctly handles className
const MotionDiv = motion.div

export function PaginatedVehicleGrid({ vehicles }: PaginatedVehicleGridProps) {
  // Filter out sold vehicles so they only show in the SoldVehicleGrid
  const availableVehicles = useMemo(() => {
    return vehicles.filter(
      (v) => 
        (v.status?.toLowerCase() !== 'sold') && 
        (v.specifications?.vehicle?.status?.toLowerCase() !== 'sold')
    )
  }, [vehicles])
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9
  
  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMake, setSelectedMake] = useState('all')
  const [selectedModel, setSelectedModel] = useState('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [sortOption, setSortOption] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  
  // Get unique makes from vehicles
  const makes = useMemo(() => {
    const uniqueMakes = Array.from(new Set(availableVehicles.map(v => v.make || ''))).filter(Boolean).sort()
    return ['all', ...uniqueMakes]
  }, [availableVehicles])
  
  // Get models based on selected make
  const models = useMemo(() => {
    let filteredVehicles = availableVehicles
    if (selectedMake && selectedMake !== 'all') {
      filteredVehicles = availableVehicles.filter(v => v.make === selectedMake)
    }
    
    const uniqueModels = Array.from(new Set(filteredVehicles.map(v => v.model || ''))).filter(Boolean).sort()
    return ['all', ...uniqueModels]
  }, [availableVehicles, selectedMake])
  
  // Callback for handling make selection
  const handleMakeChange = useCallback((value: string) => {
    setSelectedMake(value)
    setSelectedModel('all') // Reset model when make changes
  }, [])
  
  // Get min/max price for the slider
  const priceExtents = useMemo(() => {
    if (!availableVehicles.length) return [0, 1000000] as [number, number]
    
    const validPrices = availableVehicles
      .filter(v => typeof v.price === 'number' && !v.priceOnApplication)
      .map(v => v.price as number) // Ensure prices are numbers
    
    if (!validPrices.length) return [0, 1000000] as [number, number]
    
    const min = Math.floor(Math.min(...validPrices) / 1000) * 1000
    const max = Math.ceil(Math.max(...validPrices) / 1000) * 1000
    
    return [min, max] as [number, number]
  }, [availableVehicles])
  
  // Reset price range when price extents change, but only on initial load or major changes
  useEffect(() => {
    setPriceRange(priceExtents)
    // This effect should only run when priceExtents actually change value, not just reference
  }, [priceExtents[0], priceExtents[1]])
  
  // Apply filters and sorting
  const filteredVehicles = useMemo(() => {
    let result = [...availableVehicles]
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(v => 
        (v.title?.toLowerCase().includes(search)) || 
        (v.make?.toLowerCase().includes(search)) || 
        (v.model?.toLowerCase().includes(search)) ||
        (v.extendedInfo?.toLowerCase().includes(search))
      )
    }
    
    // Filter by make
    if (selectedMake && selectedMake !== 'all') {
      result = result.filter(v => v.make === selectedMake)
    }
    
    // Filter by model
    if (selectedModel && selectedModel !== 'all') {
      result = result.filter(v => v.model === selectedModel)
    }
    
    // Filter by price range
    result = result.filter(v => {
      // Skip vehicles with "Price on Application"
      if (v.priceOnApplication) return true
      
      // Skip vehicles with no price
      if (typeof v.price !== 'number') return false
      
      return v.price >= priceRange[0] && v.price <= priceRange[1]
    })
    
    // Apply sorting
    switch (sortOption) {
      case 'price-high-low':
        result.sort((a, b) => {
          if (a.priceOnApplication) return -1
          if (b.priceOnApplication) return 1
          return (b.price || 0) - (a.price || 0)
        })
        break
      case 'price-low-high':
        result.sort((a, b) => {
          if (a.priceOnApplication) return 1
          if (b.priceOnApplication) return -1
          return (a.price || 0) - (b.price || 0)
        })
        break
      case 'newest':
        result.sort((a, b) => (b.year || 0) - (a.year || 0))
        break
      case 'oldest':
        result.sort((a, b) => (a.year || 0) - (b.year || 0))
        break
      case 'mileage-high-low':
        result.sort((a, b) => (b.mileage || 0) - (a.mileage || 0))
        break
      case 'mileage-low-high':
        result.sort((a, b) => (a.mileage || 0) - (b.mileage || 0))
        break
      default:
        // Default sort by newest
        result.sort((a, b) => (b.year || 0) - (a.year || 0))
    }
    
    return result
  }, [availableVehicles, searchTerm, selectedMake, selectedModel, priceRange, sortOption])
  
  // Calculate pagination
  const { totalPages, currentItems, paginationItems } = useMemo(() => {
    const totalItems = filteredVehicles.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem)
    
    // Pre-calculate pagination items
    const paginationItems = [] as (number | string)[]
    
    // Always show first page
    if (totalPages >= 1) {
      paginationItems.push(1)
    }
    
    // Add ellipsis after first page if needed
    if (currentPage > 3) {
      paginationItems.push('ellipsis1')
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      // Avoid duplicates
      if (!paginationItems.includes(i)) {
        paginationItems.push(i)
      }
    }
    
    // Add ellipsis before last page if needed
    if (currentPage < totalPages - 2) {
      paginationItems.push('ellipsis2')
    }
    
    // Always show last page
    if (totalPages > 1 && !paginationItems.includes(totalPages)) {
      paginationItems.push(totalPages)
    }
    
    return { totalPages, currentItems, paginationItems }
  }, [filteredVehicles, currentPage, itemsPerPage])
  
  // Handle pagination with memoized callbacks
  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }, [currentPage])
  
  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }, [currentPage, totalPages])
  
  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedMake, selectedModel, priceRange, sortOption])
  
  // Handle price slider change as callback
  const handlePriceChange = useCallback((values: number[]) => {
    setPriceRange(values as [number, number])
  }, [])
  
  // Reset all filters with callback
  const resetFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedMake('all')
    setSelectedModel('all')
    setPriceRange(priceExtents)
    setSortOption('newest')
  }, [priceExtents])
  
  // Format price for display
  const formatPrice = useCallback((price: number) => {
    return `£${price.toLocaleString()}`
  }, [])
  
  // Check if filters are active
  const hasActiveFilters = useMemo(() => (
    searchTerm !== '' || 
    selectedMake !== 'all' || 
    selectedModel !== 'all' || 
    priceRange[0] !== priceExtents[0] || 
    priceRange[1] !== priceExtents[1]
  ), [searchTerm, selectedMake, selectedModel, priceRange, priceExtents])
  
  // Toggle filter visibility
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev)
  }, [])
  
  return (
    <div className="mb-12">
      {/* Filter bar - clean, minimalist design */}
      <div className="mb-8 bg-black backdrop-blur-sm rounded-xl overflow-hidden border border-red-900/30">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Search input - spans full width on mobile, partial width on desktop */}
          <div className="relative flex-grow py-3 px-4 border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-red-500" />
              <Input
                type="text"
                placeholder="Search by make, model or keyword..."
                className="pl-10 border-0 h-10 bg-transparent text-white ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none placeholder:text-gray-400 focus-visible:border-b-2 focus-visible:border-b-red-500 transition-all group"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filter toggle button */}
          <button 
            onClick={toggleFilters}
            className={`flex items-center gap-2 py-3 px-6 hover:bg-red-900/20 transition-colors ${showFilters ? 'bg-red-900/20 text-red-400' : 'text-gray-200'}`}
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className={`h-5 w-5 ${showFilters ? 'text-red-500' : ''}`} />
              <span className={`font-medium ${showFilters ? 'text-red-400' : ''}`}>Filters</span>
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180 text-red-500' : ''}`} />
          </button>
          
          {/* Sort dropdown */}
          <div className="border-t md:border-t-0 md:border-l border-white/10 py-3 px-4 flex items-center">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="border-0 bg-transparent w-full md:w-[200px] h-10 p-0 pl-2 focus:ring-0 data-[state=open]:text-red-400 text-gray-200">
                <span className="flex items-center gap-2">
                  <span className="text-gray-400">Sort:</span>
                  <SelectValue placeholder="Sort vehicles" />
                </span>
              </SelectTrigger>
              <SelectContent className="min-w-[240px]">
                <SelectItem value="newest" className="focus:bg-red-950 focus:text-red-400">Age Newest - Oldest</SelectItem>
                <SelectItem value="oldest" className="focus:bg-red-950 focus:text-red-400">Age Oldest - Newest</SelectItem>
                <SelectItem value="price-high-low" className="focus:bg-red-950 focus:text-red-400">Price High - Low</SelectItem>
                <SelectItem value="price-low-high" className="focus:bg-red-950 focus:text-red-400">Price Low - High</SelectItem>
                <SelectItem value="mileage-high-low" className="focus:bg-red-950 focus:text-red-400">Mileage High - Low</SelectItem>
                <SelectItem value="mileage-low-high" className="focus:bg-red-950 focus:text-red-400">Mileage Low - High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Expandable filter section with animation */}
        <AnimatePresence>
          {showFilters && (
            <MotionDiv
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ 
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                background: 'linear-gradient(to bottom, rgba(127, 29, 29, 0.3), transparent)'
              }}
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Make filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-200 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    Make
                  </label>
                  <Select value={selectedMake} onValueChange={handleMakeChange}>
                    <SelectTrigger className="w-full focus:border-red-700 focus:ring-red-900 bg-black/50 text-white border-white/10">
                      <SelectValue placeholder="All Makes" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      {makes.map((make) => (
                        <SelectItem key={make} value={make} className="focus:bg-red-950 focus:text-red-400 text-gray-300">
                          {make === 'all' ? 'All Makes' : make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Model filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-200 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    Model
                  </label>
                  <Select 
                    value={selectedModel} 
                    onValueChange={setSelectedModel}
                    disabled={selectedMake === 'all'}
                  >
                    <SelectTrigger className="w-full focus:border-red-700 focus:ring-red-900 bg-black/50 text-white border-white/10">
                      <SelectValue placeholder="All Models" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      {models.map((model) => (
                        <SelectItem key={model} value={model} className="focus:bg-red-950 focus:text-red-400 text-gray-300">
                          {model === 'all' ? 'All Models' : model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Price range */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-200 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                      Price Range
                    </label>
                    <span className="text-xs text-red-400 font-medium px-2 py-0.5 bg-red-950/50 rounded-full">
                      {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    </span>
                  </div>
                  <Slider
                    defaultValue={priceRange}
                    min={priceExtents[0]}
                    max={priceExtents[1]}
                    step={1000}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    className="mt-6 [&>[role=slider]]:bg-red-600 [&>[role=slider]]:border-red-200 [&>[role=slider]]:shadow-red-900 [&_[data-orientation=horizontal]>.data-[orientation=horizontal]]:bg-red-500"
                  />
                </div>
              </div>
              
              {/* Active filters and reset */}
              <div className="px-6 pb-6 flex flex-wrap items-center gap-2">
                {hasActiveFilters ? (
                  <>
                    <span className="text-sm font-medium text-red-400 mr-1">Active filters:</span>
                    {searchTerm && (
                      <Badge variant="outline" className="rounded-full flex gap-1 items-center border-red-500/30 text-red-400 py-1 px-3 hover:bg-red-950/50 transition-colors shadow-sm">
                        <span>Search: {searchTerm}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-300" 
                          onClick={() => setSearchTerm('')}
                        />
                      </Badge>
                    )}
                    {selectedMake !== 'all' && (
                      <Badge variant="outline" className="rounded-full flex gap-1 items-center border-red-500/30 text-red-400 py-1 px-3 hover:bg-red-950/50 transition-colors shadow-sm">
                        <span>Make: {selectedMake}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-300" 
                          onClick={() => handleMakeChange('all')}
                        />
                      </Badge>
                    )}
                    {selectedModel !== 'all' && (
                      <Badge variant="outline" className="rounded-full flex gap-1 items-center border-red-500/30 text-red-400 py-1 px-3 hover:bg-red-950/50 transition-colors shadow-sm">
                        <span>Model: {selectedModel}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-300" 
                          onClick={() => setSelectedModel('all')}
                        />
                      </Badge>
                    )}
                    {(priceRange[0] !== priceExtents[0] || priceRange[1] !== priceExtents[1]) && (
                      <Badge variant="outline" className="rounded-full flex gap-1 items-center border-red-500/30 text-red-400 py-1 px-3 hover:bg-red-950/50 transition-colors shadow-sm">
                        <span>Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-300" 
                          onClick={() => setPriceRange(priceExtents)}
                        />
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-400 ml-auto font-medium hover:bg-red-950/50 hover:text-red-300" 
                      onClick={resetFilters}
                    >
                      Reset all
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">
                    No filters applied. Select filters to narrow down the results.
                  </p>
                )}
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
      
      {/* Results count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-red-600">{filteredVehicles.length}</span> {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'}
          {hasActiveFilters && ` (filtered from ${availableVehicles.length})`}
        </p>
      </div>
      
      {/* Vehicle grid */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%' }}
      >
        {filteredVehicles.length > 0 ? (
          <VehicleList vehicles={currentItems as any} />
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border border-red-100">
            <Tag className="h-12 w-12 text-red-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">
              We couldn't find any vehicles matching your filters. Try adjusting or removing some filters to see more results.
            </p>
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </MotionDiv>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}
        >
          <div className="inline-flex items-center gap-1 rounded-full px-1 py-1 bg-black/5">
            <Button 
              variant="ghost" 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="rounded-full h-9 px-3 text-sm hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Previous
            </Button>
            
            <div className="hidden md:flex gap-1 px-1">
              {paginationItems.map((item, index) => {
                // Render ellipsis
                if (typeof item === 'string') {
                  return (
                    <span key={item} className="flex items-center justify-center w-9 h-9 text-xs text-gray-500">•••</span>
                  )
                }
                
                // Render page button
                return (
                  <Button
                    key={`page-${item}`}
                    variant={currentPage === item ? "default" : "ghost"}
                    className={`rounded-full w-9 h-9 p-0 ${currentPage === item ? 'bg-red-600 text-white hover:bg-red-700' : 'hover:text-red-600 hover:bg-red-50'}`}
                    onClick={() => handlePageClick(item)}
                  >
                    {item}
                  </Button>
                )
              })}
            </div>
            
            <span className="md:hidden text-sm px-2">
              {currentPage} / {totalPages}
            </span>
            
            <Button 
              variant="ghost" 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="rounded-full h-9 px-3 text-sm hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </MotionDiv>
      )}
    </div>
  )
} 