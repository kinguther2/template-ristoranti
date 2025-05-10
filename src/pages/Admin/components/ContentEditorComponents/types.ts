import { ReactNode } from 'react';

export interface EditableItemProps {
  itemKey: string;
  content: any;
  onEdit: (key: string, content: any) => void;
  label: string;
  language: 'it' | 'en';
  t: (key: string) => string;
}

export interface ContentPageProps {
  siteContent: any;
  language: 'it' | 'en';
  t: (key: string) => string;
  startEditing: (key: string, content: any) => void;
  startAddingItem?: (type: 'category' | 'menuItem') => void;
  confirmDelete?: (id: string, type: 'category' | 'menuItem') => void;
  children?: ReactNode;
} 