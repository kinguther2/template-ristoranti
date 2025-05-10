import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import { Facebook, Instagram, Menu as MenuIcon, X, MapPin, Phone, Clock, Mail } from 'lucide-react';

// Componente per l'icona WhatsApp
const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement> & { size?: number }> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, siteContent } = useAdmin();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'it' ? 'en' : 'it');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/menu', label: t('nav.menu') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/staff', label: t('nav.staff') },
    { path: '/contact', label: t('nav.contact') },
  ];

  if (isAuthenticated) {
    navLinks.push({ path: '/admin', label: t('nav.admin') });
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Navbar Dark Modern Style */}
      <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="font-serif text-xl md:text-2xl font-bold text-white">
              <span className="text-amber-400">{siteContent.general.siteName[language].split(' ')[0]}</span> {siteContent.general.siteName[language].split(' ').slice(1).join(' ')}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors duration-200 hover:text-amber-400 px-2 py-1 ${
                    location.pathname === link.path 
                      ? 'text-amber-400 border-b-2 border-amber-400' 
                      : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="ml-2 px-3 py-1 rounded-full bg-amber-400 text-gray-900 hover:bg-amber-500 transition-colors duration-300 font-medium"
              >
                {language === 'it' ? 'EN' : 'IT'}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-amber-400 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md ${
                    location.pathname === link.path
                      ? 'bg-amber-400 text-gray-900 font-medium'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 text-gray-300"
              >
                {language === 'it' ? 'Switch to English' : 'Passa all\'italiano'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer - Dark Modern Style */}
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand & Description */}
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-xl font-serif mb-4">
                <span className="text-amber-400">{siteContent.general.siteName[language].split(' ')[0]}</span> {siteContent.general.siteName[language].split(' ').slice(1).join(' ')}
              </h2>
              <p className="text-gray-400 mb-4 text-sm">
                {language === 'it' 
                  ? 'Sapori autentici e tradizione italiana in ogni piatto. La nostra passione è servirvi il meglio.'
                  : 'Authentic flavors and Italian tradition in every dish. Our passion is to serve you the best.'}
              </p>
            </div>

            {/* Contatti */}
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-lg font-medium mb-4 text-amber-400">{t('contact.title')}</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin size={18} className="text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{language === 'it' ? siteContent.pages.contact.address.it : siteContent.pages.contact.address.en}</span>
                </li>
                <li className="flex items-start">
                  <Phone size={18} className="text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{siteContent.pages.contact.phone}</span>
                </li>
                <li className="flex items-start">
                  <WhatsAppIcon size={18} className="text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{siteContent.pages.contact.social.whatsapp?.replace('https://wa.me/', '')}</span>
                </li>
                <li className="flex items-start">
                  <Mail size={18} className="text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{siteContent.pages.contact.email}</span>
                </li>
              </ul>
            </div>

            {/* Orari di Apertura */}
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-lg font-medium mb-4 text-amber-400">{t('contact.hours')}</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Clock size={18} className="text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-gray-300">
                      <span className="text-white">{t('contact.monday')} - {t('contact.friday')}:</span><br />
                      12:00 - 15:00, 19:00 - 23:00
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock size={18} className="text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-gray-300">
                      <span className="text-white">{t('contact.saturday')}:</span><br />
                      12:00 - 15:30, 19:00 - 23:30
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock size={18} className="text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-gray-300">
                      <span className="text-white">{t('contact.sunday')}:</span><br />
                      12:00 - 15:30, 19:00 - 22:00
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Icons */}
          <div className="mt-8 flex justify-center space-x-6">
            <a href={siteContent.pages.contact.social.facebook} target="_blank" rel="noopener noreferrer" 
              className="bg-gray-800 hover:bg-amber-400 hover:text-gray-900 p-2 rounded-full transition-colors duration-300">
              <Facebook size={22} />
            </a>
            <a href={siteContent.pages.contact.social.instagram} target="_blank" rel="noopener noreferrer" 
              className="bg-gray-800 hover:bg-amber-400 hover:text-gray-900 p-2 rounded-full transition-colors duration-300">
              <Instagram size={22} />
            </a>
            <a href={siteContent.pages.contact.social.whatsapp} target="_blank" rel="noopener noreferrer" 
              className="bg-gray-800 hover:bg-amber-400 hover:text-gray-900 p-2 rounded-full transition-colors duration-300">
              <WhatsAppIcon size={22} />
            </a>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} {siteContent.general.siteName[language]}. {language === 'it' ? 'Tutti i diritti riservati.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
