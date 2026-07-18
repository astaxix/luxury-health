import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          <div>
            <span className="font-serif text-2xl font-bold text-white tracking-tight block mb-4">
              Lumina
            </span>
            <p className="text-sm">
              Deine kuratierte Auswahl für angesagten Schmuck und Accessoires. Wir finden die Trends, damit du sie tragen kannst.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Impressum</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Datenschutz</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Affiliate Disclaimer</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Socials</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">TikTok</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pinterest</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="max-w-3xl">
            *Transparenz-Hinweis: Als Amazon-Partner verdiene ich an qualifizierten Verkäufen. 
            Die Links zu den Produkten sind Affiliate-Links. Wenn du über diese Links kaufst, 
            unterstützt du diesen Blog, ohne dass es für dich mehr kostet.
          </p>
          <p className="flex items-center gap-1 shrink-0">
            Made with <Heart className="w-3 h-3 text-red-500" /> by Lumina
          </p>
        </div>
      </div>
    </footer>
  );
}
