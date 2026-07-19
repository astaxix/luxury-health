import { motion } from 'motion/react';
import heroBg from '../assets/images/hero_supplements_1784381748990.jpg';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-900 text-white h-[85vh] min-h-[600px] flex items-center justify-center">
      {/* Background Image with Smooth Scale Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={heroBg} 
          alt="Premium Supplements, Vitamine und Fitness-Produkte von Luxury Health" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-20">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block"
        >
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal tracking-wide mb-6 max-w-5xl leading-tight text-white drop-shadow-2xl">
            Für dich <br className="hidden md:block"/>nur das Beste!
          </h1>
          <div className="absolute -bottom-2 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#df9f77] to-transparent opacity-80"></div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-base md:text-xl text-zinc-200 max-w-3xl mt-8 font-light drop-shadow-md leading-relaxed"
        >
          Entdecke hochwertige Supplements, Vitamine und weitere Fitness-Produkte. Top Empfehlungen zu Amazon Artikeln für deine Gesundheit, Leistung und Fitness an einem Ort.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-12"
        >
          <button 
            onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#df9f77] hover:bg-[#c98962] text-white px-10 py-4 rounded-full text-sm font-medium tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
          >
            PRODUKTE ENTDECKEN
          </button>
        </motion.div>
      </div>
    </section>
  );
}
