import React, { useState } from 'react';
import { ContentPageProps } from './types';
import EditableItem from './EditableItem';
import { useAdmin } from '../../../../context/AdminContext';

const ContentHome: React.FC<ContentPageProps> = ({ siteContent, language, t, startEditing }) => {
  const { updatePageContent } = useAdmin();
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>(
    Array.isArray(siteContent.pages?.home?.sections?.featured?.items) 
      ? siteContent.pages.home.sections.featured.items
        .filter((item: any) => typeof item === 'string')  // Assicurati che siano stringhe (ID)
      : []
  );

  // Funzione per gestire l'aggiunta/rimozione di piatti in evidenza
  const handleFeaturedItemsChange = () => {
    // Invece di salvare l'oggetto piatto completo, salviamo solo gli ID
    // In questo modo nella home page verranno sempre presi i dati aggiornati dal menu
    
    updatePageContent('home', {
      sections: {
        ...siteContent.pages.home.sections,
        featured: {
          ...siteContent.pages.home.sections.featured,
          items: selectedMenuItems // Salviamo solo gli ID dei piatti selezionati
        }
      }
    });
    
    // Mostrare un messaggio di conferma
    alert('Featured dishes updated successfully!');
  };

  // Toggle della selezione di un piatto
  const toggleMenuItemSelection = (itemId: string) => {
    if (selectedMenuItems.includes(itemId)) {
      setSelectedMenuItems(selectedMenuItems.filter(id => id !== itemId));
    } else {
      setSelectedMenuItems([...selectedMenuItems, itemId]);
    }
  };

  // Funzione per gestire errori di caricamento immagini
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = "/placeholder.svg";
  };

  return (
    <>
      <h2 className="text-2xl font-serif mb-6">{t('nav.home')}</h2>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Hero Section</h3>
          <div className="space-y-4">
            <EditableItem
              itemKey="hero.title"
              content={siteContent.pages.home.hero.title}
              onEdit={startEditing}
              label="Title"
              language={language}
              t={t}
            />
            
            <EditableItem
              itemKey="hero.subtitle"
              content={siteContent.pages.home.hero.subtitle}
              onEdit={startEditing}
              label="Subtitle"
              language={language}
              t={t}
            />

            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-gray-500">Background Image:</span>
                  <p className="font-medium truncate max-w-xs">{siteContent.pages.home.hero.backgroundImage || 'Not set'}</p>
                </div>
                <button 
                  onClick={() => startEditing('hero.backgroundImage', siteContent.pages.home.hero.backgroundImage || '')}
                  className="btn btn-outline btn-sm"
                >
                  {t('admin.edit')}
                </button>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                <div className="relative h-40 bg-gray-100 rounded overflow-hidden">
                  <img 
                    src={siteContent.pages.home.hero.backgroundImage || "/placeholder.svg"} 
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">About Section</h3>
          <div className="space-y-4">
            <EditableItem
              itemKey="sections.about.title"
              content={siteContent.pages.home.sections.about.title}
              onEdit={startEditing}
              label="Title"
              language={language}
              t={t}
            />
            
            <EditableItem
              itemKey="sections.about.content"
              content={siteContent.pages.home.sections.about.content}
              onEdit={startEditing}
              label="Content"
              language={language}
              t={t}
            />

            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-gray-500">Image:</span>
                  <p className="font-medium truncate max-w-xs">{siteContent.pages.home.sections.about.image || 'Not set'}</p>
                </div>
                <button 
                  onClick={() => startEditing('sections.about.image', siteContent.pages.home.sections.about.image || '')}
                  className="btn btn-outline btn-sm"
                >
                  {t('admin.edit')}
                </button>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                <div className="relative h-40 bg-gray-100 rounded overflow-hidden">
                  <img 
                    src={siteContent.pages.home.sections.about.image || "/placeholder.svg"} 
                    alt="About Section"
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Dishes Section */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Featured Dishes</h3>
          <div className="space-y-4">
            <EditableItem
              itemKey="sections.featured.title"
              content={siteContent.pages.home.sections.featured.title}
              onEdit={startEditing}
              label="Title"
              language={language}
              t={t}
            />
            
            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2">Selected Dishes</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Select</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {siteContent.pages.menu.items.map((item: any) => {
                      // Trova la categoria del piatto
                      const category = siteContent.pages.menu.categories.find(
                        (cat: any) => cat.id === item.category
                      );
                      const categoryName = category 
                        ? (language === 'it' ? category.name.it : category.name.en) 
                        : item.category;

                      return (
                        <tr key={item.id}>
                          <td className="px-4 py-2">
                            <input 
                              type="checkbox" 
                              checked={selectedMenuItems.includes(item.id)} 
                              onChange={() => toggleMenuItemSelection(item.id)}
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                          </td>
                          <td className="px-4 py-2">
                            {language === 'it' ? item.name.it : item.name.en}
                          </td>
                          <td className="px-4 py-2">{categoryName}</td>
                          <td className="px-4 py-2">€{item.price}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleFeaturedItemsChange}
                  className="btn btn-primary"
                >
                  Update Featured Dishes
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContentHome; 