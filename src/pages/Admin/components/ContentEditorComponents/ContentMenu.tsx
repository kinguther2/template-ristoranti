import React from 'react';
import { ContentPageProps } from './types';

interface ContentMenuProps extends ContentPageProps {
  startAddingItem?: (type: 'category' | 'menuItem') => void;
  confirmDelete?: (id: string, type: 'category' | 'menuItem') => void;
}

const ContentMenu: React.FC<ContentMenuProps> = ({ siteContent, language, t, startEditing, startAddingItem, confirmDelete }) => {
  return (
    <>
      <h2 className="text-2xl font-serif mb-6">{t('nav.menu')}</h2>
      <div className="space-y-8">
        {/* Categories */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Categories</h3>
            {startAddingItem && (
              <button
                onClick={() => startAddingItem('category')}
                className="btn btn-primary btn-sm"
              >
                Add Category
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (IT)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (EN)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {siteContent.pages.menu.categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{category.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{category.name.it}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{category.name.en}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button 
                        onClick={() => startEditing(`categories.${category.id}`, category.name)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {t('admin.edit')}
                      </button>
                      {confirmDelete && (
                        <button 
                          onClick={() => confirmDelete(category.id, 'category')}
                          className="text-red-600 hover:text-red-900 ml-3"
                        >
                          {t('admin.delete')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        
        {/* Menu Items */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Menu Items</h3>
            {startAddingItem && (
              <button
                onClick={() => startAddingItem('menuItem')}
                className="btn btn-primary btn-sm"
              >
                Add Menu Item
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {siteContent.pages.menu.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{language === 'it' ? item.name.it : item.name.en}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">€{item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button 
                        onClick={() => startEditing(`items.${item.id}`, item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {t('admin.edit')}
                      </button>
                      {confirmDelete && (
                        <button 
                          onClick={() => confirmDelete(item.id, 'menuItem')}
                          className="text-red-600 hover:text-red-900 ml-3"
                        >
                          {t('admin.delete')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContentMenu; 