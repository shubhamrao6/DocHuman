import React from 'react';
import { FileText } from 'lucide-react';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (type: string): JSX.Element => {
  switch (type) {
    case 'PDF':
      return React.createElement('div', { className: 'w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold' }, 'PDF');
    case 'DOCX':
      return React.createElement('div', { className: 'w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold' }, 'DOC');
    case 'CSV':
      return React.createElement('div', { className: 'w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold' }, 'CSV');
    case 'TXT':
      return React.createElement('div', { className: 'w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-white text-xs font-bold' }, 'TXT');
    case 'XLSX':
      return React.createElement('div', { className: 'w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white text-xs font-bold' }, 'XLS');
    default:
      return React.createElement(FileText, { className: 'w-8 h-8 text-gray-400' });
  }
};