import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronRight, Send, User, LogOut } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface QueryScreenProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  navigateToUploads: () => void;
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
}

export const QueryScreen: React.FC<QueryScreenProps> = ({
  sidebarCollapsed,
  toggleSidebar,
  navigateToUploads,
  currentScreen,
  navigateToLanding,
  setCurrentScreen,
  navigateToLogin,
  currentUser,
  query,
  setQuery,
  handleQuerySubmit,
  handleSuggestionClick,
  isMessageLoading = false
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
  <div className="bg-black text-white font-sans min-h-screen flex">
    <Sidebar 
      sidebarCollapsed={sidebarCollapsed}
      toggleSidebar={toggleSidebar}
      navigateToUploads={navigateToUploads}
      currentScreen={currentScreen}
    />
    <div className={`flex-1 flex flex-col p-6 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
      <header className="w-full flex justify-between items-center">
        <div className="relative z-20">
          <button 
            onClick={() => {
              console.log('Go To Chat clicked');
              setCurrentScreen('results');
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md text-sm text-gray-300 hover:bg-gray-800 transition-colors relative z-20"
          >
            <ArrowLeft className="w-4 h-4" />
            Go To Chat
          </button>
        </div>
        <div className="flex items-center space-x-2 text-lg font-medium text-gray-200">
          <ChevronRight className="w-[18px] h-[18px] text-gray-400" />
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

      <main className="flex-grow flex flex-col items-center justify-center -mt-10">
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