import React, { useState, useRef, useEffect } from 'react';
import { FileText, Eye, Trash2, X, Download, Upload } from 'lucide-react';
import { Document, deleteDocument, getDocumentDetails } from '../services/documentsService';

interface DocumentsListProps {
  documents: Document[];
  isLoading: boolean;
  onRefresh: () => void;
  showUploadButton?: boolean;
  onUploadClick?: () => void;
  searchPlaceholder?: string;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  isLoading,
  onRefresh,
  showUploadButton = false,
  onUploadClick,
  searchPlaceholder = "Search through documents..."
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState<string>('');
  const [deleteDocName, setDeleteDocName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDocDetails, setShowDocDetails] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const deleteModalRef = useRef<HTMLDivElement>(null);
  const detailsModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
        setShowDeleteConfirm(false);
      }
      if (detailsModalRef.current && !detailsModalRef.current.contains(event.target as Node)) {
        setShowDocDetails(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteClick = (documentId: string, filename: string) => {
    setDeleteDocId(documentId);
    setDeleteDocName(filename);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteDocument(deleteDocId);
      onRefresh();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete document:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenDocument = async (documentId: string) => {
    setIsLoadingDetails(true);
    setShowDocDetails(true);
    try {
      const details = await getDocumentDetails(documentId);
      setSelectedDoc(details);
    } catch (error) {
      console.error('Failed to load document details:', error);
      setShowDocDetails(false);
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

  const filteredDocuments = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-gray-900/50 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
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
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">
              {searchQuery ? 'No documents match your search.' : 'No documents found.'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-0">
              {filteredDocuments.slice(0, 10).map((doc) => (
                <div key={doc.documentId} className="grid grid-cols-12 gap-4 items-center px-4 py-3 hover:bg-gray-800/50 transition-colors border-b border-gray-800/30">
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    {getFileIcon(doc.fileType)}
                    <span className="text-white font-medium text-sm truncate">{doc.filename}</span>
                  </div>
                  <div className="col-span-2 text-gray-400 text-sm">{formatFileSize(doc.fileSize)}</div>
                  <div className="col-span-2 flex items-center gap-2">
                    {doc.status === 'processed' ? (
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
                  <div className="col-span-2 text-gray-400 text-sm">{new Date(doc.createdAt).toLocaleDateString()}</div>
                  <div className="col-span-2 flex items-center gap-2 justify-end">
                    <button 
                      onClick={() => handleOpenDocument(doc.documentId)}
                      className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium py-1 px-2 rounded-md transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      Open
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(doc.documentId, doc.filename)}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-1 px-2 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Showing 1-{Math.min(10, filteredDocuments.length)} of {filteredDocuments.length} documents
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
              Are you sure you want to delete <span className="font-medium text-white">{deleteDocName}</span>? This action cannot be undone.
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

      {/* Document Details Modal */}
      {showDocDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={detailsModalRef} className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Document Details</h2>
              <button 
                onClick={() => setShowDocDetails(false)}
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
              ) : selectedDoc ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Filename</label>
                      <p className="text-white">{selectedDoc.filename}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">File Type</label>
                      <p className="text-white">{selectedDoc.fileType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">File Size</label>
                      <p className="text-white">{formatFileSize(selectedDoc.fileSize)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                      <p className={`${selectedDoc.status === 'processed' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {selectedDoc.status === 'processed' ? 'Complete' : 'Processing'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Created At</label>
                      <p className="text-white">{new Date(selectedDoc.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Chunk Count</label>
                      <p className="text-white">{selectedDoc.chunkCount}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Document ID</label>
                    <p className="text-white font-mono text-sm">{selectedDoc.documentId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Knowledge Base ID</label>
                    <p className="text-white font-mono text-sm">{selectedDoc.knowledgeDbId}</p>
                  </div>
                  {selectedDoc.downloadUrl && (
                    <div className="pt-4 border-t border-gray-700">
                      <a 
                        href={selectedDoc.downloadUrl}
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
                <p className="text-gray-400 text-center py-4">Failed to load document details</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};