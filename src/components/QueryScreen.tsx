import React from 'react';
import { Send } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface QueryScreenProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  navigateToUploads: () => void;
  navigateToQuery: () => void;
  currentScreen: string;
  navigateToLanding: () => void;
  setCurrentScreen: (screen: 'landing' | 'query' | 'results' | 'uploads' | 'login' | 'signup') => void;
  navigateToLogin: () => void;
  currentUser: { firstName: string; lastName: string; email: string } | null;
  query: string;
  setQuery: (query: string) => void;
  handleQuerySubmit: (e: React.FormEvent) => void;
  handleSuggestionClick: (suggestion: string) => void;
  isMessageLoading?: boolean;
  selectedKnowledgeBase?: string;
  setSelectedKnowledgeBase?: (kbId: string) => void;
}

export const QueryScreen: React.FC<QueryScreenProps> = ({
  sidebarCollapsed,
  toggleSidebar,
  navigateToUploads,
  navigateToQuery,
  currentScreen,
  navigateToLanding,
  setCurrentScreen,
  navigateToLogin,
  currentUser,
  query,
  setQuery,
  handleQuerySubmit,
  handleSuggestionClick,
  isMessageLoading = false,
  selectedKnowledgeBase,
  setSelectedKnowledgeBase
}) => {
  
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
        onBackClick={() => setCurrentScreen('results')}
      />

      <main className="flex-grow flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-2xl flex flex-col items-center text-center">
          <h1 className="text-4xl font-normal text-white mb-3">Ask DocHuman</h1>
          <p className="text-base text-gray-400 mb-12">Ask questions about your knowledge base and get intelligent answers.</p>
          
          <form onSubmit={handleQuerySubmit} className="w-full relative mb-8">
            <div className="relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What would you like to create today?" 
                className="w-full h-12 px-4 pr-12 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 focus:outline-none placeholder-gray-500 text-base text-white"
              />
              <button
                type="submit"
                disabled={isMessageLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {isMessageLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>

          <div className="w-full flex flex-col items-center">
            <p className="text-sm text-gray-400 mb-4 self-start">Try these out...</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => handleSuggestionClick('Series A pitch deck')}
                className="px-4 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-sm text-gray-200 hover:bg-gray-600 transition-colors"
              >
                Series A pitch deck
              </button>
              <button 
                onClick={() => handleSuggestionClick('User research findings')}
                className="px-4 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-sm text-gray-200 hover:bg-gray-600 transition-colors"
              >
                User research findings
              </button>
              <button 
                onClick={() => handleSuggestionClick('Digital marketing trends report')}
                className="px-4 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-sm text-gray-200 hover:bg-gray-600 transition-colors"
              >
                Digital marketing trends report
              </button>
              <button 
                onClick={() => handleSuggestionClick('Quarterly planning proposal')}
                className="px-4 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-sm text-gray-200 hover:bg-gray-600 transition-colors"
              >
                Quarterly planning proposal
              </button>
            </div>
          </div>
        </div>
      </main>

    </div>
  </div>
  );
};