import { UserCircle, Menu, Search, LogOut } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';
import { Logo } from './Logo';

interface HeaderProps {
  onLoginClick: () => void;
  isAdmin: boolean;
  onAdminClick: () => void;
  onMenuClick: () => void;
  onSearchClick: () => void;
  user: any;
  userProfile: any;
  onLogout: () => void;
}

export function Header({ 
  onLoginClick, 
  isAdmin, 
  onAdminClick, 
  onMenuClick, 
  onSearchClick,
  user,
  userProfile,
  onLogout
}: HeaderProps) {
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
              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button 
                      onClick={onAdminClick}
                      className="flex items-center gap-1.5 text-xs sm:text-sm font-medium bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-zinc-100 hover:text-amber-500 hover:border-amber-500/50 transition-colors"
                    >
                      Admin
                    </button>
                  )}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs sm:text-sm text-zinc-300">
                    <UserCircle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    <span className="max-w-[80px] sm:max-w-[120px] truncate font-medium">{userProfile?.username || user.displayName || 'User'}</span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 rounded-full transition-colors shrink-0"
                    title="Abmelden"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="p-2 md:p-3 text-zinc-100 hover:text-amber-500 transition-colors"
                  title="Login / Registrieren"
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
