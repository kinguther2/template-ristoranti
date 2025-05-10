import React from 'react';
import { ContentPageProps } from './types';
import EditableItem from './EditableItem';

const ContentStaff: React.FC<ContentPageProps> = ({ siteContent, language, t, startEditing }) => {
  return (
    <>
      <h2 className="text-2xl font-serif mb-6">{t('nav.staff')}</h2>
      <div className="space-y-8">
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Staff Settings</h3>
          <div className="space-y-4">
            <EditableItem
              itemKey="title"
              content={siteContent.pages.staff.title}
              onEdit={startEditing}
              label="Title"
              language={language}
              t={t}
            />
            
            <EditableItem
              itemKey="subtitle"
              content={siteContent.pages.staff.subtitle}
              onEdit={startEditing}
              label="Subtitle"
              language={language}
              t={t}
            />
          </div>
        </section>
        
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Team Members</h3>
          <div className="space-y-4">
            {siteContent.pages.staff.team.map((member) => (
              <div key={member.id} className="bg-gray-50 p-4 rounded-md flex gap-4">
                <div className="relative">
                  <img 
                    src={member.image || "/placeholder.svg"} 
                    alt={member.name} 
                    className="w-24 h-24 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <button 
                    onClick={() => startEditing(`team.${member.id}.image`, member.image)}
                    className="absolute bottom-1 right-1 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-primary-foreground"
                    title={t('admin.edit')}
                  >
                    ✎
                  </button>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-primary">{language === 'it' ? member.role.it : member.role.en}</p>
                  <p className="text-sm text-gray-600 mt-1">{language === 'it' ? member.bio.it : member.bio.en}</p>
                </div>
                <div>
                  <button 
                    onClick={() => startEditing(`team.${member.id}`, member)}
                    className="text-blue-600"
                  >
                    {t('admin.edit')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default ContentStaff; 