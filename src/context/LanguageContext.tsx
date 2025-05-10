import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Languages available
type Language = 'it' | 'en';

// Translation structure
export interface Translations {
  [key: string]: {
    it: string;
    en: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Translations;
  setTranslations: (translations: Translations) => void;
  isSaving: boolean;
}

// API endpoints
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://ristorante-backend.onrender.com/api';
console.log('Using API URL:', API_URL);
const TRANSLATIONS_ENDPOINT = `${API_URL}/translations`;

// Default translations - we'll keep this as a fallback
const defaultTranslations: Translations = {
  // Navigation
  'nav.home': {
    it: 'Home',
    en: 'Home',
  },
  'nav.menu': {
    it: 'Menù',
    en: 'Menu',
  },
  'nav.gallery': {
    it: 'Galleria',
    en: 'Gallery',
  },
  'nav.staff': {
    it: 'Staff',
    en: 'Staff',
  },
  'nav.contact': {
    it: 'Contatti',
    en: 'Contact',
  },
  'nav.admin': {
    it: 'Admin',
    en: 'Admin',
  },
  
  // Home Page
  'home.welcome': {
    it: 'Benvenuti al nostro ristorante',
    en: 'Welcome to our restaurant',
  },
  'home.subtitle': {
    it: 'Un\'esperienza culinaria unica',
    en: 'A unique culinary experience',
  },
  'home.cta': {
    it: 'Prenota ora',
    en: 'Book now',
  },
  'home.about': {
    it: 'Chi siamo',
    en: 'About us',
  },
  'home.aboutText': {
    it: 'Il nostro ristorante combina tradizione e innovazione per offrire un\'esperienza culinaria unica. I nostri chef utilizzano solo ingredienti freschi e di alta qualità per creare piatti che delizieranno il vostro palato.',
    en: 'Our restaurant combines tradition and innovation to offer a unique culinary experience. Our chefs use only fresh, high-quality ingredients to create dishes that will delight your palate.',
  },
  
  // Menu Page
  'menu.title': {
    it: 'Il nostro Menù',
    en: 'Our Menu',
  },
  'menu.starters': {
    it: 'Antipasti',
    en: 'Starters',
  },
  'menu.firstCourses': {
    it: 'Primi Piatti',
    en: 'First Courses',
  },
  'menu.mainCourses': {
    it: 'Secondi Piatti',
    en: 'Main Courses',
  },
  'menu.desserts': {
    it: 'Dessert',
    en: 'Desserts',
  },
  'menu.drinks': {
    it: 'Bevande',
    en: 'Drinks',
  },
  
  // Gallery Page
  'gallery.title': {
    it: 'Galleria',
    en: 'Gallery',
  },
  'gallery.subtitle': {
    it: 'Scopri il nostro ristorante attraverso le immagini',
    en: 'Discover our restaurant through images',
  },
  
  // Staff Page
  'staff.title': {
    it: 'Il nostro Staff',
    en: 'Our Staff',
  },
  'staff.subtitle': {
    it: 'Incontra il team che rende tutto possibile',
    en: 'Meet the team that makes everything possible',
  },
  'staff.chef': {
    it: 'Chef',
    en: 'Chef',
  },
  'staff.sousChef': {
    it: 'Sous Chef',
    en: 'Sous Chef',
  },
  'staff.manager': {
    it: 'Direttore',
    en: 'Manager',
  },
  'staff.waitstaff': {
    it: 'Cameriere',
    en: 'Waitstaff',
  },
  
  // Contact Page
  'contact.title': {
    it: 'Contatti',
    en: 'Contact',
  },
  'contact.subtitle': {
    it: 'Dove trovarci',
    en: 'Find us',
  },
  'contact.address': {
    it: 'Indirizzo',
    en: 'Address',
  },
  'contact.phone': {
    it: 'Telefono',
    en: 'Phone',
  },
  'contact.hours': {
    it: 'Orari di apertura',
    en: 'Opening Hours',
  },
  'contact.monday': {
    it: 'Lunedì',
    en: 'Monday',
  },
  'contact.tuesday': {
    it: 'Martedì',
    en: 'Tuesday',
  },
  'contact.wednesday': {
    it: 'Mercoledì',
    en: 'Wednesday',
  },
  'contact.thursday': {
    it: 'Giovedì',
    en: 'Thursday',
  },
  'contact.friday': {
    it: 'Venerdì',
    en: 'Friday',
  },
  'contact.saturday': {
    it: 'Sabato',
    en: 'Saturday',
  },
  'contact.sunday': {
    it: 'Domenica',
    en: 'Sunday',
  },
  'contact.closed': {
    it: 'Chiuso',
    en: 'Closed',
  },
  'contact.social': {
    it: 'Social',
    en: 'Social',
  },
  
  // Admin Panel
  'admin.title': {
    it: 'Pannello di Amministrazione',
    en: 'Admin Panel',
  },
  'admin.login': {
    it: 'Accedi',
    en: 'Login',
  },
  'admin.logout': {
    it: 'Esci',
    en: 'Logout',
  },
  'admin.username': {
    it: 'Nome utente',
    en: 'Username',
  },
  'admin.password': {
    it: 'Password',
    en: 'Password',
  },
  'admin.pages': {
    it: 'Pagine',
    en: 'Pages',
  },
  'admin.content': {
    it: 'Contenuto',
    en: 'Content',
  },
  'admin.edit': {
    it: 'Modifica',
    en: 'Edit',
  },
  'admin.save': {
    it: 'Salva',
    en: 'Save',
  },
  'admin.cancel': {
    it: 'Annulla',
    en: 'Cancel',
  },
  'admin.add': {
    it: 'Aggiungi',
    en: 'Add',
  },
  'admin.delete': {
    it: 'Elimina',
    en: 'Delete',
  },
  'admin.saving': {
    it: 'Salvataggio in corso...',
    en: 'Saving...',
  },
  'admin.settings': {
    it: 'Impostazioni',
    en: 'Settings',
  },
  'admin.translations': {
    it: 'Traduzioni',
    en: 'Translations',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('it');
  const [translations, setTranslations] = useState<Translations>(defaultTranslations);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load stored language preference
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage === 'it' || storedLanguage === 'en') {
      setLanguage(storedLanguage as Language);
    }
  }, []);
  
  // Load translations from API
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        console.log('Attempting to fetch translations from:', TRANSLATIONS_ENDPOINT);
        const response = await fetch(TRANSLATIONS_ENDPOINT);
        console.log('Translations API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Translations fetched successfully:', data);
          if (data && data.translations) {
            setTranslations(data.translations);
            console.log('Translations set successfully');
          } else {
            console.error('API response has incorrect translations format:', data);
            toast.error('Traduzioni ricevute in formato non valido. Usando traduzioni predefinite.');
            setTranslations(defaultTranslations);
          }
        } else {
          console.log('No saved translations found. Using default translations.');
          // If no translations found, initialize with defaults
          saveTranslationsToAPI(defaultTranslations);
        }
      } catch (error) {
        console.error('Error fetching translations:', error);
        toast.error('Failed to load translations. Using defaults.');
      }
    };
    
    fetchTranslations();
  }, []);
  
  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  // Function to save translations to API
  const saveTranslationsToAPI = async (translationsData: Translations) => {
    setIsSaving(true);
    try {
      const response = await fetch(TRANSLATIONS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translationsData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save translations');
      }
      
      toast.success('Translations saved successfully');
    } catch (error) {
      console.error('Error saving translations:', error);
      toast.error('Failed to save translations');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Update translations and save to API
  const handleSetTranslations = (newTranslations: Translations) => {
    setTranslations(newTranslations);
    saveTranslationsToAPI(newTranslations);
  };
  
  // Translation function
  const t = (key: string): string => {
    const translation = translations[key];
    
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    return translation[language] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      translations, 
      setTranslations: handleSetTranslations,
      isSaving
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
