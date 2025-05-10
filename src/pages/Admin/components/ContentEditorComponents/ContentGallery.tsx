import React from 'react';
import { ContentPageProps } from './types';
import EditableItem from './EditableItem';
import { useAdmin } from '../../../../context/AdminContext';

interface GalleryImage {
  id: string;
  src: string;
  alt: { it: string; en: string };
}

interface GalleryData {
  title?: { it: string; en: string };
  subtitle?: { it: string; en: string };
  images?: GalleryImage[] | any;
  [key: string]: any; // Aggiunto per consentire altre proprietà
}

const ContentGallery: React.FC<ContentPageProps> = ({ siteContent, language, t, startEditing }) => {
  const { updatePageContent } = useAdmin();
  
  // Tentiamo di utilizzare i dati esistenti in qualsiasi formato siano
  const galleryData: GalleryData = siteContent.pages.gallery || {};
  
  // Controlliamo se images è un array, altrimenti inizializziamo un array vuoto
  const images = Array.isArray(galleryData.images) 
    ? galleryData.images 
    : [];
    
  // Funzione per aggiungere una nuova immagine
  const addNewImage = () => {
    const newImage: GalleryImage = {
      id: `img_${Date.now()}`,
      src: '/placeholder.svg',
      alt: { it: 'Nuova immagine', en: 'New image' }
    };
    
    // Aggiorniamo la galleria con la nuova immagine
    const updatedImages = [...images, newImage];
    updatePageContent('gallery', { images: updatedImages });
  };
  
  // Funzione per eliminare un'immagine
  const deleteImage = (imageId: string) => {
    if (confirm('Sei sicuro di voler eliminare questa immagine?')) {
      const updatedImages = images.filter(img => img.id !== imageId);
      updatePageContent('gallery', { images: updatedImages });
    }
  };
  
  // Funzione per inizializzare la galleria se non esiste
  const initializeGallery = () => {
    // Crea una struttura di base per la galleria
    const initialGallery: GalleryData = {
      images: [{
        id: `img_${Date.now()}`,
        src: '/placeholder.svg',
        alt: { it: 'Immagine di esempio', en: 'Sample image' }
      }]
    };
    
    // Se title e subtitle esistono, li manteniamo
    if (galleryData.title) {
      initialGallery.title = galleryData.title;
    } else {
      initialGallery.title = { it: 'La nostra Galleria', en: 'Our Gallery' };
    }
    
    if (galleryData.subtitle) {
      initialGallery.subtitle = galleryData.subtitle;
    } else {
      initialGallery.subtitle = { it: 'Scopri il nostro ristorante', en: 'Discover our restaurant' };
    }
    
    // Aggiorna la galleria
    updatePageContent('gallery', initialGallery);
  };

  return (
    <>
      <h2 className="text-2xl font-serif mb-6">{t('nav.gallery')}</h2>
      <div className="space-y-8">
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Gallery Settings</h3>
          <div className="space-y-4">
            <EditableItem
              itemKey="title"
              content={siteContent.pages.gallery.title}
              onEdit={startEditing}
              label="Title"
              language={language}
              t={t}
            />
            
            <EditableItem
              itemKey="subtitle"
              content={siteContent.pages.gallery.subtitle}
              onEdit={startEditing}
              label="Subtitle"
              language={language}
              t={t}
            />
          </div>
        </section>
        
        <section className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Gallery Images</h3>
            <div className="space-x-2">
              <button
                onClick={addNewImage}
                className="btn btn-primary btn-sm"
              >
                Add Image
              </button>
              {images.length === 0 && (
                <button
                  onClick={initializeGallery}
                  className="btn btn-outline btn-sm"
                >
                  Initialize Gallery
                </button>
              )}
            </div>
          </div>
          
          {images.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-md">
              <p className="text-gray-500 mb-4">No images in the gallery.</p>
              <p className="text-sm text-gray-400">Click "Add Image" to add your first image or "Initialize Gallery" to create a sample gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="bg-gray-50 p-4 rounded-md">
                  <div className="relative">
                    <img 
                      src={image.src || "/placeholder.svg"} 
                      alt={language === 'it' ? image.alt?.it : image.alt?.en} 
                      className="w-full h-32 object-cover rounded-md mb-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <button 
                      onClick={() => deleteImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      title="Elimina immagine"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'it' ? image.alt?.it : image.alt?.en}</span>
                      <button 
                        onClick={() => startEditing(`images.${image.id}.alt`, image.alt || { it: '', en: '' })}
                        className="text-blue-600 text-sm"
                      >
                        {t('admin.edit')} Alt
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm truncate max-w-[150px]">{image.src || ''}</span>
                      <button 
                        onClick={() => startEditing(`images.${image.id}.src`, image.src || '')}
                        className="text-blue-600 text-sm"
                      >
                        {t('admin.edit')} URL
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ContentGallery; 