import React, { useState, useEffect } from 'react';
import { Upload, File, FileText } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { DocumentsList } from './DocumentsList';
import { listDocuments, Document } from '../services/documentsService';

interface FileData {
  id: string;
  name: string;
  type: string;
  size: string;
  status: string;
  created: string;
  lastAccessed: Date;
}

interface UploadsScreenProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  navigateToUploads: () => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  navigateToQuery: () => void;
  navigateToLogin: () => void;
  currentUser: { firstName: string; lastName: string; email: string } | null;
  uploadView: 'upload' | 'allFiles';
  setUploadView: (view: 'upload' | 'allFiles') => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleUploadButtonClick: () => void;
  removeFile: (index: number) => void;
  formatFileSize: (bytes: number) => string;
  allFiles: FileData[];
  recentlyAccessedFiles: FileData[];
  filteredFiles: FileData[];
  getFileIcon: (type: string) => JSX.Element;
}

export const UploadsScreen: React.FC<UploadsScreenProps> = ({
  sidebarCollapsed,
  toggleSidebar,
  navigateToUploads,
  currentScreen,
  setCurrentScreen,
  navigateToQuery,
  navigateToLogin,
  currentUser,
  uploadView,
  setUploadView,
  selectedFiles,
  setSelectedFiles,
  searchQuery: externalSearchQuery,
  setSearchQuery: setExternalSearchQuery,
  handleUploadButtonClick,
  removeFile,
  formatFileSize: externalFormatFileSize,
  allFiles,
  recentlyAccessedFiles,
  filteredFiles,
  getFileIcon: externalGetFileIcon
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  useEffect(() => {
    if (uploadView === 'allFiles') {
      loadDocuments();
    }
  }, [uploadView]);

  const loadDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const response = await listDocuments();
      setDocuments(response.documents);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoadingDocs(false);
    }
  };



  return (
  <div className="bg-black text-white font-sans min-h-screen">
    <Sidebar 
      sidebarCollapsed={sidebarCollapsed}
      toggleSidebar={toggleSidebar}
      navigateToUploads={navigateToUploads}
      navigateToQuery={navigateToQuery}
      currentScreen={currentScreen}
      setCurrentScreen={setCurrentScreen}
      handleLogout={() => {
        console.log('🔓 UploadsScreen handleLogout called, currentUser:', currentUser);
        console.log('🔓 UploadsScreen calling navigateToLogin');
        navigateToLogin();
      }}
    />
    <div className={`flex flex-col min-h-screen ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 bg-black`}>
      <Navbar 
        currentScreen={currentScreen}
        currentUser={currentUser}
        navigateToLogin={navigateToLogin}
        onBackClick={navigateToQuery}
      />

      <main className="flex-1 flex flex-col p-6">
        <div className="w-full">
          
          <header className="text-center mb-10">
            {uploadView === 'upload' ? (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Upload Documents</h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Turn your files and data into captivating knowledge. Upload documents to enhance your DocHuman experience.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Search Documents</h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  AI-powered search across all your uploaded documents. Find exactly what you need with intelligent semantic search.
                </p>
              </>
            )}
          </header>

          <div className="w-full max-w-none mx-auto px-4">
            <div className="flex justify-center mb-6">
              <div className="flex items-center bg-gray-900 p-1 rounded-lg">
                <button 
                  onClick={() => setUploadView('upload')}
                  className={`px-6 py-2 text-sm font-semibold rounded-md flex items-center gap-2 transition-colors ${
                    uploadView === 'upload' 
                      ? 'text-white bg-gray-800' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <File className="w-4 h-4" />
                  File
                </button>
                <button 
                  onClick={() => setUploadView('allFiles')}
                  className={`px-6 py-2 text-sm font-semibold rounded-md flex items-center gap-2 transition-colors ${
                    uploadView === 'allFiles' 
                      ? 'text-white bg-gray-800' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  All Files
                </button>
              </div>
            </div>

            {uploadView === 'upload' ? (
              <>
                <div className="bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      {/* Document icons illustration */}
                      <div className="flex items-center justify-center space-x-2 transform -rotate-12">
                        <div className="bg-blue-500 p-3 rounded-lg shadow-lg transform rotate-12">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div className="bg-red-500 p-3 rounded-lg shadow-lg transform -rotate-6">
                          <File className="w-8 h-8 text-white" />
                        </div>
                        <div className="bg-orange-500 p-3 rounded-lg shadow-lg transform rotate-6">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Upload file(s) to your Knowledge Base</h3>
                  <p className="text-xs text-gray-500 mb-6 font-mono">[ .PDF, .CSV, .TXT, .epub, .docx, .xls, .PNG, .JPEG ]</p>
                  <button 
                    onClick={handleUploadButtonClick}
                    className="bg-green-400 text-black font-bold py-3 px-6 rounded-lg hover:bg-green-300 transition-all flex items-center gap-2 mx-auto"
                  >
                    <Upload className="w-4 h-4" />
                    Upload file
                  </button>
                </div>

                {/* Selected Files Display */}
                {selectedFiles.length > 0 && (
                  <div className="mt-6 bg-gray-900/30 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Selected Files ({selectedFiles.length})</h4>
                    <div className="space-y-3">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{file.name}</p>
                              <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-gray-400 hover:text-red-400 transition-colors p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button className="bg-green-400 text-black font-bold py-2 px-4 rounded-lg hover:bg-green-300 transition-all text-sm">
                        Process Files
                      </button>
                      <button 
                        onClick={() => setSelectedFiles([])}
                        className="bg-gray-700 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-600 transition-all text-sm"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <DocumentsList 
                documents={documents}
                isLoading={isLoadingDocs}
                onRefresh={loadDocuments}
                showUploadButton={true}
                onUploadClick={handleUploadButtonClick}
                searchPlaceholder="Search through all files"
              />
            )}
          </div>

        </div>
      </main>


    </div>
  </div>
  );
};