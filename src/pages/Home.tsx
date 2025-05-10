import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface TextContent {
  it: string;
  en: string;
}

interface MenuItem {
  id: string;
  name: TextContent;
  description: TextContent;
  price: number;
  image?: string;
  category: string;
}

interface HeroSection {
  title: TextContent;
  subtitle: TextContent;
  backgroundImage: string;
}

interface AboutSection {
  title: TextContent;
  content: TextContent;
  image: string;
}

interface FeaturedSection {
  title: TextContent;
  items: (string | MenuItem)[];
}

interface HomeData {
  hero?: HeroSection;
  sections?: {
    about?: AboutSection;
    featured?: FeaturedSection;
    [key: string]: any;
  };
  [key: string]: any;
}

const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const { siteContent } = useAdmin();
  
  // Verifica che la struttura home esista e imposta valori predefiniti se necessario
  const homeData: HomeData = (siteContent.pages?.home || {}) as HomeData;
  const hero = homeData.hero || { 
    title: { it: '', en: '' }, 
    subtitle: { it: '', en: '' },
    backgroundImage: '/placeholder.svg'
  };
  const sections = homeData.sections || { 
    about: { 
      title: { it: '', en: '' }, 
      content: { it: '', en: '' },
      image: '/placeholder.svg'
    },
    featured: { 
      title: { it: '', en: '' }, 
      items: [] 
    } 
  };
  
  // Otteniamo i piatti in evidenza dal menu principale usando gli ID salvati
  const featuredItems = Array.isArray(sections.featured?.items) ? sections.featured.items.map((itemId: any) => {
    // Se itemId è una stringa (ID), cerca l'oggetto piatto corrispondente nel menu
    if (typeof itemId === 'string') {
      return siteContent.pages?.menu?.items?.find((item: any) => item.id === itemId);
    }
    // Altrimenti, se è già un oggetto piatto completo (retrocompatibilità), usalo direttamente
    return itemId;
  }).filter(Boolean) : []; // Rimuovi eventuali undefined

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${hero.backgroundImage || '/placeholder.svg'})` 
        }}
      >
        <div className="text-center text-white p-4">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {language === 'it' ? hero.title?.it : hero.title?.en}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {language === 'it' ? hero.subtitle?.it : hero.subtitle?.en}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              to="/menu" 
              className="btn btn-primary px-6 py-3 text-lg"
            >
              {t('menu.title')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="section-title">{language === 'it' ? sections.about?.title?.it : sections.about?.title?.en}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {language === 'it' ? sections.about?.content?.it : sections.about?.content?.en}
              </p>
            </motion.div>
            <motion.div
              className="rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src={sections.about?.image || "/placeholder.svg"} 
                alt={language === 'it' ? "Il nostro ristorante" : "Our restaurant"} 
                className="w-full h-96 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="section-title text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {language === 'it' ? sections.featured?.title?.it : sections.featured?.title?.en}
          </motion.h2>
          
          {featuredItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">{language === 'it' ? 'Nessun piatto in evidenza.' : 'No featured dishes.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredItems.map((item: MenuItem, index) => (
                <motion.div
                  key={item.id}
                  className="card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="relative h-48">
                    <img 
                      src={item.image || "/placeholder.svg"}
                      alt={language === 'it' ? item.name?.it : item.name?.en} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl mb-2">{language === 'it' ? item.name?.it : item.name?.en}</h3>
                    <p className="text-gray-600 mb-4">{language === 'it' ? item.description?.it : item.description?.en}</p>
                    <div className="font-semibold">€{item.price}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link to="/menu" className="btn btn-outline">
              {t('menu.title')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
