import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Database } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { DocumentsList } from './DocumentsList';
import { UploadPopup } from './UploadPopup';
import { createKnowledgeDb, listKnowledgeDbs, deleteKnowledgeDb, KnowledgeDb } from '../services/knowledgeDbService';
import { listDocuments, Document } from '../services/documentsService';
import { listImages, Image } from '../services/imagesService';

interface KnowledgeBaseScreenProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  navigateToUploads: () => void;
  navigateToQuery: () => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  navigateToLogin: () => void;
  currentUser: { firstName: string; lastName: string; email: string } | null;
  selectedKnowledgeBase?: string;
  setSelectedKnowledgeBase?: (kbId: string) => void;
}

export const KnowledgeBaseScreen: React.FC<KnowledgeBaseScreenProps> = ({
  sidebarCollapsed,
  toggleSidebar,
  navigateToUploads,
  navigateToQuery,
  currentScreen,
  setCurrentScreen,
  navigateToLogin,
  currentUser,
  selectedKnowledgeBase,
  setSelectedKnowledgeBase
}) => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeDb[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedKbId, setSelectedKbId] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [documents, setDocuments] = useState<Document[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  useEffect(() => {
    loadKnowledgeBases();
  }, []);

  const loadKnowledgeBases = async () => {
    setIsLoading(true);
    try {
      const response = await listKnowledgeDbs();
      setKnowledgeBases(response.knowledgedbs);
    } catch (error) {
      console.error('Failed to load knowledge bases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setIsCreating(true);
    try {
      await createKnowledgeDb(formData);
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      await loadKnowledgeBases();
    } catch (error) {
      console.error('Failed to create knowledge base:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedKbId) return;
    
    try {
      await deleteKnowledgeDb(selectedKbId);
      setSelectedKbId('');
      setDocuments([]);
      await loadKnowledgeBases();
    } catch (error) {
      console.error('Failed to delete knowledge base:', error);
    }
  };

  const handleKbSelection = async (kbId: string) => {
    if (selectedKbId === kbId) {
      setSelectedKbId('');
      setDocuments([]);
    } else {
      setSelectedKbId(kbId);
      await loadDocuments(kbId);
    }
  };

  const loadDocuments = async (knowledgeDbId: string) => {
    setIsLoadingDocs(true);
    try {
      const [docsResponse, imagesResponse] = await Promise.all([
        listDocuments(knowledgeDbId),
        listImages(knowledgeDbId)
      ]);
      setDocuments(docsResponse.documents);
      setImages(imagesResponse.images);
    } catch (error) {
      console.error('Failed to load documents/images:', error);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  return (
    <div className="bg-black text-white font-sans min-h-screen flex">
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        navigateToUploads={navigateToUploads}
        navigateToQuery={navigateToQuery}
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        selectedKnowledgeBase={selectedKnowledgeBase}
        setSelectedKnowledgeBase={setSelectedKnowledgeBase}
      />
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <Navbar 
          currentScreen={currentScreen}
          currentUser={currentUser}
          navigateToLogin={navigateToLogin}
          onBackClick={navigateToQuery}
        />
        
        <div className="px-6 pb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New
            </button>
            {selectedKbId && (
              <button 
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
            )}
          </div>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-white mb-4">Create Knowledge Base</h2>
              <form onSubmit={handleCreateKb}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter knowledge base name"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description (optional)"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isCreating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <main className="flex-1 px-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : knowledgeBases.length === 0 ? (
            <div className="text-center py-16">
              <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No Knowledge Bases</h3>
              <p className="text-gray-500 mb-6">Create your first knowledge base to get started</p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Create Knowledge Base
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {knowledgeBases.map((kb) => (
                <div 
                  key={kb.knowledgeDbId} 
                  onClick={() => handleKbSelection(kb.knowledgeDbId)}
                  className={`bg-gray-900 border rounded-lg p-6 hover:border-gray-600 transition-colors cursor-pointer ${
                    selectedKbId === kb.knowledgeDbId ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{kb.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{kb.description || 'No description'}</p>
                      <div className="text-xs text-gray-500">
                        <p>{kb.documentCount} documents</p>
                        <p>Created: {new Date(kb.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={selectedKbId === kb.knowledgeDbId}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {selectedKbId && (
            <div className="mt-8">
              <DocumentsList 
                documents={documents}
                images={images}
                isLoading={isLoadingDocs}
                onRefresh={() => loadDocuments(selectedKbId)}
                showUploadButton={true}
                onUploadClick={() => setShowUploadPopup(true)}
                searchPlaceholder={`Search through ${knowledgeBases.find(kb => kb.knowledgeDbId === selectedKbId)?.name || 'knowledge base'}`}
              />
            </div>
          )}
        </main>
      </div>
      
      <UploadPopup 
        isOpen={showUploadPopup}
        onClose={() => setShowUploadPopup(false)}
        selectedKnowledgeBase={selectedKbId}
        onCreateKnowledgeBase={() => setShowCreateForm(true)}
      />
    </div>
  );
};