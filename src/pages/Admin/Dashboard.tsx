import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useLanguage } from '../../context/LanguageContext';
import ContentEditor from './components/ContentEditor';

type Page = 'home' | 'menu' | 'gallery' | 'staff' | 'contact' | 'settings' | 'translations';

const Dashboard: React.FC = () => {
  const { logout, siteContent } = useAdmin();
  const { t } = useLanguage();
  const [activePage, setActivePage] = useState<Page>('home');

  useEffect(() => {
    console.log('Admin Dashboard component loaded');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen shadow-md fixed">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-serif font-bold text-primary">
              {t('admin.title')}
            </h1>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActivePage('home')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activePage === 'home' ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'}`}
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('menu')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activePage === 'menu' ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'}`}
                >
                  {t('nav.menu')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('gallery')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activePage === 'gallery' ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'}`}
                >
                  {t('nav.gallery')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('staff')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activePage === 'staff' ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'}`}
                >
                  {t('nav.staff')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activePage === 'contact' ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'}`}
                >
                  {t('nav.contact')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('settings')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activePage === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'}`}
                >
                  {t('admin.settings')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('translations')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activePage === 'translations' ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'}`}
                >
                  {t('admin.translations')}
                </button>
              </li>
            </ul>
            
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                {t('admin.logout')}
              </button>
            </div>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="ml-64 w-full p-8">
          <ContentEditor page={activePage} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
