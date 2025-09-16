import React, { useState, useEffect } from 'react';
import { Book, Plus, Link, Users, Code, Settings, HelpCircle, LogOut, ChevronDown, FileText, ChevronRight, Sparkles, MessageSquare } from 'lucide-react';
import { listKnowledgeDbs, KnowledgeDb } from '../services/knowledgeDbService';

interface SidebarProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  navigateToUploads: () => void;
  navigateToQuery?: () => void;
  currentScreen: string;
  setCurrentScreen?: (screen: string) => void;
  handleLogout?: () => void;
  selectedKnowledgeBase?: string;
  setSelectedKnowledgeBase?: (kbId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarCollapsed, 
  toggleSidebar, 
  navigateToUploads, 
  navigateToQuery,
  currentScreen,
  setCurrentScreen,
  handleLogout,
  selectedKnowledgeBase,
  setSelectedKnowledgeBase
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeDb[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadKbs = async () => {
      try {
        const response = await listKnowledgeDbs();
        setKnowledgeBases(response.knowledgedbs);
        if (response.knowledgedbs.length > 0 && !selectedKnowledgeBase) {
          setSelectedKnowledgeBase?.(response.knowledgedbs[0].knowledgeDbId);
        }
      } catch (error) {
        console.error('Failed to load knowledge bases:', error);
      }
    };
    loadKbs();
  }, [selectedKnowledgeBase, setSelectedKnowledgeBase]);

  return (
  <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-[#0D0D0D] flex flex-col p-4 border-r border-gray-800 transition-all duration-300 fixed left-0 top-0 h-screen z-10`}>
    <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} p-2 mb-6`}>
      <div className="flex items-center gap-2.5">
        <Sparkles className="w-7 h-7 text-gray-200 flex-shrink-0" />
        {!sidebarCollapsed && <h1 className="text-xl font-bold text-gray-100">DocHuman</h1>}
      </div>
      {!sidebarCollapsed && <button 
        onClick={toggleSidebar}
        className="text-gray-400 hover:text-gray-200 transition-colors p-1"
      >
        <ChevronRight className="w-4 h-4 transition-transform duration-300 rotate-180" />
      </button>}
    </div>
    {sidebarCollapsed && <button 
      onClick={toggleSidebar}
      className="text-gray-400 hover:text-gray-200 transition-colors p-1 mx-auto mb-6 block"
    >
      <ChevronRight className="w-4 h-4" />
    </button>}

    {!sidebarCollapsed && (
      <div className="relative mb-6">
        {knowledgeBases.length === 0 ? (
          <button 
            onClick={() => setCurrentScreen?.('knowledgebase')}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm font-medium text-gray-100 hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />
            Create Knowledge Base
          </button>
        ) : (
          <>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm font-medium text-gray-100 hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Book className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  {knowledgeBases.find(kb => kb.knowledgeDbId === selectedKnowledgeBase)?.name || knowledgeBases[0]?.name || 'No Knowledge Base'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                {knowledgeBases.map((kb) => (
                  <button
                    key={kb.knowledgeDbId}
                    onClick={() => {
                      setSelectedKnowledgeBase?.(kb.knowledgeDbId);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <div className="truncate">{kb.name}</div>
                    <div className="text-xs text-gray-500 truncate">{kb.description}</div>
                  </button>
                ))}
                <div className="border-t border-gray-700">
                  <button
                    onClick={() => {
                      setCurrentScreen?.('knowledgebase');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-blue-400 hover:bg-gray-700 transition-colors"
                  >
                    + Create New Knowledge Base
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )}

    <nav className="flex-grow space-y-1">
      <span 
        onClick={navigateToQuery}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''} ${
          currentScreen === 'query' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
        } transition-colors`}
      >
        <MessageSquare className="w-5 h-5 flex-shrink-0" />
        {!sidebarCollapsed && <span>Ask DocHuman</span>}
      </span>
      
      <span 
        onClick={() => setCurrentScreen && setCurrentScreen('knowledgebase')}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''} ${
          currentScreen === 'knowledgebase' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
        } transition-colors`}
      >
        <Book className="w-5 h-5 flex-shrink-0" />
        {!sidebarCollapsed && <span>Knowledge Base</span>}
      </span>
      
      <span 
        onClick={navigateToUploads}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''} ${
          currentScreen === 'uploads' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
        } transition-colors`}
      >
        <FileText className="w-5 h-5 flex-shrink-0" />
        {!sidebarCollapsed && <span>Files</span>}
      </span>
      
      <div>
        <button className={`w-full flex ${sidebarCollapsed ? 'justify-center' : 'justify-between'} items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-gray-100 transition-colors`}>
          <div className="flex items-center gap-3">
            <Link className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Data Sources</span>}
          </div>
          {!sidebarCollapsed && <ChevronDown className="w-3 h-3" />}
        </button>
      </div>
      
      <span className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-gray-100 transition-colors cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''}`}>
        <Users className="w-5 h-5 flex-shrink-0" />
        {!sidebarCollapsed && <span>Team</span>}
      </span>
      
      <div>
        <button className={`w-full flex ${sidebarCollapsed ? 'justify-center' : 'justify-between'} items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-gray-100 transition-colors`}>
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>API</span>}
          </div>
          {!sidebarCollapsed && <ChevronDown className="w-3 h-3" />}
        </button>
      </div>
      
      <span className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-gray-100 transition-colors cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''}`}>
        <Settings className="w-5 h-5 flex-shrink-0" />
        {!sidebarCollapsed && <span>Settings</span>}
      </span>
    </nav>

    <div className="mt-auto">
      <button className={`w-full text-left flex items-center gap-3 px-3 py-2.5 bg-gray-900 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors mb-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
        <HelpCircle className="w-4 h-4 flex-shrink-0" />
        {!sidebarCollapsed && <span>Support</span>}
      </button>
      <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!sidebarCollapsed && <div className="flex items-center gap-2">
          <button className="h-9 w-9 flex items-center justify-center bg-gray-900 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
            <span className="text-sm">D</span>
          </button>
          <button className="h-9 w-9 flex items-center justify-center bg-gray-900 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
            <span className="text-sm">X</span>
          </button>
        </div>}
        <span 
          onClick={async () => {
            if (isLoggingOut) return;
            setIsLoggingOut(true);
            try {
              const authService = await import('../services/authService');
              await authService.logout();
              window.location.reload();
            } catch (error) {
              console.error('Logout failed:', error);
              setIsLoggingOut(false);
            }
          }}
          className={`flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-lg text-sm text-gray-400 hover:bg-gray-800 transition-colors cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''} ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {!sidebarCollapsed && <span>Log out</span>}
          {isLoggingOut ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          ) : (
            <LogOut className="w-4 h-4 flex-shrink-0" />
          )}
        </span>
      </div>
    </div>
  </aside>
  );
};