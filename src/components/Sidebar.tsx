import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search } from 'lucide-react';
import { Category } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  categories, 
  activeCategory, 
  setActiveCategory,
  searchQuery,
  setSearchQuery
}: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-zinc-950 border-r border-zinc-900 z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5 font-serif text-lg font-semibold text-zinc-100">
                <Logo className="w-8 h-8" />
                <span>Luxury Health</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-amber-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="relative mb-8 flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text"
                  placeholder="Suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onClose();
                      const shop = document.getElementById('shop');
                      if (shop) shop.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full pl-10 pr-10 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-zinc-100 placeholder-zinc-500"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
                    title="Suche löschen"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                Kategorien
              </h3>
              <ul className="space-y-1">
                {categories.map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        setActiveCategory(cat);
                        onClose();
                        // Scroll to shop section
                        const shop = document.getElementById('shop');
                        if (shop) shop.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                        activeCategory === cat 
                          ? 'bg-amber-500 text-zinc-950 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
