import { UserCircle, Menu, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onLoginClick: () => void;
  isAdmin: boolean;
  onAdminClick: () => void;
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export function Header({ onLoginClick, isAdmin, onAdminClick, onMenuClick, onSearchClick }: HeaderProps) {
  return (
    <div className="w-full">
      {/* Announcement Bar */}
      <div className="bg-[#df9f77] text-zinc-900 text-center py-2 text-sm font-medium">
        Kaufe unsere neuesten Artikel
      </div>
      
      {/* Main Header */}
      <header className="absolute top-10 left-0 right-0 z-50 w-full bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-4">
              <button onClick={onMenuClick} className="p-2 text-white hover:opacity-75 transition-opacity">
                <Menu className="w-5 h-5" />
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
                  <UserCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="p-2 text-white hover:opacity-75 transition-colors"
                  title="Admin Login"
                >
                  <UserCircle className="w-5 h-5" />
                </button>
              )}
            </div>
            
          </div>
        </div>
      </header>
    </div>
  );
}
