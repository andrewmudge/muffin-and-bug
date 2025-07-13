'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface PhotoCarouselProps {
  images: string[];
  title: string;
  isCollapsed?: boolean;
}

export default function PhotoCarousel({ images, title, isCollapsed = false }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
            <span className="text-lg font-semibold">📸</span>
            <h3 className="text-lg font-bold">Photo Gallery</h3>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-300 to-purple-400"></div>
          <span className="text-sm text-gray-500 bg-white/70 px-3 py-1 rounded-full">
            {images.length} {images.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>

        {/* Main Carousel - Only show when not collapsed */}
        {!isCollapsed && (
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-64 sm:h-80 md:h-96">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[currentIndex]}
                    alt={`${title} - Photo ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                  <div 
                    className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer"
                    onClick={() => openLightbox(currentIndex)}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-white/90 p-3 rounded-full shadow-lg pointer-events-none"
                    >
                      <ZoomIn className="w-6 h-6 text-gray-700" />
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 z-10"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 z-10"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
                  </motion.button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                {currentIndex + 1} of {images.length}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="p-4 bg-gray-50">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentIndex(index)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentIndex
                          ? 'border-purple-500 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                      {index === currentIndex && (
                        <div className="absolute inset-0 bg-purple-500/20"></div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Thumbnail Only View - Show when collapsed */}
        {isCollapsed && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openLightbox(index)}
                  className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-300 transition-all duration-200"
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Image
                  src={images[lightboxIndex]}
                  alt={`${title} - Photo ${lightboxIndex + 1}`}
                  width={800}
                  height={600}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLightboxOpen(false)}
                  className="absolute -top-4 -right-4 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Navigation in Lightbox */}
                {images.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevLightboxImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextLightboxImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </motion.button>
                  </>
                )}

                {/* Counter in Lightbox */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {lightboxIndex + 1} of {images.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}