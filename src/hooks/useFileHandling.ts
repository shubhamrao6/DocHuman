import { useState } from 'react';

export const useFileHandling = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);
    }
  };

  const handleUploadButtonClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.pdf,.csv,.txt,.epub,.docx,.xls,.xlsx,.png,.jpeg,.jpg';
    fileInput.onchange = (e) => handleFileUpload(e as any);
    fileInput.click();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return {
    selectedFiles,
    setSelectedFiles,
    handleUploadButtonClick,
    removeFile
  };
};