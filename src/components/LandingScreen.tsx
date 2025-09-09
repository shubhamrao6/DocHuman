import React from 'react';
import { Sparkles } from 'lucide-react';

interface LandingScreenProps {
  navigateToQuery: () => void;
  navigateToLogin: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  navigateToQuery,
  navigateToLogin
}) => (
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