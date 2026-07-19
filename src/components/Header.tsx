import { UserCircle, Menu, Search } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';

interface HeaderProps {
  onLoginClick: () => void;
  isAdmin: boolean;
  onAdminClick: () => void;
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export function Header({ onLoginClick, isAdmin, onAdminClick, onMenuClick, onSearchClick }: HeaderProps) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // Check if we've scrolled past the top
    const newIsScrolled = latest > 10;
    if (newIsScrolled !== isScrolled) {
      setIsScrolled(newIsScrolled);
    }
    
    if (latest > previous && latest > 150) {
      if (!hidden) setHidden(true);
    } else if (latest < previous) {
      if (hidden) setHidden(false);
    }
  });

  return (
    <motion.div 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-200 ${
        isScrolled ? "bg-zinc-900/95 backdrop-blur-md shadow-md" : "bg-zinc-900 shadow-md"
      }`}
    >
      {/* Main Header */}
      <header className={`w-full transition-all duration-300 ${isScrolled ? "py-2" : "py-3"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            <div className="flex items-center gap-4">
              <button onClick={onMenuClick} className="p-2 text-white hover:opacity-75 transition-opacity">
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex justify-center">
              <a href="#" className="font-serif text-2xl font-semibold tracking-wide text-white">
                Luxury Health
              </a>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={onSearchClick} className="p-2 text-white hover:opacity-75 transition-opacity" title="Suchen">
                <Search className="w-5 h-5" />
              </button>
              {isAdmin ? (
                <button 
                  onClick={onAdminClick}
                  className="flex items-center gap-2 text-sm font-medium text-white hover:opacity-75 transition-colors"
                >
                  <UserCircle className="w-6 h-6" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="p-2 text-white hover:opacity-75 transition-colors"
                  title="Admin Login"
                >
                  <UserCircle className="w-6 h-6" />
                </button>
              )}
            </div>
            
          </div>
        </div>
      </header>
    </motion.div>
  );
}
