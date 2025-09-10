import React, { useState, useRef, useEffect } from 'react';
import { sendMessage, loadChatHistory, ChatMessage } from './services/chatService';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { LandingScreen } from './components/LandingScreen';
import { QueryScreen } from './components/QueryScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { UploadsScreen } from './components/UploadsScreen';
import { useAuth } from './hooks/useAuth';
import { useFileHandling } from './hooks/useFileHandling';
import { formatFileSize, getFileIcon } from './utils/fileUtils';
import { allFiles } from './data/mockData';
import { isAuthenticated, getCurrentUser } from './services/authService';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'query' | 'results' | 'uploads' | 'login' | 'signup'>('landing');
  const [uploadView, setUploadView] = useState<'upload' | 'allFiles'>('upload');
  const [query, setQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [streamedResponse, setStreamedResponse] = useState('');
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingMoreHistory, setIsLoadingMoreHistory] = useState(false);

  const auth = useAuth();
  const fileHandling = useFileHandling();

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentScreen === 'results' && chatEndRef.current && !isLoadingMoreHistory && (streamedResponse || isMessageLoading)) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamedResponse, currentScreen, isLoadingMoreHistory, isMessageLoading]);

  const navigateToQuery = () => {
    setCurrentScreen('query');
  };

  const navigateToLanding = () => {
    setCurrentScreen('landing');
  };

  const navigateToResults = () => {
    if (query.trim()) {
      setCurrentScreen('results');
    }
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userQuery = query.trim();
    if (!userQuery || isMessageLoading) return;
    setQuery('');
    setStreamedResponse('');
    setIsMessageLoading(true);
    // Always navigate to results and send message in one step
    if (currentScreen !== 'results') {
      setCurrentScreen('results');
      setTimeout(async () => {
        setChatMessages(prev => [...prev, { type: 'user', content: userQuery }]);
        let streamingActive = true;
        const aiMessage = await sendMessage(userQuery, chatMessages, (chunk) => {
          if (streamingActive) setStreamedResponse(prev => prev + chunk);
        }, (history) => {
          console.log('💬 History callback received:', history);
          setChatMessages([...history, { type: 'user', content: userQuery }]);
        });
        streamingActive = false;
        setStreamedResponse(''); // Clear streaming UI
        setChatMessages(prev => [...prev, aiMessage]);
        setIsMessageLoading(false);
      }, 0);
    } else {
      setChatMessages(prev => [...prev, { type: 'user', content: userQuery }]);
      let streamingActive = true;
      const aiMessage = await sendMessage(userQuery, chatMessages, (chunk) => {
        if (streamingActive) setStreamedResponse(prev => prev + chunk);
      }, (history) => {
        console.log('💬 History callback received:', history);
        setChatMessages([...history, { type: 'user', content: userQuery }]);
      });
      streamingActive = false;
      setStreamedResponse(''); // Clear streaming UI
      setChatMessages(prev => [...prev, aiMessage]);
      setIsMessageLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setCurrentScreen('results');
  };

  const navigateToUploads = () => {
    setCurrentScreen('uploads');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  const navigateToSignup = () => {
    setCurrentScreen('signup');
  };

  const handleLogout = async () => {
    console.log('🔓 App handleLogout called');
    await auth.handleLogout();
    console.log('🔓 Navigating to landing page');
    setCurrentScreen('landing');
  };

  const handleLoadMoreHistory = async () => {
    if (isLoadingHistory) return;
    setIsLoadingHistory(true);
    setIsLoadingMoreHistory(true);
    try {
      const moreHistory = await loadChatHistory(chatMessages.length, chatMessages.length + 10);
      setChatMessages(prev => [...moreHistory, ...prev]);
    } catch (error) {
      console.error('❌ Failed to load more history:', error);
    } finally {
      setIsLoadingHistory(false);
      setTimeout(() => setIsLoadingMoreHistory(false), 100);
    }
  };

  // Check authentication on app load
  useEffect(() => {
    if (isAuthenticated() && currentScreen === 'landing') {
      setCurrentScreen('query');
    }
  }, [currentScreen]);

  // Load chat history when entering results screen
  useEffect(() => {
    if (isAuthenticated() && currentScreen === 'results') {
      console.log('💬 Loading chat history for results screen...');
      console.log('💬 Current chatMessages before loading:', chatMessages);
      loadChatHistory().then(history => {
        console.log('💬 History loaded successfully:', history);
        console.log('💬 Setting chat messages to:', history);
        setChatMessages(history);
      }).catch(error => {
        console.error('❌ Failed to load chat history:', error);
      });
    }
  }, [currentScreen]);

  const currentUser = getCurrentUser();

  const recentlyAccessedFiles = allFiles
    .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())
    .slice(0, 3);

  const filteredFiles = allFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        showEmailForm={auth.showEmailForm}
        isLoading={auth.isLoading}
        emailFormData={auth.emailFormData}
        emailFormErrors={auth.emailFormErrors}
        handleGoogleLogin={auth.handleGoogleLogin}
        handleEmailSignup={auth.handleEmailSignup}
        handleEmailFormSubmit={(e) => auth.handleEmailFormSubmit(e, () => setCurrentScreen('query'))}
        handleInputChange={auth.handleInputChange}
        handleBackToLogin={auth.handleBackToLogin}
        navigateToSignup={navigateToSignup}
      />
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SignupScreen
        isLoading={auth.isLoading}
        signupFormData={auth.signupFormData}
        signupFormErrors={auth.signupFormErrors}
        handleGoogleSignup={auth.handleGoogleSignup}
        handleSignupFormSubmit={(e) => auth.handleSignupFormSubmit(e, () => setCurrentScreen('login'))}
        handleInputChange={auth.handleInputChange}
        navigateToLogin={navigateToLogin}
      />
    );
  }

  if (currentScreen === 'uploads') {
    return (
      <UploadsScreen
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        navigateToUploads={navigateToUploads}
        currentScreen={currentScreen}
        navigateToQuery={navigateToQuery}
        navigateToLogin={currentUser ? handleLogout : navigateToLogin}
        currentUser={currentUser}
        uploadView={uploadView}
        setUploadView={setUploadView}
        selectedFiles={fileHandling.selectedFiles}
        setSelectedFiles={fileHandling.setSelectedFiles}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleUploadButtonClick={fileHandling.handleUploadButtonClick}
        removeFile={fileHandling.removeFile}
        formatFileSize={formatFileSize}
        allFiles={allFiles}
        recentlyAccessedFiles={recentlyAccessedFiles}
        filteredFiles={filteredFiles}
        getFileIcon={getFileIcon}
      />
    );
  }

  if (currentScreen === 'results') {
    return (
      <ResultsScreen
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        navigateToUploads={navigateToUploads}
        currentScreen={currentScreen}
        navigateToQuery={navigateToQuery}
        navigateToLogin={currentUser ? handleLogout : navigateToLogin}
        currentUser={currentUser}
        chatMessages={chatMessages}
        streamedResponse={streamedResponse}
        chatEndRef={chatEndRef}
        query={query}
        setQuery={setQuery}
        handleQuerySubmit={handleQuerySubmit}
        handleLoadMoreHistory={handleLoadMoreHistory}
        isLoadingHistory={isLoadingHistory}
        isMessageLoading={isMessageLoading}
      />
    );
  }

  if (currentScreen === 'landing') {
    return (
      <LandingScreen
        navigateToQuery={navigateToQuery}
        navigateToLogin={navigateToLogin}
      />
    );
  }

  return (
    <QueryScreen
      sidebarCollapsed={sidebarCollapsed}
      toggleSidebar={toggleSidebar}
      navigateToUploads={navigateToUploads}
      currentScreen={currentScreen}
      navigateToLanding={navigateToLanding}
      setCurrentScreen={setCurrentScreen}
      navigateToLogin={currentUser ? handleLogout : navigateToLogin}
      currentUser={currentUser}
      query={query}
      setQuery={setQuery}
      handleQuerySubmit={handleQuerySubmit}
      handleSuggestionClick={handleSuggestionClick}
      isMessageLoading={isMessageLoading}
    />
  );
}

export default App;