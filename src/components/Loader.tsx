import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

export function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 text-white select-none overflow-hidden"
    >
      {/* Absolute minimalist background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,159,119,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative flex flex-col items-center px-6 text-center z-10">
        
        {/* Animated Minimalist Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: 1,
            opacity: 1
          }}
          transition={{ 
            duration: 1.2, 
            ease: [0.16, 1, 0.3, 1]
          }}
          className="mb-6 filter drop-shadow-[0_0_8px_rgba(223,159,119,0.15)] md:mb-8 will-change-transform"
        >
          <Logo className="w-[68px] h-[68px] md:w-[96px] md:h-[96px]" />
        </motion.div>

        {/* Elegant Website Name with modern layout-safe animation */}
        <motion.h1 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.2, 
            duration: 1.2, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="font-serif text-2xl md:text-4xl font-medium text-white uppercase tracking-[0.22em] pl-[0.22em] will-change-transform"
        >
          Luxury Health
        </motion.h1>

        {/* Subtitle animation with slow fade */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-[10px] md:text-sm tracking-[0.25em] uppercase text-[#df9f77] mt-2.5 md:mt-4 font-medium pl-[0.25em]"
        >
          Premium Supplements
        </motion.p>

        {/* Ultra-minimalist modern progress bar */}
        <div className="relative w-24 md:w-32 h-[1px] md:h-[2px] bg-zinc-900 rounded-full mt-7 md:mt-10 overflow-hidden transform-gpu">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#df9f77] to-transparent opacity-80"
          />
        </div>
      </div>
    </motion.div>
  );
}
