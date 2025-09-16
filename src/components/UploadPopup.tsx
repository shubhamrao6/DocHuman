import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Image, Plus } from 'lucide-react';
import { listKnowledgeDbs, KnowledgeDb } from '../services/knowledgeDbService';
import { apiService } from '../services/apiService';
import { getStoredAuth } from '../services/authService';

interface UploadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKnowledgeBase?: string;
  onCreateKnowledgeBase?: () => void;
}

export const UploadPopup: React.FC<UploadPopupProps> = ({
  isOpen,
  onClose,
  selectedKnowledgeBase,
  onCreateKnowledgeBase
}) => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeDb[]>([]);
  const [selectedKbId, setSelectedKbId] = useState<string>(selectedKnowledgeBase || '');
  const [uploadType, setUploadType] = useState<'documents' | 'images'>('documents');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadKnowledgeBases();
      setSelectedKbId(selectedKnowledgeBase || '');
    }
  }, [isOpen, selectedKnowledgeBase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const loadKnowledgeBases = async () => {
    try {
      const response = await listKnowledgeDbs();
      setKnowledgeBases(response.knowledgedbs);
      if (response.knowledgedbs.length > 0 && !selectedKbId) {
        setSelectedKbId(response.knowledgedbs[0].knowledgeDbId);
      }
    } catch (error) {
      console.error('Failed to load knowledge bases:', error);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedKbId || selectedFiles.length === 0) return;
    
    const auth = getStoredAuth();
    if (!auth?.idToken) {
      console.error('No authentication token available');
      return;
    }
    
    setIsUploading(true);
    try {
      const uploadPromises = selectedFiles.map(file => {
        if (uploadType === 'documents') {
          return apiService.uploadDocumentFile(auth.idToken, file, selectedKbId);
        } else {
          return apiService.uploadImageFile(auth.idToken, file, selectedKbId);
        }
      });
      
      await Promise.all(uploadPromises);
      
      // Reset and close
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAcceptedTypes = () => {
    return uploadType === 'documents' 
      ? '.pdf,.docx,.txt,.md'
      : '.png,.jpg,.jpeg,.gif,.webp';
  };

  const getFileTypeLabel = () => {
    return uploadType === 'documents'
      ? 'PDF, DOCX, TXT, MD'
      : 'PNG, JPG, JPEG, GIF, WebP';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Upload Files</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Knowledge Base Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Knowledge Base</label>
            {knowledgeBases.length === 0 ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-400">
                  No knowledge bases available
                </div>
                <button
                  onClick={onCreateKnowledgeBase}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create
                </button>
              </div>
            ) : (
              <select
                value={selectedKbId}
                onChange={(e) => setSelectedKbId(e.target.value)}
                disabled={selectedFiles.length > 0}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {knowledgeBases.map((kb) => (
                  <option key={kb.knowledgeDbId} value={kb.knowledgeDbId}>
                    {kb.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Upload Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Upload Type</label>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => selectedFiles.length === 0 && setUploadType('documents')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  uploadType === 'documents'
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-600 hover:border-gray-500'
                } ${
                  selectedFiles.length > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="font-medium text-white">Documents</h3>
                    <p className="text-xs text-gray-400">PDF, DOCX, TXT, MD</p>
                  </div>
                </div>
              </div>
              
              <div
                onClick={() => selectedFiles.length === 0 && setUploadType('images')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  uploadType === 'images'
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-600 hover:border-gray-500'
                } ${
                  selectedFiles.length > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Image className="w-6 h-6 text-purple-400" />
                  <div>
                    <h3 className="font-medium text-white">Images</h3>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF, WebP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Select Files</label>
            <div 
              onClick={handleFileSelect}
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-300 mb-1">Click to select files</p>
              <p className="text-xs text-gray-500">Supported: {getFileTypeLabel()}</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={getAcceptedTypes()}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Selected Files ({selectedFiles.length})
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {uploadType === 'documents' ? (
                        <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      ) : (
                        <Image className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm truncate">{file.name}</p>
                        <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedKbId || selectedFiles.length === 0 || isUploading}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};