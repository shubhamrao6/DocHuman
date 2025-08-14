import React, { useState } from 'react';
import { Book, ArrowLeft, RotateCcw, Upload, Plus, Link, Users, Code, Settings, HelpCircle, LogOut, ChevronDown, FileText, Key, File, Send, ChevronRight, Sparkles } from 'lucide-react';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'query' | 'results' | 'uploads' | 'login'>('landing');
  const [query, setQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'assistant', content: string}>>([
    {
      type: 'assistant',
      content: `# Post-Interview

1. Transcribe and Analyze:
   • Transcribe the interview recordings if necessary.
   • Identify key themes, patterns, and insights from the responses.

2. Share Findings:
   • Compile findings into a report or presentation.
   • Highlight actionable insights and recommendations for the design and product teams.

3. Follow Up:
   • Send a thank-you note to participants.
   • Provide any promised incentives or rewards.
   • Share any high-level findings or updates with participants, if appropriate.

# Tips for Effective Interviews

• **Active Listening:** Pay close attention to participants' responses and show genuine interest.
• **Neutral Stance:** Avoid leading questions or expressing your own opinions.
• **Adaptability:** Be prepared to adjust the interview flow based on participants' responses.
• **Empathy:** Understand and respect participants' perspectives and experiences.
• **Documentation:** Take thorough notes and record important observations during the interview.`
    }
  ]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [emailFormData, setEmailFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [emailFormErrors, setEmailFormErrors] = useState({
    username: '',
    email: '',
    password: ''
  });

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

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentScreen === 'results' && query.trim()) {
      // Add user message
      setChatMessages(prev => [...prev, { type: 'user', content: query.trim() }]);
      
      // Clear query immediately
      setQuery('');
      
      // Simulate AI response (replace with actual AI integration)
      setTimeout(() => {
        const responses = [
          "Based on your uploaded documents, here are the key insights I found regarding your query. The analysis shows several important patterns that align with your research objectives.",
          "I've analyzed your knowledge base and found relevant information about this topic. Here's what I discovered from the connected data sources and uploaded files.",
          "From the documents in your knowledge base, I can provide the following analysis:\n\n• Key finding 1: Relevant data point from your documents\n• Key finding 2: Cross-referenced information\n• Key finding 3: Actionable insights based on your query",
          "Let me search through your uploaded content to provide you with accurate information. The results indicate several relevant matches to your question.",
          "Based on the data sources you've connected, here's what I found relevant to your question:\n\n**Summary:** Your query relates to multiple documents in your knowledge base.\n\n**Key Points:**\n• Primary insight from document analysis\n• Secondary findings from cross-referencing\n• Recommendations based on the data"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setChatMessages(prev => [...prev, { type: 'assistant', content: randomResponse }]);
      }, 1000);
    } else if (currentScreen !== 'results') {
      navigateToResults();
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

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log('Google login clicked');
  };

  const handleEmailSignup = () => {
    setShowEmailForm(true);
  };

  const validateEmailForm = () => {
    const errors = {
      username: '',
      email: '',
      password: ''
    };

    // Username validation
    if (!emailFormData.username.trim()) {
      errors.username = 'Username is required';
    } else if (emailFormData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(emailFormData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!emailFormData.password) {
      errors.password = 'Password is required';
    } else if (emailFormData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setEmailFormErrors(errors);
    return !errors.username && !errors.email && !errors.password;
  };

  const handleEmailFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmailForm()) {
      // Successful validation - navigate to query screen
      setCurrentScreen('query');
      setShowEmailForm(false);
      setEmailFormData({ username: '', email: '', password: '' });
      setEmailFormErrors({ username: '', email: '', password: '' });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEmailFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (emailFormErrors[field as keyof typeof emailFormErrors]) {
      setEmailFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBackToLogin = () => {
    setShowEmailForm(false);
    setEmailFormData({ username: '', email: '', password: '' });
    setEmailFormErrors({ username: '', email: '', password: '' });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);
    }
  };

  const handleUploadButtonClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.pdf,.csv,.txt,.epub,.docx,.xls,.xlsx,.png,.jpeg,.jpg';
    fileInput.onchange = (e) => handleFileUpload(e as any);
    fileInput.click();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  const formatMessageContent = (content: string) => {
    // Split content by lines and format
    const lines = content.split('\n');
    const formattedLines = lines.map((line, index) => {
      // Handle headers
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-lg font-semibold mb-5 text-[#F0F0F0]">{line.substring(2)}</h1>;
      }
      
      // Handle numbered lists
      if (/^\d+\./.test(line.trim())) {
        return <li key={index} className="mb-4 text-sm text-gray-300">{line.trim()}</li>;
      }
      
      // Handle bullet points with bold text
      if (line.trim().startsWith('• **') && line.includes(':**')) {
        const match = line.match(/• \*\*(.*?)\*\*:(.*)/);
        if (match) {
          return (
            <li key={index} className="relative pl-4 mb-4 text-sm text-gray-400">
              <span className="absolute left-0 text-[#F0F0F0]">•</span>
              <strong className="text-gray-300">{match[1]}:</strong>{match[2]}
            </li>
          );
        }
      }
      
      // Handle regular bullet points
      if (line.trim().startsWith('• ')) {
        return (
          <li key={index} className="relative pl-4 mt-2 text-sm text-gray-400">
            <span className="absolute left-0 text-[#F0F0F0]">•</span>
            {line.substring(2)}
          </li>
        );
      }
      
      // Handle empty lines
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Handle regular paragraphs
      return <p key={index} className="text-sm text-gray-300 mb-2">{line}</p>;
    });
    
    return <div>{formattedLines}</div>;
  };

  // Sidebar component
  const Sidebar = () => (
    <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-[#0D0D0D] flex flex-col p-4 border-r border-gray-800 transition-all duration-300 fixed left-0 top-0 h-screen z-10`}>
      <div className="flex items-center gap-2.5 p-2 mb-6">
        <Sparkles className="w-7 h-7 text-gray-200 flex-shrink-0" />
        {!sidebarCollapsed && <h1 className="text-xl font-bold text-gray-100">DocHuman</h1>}
      </div>

      <button className={`w-full text-left flex items-center gap-3 px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm font-medium text-gray-100 hover:bg-gray-800 transition-colors mb-6 ${sidebarCollapsed ? 'justify-center' : ''}`}>
        <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {!sidebarCollapsed && 'Connect a new Source'}
      </button>

      <nav className="flex-grow space-y-1">
        <span className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-gray-100 transition-colors cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <Book className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Knowledge Base</span>}
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
        
        <span 
          onClick={navigateToUploads}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''} ${
            currentScreen === 'uploads' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
          } transition-colors`}
        >
          <Upload className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Upload Files</span>}
        </span>
        
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
          <button className={`flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-lg text-sm text-gray-400 hover:bg-gray-800 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}>
            {!sidebarCollapsed && <span>Log out</span>}
            <LogOut className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );

  if (currentScreen === 'login') {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="bg-[#2A2A2A] rounded-2xl p-8 w-full max-w-md mx-4">
          {!showEmailForm ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Your ideas, in</h1>
                <h1 className="text-3xl font-bold text-white mb-6">stunning clarity.</h1>
                <p className="text-gray-300 mb-1">Extraordinary presentations.</p>
                <p className="text-gray-300">No design skills required.</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full bg-white text-black py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="text-center">
                  <button 
                    onClick={handleEmailSignup}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Already a user? Login here
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-gray-500">
                <p>By continuing, you acknowledge that you have read</p>
                <p>and agree to DocHuman's <span className="underline cursor-pointer hover:text-gray-400">Terms & Conditions</span> and</p>
                <p><span className="underline cursor-pointer hover:text-gray-400">Privacy Policy</span></p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-6">Sign In</h1>
                <p className="text-gray-300">Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleEmailFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={emailFormData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      emailFormErrors.username 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter your username"
                  />
                  {emailFormErrors.username && (
                    <p className="mt-1 text-sm text-red-400">{emailFormErrors.username}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={emailFormData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      emailFormErrors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter your email"
                  />
                  {emailFormErrors.email && (
                    <p className="mt-1 text-sm text-red-400">{emailFormErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={emailFormData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      emailFormErrors.password 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter your password"
                  />
                  {emailFormErrors.password && (
                    <p className="mt-1 text-sm text-red-400">{emailFormErrors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <button 
                  onClick={handleBackToLogin}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to login options
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (currentScreen === 'uploads') {
    return (
      <div className="bg-black text-white font-sans min-h-screen">
        <Sidebar />
        <div className={`flex flex-col h-screen ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 p-6`}>
          <header className="w-full flex justify-between items-center mb-8">
            <div>
              <button 
                onClick={toggleSidebar}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md text-sm text-gray-300 hover:bg-gray-800 transition-colors mr-3"
              >
                {sidebarCollapsed ? <ChevronDown className="w-4 h-4 rotate-90" /> : <ChevronDown className="w-4 h-4 -rotate-90" />}
              </button>
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
            <div className="w-[88px] flex justify-end">
              <button 
                onClick={navigateToLogin}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Login
              </button>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center -mt-10">
            <div className="w-full max-w-4xl mx-auto">
              
              <header className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Upload Documents</h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Turn your files and data into captivating knowledge. Upload documents to enhance your DocHuman experience.
                </p>
              </header>

              <div className="w-full max-w-2xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="flex items-center bg-gray-900 p-1 rounded-lg">
                    <button className="px-6 py-2 text-sm font-semibold text-white bg-gray-800 rounded-md flex items-center gap-2">
                      <File className="w-4 h-4" />
                      File
                    </button>
                    <button className="px-6 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors rounded-md flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      Connect Source
                    </button>
                  </div>
                </div>

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
              </div>

              <section className="mt-16">
                <h3 className="text-2xl font-bold text-white text-center mb-8">Connected Data Sources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-pink-500 to-orange-400 p-1 rounded-2xl shadow-lg">
                    <div className="bg-gray-900 h-full w-full rounded-xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 mb-4 flex items-center justify-center">
                        <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-lg">Project Wiki</h4>
                      <p className="text-sm text-gray-400">Confluence</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-400 to-cyan-500 p-1 rounded-2xl shadow-lg">
                    <div className="bg-gray-900 h-full w-full rounded-xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 mb-4 flex items-center justify-center">
                        <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-lg">Marketing Assets</h4>
                      <p className="text-sm text-gray-400">Google Drive</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-1 rounded-2xl shadow-lg">
                    <div className="bg-gray-900 h-full w-full rounded-xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 mb-4 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-black" />
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-lg">Product Roadmap</h4>
                      <p className="text-sm text-gray-400">Notion</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (currentScreen === 'landing') {
    return (
      <div className="bg-black min-h-screen">
        <main className="min-h-screen flex flex-col items-center justify-center text-white px-4 relative">
          
          <header className="w-full flex justify-between items-center py-6 absolute top-0 px-8">
            <div className="flex items-center space-x-3 text-base text-white/80 font-medium">
              <Sparkles className="w-[15px] h-[15px] text-gray-400" />
              <span>DocHuman</span>
            </div>
            <button 
              onClick={navigateToLogin}
              className="text-white/80 hover:text-white transition-colors font-medium"
            >
              Login
            </button>
          </header>

          <div className="flex flex-col items-center text-center max-w-2xl">
            <div className="flex flex-col items-start text-left max-w-2xl">
              <div className="space-y-8 text-left">
                <p className="text-[28px] leading-relaxed text-white/80">
                  Transform scattered documents into a unified, intelligent knowledge base.
                </p>
                <p className="text-[28px] leading-relaxed text-white/50">
                  Every query returns results with impact.
                </p>
              </div>
              <div className="mt-16 self-start">
                <button 
                  onClick={navigateToQuery}
                  className="bg-white/90 text-black px-8 py-3 rounded-lg text-base font-medium hover:bg-white hover:scale-105 hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    );
  }

  if (currentScreen === 'results') {
    return (
      <div className="bg-black text-white font-sans min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col p-6">
          <header className="w-full flex justify-between items-center mb-8">
            <div>
              <button 
                onClick={toggleSidebar}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md text-sm text-gray-300 hover:bg-gray-800 transition-colors mr-3"
              >
                {sidebarCollapsed ? <ChevronDown className="w-4 h-4 rotate-90" /> : <ChevronDown className="w-4 h-4 -rotate-90" />}
              </button>
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
            <div className="w-[88px] flex justify-end">
              <button 
                onClick={navigateToLogin}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Login
              </button>
            </div>
          </header>

          <main className="flex-grow overflow-y-auto px-4 sm:px-10 py-4">
            <div className="w-full max-w-2xl mx-auto space-y-6">
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
            </div>
          </main>
          
          <div className="w-full mt-8 px-4 sm:px-10">
            <form onSubmit={handleQuerySubmit} className="w-full max-w-2xl mx-auto mb-6">
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
          
          <footer className="w-full flex justify-between items-center px-10">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <RotateCcw className="w-4 h-4" />
                Refine
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Upload className="w-4 h-4" />
                Export
              </button>
            </div>
            <div>
              <span className="text-sm text-gray-500">1 of 1</span>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white font-sans min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6">
        <header className="w-full flex justify-between items-center">
          <div>
            <button 
              onClick={toggleSidebar}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md text-sm text-gray-300 hover:bg-gray-800 transition-colors mr-3"
            >
              {sidebarCollapsed ? <ChevronDown className="w-4 h-4 rotate-90" /> : <ChevronDown className="w-4 h-4 -rotate-90" />}
            </button>
            <button 
              onClick={navigateToLanding}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
          <div className="flex items-center space-x-2 text-lg font-medium text-gray-200">
            <ChevronRight className="w-[18px] h-[18px] text-gray-400" />
            <span>DocHuman</span>
          </div>
          <div className="w-[88px] flex justify-end">
            <button 
              onClick={navigateToLogin}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Login
            </button>
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
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
}

export default App;