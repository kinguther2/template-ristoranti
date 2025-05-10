import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { useLanguage } from '../../../context/LanguageContext';
import { toast } from 'sonner';
import {
  ContentHome,
  ContentMenu,
  ContentGallery,
  ContentStaff,
  ContentContact,
  ContentSettings,
  ContentTranslations
} from './ContentEditorComponents/index';

interface ContentEditorProps {
  page: 'home' | 'menu' | 'gallery' | 'staff' | 'contact' | 'settings' | 'translations';
}

const ContentEditor: React.FC<ContentEditorProps> = ({ page }) => {
  const { siteContent, updateContent, updatePageContent, isSaving: isSavingContent } = useAdmin();
  const { t, language, setLanguage, translations, setTranslations, isSaving: isSavingTranslations } = useLanguage();
  
  // State to handle editing specific items
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<any>(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [itemType, setItemType] = useState<'category' | 'menuItem' | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Determine if any saving operations are in progress
  const isSaving = isSavingContent || isSavingTranslations;
  
  // Start editing an item
  const startEditing = (key: string, content: any) => {
    setEditingItem(key);
    setEditedContent(JSON.parse(JSON.stringify(content))); // Deep clone
    setIsAddingNewItem(false);
    setItemType(null);
  };
  
  // Start adding a new item
  const startAddingItem = (type: 'category' | 'menuItem') => {
    setEditingItem(null);
    setIsAddingNewItem(true);
    setItemType(type);
    
    if (type === 'category') {
      setEditedContent({
        id: `category_${Date.now()}`,
        name: { it: '', en: '' }
      });
    } else if (type === 'menuItem') {
      setEditedContent({
        id: `item_${Date.now()}`,
        name: { it: '', en: '' },
        description: { it: '', en: '' },
        price: '',
        category: siteContent.pages.menu.categories[0]?.id || ''
      });
    }
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingItem(null);
    setEditedContent(null);
    setIsAddingNewItem(false);
    setItemType(null);
  };

  // Start delete confirmation for an item
  const confirmDelete = (id: string, type: 'category' | 'menuItem') => {
    setShowDeleteConfirm(`${type}.${id}`);
  };

  // Cancel delete confirmation
  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  // Delete menu item or category
  const deleteItem = () => {
    if (!showDeleteConfirm) return;
    
    const [type, id] = showDeleteConfirm.split('.');
    
    if (type === 'category') {
      // Check if any menu items are using this category
      const itemsUsingCategory = siteContent.pages.menu.items.filter(
        item => item.category === id
      );
      
      if (itemsUsingCategory.length > 0) {
        toast.error(`Cannot delete category. ${itemsUsingCategory.length} menu items are using this category.`);
        setShowDeleteConfirm(null);
        return;
      }
      
      // Remove the category
      const updatedCategories = siteContent.pages.menu.categories.filter(
        category => category.id !== id
      );
      
      updatePageContent('menu', { categories: updatedCategories });
    } else if (type === 'menuItem') {
      // Remove the menu item
      const updatedItems = siteContent.pages.menu.items.filter(
        item => item.id !== id
      );
      
      updatePageContent('menu', { items: updatedItems });
    }
    
    setShowDeleteConfirm(null);
  };
  
  // Handle input changes for editing
  const handleInputChange = (field: string, value: any) => {
    if (editedContent) {
      if (typeof editedContent === 'object') {
        // Handle nested fields like name.it
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          setEditedContent({
            ...editedContent,
            [parent]: {
              ...editedContent[parent],
              [child]: value
            }
          });
        } else {
          setEditedContent({
            ...editedContent,
            [field]: value
          });
        }
      } else {
        setEditedContent(value);
      }
    }
  };
  
  // Save edited content
  const saveContent = () => {
    if (isAddingNewItem && itemType && editedContent) {
      // Handle adding new items
      if (itemType === 'category') {
        const updatedCategories = [...siteContent.pages.menu.categories, editedContent];
        updatePageContent('menu', {
          categories: updatedCategories
        });
      } else if (itemType === 'menuItem') {
        const updatedItems = [...siteContent.pages.menu.items, editedContent];
        updatePageContent('menu', {
          items: updatedItems
        });
      }
      
      setIsAddingNewItem(false);
      setItemType(null);
      setEditedContent(null);
      return;
    }
    
    if (editingItem && editedContent) {
      if (page === 'translations') {
        // Update translations
        setTranslations({
          ...translations,
          [editingItem]: editedContent
        });
      } else if (page === 'settings' && editingItem === 'siteName') {
        // Direct update for settings page
        updateContent({
          general: {
            ...siteContent.general,
            siteName: editedContent
          }
        });
      } else if (editingItem.includes('.')) {
        // Handle nested content with multiple levels of nesting
        const parts = editingItem.split('.');
        
        if (parts.length === 2) {
          const [section, key] = parts;
          
          // Special handling for menu items and categories
          if (page === 'menu' && (section === 'categories' || section === 'items')) {
            const items = [...siteContent.pages.menu[section]];
            const itemIndex = items.findIndex(item => item.id === key);
            
            if (itemIndex !== -1) {
              items[itemIndex] = editedContent;
              updatePageContent('menu', { [section]: items });
            }
          } else if (page === 'staff' && section === 'team') {
            // Handle staff member updates
            const team = [...siteContent.pages.staff.team];
            const memberIndex = team.findIndex(member => member.id === key);
            
            if (memberIndex !== -1) {
              team[memberIndex] = editedContent;
              updatePageContent('staff', { team });
            }
          } else if (page === 'contact' && section === 'hours') {
            // Handle contact hours updates
            const hours = { ...siteContent.pages.contact.hours };
            hours[key] = editedContent;
            updatePageContent('contact', { hours });
          } else if (page === 'settings' && section === 'general') {
            // Handle settings updates
            const general = { ...siteContent.general };
            general[key] = editedContent;
            updateContent({ general });
          } else {
            // Regular two-level nesting (e.g., "hero.title")
            updatePageContent(page as any, {
              [section]: {
                ...siteContent.pages[page as keyof typeof siteContent.pages][section as any],
                [key]: editedContent
              }
            });
          }
        } else if (parts.length === 3) {
          // Three-level nesting (e.g., "sections.about.title")
          const [section, subsection, key] = parts;

          if (page === 'gallery' && section === 'images') {
            // Handle gallery image updates
            const images = [...siteContent.pages.gallery.images];
            const imageIndex = images.findIndex(img => img.id === subsection);
            
            if (imageIndex !== -1) {
              // Update only the specific field (src, alt, etc.)
              images[imageIndex] = {
                ...images[imageIndex],
                [key]: editedContent
              };
              updatePageContent('gallery', { images });
            }
          } else if (page === 'staff' && section === 'team') {
            // Handle staff member image/field updates
            const team = [...siteContent.pages.staff.team];
            const memberIndex = team.findIndex(member => member.id === subsection);
            
            if (memberIndex !== -1) {
              // Update only the specific field
              team[memberIndex] = {
                ...team[memberIndex],
                [key]: editedContent
              };
              updatePageContent('staff', { team });
            }
          } else if (page === 'contact' && section === 'social') {
            // Handle contact social media updates
            const social = { ...siteContent.pages.contact.social };
            social[subsection] = editedContent;
            updatePageContent('contact', { social });
          } else {
            // Default case for other three-level nesting
            updatePageContent(page as any, {
              [section]: {
                ...siteContent.pages[page as keyof typeof siteContent.pages][section as any],
                [subsection]: {
                  ...siteContent.pages[page as keyof typeof siteContent.pages][section as any][subsection as any],
                  [key]: editedContent
                }
              }
            });
          }
        }
      } else {
        // Handle top-level content
        updatePageContent(page as any, {
          [editingItem]: editedContent
        });
      }
      
      setEditingItem(null);
      setEditedContent(null);
    }
  };

  // Render form fields based on data type
  const renderEditForm = () => {
    if (isAddingNewItem && itemType) {
      // Render form for new items
      if (itemType === 'category') {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add New Category</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID</label>
              <input
                type="text"
                value={editedContent.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name (Italian)</label>
              <input
                type="text"
                value={editedContent.name.it}
                onChange={(e) => handleInputChange('name.it', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name (English)</label>
              <input
                type="text"
                value={editedContent.name.en}
                onChange={(e) => handleInputChange('name.en', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        );
      } else if (itemType === 'menuItem') {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add New Menu Item</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID</label>
              <input
                type="text"
                value={editedContent.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name (Italian)</label>
              <input
                type="text"
                value={editedContent.name.it}
                onChange={(e) => handleInputChange('name.it', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name (English)</label>
              <input
                type="text"
                value={editedContent.name.en}
                onChange={(e) => handleInputChange('name.en', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description (Italian)</label>
              <textarea
                value={editedContent.description.it}
                onChange={(e) => handleInputChange('description.it', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description (English)</label>
              <textarea
                value={editedContent.description.en}
                onChange={(e) => handleInputChange('description.en', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (€)</label>
              <input
                type="text"
                value={editedContent.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={editedContent.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              >
                {siteContent.pages.menu.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {language === 'it' ? category.name.it : category.name.en}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      }
    }
    
    if (!editingItem || !editedContent) return null;
    
    // Check if we're editing an image path
    if (
      editingItem === 'hero.backgroundImage' || 
      editingItem === 'sections.about.image' ||
      editingItem.includes('.src') ||
      (editingItem.includes('.image') && typeof editedContent === 'string')
    ) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Edit Image</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image Path</label>
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          {editedContent && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-2">Preview:</p>
              <div className="border border-gray-200 rounded-md p-2 max-w-xs">
                <img 
                  src={editedContent} 
                  alt="Preview" 
                  className="max-h-40 object-contain mx-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                    (e.target as HTMLImageElement).alt = 'Image not found';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      );
    }

    // For featured items array
    if (editingItem === 'sections.featured.items' && Array.isArray(editedContent)) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Featured Dishes</h3>
          <p className="text-sm text-gray-500">
            You've selected {editedContent.length} dishes to feature on the home page.
          </p>
          <div className="mt-2 max-h-80 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {editedContent.map((item: any) => (
                <li key={item.id} className="py-2">
                  <div className="flex items-center">
                    <span className="font-medium">
                      {language === 'it' ? item.name.it : item.name.en}
                    </span>
                    <span className="ml-auto text-sm text-gray-500">€{item.price}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {language === 'it' ? item.description.it : item.description.en}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    
    // For menu categories and items
    if (page === 'menu') {
      const [section, id] = editingItem.split('.');
      
      if (section === 'categories') {
        // Edit category
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Edit Category</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID</label>
              <input
                type="text"
                value={editedContent.id || id}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name (Italian)</label>
              <input
                type="text"
                value={editedContent.it}
                onChange={(e) => handleInputChange('it', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name (English)</label>
              <input
                type="text"
                value={editedContent.en}
                onChange={(e) => handleInputChange('en', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        );
      } else if (section === 'items') {
        // Edit menu item
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Edit Menu Item</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID</label>
              <input
                type="text"
                value={editedContent.id}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name (Italian)</label>
              <input
                type="text"
                value={editedContent.name.it}
                onChange={(e) => handleInputChange('name.it', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name (English)</label>
              <input
                type="text"
                value={editedContent.name.en}
                onChange={(e) => handleInputChange('name.en', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description (Italian)</label>
              <textarea
                value={editedContent.description.it}
                onChange={(e) => handleInputChange('description.it', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description (English)</label>
              <textarea
                value={editedContent.description.en}
                onChange={(e) => handleInputChange('description.en', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (€)</label>
              <input
                type="text"
                value={editedContent.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={editedContent.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              >
                {siteContent.pages.menu.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {language === 'it' ? category.name.it : category.name.en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="text"
                value={editedContent.image || ''}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
              {editedContent.image && (
                <div className="mt-2">
                  <img 
                    src={editedContent.image} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded-md mt-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                      (e.target as HTMLImageElement).alt = 'Image not found';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      }
    }
    
    if (page === 'translations') {
      // Handle translations editing
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Italian</label>
            <input
              type="text"
              value={editedContent.it}
              onChange={(e) => handleInputChange('it', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">English</label>
            <input
              type="text"
              value={editedContent.en}
              onChange={(e) => handleInputChange('en', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      );
    }
    
    // Handle normal content editing based on types
    if (typeof editedContent === 'string') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      );
    } else if (typeof editedContent === 'object') {
      if (editedContent.it !== undefined && editedContent.en !== undefined) {
        // Multilingual content
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Italian</label>
              {typeof editedContent.it === 'string' ? (
                <input
                  type="text"
                  value={editedContent.it}
                  onChange={(e) => handleInputChange('it', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              ) : (
                <textarea
                  value={editedContent.it}
                  onChange={(e) => handleInputChange('it', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  rows={4}
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">English</label>
              {typeof editedContent.en === 'string' ? (
                <input
                  type="text"
                  value={editedContent.en}
                  onChange={(e) => handleInputChange('en', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              ) : (
                <textarea
                  value={editedContent.en}
                  onChange={(e) => handleInputChange('en', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  rows={4}
                />
              )}
            </div>
          </div>
        );
      }
    }

    // Handle staff member editing
    if (page === 'staff' && editingItem?.startsWith('team.')) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Edit Team Member</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={editedContent.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role (Italian)</label>
            <input
              type="text"
              value={editedContent.role?.it}
              onChange={(e) => handleInputChange('role.it', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role (English)</label>
            <input
              type="text"
              value={editedContent.role?.en}
              onChange={(e) => handleInputChange('role.en', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio (Italian)</label>
            <textarea
              value={editedContent.bio?.it}
              onChange={(e) => handleInputChange('bio.it', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio (English)</label>
            <textarea
              value={editedContent.bio?.en}
              onChange={(e) => handleInputChange('bio.en', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="text"
              value={editedContent.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
            {editedContent.image && (
              <div className="mt-2">
                <img 
                  src={editedContent.image} 
                  alt="Preview" 
                  className="h-20 w-20 object-cover rounded-md mt-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                    (e.target as HTMLImageElement).alt = 'Image not found';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    // Handle contact hours editing
    if (page === 'contact' && editingItem?.startsWith('hours.')) {
      const day = editingItem.split('.')[1];
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Edit Opening Hours for {t(`contact.${day}`)}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Opening Time</label>
            <input
              type="time"
              value={editedContent.open}
              onChange={(e) => handleInputChange('open', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Closing Time</label>
            <input
              type="time"
              value={editedContent.close}
              onChange={(e) => handleInputChange('close', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      );
    }

    // Handle settings editing
    if (page === 'settings' && editingItem === 'siteName') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Edit Site Name</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Name (Italian)</label>
            <input
              type="text"
              value={editedContent.it}
              onChange={(e) => handleInputChange('it', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Site Name (English)</label>
            <input
              type="text"
              value={editedContent.en}
              onChange={(e) => handleInputChange('en', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      );
    }
    
    return <p className="text-gray-500">This content type cannot be edited directly.</p>;
  };
  
  // Render content for the selected page
  const renderContent = () => {
    switch (page) {
      case 'home':
        return (
          <ContentHome 
            siteContent={siteContent} 
            language={language} 
            t={t} 
            startEditing={startEditing} 
          />
        );
        
      case 'menu':
        return (
          <ContentMenu 
            siteContent={siteContent} 
            language={language} 
            t={t} 
            startEditing={startEditing} 
            startAddingItem={startAddingItem}
            confirmDelete={confirmDelete}
          />
        );
        
      case 'gallery':
        return (
          <ContentGallery 
            siteContent={siteContent} 
            language={language} 
            t={t} 
            startEditing={startEditing} 
          />
        );
        
      case 'staff':
        return (
          <ContentStaff 
            siteContent={siteContent} 
            language={language} 
            t={t} 
            startEditing={startEditing} 
          />
        );
        
      case 'contact':
        return (
          <ContentContact 
            siteContent={siteContent} 
            language={language} 
            t={t} 
            startEditing={startEditing} 
          />
        );
        
      case 'settings':
        return (
          <ContentSettings 
            siteContent={siteContent} 
            language={language} 
            t={t} 
            startEditing={startEditing} 
          />
        );
        
      case 'translations':
        return (
          <ContentTranslations 
            siteContent={siteContent} 
            language={language} 
            t={t} 
            startEditing={startEditing}
            translations={translations} 
          />
        );
        
      default:
        return <div>Select a page to edit</div>;
    }
  };

  return (
    <div>
      {/* Saving indicator */}
      {isSaving && (
        <div className="fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-md shadow-md z-50 flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t('admin.saving')}
        </div>
      )}
      
      {renderContent()}
      
      {/* Edit Dialog */}
      {(editingItem || isAddingNewItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-medium mb-4">
              {isAddingNewItem 
                ? (itemType === 'category' ? 'Add New Category' : 'Add New Menu Item') 
                : 'Edit Content'}
            </h3>
            <div className="mb-6">
              {renderEditForm()}
            </div>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={cancelEditing} 
                className="btn btn-outline"
                disabled={isSaving}
              >
                {t('admin.cancel')}
              </button>
              <button 
                onClick={saveContent} 
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('admin.saving')}
                  </span>
                ) : t('admin.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-medium mb-4 text-red-600">Confirm Delete</h3>
            <p className="mb-6">
              {showDeleteConfirm.startsWith('category') 
                ? 'Are you sure you want to delete this category? This cannot be undone.'
                : 'Are you sure you want to delete this menu item? This cannot be undone.'}
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={cancelDelete} 
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={deleteItem} 
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
