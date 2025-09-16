import React, { useState, useRef, useEffect } from 'react';
import { FileText, Eye, Trash2, X, Download, Upload, Image } from 'lucide-react';
import { Document, deleteDocument, getDocumentDetails } from '../services/documentsService';
import { Image as ImageType, deleteImage, getImageDetails } from '../services/imagesService';

interface DocumentsListProps {
  documents: Document[];
  images: ImageType[];
  isLoading: boolean;
  onRefresh: () => void;
  showUploadButton?: boolean;
  onUploadClick?: () => void;
  searchPlaceholder?: string;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  images,
  isLoading,
  onRefresh,
  showUploadButton = false,
  onUploadClick,
  searchPlaceholder = "Search through documents..."
}) => {
  const [viewType, setViewType] = useState<'documents' | 'images'>('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string>('');
  const [deleteItemName, setDeleteItemName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const deleteModalRef = useRef<HTMLDivElement>(null);
  const detailsModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
        setShowDeleteConfirm(false);
      }
      if (detailsModalRef.current && !detailsModalRef.current.contains(event.target as Node)) {
        setShowItemDetails(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteClick = (itemId: string, filename: string) => {
    setDeleteItemId(itemId);
    setDeleteItemName(filename);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      if (viewType === 'documents') {
        await deleteDocument(deleteItemId);
      } else {
        await deleteImage(deleteItemId);
      }
      onRefresh();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error(`Failed to delete ${viewType.slice(0, -1)}:`, error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenItem = async (itemId: string) => {
    setIsLoadingDetails(true);
    setShowItemDetails(true);
    try {
      const details = viewType === 'documents' 
        ? await getDocumentDetails(itemId)
        : await getImageDetails(itemId);
      
      // Get filename from list item if not in details
      const listItem = currentItems.find(item => 
        viewType === 'documents' ? (item as Document).documentId === itemId : (item as ImageType).imageId === itemId
      );
      
      setSelectedItem({
        ...details,
        filename: details.filename || listItem?.filename
      });
    } catch (error) {
      console.error(`Failed to load ${viewType.slice(0, -1)} details:`, error);
      setShowItemDetails(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    switch (type) {
      case 'pdf':
        return <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-[10px] font-bold">PDF</div>;
      case 'doc':
      case 'docx':
        return <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-[10px] font-bold">DOC</div>;
      case 'xls':
      case 'xlsx':
        return <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-[10px] font-bold">XLS</div>;
      case 'txt':
        return <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-white text-[10px] font-bold">TXT</div>;
      case 'csv':
        return <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-[10px] font-bold">CSV</div>;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-[10px] font-bold">IMG</div>;
      case 'epub':
        return <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white text-[10px] font-bold">EPB</div>;
      default:
        return <FileText className="w-8 h-8 text-gray-400" />;
    }
  };

  const currentItems = viewType === 'documents' ? documents : images;
  const filteredItems = currentItems.filter(item =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-gray-900/50 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          {/* View Type Slider */}
          <div className="flex items-center bg-gray-800 p-1 rounded-lg">
            <button 
              onClick={() => setViewType('documents')}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
                viewType === 'documents' 
                  ? 'text-white bg-gray-700' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              Docs
            </button>
            <button 
              onClick={() => setViewType('images')}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
                viewType === 'images' 
                  ? 'text-white bg-gray-700' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Image className="w-4 h-4" />
              Images
            </button>
          </div>
          
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder={searchPlaceholder}
            />
          </div>
          <button 
            onClick={() => console.log('Search:', searchQuery)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>
          {showUploadButton && onUploadClick && (
            <button 
              onClick={onUploadClick}
              className="bg-green-400 text-black font-bold py-3 px-4 rounded-lg hover:bg-green-300 transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-gray-400 text-sm font-medium border-b border-gray-700 mb-2">
          <div className="col-span-4">Name</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            {viewType === 'documents' ? (
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            ) : (
              <Image className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            )}
            <p className="text-gray-400">
              {searchQuery ? `No ${viewType} match your search.` : `No ${viewType} found.`}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-0">
              {filteredItems.slice(0, 10).map((item) => {
                const itemId = viewType === 'documents' ? (item as Document).documentId : (item as ImageType).imageId;
                return (
                  <div key={itemId} className="grid grid-cols-12 gap-4 items-center px-4 py-3 hover:bg-gray-800/50 transition-colors border-b border-gray-800/30">
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      {viewType === 'documents' ? getFileIcon((item as Document).fileType) : <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-[10px] font-bold">IMG</div>}
                      <span className="text-white font-medium text-sm truncate">{item.filename}</span>
                    </div>
                    <div className="col-span-2 text-gray-400 text-sm">{formatFileSize(item.fileSize)}</div>
                    <div className="col-span-2 flex items-center gap-2">
                      {(viewType === 'documents' && item.status === 'processed') || (viewType === 'images' && (item.status === 'generated' || item.status === 'uploaded')) ? (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-green-400 text-sm">Complete</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-yellow-400 text-sm">Processing</span>
                        </>
                      )}
                    </div>
                    <div className="col-span-2 text-gray-400 text-sm">{new Date(item.createdAt).toLocaleDateString()}</div>
                    <div className="col-span-2 flex items-center gap-2 justify-end">
                      <button 
                        onClick={() => handleOpenItem(itemId)}
                        className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium py-1 px-2 rounded-md transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        Open
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(itemId, item.filename)}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-1 px-2 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Showing 1-{Math.min(10, filteredItems.length)} of {filteredItems.length} {viewType}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={deleteModalRef} className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Delete Document</h2>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-medium text-white">{deleteItemName}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {showItemDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={detailsModalRef} className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">{viewType === 'documents' ? 'Document' : 'Image'} Details</h2>
              <button 
                onClick={() => setShowItemDetails(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {isLoadingDetails ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : selectedItem ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Filename</label>
                      <p className="text-white">{selectedItem.filename}</p>
                    </div>
                    {viewType === 'documents' && selectedItem.fileType && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">File Type</label>
                        <p className="text-white">{selectedItem.fileType}</p>
                      </div>
                    )}
                    {viewType === 'images' && selectedItem.prompt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Prompt</label>
                        <p className="text-white">{selectedItem.prompt}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">File Size</label>
                      <p className="text-white">{formatFileSize(selectedItem.fileSize)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                      <p className={`${(viewType === 'documents' && selectedItem.status === 'processed') || (viewType === 'images' && (selectedItem.status === 'generated' || selectedItem.status === 'uploaded')) ? 'text-green-400' : 'text-yellow-400'}`}>
                        {(viewType === 'documents' && selectedItem.status === 'processed') || (viewType === 'images' && (selectedItem.status === 'generated' || selectedItem.status === 'uploaded')) ? 'Complete' : 'Processing'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Created At</label>
                      <p className="text-white">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                    </div>
                    {viewType === 'documents' && selectedItem.chunkCount && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Chunk Count</label>
                        <p className="text-white">{selectedItem.chunkCount}</p>
                      </div>
                    )}
                    {viewType === 'images' && selectedItem.provider && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Provider</label>
                        <p className="text-white">{selectedItem.provider}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{viewType === 'documents' ? 'Document' : 'Image'} ID</label>
                    <p className="text-white font-mono text-sm">{viewType === 'documents' ? selectedItem.documentId : selectedItem.imageId}</p>
                  </div>
                  {selectedItem.downloadUrl && (
                    <div className="pt-4 border-t border-gray-700">
                      <a 
                        href={selectedItem.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors inline-flex"
                      >
                        <Download className="w-4 h-4" />
                        Download File
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">Failed to load {viewType.slice(0, -1)} details</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};