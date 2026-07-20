import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchModal({ isOpen, onClose, searchQuery, setSearchQuery }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 bg-zinc-950 border-b border-zinc-900 shadow-xl z-[70] px-4 py-6"
          >
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <Search className="w-6 h-6 text-zinc-500 shrink-0" />
              <input 
                ref={inputRef}
                type="text"
                placeholder="Produkte suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onClose();
                    const shop = document.getElementById('shop');
                    if (shop) shop.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex-grow min-w-0 text-xl md:text-2xl font-serif text-zinc-100 bg-transparent border-none focus:outline-none placeholder-zinc-700"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-amber-500 shrink-0"
                  title="Suche löschen"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
              <button 
                onClick={onClose}
                className="px-3 py-2 sm:px-4 sm:py-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-zinc-100 text-xs sm:text-sm font-medium shrink-0"
              >
                Schließen
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
