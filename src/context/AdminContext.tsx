import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  siteContent: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => void;
  updatePageContent: (page: keyof SiteContent['pages'], newContent: any) => void;
  isSaving: boolean;
}

// API endpoints
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://ristorante-backend.onrender.com/api';
console.log('Using API URL:', API_URL);  
const CONTENT_ENDPOINT = `${API_URL}/content`;
const TRANSLATIONS_ENDPOINT = `${API_URL}/translations`;

// Fake admin credentials - in a real app this would be secured on the server
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'password123';

// Type definitions for site content
export interface MenuItem {
  id: string;
  name: { it: string; en: string };
  description: { it: string; en: string };
  price: string;
  category: string;
  image?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: { it: string; en: string };
  bio: { it: string; en: string };
  image: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: { it: string; en: string };
  category?: string;
}

export interface ContactInfo {
  address: { it: string; en: string };
  phone: string;
  email: string;
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  social: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  mapLocation: {
    lat: number;
    lng: number;
  };
}

export interface SiteContent {
  general: {
    siteName: { it: string; en: string };
    logo: string;
  };
  pages: {
    home: {
      hero: {
        title: { it: string; en: string };
        subtitle: { it: string; en: string };
        backgroundImage: string;
      };
      sections: {
        about: {
          title: { it: string; en: string };
          content: { it: string; en: string };
          image: string;
        };
        featured: {
          title: { it: string; en: string };
          items: MenuItem[];
        };
      };
    };
    menu: {
      categories: {
        id: string;
        name: { it: string; en: string };
      }[];
      items: MenuItem[];
    };
    gallery: {
      title: { it: string; en: string };
      subtitle: { it: string; en: string };
      images: GalleryImage[];
    };
    staff: {
      title: { it: string; en: string };
      subtitle: { it: string; en: string };
      team: StaffMember[];
    };
    contact: ContactInfo;
  };
}

