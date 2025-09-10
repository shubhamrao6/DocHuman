import React, { useState } from 'react';
import { Book, Plus, Link, Users, Code, Settings, HelpCircle, LogOut, ChevronDown, FileText, ChevronRight, Sparkles, MessageSquare } from 'lucide-react';

interface SidebarProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  navigateToUploads: () => void;
  navigateToQuery?: () => void;
  currentScreen: string;
  setCurrentScreen?: (screen: string) => void;
  handleLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarCollapsed, 
  toggleSidebar, 
  navigateToUploads, 
  navigateToQuery,
  currentScreen,
  setCurrentScreen,
  handleLogout
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

    <button className={`w-full text-left flex items-center gap-3 px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm font-medium text-gray-100 hover:bg-gray-800 transition-colors mb-6 ${sidebarCollapsed ? 'justify-center' : ''}`}>
      <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />
      {!sidebarCollapsed && 'New Chat'}
    </button>

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