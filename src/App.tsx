import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

const INITIAL_CATEGORIES: Category[] = ['Alle', 'Proteinpulver', 'Vitamine', 'Snacks', 'Equipment'];

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('Alle');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<'shop' | 'admin'>('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load from local storage or use initial
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lumina_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('lumina_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('lumina_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lumina_categories', JSON.stringify(categories));
  }, [categories]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'Alle' || product.category === activeCategory;
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
    <div className="min-h-screen flex flex-col">
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
              <div className="flex flex-col items-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl font-normal text-zinc-900 mb-4 text-center tracking-tight">
                  Vorgestellte Produkte
                </h2>
                <p className="text-zinc-500 text-center max-w-2xl hidden">
                  Shop die Looks deiner Lieblings-Creator. Alle Produkte sind handverlesen und direkt auf Amazon verfügbar.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-3 justify-start sm:justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-zinc-900 text-white shadow-md'
                        : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-zinc-500">
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
            setProducts={setProducts}
            categories={categories}
            setCategories={setCategories}
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
    </div>
  );
}
