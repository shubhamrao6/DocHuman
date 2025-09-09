import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronDown, Sparkles, Upload, File, FileText, User, LogOut } from 'lucide-react';
import { Sidebar } from './Sidebar';

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
  navigateToQuery,
  navigateToLogin,
  currentUser,
  uploadView,
  setUploadView,
  selectedFiles,
  setSelectedFiles,
  searchQuery,
  setSearchQuery,
  handleUploadButtonClick,
  removeFile,
  formatFileSize,
  allFiles,
  recentlyAccessedFiles,
  filteredFiles,
  getFileIcon
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
  <div className="bg-black text-white font-sans min-h-screen">
    <Sidebar 
      sidebarCollapsed={sidebarCollapsed}
      toggleSidebar={toggleSidebar}
      navigateToUploads={navigateToUploads}
      currentScreen={currentScreen}
      handleLogout={() => {
        console.log('🔓 UploadsScreen handleLogout called, currentUser:', currentUser);
        console.log('🔓 UploadsScreen calling navigateToLogin');
        navigateToLogin();
      }}
    />
    <div className={`flex flex-col min-h-screen ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 p-6 bg-black`}>
      <header className="w-full flex justify-between items-center mb-8">
        <div>
          <button 
            onClick={navigateToQuery}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md text-sm text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <div className="flex items-center space-x-2 text-lg font-medium text-gray-200">
          <Sparkles className="w-[18px] h-[18px] text-gray-400" />
          <span>DocHuman</span>
        </div>
        <div className="w-[88px] flex justify-end relative" ref={menuRef}>
          {currentUser ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 bg-gray-900 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <User className="w-4 h-4" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">{currentUser.firstName} {currentUser.lastName}</p>
                    <p className="text-xs text-gray-400">{currentUser.email}</p>
                  </div>
                  <button 
                    onClick={navigateToLogin}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={navigateToLogin}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto">
          
          <header className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Upload Documents</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Turn your files and data into captivating knowledge. Upload documents to enhance your DocHuman experience.
            </p>
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
              <div className="bg-black min-h-screen pb-20 -mx-6 px-6">
                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-8">
                  {/* All Files - Middle */}
                  <div className="col-span-8">
                    <div className="bg-gray-900/50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <h4 className="text-lg font-semibold text-white">All Files ({filteredFiles.length})</h4>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-64 pl-9 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Search files..."
                            />
                          </div>
                        </div>
                        <button 
                          onClick={handleUploadButtonClick}
                          className="bg-green-400 text-black font-bold py-2 px-4 rounded-lg hover:bg-green-300 transition-all text-sm flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Upload New
                        </button>
                      </div>
                      
                      {/* Table Header */}
                      <div className="grid grid-cols-10 gap-4 px-4 py-3 text-gray-400 text-sm font-medium border-b border-gray-700 mb-2 bg-gray-800/20">
                        <div className="col-span-4">Name</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Created</div>
                        <div className="col-span-2">Actions</div>
                      </div>

                      {filteredFiles.length === 0 ? (
                        <div className="text-center py-12 bg-gray-900/30">
                          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                          <p className="text-gray-400">
                            {searchQuery ? 'No files match your search.' : 'No files uploaded yet.'}
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-0">
                            {filteredFiles.slice(0, 10).map((file) => (
                              <div key={file.id} className="grid grid-cols-10 gap-4 items-center px-4 py-3 hover:bg-gray-800/50 transition-colors border-b border-gray-800/30 bg-gray-900/30">
                                <div className="col-span-4 flex items-center gap-3 min-w-0">
                                  {getFileIcon(file.type)}
                                  <span className="text-white font-medium text-sm truncate">{file.name}</span>
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                  {file.status === 'Processed' ? (
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
                                <div className="col-span-2 text-gray-400 text-sm">{file.created}</div>
                                <div className="col-span-2 flex items-center gap-1">
                                  <button className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium py-1 px-2 rounded-md transition-colors">
                                    Open
                                  </button>
                                  <button className="text-red-400 hover:text-red-300 text-xs font-medium py-1 px-2 rounded-md transition-colors">
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Pagination */}
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700 bg-gray-900/30">
                            <div className="text-sm text-gray-400">
                              Showing 1-10 of {filteredFiles.length} files
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                                Previous
                              </button>
                              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                                1
                              </button>
                              <button className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                                2
                              </button>
                              <button className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                                Next
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Recently Added Files - Right */}
                  <div className="col-span-4">
                    <div className="bg-gray-900/50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Recently Added</h4>
                      <div className="space-y-3">
                        {recentlyAccessedFiles.map((file) => (
                          <div key={file.id} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3 mb-2">
                              {getFileIcon(file.type)}
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm truncate">{file.name}</p>
                                <p className="text-gray-400 text-xs">{file.size}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">{file.created}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                file.status === 'Processed' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {file.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  </div>
  );
};