import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type Theme = 'matrix' | 'ironman';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  audioError: string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('mastercode_theme');
    return (saved as Theme) || 'matrix';
  });

  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('mastercode_muted');
    // Default to TRUE (muted) on first visit to comply with browser autoplay policies
    return saved === null ? true : saved === 'true';
  });

  const [audioError, setAudioError] = useState<string | null>(null);

  const matrixSound = useRef<HTMLAudioElement | null>(null);
  const ironmanSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log("Initializing Theme Sounds with robust local-first fallback...");
    setAudioError(null);

    // Primary: Local path /matrix.mp3, Secondary: Archive.org link
    const mSound = new Audio('/matrix.mp3');
    mSound.loop = true;

    // Primary: Local path /ironman.mp3, Secondary: Archive.org link
    const iSound = new Audio('/ironman.mp3');
    iSound.loop = true;

    const matrixBackupUrl = 'https://archive.org/download/ClubbedToDeathRobDouganMatrixSoundtrack_201802/Clubbed%20to%20death%20-%20Rob%20Dougan%20%28Matrix%20Soundtrack%29.mp3';
    const ironmanBackupUrl = 'https://archive.org/download/BlackSabbathIronMan_201612/Black%20Sabbath%20-%20Iron%20Man.mp3';

    // Error event listeners to swap to Internet Archive backups if local files aren't uploaded yet
    const handleMatrixError = () => {
      if (mSound.src !== matrixBackupUrl) {
        console.warn("Local matrix.mp3 not loaded. Falling back to Archive.org URL...");
        mSound.src = matrixBackupUrl;
        mSound.load();
        // Play if not muted
        const isCurrentMuted = localStorage.getItem('mastercode_muted') === 'true';
        const currentTheme = localStorage.getItem('mastercode_theme') || 'matrix';
        if (!isCurrentMuted && currentTheme === 'matrix') {
          mSound.play()
            .then(() => setAudioError(null))
            .catch(e => {
              console.warn("Matrix Backup Autoplay Restricted:", e);
              if (e.name === 'NotAllowedError') {
                setAudioError("Clique na tela para ativar som (bloqueio de autoplay do navegador)");
              }
            });
        }
      } else {
        setAudioError("Erro ao reproduzir áudio online (CORS/Rede). Recomendamos enviar o arquivo localmente.");
      }
    };

    const handleIronmanError = () => {
      if (iSound.src !== ironmanBackupUrl) {
        console.warn("Local ironman.mp3 not loaded. Falling back to Archive.org URL...");
        iSound.src = ironmanBackupUrl;
        iSound.load();
        // Play if not muted
        const isCurrentMuted = localStorage.getItem('mastercode_muted') === 'true';
        const currentTheme = localStorage.getItem('mastercode_theme') || 'matrix';
        if (!isCurrentMuted && currentTheme === 'ironman') {
          iSound.play()
            .then(() => setAudioError(null))
            .catch(e => {
              console.warn("Ironman Backup Autoplay Restricted:", e);
              if (e.name === 'NotAllowedError') {
                setAudioError("Clique na tela para ativar som (bloqueio de autoplay do navegador)");
              }
            });
        }
      } else {
        setAudioError("Erro ao reproduzir áudio online (CORS/Rede). Recomendamos enviar o arquivo localmente.");
      }
    };

    mSound.addEventListener('error', handleMatrixError);
    iSound.addEventListener('error', handleIronmanError);

    matrixSound.current = mSound;
    ironmanSound.current = iSound;

    // Trigger loads
    mSound.load();
    iSound.load();

    return () => {
      mSound.removeEventListener('error', handleMatrixError);
      iSound.removeEventListener('error', handleIronmanError);
      mSound.pause();
      iSound.pause();
    };
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
      setAudioError(null);
      if (matrixSound.current) {
        matrixSound.current.pause();
        matrixSound.current.currentTime = 0;
      }
      if (ironmanSound.current) {
        ironmanSound.current.pause();
        ironmanSound.current.currentTime = 0;
      }
    } else {
      console.log("Audio Unmuted, starting playback...");
      setAudioError(null);
      
      const playCurrent = () => {
        if (theme === 'matrix' && matrixSound.current) {
          matrixSound.current.volume = 0.4;
          matrixSound.current.play()
            .then(() => setAudioError(null))
            .catch(e => {
              console.error("Matrix Playback Error:", e);
              if (e.name === 'NotAllowedError') {
                setAudioError("Clique na tela primeiro, ou use o botão para ativar o áudio");
              } else {
                setAudioError("Erro ao tocar música. Verifique CORS/Rede.");
              }
            });
        } else if (theme === 'ironman' && ironmanSound.current) {
          ironmanSound.current.volume = 0.4;
          ironmanSound.current.play()
            .then(() => setAudioError(null))
            .catch(e => {
              console.error("Ironman Playback Error:", e);
              if (e.name === 'NotAllowedError') {
                setAudioError("Clique na tela primeiro, ou use o botão para ativar o áudio");
              } else {
                setAudioError("Erro ao tocar música. Verifique CORS/Rede.");
              }
            });
        }
      };

      // Small tick to ensure browser registered user interaction
      const timer = setTimeout(playCurrent, 50);
      return () => clearTimeout(timer);
    }
  }, [isMuted, theme]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'matrix' ? 'ironman' : 'matrix';
    setTheme(newTheme);
    console.log(`Switching to ${newTheme} Protocol...`);
    
    // Stop any playing sounds first
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

    // Play next theme sound
    const playNext = () => {
      if (newTheme === 'ironman' && ironmanSound.current) {
        ironmanSound.current.volume = 0.4;
        ironmanSound.current.play()
          .then(() => setAudioError(null))
          .catch(e => {
            console.error("Ironman Sound Error:", e);
            if (e.name === 'NotAllowedError') {
              setAudioError("Interaja com a tela primeiro para tocar som.");
            }
          });
      } else if (newTheme === 'matrix' && matrixSound.current) {
        matrixSound.current.volume = 0.4;
        matrixSound.current.play()
          .then(() => setAudioError(null))
          .catch(e => {
            console.error("Matrix Sound Error:", e);
            if (e.name === 'NotAllowedError') {
              setAudioError("Interaja com a tela primeiro para tocar som.");
            }
          });
      }
    };

    setTimeout(playNext, 50);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isMuted, toggleMute, audioError }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
