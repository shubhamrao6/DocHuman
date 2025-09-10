import React from 'react';
import { Send, RotateCcw, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../services';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface ResultsScreenProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  navigateToUploads: () => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  navigateToQuery: () => void;
  navigateToLogin: () => void;
  currentUser: { firstName: string; lastName: string; email: string } | null;
  chatMessages: ChatMessage[];
  streamedResponse: string;
  chatEndRef: React.RefObject<HTMLDivElement>;
  query: string;
  setQuery: (query: string) => void;
  handleQuerySubmit: (e: React.FormEvent) => void;
  handleLoadMoreHistory: () => void;
  isLoadingHistory: boolean;
  isMessageLoading?: boolean;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  sidebarCollapsed,
  toggleSidebar,
  navigateToUploads,
  currentScreen,
  setCurrentScreen,
  navigateToQuery,
  navigateToLogin,
  currentUser,
  chatMessages,
  streamedResponse,
  chatEndRef,
  query,
  setQuery,
  handleQuerySubmit,
  handleLoadMoreHistory,
  isLoadingHistory,
  isMessageLoading = false
}) => {
  const formatMessageContent = (content: string) => {
    return <ReactMarkdown>{content}</ReactMarkdown>;
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
      />
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 h-screen`}>
        <Navbar 
          currentScreen={currentScreen}
          currentUser={currentUser}
          navigateToLogin={navigateToLogin}
          onBackClick={navigateToQuery}
        />

        <main className="flex-1 overflow-y-auto px-4 sm:px-10 py-4" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#374151 #111827'
        }}>
          <div className="w-full max-w-2xl mx-auto space-y-6">
            {chatMessages.length > 0 && (
              <div className="text-center mb-4">
                <button 
                  onClick={handleLoadMoreHistory}
                  disabled={isLoadingHistory}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                >
                  {isLoadingHistory ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    'Load previous 10 messages'
                  )}
                </button>
              </div>
            )}
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'user' ? (
                  <div className="bg-white text-black px-4 py-3 rounded-2xl max-w-[80%] text-sm">
                    {message.content}
                  </div>
                ) : (
                  <div className="w-full text-white leading-relaxed bg-[#1A1A1A] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2),0_0_80px_rgba(255,255,255,0.1)] p-10">
                    {formatMessageContent(message.content)}
                    
                    {/* Sources Section */}
                    <div className="mt-8 pt-6 border-t border-gray-700">
                      <h4 className="text-sm font-medium text-gray-400 mb-4">Sources</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <a 
                          href="#" 
                          className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
                        >
                          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                              <rect width="24" height="24" rx="3" fill="#000000"/>
                              <path d="M4 7.5C4 6.11929 5.11929 5 6.5 5H17.5C18.8807 5 20 6.11929 20 7.5V16.5C20 17.8807 18.8807 19 17.5 19H6.5C5.11929 19 4 17.8807 4 16.5V7.5Z" fill="#FFFFFF"/>
                              <path d="M8 9H16V10H8V9ZM8 11H16V12H8V11ZM8 13H13V14H8V13Z" fill="#000000"/>
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-200 group-hover:text-white truncate">
                              User Research Guidelines.pdf
                            </p>
                            <p className="text-xs text-gray-500">Notion</p>
                          </div>
                        </a>
                        
                        <a 
                          href="#" 
                          className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
                        >
                          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                              <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12z" fill="#0078D4"/>
                              <path d="M8.5 7.5h7v1.5h-7V7.5zm0 3h7V12h-7v-1.5zm0 3h5V15h-5v-1.5z" fill="white"/>
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-200 group-hover:text-white truncate">
                              Interview Best Practices.docx
                            </p>
                            <p className="text-xs text-gray-500">SharePoint</p>
                          </div>
                        </a>
                        
                        <a 
                          href="#" 
                          className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
                        >
                          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                              <path d="M6.5 2C4.567 2 3 3.567 3 5.5v13C3 20.433 4.567 22 6.5 22h11c1.933 0 3.5-1.567 3.5-3.5v-13C21 3.567 19.433 2 17.5 2h-11z" fill="#4285F4"/>
                              <path d="M15.5 8.5L12 12l-3.5-3.5L7 10l5 5 5-5-1.5-1.5z" fill="white"/>
                              <path d="M7 14h10v1H7v-1zm0 2h7v1H7v-1z" fill="white"/>
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-200 group-hover:text-white truncate">
                              Research Methodology.pdf
                            </p>
                            <p className="text-xs text-gray-500">Google Drive</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Streamed response UI: show only if not already in chatMessages */}
            {streamedResponse && (!chatMessages.length || chatMessages[chatMessages.length-1].type !== 'assistant' || chatMessages[chatMessages.length-1].content !== streamedResponse) && (
              <div className="flex justify-start">
                <div className="w-full text-white leading-relaxed bg-[#1A1A1A] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2),0_0_80px_rgba(255,255,255,0.1)] p-10 border-2 border-blue-500 animate-pulse">
                  {formatMessageContent(streamedResponse)}
                  <div className="mt-4 text-xs text-blue-400">Streaming...</div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </main>
        
        <div className="flex-shrink-0 border-t border-gray-800">
          <div className="w-full px-4 sm:px-10 py-4">
            <form onSubmit={handleQuerySubmit} className="w-full max-w-2xl mx-auto mb-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};