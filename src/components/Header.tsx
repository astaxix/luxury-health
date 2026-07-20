import { UserCircle, Menu, Search } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';
import { Logo } from './Logo';

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
        isScrolled ? "bg-zinc-950/95 backdrop-blur-md shadow-md border-b border-zinc-900" : "bg-zinc-950/50 backdrop-blur-sm"
      }`}
    >
      {/* Main Header */}
      <header className={`w-full transition-all duration-300 ${isScrolled ? "py-2" : "py-3"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            <div className="flex items-center gap-4">
              <button onClick={onMenuClick} className="p-2 md:p-3 text-zinc-100 hover:text-amber-500 transition-colors">
                <Menu className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </div>

            <div className="flex-1 flex justify-center">
              <a href="#" className="flex items-center gap-2.5 md:gap-4 font-serif text-2xl md:text-3xl font-semibold tracking-wide text-zinc-100 group">
                <Logo className="w-9 h-9 md:w-12 md:h-12" />
                <span>Luxury Health</span>
              </a>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={onSearchClick} className="p-2 md:p-3 text-zinc-100 hover:text-amber-500 transition-colors" title="Suchen">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              {isAdmin ? (
                <button 
                  onClick={onAdminClick}
                  className="flex items-center gap-2 text-sm md:text-base font-medium text-zinc-100 hover:text-amber-500 transition-colors"
                >
                  <UserCircle className="w-6 h-6 md:w-7 md:h-7" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="p-2 md:p-3 text-zinc-100 hover:text-amber-500 transition-colors"
                  title="Admin Login"
                >
                  <UserCircle className="w-6 h-6 md:w-7 md:h-7" />
                </button>
              )}
            </div>
            
          </div>
        </div>
      </header>
    </motion.div>
  );
}
