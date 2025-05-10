import React from 'react';
import { EditableItemProps } from './types';

const EditableItem: React.FC<EditableItemProps> = ({ 
  itemKey, 
  content, 
  onEdit, 
  label, 
  language, 
  t 
}) => {
  const displayValue = typeof content === 'object' && content !== null 
    ? (language && content[language] ? content[language] : JSON.stringify(content)) 
    : content;

  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
      <div>
        <span className="text-gray-500">{label}:</span>
        <p className="font-medium">{displayValue}</p>
      </div>
      <button 
        onClick={() => onEdit(itemKey, content)}
        className="btn btn-outline btn-sm"
      >
        {t('admin.edit')}
      </button>
    </div>
  );
};

export default EditableItem; 