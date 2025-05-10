import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

interface GalleryImage {
  id?: string;
  src: string;
  alt?: { 
    it: string;
    en: string;
  };
}

interface GalleryData {
  title?: { it: string; en: string };
  subtitle?: { it: string; en: string };
  images?: GalleryImage[];
  [key: string]: any;
}

const Gallery: React.FC = () => {
  const { language } = useLanguage();
  const { siteContent } = useAdmin();
  
  // Verifica che la struttura gallery esista
  const galleryData: GalleryData = (siteContent.pages?.gallery || {}) as GalleryData;
  const { title = { it: 'Galleria', en: 'Gallery' }, subtitle = { it: '', en: '' } } = galleryData;
  
  // Assicuriamoci che images sia un array
  const images = Array.isArray(galleryData.images) ? galleryData.images : [];
  
  const [selectedImage, setSelectedImage] = useState<null | string>(null);

  // Open lightbox with selected image
  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {language === 'it' ? title.it : title.en}
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {language === 'it' ? subtitle.it : subtitle.en}
        </motion.p>
      </div>
      
      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500">{language === 'it' ? 'Nessuna immagine nella galleria.' : 'No images in the gallery.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id || index}
              className="aspect-square overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition-shadow"
              onClick={() => openLightbox(image.src)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <img 
                src={image.src || "/placeholder.svg"} 
                alt={language === 'it' ? image.alt?.it : image.alt?.en} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button 
              className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20"
              onClick={closeLightbox}
            >
              <X size={32} />
            </button>
            <motion.img 
              src={selectedImage || "/placeholder.svg"}
              alt="Gallery image"
              className="max-h-[90vh] max-w-[90vw] object-contain"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
