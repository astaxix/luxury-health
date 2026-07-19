import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 text-white p-6 rounded-2xl shadow-2xl pointer-events-auto flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-sm text-zinc-300">
              <p className="font-medium text-white mb-1">Wir verwenden Cookies</p>
              <p>
                Wir nutzen Cookies und ähnliche Technologien auf unserer Website. Einige von ihnen sind essenziell, während andere uns helfen, diese Website und Ihre Erfahrung zu verbessern.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={handleDecline}
                className="px-6 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Nur essenzielle
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 rounded-lg text-sm font-medium bg-[#df9f77] hover:bg-[#c98962] text-white transition-colors"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
