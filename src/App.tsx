import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { Footer } from './components/Footer';
import { initialProducts } from './data';
import { Category, Product } from './types';
import { LoginModal } from './components/LoginModal';
import { AdminPanel } from './components/AdminPanel';
import { Sidebar } from './components/Sidebar';
import { SearchModal } from './components/SearchModal';
import { CookieBanner } from './components/CookieBanner';
import { db } from './lib/firebase';
import { collection, onSnapshot, doc, setDoc, writeBatch, getDoc } from 'firebase/firestore';
import { Loader } from './components/Loader';

const INITIAL_CATEGORIES: Category[] = ['Alle', 'Proteinpulver', 'Vitamine', 'Snacks', 'Equipment'];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('Alle');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<'shop' | 'admin'>('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load from Firestore
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial data if empty and not seeded before
        const seedDoc = await getDoc(doc(db, 'settings', 'seeded'));
        if (!seedDoc.exists()) {
          const batch = writeBatch(db);
          initialProducts.forEach(product => {
            const ref = doc(collection(db, 'products'), product.id);
            batch.set(ref, product);
          });
          await setDoc(doc(db, 'settings', 'seeded'), { done: true });
          await batch.commit();
        } else {
          setProducts([]);
        }
      } else {
        const productsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
        setProducts(productsData);
      }
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'categories'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().list) {
        setCategories(docSnap.data().list);
      } else {
        setDoc(doc(db, 'settings', 'categories'), { list: INITIAL_CATEGORIES });
      }
    });

    return () => {
      unsubProducts();
      unsubSettings();
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    const productCategories = product.categories?.length ? product.categories : [product.category];
    const matchesCategory = activeCategory === 'Alle' || productCategories.includes(activeCategory);
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLogin = () => {
    setIsAdmin(true);
    setIsLoginOpen(false);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentView('shop');
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-300">
      <Header 
        onLoginClick={() => setIsLoginOpen(true)}
        isAdmin={isAdmin}
        onAdminClick={() => setCurrentView('admin')}
        onMenuClick={() => setIsMenuOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
      />
      
      <main className="flex-grow">
        {currentView === 'shop' ? (
          <>
            <Hero />

            <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="flex flex-col items-center mb-12 md:mb-16">
                <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal text-zinc-100 mb-4 text-center tracking-tight">
                  Vorgestellte Produkte
                </h2>
                <p className="text-zinc-400 text-center max-w-2xl hidden">
                  Shop die Looks deiner Lieblings-Creator. Alle Produkte sind handverlesen und direkt auf Amazon verfügbar.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex overflow-x-auto pb-4 mb-8 md:mb-12 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-3 justify-start sm:justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap px-6 py-2.5 md:px-8 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {searchQuery && (
                <div className="flex justify-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-zinc-900/80 text-zinc-100 px-4 py-2 rounded-full text-sm font-medium border border-zinc-800">
                    <span>Suche: {searchQuery}</span>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="p-1 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Product Grid */}
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-zinc-400">
                    {searchQuery ? `Keine Produkte für "${searchQuery}" gefunden.` : 'Keine Produkte in dieser Kategorie gefunden.'}
                  </p>
                </div>
              )}
            </section>
          </>
        ) : (
          <AdminPanel 
            onLogout={handleLogout}
            products={products}
            categories={categories}
          />
        )}
      </main>

      <Footer />
      
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLogin={handleLogin}
      />

      <Sidebar 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <CookieBanner />

      <AnimatePresence>
        {isLoading && <Loader />}
      </AnimatePresence>
    </div>
  );
}
