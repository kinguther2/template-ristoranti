import React from 'react';
import { ContentPageProps } from './types';
import EditableItem from './EditableItem';

interface Hours {
  open: string;
  close: string;
}

const ContentContact: React.FC<ContentPageProps> = ({ siteContent, language, t, startEditing }) => {
  return (
    <>
      <h2 className="text-2xl font-serif mb-6">{t('nav.contact')}</h2>
      <div className="space-y-8">
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Contact Information</h3>
          <div className="space-y-4">
            <EditableItem
              itemKey="address"
              content={siteContent.pages.contact.address}
              onEdit={startEditing}
              label="Address"
              language={language}
              t={t}
            />
            
            <EditableItem
              itemKey="phone"
              content={siteContent.pages.contact.phone}
              onEdit={startEditing}
              label="Phone"
              language={language}
              t={t}
            />
            
            <EditableItem
              itemKey="email"
              content={siteContent.pages.contact.email}
              onEdit={startEditing}
              label="Email"
              language={language}
              t={t}
            />
          </div>
        </section>
        
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Opening Hours</h3>
          <div className="space-y-4">
            {Object.entries(siteContent.pages.contact.hours).map(([day, hours]) => (
              <div key={day} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <span className="text-gray-500">{t(`contact.${day}`)}:</span>
                  <p className="font-medium">{(hours as Hours).open} - {(hours as Hours).close}</p>
                </div>
                <button 
                  onClick={() => startEditing(`hours.${day}`, hours)}
                  className="btn btn-outline btn-sm"
                >
                  {t('admin.edit')}
                </button>
              </div>
            ))}
          </div>
        </section>
        
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Social Media</h3>
          <div className="space-y-4">
            <EditableItem
              itemKey="social.facebook"
              content={siteContent.pages.contact.social.facebook}
              onEdit={startEditing}
              label="Facebook"
              language={language}
              t={t}
            />
            
            <EditableItem
              itemKey="social.instagram"
              content={siteContent.pages.contact.social.instagram}
              onEdit={startEditing}
              label="Instagram"
              language={language}
              t={t}
            />
            
            <EditableItem
              itemKey="social.whatsapp"
              content={siteContent.pages.contact.social.whatsapp}
              onEdit={startEditing}
              label="WhatsApp"
              language={language}
              t={t}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default ContentContact; 