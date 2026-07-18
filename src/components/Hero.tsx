import { motion } from 'motion/react';
import heroBg from '../assets/images/hero_supplements_1784381748990.jpg';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-900 text-white h-[85vh] min-h-[600px] flex items-center justify-center -mt-[104px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Premium Supplements und Protein Shake" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-20">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative inline-block"
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal tracking-wide mb-6 max-w-4xl leading-tight text-white drop-shadow-lg">
            Gesundheit neu<br />
            erleben
          </h1>
          <div className="absolute -bottom-2 left-[10%] right-[10%] h-[2px] bg-[#df9f77]"></div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-zinc-100 max-w-2xl mt-8 font-light drop-shadow-md"
        >
          Reduziert auf das Wesentliche, gestaltet für<br/>
          Menschen mit Stilbewusstsein.
        </motion.p>
      </div>
    </section>
  );
}
