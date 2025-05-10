import React from 'react';
import { ContentPageProps } from './types';
import EditableItem from './EditableItem';

const ContentSettings: React.FC<ContentPageProps> = ({ siteContent, language, t, startEditing }) => {
  return (
    <>
      <h2 className="text-2xl font-serif mb-6">{t('admin.settings')}</h2>
      <div className="space-y-8">
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">General Settings</h3>
          <div className="space-y-4">
            <EditableItem
              itemKey="siteName"
              content={siteContent.general.siteName}
              onEdit={startEditing}
              label="Site Name"
              language={language}
              t={t}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default ContentSettings; 