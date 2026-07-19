import React, { useState } from 'react';
import { Product, Category } from '../types';
import { motion } from 'motion/react';
import { Plus, Trash2, LogOut, RefreshCw, Pencil, ArrowUp, ArrowDown } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

interface AdminPanelProps {
  onLogout: () => void;
  products: Product[];
  categories: Category[];
}

export function AdminPanel({ onLogout, products, categories }: AdminPanelProps) {
  const [newCategory, setNewCategory] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    category: categories[1] || '',
    categories: [categories[1] || ''],
    affiliateUrl: '',
    isTrending: false,
  });

  const [message, setMessage] = useState<{type: 'error'|'success', text: string} | null>(null);

  const showMessage = (type: 'error'|'success', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const newCats = [...categories, newCategory.trim()];
      await setDoc(doc(db, 'settings', 'categories'), { list: newCats });
      setNewCategory('');
    }
  };

  const handleDeleteCategory = async (cat: string) => {
    if (cat !== 'Alle') {
      const newCats = categories.filter(c => c !== cat);
      await setDoc(doc(db, 'settings', 'categories'), { list: newCats });
    }
  };

  const handleMoveCategory = async (cat: string, direction: 'up' | 'down') => {
    const index = categories.indexOf(cat);
    if (index === -1 || cat === 'Alle') return;

    if (direction === 'up' && index <= 1) return;
    if (direction === 'down' && index === categories.length - 1) return;

    const newCats = [...categories];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newCats[index], newCats[swapIndex]] = [newCats[swapIndex], newCats[index]];

    await setDoc(doc(db, 'settings', 'categories'), { list: newCats });
  };

  const handleExtract = async () => {
    if (!urlInput.trim()) return;
    
    setIsExtracting(true);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({
          ...prev,
          title: data.title || '',
          imageUrl: data.imageUrl || '',
          price: data.price || 'ab 19,99 €',
          description: data.description || '',
          affiliateUrl: urlInput
        }));
      } else {
        showMessage('error', 'Fehler beim Extrahieren der Daten. Bitte manuell eingeben.');
        setFormData(prev => ({ ...prev, affiliateUrl: urlInput }));
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Fehler beim Abrufen.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      categories: product.categories?.length ? product.categories : (product.category ? [product.category] : []),
      affiliateUrl: product.affiliateUrl,
      isTrending: product.isTrending,
    });
    setUrlInput(product.affiliateUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productCategories = formData.categories || [];
    if (!formData.title || productCategories.length === 0 || !formData.affiliateUrl) {
      showMessage('error', 'Bitte fülle die Pflichtfelder (Titel, mindestens eine Kategorie, Link) aus.');
      return;
    }

    if (editingId) {
      const updatedProduct = { 
        ...formData, 
        id: editingId,
        category: productCategories[0], // Keep for backward compatibility
      } as Product;
      await setDoc(doc(db, 'products', editingId), updatedProduct);
      showMessage('success', 'Produkt erfolgreich aktualisiert!');
    } else {
      const newId = `p_${Date.now()}`;
      const newProduct: Product = {
        id: newId,
        title: formData.title,
        description: formData.description || '',
        price: formData.price || 'ab 19,99 €',
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1599643478514-4a4e09b52342?auto=format&fit=crop&q=80&w=800',
        category: productCategories[0],
        categories: productCategories,
        affiliateUrl: formData.affiliateUrl,
        isTrending: formData.isTrending,
      };
      await setDoc(doc(db, 'products', newId), newProduct);
      showMessage('success', 'Produkt erfolgreich hinzugefügt!');
    }

    // Reset form
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      imageUrl: '',
      category: categories[1] || '',
      categories: [categories[1] || ''],
      affiliateUrl: '',
      isTrending: false,
    });
    setUrlInput('');
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
    if (editingId === id) {
      setEditingId(null);
      setFormData({ title: '', description: '', price: '', imageUrl: '', category: categories[1] || '', categories: [categories[1] || ''], affiliateUrl: '', isTrending: false });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-32 pb-12 mt-12">
      {message && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-sm font-medium shadow-lg z-50 transition-all ${
          message.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
        }`}>
          {message.text}
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-zinc-900">Admin Panel</h1>
        <button 
          onClick={onLogout}
          className="relative z-50 flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col - Add Product via Link */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingId ? 'Produkt bearbeiten' : 'Neues Affiliate Produkt'}
              </h2>
              {editingId && (
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ title: '', description: '', price: '', imageUrl: '', category: categories[1] || '', categories: [categories[1] || ''], affiliateUrl: '', isTrending: false });
                    setUrlInput('');
                  }}
                  className="text-sm text-zinc-500 hover:text-zinc-900"
                >
                  Abbrechen
                </button>
              )}
            </div>
            
            <div className="mb-6 flex gap-2">
              <input 
                type="url" 
                placeholder="Amazon Link einfügen..." 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-grow px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              <button 
                onClick={handleExtract}
                disabled={isExtracting || !urlInput}
                className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {isExtracting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Daten abrufen'}
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Titel</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Preis Text</label>
                  <input 
                    type="text" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Bild URL</label>
                <input 
                  type="url" 
                  value={formData.imageUrl} 
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Affiliate Link</label>
                <input 
                  type="url" 
                  value={formData.affiliateUrl} 
                  onChange={e => setFormData({...formData, affiliateUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Kategorien</label>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(c => c !== 'Alle').map(cat => (
                    <label key={cat} className="flex items-center gap-2 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg cursor-pointer hover:bg-zinc-100 transition-colors text-sm">
                      <input 
                        type="checkbox"
                        checked={(formData.categories || []).includes(cat)}
                        onChange={(e) => {
                          const currentCats = formData.categories || [];
                          if (e.target.checked) {
                            setFormData({...formData, categories: [...currentCats, cat]});
                          } else {
                            setFormData({...formData, categories: currentCats.filter(c => c !== cat)});
                          }
                        }}
                        className="text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Beschreibung</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg h-24"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="trending"
                  checked={formData.isTrending} 
                  onChange={e => setFormData({...formData, isTrending: e.target.checked})}
                  className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900"
                />
                <label htmlFor="trending" className="text-sm font-medium text-zinc-700">Als "Bestseller" markieren</label>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#df9f77] text-zinc-900 py-3 rounded-lg font-semibold hover:bg-[#d49068] transition-colors"
              >
                {editingId ? 'Änderungen speichern' : 'Produkt hinzufügen'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Col - Categories & Stats */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
            <h2 className="text-xl font-bold mb-4">Kategorien Verwalten</h2>
            
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Neue Kategorie..." 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                className="flex-grow px-3 py-2 border border-zinc-300 rounded-lg text-sm"
              />
              <button 
                onClick={handleAddCategory}
                className="bg-zinc-900 text-white p-2 rounded-lg hover:bg-zinc-800"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {categories.filter(c => c !== 'Alle').map((cat, idx) => (
                <li key={cat} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                  <span className="text-sm font-medium">{cat}</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleMoveCategory(cat, 'up')}
                      disabled={idx === 0}
                      className="text-zinc-400 hover:text-zinc-900 p-1 disabled:opacity-30"
                      title="Nach oben verschieben"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleMoveCategory(cat, 'down')}
                      disabled={idx === categories.length - 2}
                      className="text-zinc-400 hover:text-zinc-900 p-1 disabled:opacity-30"
                      title="Nach unten verschieben"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-red-500 hover:text-red-700 p-1 ml-1"
                      title="Löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
            <h2 className="text-xl font-bold mb-4">Alle Produkte ({products.length})</h2>
            <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {products.map(p => (
                <li key={p.id} className="flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100">
                  <img src={p.imageUrl} alt={p.title} className="w-12 h-12 rounded object-cover" />
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium truncate">{p.title}</p>
                    <p className="text-xs text-zinc-500">{(p.categories?.length ? p.categories : [p.category]).filter(Boolean).join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => handleEditProduct(p)}
                      className="text-zinc-400 hover:text-zinc-900 p-2"
                      title="Bearbeiten"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-red-400 hover:text-red-600 p-2"
                      title="Löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
