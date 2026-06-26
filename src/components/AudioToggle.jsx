import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const AudioToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/sound1.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    // Otomatik başlatmayı dener, tarayıcı engellerse butondan başlatılabilir.
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Otomatik oynatma tarayıcı tarafından engellendi (kullanıcı etkileşimi bekleniyor).
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Ses oynatılamadı:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleAudio}
      className="fixed bottom-6 right-[100px] z-50 flex items-center justify-center px-3 py-[7px] bg-[#07080d]/80 border border-[#ffb800]/20 rounded-lg backdrop-blur-md shadow-[0_0_14px_rgba(255,184,0,0.05)] hover:-translate-y-1 hover:border-[#ffb800]/50 hover:shadow-[0_0_18px_rgba(255,184,0,0.18)] active:scale-95 transition-all duration-300 ease-in-out text-[#ffb800]"
      title={isPlaying ? "Sesi Durdur" : "Sesi Oynat"}
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.svg
            key="pause"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[16px] h-[16px]">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </motion.svg>
        ) : (
          <motion.svg
            key="play"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[16px] h-[16px] ml-[2px]">
            <polygon points="5 3 19 12 5 21 5 3" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
};
