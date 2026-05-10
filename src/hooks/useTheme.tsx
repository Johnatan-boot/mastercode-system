import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type Theme = 'matrix' | 'ironman';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('mastercode_theme');
    return (saved as Theme) || 'matrix';
  });

  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('mastercode_muted');
    return saved === 'true';
  });

  const matrixSound = useRef<HTMLAudioElement | null>(null);
  const ironmanSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log("Initializing Theme Sounds...");
    // Matrix theme sound - Digital/Tech sound
    matrixSound.current = new Audio('https://www.soundjay.com/sci-fi/sounds/sci-fi-01.mp3');
    // Iron Man theme - Black Sabbath clip
    ironmanSound.current = new Audio('https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptoken=14368_12151');
    
    const loadSounds = () => {
      if (matrixSound.current) matrixSound.current.load();
      if (ironmanSound.current) ironmanSound.current.load();
    };

    loadSounds();
  }, []);

  useEffect(() => {
    document.body.classList.remove('theme-matrix', 'theme-ironman');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('mastercode_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('mastercode_muted', String(isMuted));
    if (isMuted) {
      console.log("Audio Muted");
      if (matrixSound.current) {
        matrixSound.current.pause();
        matrixSound.current.currentTime = 0;
      }
      if (ironmanSound.current) {
        ironmanSound.current.pause();
        ironmanSound.current.currentTime = 0;
      }
    } else {
      console.log("Audio Unmuted");
    }
  }, [isMuted]);

  const toggleMute = () => setIsMuted(!isMuted);

  const toggleTheme = () => {
    const newTheme = theme === 'matrix' ? 'ironman' : 'matrix';
    setTheme(newTheme);
    console.log(`Switching to ${newTheme} Protocol...`);
    
    // Stop any playing sounds
    if (matrixSound.current) {
      matrixSound.current.pause();
      matrixSound.current.currentTime = 0;
    }
    if (ironmanSound.current) {
      ironmanSound.current.pause();
      ironmanSound.current.currentTime = 0;
    }

    if (isMuted) {
      console.log("Sound is muted, skipping playback.");
      return;
    }

    if (newTheme === 'ironman' && ironmanSound.current) {
      ironmanSound.current.volume = 0.5;
      ironmanSound.current.play()
        .then(() => console.log("Playing Ironman Theme"))
        .catch(e => console.error("Ironman Sound Error:", e));
    } else if (newTheme === 'matrix' && matrixSound.current) {
      matrixSound.current.volume = 0.5;
      matrixSound.current.play()
        .then(() => console.log("Playing Matrix Sound"))
        .catch(e => console.error("Matrix Sound Error:", e));
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isMuted, toggleMute }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
