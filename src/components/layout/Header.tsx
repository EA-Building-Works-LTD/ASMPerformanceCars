"use client"

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/custom-sheet'
import { Button } from '@/components/ui/button'
import { Menu, Phone, X, Search, ChevronDown, ChevronRight } from 'lucide-react'
import { SearchModal } from '@/components/search/SearchModal'

// Define props type for custom motion components
type MotionDivProps = React.ComponentProps<typeof motion.div>;

// Create custom wrapper components for motion.div with className
const MotionDiv: React.FC<MotionDivProps> = (props) => {
  return <motion.div {...props} />;
};

interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Our Cars',
    href: '/our-cars',
    children: [
      {
        label: 'Our Cars',
        href: '/our-cars',
      },
      {
        label: 'Modified Cars For Sale',
        href: '/our-cars/modified-cars-for-sale',
      },
      {
        label: 'Luxury & Supercars For Sale',
        href: '/our-cars/luxury-supercars-for-sale',
      },
      {
        label: 'Used Cars For Sale',
        href: '/our-cars/used-cars-for-sale',
      },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    children: [
      {
        label: 'MOT Check',
        href: '/mot-check',
      },
      {
        label: 'Car Finance',
        href: '/services/finance',
      },
      {
        label: 'Car Transportation',
        href: '/services/car-transportation',
      },
      {
        label: 'Part Exchange',
        href: '/services/part-exchange',
      },
      {
        label: 'Consignment Car Sales',
        href: '/services/consignment-car-sales',
      },
    ],
  },
  {
    label: 'FAQs',
    href: '/faqs',
    children: [
      {
        label: 'Car Buying/Selling',
        href: '/faqs/car-buying-selling-faqs',
      },
      {
        label: 'Car Insurance',
        href: '/faqs/car-insurance-faqs',
      },
      {
        label: 'Hybrid/Electric Cars',
        href: '/faqs/hybrid-electric-cars-faqs',
      },
      {
        label: 'Modified Cars',
        href: '/faqs/modified-cars-faqs',
      },
      {
        label: 'Used Cars',
        href: '/faqs/used-cars-faqs',
      },
    ],
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
]

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleDropdownEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setActiveDropdown(label)
  }

  const handleDropdownLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 300) // 300ms delay before closing
  }

  const openSearchModal = () => {
    setSearchModalOpen(true)
  }

  const closeSearchModal = () => {
    setSearchModalOpen(false)
  }

  const toggleMobileSubmenu = (label: string) => {
    setExpandedMobileItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label) 
        : [...prev, label]
    )
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[9000] transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-1 md:py-3'
            : 'bg-white py-3 md:py-5'
        } sticky-header`}
        style={{ 
          position: 'fixed', 
          width: '100%',
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
          WebkitBackfaceVisibility: 'hidden',
          perspective: 1000,
          WebkitPerspective: 1000
        }}
      >
        <div className="container mx-auto px-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative block">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {/* Logo image - larger on mobile */}
                <Image 
                  src="/images/ASM Performance Cars Logo 2025 Light Website Version.png" 
                  alt="ASM Performance Cars - Specialists in luxury & modified vehicles"
                  width={180} 
                  height={60} 
                  className="h-auto w-[180px] md:w-[180px]" 
                  priority
                  quality={95}
                  sizes="(max-width: 768px) 180px, 180px"
                  style={{ maxWidth: '180px' }}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-6">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center space-x-6">
                    {navItems.map((item) => (
                      <div
                        key={item.label}
                        className="relative group"
                        onMouseEnter={() => handleDropdownEnter(item.label)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <Link
                          href={item.href}
                          className={`text-gray-900 hover:text-red-600 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 rounded-md transition-colors duration-300 py-2 flex items-center font-medium`}
                          onKeyDown={(e) => {
                            if ((e.key === 'Enter' || e.key === ' ') && item.children) {
                              e.preventDefault();
                              if (activeDropdown === item.label) {
                                setActiveDropdown(null);
                              } else {
                                setActiveDropdown(item.label);
                              }
                            } else if (e.key === 'Escape' && activeDropdown === item.label) {
                              setActiveDropdown(null);
                            }
                          }}
                          aria-expanded={item.children ? activeDropdown === item.label : undefined}
                          aria-haspopup={item.children ? "true" : undefined}
                        >
                          {item.label}
                          {item.children && (
                            <ChevronDown className="ml-1 w-4 h-4" aria-hidden="true" />
                          )}
                        </Link>
                        
                        <AnimatePresence>
                          {item.children && activeDropdown === item.label && (
                            <div 
                              className="absolute left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50"
                              onMouseEnter={() => {
                                if (timeoutRef.current) {
                                  clearTimeout(timeoutRef.current)
                                  timeoutRef.current = null
                                }
                              }}
                              onMouseLeave={handleDropdownLeave}
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby={`${item.label}-menu-button`}
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="py-2">
                                  {item.children.map((child, idx) => (
                                    <Link
                                      key={child.label}
                                      href={child.href}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-600 transition-colors duration-150"
                                      role="menuitem"
                                      tabIndex={0}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                          setActiveDropdown(null);
                                          const parentLink = e.currentTarget.parentElement?.parentElement?.parentElement?.parentElement?.querySelector('a');
                                          parentLink?.focus();
                                        } else if (e.key === 'ArrowDown') {
                                          e.preventDefault();
                                          const nextItem = e.currentTarget.parentElement?.querySelector(`a:nth-child(${idx + 2})`);
                                          if (nextItem) {
                                            (nextItem as HTMLElement).focus();
                                          }
                                        } else if (e.key === 'ArrowUp') {
                                          e.preventDefault();
                                          const prevItem = e.currentTarget.parentElement?.querySelector(`a:nth-child(${idx})`);
                                          if (prevItem) {
                                            (prevItem as HTMLElement).focus();
                                          } else {
                                            const parentLink = e.currentTarget.parentElement?.parentElement?.parentElement?.parentElement?.querySelector('a');
                                            parentLink?.focus();
                                          }
                                        }
                                      }}
                                    >
                                      {child.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <div className="hidden lg:flex items-center space-x-3">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center space-x-3">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:text-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 rounded-full"
                      onClick={openSearchModal}
                      aria-label="Search"
                    >
                      <Search className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <a href="tel:+447306657000" className="focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 rounded-full">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white"
                        aria-label="Call +44 7306 657 000"
                      >
                        <Phone className="mr-2 w-4 h-4" aria-hidden="true" /> +44 7306 657 000
                      </Button>
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Mobile Menu Trigger */}
              <div className="lg:hidden flex items-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-900 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 h-10 w-10"
                      onClick={openSearchModal}
                      aria-label="Search"
                    >
                      <Search className="w-6 h-6" aria-hidden="true" />
                    </Button>
                    
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-gray-900 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 h-10 w-10" 
                          aria-label="Open menu"
                        >
                          <Menu className="w-7 h-7" aria-hidden="true" />
                        </Button>
                      </SheetTrigger>
                      
                      <SheetContent 
                        side="right" 
                        className="bg-white text-gray-900 border-gray-200 p-0 max-w-[85vw] sm:max-w-sm"
                        style={{ paddingTop: 'max(env(safe-area-inset-top), 16px)' }}
                      >
                        <div className="flex flex-col h-full">
                          {/* Header with logo and close button */}
                          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <Image 
                              src="/images/ASM Logo v2.png" 
                              alt="ASM Performance Cars - Specialists in luxury & modified vehicles" 
                              width={160} 
                              height={50} 
                              className="h-auto w-auto"
                              quality={95}
                            />
                            <SheetTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="rounded-full h-9 w-9 text-gray-500 hover:text-gray-900 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 opacity-0 pointer-events-none"
                                aria-label="Close menu"
                              >
                                <X className="h-6 w-6" aria-hidden="true" />
                              </Button>
                            </SheetTrigger>
                          </div>
                          
                          {/* Mobile navigation content */}
                          <div className="flex-1 overflow-y-auto">
                            <nav className="flex flex-col">
                              {navItems.map((item) => {
                                const isExpanded = expandedMobileItems.includes(item.label);
                                
                                return (
                                  <div key={item.label} className="border-b border-gray-100 last:border-b-0">
                                    {item.children ? (
                                      <button
                                        className="flex items-center justify-between py-4 px-6 text-base font-medium w-full text-left text-gray-900 hover:text-red-600 focus:text-red-600 focus:outline-none focus:bg-gray-50 transition-colors"
                                        onClick={() => toggleMobileSubmenu(item.label)}
                                        aria-expanded={isExpanded}
                                        aria-controls={`submenu-${item.label}`}
                                      >
                                        <span className="text-lg">{item.label}</span>
                                        <ChevronDown 
                                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                            isExpanded ? 'transform rotate-180' : ''
                                          }`} 
                                          aria-hidden="true" 
                                        />
                                      </button>
                                    ) : (
                                      <Link 
                                        href={item.href}
                                        className="flex items-center justify-between py-4 px-6 text-base font-medium text-gray-900 hover:text-red-600 focus:text-red-600 focus:outline-none focus:bg-gray-50 transition-colors"
                                      >
                                        <span className="text-lg">{item.label}</span>
                                      </Link>
                                    )}
                                    
                                    {item.children && (
                                      <div 
                                        id={`submenu-${item.label}`}
                                        className={`mobile-submenu bg-gray-50 ${isExpanded ? 'open' : ''}`} 
                                        aria-hidden={!isExpanded}
                                        role="menu"
                                      >
                                        <div className="py-2">
                                          {item.children.map((child) => (
                                            <Link
                                              key={child.label}
                                              href={child.href}
                                              className="block py-3 px-8 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:text-red-600 focus:outline-none focus:bg-gray-100 transition-colors"
                                              role="menuitem"
                                              tabIndex={isExpanded ? 0 : -1}
                                            >
                                              {child.label}
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </nav>
                          </div>
                          
                          {/* CTA buttons */}
                          <div className="p-6 border-t border-gray-100 space-y-4">
                            <Button 
                              asChild 
                              variant="outline" 
                              className="w-full justify-center text-base bg-white border-red-600 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 py-6"
                            >
                              <Link href="/contact">
                                Contact Us
                              </Link>
                            </Button>
                            <Button 
                              asChild 
                              className="w-full justify-center text-base bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 py-6"
                            >
                              <Link href="/our-cars/modified-cars-for-sale">
                                Modified Cars
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={closeSearchModal} />
    </>
  )
} 