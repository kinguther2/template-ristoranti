import React from 'react';
import { ContentPageProps } from './types';

interface TranslationsProps extends ContentPageProps {
  translations: Record<string, { it: string; en: string }>;
}

const ContentTranslations: React.FC<TranslationsProps> = ({ t, startEditing, translations }) => {
  return (
    <>
      <h2 className="text-2xl font-serif mb-6">{t('admin.translations')}</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Italian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(translations).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-6 py-4 whitespace-nowrap">{key}</td>
                  <td className="px-6 py-4">{value.it}</td>
                  <td className="px-6 py-4">{value.en}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => startEditing(key, value)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {t('admin.edit')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ContentTranslations; 