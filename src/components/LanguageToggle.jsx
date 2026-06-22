import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const current = i18n.language;
  const [flipped, setFlipped] = useState(false);

  const toggle = () => {
    const next = current === 'tr' ? 'en' : 'tr';
    localStorage.setItem('volinor_lang', next);
    i18n.changeLanguage(next);
    setFlipped(f => !f);
  };

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3 py-[7px] bg-[#07080d]/80 border border-[#00c4e8]/20 rounded-lg backdrop-blur-md shadow-[0_0_14px_rgba(0,196,232,0.05)] hover:-translate-y-1 hover:border-[#00c4e8]/50 hover:shadow-[0_0_18px_rgba(0,196,232,0.18)] active:scale-95 transition-all duration-300 ease-in-out font-mono text-xs tracking-[0.2em] select-none">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-[14px] h-[14px] text-[#00c4e8]/70 shrink-0 transition-transform duration-300 ease-in-out ${flipped ? 'rotate-180' : 'rotate-0'}`}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>

      <div className="relative w-6 h-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={current}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.14, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center text-[#00c4e8]">
            {current.toUpperCase()}
          </motion.span>
        </AnimatePresence>
      </div>
    </button>
  );
};
