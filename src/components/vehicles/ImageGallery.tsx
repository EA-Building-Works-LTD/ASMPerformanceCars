"use client"

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useSwipeable } from 'react-swipeable'
import { motion } from 'framer-motion'
import { ChevronLeftIcon as LucideChevronLeftIcon, ChevronRightIcon as LucideChevronRightIcon } from 'lucide-react'
import { urlForImage } from '@/sanity/lib/client'

interface ImageGalleryProps {
  images: {
    url: string;
    alt: string;
  }[];
  title: string;
}

export const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeImage, setActiveImage] = useState(images[0])
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false)

  const closeGallery = () => {
    setIsOpen(false)
  }

  const openGallery = (index: number) => {
    setCurrentImageIndex(index)
    setIsOpen(true)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: previousImage,
    preventScrollOnSwipe: true,
    trackMouse: true
  })

  // Handle keyboard navigation
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullScreenOpen) return

      if (e.key === 'ArrowLeft') {
        const currentIndex = images.indexOf(activeImage)
        const prevIndex = (currentIndex - 1 + images.length) % images.length
        setActiveImage(images[prevIndex])
      } else if (e.key === 'ArrowRight') {
        const currentIndex = images.indexOf(activeImage)
        const nextIndex = (currentIndex + 1) % images.length
        setActiveImage(images[nextIndex])
      } else if (e.key === 'Escape') {
        setIsFullScreenOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullScreenOpen, activeImage, images])

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-md thumbnail-gallery-item"
            onClick={() => openGallery(index)}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
              sizes="(max-width: 768px) 20vw, 10vw"
            />
          </div>
        ))}
      </div>

      {/* Full-screen Modal */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50"
          onClose={closeGallery}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/90" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-7xl transform overflow-hidden rounded-lg bg-transparent transition-all">
                  {/* Close button */}
                  <button
                    onClick={closeGallery}
                    className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>

                  {/* Navigation buttons */}
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>

                  {/* Main image with swipe handlers */}
                  <div 
                    className="relative aspect-[16/9] w-full" 
                    {...handlers}
                  >
                    <Image
                      src={images[currentImageIndex].url}
                      alt={images[currentImageIndex].alt}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  </div>

                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-white">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
} 