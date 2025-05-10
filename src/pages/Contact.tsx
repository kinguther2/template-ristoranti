
import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Contact as ContactIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

const Contact: React.FC = () => {
  const { t, language } = useLanguage();
  const { siteContent } = useAdmin();
  const contactInfo = siteContent.pages.contact;

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
          {t('contact.title')}
        </motion.h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-serif mb-6">{t('contact.subtitle')}</h2>
          
          <div className="space-y-6">
            {/* Address */}
            <div className="flex items-start">
              <div className="bg-primary rounded-full p-2 text-primary-foreground mr-4">
                <ContactIcon size={24} />
              </div>
              <div>
                <h3 className="font-medium">{t('contact.address')}</h3>
                <p>{language === 'it' ? contactInfo.address.it : contactInfo.address.en}</p>
              </div>
            </div>
            
            {/* Phone */}
            <div className="flex items-start">
              <div className="bg-primary rounded-full p-2 text-primary-foreground mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">{t('contact.phone')}</h3>
                <p>{contactInfo.phone}</p>
              </div>
            </div>
            
            {/* Hours */}
            <div className="mt-8">
              <h3 className="text-xl font-serif mb-4">{t('contact.hours')}</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">{t('contact.monday')}</div>
                <div>{contactInfo.hours.monday.open} - {contactInfo.hours.monday.close}</div>
                
                <div className="font-medium">{t('contact.tuesday')}</div>
                <div>{contactInfo.hours.tuesday.open} - {contactInfo.hours.tuesday.close}</div>
                
                <div className="font-medium">{t('contact.wednesday')}</div>
                <div>{contactInfo.hours.wednesday.open} - {contactInfo.hours.wednesday.close}</div>
                
                <div className="font-medium">{t('contact.thursday')}</div>
                <div>{contactInfo.hours.thursday.open} - {contactInfo.hours.thursday.close}</div>
                
                <div className="font-medium">{t('contact.friday')}</div>
                <div>{contactInfo.hours.friday.open} - {contactInfo.hours.friday.close}</div>
                
                <div className="font-medium">{t('contact.saturday')}</div>
                <div>{contactInfo.hours.saturday.open} - {contactInfo.hours.saturday.close}</div>
                
                <div className="font-medium">{t('contact.sunday')}</div>
                <div>{contactInfo.hours.sunday.open} - {contactInfo.hours.sunday.close}</div>
              </div>
            </div>
            
            {/* Social */}
            <div className="mt-8">
              <h3 className="text-xl font-serif mb-4">{t('contact.social')}</h3>
              <div className="flex space-x-4">
                <a href={contactInfo.social.facebook} target="_blank" rel="noopener noreferrer" className="bg-gray-100 rounded-full p-3 hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Facebook size={24} />
                </a>
                <a href={contactInfo.social.instagram} target="_blank" rel="noopener noreferrer" className="bg-gray-100 rounded-full p-3 hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Instagram size={24} />
                </a>
                <a href={contactInfo.social.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-gray-100 rounded-full p-3 hover:bg-primary hover:text-primary-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Map */}
        <motion.div
          className="bg-gray-200 rounded-lg overflow-hidden h-[500px]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <p className="text-gray-600">Map placeholder - Would integrate Google Maps here</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
