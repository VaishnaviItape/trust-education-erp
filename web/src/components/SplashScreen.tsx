import React, { useEffect, useState } from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white select-none">
      <div className="flex flex-col items-center text-center p-8 max-w-md animate-fade-in">
        {/* Animated Icon Emblem */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl animate-bounce">
            <GraduationCap className="w-14 h-14 text-white drop-shadow-md" />
          </div>
          <div className="absolute -top-2 -right-2 bg-amber-300 text-orange-950 p-1.5 rounded-full shadow-lg">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
        </div>

        {/* Title & Slogan */}
        <span className="text-xs uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full text-orange-100 font-semibold mb-3 border border-white/20">
          Integrated Education Cloud ERP
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 drop-shadow-sm">
          Zep Foundation Bhose
        </h1>
        <p className="text-orange-100 text-sm font-medium mb-8">
          Modern Public School & Jr College Bhose &bull; Modern College of HM & Tech Solapur
        </p>

        {/* Progress Bar */}
        <div className="w-64 h-2.5 bg-white/25 rounded-full overflow-hidden p-0.5 border border-white/30 shadow-inner mb-3">
          <div
            className="h-full bg-gradient-to-r from-amber-300 to-white rounded-full transition-all duration-150 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between w-64 text-[11px] text-orange-200 font-semibold uppercase tracking-wider">
          <span>Loading modules...</span>
          <span>{progress}%</span>
        </div>

        <button
          onClick={onFinish}
          className="mt-8 text-xs text-orange-200 hover:text-white underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
        >
          Skip animation &rarr;
        </button>
      </div>
    </div>
  );
};