// Initial content for the site
const initialContent: SiteContent = {
  general: {
    siteName: { 
      it: 'Il Ristorante', 
      en: 'The Restaurant' 
    },
    logo: '/logo.png',
  },
  pages: {
    home: {
      hero: {
        title: { 
          it: 'Benvenuti al Nostro Ristorante', 
          en: 'Welcome to Our Restaurant' 
        },
        subtitle: { 
          it: 'Un\'esperienza culinaria unica', 
          en: 'A unique culinary experience' 
        },
        backgroundImage: '/hero-bg.jpg',
      },
      sections: {
        about: {
          title: { 
            it: 'Chi Siamo', 
            en: 'About Us' 
          },
          content: { 
            it: 'Il nostro ristorante combina tradizione e innovazione per offrire un\'esperienza culinaria unica. I nostri chef utilizzano solo ingredienti freschi e di alta qualità per creare piatti che delizieranno il vostro palato.',
            en: 'Our restaurant combines tradition and innovation to offer a unique culinary experience. Our chefs use only fresh, high-quality ingredients to create dishes that will delight your palate.'
          },
          image: '/about.jpg',
        },
        featured: {
          title: { 
            it: 'I Nostri Piatti', 
            en: 'Our Dishes' 
          },
          items: [
            {
              id: '1',
              name: { it: 'Carpaccio di Manzo', en: 'Beef Carpaccio' },
              description: { 
                it: 'Sottili fette di manzo con rucola e parmigiano', 
                en: 'Thin slices of beef with arugula and parmesan' 
              },
              price: '12.50',
              category: 'starters',
              image: '/dishes/carpaccio.jpg',
            },
            {
              id: '2',
              name: { it: 'Spaghetti alla Carbonara', en: 'Spaghetti Carbonara' },
              description: { 
                it: 'Spaghetti con uova, guanciale, pecorino e pepe nero', 
                en: 'Spaghetti with eggs, guanciale, pecorino cheese and black pepper' 
              },
              price: '14.00',
              category: 'firstCourses',
              image: '/dishes/carbonara.jpg',
            },
            {
              id: '3',
              name: { it: 'Tiramisù', en: 'Tiramisu' },
              description: { 
                it: 'Dolce classico italiano con mascarpone, caffè e savoiardi', 
                en: 'Classic Italian dessert with mascarpone cheese, coffee and ladyfingers' 
              },
              price: '7.50',
              category: 'desserts',
              image: '/dishes/tiramisu.jpg',
            },
          ],
        },
      },
    },
    menu: {
      categories: [
        { id: 'starters', name: { it: 'Antipasti', en: 'Starters' } },
        { id: 'firstCourses', name: { it: 'Primi Piatti', en: 'First Courses' } },
        { id: 'mainCourses', name: { it: 'Secondi Piatti', en: 'Main Courses' } },
        { id: 'desserts', name: { it: 'Dessert', en: 'Desserts' } },
        { id: 'drinks', name: { it: 'Bevande', en: 'Drinks' } },
      ],
      items: [
        // Starters
        {
          id: '1',
          name: { it: 'Bruschetta', en: 'Bruschetta' },
          description: { 
            it: 'Pane tostato con pomodori freschi, basilico e aglio', 
            en: 'Toasted bread with fresh tomatoes, basil and garlic' 
          },
          price: '8.50',
          category: 'starters',
          image: '/dishes/bruschetta.jpg',
        },
        {
          id: '2',
          name: { it: 'Caprese', en: 'Caprese Salad' },
          description: { 
            it: 'Insalata con mozzarella, pomodori e basilico', 
            en: 'Salad with mozzarella, tomatoes and basil' 
          },
          price: '9.00',
          category: 'starters',
          image: '/dishes/caprese.jpg',
        },
        // First Courses
        {
          id: '3',
          name: { it: 'Spaghetti alla Carbonara', en: 'Spaghetti Carbonara' },
          description: { 
            it: 'Spaghetti con uova, guanciale, pecorino e pepe nero', 
            en: 'Spaghetti with eggs, guanciale, pecorino cheese and black pepper' 
          },
          price: '14.00',
          category: 'firstCourses',
          image: '/dishes/carbonara.jpg',
        },
        {
          id: '4',
          name: { it: 'Risotto ai Funghi', en: 'Mushroom Risotto' },
          description: { 
            it: 'Risotto con funghi porcini e parmigiano', 
            en: 'Risotto with porcini mushrooms and parmesan cheese' 
          },
          price: '15.50',
          category: 'firstCourses',
          image: '/dishes/risotto.jpg',
        },
        // Main Courses
        {
          id: '5',
          name: { it: 'Tagliata di Manzo', en: 'Sliced Beef Steak' },
          description: { 
            it: 'Tagliata di manzo con rucola e parmigiano', 
            en: 'Sliced beef steak with arugula and parmesan' 
          },
          price: '22.00',
          category: 'mainCourses',
          image: '/dishes/tagliata.jpg',
        },
        {
          id: '6',
          name: { it: 'Branzino al Forno', en: 'Baked Sea Bass' },
          description: { 
            it: 'Branzino al forno con patate e olive', 
            en: 'Baked sea bass with potatoes and olives' 
          },
          price: '24.50',
          category: 'mainCourses',
          image: '/dishes/seabass.jpg',
        },
        // Desserts
        {
          id: '7',
          name: { it: 'Tiramisù', en: 'Tiramisu' },
          description: { 
            it: 'Dolce classico italiano con mascarpone, caffè e savoiardi', 
            en: 'Classic Italian dessert with mascarpone cheese, coffee and ladyfingers' 
          },
          price: '7.50',
          category: 'desserts',
          image: '/dishes/tiramisu.jpg',
        },
        {
          id: '8',
          name: { it: 'Panna Cotta', en: 'Panna Cotta' },
          description: { 
            it: 'Dolce al cucchiaio con salsa ai frutti di bosco', 
            en: 'Creamy dessert with mixed berry sauce' 
          },
          price: '6.50',
          category: 'desserts',
          image: '/dishes/pannacotta.jpg',
        },
        // Drinks
        {
          id: '9',
          name: { it: 'Vino Rosso (bottiglia)', en: 'Red Wine (bottle)' },
          description: { 
            it: 'Bottiglia di vino rosso della casa', 
            en: 'Bottle of house red wine' 
          },
          price: '18.00',
          category: 'drinks',
          image: '/dishes/redwine.jpg',
        },
        {
          id: '10',
          name: { it: 'Acqua Minerale', en: 'Mineral Water' },
          description: { 
            it: 'Bottiglia di acqua minerale', 
            en: 'Bottle of mineral water' 
          },
          price: '2.50',
          category: 'drinks',
          image: '/dishes/water.jpg',
        },
      ],
    },
    gallery: {
      title: { 
        it: 'La Nostra Galleria', 
        en: 'Our Gallery' 
      },
      subtitle: { 
        it: 'Scopri il nostro ristorante attraverso le immagini', 
        en: 'Discover our restaurant through images' 
      },
      images: [
        {
          id: '1',
          src: '/gallery/restaurant1.jpg',
          alt: { it: 'Interno del ristorante', en: 'Restaurant interior' },
          category: 'interior',
        },
        {
          id: '2',
          src: '/gallery/dish1.jpg',
          alt: { it: 'Piatto gourmet', en: 'Gourmet dish' },
          category: 'food',
        },
        {
          id: '3',
          src: '/gallery/restaurant2.jpg',
          alt: { it: 'Sala da pranzo', en: 'Dining room' },
          category: 'interior',
        },
        {
          id: '4',
          src: '/gallery/dish2.jpg',
          alt: { it: 'Pasta fresca', en: 'Fresh pasta' },
          category: 'food',
        },
        {
          id: '5',
          src: '/gallery/chef1.jpg',
          alt: { it: 'Chef al lavoro', en: 'Chef at work' },
          category: 'staff',
        },
        {
          id: '6',
          src: '/gallery/restaurant3.jpg',
          alt: { it: 'Terrazza esterna', en: 'Outdoor terrace' },
          category: 'exterior',
        },
      ],
    },
    staff: {
      title: { 
        it: 'Il Nostro Staff', 
        en: 'Our Staff' 
      },
      subtitle: { 
        it: 'Incontra il team che rende tutto possibile', 
        en: 'Meet the team that makes everything possible' 
      },
      team: [
        {
          id: '1',
          name: 'Marco Rossi',
          role: { it: 'Chef Principale', en: 'Head Chef' },
          bio: { 
            it: 'Marco ha lavorato in ristoranti stellati in tutta Europa prima di unirsi al nostro team.',
            en: 'Marco has worked in starred restaurants all over Europe before joining our team.'
          },
          image: '/staff/chef.jpg',
        },
        {
          id: '2',
          name: 'Giulia Bianchi',
          role: { it: 'Sous Chef', en: 'Sous Chef' },
          bio: { 
            it: 'Esperta di cucina mediterranea, Giulia porta creatività e passione in ogni piatto.',
            en: 'Expert in Mediterranean cuisine, Giulia brings creativity and passion to every dish.'
          },
          image: '/staff/souschef.jpg',
        },
        {
          id: '3',
          name: 'Luca Verdi',
          role: { it: 'Direttore', en: 'Manager' },
          bio: { 
            it: 'Con oltre 15 anni di esperienza nella ristorazione, Luca garantisce un servizio impeccabile.',
            en: 'With over 15 years of experience in the restaurant industry, Luca ensures impeccable service.'
          },
          image: '/staff/manager.jpg',
        },
        {
          id: '4',
          name: 'Sofia Russo',
          role: { it: 'Sommelier', en: 'Sommelier' },
          bio: { 
            it: 'Sofia è esperta nella selezione di vini e sa consigliare il vino perfetto per ogni piatto.',
            en: 'Sofia is expert in wine selection and knows how to recommend the perfect wine for each dish.'
          },
          image: '/staff/sommelier.jpg',
        },
      ],
    },
    contact: {
      address: { 
        it: 'Via Roma 123, Milano, Italia', 
        en: '123 Rome Street, Milan, Italy' 
      },
      phone: '+39 02 1234567',
      email: 'info@ristorante.com',
      hours: {
        monday: { open: '12:00', close: '22:00' },
        tuesday: { open: '12:00', close: '22:00' },
        wednesday: { open: '12:00', close: '22:00' },
        thursday: { open: '12:00', close: '23:00' },
        friday: { open: '12:00', close: '23:00' },
        saturday: { open: '12:00', close: '23:30' },
        sunday: { open: '12:00', close: '22:00' },
      },
      social: {
        facebook: 'https://facebook.com/ristoranteexample',
        instagram: 'https://instagram.com/ristoranteexample',
        whatsapp: 'https://wa.me/390212345678',
      },
      mapLocation: {
        lat: 45.4642,
        lng: 9.1900,
      },
    },
  },
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => useContext(AdminContext);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load content from API on component mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log('Attempting to fetch content from:', CONTENT_ENDPOINT);
        const response = await fetch(CONTENT_ENDPOINT);
        console.log('Content API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Content fetched successfully from MongoDB:', data);
          
          // Aggiungiamo un handler per le immagini mancanti
          document.addEventListener('error', function(e) {
            const target = e.target as HTMLImageElement;
            if (target.tagName === 'IMG') {
              console.log('Immagine non trovata, sostituita con placeholder:', target.src);
              target.src = 'https://via.placeholder.com/150?text=Immagine';
              target.onerror = null; // Previene loop infiniti
            }
          }, true);
          
          // Prendi i dati direttamente dalla risposta di MongoDB
          if (data && data.general && data.pages) {
            console.log('Struttura dati MongoDB valida, impostazione contenuto...');
            setSiteContent({ 
              general: data.general, 
              pages: data.pages 
            });
            console.log('Content set successfully from MongoDB');
          } else {
            console.error('API response has incorrect format:', data);
            console.log('Struttura dati non valida, uso dati predefiniti');
            setSiteContent(initialContent);
            toast.error('Dati ricevuti in formato non valido. Usando dati predefiniti.');
          }
        } else {
          console.log('No saved content found or API error. Using default content.');
          // Se non sono stati trovati contenuti, inizializza il database con i nostri contenuti predefiniti
          saveContentToAPI(initialContent);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        toast.error('Failed to load content. Using default content.');
      }
    };
    
    fetchContent();
  }, []);
  
  // Function to save content to the API
  const saveContentToAPI = async (content: SiteContent) => {
    setIsSaving(true);
    try {
      console.log('Attempting to save content to API:', CONTENT_ENDPOINT);
      const response = await fetch(CONTENT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });
      
      console.log('Save content API response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to save content');
      }
      
      toast.success('Content saved successfully');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };
  
  const login = (username: string, password: string): boolean => {
    console.log('Login attempt with username:', username);
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      console.log('Login successful');
      setIsAuthenticated(true);
      return true;
    }
    console.log('Login failed');
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
  };
  
  const updateContent = (newContent: Partial<SiteContent>) => {
    const updatedContent = { ...siteContent, ...newContent };
    setSiteContent(updatedContent);
    saveContentToAPI(updatedContent);
  };
  
  const updatePageContent = (page: keyof SiteContent['pages'], newContent: any) => {
    const updatedContent = {
      ...siteContent,
      pages: {
        ...siteContent.pages,
        [page]: {
          ...siteContent.pages[page],
          ...newContent
        }
      }
    };
    setSiteContent(updatedContent);
    saveContentToAPI(updatedContent);
  };
  
  return (
    <AdminContext.Provider value={{ 
      isAuthenticated,
      login,
      logout,
      siteContent,
      updateContent,
      updatePageContent,
      isSaving
    }}>
      {children}
    </AdminContext.Provider>
  );
};
