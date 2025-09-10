import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, User, LogOut, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentScreen: string;
  currentUser: { firstName: string; lastName: string; email: string } | null;
  navigateToLogin: () => void;
  onBackClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  currentUser,
  navigateToLogin,
  onBackClick
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

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'query': return 'Ask DocHuman';
      case 'results': return 'DocHuman';
      case 'uploads': return 'Files';
      case 'knowledgebase': return 'Knowledge Bases';
      default: return 'DocHuman';
    }
  };

  const getButtonText = () => {
    switch (currentScreen) {
      case 'query': return 'Go To Chat';
      case 'results': return 'Back';
      case 'uploads': return 'Back';
      case 'knowledgebase': return 'Back';
      default: return 'Back';
    }
  };

  return (
    <header className="w-full flex justify-between items-center p-6 pb-4 flex-shrink-0">
      <div className="relative z-20">
        <button 
          onClick={onBackClick}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md text-sm text-gray-300 hover:bg-gray-800 transition-colors relative z-20"
        >
          {currentScreen === 'query' ? (
            <>
              {getButtonText()}
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4" />
              {getButtonText()}
            </>
          )}
        </button>
      </div>
      
      <div className="flex items-center space-x-2 text-lg font-medium text-gray-200">
        <Sparkles className="w-[18px] h-[18px] text-gray-400" />
        <span>{getScreenTitle()}</span>
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
  );
};