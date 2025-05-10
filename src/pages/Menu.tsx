import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import { MenuItem } from '../context/AdminContext';

const Menu: React.FC = () => {
  const { t, language } = useLanguage();
  const { siteContent } = useAdmin();
  const { categories, items } = siteContent.pages.menu;
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter(item => item.category === activeCategory);
  
  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId !== activeCategory) {
      setActiveCategory(categoryId);
    }
  };

  return (
    <div className="page-container">
      <div className="text-center mb-10">
        <motion.h1 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('menu.title')}
        </motion.h1>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {language === 'it' ? category.name.it : category.name.en}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item, index) => (
          <MenuItem2D 
            key={item.id} 
            item={item} 
            language={language} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};

// Helper component for menu item display
const MenuItem2D: React.FC<{ 
  item: MenuItem; 
  language: 'it' | 'en'; 
  index: number;
}> = ({ item, language, index }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden flex"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="w-1/3">
        <img 
          src={item.image || "/placeholder.svg"}
          alt={language === 'it' ? item.name.it : item.name.en} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="w-2/3 p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-xl mb-2">
            {language === 'it' ? item.name.it : item.name.en}
          </h3>
          <div className="font-semibold">€{item.price}</div>
        </div>
        <p className="text-gray-600">
          {language === 'it' ? item.description.it : item.description.en}
        </p>
      </div>
    </motion.div>
  );
};

export default Menu;
